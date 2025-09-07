import React, { useState } from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";

import ImageUpload from "./ImageUpload";

const UploadForm = ({ onResultsUpdate }) => {
  const [selectedModel, setSelectedModel] = useState("v0.4-Ultralytics-Hub");
  const [loading, setLoading] = useState(false);

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
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            <MenuItem value="v0.4-Ultralytics-Hub">
              v0.4 Ultralytics Hub
            </MenuItem>
            <MenuItem value="v2.1-Ultralytics-Hub">
              v2.1 Ultralytics Hub
            </MenuItem>

            <MenuItem value="v0.4-Google-Colab">v0.4 Google Colab</MenuItem>
            <MenuItem value="v2.1-Google-Colab">v2.1 Google Colab</MenuItem>

            <MenuItem value="v0.4-Mici-Google-Colab">
              Mici! v0.4 Google Colab
            </MenuItem>

            {/* <MenuItem value="v0.4_mici_plus3_stageB_epoch_02">
              Mici, Sarmalex2, Mamaliga v0.4
            </MenuItem> */}

            <MenuItem value="v0.4_mici_sarmale_mamaliga">
              Mici, 2xSarmale, Mamaliga v0.4
            </MenuItem>

            <MenuItem value="v2.1_plus_yorkshire_pudding_gc">
              Yorkshire Pudding v2.1 GC
            </MenuItem>

            <MenuItem value="yolov8n-seg">yolov8n-seg</MenuItem>
            <MenuItem value="yolov8s-seg">yolov8s-seg</MenuItem>
            <MenuItem value="yolov8m-seg">yolov8m-seg</MenuItem>
            <MenuItem value="yolov8l-seg">yolov8l-seg</MenuItem>
            <MenuItem value="yolov8x-seg">yolov8x-seg</MenuItem>
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
