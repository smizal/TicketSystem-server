const mongoose = require('mongoose')

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    source: {
      type: String,
      enum: ['phone', 'web'],
      required: true
    },
    type: {
      type: String,
      enum: ['complain', 'suggestion', 'feedback'],
      required: true
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    issuerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    description: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['new', 'suspended', 'inProgress', 'closed'],
      required: true
    },
    notes: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true
  }
)

const Ticket = mongoose.model('Ticket', ticketSchema)

module.exports = Ticket
