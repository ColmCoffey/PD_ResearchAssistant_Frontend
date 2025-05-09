import React from 'react';
import styled from 'styled-components';
import { QueryResponse } from '../types/api';
import EnhancedSourceViewer from './EnhancedSourceViewer';

interface QueryResultProps {
  result: QueryResponse | null;
  isLoading: boolean;
  isPolling: boolean;
}

const ResultContainer = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  border-radius: 8px;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
`;

const LoadingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6c757d;
  font-style: italic;
`;

const Spinner = styled.div`
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-top: 2px solid #4285f4;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const AnswerContainer = styled.div`
  margin-top: 1rem;
  white-space: pre-wrap;
  line-height: 1.6;
`;

const QueryText = styled.p`
  font-weight: 600;
  margin-bottom: 1rem;
  color: #4285f4;
`;

const QueryResult: React.FC<QueryResultProps> = ({ result, isLoading, isPolling }) => {
  if (isLoading) {
    return (
      <ResultContainer>
        <LoadingIndicator>
          <Spinner />
          <span>Processing your question...</span>
        </LoadingIndicator>
      </ResultContainer>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <ResultContainer>
      <QueryText>Q: {result.query_text}</QueryText>
      
      {isPolling && !result.answer_text && (
        <LoadingIndicator>
          <Spinner />
          <span>Generating answer...</span>
        </LoadingIndicator>
      )}
      
      {result.answer_text && (
        <>
          <AnswerContainer>
            <strong>A:</strong> {result.answer_text}
          </AnswerContainer>
          
          {result.sources && result.sources.length > 0 && (
            <EnhancedSourceViewer sources={result.sources} />
          )}
        </>
      )}
    </ResultContainer>
  );
};

export default QueryResult; 