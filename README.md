# LexiLearn

## Backend Setup

This section outlines the steps taken to set up the backend for LexiLearn.

1.  **Project Initialization:**
    *   Chosen backend framework: Express.js
    *   Created `backend/` directory.
    *   Initialized backend project using `npm init -y` within the `backend/` directory.
    *   Set up `.gitignore` in `backend/` to ignore `node_modules/` and `.env`.

2.  **Basic Server Setup:**
    *   Installed core dependencies: `express`, `cors`, and `dotenv`.
    *   Created `server.js` as the entry point.
    *   Implemented a basic server listening on a port (default 5000).
    *   Enabled CORS for frontend-backend communication.
    *   Configured `dotenv` to load environment variables.

3.  **Project Structure:**
    *   Created `routes/`, `controllers/`, and `services/` folders within `backend/`.
    *   Added a health check endpoint at `/api/health`.

## Ollama Integration

This section details the integration of Ollama for AI model interaction.

1.  **Research & Preparation:**
    *   Reviewed Ollama API documentation.
    *   Determined authentication and access requirements (none for local setup).
    *   Installed `axios` for HTTP client functionality.

2.  **Service Implementation:**
    *   Created `ollamaService.js` in `backend/services/`.
    *   Implemented `generateResponse` function to send prompts to Ollama and receive responses.
    *   Added error handling for Ollama API failures, including connection refused errors.
    *   Added logging for requests and responses for debugging purposes.

3.  **Testing:**
    *   Tested Ollama integration with sample prompts (requires Ollama server to be running).
    *   Validated response format and data integrity.
    *   Documented usage and limitations in this `README.md`.

**Note:** To run the Ollama integration, ensure the Ollama server is running and accessible, typically at `http://localhost:11434`.