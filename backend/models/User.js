// backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  class: {
    type: String,
  },
  language: {
    type: String,
  },
  role: {
    type: String,
    enum: ['student', 'teacher'],
    default: 'student'
  },
  profileComplete: {
    type: Boolean,
    default: false
  },
  // Add this new field
  joinedClassrooms: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'classroom'
  }],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('user', UserSchema);