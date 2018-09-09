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
import blockyApiLogin from './login.service';

export default angular.module('blocky.api.user', [blockyApiLogin])
    .factory('userService', UserService)
    .name;

/*@ngInject*/
function UserService($q, $rootScope, store, jwtHelper, $state, $log) {
    var currentUser = null,
        userLoaded = false;

    var service = {
        isAuthenticated: isAuthenticated,
        getCurrentUser: getCurrentUser,
        isUserLoaded: isUserLoaded,
        setUserFromJwtToken: setUserFromJwtToken,
        clearJwtToken: clearJwtToken,
        isJwtTokenValid: isJwtTokenValid,
        validateJwtToken: validateJwtToken,
        updateAuthorizationHeader: updateAuthorizationHeader,
        gotoDefaultPlace: gotoDefaultPlace,
        logout: logout,
        reloadUser: reloadUser
    }

    reloadUser();

    return service;

    function reloadUser() {
        userLoaded = false;
        loadUser().then(function success() {
            notifyUserLoaded();
        }, function fail() {});
    }

    function updateAndValidateToken(token, prefix, notify) {
        var valid = false;
        var tokenData = jwtHelper.decodeToken(token);
        var issuedAt = tokenData.iat;
        var expTime = tokenData.exp;
        if (issuedAt && expTime) {
            var ttl = expTime - issuedAt;
            if (ttl > 0) {
                var clientExpiration = new Date().valueOf() + ttl * 1000;
                store.set(prefix, token);
                store.set(prefix + '_expiration', clientExpiration);
                valid = true;
            }
            $rootScope.$broadcast('authenticated');
        }
        if (!valid && notify) {
            $rootScope.$broadcast('unauthenticated');
        }
    }

    function clearTokenData() {
        store.remove('jwt_token');
        store.remove('jwt_token_expiration');
    }

    function setUserFromJwtToken(jwtToken, notify, doLogout) {
        currentUser = null;
        if (!jwtToken) {
            clearTokenData();
            if (notify) {
                $rootScope.$broadcast('unauthenticated', doLogout);
            }
        } else {
            updateAndValidateToken(jwtToken, 'jwt_token', true);
        }
    }

    function isAuthenticated() {
        return isJwtTokenValid();
    }

    function logout() {
        clearJwtToken(true);
        userLoaded = false;
    }

    function clearJwtToken(doLogout) {
        setUserFromJwtToken(null, true, doLogout);
    }

    function isJwtTokenValid() {
        return isTokenValid('jwt_token');
    }

    function isTokenValid(prefix) {
        var clientExpiration = store.get(prefix + '_expiration');
        return clientExpiration && clientExpiration > new Date().valueOf();
    }

    function validateJwtToken() {
        var deferred = $q.defer();
        if (!isTokenValid('jwt_token')) {
            clearJwtToken(false);
            deferred.reject();
        } else {
            deferred.resolve();
        }
        return deferred.promise;
    }

    function getCurrentUser() {
        return currentUser;
    }

    function isUserLoaded() {
        return userLoaded;
    }

    function loadUser() {

        var deferred = $q.defer();

        function procceedJwtTokenValidate() {
            validateJwtToken().then(function success() {
                var jwtToken = store.get('jwt_token');
                currentUser = jwtHelper.decodeToken(jwtToken);
                $log.log('currentUser', currentUser);
                deferred.resolve();
            }, function fail() {
                deferred.reject();
            });
        }

        if (!currentUser) {
            procceedJwtTokenValidate();
        } else {
            deferred.resolve();
        }
        return deferred.promise;
    }

    function notifyUserLoaded() {
        userLoaded = true;
        $rootScope.$broadcast('userLoaded');
    }

    function updateAuthorizationHeader(headers) {
        var jwtToken = store.get('jwt_token');
        if (jwtToken) {
            headers['Authorization'] = 'JWT ' + jwtToken;
        }
        return jwtToken;
    }

    function gotoDefaultPlace(params) {
        $state.go('home.codelab', params);
    }
}