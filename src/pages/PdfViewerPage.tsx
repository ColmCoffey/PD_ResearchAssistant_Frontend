import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../components/Layout';
import PdfService, { ChunkSpanInfo } from '../services/pdf.service';
import PdfHighlightLayer from '../components/PdfHighlightLayer';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Initialize the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.mjs`;

// Note: In a real implementation, you would likely want to use a PDF viewer library
// such as react-pdf, pdf.js or pdfjs-dist to render the PDF and handle highlighting.
// For simplicity, this example shows the structure without implementing the full PDF viewing capability.

const ViewerContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 1rem;
`;

const ViewerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
`;

const Title = styled.h1`
  color: #333;
  font-size: 1.5rem;
  margin-top: 0.5rem;
`;

const PdfContainer = styled.div`
  border: 1px solid #e9ecef;
  border-radius: 4px;
  min-height: 800px;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const DocumentContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  overflow: auto;
  position: relative;
`;

const StyledPage = styled(Page)`
  canvas {
    max-width: 100%;
    height: auto !important;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .react-pdf__Page__textContent {
    user-select: text;
  }
  
  .react-pdf__Page__textContent > span[data-highlighted="true"] {
    background-color: rgba(255, 235, 59, 0.5);
    border-radius: 2px;
  }
  
  .textLayer {
    opacity: 1;
  }
`;

const PdfLoadingMessage = styled.div`
  font-size: 1.2rem;
  color: #6c757d;
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  padding: 1rem;
  text-align: center;
  background-color: #f8d7da;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const NavigationButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin: 0 0.25rem;

  &:hover {
    background-color: #3367d6;
  }
  
  &:disabled {
    background-color: #a4c2f4;
    cursor: not-allowed;
  }
`;

const HighlightedTextContainer = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background-color: #fff3cd;
  border: 1px solid #ffeeba;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const HighlightedTextTitle = styled.h3`
  color: #856404;
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const HighlightedText = styled.p`
  color: #666;
  margin: 0;
  line-height: 1.6;
`;

const BackToResultsLink = styled.a`
  color: #4285f4;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  margin-top: 1rem;
  
  &:hover {
    text-decoration: underline;
  }
  
  svg {
    margin-right: 0.5rem;
  }
`;

// Component for highlighted text (to replace mark)
const HighlightedSpan = ({ children }: { children: string }) => (
  <span style={{ backgroundColor: 'rgba(255, 235, 59, 0.5)', borderRadius: '2px', padding: '0' }}>
    {children}
  </span>
);

const PdfViewerPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [chunkInfo, setChunkInfo] = useState<ChunkSpanInfo | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  
  // Get the parameters from the URL
  const filename = searchParams.get('file');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const chunkIndex = parseInt(searchParams.get('chunk') || '0', 10);
  
  // Format the filename for display
  const displayName = filename ? 
    filename.replace('.pdf', '').split('-').join(' ').split('_').join(' ') : 
    'PDF Document';
  const formattedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);

  useEffect(() => {
    if (!filename) {
      setError('No file specified');
      setLoading(false);
      return;
    }
    
    // Load PDF and chunk information
    const loadPdfData = async () => {
      try {
        // Get PDF URL
        const url = PdfService.getPdfUrl(filename);
        setPdfUrl(url);
        
        // Get chunk information for highlighting
        const spanInfo = await PdfService.getChunkSpanInfo(filename, page, chunkIndex);
        if (spanInfo) {
          setChunkInfo(spanInfo);
        }
        
        // Prepare the PDF for highlighting (in a real implementation)
        await PdfService.preparePdfForViewing(filename);
        
        setPageNumber(page);
        setLoading(false);
      } catch (err) {
        setError('Failed to load PDF. Please try again later.');
        setLoading(false);
      }
    };
    
    loadPdfData();
  }, [filename, page, chunkIndex]);
  
  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };
  
  const handleNextPage = () => {
    if (pageNumber < totalPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setTotalPages(numPages);
    setLoading(false);
  };

  console.log('filename param:', filename);
  console.log('PDF URL:', pdfUrl);

  return (
    <Layout>
      <ViewerContainer>
        <ViewerHeader>
          <div>
            <BackToResultsLink href="/">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="#4285f4"/>
              </svg>
              Back to Results
            </BackToResultsLink>
            <Title>{formattedName}</Title>
          </div>
          <div>
            <NavigationButton 
              onClick={handlePreviousPage} 
              disabled={pageNumber <= 1 || loading}
            >
              Previous Page
            </NavigationButton>
            <span style={{ margin: '0 1rem' }}>
              Page {pageNumber} of {totalPages}
            </span>
            <NavigationButton 
              onClick={handleNextPage} 
              disabled={pageNumber >= totalPages || loading}
            >
              Next Page
            </NavigationButton>
          </div>
        </ViewerHeader>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        {chunkInfo && (
          <HighlightedTextContainer>
            <HighlightedTextTitle>Cited Text (Chunk {chunkIndex} on Page {page}):</HighlightedTextTitle>
            <HighlightedText>
              {chunkInfo.text}
            </HighlightedText>
          </HighlightedTextContainer>
        )}
        
        <PdfContainer>
          {loading ? (
            <PdfLoadingMessage>Loading PDF...</PdfLoadingMessage>
          ) : (
            <DocumentContainer ref={pdfContainerRef}>
              {pdfUrl && (
                <>
                  <Document
                    file="https://turku-pd-literature.s3.eu-central-1.amazonaws.com/Jang%20et%20al._2023_Mass%20Spectrometry%E2%80%93Based%20Proteomics%20Analysis%20of_1.pdf"
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={<PdfLoadingMessage>Loading PDF...</PdfLoadingMessage>}
                    error={<ErrorMessage>Failed to load PDF document</ErrorMessage>}
                  >
                    <StyledPage
                      pageNumber={pageNumber}
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                    />
                  </Document>
                  
                  <PdfHighlightLayer 
                    chunkInfo={chunkInfo}
                    pdfContainerRef={pdfContainerRef}
                    pageNumber={pageNumber}
                  />
                </>
              )}
            </DocumentContainer>
          )}
        </PdfContainer>
      </ViewerContainer>
    </Layout>
  );
};

export default PdfViewerPage; 