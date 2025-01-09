const express = require('express')
const {
  index,
  create,
  show,
  update,
  deleting,
  addThread,
  deleteThread
} = require('../controllers/ticketsController') // Updated to departmentsController.js

const router = express.Router()

router.get('/', index)
router.post('/', create)
router.get('/:id', show)
router.post('/:id', addThread)
router.put('/edit/:id', update)
router.delete('/:id', deleting)
router.delete('/:id/:tid', deleteThread)

module.exports = router
