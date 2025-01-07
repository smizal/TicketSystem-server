require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT ? process.env.PORT : 3003;
const upload = multer({ dest: "img/" });

// initialize DB connection
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors({ origin: 'http://localhost:5173' }))
app.use(cors());

const adminRoute = require("./routes/admin.js");
const authRoute = require("./routes/auth.js");
const companiesRoute = require("./routes/companies.js");
// const departmentsRoute = require("./routes/departments.js");
// const ticketsRoute = require("./routes/tickets.js");
// const usersRoute = require("./routes/users.js");

// Proper Routes use
app.use("/api", adminRoute);
app.use("/api", authRoute);
app.use("/api", companiesRoute);
// app.use("/api", departmentsRoute);
// app.use("/api", ticketsRoute);
// app.use("/api", usersRoute);

app.listen(PORT, () => {
  console.log(`The express app is ready on http://localhost:${PORT}`);
});
