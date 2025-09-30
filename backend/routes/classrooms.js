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

// @route   DELETE api/classrooms/:id
// @desc    Delete a classroom
// @access  Private (Teachers only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.id);

    if (!classroom) {
      return res.status(404).json({ msg: 'Classroom not found' });
    }

    // Check user
    if (classroom.teacher.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await classroom.remove();

    res.json({ msg: 'Classroom removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Classroom not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/classrooms/students/:id/:student_id
// @desc    Add a student to a classroom
// @access  Private (Teachers only)
router.put('/students/:id/:student_id', auth, async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.id);
    const user = await User.findById(req.params.student_id);

    if (!classroom) {
      return res.status(404).json({ msg: 'Classroom not found' });
    }
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check user
    if (classroom.teacher.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    if (classroom.students.some(student => student.toString() === req.params.student_id)) {
      return res.status(400).json({ msg: 'Student already in classroom' });
    }

    classroom.students.push(req.params.student_id);

    await classroom.save();
    res.json(classroom.students);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/classrooms/students/:id/:student_id
// @desc    Remove a student from a classroom
// @access  Private (Teachers only)
router.delete('/students/:id/:student_id', auth, async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.id);

    if (!classroom) {
      return res.status(404).json({ msg: 'Classroom not found' });
    }

    // Check user
    if (classroom.teacher.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Get remove index
    const removeIndex = classroom.students
      .map(student => student.toString())
      .indexOf(req.params.student_id);
    
    if(removeIndex === -1) {
        return res.status(404).json({ msg: 'Student not found in classroom' });
    }

    classroom.students.splice(removeIndex, 1);

    await classroom.save();

    res.json(classroom.students);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route   POST api/classrooms/announcements/:id
// @desc    Add an announcement to a classroom
// @access  Private (Teachers only)
router.post(
  '/announcements/:id',
  [
    auth,
    [
      check('text', 'Text is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const classroom = await Classroom.findById(req.params.id);

      if (!classroom) {
        return res.status(404).json({ msg: 'Classroom not found' });
      }

      // Check user
      if (classroom.teacher.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized' });
      }
      
      const newAnnouncement = {
        text: req.body.text,
      };

      classroom.announcements.unshift(newAnnouncement);

      await classroom.save();

      res.json(classroom.announcements);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   POST api/classrooms/assignments/:id
// @desc    Add an assignment to a classroom
// @access  Private (Teachers only)
router.post(
    '/assignments/:id',
    [
      auth,
      [
        check('title', 'Title is required').not().isEmpty(),
        check('dueDate', 'Due date is required').not().isEmpty(),
      ],
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      try {
        const classroom = await Classroom.findById(req.params.id);
  
        if (!classroom) {
          return res.status(404).json({ msg: 'Classroom not found' });
        }
  
        // Check user
        if (classroom.teacher.toString() !== req.user.id) {
          return res.status(401).json({ msg: 'User not authorized' });
        }
        
        const newAssignment = {
          title: req.body.title,
          dueDate: req.body.dueDate
        };
  
        classroom.assignments.unshift(newAssignment);
  
        await classroom.save();
  
        res.json(classroom.assignments);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
  );

// @route   POST api/classrooms/quizzes/:id
// @desc    Add a quiz to a classroom
// @access  Private (Teachers only)
router.post(
  '/quizzes/:id',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('questions', 'Questions are required').isArray({ min: 1 }),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const classroom = await Classroom.findById(req.params.id);

      if (!classroom) {
        return res.status(404).json({ msg: 'Classroom not found' });
      }

      // Check user
      if (classroom.teacher.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized' });
      }
      
      const newQuiz = {
        title: req.body.title,
        questions: req.body.questions
      };

      classroom.quizzes.unshift(newQuiz);

      await classroom.save();

      res.json(classroom.quizzes);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);


module.exports = router;