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

## API Design

This section describes the design and implementation of the backend API endpoints.

### Quiz Generation API

*   **Endpoint:** `POST /api/quiz/generate`
*   **Description:** Generates a multiple-choice quiz based on provided text content using the Ollama service.
*   **Request Body:**
    ```json
    {
      "text": "Your long text content here from which to generate the quiz.",
      "numQuestions": 5 // Optional, default is 5
    }
    ```
*   **Success Response (200 OK):**
    ```json
    [
      {
        "question": "What is the capital of France?",
        "options": ["Berlin", "Madrid", "Paris", "Rome"],
        "answer": "Paris"
      },
      // ... more questions
    ]
    ```
*   **Error Responses:**
    *   `400 Bad Request`: If `text` is missing in the request body.
    *   `500 Internal Server Error`: If there's an issue with Ollama communication, parsing its response, or invalid quiz data format.

## Frontend Integration

This section details the integration of the frontend with the backend API.

1.  **API Connection:**
    *   Installed `axios` for making HTTP requests.
    *   Created `src/API/quizApi.js` to encapsulate API calls to the backend quiz generation endpoint.

2.  **UI/UX Updates:**
    *   Modified `src/pages/Upload.js` to handle file reading and call the `generateQuiz` API.
    *   Implemented loading states while waiting for the backend response.
    *   Added error display if the backend/API call fails.
    *   Integrated navigation to `QuizReview.js` with the generated quiz data.

3.  **Data Handling:**
    *   Updated `src/pages/QuizReview.js` to receive and display the quiz data passed from the `Upload` page.
    *   Basic parsing and validation of the backend response are handled within `quizController.js` and `ollamaService.js`.

**Note:** To test the frontend integration, ensure both the backend server (on port 5000) and the Ollama server (on port 11434) are running. Then, start the frontend development server by running `npm start` in the root directory of the project.

## Testing & Deployment

This section outlines the testing and deployment procedures for LexiLearn.

### Backend Testing

*   **Unit Tests:**
    *   Implemented unit tests for `ollamaService.js` to ensure proper interaction with the Ollama API and error handling.
*   **Integration Tests:**
    *   Implemented integration tests for the quiz generation API endpoint (`POST /api/quiz/generate`) using `supertest` to verify correct request handling, Ollama service interaction, and response formatting.
*   **Error Handling & Edge Cases:**
    *   Tests cover scenarios like missing request data, Ollama service failures, and invalid Ollama responses.

### Frontend Testing

*   **API Integration:** (Pending)
    *   Verify that the frontend correctly communicates with the backend API for quiz generation.
*   **UI Validation:** (Pending)
    *   Ensure the user interface updates correctly for all states (loading, error, success) during the quiz generation process.

### End-to-End Testing

*   **Full Quiz Generation Flow:** (Pending)
    *   Simulate the complete process from document upload to quiz display to validate data consistency and user experience.

### Deployment

*   **Setup Scripts:** (Pending)
    *   Develop scripts to run the backend and frontend applications together for production environments.
*   **Environment Variables & Steps:** (Pending)
    *   Document all necessary environment variables and detailed deployment steps in this `README.md`.
