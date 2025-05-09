import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import PdfViewerPage from './pages/PdfViewerPage';
import NewPdfViewerPage from './pages/NewPdfViewerPage';
import AdvancedPdfViewerPage from './pages/AdvancedPdfViewerPage';
import './App.css';

// Configure Amplify - this will be updated with your actual configuration when deployed
Amplify.configure({
  // This will be replaced with the actual configuration from AWS Amplify
  API: {
    REST: {
      'ParkinsonsAPI': {
        endpoint: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000'
      }
    }
  }
});

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/pdf-viewer" element={<NewPdfViewerPage />} />
        <Route path="/advanced-pdf-viewer" element={<AdvancedPdfViewerPage />} />
        <Route path="/legacy-pdf-viewer" element={<PdfViewerPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
