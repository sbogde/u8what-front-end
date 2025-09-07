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

const PAGE_SIZE = 5;

const LogsTable = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1); // 1-based page
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async (p) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/logs?page=${p}&page_size=${PAGE_SIZE}`
      );
      const data = await res.json();
      setItems(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error("Error fetching logs:", err);
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(page);
  }, [page]);

  const handleReload = () => setPage(1);

  const disablePrev = page <= 1;
  const disableNext = page * PAGE_SIZE >= total;

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
          <IconButton onClick={handleReload} disabled={loading}>
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
              {items.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.id}</TableCell>
                  <TableCell>
                    <Avatar
                      alt={log.image}
                      title={log.image}
                      src={`${process.env.REACT_APP_API_URL}/uploads/models/${log.image}`}
                      sx={{ width: 32, height: 32 }}
                    />
                  </TableCell>
                  <TableCell>{log.model}</TableCell>
                  <TableCell>{log.prediction || "—"}</TableCell>
                  <TableCell>
                    {typeof log.confidence === "number"
                      ? `${log.confidence.toFixed(2)}%`
                      : "—"}
                  </TableCell>
                  <TableCell>{log.date}</TableCell>
                </TableRow>
              ))}
              {!loading && items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6}>No logs yet.</TableCell>
                </TableRow>
              )}
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
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={disablePrev || loading}
          >
            Previous
          </Button>
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            onClick={() => setPage((p) => p + 1)}
            disabled={disableNext || loading}
          >
            Next
          </Button>
        </div>

        <Typography variant="body2" sx={{ mt: 1 }}>
          Page {page} • {total} total
        </Typography>
      </CardContent>
    </Card>
  );
};

export default LogsTable;
