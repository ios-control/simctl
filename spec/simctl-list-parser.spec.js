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

var SimCtlListParser = require('../lib/simctl-list-parser');

describe('list-parser tests', function() {

    var parser = new SimCtlListParser();
    var header = '== Device Types ==';

    beforeEach(function() {
    });

    afterEach(function() {
    });

    it('test parse iPhones', function() {
        var lines = [
            header,
            'iPhone 4s (com.apple.CoreSimulator.SimDeviceType.iPhone-4s)',            
            'iPhone 5 (com.apple.CoreSimulator.SimDeviceType.iPhone-5)',
            'iPhone 5s (com.apple.CoreSimulator.SimDeviceType.iPhone-5s)',
            'iPhone 6 (com.apple.CoreSimulator.SimDeviceType.iPhone-6)',
            'iPhone 6 Plus (com.apple.CoreSimulator.SimDeviceType.iPhone-6-Plus)',
            'iPhone 6s (com.apple.CoreSimulator.SimDeviceType.iPhone-6s)',
            'iPhone 6s Plus (com.apple.CoreSimulator.SimDeviceType.iPhone-6s-Plus)',
            'iPhone 7 (com.apple.CoreSimulator.SimDeviceType.iPhone-7)',
            'iPhone 7 Plus (com.apple.CoreSimulator.SimDeviceType.iPhone-7-Plus)',
            'iPhone SE (com.apple.CoreSimulator.SimDeviceType.iPhone-SE)'
        ];

        var result = parser.parse(lines.join('\n'));
        expect(result.devicetypes.length).toEqual(10);
        expect(result.devices.length).toEqual(0);
        expect(result.runtimes.length).toEqual(0);

        expect(result.devicetypes[0].name).toEqual('iPhone 4s');
        expect(result.devicetypes[0].id).toEqual('com.apple.CoreSimulator.SimDeviceType.iPhone-4s');
        expect(result.devicetypes[1].name).toEqual('iPhone 5');
        expect(result.devicetypes[1].id).toEqual('com.apple.CoreSimulator.SimDeviceType.iPhone-5');
        expect(result.devicetypes[2].name).toEqual('iPhone 5s');
        expect(result.devicetypes[2].id).toEqual('com.apple.CoreSimulator.SimDeviceType.iPhone-5s');
        expect(result.devicetypes[3].name).toEqual('iPhone 6');
        expect(result.devicetypes[3].id).toEqual('com.apple.CoreSimulator.SimDeviceType.iPhone-6');
        expect(result.devicetypes[4].name).toEqual('iPhone 6 Plus');
        expect(result.devicetypes[4].id).toEqual('com.apple.CoreSimulator.SimDeviceType.iPhone-6-Plus');
        expect(result.devicetypes[5].name).toEqual('iPhone 6s');
        expect(result.devicetypes[5].id).toEqual('com.apple.CoreSimulator.SimDeviceType.iPhone-6s');
        expect(result.devicetypes[6].name).toEqual('iPhone 6s Plus');
        expect(result.devicetypes[6].id).toEqual('com.apple.CoreSimulator.SimDeviceType.iPhone-6s-Plus');
        expect(result.devicetypes[7].name).toEqual('iPhone 7');
        expect(result.devicetypes[7].id).toEqual('com.apple.CoreSimulator.SimDeviceType.iPhone-7');
        expect(result.devicetypes[8].name).toEqual('iPhone 7 Plus');
        expect(result.devicetypes[8].id).toEqual('com.apple.CoreSimulator.SimDeviceType.iPhone-7-Plus');
        expect(result.devicetypes[9].name).toEqual('iPhone SE');
        expect(result.devicetypes[9].id).toEqual('com.apple.CoreSimulator.SimDeviceType.iPhone-SE');
    });

    it('test parse iPads', function() {
        var lines = [
            header,
            'iPad 2 (com.apple.CoreSimulator.SimDeviceType.iPad-2)',
            'iPad Retina (com.apple.CoreSimulator.SimDeviceType.iPad-Retina)',
            'iPad Air (com.apple.CoreSimulator.SimDeviceType.iPad-Air)',
            'iPad Air 2 (com.apple.CoreSimulator.SimDeviceType.iPad-Air-2)',
            'iPad Pro (9.7-inch) (com.apple.CoreSimulator.SimDeviceType.iPad-Pro--9-7-inch-)',
            'iPad Pro (12.9-inch) (com.apple.CoreSimulator.SimDeviceType.iPad-Pro)'
        ];

        var result = parser.parse(lines.join('\n'));
        expect(result.devicetypes.length).toEqual(6);
        expect(result.devices.length).toEqual(0);
        expect(result.runtimes.length).toEqual(0);

        expect(result.devicetypes[0].name).toEqual('iPad 2');
        expect(result.devicetypes[0].id).toEqual('com.apple.CoreSimulator.SimDeviceType.iPad-2');
        expect(result.devicetypes[1].name).toEqual('iPad Retina');
        expect(result.devicetypes[1].id).toEqual('com.apple.CoreSimulator.SimDeviceType.iPad-Retina');
        expect(result.devicetypes[2].name).toEqual('iPad Air');
        expect(result.devicetypes[2].id).toEqual('com.apple.CoreSimulator.SimDeviceType.iPad-Air');
        expect(result.devicetypes[3].name).toEqual('iPad Air 2');
        expect(result.devicetypes[3].id).toEqual('com.apple.CoreSimulator.SimDeviceType.iPad-Air-2');
        expect(result.devicetypes[4].name).toEqual('iPad Pro (9.7-inch)');
        expect(result.devicetypes[4].id).toEqual('com.apple.CoreSimulator.SimDeviceType.iPad-Pro--9-7-inch-');
        expect(result.devicetypes[5].name).toEqual('iPad Pro (12.9-inch)');
        expect(result.devicetypes[5].id).toEqual('com.apple.CoreSimulator.SimDeviceType.iPad-Pro');
    });

    it('test parse Apple Watches', function() {
        var lines = [
            header,
            'Apple Watch - 38mm (com.apple.CoreSimulator.SimDeviceType.Apple-Watch-38mm)',
            'Apple Watch - 42mm (com.apple.CoreSimulator.SimDeviceType.Apple-Watch-42mm)',
            'Apple Watch Series 2 - 38mm (com.apple.CoreSimulator.SimDeviceType.Apple-Watch-Series-2-38mm)',
            'Apple Watch Series 2 - 42mm (com.apple.CoreSimulator.SimDeviceType.Apple-Watch-Series-2-42mm)'
        ];

        var result = parser.parse(lines.join('\n'));
        expect(result.devicetypes.length).toEqual(4);
        expect(result.devices.length).toEqual(0);
        expect(result.runtimes.length).toEqual(0);

        expect(result.devicetypes[0].name).toEqual('Apple Watch - 38mm');
        expect(result.devicetypes[0].id).toEqual('com.apple.CoreSimulator.SimDeviceType.Apple-Watch-38mm');
        expect(result.devicetypes[1].name).toEqual('Apple Watch - 42mm');
        expect(result.devicetypes[1].id).toEqual('com.apple.CoreSimulator.SimDeviceType.Apple-Watch-42mm');
        expect(result.devicetypes[2].name).toEqual('Apple Watch Series 2 - 38mm');
        expect(result.devicetypes[2].id).toEqual('com.apple.CoreSimulator.SimDeviceType.Apple-Watch-Series-2-38mm');
        expect(result.devicetypes[3].name).toEqual('Apple Watch Series 2 - 42mm');
        expect(result.devicetypes[3].id).toEqual('com.apple.CoreSimulator.SimDeviceType.Apple-Watch-Series-2-42mm');
    });

    it('test parse Apple TVs', function() {
        var lines = [
            header,
            'Apple TV 1080p (com.apple.CoreSimulator.SimDeviceType.Apple-TV-1080p)'
        ];

        var result = parser.parse(lines.join('\n'));
        expect(result.devicetypes.length).toEqual(1);
        expect(result.devices.length).toEqual(0);
        expect(result.runtimes.length).toEqual(0);

        expect(result.devicetypes[0].name).toEqual('Apple TV 1080p');
        expect(result.devicetypes[0].id).toEqual('com.apple.CoreSimulator.SimDeviceType.Apple-TV-1080p');
    });
});

describe('list-parser test Runtimes', function() {

    var parser = new SimCtlListParser();

    beforeEach(function() {
    });

    afterEach(function() {
    });

    it('test parse', function() {
        expect(true).toBe(true);
    });
});

describe('list-parser test Devices', function() {

    var parser = new SimCtlListParser();

    beforeEach(function() {
    });

    afterEach(function() {
    });

    it('test parse', function() {
        expect(true).toBe(true);
    });
});

describe('list-parser test Device Pairs', function() {

    var parser = new SimCtlListParser();

    beforeEach(function() {
    });

    afterEach(function() {
    });

    it('test parse', function() {
        expect(true).toBe(true);
    });

});