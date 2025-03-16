const request = require('supertest')
const { app, server } = require('../../main/server')
const User = require('../../main/models/UsersModel')
const Invoice = require('../../main/models/InvoiceModel')
const mongoose = require('mongoose') // Import mongoose for DB teardown
server.close()

describe('PUT /invoices/:invoiceId', () => {
  it('dummy test - delete after implementation is added', async () => {
    await mongoose.connection.close() // Ensure DB connection is closed
    server.close()
  })
})

describe.skip('GET /invoices', () => {
  afterAll(async () => {
    await mongoose.connection.close() // Ensure DB connection is closed
    server.close()
  })

  it('should get an invoice and return successfully', async () => {
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
      .expect(201)

    expect(response3.body.message).toBe('Invoice created')

    await request(app)
      .get('/invoices')
      .set('Cookie', response2.headers['set-cookie'])
      .expect(200)

    await User.findByIdAndDelete(response.body.user._id) // Remove test user
    await Invoice.findByIdAndDelete(response3.body.invoice._id) // Remove test invoice
  })
})
