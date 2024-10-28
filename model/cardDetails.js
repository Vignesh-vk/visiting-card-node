// model/contact.js
const mongoose = require('mongoose');

const cardDetailsSchema = new mongoose.Schema({
  name: String,
  jobTitle: String,
  companyName: String,
  email: String,
  phoneNumber: String,
  address: String,
  imageUrl: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const CardDetails = mongoose.model('CardDetails', cardDetailsSchema);

module.exports = CardDetails;
