'use strict'

const checkRange = function (ip, Filter) {
  for (let i = 0, len = Filter.length; i < len; i++) {
    const Filterlen = Filter[i].length
    if (Filterlen === 1) {
      if (Filter[i][0] !== ip[i]) return false
    } else if (Filterlen === 2) {
      if (Filter[i][0] > ip[i] || Filter[i][1] < ip[i]) return false
    } else {
      throw new Error(Filter[i] + ' length is wrong')
    }
  }
  return true
}

const checkIPRange = function (ip, Filter) {
  if (!Array.isArray(Filter)) { return false }
  if (!Array.isArray(ip)) {
    ip = ip.split('.').map(part => Number(part))
  }
  if (Array.isArray(Filter[0][0])) {
    for (let i = 0, len = Filter.length; i < len; i++) {
      if (checkIPRange(ip, Filter[i])) return true
    }
    return false
  } else {
    return checkRange(ip, Filter)
  }
}

module.exports = function (filter, option = {}) {
  return function (req, res, next) {
    req._ip = req.ip || req._remoteAddress || (req.connection && req.connection.remoteAddress) || undefined
    if (option.allow && option.allow.indexOf(req._ip) !== -1) { return next() }
    if (req._ip.substr(0, 7) === '::ffff:') req._ip = req._ip.substr(7)
    if (checkIPRange(req._ip, filter)) {
      next()
    } else {
      res.sendStatus(403)
    }
  }
}
