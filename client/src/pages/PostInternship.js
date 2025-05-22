import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  Chip,
  Stack,
} from '@mui/material';
import axios from 'axios';

function PostInternship() {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    requirements: '',
    duration: '',
    stipend: '',
  });
  const [requirements, setRequirements] = useState([]);
  const [currentRequirement, setCurrentRequirement] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddRequirement = () => {
    if (currentRequirement.trim()) {
      setRequirements([...requirements, currentRequirement.trim()]);
      setCurrentRequirement('');
    }
  };

  const handleDeleteRequirement = (requirementToDelete) => {
    setRequirements(requirements.filter((req) => req !== requirementToDelete));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (requirements.length === 0) {
      setError('Please add at least one requirement');
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const internshipData = {
        ...formData,
        requirements,
        company: user.company,
      };

      await axios.post('http://localhost:5000/api/internships', internshipData, {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      });

      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred while posting the internship');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography component="h1" variant="h4" gutterBottom>
          Post New Internship
        </Typography>
        <Typography color="text.secondary" paragraph>
          Fill in the details below to post a new internship opportunity.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 3 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="title"
              label="Internship Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="location"
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="description"
              label="Description"
              name="description"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
            />
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Requirements
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  value={currentRequirement}
                  onChange={(e) => setCurrentRequirement(e.target.value)}
                  placeholder="Add a requirement"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddRequirement();
                    }
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleAddRequirement}
                  disabled={!currentRequirement.trim()}
                >
                  Add
                </Button>
              </Box>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {requirements.map((req, index) => (
                  <Chip
                    key={index}
                    label={req}
                    onDelete={() => handleDeleteRequirement(req)}
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Stack>
            </Box>
            <TextField
              margin="normal"
              required
              fullWidth
              id="duration"
              label="Duration"
              name="duration"
              placeholder="e.g., 3 months, 6 months"
              value={formData.duration}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="stipend"
              label="Stipend"
              name="stipend"
              placeholder="e.g., $1000/month, Negotiable"
              value={formData.stipend}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3 }}
            >
              Post Internship
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default PostInternship; 