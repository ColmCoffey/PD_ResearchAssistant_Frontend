# Parkinson's Research Assistant Frontend

This is a React-based frontend for the Parkinson's Research Assistant application, a RAG (Retrieval-Augmented Generation) system that provides evidence-based answers to questions about Parkinson's disease.

## Features

- User-friendly interface for asking questions about Parkinson's disease
- Real-time querying of the backend RAG system
- Display of answers with source citations
- Responsive design that works across devices

## Technology Stack

- React with TypeScript
- React Router for navigation
- Styled Components for styling
- AWS Amplify for deployment

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/parkinsons-rag-frontend.git
   cd parkinsons-rag-frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```
   REACT_APP_API_BASE_URL=http://your-api-endpoint.com
   ```

4. Start the development server:
   ```
   npm start
   ```

The application will open in your browser at `http://localhost:3000`.

## Building for Production

To build the app for production:

```
npm run build
```

The build artifacts will be stored in the `build/` directory.

## Deployment with AWS Amplify

This project is configured for easy deployment with AWS Amplify. To deploy:

1. Connect your GitHub repository to AWS Amplify
2. Amplify will automatically detect the `amplify.yml` file
3. Configure environment variables in the Amplify Console:
   - `REACT_APP_API_BASE_URL`: Your API endpoint URL

Amplify will automatically build and deploy your application whenever you push changes to your repository.

## Development Guidelines

- Use TypeScript for all new components and functions
- Follow the established component organization
- Use styled-components for styling
- Keep components small and focused on a single responsibility
- Use the custom hooks provided in the `hooks` directory

## Project Structure

```
src/
  ├── assets/       # Static assets like images
  ├── components/   # Reusable UI components
  ├── config/       # Configuration files
  ├── hooks/        # Custom React hooks
  ├── pages/        # Page components
  ├── services/     # API and other services
  ├── types/        # TypeScript type definitions
  ├── App.tsx       # Main application component
  └── index.tsx     # Application entry point
```

## License

[MIT](LICENSE)
# PD_ResearchAssistant_Frontend
