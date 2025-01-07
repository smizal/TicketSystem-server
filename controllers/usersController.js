const User = require("../models/usersModel")
const Ticket = require("../models/ticketsModel")
const Department = require("../models/departmentsModel")

const bcrypt = require("bcrypt")
const SALT = process.env.SALT ? +process.env.SALT : 12

const index = async (req, res) => {
  try {
    const users = ""
    if (req.user.role === "super") {
      users = await User.find()
    } else {
      users = await User.find({
        companyId: req.user.companyId,
      })
    }
    if (!users) {
      return res.status(404).json({ error: "Bad request." })
    }
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const create = async (req, res) => {
  try {
    if (req.user.role != "super") {
      req.body.companyId = req.user.companyId
    }

    const newUser = req.body
    if (
      !newUser.name ||
      !newUser.username ||
      !newUser.password ||
      !newUser.cpr ||
      !newUser.role ||
      (newUser.role === "staff" && !newUser.departmentId)
    ) {
      return res.status(400).json({ error: "Missing required fields." })
    }

    if (newUser.password !== newUser.confirmPassword) {
      return res.status(400).json({ error: "Passwords are not matched." })
    }
    const usernameExist = await User.findOne({ username: newUser.username })
    if (usernameExist) {
      return res.status(409).json({ error: "Username already taken." })
    }

    const userCPRExist = await User.findOne({ cpr: newUser.cpr })
    if (userCPRExist) {
      return res
        .status(409)
        .json({ error: "A User with same CPR already created." })
    }

    const department = await Department.find({ companyId: newUser.companyId })
    if (!department) {
      return res
        .status(409)
        .json({ error: "Department is not founded for this company" })
    }

    req.body.password = bcrypt.hashSync(newUser.password, SALT)

    const user = await User.create(req.body)
    if (!user) {
      return res.status(400).json({ error: "Error saving data." })
    }
    res.status(201).json(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const companyUsers = async (req, res) => {
  try {
    const company = req.user.companyId
    if (req.user.role === "super") {
      company = req.params.id
    }
    const users = await User.find({ companyId: company })
    if (!users) {
      return res.status(404).json({ error: "Bad request." })
    }
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const show = async (req, res) => {
  try {
    const user = ""
    if (req.user.role === "super") {
      user = await User.findById(req.params.id)
    } else {
      user = await User.find({
        _id: req.params.id,
        companyId: req.user.companyId,
      })
    }
    if (!user) {
      return res.status(404).json({ error: "Bad request." })
    }
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const update = async (req, res) => {
  try {
    const user = req.body
    if (req.user.role === "super") {
      user = await User.findByIdAndUpdate(req.params.id)
    } else {
      user = await User.findOneAndUpdate({
        _id: req.params.id,
        companyId: req.user.companyId,
      })
    }
    if (!user) {
      return res.status(400).json({ error: "Bad request." })
    }
    res.status(200).json(user)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const deleting = async (req, res) => {
  try {
    const user = null
    const ticket = await Ticket.find({
      $or: [{ customerId: req.params.id }, { issuerId: req.params.id }],
    })

    if (ticket) {
      if (req.user.role === "super") {
        user = await User.findByIdAndUpdate(req.params.id, {
          status: "suspended",
        })
        if (!user) {
          return res.status(400).json({ error: "Error suspending user." })
        }
        return res
          .status(201)
          .json({ error: "User has tickets. it is suspended only" })
      } else {
        user = await User.findOneAndUpdate(
          {
            _id: req.params.id,
            companyId: req.user.companyId,
          },
          { status: "suspended" }
        )
        if (!user) {
          return res.status(400).json({ error: "Error suspending user." })
        } else {
          return res
            .status(201)
            .json({ error: "User has tickets. it is suspended only" })
        }
      }
    }

    if (req.user.role === "super") {
      user = await User.findByIdAndDelete(req.params.id)
    } else {
      user = await User.findOneAndDelete({
        _id: req.params.id,
        companyId: req.user.companyId,
      })
    }
    if (!user) {
      return res.status(400).json({ error: "Bad request." })
    }
    res.status(200).json(user)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = { index, create, companyUsers, show, update, deleting }
