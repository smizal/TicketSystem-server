const mongoose = require("mongoose")
const Ticket = require("../models/tickets.model.js")  // Updated to tickets.model.js

const ticketList = (req, res) => {
  res.send("List of tickets")
}

const ticketForm = (req, res) => {
  res.send("New ticket form")
}

const createTicket = (req, res) => {
  res.send("Create a new ticket")
}

const ticketDetails = (req, res) => {
  const { id } = req.params
  res.send(`Details of ticket with id: ${id}`)
}

const editTicket = (req, res) => {
  const { id } = req.params
  res.send(`Edit ticket with id: ${id}`)
}

const updateTicket = (req, res) => {
  const { id } = req.params
  res.send(`Update ticket with id: ${id}`)
}

const editTicketStatusForm = (req, res) => {
  const { id, status } = req.params
  res.send(`Change status of ticket with id: ${id} to ${status}`)
}

const deleteTicket = (req, res) => {
  const { id } = req.params
  res.send(`Delete ticket with id: ${id}`)
}

// Export all functions
module.exports = {
  ticketList,
  ticketForm,
  createTicket,
  ticketDetails,
  editTicket,
  updateTicket,
  editTicketStatusForm,
  deleteTicket,
}