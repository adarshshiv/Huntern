import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import SearchIcon from '@mui/icons-material/Search';

function LandingPage() {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to Huntern
          </Typography>
          <Typography variant="h5" paragraph>
            The platform where talent meets opportunity
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button
              component={RouterLink}
              to="/register"
              variant="contained"
              color="secondary"
              size="large"
              sx={{ mr: 2 }}
            >
              Get Started
            </Button>
            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              color="inherit"
              size="large"
            >
              Login
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SchoolIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Typography variant="h4" component="h2">
                    For Students
                  </Typography>
                </Box>
                <Typography variant="body1" paragraph>
                  Find your dream internship with top companies. Browse through hundreds of opportunities
                  and apply with just a few clicks.
                </Typography>
                <Typography variant="body1" paragraph>
                  • Easy application process
                </Typography>
                <Typography variant="body1" paragraph>
                  • Track your applications
                </Typography>
                <Typography variant="body1" paragraph>
                  • Get notified about new opportunities
                </Typography>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                >
                  Start Your Journey
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <WorkIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Typography variant="h4" component="h2">
                    For Employers
                  </Typography>
                </Box>
                <Typography variant="body1" paragraph>
                  Find the best talent for your organization. Post internships and connect with
                  motivated students ready to make an impact.
                </Typography>
                <Typography variant="body1" paragraph>
                  • Post unlimited internships
                </Typography>
                <Typography variant="body1" paragraph>
                  • Review applications easily
                </Typography>
                <Typography variant="body1" paragraph>
                  • Connect with top talent
                </Typography>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                >
                  Post Internships
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* How It Works Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" gutterBottom>
            How It Works
          </Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', textAlign: 'center' }}>
                <CardContent>
                  <Typography variant="h1" color="primary" sx={{ mb: 2 }}>
                    1
                  </Typography>
                  <Typography variant="h5" gutterBottom>
                    Create Your Profile
                  </Typography>
                  <Typography variant="body1">
                    Sign up and create your profile to get started
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', textAlign: 'center' }}>
                <CardContent>
                  <Typography variant="h1" color="primary" sx={{ mb: 2 }}>
                    2
                  </Typography>
                  <Typography variant="h5" gutterBottom>
                    Browse Opportunities
                  </Typography>
                  <Typography variant="body1">
                    Find the perfect match for your skills and interests
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', textAlign: 'center' }}>
                <CardContent>
                  <Typography variant="h1" color="primary" sx={{ mb: 2 }}>
                    3
                  </Typography>
                  <Typography variant="h5" gutterBottom>
                    Apply & Connect
                  </Typography>
                  <Typography variant="body1">
                    Apply to opportunities and connect with employers
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default LandingPage; 