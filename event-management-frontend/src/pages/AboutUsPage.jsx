// src/pages/AboutUsPage.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';

function AboutUsPage() {
  return (
    <Box sx={{ my: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3, textAlign: 'left', color: 'text.primary' }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        About Moments
      </Typography>
      <Typography variant="body1" paragraph>
        Welcome to Moments, your ultimate platform for discovering, creating, and managing amazing events! Whether you're looking for local meetups, concerts, workshops, or community gatherings, EventApp connects you to a world of experiences.
      </Typography>
      <Typography variant="body1" paragraph>
        Our mission is to simplify event management for organizers and make event discovery seamless for attendees. We believe in fostering vibrant communities through shared experiences and memorable moments.
      </Typography>
      <Typography variant="body1" paragraph>
        Founded in 2025, Moments is built with passion and dedication, leveraging modern technologies like the MERN stack to deliver a fast, reliable, and user-friendly experience. Join our community and start your event journey today!
      </Typography>
    </Box>
  );
}

export default AboutUsPage;
