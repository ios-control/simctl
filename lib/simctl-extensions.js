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

var shell = require('shelljs'),
    path = require('path'),
    fs = require('fs'),
    util = require('util'),
    Tail = require('tail').Tail;

var extensions = {
    start: function(deviceid) {
        var tool = 'xcodebuild';
        var use_instruments = true;

        var tool_command = shell.which(tool);
        if (!tool_command) {
            console.log(tool + ' was not found, and is required.');
            return;
        }

        var output = shell.exec('xcodebuild -version', { silent: true }).output;
        var versionMatch = /Xcode (.*)/.exec(output);
        if (!versionMatch) {
            console.log(tool + ' version was not found');
            return;
        } else {
            var version = versionMatch[1];
            if (parseInt(version) >= 9) {
                use_instruments = false;
            }
        }

         if (use_instruments) {
            var command = util.format('xcrun instruments -w "%s"', deviceid);
            return shell.exec(command, { silent: true });
         } else {
            shell.exec('killall Simulator', { silent: true });
            var command = util.format('open -a Simulator --args -CurrentDeviceUDID "%s"', deviceid);
            return shell.exec(command, { silent: true });
         }
     },

    log: function(deviceid, filepath) {
        var tail = new Tail(
            path.join(process.env.HOME, 'Library/Logs/CoreSimulator', deviceid, 'system.log')
        );

        tail.on('line', function(data) {
            if (filepath) {
                fs.appendFile(filepath, data + '\n', function(error) {
                    if (error) {
                        console.error('ERROR: ', error);
                        throw error;
                    }
                });
            } else {
                console.log(data);
            }
        });

        tail.on('error', function(error) {
            console.error('ERROR: ', error);
        });

        return tail;
    }
};

exports = module.exports = extensions;
