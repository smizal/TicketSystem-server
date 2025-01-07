const express = require("express");
const {
  index,
  companyDepartments,
  create,
  show,
  update,
  deleting,
} = require("../controllers/departmentsController.js"); // Updated to departmentsController.js

const router = express.Router();

router.get("/", index);
router.get("/dep/:id", companyDepartments);
router.post("/", create);
router.get("/:id", show);
router.post("/edit/:id", update);
router.delete("/:id", deleting);

module.exports = router;
