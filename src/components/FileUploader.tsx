// FileUploader.tsx

"use client";

import React from "react";

type FileUploaderParams = {
  apiKey: string,
  appendContent: string,
}

function FileUploader({ apiKey, appendContent }: FileUploaderParams) {
    // console.log("INSIDE FILE UPLOADER");
    const handleFileOperation = async () => {
        // console.log("INSIDE HANDLE FILE OP");
        try {
            const response = await fetch('/api', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ apiKey, appendContent })
            });
            // console.log("AFTER GOT THE RESPONSE, LETS SEE IF ITS OKAY");
    
            if (!response.ok) {
                const textResponse = await response.text(); // Handle non-JSON responses
                console.error("Error response text:", textResponse);
                throw new Error('Failed to process the file.');
            }
    
            const data = await response.json();
            // console.log("Server response:", data);
            alert(`Upload successful. New file: ${data.newFileName}`);
        } catch (error) {
            console.error("Error during file handling:", error);
            alert("Error during file handling: " + error.message);
        }
    };    

  handleFileOperation();

  return null;
}

export default FileUploader;
