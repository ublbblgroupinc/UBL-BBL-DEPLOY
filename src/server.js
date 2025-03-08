const app = require('express')()
const mongoose = require('mongoose')

const add = require('./addfunction.js');

const PORT = 3000

app.get('/', (req, res) => {
  res.send('Hello node api boss')
})

app.get('/test', (req, res) => {
  res.send(' my friend')
})

app.get('/addfunction/:num', (req, res) => {
  number = parseInt(req.params.num);
  response = add(number, number)

  res.json(response)
})

mongoose.connect('mongodb+srv://admin:12345abcde@invoicedatabase.owzuo.mongodb.net/?retryWrites=true&w=majority&appName=InvoiceDataBase')
  .then(() => {
    console.log('Connected to DB')
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  }).catch((error) => {
    console.log(error)
  })
