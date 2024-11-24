const express = require("express");
const multer = require("multer");
const axios = require("axios");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 5000;

// Middleware
app.use(cors());

// Set up multer for file uploads
const upload = multer({ dest: "uploads/" }); // Files will be stored in the "uploads" directory

// API key and endpoint
const API_KEY =
  "8ELEHMtwuqoFGK0dh54AGgQjqCGev6RnVt5O6ZMMFDNmEH0quJlNJQQJ99AKACYeBjFXJ3w3AAAFACOGPj46";
const ENDPOINT =
  "https://mission1-ai-car.cognitiveservices.azure.com/computervision/imageanalysis:analyze";

// Route to handle image uploads
app.post("/analyze-image", upload.single("image"), async (req, res) => {
  const filePath = req.file.path;

  try {
    // Read the file and send it to Azure Vision API
    const imageBuffer = fs.readFileSync(filePath);

    const response = await axios.post(
      `${ENDPOINT}?api-version=2023-04-01-preview&model-name=cardetector5000`, //This is so it selects the right model
      imageBuffer,
      {
        headers: {
          "Ocp-Apim-Subscription-Key": API_KEY,
          "Content-Type": "application/octet-stream", // Sending raw binary data
        },
      }
    );

    // Clean up the uploaded file
    fs.unlinkSync(filePath);

    res.json(response.data.customModelResult.tagsResult.values[0].name);
  } catch (error) {
    console.error(error.response?.data || error.message);
    fs.unlinkSync(filePath); // Ensure the file is deleted in case of error
    res.status(500).json({ error: "Error analyzing image" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
