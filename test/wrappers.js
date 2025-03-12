const request = require('sync-request-curl')
const config = require('../config.json')

const port = config.port
const url = config.url
const SERVER_URL = `${url}:${port}`

function requestAdd (number) {
  const res = request('GET', SERVER_URL + `/addfunction/${number}`, { qs: {} })
  return { response: (JSON.parse(res.body.toString())), statusCode: res.statusCode }
}

module.exports = requestAdd
