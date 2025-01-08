const express = require('express')
const {
  index,
  create,
  show,
  update,
  deleting
} = require('../controllers/companiesController.js')

const router = express.Router()

router.get('/', index)
router.post('/', create)
router.get('/:id', show)
router.put('/edit/:id', update)
router.delete('/:id', deleting)

module.exports = router
