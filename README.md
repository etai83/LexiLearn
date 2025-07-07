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
