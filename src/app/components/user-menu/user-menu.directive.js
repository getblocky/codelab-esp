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

import './user-menu.scss';

/* eslint-disable import/no-unresolved, import/default */

import userMenuTemplate from './user-menu.tpl.html';
import LoginController from './login.controller';
import loginTemplate from './login.tpl.html';

/* eslint-enable import/no-unresolved, import/default */

export default angular.module('blocky.directives.usermenu', [])
    .directive('tbUserMenu', UserMenu)
    .name;

/*@ngInject*/
function UserMenu() {
    return {
        restrict: "E",
        scope: true,
        controller: UserMenuController,
        controllerAs: 'vm',
        templateUrl: userMenuTemplate
    };
}

function UserMenuController($scope, $rootScope, userService, $mdDialog, $document, $window) {

    var vm = this;

    $rootScope.login = login;
    vm.logout = logout;
    vm.userDisplayName = '';
    vm.userLoaded = false;

    var currentUser = userService.getCurrentUser();
    if (currentUser) {
        vm.userDisplayName = currentUser.name;
        vm.userLoaded = true;
    }

    $scope.$on('unauthenticated', function () {
        vm.userLoaded = false;
    });

    function login($event) {
        $mdDialog.show({
            controller: LoginController,
            controllerAs: 'vm',
            templateUrl: loginTemplate,
            parent: angular.element($document[0].body),
            fullscreen: true,
            targetEvent: $event,
            scope: $scope,
            preserveScope: true
        });
    }

    function logout() {
        userService.logout();
        $window.localStorage.clear();
        $window.location.reload();
    }
}