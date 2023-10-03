const mongoose = require('mongoose');
const validator = require('validator');
const {USER , ADMIN , MANAGER} = require('../utils/roles')
const userSchema = new mongoose.Schema({
  fristName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail , 'filed must be email address'],
  },
  password: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  role: {
    type:String,
    enum:[ USER , ADMIN , MANAGER ],
    default: USER,
  },
  avatar:{
    type: String,
    default: 'uploads/profile.jpg'
  }
})

module.exports = mongoose.model("user" , userSchema)