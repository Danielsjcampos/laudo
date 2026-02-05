
// @ts-nocheck
import fs from 'fs';
import path from 'path';
// @ts-ignore
declare module 'dcmjs';
import * as dcmjs from 'dcmjs';
import sharp from 'sharp';

interface DicomMetadata {
  patientName?: string;
  studyDescription?: string;
  modality?: string;
  seriesDescription?: string;
  studyDate?: string;
}

export const processDicomFile = async (filePath: string, outputDir: string) => {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    
    // Convert to DICOM dataset
    const dicomData = dcmjs.data.DicomMessage.readFile(fileBuffer.buffer);
    const dataset = dcmjs.data.DicomMetaDictionary.naturalizeDataset(dicomData.dict);

    // Extract metadata
    const metadata: DicomMetadata = {
      patientName: dataset.PatientName?.Alphabetical || dataset.PatientName || 'Não identificado',
      studyDescription: dataset.StudyDescription || 'Sem descrição',
      modality: dataset.Modality || 'N/A',
      seriesDescription: dataset.SeriesDescription || 'Sem série',
      studyDate: dataset.StudyDate || ''
    };

    // Extract PixelData
    let pngPath = '';
    if (dataset.PixelData && dataset.Rows && dataset.Columns) {
      const { Rows, Columns } = dataset;
      
      // Basic grayscale conversion using sharp
      // PixelData can be an array (for encapsulated/compressed) or a single Buffer
      const pixelDataSource = Array.isArray(dataset.PixelData) ? dataset.PixelData[0] : dataset.PixelData;
      const buffer = Buffer.from(pixelDataSource);
      
      const outputFileName = `preview-${Date.now()}.png`;
      pngPath = path.join(outputDir, outputFileName);

      try {
        await sharp(buffer, {
          raw: {
            width: Columns,
            height: Rows,
            channels: 1
          }
        })
        .png()
        .toFile(pngPath);
      } catch (sharpError) {
        console.warn('Sharp conversion failed, image might be compressed or unsupported:', sharpError);
        pngPath = ''; // Reset so it doesn't try to link a non-existent file
      }
    }

    return {
      metadata,
      previewUrl: pngPath ? `/uploads/previews/${path.basename(pngPath)}` : null
    };
  } catch (error) {
    console.error('Error processing DICOM:', error);
    throw new Error('Falha ao processar arquivo DICOM');
  }
};
