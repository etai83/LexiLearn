# API Design Tasks

## 1. Endpoint Planning
- [x] 1.1 Define API contract for quiz generation (input/output schema)
- [x] 1.2 Decide endpoint path (e.g., `POST /api/generate-quiz`)

## 2. Implementation
- [x] 2.1 Create route handler for quiz generation endpoint
- [x] 2.2 Validate incoming request data
- [x] 2.3 Call Ollama service with validated parameters
- [x] 2.4 Format and return questions/answers as JSON
- [x] 2.5 Add error handling and appropriate status codes

## 3. Documentation
- [x] 3.1 Document API usage and example requests/responses
- [x] 3.2 Update backend `README.md` with API details

## 4. Testing
- [ ] 4.1 Test endpoint with valid and invalid data
- [ ] 4.2 Ensure proper error messages and status codes
