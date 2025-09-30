const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TopicSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    required: true,
  },
  chapter: {
    type: Schema.Types.ObjectId,
    ref: 'Chapter',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Topic', TopicSchema);
