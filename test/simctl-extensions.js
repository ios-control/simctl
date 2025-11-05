/*
The MIT License (MIT)

Copyright (c) 2022 Shazron Abdullah.

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

const test = require('node:test')
const childProcess = require('child_process')

const spawnMock = test.mock.method(childProcess, 'spawnSync')

const SimCtlExtensions = require('../lib/simctl-extensions')

test('exports', (t) => {
  t.assert ||= require('node:assert')

  t.assert.equal(typeof SimCtlExtensions.start, 'function')
  t.assert.equal(typeof SimCtlExtensions.log, 'function')
})

test('start', async (ctx) => {
  const testJson = require('./fixture/list.json')
  const deviceId = 'C5227DFA-FE4F-4517-95D1-066C8AE65307' // iPad Air 2 in testJson

  ctx.beforeEach((t) => {
    spawnMock.mock.resetCalls()

    t.mock.method(console, 'error', () => {})
  })

  await ctx.test('xcodebuild not found', (t) => {
    t.assert ||= require('node:assert')

    spawnMock.mock.mockImplementationOnce(() => ({ status: 1 }))

    const retObj = SimCtlExtensions.start()
    t.assert.equal(retObj, undefined)
    t.assert.equal(console.error.mock.calls[0].arguments[0], 'Unable to parse xcodebuild version.')
  })

  await ctx.test('xcode version unparseable', (t) => {
    t.assert ||= require('node:assert')

    spawnMock.mock.mockImplementationOnce(() => ({ status: 0, stdout: 'Ycode version 0.2' }))

    const retObj = SimCtlExtensions.start()
    t.assert.equal(retObj, undefined)
    t.assert.equal(console.error.mock.calls[0].arguments[0], 'Unable to parse xcodebuild version.')
  })

  await ctx.test('could not get device list', (t) => {
    t.assert ||= require('node:assert')

    spawnMock.mock.mockImplementationOnce(() => ({ status: 0, stdout: 'Xcode 13.2.1' }), 0) // xcodebuild -version
    spawnMock.mock.mockImplementationOnce(() => ({ status: 1 }), 1) // xcrun simctl list -j

    const retObj = SimCtlExtensions.start()
    t.assert.equal(retObj, undefined)
    t.assert.equal(console.error.mock.calls[0].arguments[0], 'Could not get device list.')
  })

  await ctx.test('simulator already running', (t) => {
    t.assert ||= require('node:assert')

    spawnMock.mock.mockImplementationOnce(() => ({ status: 0, stdout: 'Xcode 13.2.1' }), 0) // xcodebuild -version
    spawnMock.mock.mockImplementationOnce(() => ({ status: 0, stdout: JSON.stringify(testJson) }), 1) // xcrun simctl list -j

    const retObj = SimCtlExtensions.start('5EFAC0B6-0583-48EA-BDC6-E80FBFF76116')
    t.assert.equal(retObj, undefined)
    t.assert.equal(console.error.mock.calls[0].arguments[0], 'Simulator already running.')
  })

  await ctx.test('could not boot simulator', (t) => {
    t.assert ||= require('node:assert')

    spawnMock.mock.mockImplementationOnce(() => ({ status: 0, stdout: 'Xcode 13.2.1' }), 0) // xcodebuild -version
    spawnMock.mock.mockImplementationOnce(() => ({ status: 0, stdout: JSON.stringify(testJson) }), 1) // xcrun simctl list -j
    spawnMock.mock.mockImplementationOnce(() => ({ status: 1 }), 2) // xcrun simctl boot <deviceid>

    const retObj = SimCtlExtensions.start(deviceId)
    t.assert.equal(retObj, undefined)
    t.assert.equal(console.error.mock.calls[0].arguments[0], `Could not boot simulator ${deviceId}`)
  })

  await ctx.test('could not get Xcode path', (t) => {
    t.assert ||= require('node:assert')

    spawnMock.mock.mockImplementationOnce(() => ({ status: 0, stdout: 'Xcode 13.2.1' }), 0) // xcodebuild -version
    spawnMock.mock.mockImplementationOnce(() => ({ status: 0, stdout: JSON.stringify(testJson) }), 1) // xcrun simctl list -j
    spawnMock.mock.mockImplementationOnce(() => ({ status: 0 }), 2) // xcrun simctl boot <deviceid>
    spawnMock.mock.mockImplementationOnce(() => ({ status: 1 }), 3) // xcode-select -p

    const retObj = SimCtlExtensions.start(deviceId)
    t.assert.equal(retObj, undefined)
    t.assert.equal(console.error.mock.calls[0].arguments[0], 'Failed to get Xcode path')
  })

  await ctx.test('successful start (Xcode >= 9)', (t) => {
    t.assert ||= require('node:assert')

    spawnMock.mock.mockImplementationOnce(() => ({ status: 0, stdout: 'Xcode 13.2.1' }), 0) // xcodebuild -version
    spawnMock.mock.mockImplementationOnce(() => ({ status: 0, stdout: JSON.stringify(testJson) }), 1) // xcrun simctl list -j
    spawnMock.mock.mockImplementationOnce(() => ({ status: 0 }), 2) // xcrun simctl boot <deviceid>
    spawnMock.mock.mockImplementationOnce(() => ({ status: 0, stdout: '/Applications/Xcode.app/Contents/Developer' }), 3) // xcode-select -p
    spawnMock.mock.mockImplementationOnce(() => ({ status: 0 }), 4) // open -a XCODEPATH/Applications/Simulator.app

    const retObj = SimCtlExtensions.start(deviceId)
    t.assert.deepEqual(retObj, { status: 0 })
    t.assert.equal(console.error.mock.calls.length, 0)
  })

  await ctx.test('successful start (Xcode < 9)', (t) => {
    t.assert ||= require('node:assert')

    spawnMock.mock.mockImplementationOnce(() => ({ status: 0, stdout: 'Xcode 8' }), 0)
    spawnMock.mock.mockImplementationOnce(() => ({ status: 0 }), 1)

    const retObj = SimCtlExtensions.start(deviceId)
    t.assert.deepEqual(retObj, { status: 0 })
    t.assert.equal(console.error.mock.calls.length, 0)
  })
})
