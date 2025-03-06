
# Google Login with Groups Application

This application demonstrates implementation of Google OAuth login with Google Groups integration to manage user access.

## Project Structure

The project is split into two main parts:

- `frontend/`: React application with Google login integration
- `backend/`: Express.js API handling authentication and authorization

## Setup

### Prerequisites

- Node.js (v14 or higher)
- A Google Cloud Platform account
- Google OAuth 2.0 Client ID
- (Optional) Google Workspace with Admin privileges for Groups integration

### Google Setup

1. Create a project in Google Cloud Platform
2. Enable the Google+ API and Admin SDK API
3. Configure the OAuth consent screen
4. Create OAuth 2.0 Client credentials
5. For groups integration, set up a service account with domain-wide delegation

### Installation

Install dependencies for both frontend and backend:

```bash
npm run install:all
```

### Configuration

1. Copy the example env file:
```bash
cp backend/.env.example backend/.env
```

2. Update the `.env` file with your Google credentials

3. Update the Google Client ID in `frontend/src/index.jsx`

### Development

Run both frontend and backend in development mode:

```bash
npm run dev
```

Or run them separately:

```bash
npm run dev:frontend
npm run dev:backend
```

### Building for Production

```bash
npm run build:frontend
```

The frontend build will be created in `frontend/dist/`

## Features

- Google OAuth login
- Session management with cookies
- Google Groups integration for access control
- Protected routes based on authentication
