const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
  },
  address: {  
    type: String,
  }
}, { timestamps: true });

module.exports = mongoose.model('Member', memberSchema);
