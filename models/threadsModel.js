const mongoose = require('mongoose')

const threadSchema = new mongoose.Schema(
  {
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
      required: true
    },
    description: {
      type: String,
      required: true
    },
    issuerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    ticketStatus: {
      type: String,
      enum: ['new', 'suspended', 'inProgress', 'closed'],
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'suspended'],
      default: 'active',
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

const Thread = mongoose.model('Thread', threadSchema)

module.exports = Thread
