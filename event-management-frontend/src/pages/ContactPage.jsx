// src/pages/ContactPage.jsx
import React from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';

function ContactPage() {
  // You can add state and handleSubmit for a real contact form later
  return (
    <Box sx={{ my: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3, textAlign: 'left', color: 'text.primary' }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Contact Us
      </Typography>
      <Typography variant="body1" paragraph>
        Have questions, feedback, or suggestions? We'd love to hear from you! Please fill out the form below or reach out to us via the contact details provided.
      </Typography>

      <Box component="form" sx={{ mt: 3, mb: 3 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          label="Your Name"
          name="name"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 3 }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Your Email"
          name="email"
          type="email"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 3 }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="message"
          label="Your Message"
          name="message"
          multiline
          rows={4}
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 3 }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ py: 1.5, borderRadius: '10px' }}
        >
          Send Message
        </Button>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
        Email: support@moments.com<br/>
        Phone: +91 912345678<br/>
        Address: 123 Moments Office, Nagpue.MH, India
      </Typography>
    </Box>
  );
}

export default ContactPage;