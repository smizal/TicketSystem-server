const mongoose = require("mongoose")
const User = require("../models/users.model.js") // Updated to users.model.js

const userList = (req, res) => {
  res.send("List of users")
}

const userForm = (req, res) => {
  res.send("New user form")
}

const createUser = (req, res) => {
  res.send("Create a new user")
}

const userDetails = (req, res) => {
  const { id } = req.params
  res.send(`Details of user with id: ${id}`)
}

const editUser = (req, res) => {
  const { id } = req.params
  res.send(`Edit user with id: ${id}`)
}

const updateUser = (req, res) => {
  const { id } = req.params
  res.send(`Update user with id: ${id}`)
}

const editUserStatusForm = (req, res) => {
  const { id, status } = req.params
  res.send(`Change status of user with id: ${id} to ${status}`)
}

const deleteUser = (req, res) => {
  const { id } = req.params
  res.send(`Delete user with id: ${id}`)
}

// Export all functions
module.exports = {
  userList,
  userForm,
  createUser,
  userDetails,
  editUser,
  updateUser,
  editUserStatusForm,
  deleteUser,
}
