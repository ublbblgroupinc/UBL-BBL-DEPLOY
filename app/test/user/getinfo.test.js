const request = require('supertest')
const { app, server } = require('../../main/server')
const User = require('../../main/models/UsersModel')
const mongoose = require('mongoose') // Import mongoose for DB teardown
server.close()

describe('POST /user/login', () => {
  afterAll(async () => {
    await mongoose.connection.close() // Ensure DB connection is closed
    server.close()
  })

  it('login and get the logged in users info', async () => {
    const newUser = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'Password123*'
    }

    const response = await request(app)
      .post('/user/signup')
      .send(newUser)
      .expect(201)

      expect(response.body.message).toBe('Signup successful')

    const newLogin = {
      email: 'testuser@example.com',
      password: 'Password123*'
    }

    const response2 = await request(app)
      .post('/user/login')
      .send(newLogin)
      .expect(200)

      expect(response2.body.message).toBe('Login successful')

    const response3 = await request(app)
      .get('/user/info')
      .expect(200)

    await User.findByIdAndDelete(response.body.user._id) // Remove test user
  })
})
