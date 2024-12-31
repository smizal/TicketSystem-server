const mongoose = require('mongoose')

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    photo: {
      type: String,
      required: false
    },
    status: {
      type: String,
      enum: ['active', 'suspended'],
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

const Company = mongoose.model('Company', companySchema)

module.exports = Company
