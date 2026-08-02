import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaUser, FaSignInAlt, FaSignOutAlt, FaClock, FaCircle } from 'react-icons/fa';
import { Box, CircularProgress, Typography } from '@mui/material';
import WarningMessage from '../../partials/WarningMessage';
// Keyframes for animations
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// Styled components
const Container = styled.div`
  padding: 20px;
  /* Arial here was the only non-Poppins surface in the admin area. */
  font-family: 'Poppins', sans-serif;
  animation: ${fadeIn} 0.5s ease-in;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.18);
  border-radius: 10px;
  overflow: hidden;
  font-size: 14px;
`;

const TableHeader = styled.thead`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
`;

const TableRow = styled.tr`
  /* Zebra striping was solid #007bff behind dark body text — effectively
     unreadable. A faint brand tint keeps the stripe without the contrast hit. */
  &:nth-child(even) {
    background-color: rgba(102, 126, 234, 0.06);
  }
  &:hover {
    background-color: rgba(102, 126, 234, 0.14);
  }
  animation: ${fadeIn} 0.5s ease-in;
`;

const TableCell = styled.td`
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
  color: #2d3748;
`;

const TableHeaderCell = styled.th`
  padding: 12px;
  text-align: left;
  font-weight: 600;
  white-space: nowrap;
`;

const EmptyRow = styled.td`
  padding: 24px 12px;
  text-align: center;
  color: #718096;
  font-style: italic;
`;

const IconWrapper = styled.span`
  margin-right: 8px;
  color: #667eea;
  vertical-align: middle;
`;

const StatusIndicator = styled(FaCircle).withConfig({
  // Without this, `status` is spread onto the <svg> and React warns.
  shouldForwardProp: (prop) => prop !== 'loggedIn',
})`
  color: ${props => (props.loggedIn ? '#10b981' : '#ef4444')};
  margin-right: 8px;
  vertical-align: middle;
`;

const AdminSessionDashboard = () => {
    const [sessionData, setSessionData] = useState([]);
    const [isUnauthorized, setIsUnauthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSessionData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_HOST}/api/admin/session-data`, {
                    method: 'GET',
                    credentials: 'include', 
                    headers: {
                        'Content-type': 'application/json',
                    },
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        setIsUnauthorized(true);
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                // Guard: a non-array payload would blow up .map() below.
                setSessionData(Array.isArray(data) ? data : []);
                setIsUnauthorized(false); // Reset unauthorized state if request succeeds
            } catch (error) {
                console.error('Error fetching session data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSessionData();
        const interval = setInterval(fetchSessionData, 5000); // Poll every 5 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <Container>
            {isUnauthorized ? (
                <WarningMessage message="YOU ARE NOT ALLOWED TO VIEW THIS PAGE" />
            ) : isLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, minHeight: 180 }} role="status" aria-live="polite">
                    <CircularProgress size={28} thickness={4} sx={{ color: '#667eea' }} />
                    <Typography sx={{ color: '#4a5568', fontWeight: 500 }}>Loading admin sessions…</Typography>
                </Box>
            ) : (
                <Table>
                    <TableHeader>
                        <tr>
                            <TableHeaderCell><IconWrapper><FaUser /></IconWrapper>Username</TableHeaderCell>
                            <TableHeaderCell><IconWrapper><FaSignInAlt /></IconWrapper>Last Login</TableHeaderCell>
                            <TableHeaderCell><IconWrapper><FaSignOutAlt /></IconWrapper>Last Logout</TableHeaderCell>
                            <TableHeaderCell><IconWrapper><FaClock /></IconWrapper>Session Duration</TableHeaderCell>
                            <TableHeaderCell>Status</TableHeaderCell>
                        </tr>
                    </TableHeader>
                    <tbody>
                        {sessionData.length === 0 ? (
                            <tr>
                                {/* Previously an empty response rendered a header with nothing
                                    under it, which reads as a broken table. */}
                                <EmptyRow colSpan={5}>No admin sessions recorded yet.</EmptyRow>
                            </tr>
                        ) : (
                            sessionData.map((admin, index) => (
                                <TableRow key={admin.username || index}>
                                    <TableCell><IconWrapper><FaUser /></IconWrapper>{admin.username}</TableCell>
                                    <TableCell><IconWrapper><FaSignInAlt /></IconWrapper>{admin.last_login ? new Date(admin.last_login).toLocaleString() : 'N/A'}</TableCell>
                                    <TableCell><IconWrapper><FaSignOutAlt /></IconWrapper>{admin.last_logout ? new Date(admin.last_logout).toLocaleString() : 'N/A'}</TableCell>
                                    <TableCell><IconWrapper><FaClock /></IconWrapper>{admin.session_duration ? `${admin.session_duration} seconds` : 'N/A'}</TableCell>
                                    <TableCell>
                                        <StatusIndicator loggedIn={!!admin.is_logged_in} />
                                        {admin.is_logged_in ? 'Logged In' : 'Logged Out'}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default AdminSessionDashboard;
