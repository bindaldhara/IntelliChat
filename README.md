Backend: https://github.com/bindaldhara/intelliChat-server

# Intellichat

## Project Description

Intellichat is a React-based application that allows users to ask questions and receive AI-generated answers. It provides an interactive chat interface where users can input their queries and get intelligent responses.

## Installation Instructions

To set up Intellichat locally, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/your-username/intellichat.git
   cd intellichat
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173` to view the application.

## Testing Guide

Intellichat includes some special testing features:

- If you type "error" in the message input, it will trigger an error message.
- If you type "summary" in the message input, it will return a message with a summary.

These features are useful for testing error handling and summary generation functionality.

### Admin Features

To test admin features:

1. Navigate to the login page
2. Use the following credentials:
   - Username: admin@intellichat.com
   - Password: admin12345
3. Once logged in as admin, go to the `/admin` route to access admin features.

Note: Keep these credentials secure and do not share them publicly in a real production environment.

## Technical Details

This project is built with React + TypeScript + Vite, providing a minimal setup with Hot Module Replacement (HMR) and some ESLint rules.


