import React, { useState } from "react";
import axios from "axios"; // Import Axios
import {
  Drawer,
  Box,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import styled from "@emotion/styled";
import { Link, useLocation } from "react-router-dom";
import {
  Dashboard as DashboardIcon,
  LocationCity as MunicipalityIcon,
  Map as BarangayIcon,
  BeachAccessOutlined as AttIcon,
  Business as EstablishmentIcon,
  Timeline as GraphIcon,
  ExitToApp as LogoutIcon,
  InsightsRounded as InsightsIcon,
  PollRounded as SurveyIcon,
  ApiRounded as AiToolsIcon,
  ComputerOutlined as CompIcon,
  VerifiedUserOutlined as UserIcon,
  QrCode2Outlined as SurveyTouchpointsIcon,
  Storage as DBIcon,
} from "@mui/icons-material";

import "@fontsource/poppins/300.css"; // Light
import "@fontsource/poppins/400.css"; // Regular
import "@fontsource/poppins/500.css"; // Medium
import "@fontsource/poppins/700.css"; // Bold

import UsersDashboard from "../usersdashboard/UsersDashboard";

// Styled Components
const SidebarDrawer = styled(Drawer)`
  width: ${({ drawerWidth }) => drawerWidth}px;
  flex-shrink: 0;

  & .MuiDrawer-paper {
    width: ${({ drawerWidth }) => drawerWidth}px;
    box-sizing: border-box;
    background: linear-gradient(to bottom, #d9f1ff, #ade7ff);
    border-right: none;
    font-family: "Poppins", sans-serif;
  }
`;

const SidebarHeader = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background: linear-gradient(to bottom, #0077b6, #023e8a);
  color: white;
  font-family: "Poppins", sans-serif;
`;

const SearchField = styled(TextField)`
  margin: 16px;
  background-color: white;
  border-radius: 4px;
  width: calc(100% - 32px);

  & .MuiInputBase-input {
    font-family: "Poppins", sans-serif;
  }
`;

const CustomTypography = styled(Typography)`
  font-family: "Poppins", sans-serif;
`;

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, to: "dashboard" },
  { text: "Municipality Data", icon: <MunicipalityIcon />, to: "overallmun" },
  { text: "Per Area Data", icon: <BarangayIcon />, to: "barangaydashboard" },
  { text: "Per Attraction Data", icon: <AttIcon />, to: "attractiondashboard" },
  { text: "Per Establishment Data", icon: <EstablishmentIcon />, to: "establishmentdashboard" },
  { text: "Survey Metrics", icon: <SurveyIcon />, to: "surveymetrics" },
  { text: "Survey Statistics", icon: <GraphIcon />, to: "stally" },
  { text: "AI Tools", icon: <AiToolsIcon />, to: "aitoolsdashboard" },
  { text: "Users Dashboard", icon: <UserIcon />, to: "usersdashboard" },
  { text: "Survey Touchpoints", icon: <SurveyTouchpointsIcon />, to: "surveytouchpoints" },
  { text: "Data Manager", icon: <CompIcon />, to: "datamanager" },
  // { text: "Sentiment Analysis", icon: <InsightsIcon />, to: "sentimentgraphs" },
  { text: "System Performance", icon: <CompIcon />, to: "systemperf" },
  { text: "LOGSTREAM", icon: <SurveyTouchpointsIcon />, to: "logstream" },
];

const Sidebar = ({ drawerWidth }) => {
  const location = useLocation();
  function getBasename(pathname) {
    const parts = pathname.split('/').filter(Boolean);
    return parts.length > 0 ? parts[parts.length - 1] : '/';
  }
  // State for storing the search term
  const [searchTerm, setSearchTerm] = useState("");

  // Handle changes in the search input
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter the menu items by the search term
  const filteredItems = menuItems.filter((item) =>
    item.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = async () => {
    try {
      console.log("Logging out...");
      const response = await fetch(
        `${process.env.REACT_APP_API_HOST}/api/auth/logout`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      console.log(response.status);
      if (response.status === 200) {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <SidebarDrawer variant="permanent" drawerWidth={drawerWidth}>
      <Toolbar />
      <SidebarHeader>
        <CustomTypography variant="h6" align="center" fontWeight="bold">
          MULTILINGUAL SURVEY SYSTEM ADMIN DASHBOARD
        </CustomTypography>
        <CustomTypography variant="subtitle2" align="center">
          PANGLAO TOURISM OFFICE
        </CustomTypography>
      </SidebarHeader>

      {/* Search Field */}
      <SearchField
        placeholder="Search"
        fullWidth
        variant="outlined"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <Divider />

      <Box sx={{ overflow: "auto" }}>
        <List>
          {filteredItems.map((item, index) => (
            <ListItem
              button
              component={Link}
              to={item.to}
              key={index}
              sx={{
                backgroundColor:
                getBasename(location.pathname) === item.to ? "#0077b6" : "inherit",
                color: getBasename(location.pathname) === item.to ? "white" : "inherit",
                "&:hover": {
                  backgroundColor:
                  getBasename(location.pathname) === item.to ? "#005f8a" : "#f0f0f0",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color:
                  getBasename(location.pathname) === item.to ? "white" : "inherit",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{ fontFamily: "Poppins, sans-serif" }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          startIcon={<LogoutIcon />}
          sx={{ fontFamily: "Poppins, sans-serif" }}
          onClick={handleLogout}
        >
          Log Out
        </Button>
      </Box>
    </SidebarDrawer>
  );
};

export default Sidebar;
