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

const simctl = require('../simctl')
const SimCtlExtensions = require('../lib/simctl-extensions')

test('exports', (t) => {
  t.assert ||= require('node:assert')

  t.assert.equal(simctl.extensions, SimCtlExtensions)
  t.assert.equal(typeof simctl.check_prerequisites, 'function')
  t.assert.equal(typeof simctl.create, 'function')
  t.assert.equal(typeof simctl.del, 'function')
  t.assert.equal(typeof simctl.erase, 'function')
  t.assert.equal(typeof simctl.boot, 'function')
  t.assert.equal(typeof simctl.shutdown, 'function')
  t.assert.equal(typeof simctl.rename, 'function')
  t.assert.equal(typeof simctl.getenv, 'function')
  t.assert.equal(typeof simctl.addphoto, 'function')
  t.assert.equal(typeof simctl.install, 'function')
  t.assert.equal(typeof simctl.uninstall, 'function')
  t.assert.equal(typeof simctl.launch, 'function')
  t.assert.equal(typeof simctl.spawn, 'function')
  t.assert.equal(typeof simctl.notify_post, 'function')
  t.assert.equal(typeof simctl.icloud_sync, 'function')
  t.assert.equal(typeof simctl.create, 'function')
  t.assert.equal(typeof simctl.help, 'function')
})

test('check_prerequisites fail', (t) => {
  t.assert ||= require('node:assert')

  spawnMock.mock.mockImplementationOnce(() => {
    return { status: 1 }
  })

  const retObj = simctl.check_prerequisites()
  t.assert.ok(retObj.stdout)
  t.assert.match(retObj.stdout, /simctl was not found./)
})

test('check_prerequisites success', (t) => {
  t.assert ||= require('node:assert')

  spawnMock.mock.mockImplementationOnce(() => {
    return { status: 0 }
  })

  const retObj = simctl.check_prerequisites()
  t.assert.equal(retObj.stdout, undefined)
})
