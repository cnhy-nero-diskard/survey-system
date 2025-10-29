import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, AppBar, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import SettingsIcon from '@mui/icons-material/Settings';

// Pages
const HomePage = () => <Typography variant="h4" style={{ padding: '20px' }}>Welcome to the Home Page!</Typography>;
const AboutPage = () => <Typography variant="h4" style={{ padding: '20px' }}>About Us</Typography>;
const SettingsPage = () => <Typography variant="h4" style={{ padding: '20px' }}>Settings</Typography>;

 function SampleDrawer() {
  return (
    <Router>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6">My App</Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" style={{ width: '240px', flexShrink: 0 }}>
        <Toolbar /> {/* Empty Toolbar to push content below AppBar */}
        <List>
          <ListItem button component={Link} to="/">
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button component={Link} to="/about">
            <ListItemIcon><InfoIcon /></ListItemIcon>
            <ListItemText primary="About" />
          </ListItem>
          <ListItem button component={Link} to="/settings">
            <ListItemIcon><SettingsIcon /></ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
        </List>
      </Drawer>
      <div style={{ marginLeft: '240px', padding: '20px' }}>
        <Toolbar /> {/* Empty Toolbar to push content below AppBar */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default SampleDrawer;