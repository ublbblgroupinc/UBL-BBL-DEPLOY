const request = require('supertest')
const { app, server } = require('../../api/server')
const User = require('../../api/models/UsersModel')
const mongoose = require('mongoose') // Import mongoose for DB teardown
server.close()

describe('DELETE /invoices/:invoiceId', () => {
  it('dummy test - delete after implementation is added', async () => {
    await mongoose.connection.close() // Ensure DB connection is closed
    server.close()
  })
})

describe.skip('DELETE /invoices/:invoiceId', () => {
  afterAll(async () => {
    await mongoose.connection.close() // Ensure DB connection is closed
    server.close()
  })

  it('should delete the invoice and return successfully', async () => {
    const newUser = {
      username: 'Billy Bob',
      email: 'billybob@gmail.com',
      password: 'Password123!'
    }

    const response = await request(app)
      .post('/user/signup')
      .send(newUser)
      .expect(201)

    expect(response.body.message).toBe('Signup successful')

    const newLogin = {
      email: 'billybob@gmail.com',
      password: 'Password123!'
    }

    const response2 = await request(app)
      .post('/user/login')
      .send(newLogin)
      .expect(200)

    expect(response2.body.message).toBe('Login successful')

    const newInvoice = {
      invoiceNo: 'Test Invoice',
      date: '2025-03-13T00:00:00.000Z',
      productDetail: 'DELL Monitor',
      productFee: 250,
      productGst: 25,
      productTotal: 275
    }

    const response3 = await request(app)
      .post('/invoices')
      .send(newInvoice)
      .set('Cookie', response2.headers['set-cookie'])
      .expect(200)

    expect(response3.body.message).toBe('Invoice created')

    const message = {
      title: 'Test Message',
      emailAddress: 'joebloe@hotmail.com',
      message: 'Hi this is a test message! Pls reply to me!'
    }

    const response4 = await request(app)
      .post(`/invoices/${response3.body.invoice._id}`)
      .send(message)
      .set('Cookie', response2.headers['set-cookie'])
      .expect(200)

    expect(response4.body.message).toBe('Message sent successfully')

    const response5 = await request(app)
      .delete('/invoices')
      .expect(200)

    expect(response5.body.message).toBe('Invoice deleted successfully')

    const response6 = await request(app)
      .get(`/invoices/${response3.body.invoice._id}`)
      .set('Cookie', response2.headers['set-cookie'])
      .expect(400)

    expect(response6.body.message).toBe('No invoice found')

    await User.findByIdAndDelete(response.body.user._id) // Remove test user
  })

  it('should error as the invoice no longer exists', async () => {
    const newUser = {
      username: 'Billy Bob',
      email: 'billybob@gmail.com',
      password: 'Password123!'
    }

    const response = await request(app)
      .post('/user/signup')
      .send(newUser)
      .expect(201)

    expect(response.body.message).toBe('Signup successful')

    const newLogin = {
      email: 'billybob@gmail.com',
      password: 'Password123!'
    }

    const response2 = await request(app)
      .post('/user/login')
      .send(newLogin)
      .expect(200)

    expect(response2.body.message).toBe('Login successful')

    const newInvoice = {
      invoiceNo: 'Test Invoice',
      date: '2025-03-13T00:00:00.000Z',
      productDetail: 'DELL Monitor',
      productFee: 250,
      productGst: 25,
      productTotal: 275
    }

    const response3 = await request(app)
      .post('/invoices')
      .send(newInvoice)
      .set('Cookie', response2.headers['set-cookie'])
      .expect(200)

    expect(response3.body.message).toBe('Invoice created')

    const response4 = await request(app)
      .delete(`/invoices/${response3.body.invoice._id}`)
      .set('Cookie', response2.headers['set-cookie'])
      .expect(200)

    expect(response4.body.message).toBe('Invoice deleted successfully')

    const response5 = await request(app)
      .delete(`/invoices/${response3.body.invoice._id}`)
      .set('Cookie', response2.headers['set-cookie'])
      .expect(400)

    expect(response5.body.message).toBe('Invoice does not exist')

    await User.findByIdAndDelete(response.body.user._id) // Remove test user
  })
})
