// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// Import MUI Components
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('userToken', data.token);
      localStorage.setItem('userName', data.name);
      localStorage.setItem('userId', data._id);

      alert('Login Successful!'); // Consider replacing with MUI Snackbar/Dialog later
      navigate('/');
      window.location.reload();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    // The outer Box from App.jsx now handles the full background and centering.
    // This component only needs to provide the Card.
    // Removed minHeight, backgroundImage, position: absolute, transform from this Box.
    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4, px: 2 }}> {/* Center content in main App Container */}
      <Card
        sx={{
          maxWidth: 400,
          width: '100%',
          p: { xs: 3, sm: 5 },
          bgcolor: 'rgba(255, 255, 255, 0.95)', // White background
          borderRadius: 4,
          boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3)',
          // Removed position: 'absolute' and transform as parent Box handles centering
          my: 2 // Add some vertical margin, if needed, within the flex container
        }}
      >
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom align="center" color="text.primary" sx={{ mb: 3, fontWeight: 700 }}>
            Login
          </Typography>
          {error && <Typography color="error" align="center" sx={{ mb: 2 }}>{error}</Typography>}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Username/Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 3 }}
              InputProps={{ style: { borderRadius: '10px', backgroundColor: 'white', color: '#333' } }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 3 }}
              InputProps={{
                style: { borderRadius: '10px', backgroundColor: 'white', color: '#333' },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      sx={{ color: '#333' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2, py: 1.5, borderRadius: '10px', backgroundColor: '#333', '&:hover': { backgroundColor: '#555' } }}
            >
              Login
            </Button>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              sx={{ mb: 2, py: 1.5, borderRadius: '10px', borderColor: '#333', color: '#333', '&:hover': { borderColor: '#555', color: '#555', backgroundColor: 'transparent' } }}
            >
              Forgot Password
            </Button>
            <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 2 }}>
              Don't have an account? <Link to="/register" style={{ color: '#6200EE', textDecoration: 'underline' }}>Register</Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default LoginPage;