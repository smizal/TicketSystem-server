require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const multer = require("multer")
const cors = require("cors")

const app = express()
const PORT = process.env.PORT ? process.env.PORT : 3003
const upload = multer({ dest: "img/" })

// initialize DB connection
mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// app.use(cors({ origin: 'http://localhost:5173' }))
app.use(cors())

const adminRoute = require("./routes/admin.routes.js")
const authRoute = require("./routes/auth.routes.js")
const companiesRoute = require("./routes/companies.routes.js")
// const departmentsRoute = require("./routes/departments.routes");
// const ticketsRoute = require("./routes/tickets.routes");
// const usersRoute = require("./routes/users.routes");

// Proper Routes use
app.use("/api/admin", adminRoute)
app.use("/api/auth", authRoute)
app.use("/api/companies", companiesRoute)
// app.use("/api", departmentsRoute);
// app.use("/api", ticketsRoute);
// app.use("/api", usersRoute);

app.listen(PORT, () => {
  console.log(`The express app is ready on http://localhost:${PORT}`)
})
