const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  department: {
    type: String,
    default: '',
    trim: true
  },
  position: {
    type: String,
    default: '',
    trim: true
  },
  profilePic: {
    type: String,
    default: '' 
  }
});

module.exports = mongoose.model('Employee', employeeSchema);
