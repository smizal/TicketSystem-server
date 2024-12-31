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
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: false
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: false
    },
    role: {
      type: String,
      enum: ['super', 'admin', 'staff', 'customer'],
      required: true
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
