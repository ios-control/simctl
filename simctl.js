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

module.exports = {
  extensions: SimCtlExtensions,

  check_prerequisites: function () {
    const result = spawnSync('xcrun', ['simctl', 'help'], { stdio: 'ignore', encoding: 'utf8' })

    if (result.status !== 0) {
      result.stdout = 'simctl was not found.\n'
      result.stdout += 'Check that you have Xcode installed:\n'
      result.stdout += '\txcodebuild --version\n'
      result.stdout += 'Check that you have Xcode selected:\n'
      result.stdout += '\txcode-select --print-path\n'
    }

    return result
  },

  simctl_version: function () {
    const res = spawnSync('xcrun', ['simctl', '--version'], { encoding: 'utf8' })
    const versionMatch = /CoreSimulator-(.*)/.exec(res.stdout)
    const versionString = versionMatch[1]

    return versionString.split('.').map((v) => parseInt(v, 10))
  },

  xcode_version: function () {
    const res = spawnSync('xcodebuild', ['-version'], { encoding: 'utf8' })
    const versionMatch = /Xcode (.*)/.exec(res.stdout)
    const versionString = versionMatch[1]

    return versionString.split('.').map((v) => parseInt(v, 10))
  },

  create: function (name, deviceTypeId, runtimeId) {
    return spawnSync('xcrun', ['simctl', 'create', name, deviceTypeId, runtimeId], { encoding: 'utf8' })
  },

  del: function (device) {
    return spawnSync('xcrun', ['simctl', 'delete', device], { encoding: 'utf8' })
  },

  erase: function (device) {
    return spawnSync('xcrun', ['simctl', 'erase', device], { encoding: 'utf8' })
  },

  boot: function (device) {
    return spawnSync('xcrun', ['simctl', 'boot', device], { encoding: 'utf8' })
  },

  shutdown: function (device) {
    return spawnSync('xcrun', ['simctl', 'shutdown', device], { encoding: 'utf8' })
  },

  rename: function (device, name) {
    return spawnSync('xcrun', ['simctl', 'rename', device, name], { encoding: 'utf8' })
  },

  getenv: function (device, variableName) {
    return spawnSync('xcrun', ['simctl', 'getenv', device, variableName], { encoding: 'utf8' })
  },

  openurl: function (device, url) {
    return spawnSync('xcrun', ['simctl', 'openurl', device, url], { encoding: 'utf8' })
  },

  addphoto: function (device, path) {
    return spawnSync('xcrun', ['simctl', 'addphoto', device, path], { encoding: 'utf8' })
  },

  install: function (device, path) {
    return spawnSync('xcrun', ['simctl', 'install', device, path], { encoding: 'utf8' })
  },

  uninstall: function (device, appIdentifier) {
    return spawnSync('xcrun', ['simctl', 'uninstall', device, appIdentifier], { encoding: 'utf8' })
  },

  launch: function (device, appIdentifier, argv = [], options = {}) {
    const args = ['simctl', 'launch']

    if (options.waitForDebugger) {
      args.push('--wait-for-debugger')
    }
    if (options.stderr) {
      args.push(`--stderr=${options.stderr}`)
    }
    if (options.stdout) {
      args.push(`--stderr=${options.stdout}`)
    }
    if (options.arch) {
      args.push(`--arch=${options.arch}`)
    }

    args.push(device)
    args.push(appIdentifier)
    args.push(...argv)

    return spawnSync('xcrun', args, { encoding: 'utf8' })
  },

  spawn: function (device, pathToExecutable, argv = [], options = {}) {
    const args = ['simctl', 'spawn']

    if (options.waitForDebugger) {
      args.push('--wait-for-debugger')
    }
    if (options.arch) {
      args.push(`--arch=${options.arch}`)
    }

    args.push(device)
    args.push(pathToExecutable)
    args.push(...argv)

    return spawnSync('xcrun', args, { encoding: 'utf8' })
  },

  list: function (options) {
    const sublist = []
    options = options || {}

    if (options.devices) {
      sublist.push('devices')
    } else if (options.devicetypes) {
      sublist.push('devicetypes')
    } else if (options.runtimes) {
      sublist.push('runtimes')
    } else if (options.pairs) {
      sublist.push('pairs')
    }

    const result = spawnSync('xcrun', ['simctl', 'list'].concat(sublist, ['--json']), { encoding: 'utf8' })

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
    return spawnSync('xcrun', ['simctl', 'notify_post', device, notificationName], { encoding: 'utf8' })
  },

  icloud_sync: function (device) {
    return spawnSync('xcrun', ['simctl', 'icloud_sync', device], { encoding: 'utf8' })
  },

  help: function (subcommand) {
    if (subcommand) {
      return spawnSync('xcrun', ['simctl', 'help', subcommand], { encoding: 'utf8' })
    } else {
      return spawnSync('xcrun', ['simctl', 'help'], { encoding: 'utf8' })
    }
  },

  pair: function (watchDevice, phoneDevice) {
    return spawnSync('xcrun', ['simctl', 'pair', watchDevice, phoneDevice], { encoding: 'utf8' })
  },

  unpair: function (pairUUID) {
    return spawnSync('xcrun', ['simctl', 'unpair', pairUUID], { encoding: 'utf8' })
  }
}
