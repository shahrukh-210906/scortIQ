// backend/routes/profile.js
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   PUT api/profile/setup
// @desc    Add or update user profile information
// @access  Private
router.put(
  '/setup',
  [
    auth,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('role', 'Role is required').isIn(['student', 'teacher']),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, role, class: userClass, language } = req.body;

    // Build profile object
    const profileFields = {
      name,
      role,
      profileComplete: true,
    };

    if (role === 'student') {
        if (!userClass) return res.status(400).json({ msg: 'Class is required for students' });
        if (!language) return res.status(400).json({ msg: 'Language is required for students' });
        profileFields.class = userClass;
        profileFields.language = language;
    }

    try {
      let user = await User.findByIdAndUpdate(
        req.user.id,
        { $set: profileFields },
        { new: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }

      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// Correct the export to use the 'router' variable
module.exports = router;