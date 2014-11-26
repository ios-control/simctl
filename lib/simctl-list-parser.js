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

var ParserMode = {
    'device' : 0,
    'devicetype': 1,
    'runtime': 2
};

var parser = {
    
    result : {
        'devices' : [],
        'devicetypes' : [],
        'runtimes' : []
    },
    
    mode : null, /* ParserMode */
    deviceRuntime : null,
    
    parse : function (text) {
        parser.__clearResult();
        
        text.split(/\r?\n/).forEach(function(line){
            parser.__parseLine(line);
         });
         parser.__changeMode();
         
         return parser.result;
    },
    
    __clearResult : function() {
        parser.result = {
            'devices' : [],
            'devicetypes' : [],
            'runtimes' : []
        };
    },
    
    __changeMode: function(line) {

        switch (parser.mode) {
            case ParserMode.device:
                parser.__endParseDevice();
                break;
            case ParserMode.devicetype:
                parser.__endParseDeviceType();
                break;
            case ParserMode.runtime:
                parser.__endParseRuntime();
                break;
        }
        
        if (line && line.indexOf('Devices') !== -1) {
            parser.mode = ParserMode.device;
        } else if (line && line.indexOf('Device Types') !== -1) {
            parser.mode = ParserMode.devicetype;
        } else if (line && line.indexOf('Runtimes') !== -1) {
            parser.mode = ParserMode.runtime;
        } else {
            parser.mode = null;
        }
    },
    
    __parseLine: function(line) {
        
        if (line.indexOf('==') === 0) {
            parser.__changeMode(line);
            return;
        }
        
        switch (parser.mode) {
            case ParserMode.device:
                parser.__parseDevice(line);
                break;
            case ParserMode.devicetype:
                parser.__parseDeviceType(line);
                break;
            case ParserMode.runtime:
                parser.__parseRuntime(line);
                break;
        }
    },
    
    __changeDeviceRuntime: function(line) {
        if (parser.deviceRuntime) {
            parser.result.devices.push(parser.deviceRuntime);
        }
        
        var runtime = line;
        var regExp = /--\s(.*)\s--/;
        var matches = regExp.exec(line);
        
        if (matches) {
            runtime = matches[1];
        }

        var obj = {
            'runtime' : runtime,
            'devices' : []
        };
        
        parser.deviceRuntime = obj;
    },
    
    __parseDevice : function(line) {
        if (line.indexOf('--') === 0) {
            parser.__changeDeviceRuntime(line);
            return;
        }
        
        // example: iPhone 4s (3717C817-6AD7-42B8-ACF3-405CB9E96375) (Shutdown) (unavailable)
        // the last capture group might not be there if available
        
        var available = false;
        
        var regExp = /(.*)\(([^)]+)\)\s\(([^)]+)\)\s\(([^)]+)\)/;
        var matches = regExp.exec(line);
        if (!matches) {
            regExp = /(.*)\(([^)]+)\)\s\(([^)]+)\)/;
            matches = regExp.exec(line);
            available = true;
        }
        
        if (matches) {
            var obj = {
                'name' : matches[1].trim(),
                'id' : matches[2].trim(),
                'state' : matches[3].trim(),
                'available' : available
            };
        
            parser.deviceRuntime.devices.push(obj);
        }
    },

    __endParseDevice : function() {
        if (parser.deviceRuntime) {
            parser.result.devices.push(parser.deviceRuntime);
        }
    },

    __parseDeviceType : function(line) {
        // Example: 'iPhone 4s (com.apple.CoreSimulator.SimDeviceType.iPhone-4s)'
        var regExp = /(.*)\(([^)]+)\)/;
        var matches = regExp.exec(line);
        
        if (matches) {
            var obj = {
                'name' : matches[1].trim(),
                'id' : matches[2].trim()
            };
        
            parser.result.devicetypes.push(obj);
        }
    },
    
    __endParseDeviceType : function() {
    },
    
    __parseRuntime : function(line) {
        // Example: iOS 7.0 (7.0 - Unknown) (com.apple.CoreSimulator.SimRuntime.iOS-7-0) (unavailable, runtime path not found)
        // the last capture group might not be there if available
        var available = false;

        var regExp = /(.*)\(([^)]+)\)\s\(([^)]+)\)\s\(([^)]+)\)/;
        var matches = regExp.exec(line);
        if (!matches) {
            regExp = /(.*)\(([^)]+)\)\s\(([^)]+)\)/;
            matches = regExp.exec(line);
            available = true;
        }
        
        if (matches) {
            var obj = {
                'name' : matches[1].trim(),
                'build' : matches[2].trim(),
                'id' : matches[3].trim(),
                'available' : available
            };
        
            parser.result.runtimes.push(obj);
        }
    },
    
    __endParseRuntime : function() {
    },
    
}

exports = module.exports = parser;
