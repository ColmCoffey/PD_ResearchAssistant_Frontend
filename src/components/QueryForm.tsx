import React, { useState } from 'react';
import styled from 'styled-components';

interface QueryFormProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
}

const FormContainer = styled.div`
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TextArea = styled.textarea`
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  min-height: 120px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #4285f4;
    box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.2);
  }
`;

const SubmitButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  align-self: flex-end;

  &:hover {
    background-color: #3367d6;
  }

  &:disabled {
    background-color: #a4c2f4;
    cursor: not-allowed;
  }
`;

const QueryForm: React.FC<QueryFormProps> = ({ onSubmit, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSubmit(query.trim());
    }
  };

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <TextArea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your question about Parkinson's disease..."
          disabled={isLoading}
        />
        <SubmitButton type="submit" disabled={isLoading || !query.trim()}>
          {isLoading ? 'Submitting...' : 'Submit Question'}
        </SubmitButton>
      </Form>
    </FormContainer>
  );
};

export default QueryForm; 