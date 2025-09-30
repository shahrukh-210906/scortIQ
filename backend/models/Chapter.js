const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChapterSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  classroom: {
    type: Schema.Types.ObjectId,
    ref: 'Classroom',
  },
  topics: [{
    type: Schema.Types.ObjectId,
    ref: 'Topic',
  }],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Chapter', ChapterSchema);
