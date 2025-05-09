import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import * as pdfjsLib from 'pdfjs-dist';

// Set the worker source path
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

interface AdvancedPdfViewerProps {
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
  background-color: #f8f9fa;
  padding: 1rem;
  height: 800px;
  overflow: auto;
  position: relative;
`;

const CanvasContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  position: relative;
`;

const TextLayerContainer = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  line-height: 1.0;
  opacity: 0.8;
  
  /* Styling for the text layer elements */
  & > div {
    position: absolute;
    white-space: pre;
    cursor: text;
    transform-origin: 0% 0%;
  }
  
  /* Make text selectable */
  & > div {
    pointer-events: auto;
  }
  
  /* Highlight style */
  & > div.highlight {
    background-color: rgba(255, 235, 59, 0.5) !important;
    color: #000 !important;
    border-radius: 2px;
  }
`;

const LoadingMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
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

const NavigationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background-color: #f8f9fa;
  border-radius: 4px;
`;

const PageInfo = styled.div`
  font-size: 1rem;
  color: #333;
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

const ZoomContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ZoomButton = styled.button`
  padding: 0.5rem;
  background-color: #f8f9fa;
  color: #333;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  cursor: pointer;
  margin: 0 0.25rem;

  &:hover {
    background-color: #e9ecef;
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

const AdvancedPdfViewer: React.FC<AdvancedPdfViewerProps> = ({
  pdfUrl,
  initialPage = 1,
  highlightText = '',
  title = 'PDF Document'
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfDocument, setPdfDocument] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [scale, setScale] = useState<number>(1.2);
  const [renderedPage, setRenderedPage] = useState<pdfjsLib.PDFPageProxy | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);
  const renderTaskRef = useRef<any>(null);
  
  // Load the PDF document
  useEffect(() => {
    const loadPdf = async () => {
      try {
        setLoading(true);
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        
        setPdfDocument(pdf);
        setTotalPages(pdf.numPages);
        setLoading(false);
      } catch (err: unknown) {
        console.error('Error loading PDF:', err);
        
        // Check if the error might be CORS-related
        const isCorsError = 
          String(err).includes('CORS') || 
          (err as any)?.message?.includes('NetworkError') ||
          (err as any)?.name === 'UnknownErrorException'; // PDF.js often reports CORS as unknown error
        
        if (isCorsError) {
          setError(
            'Failed to load the PDF due to cross-origin restrictions. ' +
            'This is a security feature of browsers that prevents loading content from different domains. ' +
            'Try using the Simple PDF Viewer instead.'
          );
        } else {
          setError('Failed to load the PDF document. Please try again later.');
        }
        
        setLoading(false);
      }
    };
    
    loadPdf();
    
    // Cleanup function
    return () => {
      if (pdfDocument) {
        pdfDocument.destroy();
      }
    };
  }, [pdfUrl]);
  
  // Render the current page
  useEffect(() => {
    const renderPage = async () => {
      if (!pdfDocument || !canvasRef.current) return;
      
      try {
        // If we're already rendering, cancel the previous render
        if (isRendering && renderTaskRef.current) {
          try {
            renderTaskRef.current.cancel();
          } catch (e) {
            console.log('Error canceling previous render:', e);
          }
        }
        
        setIsRendering(true);
        setError(null);
        
        // Clear any previous rendered page
        if (renderedPage) {
          renderedPage.cleanup();
          setRenderedPage(null);
        }
        
        // Get the page
        const page = await pdfDocument.getPage(currentPage);
        setRenderedPage(page);
        
        // Prepare canvas for rendering
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;
        
        // Clear the canvas first
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // Calculate viewport to render the page at the specified scale
        const viewport = page.getViewport({ scale });
        
        // Set canvas height and width to match the viewport
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        // Render the page in the canvas
        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        
        const renderTask = page.render(renderContext);
        renderTaskRef.current = renderTask;
        
        await renderTask.promise;
        
        // Render text layer if available
        if (textLayerRef.current) {
          // Clear any existing text layer content
          textLayerRef.current.innerHTML = '';
          
          // Create text layer container if it doesn't exist
          let textLayerDiv = textLayerRef.current.querySelector('.textLayer');
          if (!textLayerDiv) {
            textLayerDiv = document.createElement('div');
            textLayerDiv.className = 'textLayer';
            textLayerRef.current.appendChild(textLayerDiv);
          } else {
            textLayerDiv.innerHTML = '';
          }
          
          // Size the text layer container
          textLayerRef.current.style.height = `${viewport.height}px`;
          textLayerRef.current.style.width = `${viewport.width}px`;
          
          // Get text content from the PDF page
          const textContent = await page.getTextContent();
          
          // Apply text layer to add selectable text over the rendered page
          pdfjsLib.renderTextLayer({
            container: textLayerDiv as HTMLElement,
            viewport,
            textDivs: [],
            textContent,
          } as any);
          
          // If highlightText is provided, try to find and highlight it after a short delay
          // to allow the text layer to fully render
          if (highlightText && highlightText.length > 0) {
            setTimeout(() => {
              try {
                highlightTextInLayer(textLayerRef.current as HTMLElement, highlightText);
              } catch (err) {
                console.error('Error highlighting text:', err);
              }
            }, 500);
          }
        }
        
        setIsRendering(false);
        
      } catch (err: unknown) {
        console.error('Error rendering page:', err);
        setError('Failed to render the PDF page. Please try again later.');
        setIsRendering(false);
      }
    };
    
    renderPage();
    
    // Cleanup function
    return () => {
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch (e) {
          console.log('Error canceling render task in cleanup:', e);
        }
      }
    };
  }, [pdfDocument, currentPage, scale, highlightText, isRendering, renderedPage]);
  
