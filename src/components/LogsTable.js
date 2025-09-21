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
  Box,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import RefreshIcon from "@mui/icons-material/Refresh";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";

const PAGE_SIZE = 5;

const LogsTable = ({ reloadKey }) => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1); // 1-based page
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const totalPages = total > 0 ? Math.ceil(total / PAGE_SIZE) : 1;
  const displayPage = Math.min(page, totalPages);

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

  // refresh when parent signals a reload (after a new upload)
  useEffect(() => {
    setPage((prev) => {
      if (prev === 1) {
        fetchLogs(1); // force refresh on current page 1
        return prev; // stay on 1
      }
      return 1; // jump to page 1 -> other effect will fetch
    });
  }, [reloadKey]);

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
                    <Avatar
                      alt={log.image}
                      title={log.image}
                      src={`${process.env.REACT_APP_API_URL}/uploads/${log.image}`}
                      sx={{ width: 40, height: 40 }}
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
      </CardContent>
    </Card>
  );
};

export default LogsTable;
