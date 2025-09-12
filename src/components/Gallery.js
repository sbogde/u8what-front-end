import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Tooltip,
  ButtonGroup,
  Button,
  Stack,
} from "@mui/material";

const PAGE_SIZE = 9;

// A small gallery that can show recent (history-based) images from logs
// or a curated set. Clicking a thumbnail re-runs segmentation as if
// the user uploaded the image.
const Gallery = ({ selectedModel, onResultsUpdate, reloadKey }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("curated"); // 'history' | 'curated'

  const API_BASE = process.env.REACT_APP_API_URL;
  const curatedFiles = useMemo(
    () => [
      "mici.jpg",
      "sarmale.jpg",
      "mamaliga.jpg",
      "yorkshire_pudding.jpg",
      "plate.jpg",
      "plate05.jpeg",
      "banana3.png",
      "mix_veg1.png",
      "mixed_nuts.png",
    ],
    []
  );

  const imageUrlFor = (file) => {
    if (mode === "curated") {
      if (API_BASE) return `${API_BASE}/uploads/gallery/${file}`;
      return `/imgs/curated/${file}`; // front-end fallback
    }
    return `${API_BASE}/uploads/${file}`;
  };

  useEffect(() => {
    const load = async () => {
      if (mode === "history") {
        try {
          const res = await fetch(
            `${API_BASE}/logs?page=1&page_size=${PAGE_SIZE}`
          );
          const data = await res.json();
          setItems(data.items || []);
        } catch (err) {
          setItems([]);
        }
      } else {
        // curated mode
        setItems(
          curatedFiles.map((name, idx) => ({ id: `c${idx}`, image: name }))
        );
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, reloadKey, API_BASE]);

  const runSegmentation = async (filename) => {
    if (loading) return;
    setLoading(true);
    try {
      // Fetch the existing image and reupload it as if it was selected locally
      const imageUrl = imageUrlFor(filename);
      const resp = await fetch(imageUrl);
      const blob = await resp.blob();
      const file = new File([blob], filename, {
        type: blob.type || "image/jpeg",
      });

      const formData = new FormData();
      formData.append("image", file);
      formData.append("model", selectedModel);

      const segRes = await fetch(`${API_BASE}/segment`, {
        method: "POST",
        body: formData,
      });
      const data = await segRes.json();
      onResultsUpdate && onResultsUpdate(data);
    } catch (err) {
      const errorMessage = (err && err.message) || "Could not run segmentation";
      onResultsUpdate &&
        onResultsUpdate({ error: `${errorMessage} [Gallery]` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 1 }}
        >
          <Typography variant="h6">
            {mode === "history" ? "History" : "Curated"} Gallery
          </Typography>
          <ButtonGroup size="small" variant="text">
            <Button
              onClick={() => setMode("curated")}
              disabled={mode === "curated"}
            >
              Curated
            </Button>
            <Button
              onClick={() => setMode("history")}
              disabled={mode === "history"}
            >
              History
            </Button>
          </ButtonGroup>
        </Stack>
        <Grid container spacing={1}>
          {items.map((it) => (
            <Grid item xs={4} key={it.id}>
              <Tooltip title={`Run with ${selectedModel}`} placement="top">
                <Box
                  component="img"
                  src={imageUrlFor(it.image)}
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
                {mode === "history"
                  ? "No images yet. Upload a photo first to populate the history."
                  : "No curated images found. Add files under uploads/gallery or public/imgs/curated."}
              </Typography>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default Gallery;
