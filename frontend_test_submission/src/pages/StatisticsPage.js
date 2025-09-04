import React, { useEffect, useState } from "react";
import { useUrlStore } from "../hooks/useUrlStore";
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { log } from "../../../Logging Middleware/logger";

const StatisticsPage = () => {
  const [allUrls, setAllUrls] = useState([]);
  const { getAllUrls } = useUrlStore();

  useEffect(() => {
    const urls = getAllUrls().sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setAllUrls(urls);
    log("frontend", "info", "page", {
      event: "Statistics page loaded",
      urlCount: urls.length,
    });
  }, [getAllUrls]);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom align="center">
        URL Shortener Statistics
      </Typography>
      {allUrls.length === 0 ? (
        <Typography align="center" sx={{ mt: 4 }}>
          No shortened URLs found. Create some first!
        </Typography>
      ) : (
        <Paper sx={{ mt: 3 }}>
          {allUrls.map((url) => (
            <Accordion key={url.shortCode}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    alignItems: "center",
                    pr: 2,
                  }}
                >
                  <Box>
                    <Typography variant="body1" component="div">
                      <Link
                        href={`/${url.shortCode}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {`${window.location.origin}/${url.shortCode}`}
                      </Link>
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ wordBreak: "break-all" }}
                    >
                      {url.longUrl}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ ml: 2, flexShrink: 0 }}>
                    Clicks: {url.clicks.length}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box>
                  <Typography variant="subtitle2">
                    Created: {new Date(url.createdAt).toLocaleString()}
                  </Typography>
                  <Typography variant="subtitle2">
                    Expires: {new Date(url.expiresAt).toLocaleString()}
                  </Typography>
                  {url.clicks.length > 0 && (
                    <TableContainer sx={{ mt: 2 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Click Timestamp</TableCell>
                            <TableCell>Source</TableCell>
                            <TableCell>Location</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {url.clicks.map((click, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                {new Date(click.timestamp).toLocaleString()}
                              </TableCell>
                              <TableCell>{click.source}</TableCell>
                              <TableCell>{click.location}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Paper>
      )}
    </Container>
  );
};

export default StatisticsPage;
