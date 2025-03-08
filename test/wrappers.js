import request from 'sync-request-curl'
import config from '../config.json'

const port = config.port;
const url = config.url;
const SERVER_URL = `${url}:${port}`;

export function requestAdd(number) {
  const res = request('GET', SERVER_URL + `/addfunction/${number}`, { qs: {} });
  return { response: (JSON.parse(res.body.toString())), statusCode: res.statusCode };
}