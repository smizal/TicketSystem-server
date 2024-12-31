const mongoose = require('mongoose')

const departmentSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
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

const Department = mongoose.model('Department', departmentSchema)

module.exports = Department
