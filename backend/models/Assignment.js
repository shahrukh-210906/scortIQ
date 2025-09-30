const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AssignmentSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  classroom: {
    type: Schema.Types.ObjectId,
    ref: 'Classroom',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Assignment', AssignmentSchema);
