import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Box, useMediaQuery } from "@mui/material";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";
import WarningMessage from "../../partials/WarningMessage";

export const drawerWidth = 300;

const Container = styled(Box)`
  display: flex;
`;

const MainContent = styled(Box)`
  flex-grow: 1;
  padding: 24px;
  background-color: rgba(0,0,0,0);
  min-height: 100vh;
`;

const DashboardOutlet = () => {
  const { isAuthenticated, unauthorized, handleUnauthorized, login } = useAuth();
  const isMobile = useMediaQuery("(max-width:600px)");
  const navigate = useNavigate();

  useEffect(() => {
    if (isMobile) {
      const userChoice = window.confirm(
        "YOU MUST VIEW THIS PAGE IN YOUR DESKTOP FOR THE OPTIMAL VIEWING EXPERIENCE. Press 'OK' to go back."
      );
      if (userChoice) {
        // User clicked "OK"
        navigate("/");
      } else {
        navigate("/");

        console.log("User canceled navigation to home.");
      }
    }
  }, [isMobile, navigate]);

  return (
    <>
      {/* {unauthorized && <WarningMessage message="Unauthorized Access! Please log in." />} */}

      <Container>
        <Sidebar drawerWidth={drawerWidth} />
        <MainContent drawerWidth={drawerWidth}>
          <Outlet />
        </MainContent>
      </Container>
    </>
  );
};

export default DashboardOutlet;
