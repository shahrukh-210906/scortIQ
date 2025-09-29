// backend/routes/classrooms.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Classroom = require('../models/Classroom');
const { check, validationResult } = require('express-validator');

// @route   POST api/classrooms
// @desc    Create a classroom
// @access  Private (Teachers only)
router.post(
  '/',
  [
    auth,
    [
      check('name', 'Classroom name is required').not().isEmpty(),
      check('subject', 'Subject is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const teacher = await User.findById(req.user.id);
      if (!teacher || teacher.role !== 'teacher') {
        return res.status(403).json({ msg: 'User is not a teacher' });
      }

      const { name, subject } = req.body;

      const newClassroom = new Classroom({
        name,
        subject,
        teacher: req.user.id,
      });

      const classroom = await newClassroom.save();
      res.json(classroom);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/classrooms
// @desc    Get all classrooms for a teacher
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const classrooms = await Classroom.find({ teacher: req.user.id }).sort({ date: -1 });
        res.json(classrooms);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/classrooms/join
// @desc    Student joins a classroom
// @access  Private (Students only)
router.post('/join', [auth, [
    check('joinCode', 'Join code is required').not().isEmpty(),
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { joinCode } = req.body;
    const studentId = req.user.id;

    try {
        const classroom = await Classroom.findOne({ joinCode });
        if (!classroom) {
            return res.status(404).json({ msg: 'Classroom not found' });
        }

        const student = await User.findById(studentId);
        if (student.role !== 'student') {
            return res.status(403).json({ msg: 'Only students can join classrooms' });
        }

        // Check if student is already in the class
        if (classroom.students.includes(studentId) || student.joinedClassrooms.includes(classroom._id)) {
            return res.status(400).json({ msg: 'Already enrolled in this classroom' });
        }

        // Add student to classroom and classroom to student
        classroom.students.push(studentId);
        student.joinedClassrooms.push(classroom._id);

        await classroom.save();
        await student.save();

        res.json(classroom);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/classrooms/student
// @desc    Get all classrooms a student has joined
// @access  Private (Students only)
router.get('/student', auth, async (req, res) => {
    try {
        const student = await User.findById(req.user.id);
        if (student.role !== 'student') {
            return res.status(403).json({ msg: 'User is not a student' });
        }
        
        const classrooms = await Classroom.find({
            '_id': { $in: student.joinedClassrooms }
        }).select('name subject teacher');

        res.json(classrooms);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;