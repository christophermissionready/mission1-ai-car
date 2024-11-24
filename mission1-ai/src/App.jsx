import React, { useState } from "react";
import axios from "axios";

const ImageAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null); // For image preview
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    // Generate a preview URL for the selected image
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setPreview(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please upload an image file.");
      return;
    }

    setError(null);
    setResponse(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(
        "http://localhost:5000/analyze-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setResponse(res.data);
    } catch (err) {
      setError(err.response?.data || "An error occurred");
    }
  };

  return (
    <div>
      <h1>Image Analyzer</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleAnalyze}>Analyze Image</button>

      {/* Display the uploaded image preview */}
      {preview && (
        <div>
          <h2>Uploaded Image:</h2>
          <img
            src={preview}
            alt="Uploaded Preview"
            style={{ maxWidth: "300px", maxHeight: "400px", margin: "20px 0" }}
            className="img"
          />
        </div>
      )}

      {/* Display the response */}
      {response && (
        <div>
          <h2>Analysis Results:</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}

      {/* Display the error */}
      {error && (
        <div>
          <h2>Error:</h2>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ImageAnalyzer;
