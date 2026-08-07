import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Box, useMediaQuery } from '@mui/material';
import Sidebar from './Sidebar';
import { gradients } from '../shared/designTokens';

export const drawerWidth = 300;
export const collapsedWidth = 80;

const Container = styled(Box)`
  display: flex;
  min-height: 100vh;
`;

const MainContent = styled(Box)`
  flex-grow: 1;
  /* Every admin page renders its own full-bleed gradient shell with its own
     padding. Adding padding here as well produced a doubled inset plus a
     guaranteed scrollbar (page min-height:100vh + 48px of outer padding). */
  padding: 0;
  background: ${gradients.page};
  /* Flex items default to min-width:auto, so a wide table or a 100vw child
     stretched the whole layout instead of scrolling inside this column. */
  min-width: 0;
  overflow-x: hidden;
`;

const DashboardOutlet = () => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  useEffect(() => {
    if (isMobile) {
      // Both branches of the old window.confirm() navigated to "/", so the
      // prompt was a dead choice. Just tell the user and redirect.
      window.alert(
        'This dashboard is designed for desktop. Please open it on a larger screen for the intended experience.'
      );
      navigate('/');
    }
  }, [isMobile, navigate]);

  return (
    // AdminRoutes already gates this route on isAuthenticated and renders the
    // unauthorized warning, so the commented-out duplicate here is gone.
    <Container>
      <Sidebar
        drawerWidth={drawerWidth}
        collapsed={sidebarCollapsed}
        onToggle={handleSidebarToggle}
      />
      <MainContent>
        <Outlet />
      </MainContent>
    </Container>
  );
};

export default DashboardOutlet;
