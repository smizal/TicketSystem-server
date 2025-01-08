const mongoose = require('mongoose')
const Company = require('../models/companiesModel.js')
const Ticket = require('../models/ticketsModel.js')

const index = async (req, res) => {
  try {
    let companies = ''
    if (req.loggedUser.user.role === 'super') {
      companies = await Company.find()
    } else {
      companies = await Company.find({
        companyId: req.loggedUser.user.companyId
      })
    }
    if (!companies) {
      return res.status(404).json({ error: 'Bad request.' })
    }
    res.status(200).json(companies)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const create = async (req, res) => {
  try {
    if (req.loggedUser.user.role != 'super') {
      req.body.companyId = req.loggedUser.user.companyId
    }
    const company = await Company.create(req.body)
    if (!company) {
      return res.status(400).json({ error: 'Error Saving Data.' })
    }
    res.status(201).json(company)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const show = async (req, res) => {
  try {
    let company = ''
    if (req.loggedUser.user.role === 'super') {
      company = await Company.findById(req.params.id)
    } else {
      company = await Company.find({
        _id: req.params.id,
        companyId: req.loggedUser.user.companyId
      })
    }
    if (!company) {
      return res.status(404).json({ error: 'Bad request.' })
    }
    res.status(200).json(company)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const update = async (req, res) => {
  try {
    let company = ''
    if (req.loggedUser.user.role === 'super') {
      company = await Company.findByIdAndUpdate(req.params.id, req.body, {
        new: true
      })
    } else {
      company = await Company.findOneAndUpdate(
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
    if (!company) {
      return res.status(400).json({ error: 'Error Saving Data.' })
    }
    res.status(200).json(company)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const deleting = async (req, res) => {
  try {
    const company = null
    const ticket = await Ticket.find({ companyId: req.params.id })
    if (ticket) {
      if (req.loggedUser.user.role === 'super') {
        company = await Company.findByIdAndUpdate(req.params.id, {
          status: 'suspended'
        })
        if (!company) {
          return res.status(400).json({ error: 'Bad request.' })
        }
        return res
          .status(201)
          .json({ error: 'Company has tickets. it is suspended only' })
      } else {
        company = await Company.findOneAndUpdate(
          {
            _id: req.params.id,
            companyId: req.loggedUser.user.companyId
          },
          { status: 'suspended' }
        )
        if (!company) {
          return res.status(400).json({ error: 'Bad request.' })
        } else {
          return res
            .status(201)
            .json({ error: 'Company has tickets. it is suspended only' })
        }
      }
    }

    if (req.loggedUser.user.role === 'super') {
      company = await Company.findByIdAndDelete(req.params.id)
    } else {
      company = await Company.findOneAndDelete({
        _id: req.params.id,
        companyId: req.loggedUser.user.companyId
      })
    }
    if (!company) {
      return res.status(400).json({ error: 'Bad request.' })
    }
    res.status(200).json(company)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = { index, create, show, update, deleting }
