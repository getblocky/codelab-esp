/*
 * Copyright © 2017 The Blocky Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import 'ace-builds/src-min-noconflict/ace';
import 'ace-builds/src-min-noconflict/mode-python';
import 'ace-builds/src-min-noconflict/ext-language_tools';
import 'ace-builds/src-min-noconflict/snippets/python';
import 'ace-builds/src-min-noconflict/theme-github';
import 'angular-material-data-table/dist/md-data-table.min.css';

/* eslint-disable angular/angularelement */
import OpenProjectController from './open-project.controller';
import openProjectTemplate from './open-project.tpl.html';
import saveProjectMobileTemplate from './save-project-mobile.tpl.html';
import bottomSheetActionsTemplate from './bottom-sheet-actions.tpl.html';
import bottomSheetDeviceLogTemplate from './bottom-sheet-device-log.tpl.html';
import blocklyToolbox from './blockly-toolbox.tpl.html';
import blocklyWorkspace from './blockly-workspace.tpl.html';
import showSharedProjectTemplate from './show-shared-project.tpl.html';

/* eslint-disable no-undef, angular/window-service, angular/document-service */

/*@ngInject*/
export default function CodeLabController($mdSidenav, toast, scriptService, userService, deviceService, $translate, $mdDialog, $document, $rootScope, $scope, $stateParams, $state, store, $mdBottomSheet, $timeout, settings, $log) {
    var vm = this;

    vm.isUserLoaded = userService.isAuthenticated();

    vm.currentDevice = null;
    vm.currentLog = '';
    vm.isUploadSuccess = false;
    vm.isEmbed = false;
    vm.pythonEditorOptions = {
        useWrapMode: true,
        showGutter: true,
        theme: 'github',
        mode: 'python',
        require: ['ace/ext/language_tools'],
        advanced: {
            enableSnippets: true,
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true
        }
    };
    vm.script = {
        name: '',
        xml: '',
        python: '',
        mode: 'block'
    };
    vm.isSidenavOpen = true;
    vm.blocklyToolbox = blocklyToolbox;
    vm.blocklyWorkspace = blocklyWorkspace;
    vm.scriptId = $stateParams.scriptId;
    vm.localScript = store.get('script');
    vm.workspace = null;
    vm.homeUrl = window.location.origin;

    initScriptData();
    loadUserDevices();

    $scope.$watch(() => this.currentDevice, function (newValue, oldValue) {
        if (newValue && !angular.equals(newValue, oldValue)) {
            vm.currentLog = store.get('deviceLog_' + vm.currentDevice.id) || '';
            if (vm.currentDevice.id) {
                store.set('selectedDeviceId', vm.currentDevice.id);
                initBlynk(vm.currentDevice.token);
                $log.log('initBlynk');
            }
        }
    });

    window.addEventListener('resize', onResize, false);
    $scope.$on("$destroy", function () {
        // Save project to local storage
        prepareProjectDataAndSaveToLocal();
        window.removeEventListener('resize', onResize, false);
    });

    $timeout(function () {
        injectBlockly();
    }, 100);

    vm.changeMode = changeMode;
    vm.saveProject = saveProject;
    vm.saveProjectMobile = saveProjectMobile;
    vm.newProject = newProject;
    vm.openProject = openProject;
    vm.downloadProject = downloadProject;
    vm.toggleSidenav = toggleSidenav;
    vm.uploadScript = uploadScript;
    vm.updateFirmware = updateFirmware;
    vm.cancel = cancel;
    vm.showBottomSheetActions = showBottomSheetActions;
    vm.renameProject = renameProject;
    vm.deleteProject = deleteProject;
    vm.shareProject = shareProject;
    vm.showDeviceLog = showDeviceLog;
    vm.clearDeviceLog = clearDeviceLog;
    vm.duplicateProject = duplicateProject;

    function initBlynk(auth) {
        var blynk = new Blynk.Blynk(auth, {
            connector: new Blynk.WsClient(settings.blynk)
        });

        var v126 = new blynk.VirtualPin(126);

        v126.on('write', function () {
            $log.log("V126 written");
        });

        blynk.on('connect', function () {
            $log.log("Blynk ready. Sending sync request...");
            blynk.syncAll();
        });

        blynk.on('disconnect', function () {
            $log.log("Blynk disconnected.");
        });
    }

    function initScriptData() {
        if (vm.scriptId) { // Load existing script
            scriptService.getScript(vm.scriptId).then(
                function success(script) {
                    vm.script._id = script._id;
                    vm.script.name = script.name;
                    vm.script.xml = script.xml || '';
                    vm.script.python = script.python || '';
                    vm.script.mode = script.mode || 'block';
                    vm.script.isPublic = script.isPublic || 0;
                    if (vm.script.mode === 'block') {
                        onResize();
                    }
                },
                function fail() {
                    toast.showError($translate.instant('script.script-load-failed-error'));
                }
            );
        } else if (vm.localScript) {
            vm.script = vm.localScript;
        }
    }

    function loadUserDevices() {
        deviceService.getAllDevices().then(function success(devices) {
            if (devices.length) {
                vm.devices = devices;
                loadSelectedDevice();
            }
        });
    }

    function loadSelectedDevice() {
        var selectedDeviceId = store.get('selectedDeviceId');
        if (selectedDeviceId) {
            for (var i = 0; i < vm.devices.length; i++) {
                if (selectedDeviceId === vm.devices[i].id) {
                    vm.currentDevice = vm.devices[i];
                }
            }
        } else {
            vm.currentDevice = vm.devices[0];
            store.set('selectedDeviceId', vm.currentDevice.id);
        }
    }

    function injectBlockly() {
        if (!vm.workspace) {
            var blocklyDiv = document.getElementById('blocklyDiv');
            vm.workspace = Blockly.inject(blocklyDiv, {
                grid: {
                    spacing: 25,
                    length: 3,
                    colour: '#eee',
                    snap: true
                },
                toolbox: document.getElementById('toolbox'),
                zoom: {
                    controls: true,
                    wheel: false
                }
            });

            Blockly.Xml.domToWorkspace(document.getElementById('workspaceBlocks'),
                vm.workspace);

            var blocklyArea = document.getElementById('main-content');
            if (blocklyArea.offsetHeight) {
                onResize();
            } else {
                $timeout(function () {
                    onResize();
                }, 500);
            }
        }
    }

    function onResize() {
        if (vm.script.mode !== 'block') {
            return;
        }
        var blocklyArea = document.getElementById('main-content');
        var blocklyDiv = document.getElementById('blocklyDiv');
        // Compute the absolute coordinates and dimensions of blocklyArea.
        var el = blocklyArea;
        var x = 0;
        var y = 0;
        do {
            el = el.offsetParent;
        } while (el);
        // Position blocklyDiv over blocklyArea.
        blocklyDiv.style.left = x + 'px';
        blocklyDiv.style.top = y + 'px';
        blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
        blocklyDiv.style.height = blocklyArea.offsetHeight + 'px';
        if (vm.workspace) {
            var xml = Blockly.Xml.workspaceToDom(vm.workspace);
            if (vm.script.xml.length > (new XMLSerializer()).serializeToString(xml).length) {
                xml = Blockly.Xml.textToDom(vm.script.xml);
            }
            if (angular.isDefined(Blockly.mainWorkspace)) {
                Blockly.mainWorkspace.clear();
            }
            Blockly.Xml.domToWorkspace(xml, vm.workspace);
            Blockly.svgResize(vm.workspace);
        }
    }

    function changeMode($event) {
        if (vm.script.mode === 'python') {
            if (vm.script.python.replace(/(\r\n|\n|\r)/gm, '') !== store.get('script').python.replace(/(\r\n|\n|\r)/gm, '')) {
                var confirm = $mdDialog.confirm()
                    .title($translate.instant('script.confirm-convert-title'))
                    .htmlContent($translate.instant('script.confirm-convert-content'))
                    .targetEvent($event)
                    .ok($translate.instant('script.confirm-convert-ok'))
                    .cancel($translate.instant('script.confirm-convert-cancel'));
                $mdDialog.show(confirm).then(function () {
                    restoreBlockMode();
                });
            } else {
                restoreBlockMode();
            }
        } else {
            vm.script.mode = 'python';
            vm.workspace.gl = 'some';

            vm.script.python = Blockly.Python.workspaceToCode(vm.workspace);
            store.set('script', vm.script);
        }
    }

    function restoreBlockMode() {
        vm.script.mode = 'block';
        $timeout(function () {
            if (document.getElementById('blocklyDiv').clientHeight === 0) {
                onResize();
            }
        });
        store.set('script', vm.script);
    }

    function saveProject() {
        $mdDialog.hide();
        if (vm.isUserLoaded) {
            prepareProjectDataAndSaveToLocal();
            if (angular.isUndefined(vm.script._id) || vm.script._id.length === 0) { // New project
                addProject();
            } else { // Existing project
                scriptService.saveScript(vm.script);
            }
        } else {
            $rootScope.login();
        }
    }

    function saveProjectMobile() {
        if (!vm.script.name) {
            $mdDialog.show({
                controller: () => this,
                controllerAs: 'vm',
                templateUrl: saveProjectMobileTemplate,
                parent: angular.element($document[0].body),
                fullscreen: true
            }).then(function () {}, function () {});
        } else {
            saveProject();
        }
    }

    function renameProject() {
        $mdBottomSheet.hide();
        $mdDialog.show({
            controller: () => this,
            controllerAs: 'vm',
            templateUrl: saveProjectMobileTemplate,
            parent: angular.element($document[0].body),
            fullscreen: false
        }).then(function () {}, function () {});
    }

    function addProject() {
        scriptService.addScript(vm.script).then(
            function success(script) {
                vm.script._id = script._id;
                $state.go('home.codelab.view', {
                    scriptId: script._id
                });
            },
            function fail() {
                toast.showError($translate.instant('script.script-save-failed-error'));
            }
        );
    }

    function duplicateProject() {
        vm.script.name = vm.script.name + ' (Duplicated)';
        delete vm.script._id;
        vm.script.isPublic = 0;
        store.set('script', vm.script);
        $mdBottomSheet.hide();
        $state.go('home.codelab');
    }

    function updateFirmware() {}

    function uploadScript() {}

    function newProject() {
        $mdBottomSheet.hide();
        store.remove('script');
        vm.script = {
            name: '',
            xml: '',
            python: '',
            mode: 'block'
        };
        if (angular.isDefined(Blockly.mainWorkspace)) {
            Blockly.mainWorkspace.clear();
        }
        Blockly.Xml.domToWorkspace(document.getElementById('workspaceBlocks'),
            vm.workspace);
        $state.go('home.codelab.new');
    }

    function openProject($event) {
        $mdBottomSheet.hide();
        if (vm.isUserLoaded) {
            $mdDialog.show({
                controller: OpenProjectController,
                controllerAs: 'vm',
                templateUrl: openProjectTemplate,
                parent: angular.element($document[0].body),
                fullscreen: true,
                targetEvent: $event
            }).then(function () {}, function () {});
        } else {
            $rootScope.login();
        }
    }

    function deleteProject($event) {
        $mdBottomSheet.hide();
        var confirm = $mdDialog.confirm()
            .targetEvent($event)
            .title($translate.instant('project.delete-project-title', {
                projectName: vm.script.name
            }))
            .htmlContent($translate.instant('project.delete-project-text'))
            .ariaLabel($translate.instant('action.delete'))
            .cancel($translate.instant('action.cancel'))
            .ok($translate.instant('action.delete'));
        $mdDialog.show(confirm).then(function () {
                scriptService.deleteScript(vm.script._id).then(function success() {
                    newProject();
                });
            },
            function () {});
    }

    function shareProject($event) {
        $mdBottomSheet.hide();

        if (angular.isUndefined(vm.script.isPublic) || vm.script.isPublic !== 1) {
            var confirm = $mdDialog.confirm()
                .targetEvent($event)
                .title($translate.instant('project.share-project-title', {
                    projectName: vm.script.name
                }))
                .htmlContent($translate.instant('project.share-project-text'))
                .ariaLabel($translate.instant('action.share'))
                .cancel($translate.instant('action.cancel'))
                .ok($translate.instant('action.share'));
            $mdDialog.show(confirm).then(function () {
                    vm.script.isPublic = 1;
                    prepareProjectDataAndSaveToLocal();
                    scriptService.saveScript(vm.script).then(function success() {
                        shareProject();
                    });
                },
                function () {});
        } else {
            $mdDialog.cancel();
            showSharedProject();
        }

    }

    function showSharedProject() {
        $mdDialog.show({
            controller: () => vm,
            controllerAs: 'vm',
            templateUrl: showSharedProjectTemplate,
            parent: angular.element($document[0].body),
            fullscreen: true
        }).then(function () {}, function () {});
    }

    function toggleSidenav() {
        if ($mdSidenav('right').isLockedOpen()) {
            vm.isSidenavOpen = false;
        } else {
            vm.isSidenavOpen = true;
        }
        $timeout(function () {
            onResize();
        }, 500);
    }

    function cancel() {
        $mdDialog.cancel();
    }

    function showBottomSheetActions() {
        $mdBottomSheet.show({
            templateUrl: bottomSheetActionsTemplate,
            controller: () => this,
            controllerAs: 'vm',
        }).then(function () {}).catch(function () {});
    }

    function showDeviceLog() {
        $mdBottomSheet.show({
            templateUrl: bottomSheetDeviceLogTemplate,
            controller: () => this,
            controllerAs: 'vm',
        }).then(function () {}).catch(function () {});
    }

    function downloadProject() {
        prepareProjectDataAndSaveToLocal();
        exportToPc(vm.script.python, vm.script.name + '.py');
    }

    function exportToPc(data, filename) {
        if (!data) {
            return;
        }

        if (!filename) {
            filename = 'download.py';
        }

        var blob = new Blob([data], {
            type: 'text/plain'
        });

        // FOR IE:
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, filename);
        } else {
            var e = document.createEvent('MouseEvents'),
                a = document.createElement('a');

            a.download = filename;
            a.href = window.URL.createObjectURL(blob);
            a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':');
            e.initEvent('click', true, false, window,
                0, 0, 0, 0, 0, false, false, false, false, 0, null);
            a.dispatchEvent(e);
        }
    }

    function clearDeviceLog() {
        if (vm.currentDevice) {
            store.set('deviceLog_' + vm.currentDevice.id, '');
            vm.currentLog = '';
        }
    }

    function prepareProjectDataAndSaveToLocal() {
        if (vm.workspace) {
            var xml = Blockly.Xml.workspaceToDom(vm.workspace);
            vm.script.xml = Blockly.Xml.domToText(xml);
        }
        if (vm.script.mode === 'block') {
            vm.script.python = Blockly.Python.workspaceToCode(vm.workspace);
        }
        store.set('script', vm.script);
    }
}