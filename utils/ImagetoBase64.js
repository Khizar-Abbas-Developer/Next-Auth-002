import toast from "react-hot-toast";

// ImagetoBase64.js
const ImagetoBase64 = (file) => {
    return new Promise((resolve, reject) => {
      // Ensure the file is a Blob
      if (!(file instanceof Blob)) {
        toast.error("Please select the image")
        return;
      }
  
      const reader = new FileReader();
  
      // Set up the onload event for the reader
      reader.onload = () => {
        // Check if the result is a data URL
        if (typeof reader.result === 'string' && reader.result.startsWith('data:')) {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert image to base64'));
        }
      };
  
      // Set up the onerror event for the reader
      reader.onerror = (error) => {
        reject(error);
      };
  
      // Read the file as a data URL
      reader.readAsDataURL(file);
    });
  };
  
  export { ImagetoBase64 };
  