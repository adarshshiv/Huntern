# Huntern - Internship Management Platform

Huntern is a full-stack web application that connects students with employers for internship opportunities. The platform allows students to browse and apply for internships, while employers can post internships and manage applications.

## Features

### For Students
- Browse available internships
- Apply to internships with resume upload and cover letter
- Track application status
- View application history

### For Employers
- Post new internship opportunities
- Manage internship listings
- Review and process applications
- Download student resumes
- Track application statistics

## Tech Stack

- **Frontend**: React.js, Material-UI
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Local file system (for resumes)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/adarshshiv/Huntern.git
cd huntern
```

2. Install dependencies:
```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

3. Create a `.env` file in the root directory with the following variables:
```
MONGODB_URI=mongodb://localhost:27017/huntern
JWT_SECRET=your_jwt_secret_here
PORT=5000
```

4. Create an uploads directory for resumes:
```bash
mkdir server/uploads
```

5. Seed the admin user:
```bash
node scripts/seedAdmin.js
```

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Default Admin Credentials

- Email: admin@example.com
- Password: admin123

## Project Structure

```
huntern/
├── client/                 # Frontend React application
│   ├── public/
│   └── src/
│       ├── components/    # Reusable components
│       ├── pages/        # Page components
│       ├── context/      # React context
│       └── App.js        # Main application component
├── server/                # Backend Node.js application
│   ├── routes/           # API routes
│   ├── models/           # Database models
│   ├── middleware/       # Custom middleware
│   └── uploads/          # Resume uploads directory
├── scripts/              # Utility scripts
└── .env                  # Environment variables
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/user` - Get user data

### Internships
- `GET /api/internships` - Get all internships
- `GET /api/internships/:id` - Get internship by ID
- `POST /api/internships` - Create new internship
- `PUT /api/internships/:id` - Update internship
- `DELETE /api/internships/:id` - Delete internship

### Applications
- `GET /api/applications` - Get all applications
- `POST /api/applications` - Submit new application
- `PATCH /api/applications/:id/status` - Update application status

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 