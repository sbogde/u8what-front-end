import React, { useState } from "react";
import { Box, Grid } from "@mui/material";
import UploadForm from "./UploadForm";
import ClassificationResults from "./ClassificationResults";
import LogsTable from "./LogsTable";

const Dashboard = () => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [resizedImage, setResizedImage] = useState("");
  const [modelUsed, setModelUsed] = useState("");
  const [logsReloadKey, setLogsReloadKey] = useState(0);

  const handleResultsUpdate = (data) => {
    setResults(data?.results || []);
    setResizedImage(data?.resized_image || "");
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
          <ClassificationResults
            results={results}
            error={error}
            resizedImage={resizedImage}
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
