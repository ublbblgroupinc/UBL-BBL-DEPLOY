const bcrypt = require('bcrypt')
const User = require('../models/userModel')

async function createUser (username, email, password) {
  // Validate email and password
  if (!isValidEmail(email)) {
    throw new Error('Invalid email')
  }

  // Check if email already exists
  const exists = await User.findOne({ email })
  if (exists) {
    throw new Error('Email already in use')
  }

  if (!isValidPassword(password)) {
    throw new Error('Password must contain a minimum length of 8 characters, at least one uppercase, one number, and one special character')
  }

  // Encrypt password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create and save user
  const user = await User.create({ username, email, password: hashedPassword })

  return user
}

// Validates email using a regular expression
function isValidEmail (email) {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailPattern.test(email)
}

// Validates password strength
function isValidPassword (password) {
  // Minimum length of 8 characters, at least one uppercase, one number, and one special character
  const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/
  return passwordPattern.test(password)
}

module.exports = createUser
