// src/pages/EventDetailsPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
// Import MUI Components
import { Box, Typography, Card, CardContent, Button, CircularProgress, Grid } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTheme } from '@mui/material/styles';

// Removed all Google Maps/Leaflet imports

function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rsvpMessage, setRsvpMessage] = useState(null);
  const [rsvpError, setRsvpError] = useState(null);

  // Removed map-related state
  // const [mapCenter, setMapCenter] = useState(null);
  // const [mapError, setMapError] = useState(null);
  // const [mapsApiKey, setMapsApiKey] = useState(null);
  // const [mapPosition, setMapPosition] = useState([51.505, -0.09]);
  // const [mapGeocodingError, setMapGeocodingError] = useState(null);

  const userToken = localStorage.getItem('userToken');
  const userId = localStorage.getItem('userId');

  // Removed map container style
  // const containerStyle = { ... };

  // Removed useJsApiLoader hook
  // const { isLoaded, loadError } = useJsApiLoader({ ... });

  // Removed Leaflet marker icon fix
  // delete L.Icon.Default.prototype._getIconUrl;
  // L.Icon.Default.mergeOptions({ ... });


  // Fetch event data (existing logic)
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/events/${id}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEvent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  // Removed: Fetch Google Maps API Key from backend useEffect
  // useEffect(() => { ... });

  // Removed: Geocoding useEffect
  // useEffect(() => { ... });


  const handleRsvp = async () => { /* ... existing code ... */
    setRsvpMessage(null);
    setRsvpError(null);

    if (!userToken) {
      alert('You must be logged in to RSVP.'); // Consider MUI Snackbar/Dialog
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/events/${id}/rsvp`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to RSVP');
      }

      setRsvpMessage(data.message);
      setEvent(prevEvent => ({
        ...prevEvent,
        attendees: [...prevEvent.attendees, { _id: userId }],
      }));
      alert(data.message);
    } catch (err) {
      setRsvpError(err.message);
    }
  };

  const handleDelete = async () => { /* ... existing code ... */
    if (!window.confirm('Are you sure you want to delete this event?')) {
        return;
    }

    if (!userToken) {
        alert('You must be logged in to delete an event.');
        navigate('/login');
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/events/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to delete event');
        }

        alert(data.message || 'Event deleted successfully!');
        navigate('/');
    } catch (err) {
        setError(err.message);
        alert(`Error deleting event: ${err.message}`);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 120px)' }}><CircularProgress /></Box>;
  if (error) return <Typography color="error" align="center" sx={{ mt: 4 }}>Error: {error}</Typography>;
  if (!event) return <Typography align="center" sx={{ mt: 4 }}>Event not found. Please check the URL or if the event exists.</Typography>;

  const isCreator = event.creator && event.creator._id === userId;
  const isAttending = event.attendees.some(attendee => attendee._id === userId);
  const spotsLeft = event.availableSpots - event.attendees.length;

  return (
    <Box sx={{ my: 4, display: 'flex', justifyContent: 'center' }}>
      <Card sx={{ maxWidth: 800, width: '100%', p: { xs: 2, sm: 4 }, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Button onClick={() => navigate('/')} startIcon={<ArrowBackIcon />} variant="outlined" color="secondary" sx={{ mb: 3 }}>
            Back to Events
          </Button>

          <Typography variant="h4" component="h1" gutterBottom color="text.primary" sx={{ fontWeight: 700, mb: 2 }}>
            {event.title}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {event.description}
          </Typography>

          {/* Display Event Image if available */}
          {event.imageUrl && (
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <img src={`http://localhost:5000${event.imageUrl}`} alt={event.title} style={{ maxWidth: '100%', height: 'auto', maxHeight: '300px', objectFit: 'contain', borderRadius: '8px' }} />
            </Box>
          )}


          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <EventIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.primary">
                  <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AccessTimeIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.primary">
                  <strong>Time:</strong> {event.time}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationOnIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.primary">
                  <strong>Location:</strong> {event.location}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PersonIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.primary">
                  <strong>Creator:</strong> {event.creator ? event.creator.name : 'Unknown'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <GroupsIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.primary">
                  <strong>Attendees:</strong> {event.attendees.length} / {event.availableSpots}
                  {spotsLeft <= 0 && <span style={{ color: theme.palette.error.main, marginLeft: '8px' }}>(Full)</span>}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                {spotsLeft > 0 ? (
                  <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                ) : (
                  <WarningIcon color="error" sx={{ mr: 1 }} />
                )}
                <Typography variant="body2" color="text.primary">
                  <strong>Spots Left:</strong> {spotsLeft >= 0 ? spotsLeft : 'Event is Full'}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Removed: Google Map Section */}
          {/* ... */}


          {userToken && !isCreator && !isAttending && spotsLeft > 0 && (
            <Button variant="contained" color="primary" onClick={handleRsvp} sx={{ mt: 3, py: 1.5 }}>
              RSVP for this Event
            </Button>
          )}
          {userToken && isAttending && <Typography variant="body1" color="success" sx={{ mt: 3 }}>You have RSVP'd for this event!</Typography>}
          {userToken && spotsLeft <= 0 && !isAttending && <Typography variant="body1" color="error" sx={{ mt: 3 }}>This event is full.</Typography>}

          {rsvpMessage && <Typography variant="body2" color="success" sx={{ mt: 1 }}>{rsvpMessage}</Typography>}
          {rsvpError && <Typography variant="body2" color="error" sx={{ mt: 1 }}>{rsvpError}</Typography>}

          {isCreator && (
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" color="secondary" startIcon={<EditIcon />} component={Link} to={`/event/edit/${event._id}`} sx={{ mr: 2 }}>
                Edit Event
              </Button>
              <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={handleDelete}>
                Delete Event
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default EventDetailsPage;