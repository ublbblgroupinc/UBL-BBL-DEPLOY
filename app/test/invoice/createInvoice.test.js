const request = require('supertest')
const { app, server } = require('../../main/server')
const User = require('../../main/models/UsersModel')
const Invoice = require('../../main/models/InvoiceModel')
const mongoose = require('mongoose') // Import mongoose for DB teardown
server.close()

describe('POST /invoices', () => {
  it('dummy test - delete after implementation is added', async () => {
    await mongoose.connection.close() // Ensure DB connection is closed
    server.close()
  })
})

describe.skip('POST /invoices', () => {
  afterAll(async () => {
    await mongoose.connection.close() // Ensure DB connection is closed
    server.close()
  })

  it('should create a new invoice and return successfully', async () => {
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
      .expect(201)

    expect(response3.body.message).toBe('Invoice created')

    await User.findByIdAndDelete(response.body.user._id) // Remove test user
    await Invoice.findByIdAndDelete(response3.body.invoice._id) // Remove test invoice
  })

  it('should return an error when not all fields are filled out', async () => {
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
      productTotal: 275
    }

    const response3 = await request(app)
      .post('/invoices')
      .send(newInvoice)
      .expect(400)

    expect(response3.body.error).toBe('Missing fields')

    await User.findByIdAndDelete(response.body.user._id) // Remove test user
  })

  it('should return an error when the product fees are not numbers', async () => {
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
      date: '2025-03-13T00:00:00.000Z"',
      productDetail: 'DELL Monitor',
      productFee: 'notanumber',
      productGst: 'stillnotanumber',
      productTotal: 'pretendnumber'
    }
    const response3 = await request(app)
      .post('/invoices')
      .send(newInvoice)
      .expect(400)

    expect(response3.body.error).toBe('Product fees must be numbers')

    await User.findByIdAndDelete(response.body.user._id) // Remove test user
  })

  it('should return an error if the token is invalid', async () => {
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

    await User.findByIdAndDelete(response.body.user._id) // Remove test user

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
      .expect(400)

    expect(response3.body.error).toBe('Token is invalid')
  })
})
