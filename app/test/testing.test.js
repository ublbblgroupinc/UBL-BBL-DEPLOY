const request = require('supertest')
const { app, server } = require('../main/server')

describe('GET /testing/:number (simple addition test)', () => {
  it('check add function works properly', async () => {
    const numberAdd = 1

    const response = await request(app)
      .get(`/testing/${numberAdd}`)
      .expect(201)

    expect(response.answer).toBe(2)
    server.close()
  })
})
