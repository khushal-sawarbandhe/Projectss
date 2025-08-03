// src/pages/EditEventPage.jsx
import React, { useState, useEffect } from 'react'; // Import React
import { useParams, useNavigate, Link } from 'react-router-dom';
// Import MUI Components
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'; // Import icon
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'; // Import delete icon
// NEW IMPORTS FOR ICONS AND INPUT ADORNMENTS
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
// END NEW IMPORTS

function EditEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    availableSpots: '',
  });
  const [eventImage, setEventImage] = useState(null); // State for the newly selected image file
  const [existingImageUrl, setExistingImageUrl] = useState(''); // State for the current image URL from DB
  const [imagePreview, setImagePreview] = useState(null); // State for previewing the newly selected image
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const userToken = localStorage.getItem('userToken'); // Get user token for auth checks
  const userId = localStorage.getItem('userId'); // Get user ID for creator check

  // Fetch event data to pre-fill the form
  useEffect(() => {
      const fetchEvent = async () => {
          setLoading(true);
          setError(null);
          try {
             const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/events/${id}`);

              if (!response.ok) {
                  const errorData = await response.json();
                  throw new Error(errorData.message || 'Failed to fetch event details');
              }
              const data = await response.json();

              // Check if current user is the creator (important for security)
              if (data.creator._id !== userId) {
                  alert('You are not authorized to edit this event.'); // Consider MUI Snackbar/Dialog
                  navigate('/'); // Redirect if not authorized
                  return;
              }

              // Pre-fill form data
              setFormData({
                  title: data.title,
                  description: data.description,
                  date: new Date(data.date).toISOString().split('T')[0], // Format date for input
                  time: data.time,
                  location: data.location,
                  availableSpots: data.availableSpots,
              });
             setExistingImageUrl(data.imageUrl ? `${import.meta.env.VITE_BACKEND_URL}${data.imageUrl}` : '');
 // Set existing image
              setImagePreview(null); // Clear any old preview

          } catch (err) {
              setError(err.message);
          } finally {
              setLoading(false);
          }
      };

      if (userToken && userId) { // Only fetch if user is potentially logged in
          fetchEvent();
      } else { // Handle case where user is not logged in on page load (PrivateRoute should catch this)
          alert('You must be logged in to edit an event.');
          navigate('/login');
      }
  }, [id, userToken, userId, navigate]); // Add dependencies

  const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
      const file = e.target.files?.[0]; // Use optional chaining
      setEventImage(file);
      setImagePreview(file ? URL.createObjectURL(file) : null);
      setExistingImageUrl(''); // Clear existing image when new one is selected
  };

  const handleClearImage = () => {
      setEventImage(null);
      setImagePreview(null);
      setExistingImageUrl(''); // Clear existing image
  };


  const handleSubmit = async (e) => {
      e.preventDefault();
      setError(null);
      setSuccess(null);

      if (formData.availableSpots < 1) {
          setError('Available spots must be at least 1.');
          return;
      }

      try {
          if (!userToken) {
              setError('You must be logged in to edit an event.');
              navigate('/login');
              return;
          }

          const dataToSend = new FormData();
          for (const key in formData) {
              dataToSend.append(key, formData[key]);
          }

          // Handle image logic for FormData
          if (eventImage) {
              dataToSend.append('eventImage', eventImage); // New file to upload
          } else if (!existingImageUrl && !imagePreview) {
              // If existing image was cleared and no new one selected, send flag to clear on backend
              dataToSend.append('clearImage', 'true'); 
          }
          // If existingImageUrl is present and no new file, do nothing to dataToSend for image

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/events/${id}`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${userToken}`,
  },
  body: dataToSend,
});


          const responseData = await response.json();

          if (!response.ok) {
              throw new Error(responseData.message || 'Failed to update event');
          }

          setSuccess('Event updated successfully!');
          alert('Event updated successfully!'); // Consider MUI Snackbar/Dialog
          navigate(`/events/${id}`); // Go back to event details page
      } catch (err) {
          setError(err.message);
      }
  };

  if (loading) {
      return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 120px)' }}><CircularProgress /></Box>;
  }

  if (error) {
      // Handle unauthorized error for display (PrivateRoute already redirects)
      if (error === 'You are not authorized to edit this event.') {
          return <Typography color="error" align="center" sx={{ mt: 4 }}>{error}</Typography>;
      }
      return <Typography color="error" align="center" sx={{ mt: 4 }}>Error: {error}</Typography>;
  }

  return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 120px)', py: 4, px: 2 }}>
          <Card sx={{ maxWidth: 600, width: '100%', p: { xs: 2, sm: 4 }, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                  <Typography variant="h5" component="h2" gutterBottom align="center" color="text.primary" sx={{ mb: 3, fontWeight: 700 }}>
                      Edit Event: {formData.title || 'Loading...'}
                  </Typography>
                  {error && <Typography color="error" align="center" sx={{ mb: 2 }}>{error}</Typography>}
                  {success && <Typography color="success" align="center" sx={{ mb: 2 }}>{success}</Typography>}
                  <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                      <TextField
                          margin="normal"
                          required
                          fullWidth
                          id="title"
                          label="Event Title"
                          name="title"
                          autoFocus
                          value={formData.title}
                          onChange={handleChange}
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          sx={{ mb: 3 }}
                      />
                      <TextField
                          margin="normal"
                          required
                          fullWidth
                          id="description"
                          label="Event Description"
                          name="description"
                          multiline
                          rows={4}
                          value={formData.description}
                          onChange={handleChange}
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          sx={{ mb: 3 }}
                      />
                      <TextField
                          margin="normal"
                          required
                          fullWidth
                          id="date"
                          label="Date"
                          name="date"
                          type="date"
                          value={formData.date}
                          onChange={handleChange}
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          sx={{ mb: 3 }}
                      />
                      <TextField
                          margin="normal"
                          required
                          fullWidth
                          id="time"
                          label="Time"
                          name="time"
                          type="time"
                          value={formData.time}
                          onChange={handleChange}
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          sx={{ mb: 3 }}
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
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          sx={{ mb: 3 }}
                      />
                      <TextField
                          margin="normal"
                          required
                          fullWidth
                          id="availableSpots"
                          label="Available Spots"
                          name="availableSpots"
                          type="number"
                          value={formData.availableSpots}
                          onChange={handleChange}
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          sx={{ mb: 3 }}
                      />

                      {/* NEW: Image Upload & Preview Section for Edit */}
                      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                          <Button
                              variant="outlined"
                              component="label"
                              startIcon={<AddPhotoAlternateIcon />}
                              sx={{ py: 1.5, borderRadius: '10px', mr: 2, mb: { xs: 2, sm: 0 } }}
                          >
                              {existingImageUrl || imagePreview ? 'Change Image' : 'Upload Image'}
                              <input
                                  type="file"
                                  id="eventImage"
                                  name="eventImage"
                                  hidden
                                  accept="image/png, image/jpeg, image/gif"
                                  onChange={handleImageChange}
                              />
                          </Button>
                          {imagePreview && (
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <img src={imagePreview} alt="New Preview" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: '4px', marginRight: '8px' }} />
                                  <Typography variant="body2" color="text.secondary">
                                      {eventImage ? eventImage.name : 'Selected file'}
                                  </Typography>
                                  <IconButton onClick={handleClearImage} color="error" size="small">
                                      <DeleteForeverIcon />
                                  </IconButton>
                              </Box>
                          )}
                          {!imagePreview && existingImageUrl && (
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <img src={existingImageUrl} alt="Existing" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: '4px', marginRight: '8px' }} />
                                  <Typography variant="body2" color="text.secondary">
                                      Existing Image
                                  </Typography>
                                  <IconButton onClick={handleClearImage} color="error" size="small">
                                      <DeleteForeverIcon />
                                  </IconButton>
                              </Box>
                          )}
                          {!imagePreview && !existingImageUrl && (
                              <Typography variant="body2" color="text.secondary">No file selected</Typography>
                          )}
                      </Box>
                      {/* END NEW IMAGE SECTION */}

                      <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          color="primary"
                          sx={{ mt: 3, mb: 2, py: 1.5 }}
                      >
                          Update Event
                      </Button>
                      <Button
                          type="button"
                          fullWidth
                          variant="outlined"
                          color="secondary"
                          onClick={() => navigate(`/events/${id}`)}
                          sx={{ py: 1.5 }}
                      >
                          Cancel
                      </Button>
                  </Box>
              </CardContent>
          </Card>
      </Box>
  );
}
export default EditEventPage;
