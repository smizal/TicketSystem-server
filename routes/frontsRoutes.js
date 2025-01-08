const express = require('express')
const {
  create,
  ticketList,
  show,
  register,
  addThread,
  companiesList,
  companyDepartments
} = require('../controllers/frontController.js')

const router = express.Router()

router.get('/tickets-list', ticketList)
router.post('/create-ticket', create)
router.post('/register-company', register)
router.get('/companies-list', companiesList)
router.get('/departments-list/:id', companyDepartments)
router.post('/add-thread/:id', addThread)
router.get('/tickets-show/:id', show)

module.exports = router
