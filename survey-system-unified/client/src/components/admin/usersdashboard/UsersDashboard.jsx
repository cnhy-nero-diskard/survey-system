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
  CircularProgress,
} from "@mui/material";

import { Circle, VerifiedUserOutlined as UserIcon } from "@mui/icons-material";
import styled from "styled-components";
import AdminSessionDashboard from "../adminsessiondashboard/AdminLogins";
import { fontFamily } from "../../../config/fontConfig";
import { gradients } from "../shared/designTokens";

// Removed the chart.js registration plus the `dummyData` geographic/language
// datasets: both chart objects were built on every render and never rendered.

const PageShell = styled(Box)`
  background: ${gradients.page};
  min-height: 100vh;
  padding: 32px;
  font-family: ${fontFamily};
  box-sizing: border-box;
`;

const HeaderContainer = styled(Box)`
  background: ${gradients.brand};
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  color: white;
`;

const HeaderTitle = styled(Typography)`
  font-family: ${fontFamily};
  font-weight: 600;
  font-size: 28px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const GlassCard = styled(Card)`
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(10px);
  border-radius: 16px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2);
  height: 100%;
`;

const UsersDashboard = () => {
  const [anonymousUsers, setAnonymousUsers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const activeUsers = anonymousUsers.filter((user) => user.is_active).length;

  return (
    <PageShell>
      <HeaderContainer>
        <HeaderTitle>
          <UserIcon sx={{ fontSize: 32 }} />
          Users Dashboard
        </HeaderTitle>
        <Typography variant="subtitle1" sx={{ fontFamily, opacity: 0.9, mt: 0.5 }}>
          Admin sessions and anonymous survey participants, refreshed every 5 seconds
        </Typography>
      </HeaderContainer>

      {/* Grid Layout */}
      <Grid container spacing={3} alignItems="stretch">
        {/* Active Admins Section */}
        <Grid item xs={12} md={6}>
          <GlassCard elevation={0}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontFamily, fontWeight: 600, color: '#2d3748' }}>
                Active Admins
              </Typography>
              <AdminSessionDashboard />
            </CardContent>
          </GlassCard>
        </Grid>

        {/* Active Users Section */}
        <Grid item xs={12} md={6}>
          <GlassCard elevation={0}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontFamily, fontWeight: 600, color: '#2d3748' }}>
                Active Users
              </Typography>
              {isLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minHeight: 112 }} role="status" aria-live="polite">
                  <CircularProgress size={28} thickness={4} sx={{ color: '#667eea' }} />
                  <Typography sx={{ fontFamily, color: '#4a5568', fontWeight: 500 }}>Loading active users…</Typography>
                </Box>
              ) : (
                <>
              <Typography variant="h3" sx={{ fontFamily, fontWeight: 700, color: '#667eea', my: 1 }}>
                {activeUsers}
              </Typography>
              <Typography variant="body2" sx={{ fontFamily, color: '#718096', mb: 2 }}>
                currently taking surveys · {anonymousUsers.length} total recorded
              </Typography>
              <Button variant="contained" onClick={() => setOpenModal(true)} sx={{ textTransform: 'none' }}>
                View All Users
              </Button>
                </>
              )}
            </CardContent>
          </GlassCard>
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
            // A hard 800px overflowed narrower viewports with no way to scroll
            // horizontally out of it.
            width: "90%",
            maxWidth: 800,
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 24,
            p: 4,
            maxHeight: "80vh",
            overflowY: "auto",
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
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nickname</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {anonymousUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4, color: '#718096', fontStyle: 'italic' }}>
                      No anonymous users recorded yet.
                    </TableCell>
                  </TableRow>
                )}
                {anonymousUsers.map((user) => (
                  <TableRow key={user.anonymous_user_id} hover>
                    <TableCell>{user.anonymous_user_id}</TableCell>
                    <TableCell>{user.nickname}</TableCell>
                    <TableCell>{user.created_at ? new Date(user.created_at).toLocaleString() : '—'}</TableCell>
                    <TableCell>
                      {/* The bare dot conveyed status by colour alone. */}
                      <Box display="flex" alignItems="center" gap={0.75}>
                        <Circle sx={{ color: user.is_active ? '#10b981' : '#ef4444', fontSize: 12 }} />
                        <Typography variant="caption" sx={{ color: '#4a5568' }}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Modal>
    </PageShell>
  );
};

export default UsersDashboard;
