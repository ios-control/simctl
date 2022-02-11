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
const path = require('path')
const fs = require('fs')
const util = require('util')
const Tail = require('tail').Tail

const extensions = {
  start: function (deviceid) {
    let isAtLeastXcode9 = false

    let command = 'xcodebuild -version'
    const res = shell.exec(command, { silent: true })

    // parse output for Xcode version
    const versionMatch = /Xcode (.*)/.exec(res.stdout)
    if (res.code !== 0 || !versionMatch) {
      console.error('Unable to parse xcodebuild version.')
      return
    } else {
      isAtLeastXcode9 = (parseInt(versionMatch[1]) >= 9)
    }

    if (isAtLeastXcode9) {
      // Xcode 9 or greater
      command = util.format('xcrun simctl list -j')
      let res = shell.exec(command, { silent: true })
      if (res.code !== 0) {
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
      command = util.format('xcrun simctl boot "%s"', deviceid)
      res = shell.exec(command, { silent: true })

      if (res.code !== 0) {
        console.error(`Could not boot simulator ${deviceid}`)
        return
      }

      command = 'open `xcode-select -p`/Applications/Simulator.app'
      return shell.exec(command, { silent: true })
    } else {
      // Xcode 8 or older
      command = util.format('xcrun instruments -w "%s"', deviceid)
      return shell.exec(command, { silent: true })
    }
  },

  log: function (deviceid, filepath) {
    const tail = new Tail(
      path.join(process.env.HOME, 'Library/Logs/CoreSimulator', deviceid, 'system.log')
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
