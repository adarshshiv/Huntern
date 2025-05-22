const router = require('express').Router();
const Application = require('../models/Application');
const Internship = require('../models/Internship');
const auth = require('../middleware/auth');

// Get all applications for a user
router.get('/my-applications', auth, async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user.userId })
      .populate('internship')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all applications for an internship (employer only)
router.get('/internship/:internshipId', auth, async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.internshipId);
    
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    // Check if user is the employer who posted the internship
    if (internship.postedBy.toString() !== req.user.userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const applications = await Application.find({ internship: req.params.internshipId })
      .populate('applicant', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(applications);
  } catch (error) {
    console.error('Error fetching internship applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit application
router.post('/', auth, async (req, res) => {
  try {
    console.log('Submitting application with data:', req.body);
    console.log('User from auth:', req.user);

    const { internshipId, resume, coverLetter } = req.body;

    // Validate required fields
    if (!internshipId || !resume || !coverLetter) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if internship exists
    const internship = await Internship.findById(internshipId);
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    // Check if internship is active
    if (internship.status !== 'active') {
      return res.status(400).json({ message: 'This internship is no longer accepting applications' });
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
      resume,
      coverLetter
    });

    await application.save();

    // Add application to internship
    internship.applications.push(application._id);
    await internship.save();

    res.status(201).json(application);
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// Update application status (employer only)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id)
      .populate('internship');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if user is the employer who posted the internship
    if (application.internship.postedBy.toString() !== req.user.userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    application.status = status;
    await application.save();

    res.json(application);
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 