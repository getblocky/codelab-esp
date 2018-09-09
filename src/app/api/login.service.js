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
export default angular.module('blocky.api.login', [])
    .factory('loginService', LoginService)
    .name;

/*@ngInject*/
function LoginService($http, $q, settings) {

    var service = {
        login: login,
    }

    return service;

    function login(user) {
        var deferred = $q.defer();
        var loginRequest = {
            email: user.name,
            password: user.password
        };
        var url = settings.baseApiUrl + '/user/login';
        $http.post(url, loginRequest).then(function success(response) {
            deferred.resolve(response);
        }, function fail(response) {
            deferred.reject(response);
        });
        return deferred.promise;
    }
}