// src/pages/CreateEventPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Import MUI Components
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'; // Icon for image upload

function CreateEventPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    availableSpots: '',
  });
  const [eventImage, setEventImage] = useState(null); // State for the image file
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setEventImage(e.target.files[0]); // Get the selected file
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
      const userToken = localStorage.getItem('userToken');
      if (!userToken) {
        setError('You must be logged in to create an event.');
        navigate('/login');
        return;
      }

      // Create FormData object to send both text fields and file
      const dataToSend = new FormData();
      for (const key in formData) {
        dataToSend.append(key, formData[key]);
      }
      if (eventImage) {
        dataToSend.append('eventImage', eventImage); // 'eventImage' matches the name in multer.single()
      }

     const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/events`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${userToken}`,
  },
  body: dataToSend,
});

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create event');
      }

      setSuccess('Event created successfully!');
      alert('Event created successfully!'); // Can replace with MUI Snackbar/Dialog later
      setFormData({ // Clear form after successful submission
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        availableSpots: '',
      });
      setEventImage(null); // Clear image input
      navigate('/'); // Redirect to home page
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 120px)', py: 4, px: 2 }}>
      <Card sx={{ maxWidth: 600, width: '100%', p: { xs: 2, sm: 4 }, bgcolor: 'background.paper', borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom align="center" color="text.primary" sx={{ mb: 3, fontWeight: 700 }}>
            Create New Event
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
              multiline // Enable multiline input
              rows={4} // Set initial rows for textarea
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
              type="date" // Use HTML5 date input
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
              type="time" // Use HTML5 time input
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
              type="number" // Use number input
              value={formData.availableSpots}
              onChange={handleChange}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 3 }}
            />

            {/* NEW: Image Upload Input */}
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <Button
                variant="outlined"
                component="label" // Make button act as label for file input
                startIcon={<AddPhotoAlternateIcon />}
                sx={{ py: 1.5, borderRadius: '10px', mr: 2 }}
              >
                Upload Image
                <input
                  type="file"
                  id="eventImage"
                  name="eventImage"
                  hidden // Hide the default file input
                  accept="image/png, image/jpeg, image/gif" // Accept only image files
                  onChange={handleImageChange}
                />
              </Button>
              <Typography variant="body2" color="text.secondary">
                {eventImage ? eventImage.name : 'No file selected'}
              </Typography>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              Create Event
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default CreateEventPage;
