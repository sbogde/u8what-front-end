import React, { useState } from "react";
import { Box, Grid } from "@mui/material";
import UploadForm from "./UploadForm";
import SegmentationResults from "./SegmentationResults";
import LogsTable from "./LogsTable";

const Dashboard = () => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [originalImage, setOriginalImage] = useState("");
  const [modelUsed, setModelUsed] = useState("");
  const [logsReloadKey, setLogsReloadKey] = useState(0);

  const handleResultsUpdate = (data) => {
    setResults(data?.results || []);
    setOriginalImage(data?.image || "");
    setModelUsed(data?.model || "");
    if (data?.error) {
      setError(data.error);
    } else {
      setError("");
      setLogsReloadKey((k) => k + 1);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 2, width: "100%" }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <UploadForm onResultsUpdate={handleResultsUpdate} />
        </Grid>
        <Grid item xs={12} md={8}>
          <SegmentationResults
            results={results}
            error={error}
            originalImage={originalImage}
            modelUsed={modelUsed}
          />
        </Grid>
        <Grid item xs={12}>
          <LogsTable reloadKey={logsReloadKey} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
