import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

function InternshipDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState(null);
  const [resumeError, setResumeError] = useState('');

  useEffect(() => {
    const fetchInternship = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/internships/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch internship details');
        }
        const data = await response.json();
        setInternship(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInternship();
  }, [id]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCoverLetter('');
    setResume(null);
    setResumeError('');
  };

  const handleResumeChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setResumeError('Please upload a PDF file');
        setResume(null);
      } else if (file.size > 5 * 1024 * 1024) {
        setResumeError('File size should be less than 5MB');
        setResume(null);
      } else {
        setResumeError('');
        setResume(file);
      }
    }
  };

  const handleSubmit = async () => {
    if (!resume) {
      setResumeError('Please upload your resume');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('internshipId', id);
      formData.append('coverLetter', coverLetter);
      formData.append('resume', resume);

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/applications', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to submit application');
      }

      handleCloseDialog();
      navigate('/my-applications');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {internship.title}
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {internship.company}
        </Typography>

        <Box sx={{ my: 3 }}>
          <Chip label={internship.location} sx={{ mr: 1 }} />
          <Chip label={internship.duration} sx={{ mr: 1 }} />
          <Chip label={`$${internship.stipend}/month`} />
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Description
        </Typography>
        <Typography paragraph>{internship.description}</Typography>

        <Typography variant="h6" gutterBottom>
          Requirements
        </Typography>
        <List>
          {internship.requirements.map((requirement, index) => (
            <ListItem key={index}>
              <ListItemText primary={requirement} />
            </ListItem>
          ))}
        </List>

        {user?.role === 'student' && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleOpenDialog}
            >
              Apply Now
            </Button>
          </Box>
        )}
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Apply for {internship.title}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <input
              accept="application/pdf"
              style={{ display: 'none' }}
              id="resume-upload"
              type="file"
              onChange={handleResumeChange}
            />
            <label htmlFor="resume-upload">
              <Button variant="outlined" component="span" fullWidth>
                Upload Resume (PDF)
              </Button>
            </label>
            {resume && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected file: {resume.name}
              </Typography>
            )}
            {resumeError && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {resumeError}
              </Typography>
            )}
          </Box>
          <TextField
            margin="normal"
            label="Cover Letter"
            multiline
            rows={4}
            fullWidth
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Submit Application
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default InternshipDetails; 