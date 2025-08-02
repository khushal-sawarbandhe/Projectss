// src/App.jsx
import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
// Import MUI Components
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
// For Search Input
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
// For Responsive Navigation (Hamburger Menu)
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import EventIcon from '@mui/icons-material/Event';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InfoIcon from '@mui/icons-material/Info';
import PhoneIcon from '@mui/icons-material/Phone';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';

// Page Components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreateEventPage from './pages/CreateEventPage';
import EventDetailsPage from './pages/EventDetailsPage';
import EditEventPage from './pages/EditEventPage';
import UserDashboardPage from './pages/UserDashboardPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactPage from './pages/ContactPage';
import ServicesPage from './pages/ServicesPage';
// Custom Components
import PrivateRoute from './components/PrivateRoute';
import Footer from './components/Footer';

// Global CSS
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const userName = localStorage.getItem('userName');
    const userId = localStorage.getItem('userId');

    if (token && userName && userId) {
      setUser({ token, name: userName, id: userId });
      if (location.pathname === '/login' || location.pathname === '/register') {
        navigate('/');
      }
    } else {
      setUser(null);
      // *** THE REDIRECT LOGIC FOR UNAUTHENTICATED USERS IS NOW REMOVED.
      // Unauthenticated users will now land on the home page as desired.
    }
  }, [location.pathname, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    setUser(null);
    alert('Logged out successfully!');
    navigate('/login');
    window.location.reload();
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const navItems = [
    { text: 'Home', path: '/', icon: <HomeIcon /> },
    { text: 'About Us', path: '/about', icon: <InfoIcon /> },
    { text: 'Services', path: '/services', icon: <MiscellaneousServicesIcon /> },
    { text: 'Contact', path: '/contact', icon: <PhoneIcon /> },
  ];

  const authNavItems = [
    { text: 'Create Event', path: '/create-event', icon: <EventIcon />, requiresAuth: true },
    { text: 'Dashboard', path: '/dashboard', icon: <DashboardIcon />, requiresAuth: true },
  ];

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static" color="primary">
        <Toolbar sx={{ minHeight: { xs: 56, md: 64 } }}>
          {/* Hamburger Icon for Small Screens */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, display: { xs: 'flex', md: 'none' } }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', flexGrow: 1.5 }}>
            <Box
              component="img"
              src="/image.png"
              alt="Moments Logo"
              sx={{
                height: 50,
                width: 'auto',
                objectFit: 'contain',
                mr: 1.5,
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.1) rotate(5deg)',
                },
              }}
            />
          </Link>

          {/* Desktop Navigation Links */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {navItems.map((item) => (
              <Button key={item.path} color="inherit" component={Link} to={item.path}>
                {item.text}
              </Button>
            ))}
            {user && (
              <>
                {authNavItems.map((item) => (
                  <Button key={item.path} color="inherit" component={Link} to={item.path}>
                    {item.text}
                  </Button>
                ))}
              </>
            )}
          </Box>

          {/* Search Input on Desktop (Conditional Rendering) */}
          {user && (
            <Box sx={{ flexGrow: 0.5, display: { xs: 'none', md: 'flex' }, mr: 2 }}>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search events..."
                value={globalSearchTerm}
                onChange={(e) => setGlobalSearchTerm(e.target.value)}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'white' }} />
                    </InputAdornment>
                  ),
                  style: { borderRadius: '5px', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' },
                  classes: { notchedOutline: 'transparent-border' }
                }}
                sx={{
                  width: 150,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.5) !important',
                  },
                  '& .MuiInputBase-input::placeholder': {
                      color: 'white !important',
                      opacity: 1,
                  }
                }}
              />
            </Box>
          )}

          {/* User/Auth Links on Desktop */}
          <Box sx={{ display: { xs: 'flex', md: 'flex' } }}>
            {user ? (
              <>
                <Typography variant="body1" sx={{ mr: 2, color: 'white', display: 'flex', alignItems: 'center' }}>
                  Welcome, {user.name}!
                </Typography>
                <Button color="inherit" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
                <Button color="inherit" onClick={() => navigate('/register')}>Register</Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250, bgcolor: 'background.paper', height: '100%', color: 'text.primary' }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            <ListItem sx={{ py: 2, justifyContent: 'center' }}>
                <Box
                    component="img"
                    src="/image.png"
                    alt="Moments Logo"
                    sx={{ height: 50 }}
                />
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/" onClick={toggleDrawer(false)}>
                <ListItemIcon><HomeIcon sx={{color: 'text.primary'}} /></ListItemIcon>
                <ListItemText primary="Home" />
              </ListItemButton>
            </ListItem>

            {navItems.map((item) => (
                <ListItem key={item.path} disablePadding>
                    <ListItemButton component={Link} to={item.path} onClick={toggleDrawer(false)}>
                        <ListItemIcon sx={{color: 'text.primary'}}>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItemButton>
                </ListItem>
            ))}

            {user && (
                <ListItem disablePadding>
                    <ListItemButton onClick={() => { setGlobalSearchTerm(''); toggleDrawer(false)(); }}>
                        <ListItemIcon><SearchIcon sx={{ color: 'text.primary' }} /></ListItemIcon>
                        <ListItemText primary="Clear Search" />
                    </ListItemButton>
                </ListItem>
            )}

            {user && (
                <>
                    {authNavItems.map((item) => (
                    <ListItem key={item.path} disablePadding>
                        <ListItemButton component={Link} to={item.path} onClick={toggleDrawer(false)}>
                        <ListItemIcon sx={{color: 'text.primary'}}>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                    ))}
                </>
            )}

            {!user && (
                <>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/login" onClick={toggleDrawer(false)}>
                        <ListItemIcon><HomeIcon sx={{color: 'text.primary'}} /></ListItemIcon>
                        <ListItemText primary="Login" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/register" onClick={toggleDrawer(false)}>
                        <ListItemIcon><HomeIcon sx={{color: 'text.primary'}} /></ListItemIcon>
                        <ListItemText primary="Register" />
                        </ListItemButton>
                    </ListItem>
                </>
            )}
          </List>
        </Box>
      </Drawer>

      <Box
        sx={{
          flexGrow: 1,
          display: isAuthPage ? 'flex' : 'block',
          justifyContent: isAuthPage ? 'center' : 'flex-start',
          alignItems: isAuthPage ? 'center' : 'flex-start',
          backgroundImage: isAuthPage ? 'url(https://images.unsplash.com/photo-1514525253164-ffc2ce82fe2d?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)' : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'relative',
          '&::before': isAuthPage ? {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: -1,
          } : {},
          p: isAuthPage ? 0 : 3,
          mt: isAuthPage ? '64px' : '64px',
        }}
      >
        <Routes>
          <Route path="/" element={<HomePage globalSearchTerm={globalSearchTerm} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/events/:id" element={<EventDetailsPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/create-event" element={<CreateEventPage />} />
            <Route path="/event/edit/:id" element={<EditEventPage />} />
            <Route path="/dashboard" element={<UserDashboardPage />} />
          </Route>
        </Routes>
      </Box>
      <Footer />
    </Box>
  );
}
export default App;