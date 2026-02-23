import { imageLoader } from '@cornerstonejs/core';
import dcmjs from 'dcmjs';
import FileLoader from './fileLoader';

const ImageFileLoader = new (class extends FileLoader {
  fileType = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

  loadFile(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
          objectUrl,
          file,
        });
      };

      img.onerror = err => {
        URL.revokeObjectURL(objectUrl);
        reject(err);
      };

      img.src = objectUrl;
    });
  }

  getDataset(image, imageId, options = {}) {
    const { studyInstanceUID } = options;

    // image is the object resolved from loadFile
    const { width, height } = image;

    const currentStudyInstanceUID = studyInstanceUID || dcmjs.data.DicomMetaDictionary.uid();
    const seriesInstanceUID = dcmjs.data.DicomMetaDictionary.uid();
    const sopInstanceUID = dcmjs.data.DicomMetaDictionary.uid();

    return {
      StudyInstanceUID: currentStudyInstanceUID,
      SeriesInstanceUID: seriesInstanceUID,
      SOPInstanceUID: sopInstanceUID,
      SeriesDescription: 'Local Image',
      SeriesNumber: 1,
      InstanceNumber: 1,
      Modality: 'SC',
      SOPClassUID: '1.2.840.10008.5.1.4.1.1.7',
      // This is critical for the Viewer to know how to display it
      url: imageId,
      imageId: imageId,

      // Minimal metadata to satisfy display sets
      Rows: height,
      Columns: width,
      PixelRepresentation: 0,
      BitsAllocated: 8,
      SamplesPerPixel: 3, // Changed back to 3
      PhotometricInterpretation: 'RGB',
      PlanarConfiguration: 0,
      ImageOrientationPatient: [1, 0, 0, 0, 1, 0],
      ImagePositionPatient: [0, 0, 0],
      FrameOfReferenceUID: '1.2.3.4.5.6.7.8.9.0', // Standard UID
    };
  }
})();

// Define the blob loader function
function blobLoader(imageId) {
  return {
    promise: new Promise((resolve, reject) => {
      // Remove 'blob:' prefix if it exists in the imageId but is NOT part of the protocol
      // Actually imageId IS the url.

      const image = new Image();
      image.src = imageId;

      image.onload = () => {
        const imageObject = {
          imageId,
          minPixelValue: 0,
          maxPixelValue: 255,
          slope: 1,
          intercept: 0,
          windowCenter: 127,
          windowWidth: 255,
          getPixelData: () => {
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            const context = canvas.getContext('2d');
            context.drawImage(image, 0, 0);
            const imageData = context.getImageData(0, 0, image.width, image.height);

            // Remove alpha channel (RGBA -> RGB)
            const data = imageData.data;
            const rgbData = new Uint8Array(image.width * image.height * 3);
            let j = 0;
            for (let i = 0; i < data.length; i += 4) {
              rgbData[j++] = data[i]; // R
              rgbData[j++] = data[i + 1]; // G
              rgbData[j++] = data[i + 2]; // B
            }
            return rgbData;
          },
          rows: image.height,
          columns: image.width,
          height: image.height,
          width: image.width,
          color: true,
          columnPixelSpacing: 1,
          rowPixelSpacing: 1,
          // Approximate size in bytes (RGB = 3 bytes)
          sizeInBytes: image.width * image.height * 3,
          rgba: false, // Set to false as we are now returning RGB
        };
        resolve(imageObject);
      };

      image.onerror = err => {
        console.error('Blob Loader Error:', err);
        reject(err);
      };
    }),
    cancelFn: () => {},
  };
}

// Register the loader properly
// We use 'blob' as the scheme.
// However, the URL is 'blob:http://...'. Cornerstone splits by colon.
// So the scheme is 'blob'.
imageLoader.registerImageLoader('blob', blobLoader);

export default ImageFileLoader;
