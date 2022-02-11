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
const util = require('util')
const SimCtlExtensions = require('./lib/simctl-extensions')

exports = module.exports = {

  set noxpc (b) {
    this._noxpc = b
  },

  get noxpc () {
    return this._noxpc
  },

  extensions: SimCtlExtensions,

  check_prerequisites: function () {
    const command = util.format('xcrun simctl help')
    const obj = shell.exec(command, {silent: true})

    if (obj.code !== 0) {
      obj.stdout = 'simctl was not found.\n'
      obj.stdout += 'Check that you have Xcode 8.x installed:\n'
      obj.stdout += '\txcodebuild --version\n'
      obj.stdout += 'Check that you have Xcode 8.x selected:\n'
      obj.stdout += '\txcode-select --print-path\n'
    }

    return obj
  },

  create: function (name, deviceTypeId, runtimeId) {
    const command = util.format('xcrun simctl create "%s" "%s" "%s"', name, deviceTypeId, runtimeId)
    return shell.exec(command)
  },

  del: function (device) {
    const command = util.format('xcrun simctl delete "%s"', device)
    return shell.exec(command)
  },

  erase: function (device) {
    const command = util.format('xcrun simctl erase "%s"', device)
    return shell.exec(command)
  },

  boot: function (device) {
    const command = util.format('xcrun simctl boot "%s"', device)
    return shell.exec(command)
  },

  shutdown: function (device) {
    const command = util.format('xcrun simctl shutdown "%s"', device)
    return shell.exec(command)
  },

  rename: function (device, name) {
    const command = util.format('xcrun simctl rename "%s" "%s"', device, name)
    return shell.exec(command)
  },

  getenv: function (device, variableName) {
    const command = util.format('xcrun simctl getenv "%s" "%s"', device, variableName)
    return shell.exec(command)
  },

  openurl: function (device, url) {
    const command = util.format('xcrun simctl openurl "%s" "%s"', device, url)
    return shell.exec(command)
  },

  addphoto: function (device, path) {
    const command = util.format('xcrun simctl addphoto "%s" "%s"', device, path)
    return shell.exec(command)
  },

  install: function (device, path) {
    const command = util.format('xcrun simctl install "%s" "%s"', device, path)
    return shell.exec(command)
  },

  uninstall: function (device, appIdentifier) {
    const command = util.format('xcrun simctl uninstall "%s" "%s"', device, appIdentifier)
    return shell.exec(command)
  },

  launch: function (waitForDebugger, device, appIdentifier, argv) {
    let waitFlag = ''
    if (waitForDebugger) {
      waitFlag = '--wait-for-debugger'
    }

    let argvExpanded = ''
    if (argv.length > 0) {
      argvExpanded = argv.map(function (arg) {
        return '\'' + arg + '\''
      }).join(' ')
    }

    const command = util.format('xcrun simctl launch %s "%s" "%s" %s',
      waitFlag, device, appIdentifier, argvExpanded)
    return shell.exec(command)
  },

  spawn: function (waitForDebugger, arch, device, pathToExecutable, argv) {
    let waitFlag = ''
    if (waitForDebugger) {
      waitFlag = '--wait-for-debugger'
    }

    let archFlag = ''
    if (arch) {
      archFlag = util.format('--arch="%s"', arch)
    }

    let argvExpanded = ''
    if (argv.length > 0) {
      argvExpanded = argv.map(function (arg) {
        return '\'' + arg + '\''
      }).join(' ')
    }

    const command = util.format('xcrun simctl spawn %s %s "%s" "%s" %s',
      waitFlag, archFlag, device, pathToExecutable, argvExpanded)
    return shell.exec(command)
  },

  list: function (options) {
    let sublist = ''
    options = options || {}

    if (options.devices) {
      sublist = 'devices'
    } else if (options.devicetypes) {
      sublist = 'devicetypes'
    } else if (options.runtimes) {
      sublist = 'runtimes'
    } else if (options.pairs) {
      sublist = 'pairs'
    }

    const command = util.format('xcrun simctl list %s --json', sublist)
    const obj = shell.exec(command, { silent: options.silent })

    if (obj.code === 0) {
      try {
        obj.json = JSON.parse(obj.stdout)
      } catch (err) {
        console.error(err.stack)
      }
    }

    return obj
  },

  notify_post: function (device, notificationName) {
    const command = util.format('xcrun simctl notify_post "%s" "%s"', device, notificationName)
    return shell.exec(command)
  },

  icloud_sync: function (device) {
    const command = util.format('xcrun simctl icloud_sync "%s"', device)
    return shell.exec(command)
  },

  help: function (subcommand) {
    const command = util.format('xcrun simctl help "%s"', subcommand)
    return shell.exec(command)
  }
}
