const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Internship = require('../models/Internship');
const mongoose = require('mongoose');

// @route   GET api/internships
// @desc    Get all internships
// @access  Public
router.get('/', async (req, res) => {
  try {
    const internships = await Internship.find()
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(internships);
  } catch (err) {
    console.error('Error fetching internships:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/internships/:id
// @desc    Get internship by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid internship ID' });
    }

    const internship = await Internship.findById(req.params.id)
      .populate('postedBy', 'name email');
    
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    res.json(internship);
  } catch (err) {
    console.error('Error fetching internship:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/internships/my-internships
// @desc    Get internships posted by the logged-in employer
// @access  Private
router.get('/my-internships', auth, async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const internships = await Internship.find({ postedBy: req.user.userId })
      .sort({ createdAt: -1 });
    res.json(internships);
  } catch (err) {
    console.error('Error fetching employer internships:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/internships
// @desc    Create a new internship
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const {
      title,
      company,
      location,
      description,
      requirements,
      duration,
      stipend
    } = req.body;

    // Validate required fields
    if (!title || !company || !location || !description || !requirements || !duration) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const internship = new Internship({
      title,
      company,
      location,
      description,
      requirements,
      duration,
      stipend,
      postedBy: req.user.userId
    });

    await internship.save();
    res.status(201).json(internship);
  } catch (err) {
    console.error('Error creating internship:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/internships/:id
// @desc    Update an internship
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid internship ID' });
    }

    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    // Check if the user is the one who posted the internship
    if (internship.postedBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedInternship = await Internship.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(updatedInternship);
  } catch (err) {
    console.error('Error updating internship:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE api/internships/:id
// @desc    Delete an internship
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid internship ID' });
    }

    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    // Check if the user is the one who posted the internship
    if (internship.postedBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await internship.remove();
    res.json({ message: 'Internship removed' });
  } catch (err) {
    console.error('Error deleting internship:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 