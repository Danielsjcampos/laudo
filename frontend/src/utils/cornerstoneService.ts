
import cornerstone from 'cornerstone-core';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import dicomParser from 'dicom-parser';
import cornerstoneTools from 'cornerstone-tools';
import Hammer from 'hammerjs';

// Configuration for Web Workers is crucial for performance
// In a real Vite build, these worker files need to be in the public directory
const config = {
    webWorkerPath: '/cornerstoneWADOImageLoaderWebWorker.min.js',
    taskConfiguration: {
        decodeTask: {
            initializeCodecsOnStartup: false,
        },
    },
};

let initialized = false;

export const initCornerstone = () => {
    if (initialized) return;

    // Link dependencies
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
    cornerstoneTools.external.cornerstone = cornerstone;
    cornerstoneTools.external.Hammer = Hammer;

    // Initialize WADO Image Loader
    cornerstoneWADOImageLoader.webWorkerManager.initialize(config);

    // Initialize Tools
    cornerstoneTools.init();

    initialized = true;
};

export const getCornerstone = () => cornerstone;
export const getCornerstoneTools = () => cornerstoneTools;
