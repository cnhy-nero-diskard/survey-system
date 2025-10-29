// RouteSelector.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/context/AuthContext';
import styled, { createGlobalStyle } from 'styled-components';
import { FaUserShield, FaPoll } from 'react-icons/fa';

const GlobalStyle = createGlobalStyle`
  /* Remove default margins and padding */
  html, body {
    margin: 0;
    padding: 0;
    /* enable full-height layout */
    height: 100%;
  }

  /* Ensure root element takes available height */
  #root {
    height: 100%;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* Full viewport width and height */
  width: 100vw;
  height: 100vh;
  /* Subtle gradient background */
  background: linear-gradient(135deg, #f0f4c3, #c8e6c9);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #2e7d32;
  margin-bottom: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 30px;
`;

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  font-size: 1rem;
  cursor: pointer;
  background-color: #4caf50;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  transition: transform 0.2s ease, background-color 0.2s ease;

  &:hover {
    background-color: #388e3c;
    transform: translateY(-2px);
  }
`;

const RouteSelector = () => {
  const navigate = useNavigate();
  const { isAuthenticated, unauthorized, handleUnauthorized } = useAuth();

  return (
    <>
      <GlobalStyle /> {/* Inject global style for resets */}
      <Container>
        <Title>WELCOME!</Title>
        <ButtonGroup>
          <StyledButton onClick={() => navigate('/admin')}>
            <FaUserShield />
            Admin
          </StyledButton>
          <StyledButton onClick={() => navigate('/survey')}>
            <FaPoll />
            TPMS Survey
          </StyledButton>
        </ButtonGroup>
      </Container>
    </>
  );
};

export default RouteSelector;
