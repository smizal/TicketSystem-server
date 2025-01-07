const mongoose = require("mongoose")
const Company = require("../models/departments.model.js")

const departmentList = (req, res) => {
  res.send("List of departments")
}

const departmentForm = (req, res) => {
  res.send("New department form")
}

const createDepartment = (req, res) => {
  res.send("Create a new department")
}

const departmentDetails = (req, res) => {
  const { id } = req.params
  res.send(`Details of department with id: ${id}`)
}

const editDepartment = (req, res) => {
  const { id } = req.params
  res.send(`Edit department with id: ${id}`)
}

const updateDepartment = (req, res) => {
  const { id } = req.params
  res.send(`Update department with id: ${id}`)
}

const editDepartmentStatusForm = (req, res) => {
  const { id, status } = req.params
  res.send(`Change status of department with id: ${id} to ${status}`)
}

const deleteDepartment = (req, res) => {
  const { id } = req.params
  res.send(`Delete department with id: ${id}`)
}

// Export all functions
module.exports = {
  departmentList,
  departmentForm,
  createDepartment,
  departmentDetails,
  editDepartment,
  updateDepartment,
  editDepartmentStatusForm,
  deleteDepartment,
}
