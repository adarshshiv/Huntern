const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Internship = require('../models/Internship');
const auth = require('../middleware/auth');

// Get all internships
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all internships...');
    const internships = await Internship.find()
      .populate('postedBy', 'name company')
      .sort({ createdAt: -1 });
    console.log('Found internships:', internships.length);
    res.json(internships);
  } catch (error) {
    console.error('Error fetching internships:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get internships posted by the current user
router.get('/my-internships', auth, async (req, res) => {
  try {
    const internships = await Internship.find({ postedBy: req.user.userId }).sort({ createdAt: -1 });
    res.json(internships);
  } catch (error) {
    console.error('Error fetching my internships:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get internship statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const totalInternships = await Internship.countDocuments({ postedBy: req.user.userId });
    const activeInternships = await Internship.countDocuments({ 
      postedBy: req.user.userId,
      status: 'active'
    });
    res.json({ totalInternships, activeInternships });
  } catch (error) {
    console.error('Error fetching internship stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single internship
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid internship ID' });
    }

    const internship = await Internship.findById(req.params.id)
      .populate('postedBy', 'name company');
      
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }
    res.json(internship);
  } catch (error) {
    console.error('Error fetching internship:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new internship
router.post('/', auth, async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      description,
      requirements,
      duration,
      stipend,
      type,
    } = req.body;

    const internship = new Internship({
      title,
      company,
      location,
      description,
      requirements,
      duration,
      stipend,
      type,
      postedBy: req.user.userId,
    });

    await internship.save();
    res.status(201).json(internship);
  } catch (error) {
    console.error('Error creating internship:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update an internship
router.put('/:id', auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid internship ID' });
    }

    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    // Check if the user is the owner of the internship
    if (internship.postedBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedInternship = await Internship.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedInternship);
  } catch (error) {
    console.error('Error updating internship:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete an internship
router.delete('/:id', auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid internship ID' });
    }

    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    // Check if the user is the owner of the internship
    if (internship.postedBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await internship.remove();
    res.json({ message: 'Internship removed' });
  } catch (error) {
    console.error('Error deleting internship:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 