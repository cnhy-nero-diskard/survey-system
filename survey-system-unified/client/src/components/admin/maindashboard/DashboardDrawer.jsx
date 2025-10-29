import React from 'react';
import { Drawer, List, ListItem, Toolbar, ListItemText, Typography, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const DashboardDrawer = ({ drawerWidth }) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#E0F7FF',
        },
      }}
    >
      <Toolbar />
      <List>
        <ListItem>
          <Typography variant="h6" style={{ color: '#007ACC', marginLeft: 8 }}>
            TPMS ADMIN DASHBOARD
          </Typography>
        </ListItem>
        <ListItem>
          <Typography variant="body2" style={{ marginLeft: 8 }}>
            Department of Tourism
          </Typography>
        </ListItem>
        <ListItem>
          <IconButton>
            <SearchIcon />
          </IconButton>
          <input
            type="text"
            placeholder="Search"
            style={{ border: 'none', outline: 'none', marginLeft: 8 }}
          />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Graphs" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Panglao Overall Sentiments" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Panglao Overall / Barangay" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Barangay / Category" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Barangay" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Log Out" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default DashboardDrawer;