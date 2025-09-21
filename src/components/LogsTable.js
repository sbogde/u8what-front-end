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
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import RefreshIcon from "@mui/icons-material/Refresh";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import LayersRoundedIcon from "@mui/icons-material/LayersRounded";
import PhotoRoundedIcon from "@mui/icons-material/PhotoRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import { getModelLabel } from "./modelOptions";

const PAGE_SIZE = 5;

const LogsTable = ({ reloadKey, onResultsUpdate, onLoadingChange }) => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1); // 1-based page
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [modalView, setModalView] = useState("original");
  const [modalImageVersion, setModalImageVersion] = useState(0);
  const totalPages = total > 0 ? Math.ceil(total / PAGE_SIZE) : 1;
  const displayPage = Math.min(page, totalPages);
  const API_URL = process.env.REACT_APP_API_URL;
  const [modalLoading, setModalLoading] = useState(false);

  const fetchLogs = useCallback(
    async (p) => {
      setLoading(true);
      try {
        if (!API_URL) {
          throw new Error("REACT_APP_API_URL is not configured");
        }
        const res = await fetch(
          `${API_URL}/logs?page=${p}&page_size=${PAGE_SIZE}`
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

  useEffect(() => {
    if (selectedLog) {
      setModalView("original");
      setModalLoading(false);
      setModalImageVersion(Date.now());
    } else {
      setModalImageVersion(0);
    }
  }, [selectedLog]);

  const handleReload = () => {
    setPage((prev) => {
      if (prev === 1) {
        fetchLogs(1);
        return prev;
      }
      return 1;
    });
  };

  const handleCloseModal = () => {
    setSelectedLog(null);
    setModalView("original");
    setModalLoading(false);
    setModalImageVersion(0);
  };

  const disablePrev = page <= 1;
  const disableNext = page >= totalPages;
  const baseOriginalUrl =
    selectedLog && API_URL ? `${API_URL}/uploads/${selectedLog.image}` : "";
  const baseSegmentedUrl =
    selectedLog && API_URL
      ? `${API_URL}/uploads/models/segmented_${selectedLog.image}`
      : "";
  const cacheParam = modalImageVersion ? `?v=${modalImageVersion}` : "";
  const originalModalUrl = baseOriginalUrl
    ? `${baseOriginalUrl}${cacheParam}`
    : "";
  const segmentedModalUrl = baseSegmentedUrl
    ? `${baseSegmentedUrl}${cacheParam}`
    : "";
  const modalImageUrl =
    modalView === "segmented" && segmentedModalUrl
      ? segmentedModalUrl
      : originalModalUrl;
  const isToggleDisabled = !baseSegmentedUrl;
  const showRunAgainButton = typeof onResultsUpdate === "function";
  const canRunAgain = Boolean(selectedLog && baseOriginalUrl && showRunAgainButton);

  const handleRunAgain = async () => {
    if (!canRunAgain || modalLoading) return;
    try {
      setModalLoading(true);
      if (typeof onLoadingChange === "function") onLoadingChange(true);

      const imageResp = await fetch(baseOriginalUrl);
      if (!imageResp.ok) {
        throw new Error(`Failed to fetch image (${imageResp.status})`);
      }
      const blob = await imageResp.blob();
      const file = new File([blob], selectedLog.image, {
        type: blob.type || "image/jpeg",
      });

      const formData = new FormData();
      formData.append("image", file);
      formData.append("model", selectedLog.model);

      const segResp = await fetch(`${API_URL}/segment`, {
        method: "POST",
        body: formData,
      });
      const data = await segResp.json();

      if (typeof onResultsUpdate === "function") onResultsUpdate(data);

      setModalView(baseSegmentedUrl ? "segmented" : "original");
      setModalImageVersion(Date.now());
    } catch (err) {
      console.error("Error re-running segmentation:", err);
      if (typeof onResultsUpdate === "function") {
        const errorMessage = err?.message || "Could not re-run segmentation";
        onResultsUpdate({ error: `${errorMessage} [Logs]` });
      }
    } finally {
      setModalLoading(false);
      if (typeof onLoadingChange === "function") onLoadingChange(false);
    }
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
          onClose={handleCloseModal}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle
            component="div"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Typography variant="h6" component="div">
              {selectedLog ? `Log #${selectedLog.id}` : "Log details"}
            </Typography>
            {showRunAgainButton && (
              <Button
                variant="contained"
                color="success"
                size="small"
                startIcon={
                  modalLoading ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <PlayArrowRoundedIcon />
                  )
                }
                onClick={handleRunAgain}
                disabled={!canRunAgain || modalLoading}
              >
                {modalLoading ? "Running..." : "Run Again"}
              </Button>
            )}
          </DialogTitle>
          <DialogContent dividers>
            {selectedLog && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ position: "relative" }}>
                  <Box
                    component="img"
                    src={modalImageUrl}
                    alt={selectedLog.image}
                    sx={{
                      width: "100%",
                      maxHeight: 320,
                      objectFit: "contain",
                      borderRadius: 1,
                      border: "1px solid",
                      borderColor: "divider",
                      bgcolor: "background.default",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      bgcolor: "rgba(0,0,0,0.5)",
                      borderRadius: 2,
                      p: 0.5,
                      display: "flex",
                      alignItems: "center",
                      backdropFilter: "blur(2px)",
                    }}
                  >
                    <ToggleButtonGroup
                      value={modalView}
                      exclusive
                      onChange={(e, v) => v && setModalView(v)}
                      size="small"
                      color="primary"
                      disabled={modalLoading}
                    >
                      <ToggleButton
                        value="original"
                        aria-label="Show original image"
                        disabled={modalLoading}
                      >
                        <Tooltip title="Original">
                          <PhotoRoundedIcon sx={{ color: "white" }} />
                        </Tooltip>
                      </ToggleButton>
                      <ToggleButton
                        value="segmented"
                        aria-label="Show segmented image"
                        disabled={isToggleDisabled || modalLoading}
                      >
                        <Tooltip title="Segmented">
                          <LayersRoundedIcon sx={{ color: "white" }} />
                        </Tooltip>
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Box>
                  {modalLoading && (
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "rgba(0,0,0,0.35)",
                        borderRadius: 1,
                      }}
                    >
                      <CircularProgress size={32} sx={{ color: "common.white" }} />
                    </Box>
                  )}
                </Box>
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
                {/* <Typography variant="body2">
                  <strong>Image:</strong> {selectedLog.image}
                </Typography> */}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Close</Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default LogsTable;
