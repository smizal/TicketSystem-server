const Ticket = require("../models/ticketsModel")
const Thread = require("../models/threadsModel")


const index = async (req, res) => {
  try {
    const tickets = ""
    if (req.user.role === "super") {
      tickets = await Ticket.find()
    }else if(req.user.role === "admin"){
      tickets = await Ticket.find({
        companyId: req.user.companyId
      })
    } else {
      tickets = await Ticket.find({
        companyId: req.user.companyId,
        departementId:req.user.departementId
      })
    }
    if (!tickets) {
      return res.status(404).json({ error: "Bad request." })
    }
    res.status(200).json(tickets)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const create = async (req, res) => {
  try {
    if (req.user.role != "super") {
      req.body.companyId = req.user.companyId
    }
    const ticket = await Ticket.create(req.body)
    if (!ticket) {
      return res.status(400).json({ error: "Error Saving Data." })
    }
    res.status(201).json(ticket)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


const show = async (req, res) => {
  try {
    const ticket = ""
    if (req.user.role === "super") {
      ticket = await Ticket.findById(req.params.id)
    } else {
      ticket = await Ticket.find({
        _id: req.params.id,
        companyId: req.user.companyId,
      })
    }
    if (!ticket) {
      return res.status(404).json({ error: "Bad request." })
    }
    res.status(200).json(ticket)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const update = async (req, res) => {
  try {
    const ticket = req.body
    if (req.user.role === "super") {
      ticket = await Ticket.findByIdAndUpdate(req.params.id)
    } else {
      ticket = await Ticket.findOneAndUpdate({
        _id: req.params.id,
        companyId: req.user.companyId,
      })
    }
    if (!ticket) {
      return res.status(400).json({ error: "Error Saving Data." })
    }
    res.status(200).json(ticket)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const deleting = async (req, res) => {
  try {
    const department = null
    const thread = await Thread.find({ departmentId: req.params.id })
    if (thread) {
      if (req.user.role === "super") {
        th = await Ticket.findByIdAndUpdate(req.params.id, {
          status: "suspended",
        })
        if (!department) {
          return res.status(400).json({ error: "Bad request." })
        }
        return res
          .status(201)
          .json({ error: "This Ticket Is Suspended Can't Be Deleted" })
      } else {
        ticket = await Ticket.findOneAndUpdate(
          {
            _id: req.params.id,
            companyId: req.user.companyId,
          },
          { status: "suspended" }
        )
        if (!ticket) {
          return res.status(400).json({ error: "Bad request." })
        } else {
          return res
            .status(201)
            .json({ error: "Ticket has tickets. it is suspended only" })
        }
      }
    }

    if (req.user.role === "super") {
      department = await Ticket.findByIdAndDelete(req.params.id)
    } else {
      department = await Ticket.findOneAndDelete({
        _id: req.params.id,
        companyId: req.user.companyId,
      })
    }
    if (!department) {
      return res.status(400).json({ error: "Bad request." })
    }
    res.status(200).json(department)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = { index, create, show, update, deleting }
