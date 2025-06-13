# Employee Task Management Front-end

The front-end of the Employee Task Management application, built with React.

## Table of Contents
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)

## Project Structure

The project is organized as follows:

```
employee-task-management-fe/
├── public/                # Public assets
├── src/                   # Source code (components, pages, etc.)
├── screenshots/           # Screenshots of the application
│   └── app-screenshot.png
├── package.json           # Project dependencies
├── .gitignore             # Git ignore file
└── README.md              # Project documentation
```

## Technologies Used

- **Front-end**: Next, TypeScript, Antd, Tailwind, HTML, CSS
- **Others**: npm, Git

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/gachip90/employee-task-management-fe.git
   cd employee-task-management-fe
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables** (if needed):
   - Create a `.env` file in the root directory with variables such as:
     ```env
     NEXT_PUBLIC_API_BASE_URL=[Your_API_URL]
     ```

## Running the Application

1. **Start the front-end**:
   ```bash
   npm start
   ```
   - The application will run on `http://localhost:3000`.

2. **Access the application**:
   - Open your browser and navigate to `http://localhost:3000`.

## Environment Variables

To manage API endpoints or other sensitive information, use environment variables in a `.env` file. Example usage in code:

```javascript
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
```

Ensure the `.env` file is listed in `.gitignore` to prevent it from being pushed to the repository.
