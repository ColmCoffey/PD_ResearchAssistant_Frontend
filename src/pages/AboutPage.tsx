import React from 'react';
import styled from 'styled-components';
import Layout from '../components/Layout';

const AboutContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  margin-bottom: 1.5rem;
  color: #333;
`;

const Section = styled.section`
  margin-bottom: 2.5rem;
`;

const SectionTitle = styled.h2`
  margin-bottom: 1rem;
  color: #444;
`;

const Paragraph = styled.p`
  margin-bottom: 1rem;
  line-height: 1.7;
  color: #555;
`;

const List = styled.ul`
  margin-bottom: 1.5rem;
  padding-left: 1.5rem;
`;

const ListItem = styled.li`
  margin-bottom: 0.5rem;
  line-height: 1.6;
  color: #555;
`;

const AboutPage: React.FC = () => {
  return (
    <Layout>
      <AboutContainer>
        <Title>About This Project</Title>
        
        <Section>
          <SectionTitle>Parkinson's Disease Research Assistant</SectionTitle>
          <Paragraph>
            This application provides an AI-powered research assistant specialized in Parkinson's disease information. 
            It uses a retrieval-augmented generation (RAG) system to provide accurate, evidence-based answers 
            to questions about Parkinson's disease, backed by scientific literature.
          </Paragraph>
        </Section>
        
        <Section>
          <SectionTitle>How It Works</SectionTitle>
          <Paragraph>
            When you ask a question, our system:
          </Paragraph>
          <List>
            <ListItem>
              <strong>Retrieves</strong> relevant information from a curated database of Parkinson's disease research papers
            </ListItem>
            <ListItem>
              <strong>Analyzes</strong> this information to generate a comprehensive answer
            </ListItem>
            <ListItem>
              <strong>Provides</strong> citations to the source material used to create the response
            </ListItem>
          </List>
          <Paragraph>
            This ensures that all answers are grounded in actual research rather than just the AI's training data.
          </Paragraph>
        </Section>
        
        <Section>
          <SectionTitle>Limitations</SectionTitle>
          <Paragraph>
            While our system provides valuable information, please remember:
          </Paragraph>
          <List>
            <ListItem>
              This tool is for research and educational purposes only
            </ListItem>
            <ListItem>
              It is not a substitute for professional medical advice, diagnosis, or treatment
            </ListItem>
            <ListItem>
              The information provided reflects the available research at the time the database was created
            </ListItem>
          </List>
          <Paragraph>
            Always consult with qualified healthcare providers for medical advice about Parkinson's disease.
          </Paragraph>
        </Section>
      </AboutContainer>
    </Layout>
  );
};

export default AboutPage; 