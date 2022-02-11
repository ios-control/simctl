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

const shell = require('shelljs')
const SimCtlExtensions = require('../lib/simctl-extensions')

jest.mock('shelljs', () => ({
  exec: jest.fn()
}))

const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})

beforeEach(() => {
  shell.exec.mockReset()
  consoleError.mockReset()
})

test('exports', () => {
  expect(typeof SimCtlExtensions.start).toEqual('function')
  expect(typeof SimCtlExtensions.log).toEqual('function')
})

describe('start', () => {
  const testJson = require('./fixture/list.json')

  test('xcodebuild not found', () => {
    shell.exec
      .mockReturnValueOnce({ code: 1 })
    const retObj = SimCtlExtensions.start()

    expect(retObj).toEqual(undefined)
    expect(consoleError).toBeCalledWith('Unable to parse xcodebuild version.')
  })

  test('xcode version unparseable', () => {
    shell.exec
      .mockReturnValue({ code: 0, stdout: 'Ycode version 0.2' })
    const retObj = SimCtlExtensions.start()

    expect(retObj).toEqual(undefined)
    expect(consoleError).toBeCalledWith('Unable to parse xcodebuild version.')
  })

  test('could not get device list', () => {
    shell.exec
      .mockReturnValueOnce({ code: 0, stdout: 'Xcode 13.2.1' }) // xcodebuild -version
      .mockReturnValueOnce({ code: 1 }) // xcrun simctl list -j
    const retObj = SimCtlExtensions.start()

    expect(retObj).toEqual(undefined)
    expect(consoleError).toBeCalledWith('Could not get device list.')
  })

  test('simulator already running', () => {
    const deviceId = '5EFAC0B6-0583-48EA-BDC6-E80FBFF76116' // iPad Air in testJson
    shell.exec
      .mockReturnValueOnce({ code: 0, stdout: 'Xcode 13.2.1' }) // xcodebuild -version
      .mockReturnValueOnce({ code: 0, stdout: JSON.stringify(testJson) }) // xcrun simctl list -j
    const retObj = SimCtlExtensions.start(deviceId)

    expect(retObj).toEqual(undefined)
    expect(consoleError).toBeCalledWith('Simulator already running.')
  })

  test('could not boot simulator', () => {
    const deviceId = 'C5227DFA-FE4F-4517-95D1-066C8AE65307' // iPad Air 2 in testJson
    shell.exec
      .mockReturnValueOnce({ code: 0, stdout: 'Xcode 13.2.1' }) // xcodebuild -version
      .mockReturnValueOnce({ code: 0, stdout: JSON.stringify(testJson) }) // xcrun simctl list -j
      .mockReturnValueOnce({ code: 1 }) // xcrun simctl boot <deviceid>
    const retObj = SimCtlExtensions.start(deviceId)

    expect(retObj).toEqual(undefined)
    expect(consoleError).toBeCalledWith(`Could not boot simulator ${deviceId}`)
  })

  test('successful start (Xcode >= 9)', () => {
    const deviceId = 'C5227DFA-FE4F-4517-95D1-066C8AE65307' // iPad Air 2 in testJson
    shell.exec
      .mockReturnValueOnce({ code: 0, stdout: 'Xcode 13.2.1' }) // xcodebuild -version
      .mockReturnValueOnce({ code: 0, stdout: JSON.stringify(testJson) }) // xcrun simctl list -j
      .mockReturnValueOnce({ code: 0 }) // xcrun simctl boot <deviceid>
      .mockReturnValueOnce({ code: 0 }) // open `xcode-select -p`/Applications/Simulator.app
    const retObj = SimCtlExtensions.start(deviceId)

    expect(retObj).toEqual({ code: 0 })
    expect(consoleError).not.toBeCalled()
  })

  test('successful start (Xcode < 9)', () => {
    const deviceId = 'C5227DFA-FE4F-4517-95D1-066C8AE65307' // iPad Air 2 in testJson
    shell.exec
      .mockReturnValueOnce({ code: 0, stdout: 'Xcode 8' }) // xcodebuild -version
      .mockReturnValueOnce({ code: 0 }) // xcrun instruments -w "%s"
    const retObj = SimCtlExtensions.start(deviceId)

    expect(retObj).toEqual({ code: 0 })
    expect(consoleError).not.toBeCalled()
  })
})
