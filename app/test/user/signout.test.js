const request = require('supertest')
const { app, server } = require('../../main/server')
const mongoose = require('mongoose')
server.close()

describe('POST /user/signout', () => {
  let token

  afterAll(async () => {
    await User.findByIdAndDelete(userId)
    await mongoose.connection.close()
    server.close()
  })

  it('should create a new user and login successfully', async () => {
    const newUser = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'Password123*'
    }

    await request(app)
      .post('/user/signup')
      .send(newUser)
      .expect(201)

    const loginResponse = await request(app)
      .post('/user/login')
      .send({ email: newUser.email, password: newUser.password })
      .expect(200)

    token = loginResponse.body.token
  })

  it('should successfully log out the user', async () => {
    const response = await request(app)
      .post('/user/signout')
      .set('Cookie', `token=${token}`)
      .expect(200)

    expect(response.body.message).toBe('Logged out')
    expect(response.headers['set-cookie'][0]).toMatch(/token=none/)
  })

  it('should return 401 if no token is provided', async () => {
    const response = await request(app)
      .post('/user/signout')
      .expect(401)

    expect(response.body.message).toBe('Unauthorised')
  })
})
