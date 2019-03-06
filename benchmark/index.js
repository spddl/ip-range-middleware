'use strict'

const IPRange = require('../index.js')
const os = require('os')
const { Suite } = require('benchmark')

console.log(`cpu: ${os.cpus()[0].model}`)
console.log(`NodeJS version: ${process.version}`)
console.log(`platform: ${os.platform()}`)
console.log()

const suite = new Suite()

const localhost = IPRange([
  [127], [0], [0], [1]
], { allow: ['::1'] })
console.log(`IPRange([
  [127], [0], [0], [1]
], { allow: ['::1'] })`)

suite.add(`ip: 127.0.0.1`, function (deferred) {
  localhost({ ip: '127.0.0.1' }, { sendStatus: function () {} }, function () {
    deferred.resolve()
  })
}, { defer: true })

suite.add(`ip: 127.0.0.2`, function (deferred) {
  localhost({ ip: '127.0.0.2' }, { sendStatus: function (statusCode) {
    deferred.resolve()
  } }, function () {})
}, { defer: true })

suite.add(`ip: 250.0.0.1`, function (deferred) {
  localhost({ ip: '250.0.0.1' }, { sendStatus: function (statusCode) {
    deferred.resolve()
  } }, function () {})
}, { defer: true })

suite.add(`ip: ::1`, function (deferred) {
  localhost({ ip: '::1' }, { sendStatus: function () {} }, function () {
    deferred.resolve()
  })
}, { defer: true })

suite
.on('cycle', function (event) {
  console.log(String(event.target))
})
.run({ async: true })

// cpu: Intel(R) Core(TM) i5-3570K CPU @ 3.40GHz
// NodeJS version: v10.15.0
// platform: win32

// IPRange([
//   [127], [0], [0], [1]
// ], { allow: ['::1'] })
// ip: 127.0.0.1 x 53,621 ops/sec ±13.77% (19 runs sampled)
// ip: 127.0.0.2 x 110,372 ops/sec ±35.26% (20 runs sampled)
// ip: 250.0.0.1 x 64,868 ops/sec ±27.81% (11 runs sampled)
// ip: ::1 x 139,065 ops/sec ±39.67% (13 runs sampled)

// @ https://npm.runkit.com
// cpu: Intel(R) Xeon(R) Platinum 8124M CPU @ 3.00GHz
// NodeJS version: v10.15.2
// platform: linux
// IPRange([
//     [127], [0], [0], [1]
//   ], { allow: ['::1'] })
// ip: 127.0.0.1 x 67,177 ops/sec ±32.86% (21 runs sampled)
// ip: 127.0.0.2 x 99,470 ops/sec ±16.02% (16 runs sampled)
// ip: 250.0.0.1 x 81,918 ops/sec ±26.26% (16 runs sampled)
// ip: ::1 x 94,850 ops/sec ±26.48% (11 runs sampled)
