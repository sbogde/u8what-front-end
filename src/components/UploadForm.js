import React, { useState } from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";

import ImageUpload from "./ImageUpload";
import { modelOptions } from "./modelOptions";

const UploadForm = ({
  onResultsUpdate,
  selectedModel,
  onSelectedModelChange,
  loading: loadingProp,
  onLoadingChange,
}) => {
  const [internalLoading, setInternalLoading] = useState(false);
  const loading = typeof loadingProp === "boolean" ? loadingProp : internalLoading;
  const setLoading = typeof onLoadingChange === "function" ? onLoadingChange : setInternalLoading;

  const handleImageUpload = (image) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("image", image);
    formData.append("model", selectedModel);

    fetch(`${process.env.REACT_APP_API_URL}/segment`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("data", data);
        onResultsUpdate(data);
      })
      .catch((error) => {
        // console.error("Error:", error, typeof error);
        let errorMessage = error.message ? error.message : `Couldn't upload`;
        errorMessage += ` [${process.env.REACT_APP_API_URL}]`;

        onResultsUpdate({ error: errorMessage });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Upload Image
        </Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel id="model-select-label">Model</InputLabel>
          <Select
            labelId="model-select-label"
            id="model-select"
            value={selectedModel}
            label="Model"
            onChange={(e) => onSelectedModelChange && onSelectedModelChange(e.target.value)}
          >
            {modelOptions.map(({ value, label }) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <br />
        <br />
        <ImageUpload onUpload={handleImageUpload} loading={loading} />
      </CardContent>
    </Card>
  );
};

export default UploadForm;
