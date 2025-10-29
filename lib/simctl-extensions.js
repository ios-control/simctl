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

const path = require('path')
const fs = require('fs')
const { spawnSync } = require('child_process')
const { Tail } = require('tail')

const extensions = {
  start: function (deviceid) {
    let isAtLeastXcode9 = false
    const res = spawnSync('xcodebuild', ['-version'])

    // parse output for Xcode version
    const versionMatch = /Xcode (.*)/.exec(res.stdout)
    if (res.status !== 0 || !versionMatch) {
      console.error('Unable to parse xcodebuild version.')
      return
    } else {
      isAtLeastXcode9 = (parseInt(versionMatch[1], 10) >= 9)
    }

    if (isAtLeastXcode9) {
      // Xcode 9 or greater
      let res = spawnSync('xcrun', ['simctl', 'list', '--json'])
      if (res.status !== 0) {
        console.error('Could not get device list.')
        return
      }

      const listOutput = JSON.parse(res.stdout)
      const device = Object.keys(listOutput.devices)
        .reduce(function (acc, key) { return acc.concat(listOutput.devices[key]) }, [])
        .find(function (el) { return el.udid === deviceid })

      if (device.state === 'Booted') {
        // no need to launch the emulator, it is already running
        console.error('Simulator already running.')
        return
      }

      res = spawnSync('xcrun', ['simctl', 'boot', deviceid])
      if (res.status !== 0) {
        console.error(`Could not boot simulator ${deviceid}`)
        return
      }

      res = spawnSync('xcode-select', ['-p'])
      if (res.status !== 0) {
        console.error('Failed to get Xcode path')
        return
      }

      const simulatorPath = path.join(res.stdout, 'Applications', 'Simulator.app')
      return spawnSync('open', ['-a', simulatorPath])
    } else {
      // Xcode 8 or older
      return spawnSync('xcrun', ['instruments', '-w', deviceid])
    }
  },

  log: function (deviceid, filepath) {
    const tail = new Tail(
      path.join(process.env.HOME, 'Library', 'Logs', 'CoreSimulator', deviceid, 'system.log')
    )

    tail.on('line', function (data) {
      if (filepath) {
        fs.appendFile(filepath, data + '\n', function (error) {
          if (error) {
            console.error('ERROR: ', error)
            throw error
          }
        })
      } else {
        console.log(data)
      }
    })

    tail.on('error', function (error) {
      console.error('ERROR: ', error)
    })

    return tail
  }
}

exports = module.exports = extensions
