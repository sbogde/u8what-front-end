import React, { useCallback, useEffect, useState } from "react";
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
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import RefreshIcon from "@mui/icons-material/Refresh";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import { getModelLabel } from "./modelOptions";

const PAGE_SIZE = 5;

const LogsTable = ({ reloadKey }) => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1); // 1-based page
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const totalPages = total > 0 ? Math.ceil(total / PAGE_SIZE) : 1;
  const displayPage = Math.min(page, totalPages);
  const API_URL = process.env.REACT_APP_API_URL;

  const fetchLogs = useCallback(
    async (p) => {
      setLoading(true);
      try {
        if (!API_URL) {
          throw new Error("REACT_APP_API_URL is not configured");
        }
        const res = await fetch(`${API_URL}/logs?page=${p}&page_size=${PAGE_SIZE}`);
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
    },
    [API_URL]
  );

  useEffect(() => {
    fetchLogs(page);
  }, [page, fetchLogs]);

  // refresh when parent signals a reload (after a new upload)
  useEffect(() => {
    setPage((prev) => {
      if (prev === 1) {
        fetchLogs(1); // force refresh on current page 1
        return prev; // stay on 1
      }
      return 1; // jump to page 1 -> other effect will fetch
    });
  }, [reloadKey, fetchLogs]);

  const handleReload = () => {
    setPage((prev) => {
      if (prev === 1) {
        fetchLogs(1);
        return prev;
      }
      return 1;
    });
  };

  const disablePrev = page <= 1;
  const disableNext = page >= totalPages;

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
                <TableCell>Best Prediction</TableCell>
                <TableCell>Confidence</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.id}</TableCell>
                  <TableCell>
                    <Box
                      component="button"
                      onClick={() => setSelectedLog(log)}
                      title="View details"
                      type="button"
                      sx={{
                        p: 0,
                        m: 0,
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        lineHeight: 0,
                      }}
                    >
                      <Avatar
                        alt={log.image}
                        src={`${API_URL}/uploads/${log.image}`}
                        sx={{ width: 48, height: 48 }}
                      />
                    </Box>
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

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mt: 2,
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={disablePrev || loading}
            >
              Previous
            </Button>
            <Typography variant="body2">
              Page {displayPage}/{totalPages}
            </Typography>
            <Button
              variant="contained"
              startIcon={<FirstPageIcon />}
              onClick={() => setPage(1)}
              disabled={disablePrev || loading}
            >
              First
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              alignItems: "flex-end",
            }}
          >
            <Button
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={disableNext || loading}
            >
              Next
            </Button>
            <Typography variant="body2">{total} total records</Typography>
            <Button
              variant="contained"
              endIcon={<LastPageIcon />}
              onClick={() => setPage(totalPages)}
              disabled={disableNext || loading}
            >
              Last
            </Button>
          </Box>
        </Box>
        <Dialog
          open={Boolean(selectedLog)}
          onClose={() => setSelectedLog(null)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            {selectedLog ? `Log #${selectedLog.id}` : "Log details"}
          </DialogTitle>
          <DialogContent dividers>
            {selectedLog && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box
                  component="img"
                  src={`${API_URL}/uploads/${selectedLog.image}`}
                  alt={selectedLog.image}
                  sx={{
                    width: "100%",
                    maxHeight: 320,
                    objectFit: "contain",
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                />
                <Divider />
                <Typography variant="body2">
                  <strong>Model:</strong> {getModelLabel(selectedLog.model)}
                </Typography>
                <Typography variant="body2">
                  <strong>Best Prediction:</strong>{" "}
                  {selectedLog.prediction || "—"}
                </Typography>
                <Typography variant="body2">
                  <strong>Highest Confidence:</strong>{" "}
                  {typeof selectedLog.confidence === "number"
                    ? `${selectedLog.confidence.toFixed(2)}%`
                    : "—"}
                </Typography>
                <Typography variant="body2">
                  <strong>Total Detections:</strong>{" "}
                  {selectedLog.num_detections ?? "—"}
                </Typography>
                <Typography variant="body2">
                  <strong>Date:</strong> {selectedLog.date}
                </Typography>
                <Typography variant="body2">
                  <strong>Image:</strong> {selectedLog.image}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedLog(null)}>Close</Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default LogsTable;
