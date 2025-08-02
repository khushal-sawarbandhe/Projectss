// src/components/Footer.jsx
import React from 'react';
import { Box, Typography, Container, Link as MuiLink } from '@mui/material';
import { useTheme } from '@mui/material/styles';

function Footer() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        bgcolor: theme.palette.grey[900], // New dark grey color
        color: 'white', // White text on dark footer
        py: 4, // Increased vertical padding
        mt: 'auto', // Push footer to the bottom if content is short
        textAlign: 'center',
        boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)' // Subtle shadow for separation
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" sx={{ mb: 1 }}>
          &copy; {new Date().getFullYear()} Moments. All rights reserved.
        </Typography>
        <Typography variant="body2">
          <MuiLink href="/" color="inherit" sx={{ mx: 1, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>Home</MuiLink> {/* NEW Home Link */}
          |
          <MuiLink href="/about" color="inherit" sx={{ mx: 1, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>About Us</MuiLink>
          |
          <MuiLink href="/services" color="inherit" sx={{ mx: 1, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>Services</MuiLink>
          |
          <MuiLink href="/contact" color="inherit" sx={{ mx: 1, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>Contact</MuiLink>
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;