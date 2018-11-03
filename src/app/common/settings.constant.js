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
export default angular.module('blocky.settings', [])
    .constant('settings', {
        baseApiUrl: 'https://blynk.getblocky.com:8443/api/v1',
        localApiUrl: 'http://192.168.4.1',
        entryPoints: {
            login: '/login'
        },
        maxBytesUpload: 1000,
        intervalMiliSecondUpload: 1000,
        latestFirmwareVersion: "1.1",
        blynk: {
            addr: 'blynk.getblocky.com',
            port: 9443,
            path: '/websockets',
            otaPin: 'V126',
            logPin: 127
        },
        facebook: {
            clientId: '2045602205749965'
        }
    }).name;