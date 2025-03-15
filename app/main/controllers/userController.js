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
    res.cookie("token", token, {
      httpOnly: true
    })
    res.status(200).json({ message: 'Login successful' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

exports.getInfo = async(req, res) => {
  try {
    const email = req.user.email

    if (!email) {
      return res.status(400).json({ error: "Invalid token, email missing" })
    }

    const user = await userService.getUserInfoVerify(email)

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    res.status(200).json({
      username: user.username,
      email: user.email,
      businesses: user.businesses || null,
      invoices: user.invoices || null
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.putInfo = async (req, res) => {
  try {
    const email = req.user.email

    if (!email) {
      return res.status(400).json({ error: "Invalid token, email missing" })
    }

    const user = await userService.getUserInfoVerify(email) //checking user exists

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    const userData = { email, ...req.body }
    const token = await userService.putInfo(userData)
    res.cookie("token", token, {
      httpOnly: true
    })
    res.status(200).json({ message: 'Successfully updated user info' })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

  //
}