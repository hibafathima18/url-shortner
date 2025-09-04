import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUrlStore } from "../hooks/useUrlStore";
import { log } from "../../Logging Middleware/logger";
import { Box, CircularProgress, Typography } from "@mui/material";

const RedirectHandler = () => {
  const { shortCode } = useParams();
  const { getUrlByShortcode, recordClick } = useUrlStore();
  const [message, setMessage] = useState("Redirecting...");

  useEffect(() => {
    const handleRedirect = () => {
      const urlData = getUrlByShortcode(shortCode);

      if (urlData) {
        const now = new Date();
        const expiry = new Date(urlData.expiresAt);

        if (now > expiry) {
          setMessage("This link has expired.");
          log("frontend", "warn", "component", {
            event: "Redirect failed",
            reason: "Link expired",
            shortCode,
          });
          return;
        }

        const clickData = {
          timestamp: now.toISOString(),
          source: document.referrer || "Direct",
          location: "Coarse-grained location placeholder",
        };

        recordClick(shortCode, clickData);
        log("frontend", "info", "component", {
          event: "Redirect success",
          shortCode,
          to: urlData.longUrl,
        });
        window.location.replace(urlData.longUrl);
      } else {
        setMessage("URL not found.");
        log("frontend", "error", "component", {
          event: "Redirect failed",
          reason: "Shortcode not found",
          shortCode,
        });
      }
    };

    handleRedirect();
  }, [shortCode, getUrlByShortcode, recordClick]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <CircularProgress sx={{ mb: 2 }} />
      <Typography variant="h6">{message}</Typography>
    </Box>
  );
};

export default RedirectHandler;
