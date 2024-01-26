
// ImagetoBase64.js
const ImagetoBase64 = async (file) => {

  const reader = await file.arrayBuffer();
  if (!(file instanceof Blob)) {
    console.log("Please select the image")
    return;
  }
  const base64String = Buffer.from(reader).toString('base64');
  // Set up the onload event for the reader
  // reader.onload = () => {
  //   // Check if the result is a data URL
  //   if (typeof reader.result === 'string' && reader.result.startsWith('data:')) {
  //     resolve(reader.result);
  //   } else {
  //     reject(new Error('Failed to convert image to base64'));
  //   }
  // };

  // reader.onerror = (error) => {
  //   reject(error);
  // };
};

export default ImagetoBase64;
