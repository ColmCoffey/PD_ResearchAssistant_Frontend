import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import SimplePdfViewer from '../components/pdf-viewer/SimplePdfViewer';
import PdfService, { ChunkSpanInfo } from '../services/pdf.service';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  color: #dc3545;
  padding: 1rem;
  text-align: center;
  background-color: #f8d7da;
  border-radius: 4px;
  margin: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FallbackButton = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #3367d6;
  }
`;

const NewPdfViewerPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chunkInfo, setChunkInfo] = useState<ChunkSpanInfo | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [useFallback, setUseFallback] = useState(false);
  
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
        // Get PDF URL - using fallback mode if activated
        const url = PdfService.getPdfUrl(filename, useFallback);
        if (!url) {
          setError('Failed to locate PDF file.');
          setLoading(false);
          return;
        }
        setPdfUrl(url);
        
        // Get chunk information for highlighting
        const spanInfo = await PdfService.getChunkSpanInfo(filename, page, chunkIndex);
        if (spanInfo) {
          setChunkInfo(spanInfo);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading PDF:', err);
        setError('Failed to load PDF. Please try again later.');
        setLoading(false);
      }
    };
    
    loadPdfData();
  }, [filename, page, chunkIndex, useFallback]);

  // Handle using fallback PDFs instead of S3
  const handleUseFallback = () => {
    setUseFallback(true);
    setLoading(true);
    setError(null);
  };

  if (loading) {
    return (
      <Layout>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '80vh'
        }}>
          Loading PDF viewer...
        </div>
      </Layout>
    );
  }

  if (error || !pdfUrl) {
    return (
      <Layout>
        <ErrorContainer>
          {error || 'Failed to load PDF. Missing URL.'}
          <div style={{ margin: '10px 0', fontSize: '0.8rem', color: '#666', textAlign: 'left', maxWidth: '800px', overflowWrap: 'break-word' }}>
            <p><strong>Debugging info:</strong></p>
            <p>Filename: {filename || 'None'}</p>
            <p>Attempted URL: {pdfUrl || 'None'}</p>
            <p>
              Known working PDF URL: 
              https://turku-pd-literature.s3.eu-central-1.amazonaws.com/Jang%20et%20al._2023_Mass%20Spectrometry%E2%80%93Based%20Proteomics%20Analysis%20of_1.pdf
            </p>
            <p>
              Tip: If your PDF filename contains special characters, try a simpler filename or check encoding.
            </p>
          </div>
          <FallbackButton onClick={handleUseFallback}>
            Try Fallback PDF (Use public PDFs instead)
          </FallbackButton>
        </ErrorContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <SimplePdfViewer
        pdfUrl={pdfUrl}
        initialPage={page}
        highlightText={chunkInfo?.text}
        title={formattedName}
      />
    </Layout>
  );
};

export default NewPdfViewerPage; 