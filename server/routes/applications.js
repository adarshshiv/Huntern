console.log('Loaded applications.js');

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const Application = require('../models/Application');
const Internship = require('../models/Internship');

// Get all applications for an employer
router.get('/employer', auth, async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('internship')
      .populate('applicant', 'name email')
      .sort({ appliedAt: -1 });

    // Filter applications for internships posted by the employer
    const employerApplications = applications.filter(app => 
      app.internship.postedBy.toString() === req.user.userId
    );

    res.json(employerApplications);
  } catch (err) {
    console.error('Error fetching employer applications:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get applications for a specific internship
router.get('/internship/:internshipId', auth, async (req, res) => {
  try {
    const applications = await Application.find({ internship: req.params.internshipId })
      .populate('applicant', 'name email')
      .sort({ appliedAt: -1 });
    res.json(applications);
  } catch (err) {
    console.error('Error fetching internship applications:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get applications for the logged-in user
router.get('/my-applications', auth, async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user.userId })
      .populate('internship')
      .sort({ appliedAt: -1 });
    res.json(applications);
  } catch (err) {
    console.error('Error fetching user applications:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit a new application
router.post('/', auth, upload.single('resume'), async (req, res) => {
  console.log('POST /api/applications route hit');

  // Debugging logs
  console.log('--- Application Submission Debug ---');
  console.log('req.body:', req.body);
  console.log('req.file:', req.file);
  console.log('req.headers["content-type"]:', req.headers['content-type']);
  if (req.file) {
    console.log('Uploaded file info:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
    });
  }
  console.log('------------------------------------');

  try {
    const { internshipId, coverLetter } = req.body;

    if (!internshipId || !coverLetter || !req.file) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if internship exists
    const internship = await Internship.findById(internshipId);
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    // Check if user has already applied
    const existingApplication = await Application.findOne({
      internship: internshipId,
      applicant: req.user.userId
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this internship' });
    }

    const application = new Application({
      internship: internshipId,
      applicant: req.user.userId,
      resume: `/uploads/resumes/${req.file.filename}`,
      coverLetter
    });

    await application.save();
    res.status(201).json(application);
  } catch (err) {
    console.error('Error submitting application:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update application status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if the user is the employer who posted the internship
    const internship = await Internship.findById(application.internship);
    if (internship.postedBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    application.status = status;
    await application.save();
    res.json(application);
  } catch (err) {
    console.error('Error updating application status:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 