// required libraries
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const multer = require('multer')
const cors = require('cors')

// initialize parameters
const app = express()
const PORT = process.env.PORT ? process.env.PORT : 3003
const upload = multer({ dest: 'img/' })

// initialize DB connection
mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
})

app.use(express.json())
// app.use(cors({ origin: 'http://localhost:5173' }))
app.use(cors())

// import the routes
const routes = require('./routes/routes.js')

// Routes use
app.use(routes)

app.get('*', function (req, res) {
  res.status(404).send(`Error: page not found.`)
})

// add server error listener
const handleServerError = (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Warning! Port ${PORT} is already in use!`)
  } else {
    console.log('Error:', err)
  }
}

app
  .listen(PORT, () => {
    console.log(`The express app is ready on port ${PORT}!`)
  })
  .on('error', handleServerError)
