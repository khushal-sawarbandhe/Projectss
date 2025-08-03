// src/pages/RegisterPage.jsx
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

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const { name, email, password } = formData;
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      alert('Registration Successful! Please log in.'); // Consider replacing with MUI Snackbar/Dialog later
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => { event.preventDefault(); };
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);
  const handleMouseDownConfirmPassword = (event) => { event.preventDefault(); };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column', // Align content vertically
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 64px)', // Account for AppBar height
        flexGrow: 1, // Allows this box to take up remaining height
        // Background image is handled by App.jsx or index.css
      }}
    >
      <Card
        sx={{
          maxWidth: 400,
          width: '100%',
          p: { xs: 3, sm: 5 },
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: 4,
          boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3)',
          my: 2 // Add some vertical margin
        }}
      >
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom align="center" color="text.primary" sx={{ mb: 3, fontWeight: 700 }}>
            Register
          </Typography>
          {error && <Typography color="error" align="center" sx={{ mb: 2 }}>{error}</Typography>}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={formData.name}
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
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
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
              autoComplete="new-password"
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
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 3 }}
              InputProps={{
                style: { borderRadius: '10px', backgroundColor: 'white', color: '#333' },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={handleMouseDownConfirmPassword}
                      edge="end"
                      sx={{ color: '#333' }}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
              Register
            </Button>
            <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 2 }}>
              Already have an account? <Link to="/login" style={{ color: '#6200EE', textDecoration: 'underline' }}>Login</Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default RegisterPage;
