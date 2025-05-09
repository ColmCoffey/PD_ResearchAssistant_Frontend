import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface SimplePdfViewerProps {
  pdfUrl: string;
  initialPage?: number;
  highlightText?: string;
  title?: string;
}

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

const SimplePdfViewer: React.FC<SimplePdfViewerProps> = ({
  pdfUrl,
  initialPage = 1,
  highlightText = '',
  title = 'PDF Document'
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState(initialPage);

  // PDF loading handler
  const handleIframeLoad = () => {
    setLoading(false);
  };

  // Handle iframe errors
  const handleIframeError = () => {
    setError('Failed to load the PDF document. Please try again later.');
    setLoading(false);
  };

  // Generate the PDF URL with page parameter if needed
  const getPdfUrlWithPage = (): string => {
    // Some PDF viewers support navigating to a specific page using the #page=N parameter
    // Note: This may not work with all PDF viewers or PDFs
    if (pdfUrl.includes('?')) {
      return `${pdfUrl}&page=${pageNumber}#page=${pageNumber}`;
    }
    return `${pdfUrl}#page=${pageNumber}`;
  };

  useEffect(() => {
    // Initialize with the provided page number
    setPageNumber(initialPage);
  }, [initialPage]);

  return (
    <ViewerContainer>
      <ViewerHeader>
        <div>
          <BackToResultsLink href="/">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="#4285f4"/>
            </svg>
            Back to Results
          </BackToResultsLink>
          <Title>{title}</Title>
        </div>
        <div>
          <NavigationButton
            onClick={() => setPageNumber(prev => Math.max(1, prev - 1))}
            disabled={pageNumber <= 1 || loading}
          >
            Previous Page
          </NavigationButton>
          <span style={{ margin: '0 1rem' }}>
            Page {pageNumber}
          </span>
          <NavigationButton
            onClick={() => setPageNumber(prev => prev + 1)}
            disabled={loading}
          >
            Next Page
          </NavigationButton>
        </div>
      </ViewerHeader>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {highlightText && (
        <HighlightedTextContainer>
          <HighlightedTextTitle>Cited Text (Page {initialPage}):</HighlightedTextTitle>
          <HighlightedText>
            {highlightText}
          </HighlightedText>
        </HighlightedTextContainer>
      )}

      <PdfContainer>
        {loading && <PdfLoadingMessage>Loading PDF...</PdfLoadingMessage>}
        <iframe
          src={getPdfUrlWithPage()}
          width="100%"
          height="800px"
          title="PDF Viewer"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          style={{ border: 'none' }}
        />
      </PdfContainer>
    </ViewerContainer>
  );
};

export default SimplePdfViewer; 