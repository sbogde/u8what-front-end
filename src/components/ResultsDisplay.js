// src/components/ResultsDisplay.js
import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import Alert from "@mui/material/Alert";

const ResultsDisplay = ({ results, error, resizedImage, modelUsed }) => {
  let resized_image_url = "";
  if (resizedImage) {
    resized_image_url = `http://localhost:5000/uploads/models/${resizedImage}`;
  }

  return (
    <Card>
      <CardContent>
        {error && <Alert severity="error">{error}</Alert>}

        {<Typography variant="h5">Classification Results:</Typography>}

        {modelUsed && <Alert severity="success">Model Used: {modelUsed}</Alert>}

        {results?.map((result, index) => (
          <Typography key={index}>{`${
            result.label
          }: ${result.confidence.toFixed(2)}%`}</Typography>
        ))}
      </CardContent>

      {resized_image_url && (
        <CardContent>
          <div>
            <Typography variant="h6">Resized Image:</Typography>
            <img
              src={resized_image_url}
              alt="Resized"
              title={
                results?.[0].label +
                " - " +
                results?.[0].confidence.toFixed(2) +
                "%"
              }
            />
          </div>
        </CardContent>
      )}

      {results?.length ? (
        <CardContent>
          <div>
            <pre>{JSON.stringify(results, null, 2)}</pre>
          </div>
        </CardContent>
      ) : (
        ""
      )}
    </Card>
  );
};

export default ResultsDisplay;
