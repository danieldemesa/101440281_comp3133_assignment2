const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  department: String,
  position: String,
  profilePic: String, // filename or URL
});

module.exports = mongoose.model('Employee', employeeSchema);

