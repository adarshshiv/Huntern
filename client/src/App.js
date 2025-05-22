import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

// Pages
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import EmployerHome from './pages/EmployerHome';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PostInternship from './pages/PostInternship';
import InternshipDetails from './pages/InternshipDetails';
import MyApplications from './pages/MyApplications';
import InternshipApplications from './pages/InternshipApplications';
import Internships from './pages/Internships';

function AppContent() {
  const { user } = useAuth();

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={user ? (user.role === 'employer' ? <EmployerHome /> : <Home />) : <LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/internships" element={<Internships />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute allowedRoles={['employer']}>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/post-internship"
          element={
            <PrivateRoute allowedRoles={['employer']}>
              <PostInternship />
            </PrivateRoute>
          }
        />
        <Route
          path="/internships/:id"
          element={
            <PrivateRoute>
              {user?.role === 'employer' ? (
                <InternshipApplications />
              ) : (
                <InternshipDetails />
              )}
            </PrivateRoute>
          }
        />
        <Route
          path="/my-applications"
          element={
            <PrivateRoute allowedRoles={['student']}>
              <MyApplications />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
