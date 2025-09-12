import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Grid, Box, Tooltip } from "@mui/material";

const PAGE_SIZE = 9;

// A small gallery that lists recent images from the backend logs and
// lets the user rerun segmentation as if they uploaded the image.
const Gallery = ({ selectedModel, onResultsUpdate }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/logs?page=1&page_size=${PAGE_SIZE}`
        );
        const data = await res.json();
        setItems(data.items || []);
      } catch (err) {
        setItems([]);
      }
    };
    load();
  }, []);

  const runSegmentation = async (filename) => {
    if (loading) return;
    setLoading(true);
    try {
      // Fetch the existing image and reupload it as if it was selected locally
      const imageUrl = `${process.env.REACT_APP_API_URL}/uploads/${filename}`;
      const resp = await fetch(imageUrl);
      const blob = await resp.blob();
      const file = new File([blob], filename, { type: blob.type || "image/jpeg" });

      const formData = new FormData();
      formData.append("image", file);
      formData.append("model", selectedModel);

      const segRes = await fetch(`${process.env.REACT_APP_API_URL}/segment`, {
        method: "POST",
        body: formData,
      });
      const data = await segRes.json();
      onResultsUpdate && onResultsUpdate(data);
    } catch (err) {
      const errorMessage = (err && err.message) || "Could not run segmentation";
      onResultsUpdate && onResultsUpdate({ error: `${errorMessage} [Gallery]` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Gallery
        </Typography>
        <Grid container spacing={1}>
          {items.map((it) => (
            <Grid item xs={4} key={it.id}>
              <Tooltip title={`Run with ${selectedModel}`} placement="top">
                <Box
                  component="img"
                  src={`${process.env.REACT_APP_API_URL}/uploads/${it.image}`}
                  alt={it.image}
                  onClick={() => runSegmentation(it.image)}
                  sx={{
                    width: "100%",
                    height: 90,
                    objectFit: "cover",
                    borderRadius: 1,
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.6 : 1,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                />
              </Tooltip>
            </Grid>
          ))}
          {!items.length && (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                No images yet. Upload a photo first to populate the gallery.
              </Typography>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default Gallery;

