const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { signToken } = require('../middleware/jwtUtils')
const SALT = process.env.SALT ? process.env.SALT : 12

const login = async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(400).json({ error: 'Missing required fields.' })
    }
    const user = await User.findOne({ username: username })
    if (!user) {
      return res.status(400).json({ error: 'Bad request.' })
    }
    const matched = bcrypt.compareSync(password, user.password)
    if (user && matched) {
      const token = signToken(user)
      res.status(201).json({
        role: user.role,
        name: user.name,
        photo: user.photo,
        token,
        message: 'You are authorized!'
      })
    } else {
      res.status(400).json({ error: 'Invalid credentials.' })
    }
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = { login }
