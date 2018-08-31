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

import './ie.support';
import angular from 'angular';
import ngMaterial from 'angular-material';
import ngMdIcons from 'angular-material-icons';
import ngCookies from 'angular-cookies';
import ngSanitize from 'angular-sanitize';
import ngAnimate from 'angular-animate';
import uiRouter from 'angular-ui-router';
import angularJwt from 'angular-jwt';
import mdDataTable from 'angular-material-data-table';
import angularStorage from 'angular-storage';

import blockyLocales from './locale/locale.constant';
import blockyToast from './services/toast/toast';
import blockyHome from './layout';
import blockySettings from './common/settings.constant';
import blockyApiLogin from './api/login.service';
import blockyApiUser from './api/user.service';

import 'angular-translate';
import 'angular-translate-loader-static-files';
import 'angular-translate-storage-local';
import 'angular-translate-storage-cookie';
import 'angular-translate-handler-log';
import 'angular-translate-interpolation-messageformat';
import 'typeface-roboto';
import 'font-awesome/css/font-awesome.min.css';
import 'angular-material/angular-material.min.css';
import 'angular-material-icons/angular-material-icons.css';
import 'angular-hotkeys/build/hotkeys.min.css';
import '../scss/main.scss';
import 'angular-cookie-law/dist/angular-cookie-law.min.js';
import 'ngclipboard';

import AppConfig from './app.config';
import GlobalInterceptor from './global-interceptor.service';
import AppRun from './app.run';

angular.module('blocky', [
        ngMaterial,
        ngMdIcons,
        ngCookies,
        'pascalprecht.translate',
        ngSanitize,
        ngAnimate,
        angularJwt,
        mdDataTable,
        angularStorage,
        blockyLocales,
        blockyToast,
        blockyHome,
        blockySettings,
        blockyApiLogin,
        blockyApiUser,
        uiRouter,
        'angular-cookie-law',
        'ngclipboard'
    ])
    .config(AppConfig)
    .factory('globalInterceptor', GlobalInterceptor)
    .factory('customTranslationHandlerFactory', function () {
        // has to return a function which gets a tranlation ID
        return function () {
            // do something with dep1 and dep2
        };
    })
    .run(AppRun);