// backend/routes/teacher.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   GET api/teacher/students
// @desc    Get all student data
// @access  Private (for teachers)
router.get('/students', auth, async (req, res) => {
  try {
    // First, verify the user is a teacher
    const teacher = await User.findById(req.user.id);
    if (!teacher || teacher.role !== 'teacher') {
      return res.status(403).json({ msg: 'User is not a teacher' });
    }

    // Fetch all users who are students
    const students = await User.find({ role: 'student' }).select('-password');
    res.json(students);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;