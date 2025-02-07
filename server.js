require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const multer = require('multer')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT ? process.env.PORT : 3003
const upload = multer({ dest: 'img/' })

// initialize DB connection
mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// app.use(cors({ origin: 'http://localhost:5173' }))
app.use(cors())
const { verifyToken } = require('./middleware/jwtUtils')
const adminRoute = require('./routes/adminRoutes.js')
const authRoute = require('./routes/authRoutes.js')
const companiesRoute = require('./routes/companiesRoutes.js')
const departmentsRoute = require('./routes/departmentsRoutes')
const ticketsRoute = require('./routes/ticketsRoutes')
const usersRoute = require('./routes/usersRoutes')
const frontsRoutes = require('./routes/frontsRoutes')

// Proper Routes use
app.use('/admin', adminRoute)
app.use('/auth', authRoute)
app.use('/companies', verifyToken, companiesRoute)
app.use('/departments', verifyToken, departmentsRoute)
app.use('/tickets', verifyToken, ticketsRoute)
app.use('/users', verifyToken, usersRoute)
app.use('/', frontsRoutes)

app.listen(PORT, () => {
  console.log(`The express app is ready on http://localhost:${PORT}`)
})
