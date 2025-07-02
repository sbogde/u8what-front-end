import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import RefreshIcon from "@mui/icons-material/Refresh";

const LogsTable = () => {
  const [logs, setLogs] = useState([]);
  const [n, setN] = useState(0);
  const [disableNext, setDisableNext] = useState(false);

  const fetchLogs = async (n) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/logs/${n}`
      );
      const data = await response.json();
      setLogs(data);

      if (data.length === 0 || data.some((log) => log.id === 1)) {
        setDisableNext(true);
      } else {
        setDisableNext(false);
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  useEffect(() => {
    fetchLogs(n);
  }, [n]);

  const handleReload = () => {
    setN(0);
  };

  return (
    <Card>
      <CardContent>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Logs
          </Typography>
          <IconButton onClick={handleReload}>
            <RefreshIcon />
          </IconButton>
        </div>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Model</TableCell>
                <TableCell>Prediction</TableCell>
                <TableCell>Confidence</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.id}</TableCell>
                  <TableCell>
                    <Avatar
                      alt={log.filename_original}
                      title={log.filename_original}
                      src={`${process.env.REACT_APP_API_URL}/uploads/models/${log.filename_server}`}
                      sx={{ width: 32, height: 32 }}
                    />
                  </TableCell>
                  <TableCell>{log.model_name}</TableCell>
                  <TableCell>{log.prediction}</TableCell>
                  <TableCell>{log.confidence.toFixed(2)}%</TableCell>
                  <TableCell>{log.created_at}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "1rem",
          }}
        >
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => setN(n - 5)}
            disabled={n === 0}
          >
            Previous
          </Button>
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            onClick={() => setN(n + 5)}
            disabled={disableNext}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LogsTable;
