const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  recipientName: {
    type: String,
    required: true
  },
  courseName: {
    type: String,
    required: true
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  certificateId: {
    type: String,
    unique: true,
    required: true
  },
  templateName: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Certificate', certificateSchema);
