// backend/models/Classroom.js
const mongoose = require('mongoose');
const { customAlphabet } = require('nanoid');
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nanoid = customAlphabet(alphabet, 6);

const ClassroomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
  ],
  joinCode: {
    type: String,
    default: () => nanoid(),
    unique: true,
  },
  chapters: [
    {
      title: String,
      topics: [{ title: String, notes: String }],
    },
  ],
  announcements: [
      { 
          text: String, 
          date: { type: Date, default: Date.now } 
      }
  ],
  assignments: [
      {
          title: String,
          description: String,
          dueDate: Date,
          date: { type: Date, default: Date.now },
          submissions: [
            {
              student: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
              content: String,
              status: { type: String, enum: ['Pending', 'Submitted', 'Graded'], default: 'Pending' },
              grade: Number,
              feedback: String,
              submittedDate: { type: Date }
            }
          ]
      }
  ],
  quizzes: [
    {
      title: String,
      description: String,
      topic: String,
      questions: [
        {
          question: String,
          options: [String],
          correctAnswer: String
        }
      ],
      scores: [
        {
          student: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
          score: Number,
          date: { type: Date, default: Date.now }
        }
      ]
    }
  ],
  leaderboard: [
    {
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
      },
      score: { type: Number, default: 0 }
    }
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('classroom', ClassroomSchema);