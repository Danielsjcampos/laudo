import dicomImageLoader from '@cornerstonejs/dicom-image-loader';

import FileLoader from './fileLoader';
import PDFFileLoader from './pdfFileLoader';
import DICOMFileLoader from './dicomFileLoader';
import ImageFileLoader from './imageFileLoader';

class FileLoaderService extends FileLoader {
  fileType;
  loader;
  constructor(file, loaderType) {
    super();
    this.loader = this.getLoader(file, loaderType);
    this.fileType = this.loader.fileType;
  }

  addFile(file) {
    if (this.loader === ImageFileLoader) {
      return URL.createObjectURL(file);
    }
    return dicomImageLoader.wadouri.fileManager.add(file);
  }

  loadFile(file, imageId) {
    return this.loader.loadFile(file, imageId);
  }

  getDataset(image, imageId) {
    return this.loader.getDataset(image, imageId);
  }

  getLoader(file, loaderType) {
    if (loaderType === 'image') return ImageFileLoader;
    if (loaderType === 'dicom') return DICOMFileLoader;

    const fileType = file && file.type;
    const fileName = file && file.name && file.name.toLowerCase();

    console.log('[FileLoader] Checking:', fileName, fileType);

    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      return PDFFileLoader;
    } else if (
      (fileType && fileType.startsWith('image/')) ||
      (fileName &&
        (fileName.endsWith('.jpg') ||
          fileName.endsWith('.jpeg') ||
          fileName.endsWith('.png') ||
          fileName.endsWith('.webp') ||
          fileName.endsWith('.gif') ||
          fileName.endsWith('.bmp') ||
          fileName.endsWith('.tif') ||
          fileName.endsWith('.tiff')))
    ) {
      console.log('[FileLoader] Detected as Image');
      return ImageFileLoader;
    } else {
      console.log('[FileLoader] Defaulting to DICOM');
      return DICOMFileLoader;
    }
  }
}

export default FileLoaderService;
