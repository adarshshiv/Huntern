const mongoose = require('mongoose');
const Internship = require('../models/Internship');
const User = require('../models/User');
require('dotenv').config();

const mockEmployer = {
  name: "Admin Employer",
  email: "admin@example.com",
  password: "admin123",
  role: "employer",
  company: "TechSolutions India"
};

const mockInternships = [
  {
    title: "Software Development Intern",
    company: "TechSolutions India",
    location: "Bangalore, Karnataka",
    description: "Join our dynamic team as a software development intern. Work on cutting-edge technologies and real-world projects. Perfect opportunity for students looking to gain hands-on experience in full-stack development.",
    requirements: [
      "Currently pursuing B.Tech/M.Tech in Computer Science or related field",
      "Strong knowledge of JavaScript, React, and Node.js",
      "Understanding of database concepts",
      "Good problem-solving skills"
    ],
    duration: "6 months",
    stipend: "₹25,000/month",
    status: "active"
  },
  {
    title: "Data Science Intern",
    company: "AnalyticsPro",
    location: "Hyderabad, Telangana",
    description: "Exciting opportunity for data science enthusiasts. Work on machine learning models and data analysis projects. Learn from industry experts and contribute to meaningful projects.",
    requirements: [
      "Pursuing degree in Data Science, Statistics, or related field",
      "Knowledge of Python and data analysis libraries",
      "Understanding of machine learning concepts",
      "Experience with data visualization tools"
    ],
    duration: "3 months",
    stipend: "₹30,000/month",
    status: "active"
  },
  {
    title: "Marketing Intern",
    company: "GrowthMakers",
    location: "Mumbai, Maharashtra",
    description: "Join our marketing team to learn digital marketing strategies and campaign management. Work on social media marketing, content creation, and market research.",
    requirements: [
      "Currently pursuing degree in Marketing or related field",
      "Strong communication skills",
      "Knowledge of social media platforms",
      "Creative thinking and analytical skills"
    ],
    duration: "4 months",
    stipend: "₹20,000/month",
    status: "active"
  },
  {
    title: "UI/UX Design Intern",
    company: "DesignHub",
    location: "Delhi NCR",
    description: "Work with our design team to create beautiful and functional user interfaces. Learn about user research, wireframing, and prototyping.",
    requirements: [
      "Pursuing degree in Design or related field",
      "Knowledge of design tools (Figma, Adobe XD)",
      "Understanding of UI/UX principles",
      "Portfolio of design projects"
    ],
    duration: "5 months",
    stipend: "₹22,000/month",
    status: "active"
  },
  {
    title: "Business Development Intern",
    company: "StartupIndia",
    location: "Pune, Maharashtra",
    description: "Join our business development team to learn about market research, client acquisition, and business strategy. Great opportunity for aspiring entrepreneurs.",
    requirements: [
      "Currently pursuing degree in Business Administration or related field",
      "Strong analytical and communication skills",
      "Interest in startups and business development",
      "Proficiency in MS Office"
    ],
    duration: "3 months",
    stipend: "₹18,000/month",
    status: "active"
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Drop existing indexes
    await User.collection.dropIndexes();
    await Internship.collection.dropIndexes();

    // Clear existing data
    await Internship.deleteMany({});
    await User.deleteMany({ email: mockEmployer.email });

    // Create mock employer
    const employer = new User(mockEmployer);
    await employer.save();
    console.log('Created mock employer:', employer.email);

    // Add postedBy field to internships
    const internshipsWithEmployer = mockInternships.map(internship => ({
      ...internship,
      postedBy: employer._id
    }));

    // Insert mock internships
    await Internship.insertMany(internshipsWithEmployer);

    console.log('Database seeded successfully!');
    console.log('You can login with:');
    console.log('Email:', mockEmployer.email);
    console.log('Password:', mockEmployer.password);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 