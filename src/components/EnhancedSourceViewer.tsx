import React from 'react';
import styled from 'styled-components';

interface EnhancedSourceViewerProps {
  sources: string[];
}

interface ParsedSource {
  filename: string;
  page: number;
  chunkIndex: number;
  displayName: string;
}

const SourcesContainer = styled.div`
  margin-top: 1rem;
  padding-top: 0.5rem;
  border-top: 1px dashed #e9ecef;
`;

const SourceTitle = styled.h4`
  font-size: 0.95rem;
  color: #495057;
  margin-bottom: 0.5rem;
`;

const SourceList = styled.ul`
  padding-left: 1rem;
  list-style-type: none;
`;

const SourceItem = styled.li`
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const SourceLink = styled.a`
  color: #4285f4;
  text-decoration: none;
  display: flex;
  align-items: center;
  
  &:hover {
    text-decoration: underline;
  }
  
  svg {
    margin-right: 0.5rem;
  }
`;

// Parse the source ID into filename, page, and chunk index
const parseSourceId = (source: string): ParsedSource | null => {
  try {
    // Format is typically: "src/data/source/filename.pdf:3:0"
    const parts = source.split(':');
    
    if (parts.length < 3) return null;
    
    const page = parseInt(parts[parts.length - 2], 10);
    const chunkIndex = parseInt(parts[parts.length - 1], 10);
    
    // Extract filename by getting everything before the last two segments
    const pathParts = parts.slice(0, -2).join(':');
    const filename = pathParts.split('/').pop() || '';
    
    // Create a display name (remove extension and format nicely)
    const displayName = filename.replace('.pdf', '').split('-').join(' ').split('_').join(' ');
    
    return {
      filename,
      page,
      chunkIndex,
      displayName: displayName.charAt(0).toUpperCase() + displayName.slice(1)
    };
  } catch (error) {
    console.error('Error parsing source ID:', error);
    return null;
  }
};

// Generate a URL to view the PDF with the relevant part highlighted
const generatePdfViewerUrl = (parsedSource: ParsedSource): string => {
  // In a real implementation, this would point to your PDF viewer endpoint
  // The base URL would be configured based on your deployment environment
  const baseUrl = process.env.REACT_APP_PDF_VIEWER_URL || '/pdf-viewer';
  
  return `${baseUrl}?file=${encodeURIComponent(parsedSource.filename)}&page=${parsedSource.page}&chunk=${parsedSource.chunkIndex}`;
};

const EnhancedSourceViewer: React.FC<EnhancedSourceViewerProps> = ({ sources }) => {
  if (!sources || sources.length === 0) return null;
  
  return (
    <SourcesContainer>
      <SourceTitle>Original Sources (Click to View PDF):</SourceTitle>
      <SourceList>
        {sources.map((source, index) => {
          const parsedSource = parseSourceId(source);
          
          if (!parsedSource) return (
            <SourceItem key={index}>
              {source} (Unable to parse source)
            </SourceItem>
          );
          
          return (
            <SourceItem key={index}>
              <SourceLink 
                href={generatePdfViewerUrl(parsedSource)} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 19H5V5H12V3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V12H19V19ZM14 3V5H17.59L7.76 14.83L9.17 16.24L19 6.41V10H21V3H14Z" fill="#4285f4"/>
                </svg>
                {parsedSource.displayName} (Page {parsedSource.page})
              </SourceLink>
            </SourceItem>
          );
        })}
      </SourceList>
    </SourcesContainer>
  );
};

export default EnhancedSourceViewer; 