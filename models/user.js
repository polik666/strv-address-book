const mongoose = require('mongoose')

//https://mongoosejs.com/docs/advanced_schemas.html
const userSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  })
  
  module.exports = mongoose.model('User', userSchema)