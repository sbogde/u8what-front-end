// src/components/ImageUpload.js
import React, { useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import LinearProgress from "@mui/material/LinearProgress";

const ImageUpload = ({ onUpload, loading }) => {
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = () => {
    onUpload(image);
  };

  return (
    <div>
      <Input type="file" onChange={handleImageChange} />
      <br />
      <br />
      {/* <Button variant="contained" color="primary" onClick={handleUpload}>
        Upload
      </Button> */}

      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? "Please wait..." : "Upload"}
        </Button>
        {loading && <LinearProgress sx={{ mt: 2 }} />}
      </Box>
    </div>
  );
};

export default ImageUpload;
