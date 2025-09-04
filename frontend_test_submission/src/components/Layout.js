import React, { useEffect } from "react";
import { Outlet, useLocation, Link as RouterLink } from "react-router-dom";
import {
  AppBar,
  Box,
  Container,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";
import { initializeLogger } from "../api/auth";

const Layout = () => {
  const location = useLocation();

  useEffect(() => {
    initializeLogger();
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Affordmed URL Shortener
          </Typography>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
            variant={location.pathname === "/" ? "outlined" : "text"}
          >
            Shortener
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/stats"
            variant={location.pathname === "/stats" ? "outlined" : "text"}
            sx={{ ml: 2 }}
          >
            Statistics
          </Button>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default Layout;
