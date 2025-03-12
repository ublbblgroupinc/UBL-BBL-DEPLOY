const userService = require('../services/userService')

exports.signup = async (req, res) => {
  try {
    const user = await userService.signup(req.body)
    res.status(201).json({ message: 'Signup successful', user })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

exports.login = async (req, res) => {
  try {
    const token = await userService.login(req.body)
    res.status(200).json({ message: 'Login successful', token })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
