const express = require("express")
const {
  ticketsList,
  newTicketForm,
  createTicket,
  ticketDetails,
  editTicket,
  updateTicket,
  editTicketStatusForm,
  deleteTicket,
} = require("../controllers/ticketsController.js")

const router = express.Router()

router.get("/", ticketsList)
router.get("/new", newTicketForm)
router.post("/", createTicket)
router.get("/:id", ticketDetails)
router.post("/edit/:id", editTicket)
router.put("/:id", updateTicket)
router.put("/:id/:status", editTicketStatusForm)
router.delete("/:id", deleteTicket)

module.exports = router
