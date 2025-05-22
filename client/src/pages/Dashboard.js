import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching dashboard data for user:', user);
        if (user?.role === 'employer') {
          const response = await axios.get('http://localhost:5000/api/internships/my-internships', {
            headers: {
              'x-auth-token': localStorage.getItem('token'),
            },
          });
          console.log('Employer internships response:', response.data);
          setInternships(response.data);
        } else {
          const response = await axios.get('http://localhost:5000/api/applications/my-applications', {
            headers: {
              'x-auth-token': localStorage.getItem('token'),
            },
          });
          console.log('Student applications response:', response.data);
          setApplications(response.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(error.response?.data?.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'reviewed':
        return 'info';
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.name}!
        </Typography>
        <Typography color="text.secondary" paragraph>
          {user?.role === 'employer'
            ? 'Manage your posted internships and review applications'
            : 'Track your internship applications and their status'}
        </Typography>

        {user?.role === 'employer' ? (
          <>
            <Box sx={{ mb: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/post-internship')}
              >
                Post New Internship
              </Button>
            </Box>

            {internships.length === 0 ? (
              <Alert severity="info">You haven't posted any internships yet.</Alert>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Company</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>Applications</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {internships.map((internship) => (
                      <TableRow key={internship._id}>
                        <TableCell>{internship.title}</TableCell>
                        <TableCell>{internship.company}</TableCell>
                        <TableCell>{internship.location}</TableCell>
                        <TableCell>{internship.duration}</TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            onClick={() => navigate(`/internships/${internship._id}`)}
                          >
                            View Applications
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => navigate(`/internships/${internship._id}/edit`)}
                          >
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        ) : (
          <>
            {applications.length === 0 ? (
              <Alert severity="info">You haven't applied to any internships yet.</Alert>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Position</TableCell>
                      <TableCell>Company</TableCell>
                      <TableCell>Applied Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {applications.map((application) => (
                      <TableRow key={application._id}>
                        <TableCell>{application.internship.title}</TableCell>
                        <TableCell>{application.internship.company}</TableCell>
                        <TableCell>
                          {new Date(application.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={application.status}
                            color={getStatusColor(application.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            onClick={() => navigate(`/internships/${application.internship._id}`)}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard; 