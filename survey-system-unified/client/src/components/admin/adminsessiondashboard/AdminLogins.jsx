import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaUser, FaSignInAlt, FaSignOutAlt, FaClock, FaCircle } from 'react-icons/fa';
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
  font-family: Arial, sans-serif;
  animation: ${fadeIn} 0.5s ease-in;
`;

const Title = styled.h1`
  color: #333;
  text-align: center;
  margin-bottom: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.18);
  border-radius: 10px;
  overflow: hidden;
`;

const TableHeader = styled.thead`
  background-color: #007bff;
  color: white;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color:  #007bff;
  }
  &:hover {
    background-color:rgba(0, 123, 255, 0.67);
  }
  animation: ${fadeIn} 0.5s ease-in;
`;

const TableCell = styled.td`
  padding: 12px;
  text-align: left;
  border: 1px solid #ddd;
`;

const TableHeaderCell = styled.th`
  padding: 12px;
  text-align: left;
  border: 1px solid #ddd;
`;

const IconWrapper = styled.span`
  margin-right: 8px;
  color: #007bff;
`;

const StatusIndicator = styled(FaCircle)`
  color: ${props => (props.status === 'Logged In' ? '#4caf50' : '#f44336')};
  margin-right: 8px;
`;

const AdminSessionDashboard = () => {
    const [sessionData, setSessionData] = useState([]);
    const [isUnauthorized, setIsUnauthorized] = useState(false);

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
                console.log('Session data:', data);
                setSessionData(data);
                setIsUnauthorized(false); // Reset unauthorized state if request succeeds
            } catch (error) {
                console.error('Error fetching session data:', error);
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
                        {sessionData.map((admin, index) => (
                            <TableRow key={index}>
                                <TableCell><IconWrapper><FaUser /></IconWrapper>{admin.username}</TableCell>
                                <TableCell><IconWrapper><FaSignInAlt /></IconWrapper>{new Date(admin.last_login).toLocaleString()}</TableCell>
                                <TableCell><IconWrapper><FaSignOutAlt /></IconWrapper>{admin.last_logout ? new Date(admin.last_logout).toLocaleString() : 'N/A'}</TableCell>
                                <TableCell><IconWrapper><FaClock /></IconWrapper>{admin.session_duration ? `${admin.session_duration} seconds` : 'N/A'}</TableCell>
                                <TableCell><StatusIndicator status={admin.is_logged_in ? 'Logged In' : 'Logged Out'} />{admin.is_logged_in ? 'Logged In' : 'Logged Out'}</TableCell>
                            </TableRow>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default AdminSessionDashboard;