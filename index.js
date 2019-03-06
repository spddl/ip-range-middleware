'use strict'

const checkRange = function (ip, filter) {
  for (let i = 0, len = filter.length; i < len; i++) {
    const filterlen = filter[i].length
    if (filterlen === 1) {
      if (filter[i][0] !== ip[i]) return false
    } else if (filterlen === 2) {
      if (filter[i][0] > ip[i] || filter[i][1] < ip[i]) return false
    } else {
      throw new Error(filter[i] + ' length is wrong')
    }
  }
  return true
}

const checkIPRange = function (ip, filter, option = {}) {
  if (!Array.isArray(filter)) { return false }
  if (!Array.isArray(ip)) {
    ip = ip.split('.').map(part => Number(part))
  }

  if (option.debug) { // this check is not default enabled for performance reasons
    const isNotANumber = ip.find(part => isNaN(part))
    if (isNotANumber) {
      console.warn(`Ip Part ${isNotANumber}`)
    }
  }

  if (Array.isArray(filter[0][0])) {
    for (let i = 0, len = filter.length; i < len; i++) {
      if (checkIPRange(ip, filter[i])) return true
    }
    return false
  } else {
    return checkRange(ip, filter)
  }
}

module.exports = function (filter, option = {}) {
  return function (req, res, next) {
    req._ip = req.ip || req._remoteAddress || (req.connection && req.connection.remoteAddress) || undefined
    if (option.allow && option.allow.indexOf(req._ip) !== -1) {
      next()
      if (option.debug) console.log(`${option.allow[option.allow.indexOf(req._ip)]} Found, pass the gateway`)
    } else {
      if (req._ip.substr(0, 7) === '::ffff:') req._ip = req._ip.substr(7)
      if (checkIPRange(req._ip, filter, option)) {
        next()
        if (option.debug) console.log(`${req._ip} whitelist ip`)
      } else {
        res.sendStatus(403)
        if (option.debug) console.log(`${req._ip} 403`)
      }
    }

  }
}
