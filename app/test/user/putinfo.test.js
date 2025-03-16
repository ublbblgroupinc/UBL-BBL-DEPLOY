const request = require('supertest')
const { app, server } = require('../../main/server')
const User = require('../../main/models/UsersModel')
const mongoose = require('mongoose')
server.close()

describe('PUT /user/info', () => {
  let userId

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
  })

  it('should update the user email successfully', async () => {
    const response1 = await request(app)
      .put('/user/info')
      .set('Cookie', loginResponse.headers['set-cookie'])
      .send({ newemail: 'changedemail@example.com' })
      .expect(200)

    expect(response1.body.message).toBe('Successfully updated user info')
  })

  it('should not update to the same email', async () => {
    const response2 = await request(app)
      .put('/user/info')
      .set('Cookie', response1.headers['set-cookie'])
      .send({ newemail: 'changedemail@example.com' })
      .expect(400)

    expect(response2.body.error).toBe('New email should not be current email')
  })

  it('should update the username successfully', async () => {
    const response3 = await request(app)
      .put('/user/info')
      .set('Cookie', response2.headers['set-cookie'])
      .send({ newusername: 'newtestuser' })
      .expect(200)

    expect(response3.body.message).toBe('Successfully updated user info')
  })

  it('should not update to an existing username', async () => {
    await User.create({ username: 'existinguser', email: 'existing@example.com', password: 'Password123*' })

    const response4 = await request(app)
      .put('/user/info')
      .set('Cookie', response3.headers['set-cookie'])
      .send({ newusername: 'existinguser' })
      .expect(400)

    expect(response4.body.error).toBe('Username already exists')
  })

  it('should not update to the same username', async () => {
    const response5 = await request(app)
      .put('/user/info')
      .set('Cookie', response4.headers['set-cookie'])
      .send({ newusername: 'newtestuser' })
      .expect(400)

    expect(response5.body.error).toBe('New username should not be current username')
  })

  it('should update the password successfully', async () => {
    const response6 = await request(app)
      .put('/user/info')
      .set('Cookie', response5.headers['set-cookie'])
      .send({ newpassword: 'NewPassword123*' })
      .expect(200)

    expect(response6.body.message).toBe('Successfully updated user info')
  })

  it('should not update to the same password', async () => {
    const response7 = await request(app)
      .put('/user/info')
      .set('Cookie', response6.headers['set-cookie'])
      .send({ newpassword: 'NewPassword123*' })
      .expect(400)

    expect(response7.body.error).toBe('New password should not be current password')
  })

  it('should not update password if it does not meet complexity requirements', async () => {
    const response8 = await request(app)
      .put('/user/info')
      .set('Cookie', response7.headers['set-cookie'])
      .send({ newpassword: 'short' })
      .expect(400)

    expect(response8.body.error).toMatch('Password must be at least 8 characters long, include 1 uppercase, ' +
    '1 number, and 1 special character.')
  })

  it('should update both email and username successfully', async () => {
    const response9 = await request(app)
      .put('/user/info')
      .set('Cookie', response8.headers['set-cookie'])
      .send({ newemail: 'multiupdate@example.com', newusername: 'multiuser' })
      .expect(200)

    expect(response9.body.message).toBe('Successfully updated user info')
  })

  it('should update both email and password successfully', async () => {
    const response10 = await request(app)
      .put('/user/info')
      .set('Cookie', response9.headers['set-cookie'])
      .send({ newemail: 'emailpass@example.com', newpassword: 'NewSecurePass123*' })
      .expect(200)

    expect(response10.body.message).toBe('Successfully updated user info')
  })

  it('should update both username and password successfully', async () => {
    const response11 = await request(app)
      .put('/user/info')
      .set('Cookie', response10.headers['set-cookie'])
      .send({ newusername: 'userpass', newpassword: 'AnotherPass123*' })
      .expect(200)

    expect(response11.body.message).toBe('Successfully updated user info')
  })

  it('should not update if both email and username are the same as current', async () => {
    const response12 = await request(app)
      .put('/user/info')
      .set('Cookie', response11.headers['set-cookie'])
      .send({ newemail: 'emailpass@example.com', newusername: 'userpass' })
      .expect(400)

    expect(response12.body.error).toBe('New username should not be current username')
  })

  it('should return 401 for missing or invalid token', async () => {
    const response13 = await request(app)
      .put('/user/info')
      .send({ newusername: 'anotheruser' })
      .expect(401)

    expect(response13.body.error).toBe('No token provided')
  })

  it('should return 404 for non-existent user', async () => {
    await User.findByIdAndDelete(userId)

    const response14 = await request(app)
      .put('/user/info')
      .set('Cookie', loginResponse.headers['set-cookie'])
      .send({ newusername: 'ghostuser' })
      .expect(404)

    expect(response.body.error).toBe('User not found')
  })
})
