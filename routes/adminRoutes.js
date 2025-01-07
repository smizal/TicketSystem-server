const express = require("express");
const router = express.Router();

// Define some product routes
router.get("/admin", (req, res) => {
  res.send("Admin Panel");
});

router.post("/admin", (req, res) => {
  res.send("Create a admin");
});

module.exports = router;
