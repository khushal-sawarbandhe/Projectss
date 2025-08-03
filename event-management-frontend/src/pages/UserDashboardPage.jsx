// src/pages/UserDashboardPage.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Import MUI Components
import { Box, Typography, Card, CardContent, Grid, CircularProgress, Button } from '@mui/material';
import EventIcon from '@mui/icons-material/Event'; // Icon for created events
import BeenhereIcon from '@mui/icons-material/Beenhere'; // Icon for RSVP'd events
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; // Icon for create event CTA

import { useTheme } from '@mui/material/styles';

function UserDashboardPage() {
  const [createdEvents, setCreatedEvents] = useState([]);
  const [rsvpdEvents, setRsvpdEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  const userToken = localStorage.getItem('userToken');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!userToken || !userId) {
        setError('You must be logged in to view the dashboard.');
        return;
      }

      try {
        setLoading(true);

     const createdResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}/events/created`, {

          headers: {
            'Authorization': `Bearer ${userToken}`,
          },
        });
        if (!createdResponse.ok) {
          const errorData = await createdResponse.json();
          throw new Error(errorData.message || `HTTP error! status: ${createdResponse.status} for created events`);
        }
        const createdData = await createdResponse.json();
        setCreatedEvents(createdData);

       const rsvpdResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}/events/rsvpd`, {

          headers: {
            'Authorization': `Bearer ${userToken}`,
          },
        });
        if (!rsvpdResponse.ok) {
          const errorData = await rsvpdResponse.json();
          throw new Error(errorData.message || `HTTP error! status: ${rsvpdResponse.status} for RSVPd events`);
        }
        const rsvpdData = await rsvpdResponse.json();
        setRsvpdEvents(rsvpdData);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [userToken, userId, navigate]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Typography color="error" sx={{ mt: 4 }}>Error: {error}</Typography>;
  if (!userToken) return <Typography color="error" sx={{ mt: 4 }}>Please log in to view your dashboard.</Typography>;

  return (
    <Box sx={{ my: 4 }}>
      <Typography
        variant="h3" // Larger main title
        component="h1"
        align="center"
        color="text.primary"
        sx={{ mb: 6, fontWeight: 700, textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }} // Bold and subtle shadow
      >
        Your Dashboard
      </Typography>

      {/* Events You Created Section */}
      <Typography
        variant="h4" // Slightly smaller, but still prominent
        component="h2"
        align="center"
        color="text.primary"
        sx={{ mb: 4, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <EventIcon sx={{ mr: 2, fontSize: '2rem' }} /> Events You Created
      </Typography>
      {createdEvents.length === 0 ? (
        <Box sx={{ textAlign: 'center', mb: 6, py: 4, px: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Looks like you haven't created any events yet!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/create-event"
            startIcon={<AddCircleOutlineIcon />}
            sx={{ mt: 2, px: 4, py: 1.5, fontSize: '1.1rem' }}
          >
            Create Your First Event
          </Button>
        </Box>
      ) : (
        <Grid container spacing={4} justifyContent="center" sx={{ mb: 8 }}> {/* Increased spacing and bottom margin */}
          {createdEvents.map(event => (
            <Grid item xs={12} sm={6} md={4} key={event._id}>
              <Card
                elevation={6} // Increased shadow for a more lifted look
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3, // More rounded corners
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)', // Subtle lift on hover
                    boxShadow: `0 8px 16px ${theme.palette.action.hoverOpacity * theme.palette.primary.main}`, // More prominent shadow on hover
                  },
                  p: 1 // Add slight padding around content
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Link to={`/events/${event._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Typography variant="h6" component="h3" gutterBottom color="text.primary" sx={{ fontWeight: 600, mb: 1.5 }}>
                      {event.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Location:</strong> {event.location}
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                      Spots: {event.availableSpots} | Attending: {event.attendees.length}
                    </Typography>
                  </Link>
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}> {/* Aligned to right */}
                     <Button
                        variant="outlined"
                        color="primary"
                        component={Link}
                        to={`/event/edit/${event._id}`}
                        sx={{ mr: 1 }}
                     >
                        Edit
                     </Button>
                     {/* Delete button logic will be added later */}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Events You've RSVP'd For Section */}
      <Typography
        variant="h4"
        component="h2"
        align="center"
        color="text.primary"
        sx={{ mb: 4, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <BeenhereIcon sx={{ mr: 2, fontSize: '2rem' }} /> Events You've RSVP'd For
      </Typography>
      {rsvpdEvents.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4, px: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h6" color="text.secondary">
            You haven't RSVP'd for any events yet. Check out the <Link to="/" style={{ color: theme.palette.primary.main, textDecoration: 'underline' }}>Home Page</Link> to find some!
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={4} justifyContent="center"> {/* Increased spacing */}
          {rsvpdEvents.map(event => (
            <Grid item xs={12} sm={6} md={4} key={event._id}>
              <Card
                elevation={6} // Increased shadow
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3, // More rounded corners
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: `0 8px 16px ${theme.palette.action.hoverOpacity * theme.palette.primary.main}`,
                  },
                  p: 1
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Link to={`/events/${event._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Typography variant="h6" component="h3" gutterBottom color="text.primary" sx={{ fontWeight: 600, mb: 1.5 }}>
                      {event.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Location:</strong> {event.location}
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

export default UserDashboardPage;
