// src/pages/ServicesPage.jsx
import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // Example icon

function ServicesPage() {
  return (
    <Box sx={{ my: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3, textAlign: 'left', color: 'text.primary' }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Our Services
      </Typography>
      <Typography variant="body1" paragraph>
        EventApp provides a comprehensive suite of services designed to make event management and participation effortless for everyone.
      </Typography>

      <List sx={{ mt: 3 }}>
        <ListItem>
          <ListItemIcon>
            <CheckCircleOutlineIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary={<Typography variant="h6" color="text.primary">Easy Event Creation</Typography>} secondary={<Typography color="text.secondary">Step-by-step wizard to set up events, manage details, and customize settings.</Typography>} />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <CheckCircleOutlineIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary={<Typography variant="h6" color="text.primary">Seamless Ticket Management</Typography>} secondary={<Typography color="text.secondary">Support for free and paid tickets, discount codes, and attendee tracking.</Typography>} />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <CheckCircleOutlineIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary={<Typography variant="h6" color="text.primary">Intuitive Event Discovery</Typography>} secondary={<Typography color="text.secondary">Powerful search and filtering tools to help attendees find the perfect events.</Typography>} />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <CheckCircleOutlineIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary={<Typography variant="h6" color="text.primary">Personalized Dashboards</Typography>} secondary={<Typography color="text.secondary">Attendees and organizers get personalized dashboards to manage their activities.</Typography>} />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <CheckCircleOutlineIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary={<Typography variant="h6" color="text.primary">Secure User Authentication</Typography>} secondary={<Typography color="text.secondary">Robust login and registration features to keep user data safe.</Typography>} />
        </ListItem>
      </List>

      <Typography variant="body1" paragraph sx={{ mt: 4 }}>
        We are constantly working to expand our services and features to meet the evolving needs of the event community.
      </Typography>
    </Box>
  );
}

export default ServicesPage;