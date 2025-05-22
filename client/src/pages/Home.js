import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  TextField,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredInternships, setFeaturedInternships] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedInternships = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/internships');
        setFeaturedInternships(response.data.slice(0, 6)); // Get first 6 internships
      } catch (error) {
        console.error('Error fetching internships:', error);
      }
    };

    fetchFeaturedInternships();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/internships?search=${searchQuery}`);
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 8,
          pb: 6,
          background: 'linear-gradient(45deg, #121212 30%, #1e1e1e 90%)',
        }}
      >
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
          >
            Find Your Dream Internship
          </Typography>
          <Typography variant="h5" align="center" color="text.secondary" paragraph>
            Discover opportunities from top companies and kickstart your career journey
            with Huntern - your trusted platform for internship hunting.
          </Typography>
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              mt: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search internships..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{ minWidth: 200 }}
            >
              Search
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Featured Internships Section */}
      <Container sx={{ py: 8 }} maxWidth="lg">
        <Typography
          component="h2"
          variant="h3"
          align="center"
          color="text.primary"
          gutterBottom
        >
          Featured Internships
        </Typography>
        <Grid container spacing={4}>
          {featuredInternships.map((internship) => (
            <Grid item key={internship._id} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {internship.title}
                  </Typography>
                  <Typography color="text.secondary" gutterBottom>
                    {internship.company}
                  </Typography>
                  <Typography color="text.secondary" gutterBottom>
                    {internship.location}
                  </Typography>
                  <Typography
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {internship.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => navigate(`/internship/${internship._id}`)}
                  >
                    Learn More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default Home; 