const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnnouncementSchema = new Schema({
  content: {
    type: String,
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

module.exports = mongoose.model('Announcement', AnnouncementSchema);
