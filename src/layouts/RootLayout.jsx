import React from "react";
import { Container, Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
const RootLayout = () => {
  return (
    <Box>
      <Navbar />
      <Container maxWidth="xl">
        <Outlet />
      </Container>
    </Box>
  );
};

export default RootLayout;
