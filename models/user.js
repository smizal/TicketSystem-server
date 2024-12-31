const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    photo: {
      type: String,
      required: false
    },
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    cpr: {
      type: Number,
      required: true
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

const User = mongoose.model('User', userSchema)

module.exports = User
