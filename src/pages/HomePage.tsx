import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import QueryForm from '../components/QueryForm';
import QueryResult from '../components/QueryResult';
import useQuery from '../hooks/useQuery';

const HomeContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  margin-bottom: 0.5rem;
  color: #333;
`;

const Description = styled.p`
  margin-bottom: 2rem;
  color: #6c757d;
  line-height: 1.6;
`;

const HomePage: React.FC = () => {
  const { submitQuery, getQueryStatus, queryResponse, loading, polling, error } = useQuery();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Check for query_id in URL and load that query if present
  useEffect(() => {
    const queryId = searchParams.get('query_id');
    if (queryId) {
      getQueryStatus(queryId);
    }
  }, [searchParams, getQueryStatus]);
  
  const handleSubmit = async (query: string) => {
    const queryId = await submitQuery(query);
    if (queryId) {
      navigate(`/?query_id=${queryId}`);
    }
  };
  
  return (
    <Layout>
      <HomeContainer>
        <Title>Parkinson's Disease Research Assistant</Title>
        <Description>
          Ask questions about Parkinson's disease research and get evidence-based answers
          with citations to scientific literature.
        </Description>
        
        <QueryForm onSubmit={handleSubmit} isLoading={loading} />
        
        {error && (
          <div style={{ color: 'red', marginTop: '1rem' }}>
            Error: {error}
          </div>
        )}
        
        <QueryResult 
          result={queryResponse} 
          isLoading={loading} 
          isPolling={polling} 
        />
      </HomeContainer>
    </Layout>
  );
};

export default HomePage; 