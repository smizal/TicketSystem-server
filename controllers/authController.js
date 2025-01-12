const bcrypt = require('bcrypt')
const User = require('../models/usersModel')
// const jwt = require('jsonwebtoken')
const { signToken } = require('../middleware/jwtUtils')
// const SALT = process.env.SALT ? process.env.SALT : 12

const login = async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(200).json({ error: 'Missing required fields.' })
    }
    const user = await User.findOne({ username: username })
    if (!user) {
      return res
        .status(200)
        .json({ error: 'incorrect Username & Password combination.' })
    }
    const matched = bcrypt.compareSync(password, user.password)
    if (user && user.status !== 'active') {
      res.status(200).json({
        error: `User status is (${user.status}), please contact the admin for more information.`
      })
    } else if (user && matched) {
      const token = signToken(user)
      res.status(200).json({
        user,
        token,
        message: 'You are authorized!'
      })
    } else {
      res
        .status(200)
        .json({ error: 'incorrect Username & Password combination.' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { login }
