// src/pages/HomePage.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Import MUI Components
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import CardMedia from '@mui/material/CardMedia';
// Imports for Welcome Page Buttons and Icons
import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/Login';
import HowToRegIcon from '@mui/icons-material/HowToReg';
// All imports for Favorite Button Icons are removed.
// import IconButton from '@mui/material/IconButton';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
// import Tooltip from '@mui/material/Tooltip';

import { useTheme } from '@mui/material/styles';

function HomePage({ globalSearchTerm }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // The state for favorite events has been removed.
  // const [favoriteEvents, setFavoriteEvents] = useState([]);

  const theme = useTheme();
  const navigate = useNavigate();

  const userToken = localStorage.getItem('userToken');
  // The userId constant is no longer needed.
  // const userId = localStorage.getItem('userId');


  const defaultEventImage = "https://images.unsplash.com/photo-1505373877845-8f2a2123d5d7?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";


  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams();
        if (globalSearchTerm) { 
          queryParams.append('search', globalSearchTerm);
        }
        const url = `${import.meta.env.VITE_BACKEND_URL}/api/events?${queryParams.toString()}`;
        console.log("Fetching URL (HomePage):", url);

        const response = await fetch(url);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEvents(data);
        
        // The logic to fetch favorite events has been removed.
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [globalSearchTerm]);


  // The handleToggleFavorite function has been removed.
  // const handleToggleFavorite = async (eventId) => { ... }


  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Typography color="error" sx={{ mt: 4 }}>Error: {error}</Typography>;


  if (!userToken && !globalSearchTerm) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: { xs: 8, md: 12 },
          px: { xs: 2, md: 4 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        <Typography variant="h2" component="h1" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
          Welcome to Moments! 👋
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mb: 4 }}>
          Your ultimate platform for discovering, creating, and sharing amazing events with your community.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/login')}
            startIcon={<LoginIcon />}
            sx={{ py: 1.5, px: 4, fontSize: '1rem', borderRadius: '10px' }}
          >
            Sign in to Your Adventure
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate('/register')}
            startIcon={<HowToRegIcon />}
            sx={{ py: 1.5, px: 4, fontSize: '1rem', borderRadius: '10px' }}
          >
            Join the Community
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4, color: 'text.primary', fontWeight: 'bold' }}>
        Community Events
      </Typography>

      {events.length === 0 ? (
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>No events found matching your criteria. Try adjusting your search!</Typography>
      ) : (
        <Grid container spacing={4} justifyContent="center" alignItems="stretch" sx={{ width: '100%', mx: 'auto' }}>
          {events.map((event, index) => (
            <Grid xs={12} sm={6} md={4} key={event._id} sx={{ padding: 1 }}>
              <Card
                elevation={6} // Consistent shadow
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: `0 8px 16px ${theme.palette.action.hoverOpacity * theme.palette.primary.main}`,
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="180"
                 image={event.imageUrl ? `${import.meta.env.VITE_BACKEND_URL}${event.imageUrl}` : defaultEventImage}

                  alt={event.title}
                  sx={{
                    width: '100%',
                    objectFit: 'cover',
                    borderTopLeftRadius: theme.shape.borderRadius,
                    borderTopRightRadius: theme.shape.borderRadius,
                  }}
                />
                <CardContent sx={{ flexGrow: 1, p: 3, position: 'relative' }}>
                  {/* The Favorite Button icon has been removed from here */}
                  <Link to={`/events/${event._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Typography variant="h6" component="h3" gutterBottom color="text.primary" sx={{ fontWeight: 600, mb: 1.5 }}>
                      {event.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, height: 40, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {event.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Time:</strong> {event.time}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Location:</strong> {event.location}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Spots:</strong> {event.availableSpots} | Attending: {event.attendees.length}
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                      Created by: {event.creator ? event.creator.name : 'N/A'}
                    </Typography>
                  </Link>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default HomePage;
