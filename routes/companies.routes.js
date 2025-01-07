const express = require("express")
const {
  companiesList,
  newCompanieForm,
  createCompanie,
  companieDetails,
  editCompanie,
  updateCompanie,
  editCompanieStatusForm,
  deleteCompanie,
} = require("../controllers/companies.controller.js")

const router = express.Router()

router.get("/", companiesList)
router.get("/new", newCompanieForm)
router.post("/", createCompanie)
router.get("/:id", companieDetails)
router.post("/edit/:id", editCompanie)
router.put("/:id", updateCompanie)
router.put("/:id/:status", editCompanieStatusForm)
router.delete("/:id", deleteCompanie)

module.exports = router
