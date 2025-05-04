import React from 'react';
import styled from 'styled-components';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const Footer = styled.footer`
  background-color: #f8f9fa;
  padding: 1.5rem;
  text-align: center;
  color: #6c757d;
  border-top: 1px solid #e9ecef;
`;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      <Header />
      <Main>{children}</Main>
      <Footer>
        <p>© {new Date().getFullYear()} Parkinson's Research Assistant</p>
      </Footer>
    </LayoutContainer>
  );
};

export default Layout; 