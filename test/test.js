'use strict'

const IPRange = require('../index.js')
const assert = require('assert')

describe('#indexOf()', function () {
  const localhost = IPRange([[127], [0], [0], [1]])
  it(`IPRange([[127], [0], [0], [1]]) ip: '127.0.0.1'`, function (done) {
    localhost({ ip: '127.0.0.1' }, { sendStatus: function () {} }, function () {
      done()
    })
  })
  it(`IPRange([[127], [0], [0], [1]]) ip: '127.0.0.2'`, function (done) {
    localhost({ ip: '127.0.0.2' }, { sendStatus: function (statusCode) {
      assert.equal(403, statusCode)
      done()
    } }, function () {})
  })

  const localhost2 = IPRange([[127], [0], [0]])
  it(`IPRange([[127], [0], [0]]) ip: '127.0.0.1'`, function (done) {
    localhost2({ ip: '127.0.0.1' }, { sendStatus: function () {} }, function () {
      done()
    })
  })
  it(`IPRange([[127], [0], [0]]) ip: '127.0.0.255'`, function (done) {
    localhost2({ ip: '127.0.0.255' }, { sendStatus: function () {} }, function () {
      done()
    })
  })

  const ip1 = IPRange([[[127], [0], [0]], [[255], [0], [0]]])
  it(`IPRange([[[127], [0], [0]], [[255], [0], [0]]]) ip: '127.0.0.1'`, function (done) {
    ip1({ ip: '127.0.0.1' }, { sendStatus: function () {} }, function () {
      done()
    })
  })
  it(`IPRange([[[127], [0], [0]], [[255], [0], [0]]]) ip: '250.0.0.255'`, function (done) {
    ip1({ ip: '250.0.0.255' }, { sendStatus: function (statusCode) {
      assert.equal(403, statusCode)
      done()
    } }, function () {})
  })
  it(`IPRange([[[127], [0], [0]], [[255], [0], [0]]]) ip: '255.0.0.255'`, function (done) {
    ip1({ ip: '255.0.0.255' }, { sendStatus: function () {} }, function () {
      done()
    })
  })

  const ip2 = IPRange([[127], [0], [0, 50]], { allow: ['::1'] })
  it(`IPRange([[127], [0], [0, 50]], { allow: ['::1'] }) ip: '127.0.0.1'`, function (done) {
    ip2({ ip: '127.0.0.1' }, { sendStatus: function () { } }, function () {
      done()
    })
  })
  it(`IPRange([[127], [0], [0, 50]], { allow: ['::1'] }) ip: '127.0.15.1'`, function (done) {
    ip2({ ip: '127.0.15.1' }, { sendStatus: function () { } }, function () {
      done()
    })
  })
  it(`IPRange([[127], [0], [0, 50]], { allow: ['::1'] }) ip: '127.0.151.1'`, function (done) {
    ip2({ ip: '127.0.151.1' }, { sendStatus: function (statusCode) {
      assert.equal(403, statusCode)
      done()
    } }, function () {})
  })

  it(`IPRange([[127], [0], [0, 50]], { allow: ['::1'] }) ip: '::1'`, function (done) {
    ip2({ ip: '::1' }, { sendStatus: function () { } }, function () {
      done()
    })
  })

})
