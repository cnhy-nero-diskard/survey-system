import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Button,
  Modal,
} from "@mui/material";

import { Circle } from "@mui/icons-material";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import AdminSessionDashboard from "../adminsessiondashboard/AdminLogins";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const dummyData = {
  geographicDistribution: {
    USA: 50,
    Canada: 30,
    UK: 20,
    Germany: 10,
  },
  languagePreferences: {
    English: 70,
    French: 20,
    Spanish: 10,
  },
};

const UsersDashboard = () => {
  const [anonymousUsers, setAnonymousUsers] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  // Fetch anonymous users data from the backend every 5 seconds
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_HOST}/api/admin/anonymous-users`,
          {
            credentials: "include",
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        const data = await response.json();
        setAnonymousUsers(data);
      } catch (error) {
        console.error("Error fetching anonymous users:", error);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const activeUsers = anonymousUsers.filter((user) => user.is_active).length;

  const geographicData = {
    labels: Object.keys(dummyData.geographicDistribution),
    datasets: [
      {
        label: "Users by Country",
        data: Object.values(dummyData.geographicDistribution),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  const languageData = {
    labels: Object.keys(dummyData.languagePreferences),
    datasets: [
      {
        label: "Language Preferences",
        data: Object.values(dummyData.languagePreferences),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  return (
    <Box sx={{ flexGrow: 1, padding: 3, height: "100vh", display: "flex", flexDirection: "column" }}>
      <Typography variant="h4" gutterBottom>
        Users Dashboard
      </Typography>

      {/* Grid Layout */}
      <Grid container spacing={3} sx={{ flexGrow: 1 }}>
        {/* Active Admins Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%", width: '100%', display: "flex", flexDirection: "column" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Active Admins
              </Typography>
              <AdminSessionDashboard />
            </CardContent>
          </Card>
        </Grid>

        {/* Active Users Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Active Users: {activeUsers} users taking surveys
              </Typography>
              <Button variant="contained" onClick={() => setOpenModal(true)}>
                View All Users
              </Button>
            </CardContent>
          </Card>
        </Grid>
 
  

      </Grid>

      {/* Modal for All Users */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 800,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            maxHeight: "80vh", // Restrict the height of the modal to 80% of the viewport height
            overflowY: "auto", // Enable vertical scrolling if content exceeds the height
          }}
        >
          <Typography variant="h6" gutterBottom>
            All Users
          </Typography>
          <TableContainer
            component={Paper}
            sx={{
              maxHeight: "60vh", // Restrict the height of the table container
              overflowY: "auto", // Enable vertical scrolling for the table
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nickname</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {anonymousUsers.map((user) => (
                  <TableRow key={user.anonymous_user_id}>
                    <TableCell>{user.anonymous_user_id}</TableCell>
                    <TableCell>{user.nickname}</TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleString()}</TableCell>
                    <TableCell>
                      {user.is_active ? (
                        <Circle sx={{ color: "green", fontSize: "small" }} />
                      ) : (
                        <Circle sx={{ color: "red", fontSize: "small" }} />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Modal>
    </Box>
  );
};

export default UsersDashboard;  