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
export default function CodeLabController($window , $mdSidenav, toast, scriptService, userService, deviceService, $translate, $mdDialog, $document, $rootScope, $scope, $stateParams, $state, store, $mdBottomSheet, $timeout, settings, $log) {
    var vm = this;
	vm.scriptService = scriptService;
	$window.command = vm;
    vm.isUserLoaded = userService.isAuthenticated();

    vm.currentDevice = null;
    vm.currentLog = '';
    vm.otaTimeout = null;
    vm.splitedScripts = [];
    vm.partTobeUploaded = 0;
    vm.otaInProgress = null;
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
        },
        showPrintMargin: false
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
    vm.blynk = {};

    if (vm.isUserLoaded) {
        loadUserDevices();
    }

    $scope.$watch(() => this.currentDevice, function (newValue, oldValue) {
        if (newValue && !angular.equals(newValue, oldValue)) {
            if (vm.currentDevice.id) {
                store.set('selectedDeviceId', vm.currentDevice.id);
                sendControllerBoard();
            }
            vm.currentLog = store.get('deviceLog_' + vm.currentDevice.id) || '';
        }
    });

    window.addEventListener('resize', onResize, false);
    $scope.$on('$destroy', function () {
        // Save project to local storage
        prepareProjectDataAndSaveToLocal();
        window.removeEventListener('resize', onResize, false);
    });

    angular.element(document).ready(function () {
        $timeout(function () {
            injectBlockly();
        }, 500);
    });

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
    vm.reloadLoadUserDevices = reloadLoadUserDevices;

    var otaRequest = [];
	var internalToken = [
		"[NOTI]", 		// Use to notify codelab  , deprecated
		"[OTA_READY]", 	// Dot is ready for OTA (all previous code has been cancelled)
		"[OTA_ACK]", 	// Dot has received a package and send back its SHA-1
		"[OTA_DONE]", 	// OTA Process is done
		"[DOT_ERROR]",	// Dot send when it catch an error  , also with its exception type
		"[DOT_ONLINE]",	// Dot is online , it will send
		"[REPR]", 		// Micropython REPR return , V127 is REPR enabled !
		"[EXCEPTION]",	// REPR Exception 
		"[REQUEST]",	// Dot requests a file , codelab get the file , chop it and send piece by piece using repr (V127)
		"[HEAP]",		// Dot return Heap available after executing the user code
		];
	
    function initBlynk(deviceId, token) {
        if (angular.isUndefined(vm.blynk['"' + deviceId + '"'])) {
            vm.blynk['"' + deviceId + '"'] = new Blynk.Blynk(token, {
                connector: new Blynk.WsClient(settings.blynk)
            });
        }

        var logPin = new vm.blynk['"' + deviceId + '"'].VirtualPin(settings.blynk.logPin);

        logPin.on('write', function (param) {
            var log = param[0];
			if (isInternalMsg(log))
			{
				handlerInternalMsg(deviceId,log);
			}
			else 
			{
				updateDevicesLogs(deviceId, log);
				
			}
        });

        vm.blynk['"' + deviceId + '"'].on('connect', function () {
            $log.log(deviceId, 'Blynk ready. Sending sync request...');
            vm.blynk['"' + deviceId + '"'].syncAll();
        });
        vm.blynk['"' + deviceId + '"'].on('disconnect', function () {
            $log.log(deviceId, 'Blynk disconnected.');
        });
    }
	
	function isInternalMsg(log)
	{
		for (var i = 0  ; i < internalToken.length ; i++)
		{
			if (log.startsWith(internalToken[i]))
				return true;
		}
		return false;
	}
	function handlerInternalMsg(deviceId, log)
	{
		if ((log.startsWith('[OTA_READY]')||log.startsWith('[OTA_ACK]'))&&vm.otaInProgress)
		{
			$log.log('HANDLER' , otaRequest) ; 
			otaRequest[0] = vm.splitedScripts[vm.partTobeUploaded];
            if (angular.isUndefined(otaRequest[0]) || otaRequest[0].length == 0) return;
            vm.partTobeUploaded = vm.partTobeUploaded + 1;
			var sha1 =  require('sha1');
            //if (vm.partTobeUploaded > vm.splitString.length-1) return ;
            otaRequest[1] = vm.partTobeUploaded.toString() + '/' + (vm.splitedScripts.length).toString();
            if (otaRequest)
				$log.warn(otaRequest[1] , sha1(otaRequest[0]));
                scriptService.sendOTA(vm.currentDevice.token, otaRequest);
				$timeout.cancel(vm.otaTimeout);
				vm.otaTimeout = $timeout(function () {
                toast.showError($translate.instant('script.script-upload-failed-error'));
                vm.otaInProgress = false;
            }, 10000);
		}
		else if (log.startsWith('[OTA_DONE]'))
		{
			if (vm.otaInProgress === null) { // Fix issue getting [OTA_DONE] message when reloading
                return;
            }
            toast.showSuccess($translate.instant('script.script-upload-success'));
            $timeout.cancel(vm.otaTimeout);
            vm.otaInProgress = false;
		}
		else if (log.startsWith('[DOT_ONLINE]'))
		{
			toast.showSuccess('Your device is back online');
		}
		
		else if (log.startsWith('[REQUEST]'))
		{
			const http = new XMLHttpRequest();
			const url = 'https://raw.githubusercontent.com/curlyz/Firmware/master/z.mid';
			http.open('GET' , url);
			http.send()
			http.onreadystatechange=(e)=>{
				sendPackage(http.responseText);
				$log.log("Response" , e);
			}
		}
	}
	function hexdump(buffer, blockSize) {
		blockSize = blockSize || 16;
		var lines = [];
		var hex = "0123456789ABCDEF";
		for (var b = 0; b < buffer.length; b += blockSize) {
			var block = buffer.slice(b, Math.min(b + blockSize, buffer.length));
			var addr = ("0000" + b.toString(16)).slice(-4);
			var codes = block.split('').map(function (ch) {
				var code = ch.charCodeAt(0);
				return " " + hex[(0xF0 & code) >> 4] + hex[0x0F & code];
			}).join("");
			codes += "   ".repeat(blockSize - block.length);
			var chars = block.replace(/[\x00-\x1F\x20]/g, '.');
			chars +=  " ".repeat(blockSize - block.length);
			lines.push(addr + " " + codes + "  " + chars);
		}
    return lines.join("\n");
}
	function sendPackage(pack)
	{
		
		$log.log('Packages' , hexdump(pack , 16));
	}
	
	function updateDevicesLogs(deviceId, log) {
        var deviceLog = store.get('deviceLog_' + deviceId) || '';
        if (deviceLog.length) {
            log = log + '<br>' + deviceLog;
        }
        store.set('deviceLog_' + deviceId, log);
        $timeout(function () {
            vm.currentLog = store.get('deviceLog_' + vm.currentDevice.id) || '';
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
                        loadBlocks(vm.script.xml);
                    }
                },
                function fail() {
                    toast.showError($translate.instant('script.script-load-failed-error'));
                    loadBlocks();
                }
            );
        } else if (vm.localScript) {
            vm.script = vm.localScript;
            if (vm.script.mode === 'block') {
                loadBlocks(vm.script.xml);
            }
        } else {
            loadBlocks();
        }
    }

    function reloadLoadUserDevices() {
        loadUserDevices();
    }

    function loadUserDevices() {
        deviceService.getAllDevices().then(function success(devices) {
            if (devices.length) {
                vm.devices = devices;
				$window.user_devices = devices  ; 
                for (var i = 0; i < vm.devices.length; i++) {
                    initBlynk(vm.devices[i].id, vm.devices[i].token);
                }
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
					$window.user_current_device = vm.currentDevice ; 
                }
            }
        } else {
            vm.currentDevice = vm.devices[0];
			$window.user_current_device = vm.currentDevice ;
            store.set('selectedDeviceId', vm.currentDevice.id);
        }
    }

    

    function clearDeviceLog() {
        if (vm.currentDevice) {
            store.set('deviceLog_' + vm.currentDevice.id, '');
            vm.currentLog = '';
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

            initScriptData();
        }
    }

    function loadBlocks(xmlText) {
        vm.workspace.clear();
        var xml = '';
        if (xmlText) {
            xml = Blockly.Xml.textToDom(vm.script.xml);
        } else {
            xml = document.getElementById('workspaceBlocks');
        }
        Blockly.Xml.domToWorkspace(xml, vm.workspace);

        onResize();
    }

    function onResize() {
        if (vm.script.mode !== 'block' || !vm.workspace) {
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
        Blockly.svgResize(vm.workspace);
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
            prepareProjectDataAndSaveToLocal();
        }
    }

    function restoreBlockMode() {
        vm.script.mode = 'block';
        prepareProjectDataAndSaveToLocal();
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
            prepareProjectDataAndSaveToLocal();
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
            }).then(function () { }, function () { });
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
        }).then(function () { }, function () { });
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
        prepareProjectDataAndSaveToLocal();
        $mdBottomSheet.hide();
        $state.go('home.codelab');
    }

    function updateFirmware() { }

    function uploadScript() {
        prepareProjectDataAndSaveToLocal();
        if (vm.script.python.length === 0) {
            return;
        }
        var maxSize = settings.maxBytesUpload;
        vm.otaInProgress = true;
        var scriptToBeUploaded = vm.script.python;

        vm.otaTimeout = $timeout(function () {
            toast.showError($translate.instant('script.script-upload-failed-error'));
            vm.otaInProgress = false;
        }, 10000);
		
        var hash = md5(scriptToBeUploaded);
        scriptService.sendOTA(vm.currentDevice.token, [hash, "OTA"]);
        vm.partTobeUploaded = 0;
        vm.splitedScripts = splitString(scriptToBeUploaded, maxSize);
    }

    function sendControllerBoard() {
		initBlynk(vm.currentDevice.id, vm.currentDevice.token);
        var message = [];
        message[0] = "core.mainthread.call_soon(core.indicator.pulse(color=(0,0,50)))";
		scriptService.sendCommand(vm.currentDevice.token,message);
        //scriptService.sendSocket(vm.currentDevice.token, message, settings.blynk.controllerPin);
    }

    function splitString(str, size) {
        var out = [];
        var piece = Math.ceil(str.length / size);
        for (var i = 0; i < piece; i++) {
            out.push(str.slice(i * size, (i + 1) * size))

        }
        return out;
    }

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
            }).then(function () { }, function () { });
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
            function () { });
    }

    function shareProject($event) {
        $mdBottomSheet.hide();

        if (angular.isUndefined(vm.script.isPublic) || !vm.script.isPublic) {
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
                function () { });
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
        }).then(function () { }, function () { });
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
        }).then(function () { }).catch(function () { });
    }

    function showDeviceLog() {
        $mdBottomSheet.show({
            templateUrl: bottomSheetDeviceLogTemplate,
            controller: () => this,
            controllerAs: 'vm',
        }).then(function () { }).catch(function () { });
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

    function md5(r) { function n(r, n) { return r << n | r >>> 32 - n } function t(r, n) { var t, o, e, u, a; return e = 2147483648 & r, u = 2147483648 & n, a = (1073741823 & r) + (1073741823 & n), (t = 1073741824 & r) & (o = 1073741824 & n) ? 2147483648 ^ a ^ e ^ u : t | o ? 1073741824 & a ? 3221225472 ^ a ^ e ^ u : 1073741824 ^ a ^ e ^ u : a ^ e ^ u } function o(r, o, e, u, a, f, i) { var C; return t(n(r = t(r, t(t((C = o) & e | ~C & u, a), i)), f), o) } function e(r, o, e, u, a, f, i) { var C; return t(n(r = t(r, t(t(o & (C = u) | e & ~C, a), i)), f), o) } function u(r, o, e, u, a, f, i) { return t(n(r = t(r, t(t(o ^ e ^ u, a), i)), f), o) } function a(r, o, e, u, a, f, i) { return t(n(r = t(r, t(t(e ^ (o | ~u), a), i)), f), o) } function f(r) { var n, t = "", o = ""; for (n = 0; n <= 3; n++)t += (o = "0" + (r >>> 8 * n & 255).toString(16)).substr(o.length - 2, 2); return t } var i, C, c, g, h, d, v, m, S, l = Array(); for (l = function (r) { for (var n, t = r.length, o = t + 8, e = 16 * ((o - o % 64) / 64 + 1), u = Array(e - 1), a = 0, f = 0; f < t;)a = f % 4 * 8, u[n = (f - f % 4) / 4] = u[n] | r.charCodeAt(f) << a, f++; return a = f % 4 * 8, u[n = (f - f % 4) / 4] = u[n] | 128 << a, u[e - 2] = t << 3, u[e - 1] = t >>> 29, u }(r = function (r) { r = r.replace(/\r\n/g, "\n"); for (var n = "", t = 0; t < r.length; t++) { var o = r.charCodeAt(t); o < 128 ? n += String.fromCharCode(o) : o > 127 && o < 2048 ? (n += String.fromCharCode(o >> 6 | 192), n += String.fromCharCode(63 & o | 128)) : (n += String.fromCharCode(o >> 12 | 224), n += String.fromCharCode(o >> 6 & 63 | 128), n += String.fromCharCode(63 & o | 128)) } return n }(r)), d = 1732584193, v = 4023233417, m = 2562383102, S = 271733878, i = 0; i < l.length; i += 16)C = d, c = v, g = m, h = S, v = a(v = a(v = a(v = a(v = u(v = u(v = u(v = u(v = e(v = e(v = e(v = e(v = o(v = o(v = o(v = o(v, m = o(m, S = o(S, d = o(d, v, m, S, l[i + 0], 7, 3614090360), v, m, l[i + 1], 12, 3905402710), d, v, l[i + 2], 17, 606105819), S, d, l[i + 3], 22, 3250441966), m = o(m, S = o(S, d = o(d, v, m, S, l[i + 4], 7, 4118548399), v, m, l[i + 5], 12, 1200080426), d, v, l[i + 6], 17, 2821735955), S, d, l[i + 7], 22, 4249261313), m = o(m, S = o(S, d = o(d, v, m, S, l[i + 8], 7, 1770035416), v, m, l[i + 9], 12, 2336552879), d, v, l[i + 10], 17, 4294925233), S, d, l[i + 11], 22, 2304563134), m = o(m, S = o(S, d = o(d, v, m, S, l[i + 12], 7, 1804603682), v, m, l[i + 13], 12, 4254626195), d, v, l[i + 14], 17, 2792965006), S, d, l[i + 15], 22, 1236535329), m = e(m, S = e(S, d = e(d, v, m, S, l[i + 1], 5, 4129170786), v, m, l[i + 6], 9, 3225465664), d, v, l[i + 11], 14, 643717713), S, d, l[i + 0], 20, 3921069994), m = e(m, S = e(S, d = e(d, v, m, S, l[i + 5], 5, 3593408605), v, m, l[i + 10], 9, 38016083), d, v, l[i + 15], 14, 3634488961), S, d, l[i + 4], 20, 3889429448), m = e(m, S = e(S, d = e(d, v, m, S, l[i + 9], 5, 568446438), v, m, l[i + 14], 9, 3275163606), d, v, l[i + 3], 14, 4107603335), S, d, l[i + 8], 20, 1163531501), m = e(m, S = e(S, d = e(d, v, m, S, l[i + 13], 5, 2850285829), v, m, l[i + 2], 9, 4243563512), d, v, l[i + 7], 14, 1735328473), S, d, l[i + 12], 20, 2368359562), m = u(m, S = u(S, d = u(d, v, m, S, l[i + 5], 4, 4294588738), v, m, l[i + 8], 11, 2272392833), d, v, l[i + 11], 16, 1839030562), S, d, l[i + 14], 23, 4259657740), m = u(m, S = u(S, d = u(d, v, m, S, l[i + 1], 4, 2763975236), v, m, l[i + 4], 11, 1272893353), d, v, l[i + 7], 16, 4139469664), S, d, l[i + 10], 23, 3200236656), m = u(m, S = u(S, d = u(d, v, m, S, l[i + 13], 4, 681279174), v, m, l[i + 0], 11, 3936430074), d, v, l[i + 3], 16, 3572445317), S, d, l[i + 6], 23, 76029189), m = u(m, S = u(S, d = u(d, v, m, S, l[i + 9], 4, 3654602809), v, m, l[i + 12], 11, 3873151461), d, v, l[i + 15], 16, 530742520), S, d, l[i + 2], 23, 3299628645), m = a(m, S = a(S, d = a(d, v, m, S, l[i + 0], 6, 4096336452), v, m, l[i + 7], 10, 1126891415), d, v, l[i + 14], 15, 2878612391), S, d, l[i + 5], 21, 4237533241), m = a(m, S = a(S, d = a(d, v, m, S, l[i + 12], 6, 1700485571), v, m, l[i + 3], 10, 2399980690), d, v, l[i + 10], 15, 4293915773), S, d, l[i + 1], 21, 2240044497), m = a(m, S = a(S, d = a(d, v, m, S, l[i + 8], 6, 1873313359), v, m, l[i + 15], 10, 4264355552), d, v, l[i + 6], 15, 2734768916), S, d, l[i + 13], 21, 1309151649), m = a(m, S = a(S, d = a(d, v, m, S, l[i + 4], 6, 4149444226), v, m, l[i + 11], 10, 3174756917), d, v, l[i + 2], 15, 718787259), S, d, l[i + 9], 21, 3951481745), d = t(d, C), v = t(v, c), m = t(m, g), S = t(S, h); return (f(d) + f(v) + f(m) + f(S)).toLowerCase() }
}