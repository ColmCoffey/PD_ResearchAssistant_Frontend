import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const NotFoundContainer = styled.div`
  max-width: 600px;
  margin: 3rem auto;
  text-align: center;
`;

const Title = styled.h1`
  margin-bottom: 1rem;
  font-size: 2.5rem;
  color: #4285f4;
`;

const Message = styled.p`
  margin-bottom: 2rem;
  font-size: 1.2rem;
  color: #555;
`;

const HomeLink = styled(Link)`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #4285f4;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: #3367d6;
  }
`;

const NotFoundPage: React.FC = () => {
  return (
    <Layout>
      <NotFoundContainer>
        <Title>404 - Page Not Found</Title>
        <Message>
          The page you are looking for doesn't exist or has been moved.
        </Message>
        <HomeLink to="/">Return to Home</HomeLink>
      </NotFoundContainer>
    </Layout>
  );
};

export default NotFoundPage; 