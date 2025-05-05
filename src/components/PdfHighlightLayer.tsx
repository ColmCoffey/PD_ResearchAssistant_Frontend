import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { ChunkSpanInfo } from '../services/pdf.service';

interface PdfHighlightLayerProps {
  chunkInfo: ChunkSpanInfo | null;
  pdfContainerRef: React.RefObject<HTMLDivElement | null>;
  pageNumber: number;
}

const HighlightOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
`;

const Highlight = styled.div`
  position: absolute;
  background-color: rgba(255, 235, 59, 0.3);
  border: 2px solid rgba(255, 193, 7, 0.5);
  border-radius: 3px;
  pointer-events: none;
`;

/**
 * Component to add highlighting overlay on top of a PDF page
 * This is a simplified approach - in a real implementation, you would use
 * the PDF.js API to get exact text positions and render highlights accordingly
 */
const PdfHighlightLayer: React.FC<PdfHighlightLayerProps> = ({ 
  chunkInfo, 
  pdfContainerRef,
  pageNumber
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Only apply highlighting if there's chunk info and it's for the current page
    if (!chunkInfo || chunkInfo.page !== pageNumber || !pdfContainerRef.current || !overlayRef.current) {
      return;
    }
    
    // This is where you would calculate the exact position of the text to highlight
    // For demonstration, we're using some approximate values
    const applyHighlight = () => {
      if (!pdfContainerRef.current) return;
      const containerRect = pdfContainerRef.current.getBoundingClientRect();
      
      // Get the PDF canvas element
      const canvas = pdfContainerRef.current.querySelector('canvas');
      if (!canvas) return;
      
      const canvasRect = canvas.getBoundingClientRect();
      
      // Create and position the highlight element
      const highlight = document.createElement('div');
      highlight.className = 'pdf-text-highlight';
      highlight.style.position = 'absolute';
      highlight.style.backgroundColor = 'rgba(255, 235, 59, 0.3)';
      highlight.style.border = '2px solid rgba(255, 193, 7, 0.5)';
      highlight.style.borderRadius = '3px';
      highlight.style.pointerEvents = 'none';
      
      // Calculate position based on canvas size and chunkInfo
      // These are approximate values for demonstration
      const canvasWidth = canvas.width;
      const scale = canvas.clientWidth / (canvasWidth || 1); // Prevent division by zero
      const left = (chunkInfo.startOffset.x * scale) + 'px';
      const top = (chunkInfo.startOffset.y * scale) + 'px';
      const width = ((chunkInfo.endOffset.x - chunkInfo.startOffset.x) * scale) + 'px';
      const height = ((chunkInfo.endOffset.y - chunkInfo.startOffset.y) * scale) + 'px';
      
      highlight.style.left = left;
      highlight.style.top = top;
      highlight.style.width = width;
      highlight.style.height = height;
      
      // Clear previous highlights
      if (overlayRef.current) {
        overlayRef.current.innerHTML = '';
        // Add the highlight
        overlayRef.current.appendChild(highlight);
      }
    };
    
    // Apply highlight after a short delay to ensure PDF is rendered
    const timerId = setTimeout(applyHighlight, 500);
    
    // Clean up
    return () => {
      clearTimeout(timerId);
      if (overlayRef.current) {
        overlayRef.current.innerHTML = '';
      }
    };
  }, [chunkInfo, pageNumber, pdfContainerRef]);
  
  if (!chunkInfo || chunkInfo.page !== pageNumber) {
    return null;
  }
  
  return <HighlightOverlay ref={overlayRef} />;
};

export default PdfHighlightLayer; 