const express = require('express')
const app = express()
const route = express.Router()

// import controllers
// const authController = require('../controllers/auth')
// const userController = require('../controllers/user')

// const isSignedIn = require('../middleware/isSignedIn')

const multer = require('multer')
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let path = 'companies'
    if (req.url.startsWith('/users')) {
      path = 'users'
    }
    cb(null, `./img/${path}`)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
let upload = multer({ storage: storage })

// route.post('/auth/login', authController.login)
// route.get('/users', isSignedIn, userController.userIndex)

module.exports = route
