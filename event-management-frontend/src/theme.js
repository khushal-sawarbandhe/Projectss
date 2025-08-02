// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light', // <--- SWITCH TO LIGHT MODE
    primary: {
      main: '#6a11cb', // Deep purple from your gradient
      light: '#9b4dff',
      dark: '#3d009a',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#2575fc', // Blue from your gradient
      light: '#6e9eff',
      dark: '#004aa9',
      contrastText: '#ffffff',
    },
    error: {
      main: '#CF6679', // Soft Red for errors/danger
    },
    warning: {
      main: '#FB8C00', // Orange for warnings
    },
    info: {
      main: '#2196F3', // Blue for info
    },
    success: {
      main: '#00C853', // Green for success
    },
    background: {
      default: '#f0f0f0', // Default background for pages (though index.css has gradient)
      paper: '#ffffff', // White background for cards, forms, etc.
    },
    text: {
      primary: '#333333', // Dark text color for readability on light backgrounds
      secondary: '#666666', // Medium grey for secondary text
    },
  },
  typography: {
    fontFamily: 'Poppins, Roboto, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '3.5rem',
      '@media (min-width:600px)': {
        fontSize: '4.5rem',
      },
    },
    h4: {
      fontWeight: 600,
      fontSize: '2.2rem',
      '@media (min-width:600px)': {
        fontSize: '2.5rem',
      },
    },
    h5: {
        fontWeight: 700, // Make form titles bolder
        fontSize: '1.8rem',
    },
    h6: {
      fontWeight: 600, // Make card titles bolder
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12, // More rounded corners for a softer look
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 10, // Match inputs for consistent roundedness
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)', // Slight lift effect on hover
          },
        },
        containedPrimary: {
            background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)', // Gradient button
            color: 'white', // Ensure text is white on gradient
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
            '&:hover': {
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
                background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)', // Keep gradient on hover
            },
        },
        // For other button types (like secondary, inherit) maintain light theme contrast
        textInherit: {
          color: 'white', // For AppBar buttons (when used with color="inherit")
        },
        containedError: { // For Logout/Delete buttons
            backgroundColor: '#CF6679', // Use error color from palette
            '&:hover': {
                backgroundColor: '#B04F67', // Darker shade on hover
            }
        }
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff', // White background for cards
          color: '#333333', // Dark text on white card
          borderRadius: 20, // More rounded corners for the container
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)', // Soft shadow
          padding: '20px', // Add internal padding to card by default
        },
      },
    },
    MuiAppBar: {
        styleOverrides: {
            root: {
                boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.5)',
                backgroundColor: '#1A1A2E', // Force dark background for AppBar
                color: '#ffffff', // Ensure text/icons are white in AppBar
            }
        }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#f8f8f8', // Light background for inputs
            borderRadius: 10, // Rounded input fields
            '& fieldset': {
              borderColor: '#e2e8f0', // Light border
            },
            '&:hover fieldset': {
              borderColor: '#b0b0b0', // Highlight on hover
            },
            '&.Mui-focused fieldset': {
              borderColor: '#6a11cb', // Highlight on focus (primary color)
              boxShadow: '0 0 0 3px rgba(106, 17, 203, 0.2)', // Soft focus glow
            },
            color: '#333333', // Input text color
          },
          '& .MuiOutlinedInput-input': {
            padding: '12px 15px', // Adjusted padding to match example
          },
          '& .MuiInputLabel-root': {
            color: '#666666', // Label color
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#6a11cb', // Label color on focus (primary)
          },
          '& .MuiInputLabel-root.MuiInputLabel-shrink': {
              top: '0px', // Adjust vertical position for shrunk label
              transform: 'translate(14px, -9px) scale(0.75)', // MUI default shrunk position
              color: '#666666 !important', // Stay consistent
          },
          '& .MuiInputLabel-root.MuiInputLabel-shrink.Mui-focused': {
              color: '#6a11cb !important',
          }
        },
      },
    },
  },
});

export default theme;