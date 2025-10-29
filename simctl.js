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

const { spawnSync } = require('child_process')
const SimCtlExtensions = require('./lib/simctl-extensions')

exports = module.exports = {
  extensions: SimCtlExtensions,

  check_prerequisites: function () {
    const result = spawnSync('xcrun', ['simctl', 'help'], { stdio: 'ignore' })

    if (result.status !== 0) {
      result.stdout = 'simctl was not found.\n'
      result.stdout += 'Check that you have Xcode installed:\n'
      result.stdout += '\txcodebuild --version\n'
      result.stdout += 'Check that you have Xcode selected:\n'
      result.stdout += '\txcode-select --print-path\n'
    }

    return result
  },

  create: function (name, deviceTypeId, runtimeId) {
    return spawnSync('xcrun', ['simctl', 'create', name, deviceTypeId, runtimeId])
  },

  del: function (device) {
    return spawnSync('xcrun', ['simctl', 'delete', device])
  },

  erase: function (device) {
    return spawnSync('xcrun', ['simctl', 'erase', device])
  },

  boot: function (device) {
    return spawnSync('xcrun', ['simctl', 'boot', device])
  },

  shutdown: function (device) {
    return spawnSync('xcrun', ['simctl', 'shutdown', device])
  },

  rename: function (device, name) {
    return spawnSync('xcrun', ['simctl', 'rename', device, name])
  },

  getenv: function (device, variableName) {
    return spawnSync('xcrun', ['simctl', 'getenv', device, variableName])
  },

  openurl: function (device, url) {
    return spawnSync('xcrun', ['simctl', 'openurl', device, url])
  },

  addphoto: function (device, path) {
    return spawnSync('xcrun', ['simctl', 'addphoto', device, path])
  },

  install: function (device, path) {
    return spawnSync('xcrun', ['simctl', 'install', device, path])
  },

  uninstall: function (device, appIdentifier) {
    return spawnSync('xcrun', ['simctl', 'uninstall', device, appIdentifier])
  },

  launch: function (waitForDebugger, device, appIdentifier, argv) {
    const args = ['simctl', 'launch']

    if (waitForDebugger) {
      args.push('--wait-for-debugger')
    }

    args.push(device)
    args.push(appIdentifier)

    return spawnSync('xcrun', args.concat(argv))
  },

  spawn: function (waitForDebugger, arch, device, pathToExecutable, argv) {
    const args = ['simctl', 'spawn']

    if (waitForDebugger) {
      args.push('--wait-for-debugger')
    }

    if (arch) {
      args.push(`--arch="${arch}"`)
    }

    args.push(device)
    args.push(pathToExecutable)

    return spawnSync('xcrun', args.concat(argv))
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

    const result = spawnSync('xcrun', ['simctl', 'list', sublist, '--json'])

    if (result.status === 0) {
      try {
        result.json = JSON.parse(result.stdout)
      } catch (err) {
        console.error(err.stack)
      }
    }

    return result
  },

  notify_post: function (device, notificationName) {
    return spawnSync('xcrun', ['simctl', 'notify_post', device, notificationName])
  },

  icloud_sync: function (device) {
    return spawnSync('xcrun', ['simctl', 'icloud_sync', device])
  },

  help: function (subcommand) {
    if (subcommand) {
      return spawnSync('xcrun', ['simctl', 'help', subcommand])
    } else {
      return spawnSync('xcrun', ['simctl', 'help'])
    }
  }
}
