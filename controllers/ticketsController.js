const Ticket = require('../models/ticketsModel')
const Thread = require('../models/threadsModel')
const User = require('../models/usersModel')

const bcrypt = require('bcrypt')
const SALT = process.env.SALT ? +process.env.SALT : 12

const index = async (req, res) => {
  try {
    let tickets = null
    if (req.loggedUser.user.role === 'super') {
      tickets = await Ticket.find().populate(
        'companyId departmentId customerId issuerId'
      )
    } else if (req.loggedUser.user.role === 'admin') {
      tickets = await Ticket.find({
        companyId: req.loggedUser.user.companyId
      }).populate('companyId departmentId customerId issuerId')
    } else {
      tickets = await Ticket.find({
        companyId: req.loggedUser.user.companyId,
        departmentId: req.loggedUser.user.departmentId
      })
    }
    if (!tickets) {
      return res.status(404).json({ error: 'Bad request.' })
    }
    res.status(200).json(tickets)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
const create3 = async (req, res) => {
  try {
    const ticket = await Ticket.create(req.body)
    if (!ticket) {
      return res.status(400).json({ error: 'Error saving data.' })
    }
    res.status(201).json(ticket)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const create = async (req, res) => {
  try {
    const postData = req.body
    if (
      !postData.name ||
      !postData.phone ||
      !postData.cpr ||
      !postData.email ||
      !postData.companyId ||
      !postData.departmentId ||
      !postData.title ||
      !postData.description ||
      !postData.type
    ) {
      return res.status(400).json({ error: 'Missing required fields.' })
    }

    let userExist = await User.findOne({ cpr: postData.cpr })
    let customerId = 0
    if (userExist) {
      customerId = userExist._id
    } else {
      const hashedPassword = bcrypt.hashSync(postData.cpr, SALT)
      const newUser = {
        name: postData.name,
        username: postData.cpr,
        password: hashedPassword,
        phone: postData.phone,
        cpr: postData.cpr,
        email: postData.email,
        role: 'customer',
        status: 'active'
      }
      userExist = await User.create(newUser)
      customerId = userExist._id
    }

    if (req.loggedUser.user.role != 'super') {
      req.body.companyId = req.loggedUser.user.companyId
    }
    req.body.customerId = customerId
    req.body.issuerId = req.loggedUser.user._id
    req.body.source = 'phone'
    const ticket = await Ticket.create(req.body)
    if (!ticket) {
      return res.status(200).json({ error: 'Error Saving Data.' })
    }
    res.status(201).json(ticket)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const show = async (req, res) => {
  try {
    let ticket = null
    if (req.loggedUser.user.role === 'super') {
      ticket = await Ticket.findById(req.params.id).populate(
        'companyId departmentId customerId issuerId'
      )
    } else {
      ticket = await Ticket.find({
        _id: req.params.id,
        companyId: req.loggedUser.user.companyId
      }).populate('companyId departmentId customerId issuerId')
    }
    if (!ticket) {
      return res.status(404).json({ error: 'Bad request.' })
    }
    const threads = await Thread.find({ ticketId: req.params.id }).sort({
      createdAt: 1
    })

    res.status(200).json({ ticket, threads })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const update = async (req, res) => {
  try {
    let ticket = null
    if (req.loggedUser.user.role === 'super') {
      ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
        new: true
      })
    } else {
      ticket = await Ticket.findOneAndUpdate(
        {
          _id: req.params.id,
          companyId: req.loggedUser.user.companyId
        },
        req.body,
        {
          new: true
        }
      )
    }
    if (!ticket) {
      return res.status(400).json({ error: 'Error Saving Data.' })
    }
    res.status(200).json(ticket)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const deleting = async (req, res) => {
  try {
    let ticket = null
    const thread = await Thread.find({ departmentId: req.params.id })
    if (thread) {
      if (req.loggedUser.user.role === 'super' && thread.length > 0) {
        ticket = await Ticket.findByIdAndUpdate(req.params.id, {
          status: 'suspended'
        })
        if (!ticket) {
          return res.status(400).json({ error: 'Bad request.' })
        }
        return res
          .status(201)
          .json({ error: "This Ticket Is Suspended Can't Be Deleted" })
      } else if (thread.length > 0) {
        ticket = await Ticket.findOneAndUpdate(
          {
            _id: req.params.id,
            companyId: req.loggedUser.user.companyId
          },
          { status: 'suspended' }
        )
        if (!ticket) {
          return res.status(400).json({ error: 'Bad request.' })
        } else {
          return res
            .status(201)
            .json({ error: 'Ticket has tickets. it is suspended only' })
        }
      }
    }

    if (req.loggedUser.user.role === 'super') {
      ticket = await Ticket.findByIdAndDelete(req.params.id)
    } else {
      ticket = await Ticket.findOneAndDelete({
        _id: req.params.id,
        companyId: req.loggedUser.user.companyId
      })
    }
    if (!ticket) {
      return res.status(400).json({ error: 'Bad request.' })
    }
    res.status(200).json(ticket)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const addThread = async (req, res) => {
  try {
    req.body.issuerId = req.loggedUser.user._id
    req.body.ticketId = req.params.id

    const thread = await Thread.create(req.body)
    if (!thread) {
      return res.status(400).json({ error: 'Error Saving Data.' })
    }
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, {
      status: req.body.ticketStatus
    })
    if (!ticket) {
      return res.status(400).json({ error: 'Error updating ticket status.' })
    }
    res.status(201).json(thread)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const deleteThread = async (req, res) => {
  try {
    const thread = await Thread.findByIdAndDelete(req.params.tid)
    if (!thread) {
      return res.status(400).json({ error: 'Bad request.' })
    }
    res.status(200).json(thread)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = {
  index,
  create,
  show,
  update,
  deleting,
  addThread,
  deleteThread
}
