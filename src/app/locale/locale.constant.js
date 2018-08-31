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

export default angular.module('blocky.locale', [])
.constant('locales',
    {
        'en_US': {
            "language": {
                "language": "Language",
                "en_US": "English",
                "vi_VN": "Tiếng Việt"
            },
            "home": {
                "profile": "Profile",
                "logout": "Logout",
                "codelab": "Code Lab",
                "arrowDown": "Arrow down",
            },
            "access": {
                "unauthorized": "Unauthorized",
                "unauthorized-access": "Unauthorized Access",
                "unauthorized-access-text": "You should sign in to have access to this resource!",
                "access-forbidden": "Access Forbidden",
                "access-forbidden-text": "You haven't access rights to this location!<br/>Try to sign in with different user if you still wish to gain access to this location.",
                "refresh-token-expired": "Session has expired",
                "refresh-token-failed": "Unable to refresh session"
            },
            "action": {
                "activate": "Activate",
                "suspend": "Suspend",
                "save": "Save",
                "saveAs": "Save as",
                "cancel": "Cancel",
                "ok": "OK",
                "delete": "Delete",
                "add": "Add",
                "yes": "Yes",
                "no": "No",
                "update": "Update",
                "remove": "Remove",
                "search": "Search",
                "assign": "Assign",
                "unassign": "Unassign",
                "share": "Share",
                "unshare": "Unshare",
                "apply": "Apply",
                "apply-changes": "Apply changes",
                "edit-mode": "Edit mode",
                "enter-edit-mode": "Enter edit mode",
                "decline-changes": "Decline changes",
                "close": "Close",
                "back": "Back",
                "sign-in": "Sign in!",
                "edit": "Edit",
                "view": "View",
                "create": "Create",
                "drag": "Drag",
                "refresh": "Refresh",
                "undo": "Undo",
                "copy": "Copy",
                "paste": "Paste",
                "import": "Import",
                "export": "Export",
                "upload": "Upload",
                "open": "Open",
                "rename": "Rename"
            },
            "confirm-on-exit": {
                "message": "You have unsaved changes. Are you sure you want to leave this page?",
                "html-message": "You have unsaved changes.<br/>Are you sure you want to leave this page?",
                "title": "Unsaved changes"
            },
            "common": {
                "username": "Username",
                "password": "Password",
                "enter-username": "Enter username",
                "enter-password": "Enter password",
                "enter-search": "Enter search"
            },
            "dialog": {
                "close": "Close dialog"
            },
            "error": {
                "unable-to-connect": "Unable to connect to the server! Please check your internet connection.",
                "unhandled-error-code": "Unhandled error code: {{errorCode}}",
                "unknown-error": "Unknown error"
            },
            "login": {
                "login": "Login",
                "request-password-reset": "Request Password Reset",
                "forgotten-password": "Forgotten Password",
                "reset-password": "Reset Password",
                "create-password": "Create Password",
                "passwords-mismatch-error": "Entered passwords must be same!",
                "password-again": "Password again",
                "sign-in-title": "Log in to see Blocky in action.",
                "username": "Username (email)",
                "remember-me": "Remember me",
                "forgot-password": "Forgot Password?",
                "password-reset": "Password Reset",
                "new-password": "New password",
                "new-password-again": "New password again",
                "password-link-sent-message": "Password reset link was successfully sent!",
                "email": "Email",
                "do-not-have-account": "Do not have an account?",
                "create-account": "Create an account",
                "sign-up-title": "Create your personal account on the Blocky cloud. It is totally free!",
                "sign-up": "Sign up",
                "first-name": "First name",
                "last-name": "Last name",
                "already-have-account": "Already have an account?"
            },
            "device": {
                "device": "Device",
                "devices": "Devices",
                "open-script-editor": "Open script editor",
                "delete": "Delete device",
                "online": "Online",
                "offline": "Offline",
                "name": "Name",
                "name-required": "Name is required.",
                "description": "Description",
                "delete-device-title": "Are you sure you want to delete the device '{{deviceName}}'?",
                "delete-device-text": "Be careful, after the confirmation the device and all related data will become unrecoverable.",
                "no-boards-text": "No boards found",
                "device-details": "Device details",
                "details": "Details",
            },
            "script": {
                "scripts": "Scripts",
                "delete": "Delete script",
                "name": "Name",
                "name-required": "Name is required.",
                "description": "Description",
                "add": "Add Script",
                "delete-script-title": "Are you sure you want to delete the script '{{scriptName}}'?",
                "delete-script-text": "Be careful, after the confirmation the script and all related data will become unrecoverable.",
                "delete-scripts-title": "Are you sure you want to delete { count, select, 1 {1 script} other {# scripts} }?",
                "delete-scripts-action-title": "Delete { count, select, 1 {1 script} other {# scripts} }",
                "delete-scripts-text": "Be careful, after the confirmation all selected scripts will be removed and all related data will become unrecoverable.",
                "add-script-text": "Add new script",
                "no-scripts-text": "No scripts found",
                "script-details": "Script details",
                
                "select-script": "Select script",
                "script": "Script",
                "new": "New Script",
                "no-scripts-matching": "No scripts matching '{{script}}' were found.",
                "script-required": "Script is required.",
                "script-require-match": "Please select an existing script.",
                "details": "Details",
                "create-new-script": "Create new script",
                "script-load-failed-error": "Failed to load script",
                "script-upload-failed-error": "Failed to upload script to device",
                "script-upload-success": "Script has been uploaded to device",
                "please-save-new-script": "Please save the new script before uploading",
                "please-select-device": "Please select a device",
                "open-toolbar": "Open script editor toolbar",
                "close-toolbar": "Close toolbar",
                "upload-to-device": "Upload to device",
                "open-existing-script": "Open existing script",
                "edit-blockly": "Edit Blockly",
                "edit-python": "Edit Python",
                "script-save-failed-error": "Failed to save script",
                "confirm-convert-title": "Oops, there is a problem converting your code.",
                "confirm-convert-content": "We are unable to convert your Python code back to blocks. You can keep working in Python or discard your changes and go back to the previous Blocks version.",
                "confirm-convert-ok": "Discard and go to Blocks",
                "confirm-convert-cancel": "Stay in Python",
            },
            "project": {
                "delete-project-title": "Are you sure you want to delete the project '{{projectName}}'?",
                "delete-project-text": "Be careful, after the confirmation the project and all related data will become unrecoverable.",
                "share-project-title": "Share Project",
                "share-project-text": "You need to publish your project to share it or embed it in other web pages. You acknowledge having consent to publish this project."
            },
            "profile": {
                "profile": "Profile",
                "change-password": "Change Password",
                "current-password": "Current password"
            }
        }
    }
).name;