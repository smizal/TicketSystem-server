const Department = require('../models/departmentsModel')
const Ticket = require('../models/ticketsModel')

const index = async (req, res) => {
  try {
    let departments = ''
    if (req.loggedUser.user.role === 'super') {
      departments = await Department.find().populate('companyId')
    } else {
      departments = await Department.find({
        // companyId: req.loggedUser.user.companyId,
      }).populate('companyId')
    }
    if (!departments) {
      return res.status(404).json({ error: 'Bad request.' })
    }
    res.status(200).json(departments)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const create = async (req, res) => {
  try {
    if (req.loggedUser.user.role != 'super') {
      req.body.companyId = req.loggedUser.user.companyId
    }
    const department = await Department.create(req.body)
    if (!department) {
      return res.status(400).json({ error: 'Error Saving Data.' })
    }
    res.status(201).json(department)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const companyDepartments = async (req, res) => {
  try {
    const company = req.loggedUser.user.companyId
    if (req.loggedUser.user.role === 'super') {
      company = req.params.id
    }
    const departments = await Department.find({ companyId: company }).populate(
      'companyId'
    )
    if (!departments) {
      return res.status(404).json({ error: 'Bad request.' })
    }
    res.status(200).json(departments)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const show = async (req, res) => {
  try {
    let department = ''
    if (req.loggedUser.user.role === 'super') {
      department = await Department.findById(req.params.id).populate(
        'companyId'
      )
    } else {
      department = await Department.find({
        _id: req.params.id,
        companyId: req.loggedUser.user.companyId
      }).populate('companyId')
    }
    if (!department) {
      return res.status(404).json({ error: 'Bad request.' })
    }
    res.status(200).json(department)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const update = async (req, res) => {
  try {
    let department = req.body
    if (req.loggedUser.user.role === 'super') {
      department = await Department.findByIdAndUpdate(req.params.id, req.body, {
        new: true
      })
    } else {
      department = await Department.findOneAndUpdate({
        _id: req.params.id,
        companyId: req.loggedUser.user.companyId
      })
    }
    if (!department) {
      return res.status(400).json({ error: 'Department not found' })
    }
    res.status(200).json(department)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const deleting = async (req, res) => {
  try {
    // Check for tickets associated with the department
    const ticket = await Ticket.find({ departmentId: req.params.id })

    if (ticket) {
      // If there are tickets, handle the suspension logic
      if (req.loggedUser.user.role === 'super' && ticket.length > 0) {
        const department = await Department.findByIdAndUpdate(req.params.id, {
          status: 'suspended'
        })
        if (!department) {
          return res.status(400).json({ error: 'Bad request.' })
        }
        return res
          .status(201)
          .json({ error: 'Department has tickets. It is suspended only.' })
      } else if (ticket.length > 0) {
        const department = await Department.findOneAndUpdate(
          {
            _id: req.params.id,
            companyId: req.loggedUser.user.companyId
          },
          { status: 'suspended' }
        )
        if (!department) {
          return res.status(400).json({ error: 'Bad request.' })
        }
        return res
          .status(201)
          .json({ error: 'Department has tickets. It is suspended only.' })
      }
    }

    // If no tickets found, proceed with deletion
    let department

    if (req.loggedUser.user.role === 'super') {
      department = await Department.findByIdAndDelete(req.params.id)
    } else {
      department = await Department.findOneAndDelete({
        _id: req.params.id,
        companyId: req.loggedUser.user.companyId
      })
    }

    if (!department) {
      return res.status(400).json({ error: 'Bad request.' })
    }

    // Respond with the deleted department info
    res
      .status(200)
      .json({ message: 'Department deleted successfully.', department })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = { index, create, companyDepartments, show, update, deleting }
