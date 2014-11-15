/*
The MIT License (MIT)

Copyright (c) 2014 Shazron Abdullah.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

exports = module.exports = {
    
    set noxpc(b) {
        this._noxpc = b;
    },
    
    get noxpc() {
        return this._noxpc;
    },
    
    check_prerequisites : function() {
        // TODO:
        return false;
    },
    
    create : function(name, device_type_id, runtime_id) {
        // TODO:
    },
    
    del : function(device) {
        // TODO:
    },
    
    erase : function(device) {
        // TODO:
    },
    
    boot : function(device) {
        // TODO:
    },
    
    shutdown : function(device) {
        // TODO:
    },
    
    rename : function(device, name) {
        // TODO:
    },
    
    getenv : function(device, variable_name) {
        // TODO:
    },
    
    openurl : function(device, url) {
        // TODO:
    },
    
    addphoto : function(device, path) {
        // TODO:
    },
    
    install : function(device, path) {
        // TODO:
    },
    
    uninstall : function(device, app_identifier) {
        // TODO:
    },
    
    launch : function(wait_for_debugger, device, app_identifier, argv) {
        // TODO:
    },
    
    spawn : function(wait_for_debugger, arch, device, path_to_executable, argv) {
        // TODO:
    },
    
    list : function(show_devices, show_device_types, show_runtimes) {
        // TODO:
    },
    
    notify_post : function(device, notification_name) {
        // TODO:
    },
    
    icloud_sync : function(device) {
        // TODO:
    },
    
    help : function(subcommand) {
        // TODO:
    }

};