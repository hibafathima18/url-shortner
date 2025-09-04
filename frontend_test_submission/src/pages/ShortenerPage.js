import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useUrlStore } from "../hooks/useUrlStore";
import { log } from "../../Logging Middleware/logger";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
} from "@mui/material";

const initialInputState = { longUrl: "", validity: "", customCode: "", id: 1 };
const MAX_URLS = 5;

const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

const ShortenerPage = () => {
  const [inputs, setInputs] = useState([initialInputState]);
  const [errors, setErrors] = useState({});
  const [results, setResults] = useState([]);
  const { addUrls, isShortcodeTaken } = useUrlStore();

  const handleInputChange = (index, event) => {
    const newInputs = [...inputs];
    newInputs[index][event.target.name] = event.target.value;
    setInputs(newInputs);
  };

  const addInputRow = () => {
    if (inputs.length < MAX_URLS) {
      setInputs([...inputs, { ...initialInputState, id: inputs.length + 1 }]);
    }
  };

  const validateInputs = () => {
    const newErrors = {};
    let isValid = true;

    inputs.forEach((input, index) => {
      if (!input.longUrl) {
        newErrors[index] = "Original URL is required.";
        isValid = false;
        return;
      }
      if (!isValidUrl(input.longUrl)) {
        newErrors[index] = "Invalid URL format.";
        isValid = false;
        return;
      }
      if (input.validity && !/^\d+$/.test(input.validity)) {
        newErrors[index] = "Validity must be an integer (minutes).";
        isValid = false;
        return;
      }
      if (input.customCode && !/^[a-zA-Z0-9_-]+$/.test(input.customCode)) {
        newErrors[index] = "Custom shortcode must be alphanumeric.";
        isValid = false;
        return;
      }
      if (input.customCode && isShortcodeTaken(input.customCode)) {
        newErrors[index] = `Shortcode '${input.customCode}' is already taken.`;
        isValid = false;
        return;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setResults([]);
    if (!validateInputs()) {
      log("frontend", "warn", "page", { event: "Validation failed", errors });
      return;
    }

    const newUrlsToStore = {};
    const newResults = [];
    const creationTime = new Date();

    inputs.forEach((input) => {
      let shortCode = input.customCode;
      if (!shortCode) {
        do {
          shortCode = uuidv4().slice(0, 6);
        } while (isShortcodeTaken(shortCode) || newUrlsToStore[shortCode]);
      }

      const validityMinutes = input.validity
        ? parseInt(input.validity, 10)
        : 30;
      const expiryTime = new Date(
        creationTime.getTime() + validityMinutes * 60000
      );

      const newUrlData = {
        shortCode,
        longUrl: input.longUrl,
        createdAt: creationTime.toISOString(),
        expiresAt: expiryTime.toISOString(),
        clicks: [],
      };

      newUrlsToStore[shortCode] = newUrlData;
      newResults.push(newUrlData);
    });

    addUrls(newUrlsToStore);
    setResults(newResults);
    log("frontend", "info", "page", {
      event: "URLs shortened",
      count: newResults.length,
    });
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Create Short URLs
      </Typography>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {inputs.map((input, index) => (
              <Box
                key={index}
                sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}
              >
                <TextField
                  label="Original Long URL"
                  name="longUrl"
                  value={input.longUrl}
                  onChange={(e) => handleInputChange(index, e)}
                  error={!!errors[index]}
                  helperText={errors[index] || ""}
                  fullWidth
                  required
                />
                <TextField
                  label="Validity (mins)"
                  name="validity"
                  value={input.validity}
                  onChange={(e) => handleInputChange(index, e)}
                  placeholder="Default: 30"
                  sx={{ width: "150px" }}
                />
                <TextField
                  label="Custom Code"
                  name="customCode"
                  value={input.customCode}
                  onChange={(e) => handleInputChange(index, e)}
                  placeholder="Optional"
                  sx={{ width: "180px" }}
                />
              </Box>
            ))}
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
            >
              <Button
                onClick={addInputRow}
                disabled={inputs.length >= MAX_URLS}
              >
                Add Another URL
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Shorten URLs
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Alert severity="success" sx={{ mb: 2 }}>
            Your shortened URLs have been created successfully!
          </Alert>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Original URL</TableCell>
                  <TableCell>Short URL</TableCell>
                  <TableCell>Expires At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.map((result) => (
                  <TableRow key={result.shortCode}>
                    <TableCell sx={{ wordBreak: "break-all" }}>
                      {result.longUrl}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/${result.shortCode}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {`${window.location.origin}/${result.shortCode}`}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {new Date(result.expiresAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Container>
  );
};

export default ShortenerPage;
