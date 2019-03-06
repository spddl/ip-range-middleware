'use strict'

const IPRange = require('../index.js')
const assert = require('assert')

describe(`IPRange([
    [127], [0], [0], [1]
  ])`, function () {

  const localhost = IPRange([
    [127], [0], [0], [1]
  ])

  it(`127.0.0.1 => next()`, function (done) {
    localhost({ ip: '127.0.0.1' }, { sendStatus: function () {} }, function () {
      done()
    })
  })
  it(`127.0.0.2 => 403`, function (done) {
    localhost({ ip: '127.0.0.2' }, { sendStatus: function (statusCode) {
      assert.equal(403, statusCode)
      done()
    } }, function () {})
  })
})

describe(`IPRange([
    [127], [0], [0]
  ])`, function () {

  const localhost2 = IPRange([
    [127], [0], [0]
  ])

  it(`127.0.0.1 => next()`, function (done) {
    localhost2({ ip: '127.0.0.1' }, { sendStatus: function () {} }, function () {
      done()
    })
  })
  it(`127.0.0.255 => next()`, function (done) {
    localhost2({ ip: '127.0.0.255' }, { sendStatus: function () {} }, function () {
      done()
    })
  })
})

describe(`IPRange([
    [[127], [0], [0]],
    [[255], [0], [0]]
  ])`, function () {

  const ip1 = IPRange([
    [[127], [0], [0]],
    [[255], [0], [0]]
  ])

  it(`127.0.0.1 => next()`, function (done) {
    ip1({ ip: '127.0.0.1' }, { sendStatus: function () {} }, function () {
      done()
    })
  })
  it(`I250.0.0.255 => 403`, function (done) {
    ip1({ ip: '250.0.0.255' }, { sendStatus: function (statusCode) {
      assert.equal(403, statusCode)
      done()
    } }, function () {})
  })
  it(`255.0.0.255 => next()`, function (done) {
    ip1({ ip: '255.0.0.255' }, { sendStatus: function () {} }, function () {
      done()
    })
  })
})

describe(`IPRange([
    [127], [0], [0, 50]
  ],
  { allow: ['::1'] })`, function () {

  const ip2 = IPRange([
    [127], [0], [0, 50]
  ], { allow: ['::1'] })

  it(`127.0.0.1 => next()`, function (done) {
    ip2({ ip: '127.0.0.1' }, { sendStatus: function () { } }, function () {
      done()
    })
  })
  it(`127.0.15.1 => next()`, function (done) {
    ip2({ ip: '127.0.15.1' }, { sendStatus: function () { } }, function () {
      done()
    })
  })
  it(`127.0.151.1 => 403`, function (done) {
    ip2({ ip: '127.0.151.1' }, { sendStatus: function (statusCode) {
      assert.equal(403, statusCode)
      done()
    } }, function () {})
  })

  it(`::1`, function (done) {
    ip2({ ip: '::1' }, { sendStatus: function () { } }, function () {
      done()
    })
  })
})

describe(`IPRange([
    [[192], [168], [178], [2]],
    [[127], [0], [0], [1]]
  ])`, function () {

  const ip3 = IPRange([
    [[192], [168], [178], [2]],
    [[127], [0], [0], [1]]
  ])

  it(`127.0.0.1 => next()`, function (done) {
    ip3({ ip: '127.0.0.1' }, { sendStatus: function () { } }, function () {
      done()
    })
  })
  it(`192.168.178.2 => next()`, function (done) {
    ip3({ ip: '192.168.178.2' }, { sendStatus: function () { } }, function () {
      done()
    })
  })
  it(`127.0.151.1 => 403`, function (done) {
    ip3({ ip: '127.0.151.1' }, { sendStatus: function (statusCode) {
      assert.equal(403, statusCode)
      done()
    } }, function () {})
  })
  it(`192.168.178.1 => 403`, function (done) {
    ip3({ ip: '192.168.178.1' }, { sendStatus: function (statusCode) {
      assert.equal(403, statusCode)
      done()
    } }, function () {})
  })
})
