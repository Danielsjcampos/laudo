import FileLoaderService from './fileLoaderService';
import { DicomMetadataStore } from '@ohif/core';

const processFile = async (file) => {
  const tryLoad = async (loaderOverride) => {
     try {
       const fileLoaderService = new FileLoaderService(file, loaderOverride);
       const imageId = fileLoaderService.addFile(file);
       const image = await fileLoaderService.loadFile(file, imageId);
       const dicomJSONDataset = await fileLoaderService.getDataset(image, imageId);
       DicomMetadataStore.addInstance(dicomJSONDataset);
       return true;
     } catch (error) {
       console.log('Load attempt failed:', error.message, 'Override:', loaderOverride);
       return false;
     }
  };

  // 1. Try auto-detect (default)
  let success = await tryLoad();

  // 2. If failed, and didn't try image loader yet, force it
  if (!success) {
     console.log('Auto-detection failed, forcing Image Loader...');
     success = await tryLoad('image');
  }

  if (!success) {
    console.error('All load attempts failed for file', file.name);
  }
};

export default async function filesToStudies(files) {
  const processFilesPromises = files.map(processFile);
  await Promise.all(processFilesPromises);

  return DicomMetadataStore.getStudyInstanceUIDs();
}
