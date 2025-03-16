const request = require('supertest')
const { app, server } = require('../../main/server')
const User = require('../../main/models/UsersModel')
const mongoose = require('mongoose')
server.close()

describe('PUT /user/info', () => {
  let token;
  let userId;

  beforeAll(async () => {
    const newUser = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'Password123*'
    }

    const signupResponse = await request(app)
      .post('/user/signup')
      .send(newUser)
      .expect(201)

    expect(signupResponse.body.message).toBe('Signup successful')
    userId = signupResponse.body.user._id

    const loginResponse = await request(app)
      .post('/user/login')
      .send({ email: newUser.email, password: newUser.password })
      .expect(200)

    expect(loginResponse.body.message).toBe('Login successful')
    token = loginResponse.body.token
  })

  afterAll(async () => {
    await User.findByIdAndDelete(userId)
    await mongoose.connection.close()
    server.close()
  })

  it('should update the user email successfully', async () => {
    const response = await request(app)
      .put('/user/info')
      .set('Cookie', `token=${token}`)
      .send({ newemail: 'changedemail@example.com' })
      .expect(200)

    expect(response.body.message).toBe('Successfully updated user info')
  })

  it('should not update to the same email', async () => {
    const response = await request(app)
      .put('/user/info')
      .set('Cookie', `token=${token}`)
      .send({ newemail: 'changedemail@example.com' })
      .expect(400)

    expect(response.body.error).toBe('New email should not be current email')
  })

  it('should update the username successfully', async () => {
    const response = await request(app)
      .put('/user/info')
      .set('Cookie', `token=${token}`)
      .send({ newusername: 'newtestuser' })
      .expect(200)

    expect(response.body.message).toBe('Successfully updated user info')
  })

  it('should not update to an existing username', async () => {
    await User.create({ username: 'existinguser', email: 'existing@example.com', password: 'Password123*' })

    const response = await request(app)
      .put('/user/info')
      .set('Cookie', `token=${token}`)
      .send({ newusername: 'existinguser' })
      .expect(400)

    expect(response.body.error).toBe('Username already exists')
  })

  it('should not update to the same username', async () => {
    const response = await request(app)
      .put('/user/info')
      .set('Cookie', `token=${token}`)
      .send({ newusername: 'newtestuser' })
      .expect(400)

    expect(response.body.error).toBe('New username should not be current username')
  })

  it('should update the password successfully', async () => {
    const response = await request(app)
      .put('/user/info')
      .set('Cookie', `token=${token}`)
      .send({ newpassword: 'NewPassword123*' })
      .expect(200)

    expect(response.body.message).toBe('Successfully updated user info')
  })

  it('should not update to the same password', async () => {
    const response = await request(app)
      .put('/user/info')
      .set('Cookie', `token=${token}`)
      .send({ newpassword: 'NewPassword123*' })
      .expect(400)

    expect(response.body.error).toBe('New password should not be current password')
  })

  it('should not update password if it does not meet complexity requirements', async () => {
    const response = await request(app)
      .put('/user/info')
      .set('Cookie', `token=${token}`)
      .send({ newpassword: 'short' })
      .expect(400)

    expect(response.body.error).toMatch('Password must be at least 8 characters long, include 1 uppercase, ' +
    '1 number, and 1 special character.')
  })

  it('should update both email and username successfully', async () => {
    const response = await request(app)
      .put('/user/info')
      .set('Cookie', `token=${token}`)
      .send({ newemail: 'multiupdate@example.com', newusername: 'multiuser' })
      .expect(200)

    expect(response.body.message).toBe('Successfully updated user info')
  })

  it('should update both email and password successfully', async () => {
    const response = await request(app)
      .put('/user/info')
      .set('Cookie', `token=${token}`)
      .send({ newemail: 'emailpass@example.com', newpassword: 'NewSecurePass123*' })
      .expect(200)

    expect(response.body.message).toBe('Successfully updated user info')
  })

  it('should update both username and password successfully', async () => {
    const response = await request(app)
      .put('/user/info')
      .set('Cookie', `token=${token}`)
      .send({ newusername: 'userpass', newpassword: 'AnotherPass123*' })
      .expect(200)

    expect(response.body.message).toBe('Successfully updated user info')
  })

  it('should not update if both email and username are the same as current', async () => {
    const response = await request(app)
      .put('/user/info')
      .set('Cookie', `token=${token}`)
      .send({ newemail: 'emailpass@example.com', newusername: 'userpass' })
      .expect(400)

    expect(response.body.error).toBe('New username should not be current username')
  })

  it('should return 401 for missing or invalid token', async () => {
    const response = await request(app)
      .put('/user/info')
      .send({ newusername: 'anotheruser' })
      .expect(401)

    expect(response.body.error).toBe('No token provided')
  })

  it('should return 404 for non-existent user', async () => {
    await User.findByIdAndDelete(userId)

    const response = await request(app)
      .put('/user/info')
      .set('Cookie', `token=${token}`)
      .send({ newusername: 'ghostuser' })
      .expect(404)

    expect(response.body.error).toBe('User not found')
  })
})
