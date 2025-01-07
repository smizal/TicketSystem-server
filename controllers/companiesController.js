const mongoose = require("mongoose")
const Company = require("../models/companiesModel.js")

const companiesList = (req, res) => {
  res.send("List of companies")
}

const newCompanieForm = (req, res) => {
  res.send("New company form")
}

const createCompanie = (req, res) => {
  res.send("Create a new company")
}

const companieDetails = (req, res) => {
  const { id } = req.params
  res.send(`Details of company with id: ${id}`)
}

const editCompanie = (req, res) => {
  const { id } = req.params
  res.send(`Edit company with id: ${id}`)
}

const updateCompanie = (req, res) => {
  const { id } = req.params
  res.send(`Update company with id: ${id}`)
}

const editCompanieStatusForm = (req, res) => {
  const { id, status } = req.params
  res.send(`Change status of company with id: ${id} to ${status}`)
}

const deleteCompanie = (req, res) => {
  const { id } = req.params
  res.send(`Delete company with id: ${id}`)
}

// Export all functions
module.exports = {
  companiesList,
  newCompanieForm,
  createCompanie,
  companieDetails,
  editCompanie,
  updateCompanie,
  editCompanieStatusForm,
  deleteCompanie,
}
