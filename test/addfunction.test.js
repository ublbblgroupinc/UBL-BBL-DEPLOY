const add = require('../src/addfunction')
const requestAdd = require('./wrappers')

test('check add function works properly', () => {
  const res = requestAdd(1)
  expect(res.response).toBe(2)
})

test('adds -1 + 1 to equal 0', () => {
  expect(add(-1, 1)).toBe(0)
})

test('add 5 and 6', () => {
  expect(add(5, 6)).toBe(11)
})

// to run test use "npm test"
