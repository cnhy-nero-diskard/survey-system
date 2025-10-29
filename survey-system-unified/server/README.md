# SurveyMockup1 Backend

This is the backend service for the SurveyMockup1 project. It provides APIs for managing surveys, questions, and responses.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/surveymockup1_backend.git
    ```
2. Navigate to the project directory:
    ```bash
    cd surveymockup1_backend
    ```
3. Install dependencies:
    ```bash
    npm install
    ```

## Usage

1. Start the development server:
    ```bash
    npm start
    ```
2. The server will be running at `http://localhost:3000`.

## API Endpoints

### Surveys

- **GET /api/surveys**: Get all surveys
- **POST /api/surveys**: Create a new survey
- **GET /api/surveys/:id**: Get a survey by ID
- **PUT /api/surveys/:id**: Update a survey by ID
- **DELETE /api/surveys/:id**: Delete a survey by ID

### Questions

- **GET /api/questions**: Get all questions
- **POST /api/questions**: Create a new question
- **GET /api/questions/:id**: Get a question by ID
- **PUT /api/questions/:id**: Update a question by ID
- **DELETE /api/questions/:id**: Delete a question by ID

### Responses

- **GET /api/responses**: Get all responses
- **POST /api/responses**: Create a new response
- **GET /api/responses/:id**: Get a response by ID
- **PUT /api/responses/:id**: Update a response by ID
- **DELETE /api/responses/:id**: Delete a response by ID

## Contributing

1. Fork the repository.
2. Create a new branch:
    ```bash
    git checkout -b feature-branch
    ```
3. Make your changes and commit them:
    ```bash
    git commit -m "Description of changes"
    ```
4. Push to the branch:
    ```bash
    git push origin feature-branch
    ```
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.