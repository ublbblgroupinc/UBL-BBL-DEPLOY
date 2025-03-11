const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = 3000

app.use(express.json())
const bcrypt = require('bcrypt')
const User = require('./models/userModel')
const createUser = require('./user_functions/createUser')

app.get('/', (req, res) => {
  res.send('Hello node api boss')
})

app.post('/user/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body

    // checks user inputs and creates user if successful
    const user = await createUser(username, email, password)

    // Respond with the created user (without the password)
    res.status(201).json({
      username: user.username,
      email: user.email
    })
  } catch (error) {
    console.log(error.message)
    res.status(400).json({ error: error.message })
  }
})

app.post('/user/login', async (req, res) => {
  const { email, password } = req.body

  try {
    // check if user exists in database
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ error: 'user doesn\'t exist' })
    }

    // check encrypted password is correct
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ error: 'incorrect password' })
    }
    res.status(200).json('successful login')
  } catch (error) {
    res.status(500).json(error.message)
  }
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
