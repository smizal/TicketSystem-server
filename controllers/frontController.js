const User = require('../models/usersModel')
const Ticket = require('../models/ticketsModel')
const Company = require('../models/companiesModel')
const Department = require('../models/departmentsModel')
const Thread = require('../models/threadsModel')

const bcrypt = require('bcrypt')
const SALT = process.env.SALT ? +process.env.SALT : 12

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

    const userExist = await User.findOne({ cpr: postData.cpr })
    let customerId = 0
    let issuerId = 0
    if (userExist) {
      customerId = userExist._id
      issuerId = userExist._id
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
      issuerId = userExist._id
    }

    /* const newTicket = {
      title: postData.title,
      source: postData.source,
      type: postData.type,
      companyId: postData.companyId,
      departmentId: postData.departmentId,
      customerId: customerId,
      issuerId: issuerId,
      description: postData.description
    } */
    req.body.customerId = customerId
    req.body.issuerId = issuerId
    req.body.source = 'web'
    const ticket = await Ticket.create(req.body)
    if (!ticket) {
      return res.status(400).json({ error: 'Error saving data.' })
    }
    res.status(201).json(ticket)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const ticketList = async (req, res) => {
  try {
    const tickets = await Ticket.find({
      customerId: req.loggedUser.user._id
    }).populate('companyId departmentId')
    if (!tickets) {
      return res.status(404).json({ error: 'Bad request.' })
    }
    res.status(200).json(tickets)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const show = async (req, res) => {
  try {
    const ticket = await Ticket.find({
      _id: req.params.id,
      customerId: req.loggedUser.user._id
    }).populate('companyId departmentId customerId issuerId')
    if (!ticket) {
      return res.status(404).json({ error: 'Bad request.' })
    }
    const threads = await Thread.find({ ticketId: req.params.id })
      .sort({
        createdAt: 1
      })
      .populate('issuerId')
    res.status(200).json({ ticket, threads })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const register = async (req, res) => {
  try {
    const postData = req.body
    if (
      !postData.companyName ||
      !postData.companyPhone ||
      !postData.companyEmail ||
      !postData.companyCr ||
      !postData.address ||
      !postData.adminName ||
      !postData.adminEmail ||
      !postData.adminPhone ||
      !postData.username ||
      !postData.password ||
      !postData.cpr
    ) {
      return res.status(400).json({ error: 'Missing required fields.' })
    }

    const companyExist = await Company.findOne({ cr: postData.companyCr })
    if (companyExist) {
      return res.status(409).json({ error: 'Company already registered.' })
    }

    const usernameExist = await User.findOne({ cpr: postData.cpr })
    if (usernameExist && usernameExist.companyId) {
      return res
        .status(409)
        .json({ error: 'Username already registered with other company.' })
    }

    const newCompany = {
      name: postData.companyName,
      phone: postData.companyPhone,
      email: postData.companyEmail,
      address: postData.address,
      cr: postData.companyCr,
      photo: postData.photo
    }
    const company = await Company.create(newCompany)

    const hashedPassword = bcrypt.hashSync(postData.password, SALT)
    const newUser = {
      name: postData.adminName,
      username: postData.username,
      password: hashedPassword,
      phone: postData.adminPhone,
      cpr: postData.cpr,
      email: postData.adminEmail,
      role: 'admin',
      status: 'pending',
      companyId: company._id
    }
    const user = await User.create(newUser)

    res.status(200).json({ company, user })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const addThread = async (req, res) => {
  try {
    const ticket = await Ticket.find({
      _id: req.params.id,
      customerId: req.loggedUser.user._id
    })

    if (!ticket) {
      return res.status(400).json({ error: 'Bad request.' })
    }

    await Ticket.findByIdAndUpdate(req.params.id, {
      status: req.body.ticketStatus
    })
    req.body.ticketId = req.params.id
    req.body.issuerId = req.loggedUser.user._id
    req.body.status = 'active'

    const thread = Thread.create(req.body)
    res.status(200).json(thread)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const companiesList = async (req, res) => {
  try {
    const companies = await Company.find({})
    if (!companies) {
      return res.status(404).json({ error: 'Bad request.' })
    }
    res.status(200).json(companies)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const companyDepartments = async (req, res) => {
  try {
    const departments = await Department.find({ companyId: req.params.id })
    if (!departments) {
      return res.status(404).json({ error: 'Bad request.' })
    }
    res.status(200).json(departments)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  create,
  ticketList,
  show,
  register,
  addThread,
  companiesList,
  companyDepartments
}
