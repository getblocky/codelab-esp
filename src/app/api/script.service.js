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
export default angular.module('blocky.api.script', [])
    .factory('scriptService', ScriptService).name;

/*@ngInject*/
function ScriptService($http, $q, $rootScope, $filter, settings) {

    var allScripts = undefined;

    $rootScope.scriptServiceStateChangeStartHandle = $rootScope.$on('$stateChangeStart', function () {
        invalidateScriptsCache();
    });

    var service = {
        getAllScripts: getAllScripts,
        getScript: getScript,
        deleteScript: deleteScript,
        saveScript: saveScript,
        addScript: addScript,
        sendOTA: sendOTA,
        sendSocket: sendSocket,
        sendCommand: sendCommand
    }

    return service;

    function invalidateScriptsCache() {
        allScripts = undefined;
    }

    function loadScriptsCache() {
        var deferred = $q.defer();

        if (!allScripts) {
            var url = settings.baseApiUrl + '/user/scripts';
            $http.get(url, null).then(function success(response) {
                allScripts = response.data;
                deferred.resolve();
            }, function fail() {
                deferred.reject();
            });
        } else {
            deferred.resolve();
        }
        return deferred.promise;
    }

    function getAllScripts() {
        var deferred = $q.defer();

        loadScriptsCache().then(
            function success() {
                deferred.resolve(allScripts);
            },
            function fail() {
                deferred.reject();
            }
        );
        return deferred.promise;
    }

    function getScript(scriptId) {
        var deferred = $q.defer();
        var url = settings.baseApiUrl + '/script/' + scriptId;
        $http.get(url, null).then(function success(response) {
            deferred.resolve(response.data);
        }, function fail(response) {
            deferred.reject(response.data);
        });
        return deferred.promise;
    }

    function saveScript(script) {
        var deferred = $q.defer();
        var url = settings.baseApiUrl + '/script/' + script._id;
        $http.put(url, script).then(function success(response) {
            invalidateScriptsCache();
            deferred.resolve(response.data);
        }, function fail(response) {
            deferred.reject(response.data);
        });
        return deferred.promise;
    }

    function deleteScript(scriptId) {
        var deferred = $q.defer();
        var url = settings.baseApiUrl + '/script/' + scriptId;
        $http.delete(url).then(function success() {
            invalidateScriptsCache();
            deferred.resolve();
        }, function fail(response) {
            deferred.reject(response.data);
        });
        return deferred.promise;
    }

    function addScript(script) {
        var deferred = $q.defer();
        var url = settings.baseApiUrl + '/script';
        $http.post(url, script).then(function success(response) {
            invalidateScriptsCache();
            deferred.resolve(response.data);
        }, function fail(response) {
            deferred.reject(response.data);
        });
        return deferred.promise;
    }

    function sendOTA(token, dataArray) {
        sendSocket(token, dataArray, settings.blynk.otaPin);
    }
	
	function sendCommand(token, dataArray) {
        sendSocket(token, dataArray, settings.blynk.controllerPin);
    }

    function sendSocket(token, dataArray, pin) {
        var deferred = $q.defer();
        var url = settings.baseApiUrl + '/script/ota';
        var otaRequest = {
            url: 'https://' + settings.blynk.addr + ':' + settings.blynk.port + '/' + token + '/update/' + pin,
            data: dataArray
        }

        $http.post(url, otaRequest).then(function success(response) {
            deferred.resolve(response);
        }, function fail(response) {
            deferred.reject(response);
        });
        return deferred.promise;
    }
}