  // Function to highlight text in the text layer
  const highlightTextInLayer = (textLayer: HTMLElement, searchText: string) => {
    if (!searchText || searchText.trim() === '') return;
    
    // Simple case-insensitive text highlight
    const textLayerDivs = textLayer.querySelectorAll('.textLayer > div');
    const searchTextLower = searchText.toLowerCase();
    
    // First try exact phrase match
    let foundExactMatch = false;
    textLayerDivs.forEach(div => {
      const textContent = div.textContent || '';
      if (textContent.toLowerCase().includes(searchTextLower)) {
        // Apply highlight styling
        div.classList.add('highlight');
        foundExactMatch = true;
        
        // Scroll to the first highlighted element
        if (foundExactMatch) {
          div.scrollIntoView({ behavior: 'smooth', block: 'center' });
          foundExactMatch = false; // Only scroll to the first match
        }
      }
    });
    
    // If no exact match, try word-by-word matching
    if (!foundExactMatch) {
      const searchWords = searchTextLower.split(/\s+/).filter(word => word.length > 3);
      
      textLayerDivs.forEach(div => {
        const textContent = div.textContent || '';
        const textLower = textContent.toLowerCase();
        
        // Check if this div contains any of our search words
        const hasMatchingWord = searchWords.some(word => textLower.includes(word));
        
        if (hasMatchingWord) {
          div.classList.add('highlight');
        }
      });
    }
  };
  
  // Page navigation
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };
  
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };
  
  // Zoom controls
  const zoomIn = () => {
    setScale(prevScale => prevScale + 0.2);
  };
  
  const zoomOut = () => {
    setScale(prevScale => Math.max(0.5, prevScale - 0.2));
  };
  
  const resetZoom = () => {
    setScale(1.2);
  };
  
  if (loading) {
    return (
      <ViewerContainer>
        <LoadingMessage>Loading PDF...</LoadingMessage>
      </ViewerContainer>
    );
  }
  
  if (error) {
    return (
      <ViewerContainer>
        <ErrorMessage>{error}</ErrorMessage>
      </ViewerContainer>
    );
  }
  
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
      </ViewerHeader>
      
      {highlightText && (
        <HighlightedTextContainer>
          <HighlightedTextTitle>Cited Text (Page {initialPage}):</HighlightedTextTitle>
          <HighlightedText>
            {highlightText}
          </HighlightedText>
        </HighlightedTextContainer>
      )}
      
      <NavigationContainer>
        <div>
          <NavigationButton onClick={goToPreviousPage} disabled={currentPage <= 1}>
            Previous Page
          </NavigationButton>
          <PageInfo>Page {currentPage} of {totalPages}</PageInfo>
          <NavigationButton onClick={goToNextPage} disabled={currentPage >= totalPages}>
            Next Page
          </NavigationButton>
        </div>
        <ZoomContainer>
          <ZoomButton onClick={zoomOut} title="Zoom Out">-</ZoomButton>
          <span style={{ margin: '0 0.5rem' }}>{Math.round(scale * 100)}%</span>
          <ZoomButton onClick={zoomIn} title="Zoom In">+</ZoomButton>
          <ZoomButton onClick={resetZoom} title="Reset Zoom">Reset</ZoomButton>
        </ZoomContainer>
      </NavigationContainer>
      
      <PdfContainer>
        <CanvasContainer>
          <canvas ref={canvasRef}></canvas>
          <TextLayerContainer ref={textLayerRef}></TextLayerContainer>
        </CanvasContainer>
      </PdfContainer>
    </ViewerContainer>
  );
};

export default AdvancedPdfViewer; 