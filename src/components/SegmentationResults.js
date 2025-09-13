import React, { useEffect, useState } from "react";

import Alert from "@mui/material/Alert";
// import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";

import Box from "@mui/material/Box";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import LayersRoundedIcon from "@mui/icons-material/LayersRounded"; // segmented
import PhotoRoundedIcon from "@mui/icons-material/PhotoRounded"; // original

const SegmentationResults = ({ results, error, originalImage, modelUsed, loading }) => {
  const [view, setView] = useState("segmented"); // "segmented" | "original"

  // Build URLs
  const original_image_url = originalImage
    ? `${process.env.REACT_APP_API_URL}/uploads/${originalImage}`
    : "";
  const segmented_image_url = originalImage
    ? `${process.env.REACT_APP_API_URL}/uploads/models/segmented_${originalImage}`
    : "";

  // Reset to segmented when a new image arrives
  useEffect(() => {
    if (originalImage) setView("segmented");
  }, [originalImage]);

  const displayUrl =
    view === "segmented" ? segmented_image_url : original_image_url;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Segmentation Results
        </Typography>
        {loading && <LinearProgress sx={{ mb: 2 }} />}
        {error && <Alert severity="error">{error}</Alert>}

        {!error && modelUsed && modelUsed.length && (
          <>
            {modelUsed && (
              <Alert severity="success">Model Used: {modelUsed}</Alert>
            )}

            {results?.map((result, index) => (
              <Typography key={index}>{`${index + 1}. ${
                result.label
              }: ${result.confidence.toFixed(2)}%`}</Typography>
            ))}

            {displayUrl && (
              <CardContent sx={{ pt: 2 }}>
                <Box sx={{ position: "relative" }}>
                  {/* Image */}
                  <CardMedia
                    component="img"
                    image={displayUrl}
                    alt={
                      results?.[0]
                        ? `${
                            results[0].label
                          } - ${results[0].confidence.toFixed(2)}%`
                        : "Segmentation result"
                    }
                    sx={{
                      width: "100%",
                      maxHeight: "70vh",
                      objectFit: "contain",
                      bgcolor: "background.default",
                      borderRadius: 1,
                    }}
                  />

                  {/* Top-right overlay toggle */}
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
                      value={view}
                      exclusive
                      onChange={(e, v) => v && setView(v)}
                      size="small"
                      color="primary"
                      disabled={loading}
                    >
                      <ToggleButton
                        value="original"
                        aria-label="Show original image"
                      >
                        <Tooltip title="Original">
                          <PhotoRoundedIcon sx={{ color: "white" }} />
                        </Tooltip>
                      </ToggleButton>
                      <ToggleButton
                        value="segmented"
                        aria-label="Show segmented image"
                      >
                        <Tooltip title="Segmented">
                          <LayersRoundedIcon sx={{ color: "white" }} />
                        </Tooltip>
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Box>
                </Box>
              </CardContent>
            )}

            {/* {segmented_image_url && (
              <CardContent>
                <CardMedia
                  component="img"
                  height="100%"
                  image={segmented_image_url}
                  alt={
                    results?.[0]?.label +
                    " - " +
                    results?.[0]?.confidence.toFixed(2) +
                    "%"
                  }
                />
              </CardContent>
            )} */}
          </>
        )}

        {!error && !modelUsed && (
          <Alert severity="warning">Please upload a pic first.</Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default SegmentationResults;
