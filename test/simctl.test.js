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

const simctl = require('../simctl')
const SimCtlExtensions = require('../lib/simctl-extensions')
const shell = require('shelljs')

jest.mock('shelljs', () => ({
  exec: jest.fn()
}))

beforeEach(() => {
  shell.exec.mockReset()
})

test('exports', () => {
  expect(simctl.extensions).toEqual(SimCtlExtensions)
  expect(typeof simctl.check_prerequisites).toEqual('function')
  expect(typeof simctl.create).toEqual('function')
  expect(typeof simctl.del).toEqual('function')
  expect(typeof simctl.erase).toEqual('function')
  expect(typeof simctl.boot).toEqual('function')
  expect(typeof simctl.shutdown).toEqual('function')
  expect(typeof simctl.rename).toEqual('function')
  expect(typeof simctl.getenv).toEqual('function')
  expect(typeof simctl.addphoto).toEqual('function')
  expect(typeof simctl.install).toEqual('function')
  expect(typeof simctl.uninstall).toEqual('function')
  expect(typeof simctl.launch).toEqual('function')
  expect(typeof simctl.spawn).toEqual('function')
  expect(typeof simctl.notify_post).toEqual('function')
  expect(typeof simctl.icloud_sync).toEqual('function')
  expect(typeof simctl.create).toEqual('function')
  expect(typeof simctl.help).toEqual('function')
})

test('noxpc', () => {
  expect(simctl.noxpc).toEqual(undefined)
  simctl.noxpc = true
  expect(simctl.noxpc).toEqual(true)
  expect(simctl._noxpc).toEqual(true)
  delete simctl._noxpc
})

test('check_prerequisites fail', () => {
  shell.exec.mockReturnValue({ code: 1 })

  const retObj = simctl.check_prerequisites()
  expect(retObj.stdout).toBeDefined()
  expect(retObj.stdout).toMatch('simctl was not found.')
})

test('check_prerequisites success', () => {
  shell.exec.mockReturnValue({ code: 0 })

  const retObj = simctl.check_prerequisites()
  expect(retObj.stdout).not.toBeDefined()
})
