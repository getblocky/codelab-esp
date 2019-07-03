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
import * as crypto from 'crypto';
// import * as qrcode from 'qrcode2';
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

function UserMenuController($scope , $rootScope, userService,$interval, $mdDialog, $document, $window, $log, store) {
    
    // var jwtToken = store.get('jwt_token');
    // var aaa = jwtHelper.decodeToken(jwtToken);
    // $log.warn("AAA" , aaa , store , jwtHelper);

    var vm = this;
    $rootScope.login = login;
    vm.logout = logout;
    vm.registerUser = registerUser;
    vm.registerDevice = registerDevice;
    vm.userDisplayName = '';
    vm.userLoaded = false;
    vm.showQRCode = showQRCode;

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

    function showQRCode() {
        // Put this right after$window.Swal
        angular.element("welcome").textContent = "Welcome " + vm._registerEmail;
        // qrcode.makeCode("Blocky Blynk ....");
        $window.Swal.fire({
            title : '',
            text : 'Scan this code to controll this project',
            html : '<div id="welcome" style="z-index: 1; justify-content: center; margin: 0; padding: 0; color: #545454; font-size: 1.125em; font-weight: 300; line-height: normal; word-wrap: break-word;"></div>'+ '<div id="qrcode" style=" width:256px; margin: 0 auto;"></div>',
            onOpen : () => {
                $log.log("CURRENT" , currentUser)
                var url = "https://blynk.getblocky.com:100/qr";
                url += '?type=email';
                url += '&email=' + encodeURIComponent(vm.userDisplayName);
                url += '&password=' + encodeURIComponent(store.get('jwt_token'));
                $log.log('apiqr' , url);
                return $window.fetch(url,{
                    method : "GET"
                })
                .then(response=>response.text())
                .then( function(response){
                    // var qrobj = qrcode("qrcode");
                    // qrobj.makeCode(response);
                    $window.Swal.close()
                    $window.Swal.fire({
                        text : "Scan this with your Blynk App to controll this project",
                        imageUrl : 'http://api.qrserver.com/v1/create-qr-code/?data=' + encodeURIComponent(response) + '&size=400x400'
                    })
                    $log.log( ' INNER ' , $window.Swal.innerHTML , response);
                    // $window.Swal.fire({
                    //     title: 'Account Created!',
                    //     type: 'success',
                    //     html:
        
                    //         '<div id="welcome" style="z-index: 1; justify-content: center; margin: 0; padding: 0; color: #545454; font-size: 1.125em; font-weight: 300; line-height: normal; word-wrap: break-word;"></div>' +
                    //         // '<img src="http://api.qrserver.com/v1/create-qr-code/?data=' + response + '&size=500x500">',
                    //         // '<div id="qrcode" style=" width:256px; margin: 0 auto;"></div>',
                    // })
                    // Put this right after $window.Swal
                    $window.document.getElementById("welcome").textContent = "Welcome ";
        
        
                    
                })
            }
        })

    }

    function registerDevice(){ // really Angular :( u suck
        //var profileAPI = 'https://raw.githubusercontent.com/curlyz/py-exercise/master/dummyProfile2';
        // var tokenAPI = 'https://raw.githubusercontent.com/curlyz/py-exercise/master/dummyToken2.json';
        $window.Swal.queue([
            {  
                // Getting Started Popup
                title : "Hello there, let's setup your device",
                confirmButtonClass: 'btn-danger',
                confirmButtonText: `READY &rarr;`,

            },
            {
                title : "OK, let name your device",
                input : 'text',
                showCancelButton: true,
                confirmButtonClass: 'btn-danger',
                confirmButtonText: 'YES',
                cancelButtonText: "NO",
                showLoaderOnConfirm: true,
                inputValidator : (name) => {
                    vm.deviceName = name ;
                },
                
            },
            {
                type : 'success',
                html:
                    'We have resigetered <strong></strong> with.<br/><br/>' +
                    '<strong></strong>',
                onOpen : () => {
                    var url = "https://blynk.getblocky.com:100/device";
                    url += '?type=email';
                    url += '&email=' + encodeURIComponent(vm.userDisplayName);
                    url += '&password=' + encodeURIComponent(store.get('jwt_token'));
                    url += '&deviceName=' + encodeURIComponent(vm.deviceName);
                    $log.log('apicreatedevice' , url);
                   
                    return $window.fetch(url,{method:"POST"})
                    .then(response => response.json())
                    .then(function(response){
                        $window.Swal.getContent().querySelectorAll('strong')[0].textContent = vm.deviceName;
                        $window.Swal.getContent().querySelectorAll('strong')[1].textContent = response.data.token;
                        vm.deviceToken = response.data.token;
                    })
                }
            },
            {
                title : 'Next, open your wifi setting and connect to "Blocky COLOR ..."',
                showLoaderOnConfirm : true ,
                confirmButtonText: 'I have connected',
                text : "We will wait.",
                preConfirm : () => {
                    return $window.fetch ('http://192.168.4.1/aplist')
                    .then(response => response.json())
                    .then(function(text){
                        $log.log("AP" ,text);
                        vm.listWifi = text;
                        $window.Swal.clickConfirm();
                        return;
                    })
                    .catch((err)=>{
                        $log.log("Error" , err);
                    })
                }
            },
            {
                title : 'Which Wifi are you using ?',
                input : 'select',
                inputOptions : {'abs' : "ABS"},
                onOpen :() => {
                    var optionString = '';
                    for (var i = 0 ; i < vm.listWifi.length ; i ++)
                    {
                        var tempString = '<option value="' + vm.listWifi[i]['ssid'] + '">' + vm.listWifi[i]['ssid']  + '</option>'
                        optionString += tempString ; 
                    }
                    $window.Swal.getContent().querySelector('select').innerHTML  = optionString;
                    $log.log($window.Swal.getContent().querySelector('select'));
                },
                inputValidator : (data) => {
                    vm.selectedWifi = data;
                }

            },
            {
                title : "What is the wifi password ?",
                input : 'password',
                inputValidator : (data) => {
                    vm.wifiPassword = data;
                },
                onClose : () => {
                    return $window.fetch("http://192.168.4.1/save",
                    {
                        method : "POST",
                        body : angular.toJson({
                            ssid : vm.selectedWifi,
                            password : vm.wifiPassword ,
                            token : vm.deviceToken
                        })
                    })
                }
            },
            {
                title : "Connecting to your Controller",
                text : "Please wait...",
                showConfirmButton : false,
                timer : 5000 , 
                onOpen : () => {
                    $window.Swal.showLoading();
                },
                onClose : () => {
                    $window.Swal.fire({
                        type : "success",
                        title : "Your Controller is ready !",
                        text : "It will be online in a moment :)",
                        timer : 10000 ,
                        onOpen : () => {
                            vm.fInterval = $interval(() => {
                                return $window.fetch ("http://192.168.4.1/status")
                                .then(function(){
                                    
                                })
                            },500)
                        }
                    })
                }
            },
        ])
        

    }
    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    // function apiHashPassword(email,password){
        
    //     // var username = email;
    //     // var pwd = password;
    //     // $log.log('ctyotoe here' , Object.keys(SHA256));
    //     // var hUser = SHA256.default('sha256');
    //     // var hPwd = SHA256.default('sha256');
    //     // $log.log(hUser);
    //     // var salt = hUser.update(username.toLowerCase()).digest();
    //     // hPwd.update(pwd, "utf8");
    //     // hPwd.update(salt, "utf8");			
    //     // var finalHash = hPwd.digest('base64');			
    //     // return finalHash
    //     var huser = SHA256.default(email.toLowerCase());
    //     var hpass = SHA256.default(password);
    //     var salt = SHA256.default(huser + email);
    //     var hPwd = SHA256.default(hpass+salt);
    //     $log.log("hash" , hPwd);
    //     return hPwd
    //     3a48c6415ede58ed61df0e8e6c8984df4a3c8e9d7eadfe0020be0299beb7699a
    // }
    function apiHashPassword(email,password){
        var username = email;
        var pwd = password;
        $log.log("method" , crypto,Object.keys(crypto));
        var hUser = crypto.createHash('sha256');
        var hPwd = crypto.createHash('sha256');
        var salt = hUser.update(username.toLowerCase()).digest();
        hPwd.update(pwd, "utf8");
        hPwd.update(salt, "utf8");			
        var finalHash = hPwd.digest('base64');

        $log.log('crypto' ,finalHash);			
        return finalHash
    }
    function registerUser() {
        // $window.Swal.queue([
        //     {
        //         text : "Scan it with Blynk App to control this project",
        //         imageUrl : "http://api.qrserver.com/v1/create-qr-code/?data=blynk%3A%2F%2Ftoken%2Fprojpub%2Fddd54ef3d20f4c4aad667ef100f7c88e%3Fusername%3Dalarm%2540gmail.com%26server%3Dblynk.getblocky.com%26port%3D9443%26dashId%3D1442146651%26dashTitle%3DMy%2520Project%0A&size=400x400"

        //     }
        // ])


        vm._registerEmail = '';
        vm._registerPass = '';
        $window.Swal.queue(
            [{
                    title: 'Creating Account',
                    text: "Fill in your email",
                    input : "text",
                    type: 'info',
                    inputValidator: (input) => {
                        if (validateEmail(input) == true ){
                            vm._registerEmail = input;
                        }
                        else {
                            return "This email is invalid";
                        }
                    },
                    focusConfirm: true,
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Next !',
                },
                {
                    title: 'Type in your password',
                    type: 'info',
                    input: 'password',
                    inputValidator: (input) => {
                        vm._registerPass = input;
                    },
                    focusConfirm: true,
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Create it !',
                },
                {
                    title: 'Loading',
                    text: 'Processing login information....',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    allowEnterKey: false,
                    onBeforeOpen: () => {
                        $window.Swal.showLoading();
                    },
                    onOpen: () => {
                        vm._registerPass = apiHashPassword(vm._registerEmail,vm._registerPass);
                        var base = "https://blynk.getblocky.com:100/account?type=email&email=";
                        var url =  encodeURIComponent(vm._registerEmail) + "&password=" + encodeURIComponent(vm._registerPass);
                        url = base + url;
                        $window.fetch(url, {
                            method: "POST"
                        })
                        .then(response => response.json())
                        .then(function (response) {
                            $log.log("RESPONSE", response)
                            if (response.message == "failed") {
                                if (response.data == "USER_ALREADY_REGISTERED") 
                                {
                                    $window.Swal.fire({
                                        type: "error",
                                        title: "User already registered"
                                    })
                                }
                                else {

                                    
                                    $window.Swal.fire({
                                        type: "error",
                                        title: "Failed to create new account"
                                    })

                                }
                            } else {


                                $window.Swal.fire({
                                    title: 'Account Created!',
                                    type: 'success',
                                    html:

                                        '<div id="welcome" style="z-index: 1; justify-content: center; margin: 0; padding: 0; color: #545454; font-size: 1.125em; font-weight: 300; line-height: normal; word-wrap: break-word;"></div>' + '<div id="qrcode" style=" width:256px; margin: 0 auto;"></div>',
                                })
                            }
                        })
                    }

                }
            ]

        )
}
}
