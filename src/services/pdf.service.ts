/**
 * PDF Service
 * 
 * This service handles PDF-related operations including retrieving PDFs 
 * and determining text highlighting positions.
 * 
 * Note: In a production environment, you would integrate with your actual PDF storage
 * solution (e.g., S3 bucket) and implement server-side APIs for handling PDFs.
 */

// Base URL for PDF files - pointing to the S3 bucket for Turku PD literature
const PDF_BASE_URL = process.env.REACT_APP_PDF_STORAGE_URL || 'https://turku-pd-literature.s3.eu-central-1.amazonaws.com';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

/**
 * Get the URL to a PDF file based on its filename
 * Returns null if the filename is invalid or empty.
 * 
 * @param filename - The name of the PDF file to retrieve
 * @param forceFallback - If true, forces the use of fallback public PDFs instead of S3
 */
export const getPdfUrl = (filename: string, forceFallback: boolean = false): string | null => {
  if (!filename || typeof filename !== 'string' || filename.trim() === '') {
    console.warn('getPdfUrl: Invalid or empty filename provided:', filename);
    return null;
  }
  
  console.log('Getting PDF URL for filename:', filename);
  
  // Known working S3 PDFs - the exact URL we know works
  const workingUrl = 'https://turku-pd-literature.s3.eu-central-1.amazonaws.com/Jang%20et%20al._2023_Mass%20Spectrometry%E2%80%93Based%20Proteomics%20Analysis%20of_1.pdf';
  
  // For advanced PDF viewer, always try to use the working URL to avoid CORS issues
  const isAdvancedViewer = window.location.pathname.includes('advanced-pdf-viewer');
  if (isAdvancedViewer && !forceFallback) {
    console.log('Using advanced viewer - serving known working S3 PDF');
    return workingUrl;
  }
  
  // If we're not forcing fallback, try to use the working URL directly
  if (!forceFallback) {
    // Check if the filename contains any variation of "Jang" and return the known working URL
    if (filename.toLowerCase().includes('jang')) {
      console.log('Using known working S3 PDF URL for Jang paper');
      return workingUrl;
    }
    
    // For all other filenames, log the attempt but immediately use fallback
    // since we're still getting access denied errors
    console.log(`Filename "${filename}" doesn't match known working patterns. Using fallback.`);
    console.log('To try direct S3 access, use a URL with a filename similar to:');
    console.log('Jang et al._2023_Mass Spectrometry–Based Proteomics Analysis of_1.pdf');
    
    // Force fallback for all other filenames until we resolve the S3 access issues
    forceFallback = true;
  } else {
    console.log('Forced fallback mode - Using public PDFs instead of S3');
  }
  
  // Fallback to reliable public PDFs for testing
  console.log('Using fallback public PDF for testing');
  
  // Public PDFs for testing - using only reliable sources
  const publicPdfs: {[key: string]: string} = {
    'default': 'https://arxiv.org/pdf/1708.08021.pdf', // AI for Neuroscience paper
    'pd-review.pdf': 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5652067/pdf/nihms890061.pdf',
    'parkinsons.pdf': 'https://arxiv.org/pdf/2311.05766.pdf', // Another Parkinson's paper
    'jang': 'https://arxiv.org/pdf/2310.01425.pdf', // A paper similar to the working S3 PDF
  };
  
  // Return a matching public PDF if available, otherwise return the default
  const cleanFilename = filename.trim().toLowerCase();
  return publicPdfs[cleanFilename] || publicPdfs['default'];
};

/**
 * Get text span information for a chunk
 * 
 * In a real implementation, this would call an API that returns the exact 
 * position of text in the PDF for highlighting purposes.
 */
export const getChunkSpanInfo = async (
  filename: string, 
  page: number, 
  chunkIndex: number
): Promise<ChunkSpanInfo | null> => {
  try {
    // This would be an API call to get information about the text chunk
    // const response = await fetch(
    //   `${API_BASE_URL}/api/pdf-chunks?file=${encodeURIComponent(filename)}&page=${page}&chunk=${chunkIndex}`
    // );
    // if (!response.ok) throw new Error('Failed to fetch chunk data');
    // return await response.json();
    
    // For demonstration, we're returning mock data with Parkinson's disease related text
    return {
      page,
      chunkIndex,
      startOffset: { x: 50, y: 100 },
      endOffset: { x: 500, y: 300 },
      text: "Parkinson's disease (PD) is a progressive neurodegenerative disorder characterized by motor symptoms including tremor, rigidity, bradykinesia, and postural instability. It is caused by the degeneration of dopaminergic neurons in the substantia nigra pars compacta, leading to a deficiency of dopamine in the striatum. Current treatments primarily focus on symptomatic relief through dopamine replacement therapy."
    };
  } catch (error) {
    console.error('Error fetching chunk information:', error);
    return null;
  }
};

/**
 * Request a PDF to be pre-processed for highlighting
 * This would typically be called when a user first accesses a PDF to prepare it for viewing
 */
export const preparePdfForViewing = async (filename: string): Promise<boolean> => {
  try {
    // This would call a backend API to prepare the PDF
    // For example, extracting text layers, calculating positions, etc.
    // const response = await fetch(
    //   `${API_BASE_URL}/api/prepare-pdf`,
    //   {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ filename })
    //   }
    // );
    // return response.ok;
    
    // For demonstration, we'll just return success
    return true;
  } catch (error) {
    console.error('Error preparing PDF:', error);
    return false;
  }
};

// Interface for text position information
export interface ChunkSpanInfo {
  page: number;
  chunkIndex: number;
  startOffset: { x: number, y: number };
  endOffset: { x: number, y: number };
  text: string;
}

// Service object export
const PdfService = {
  getPdfUrl,
  getChunkSpanInfo,
  preparePdfForViewing
};

export default PdfService; 