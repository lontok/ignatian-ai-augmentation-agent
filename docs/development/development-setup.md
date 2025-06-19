# Development Setup Guide

This guide will help you set up the Ignatian AI Augmentation Agent for local development.

## Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL 12+
- Google OAuth2 credentials

## Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

5. **Set up database:**
   ```bash
   # Create PostgreSQL database
   createdb ignatian_ai_db
   
   # Run migrations
   alembic upgrade head
   ```

6. **Start the backend server:**
   ```bash
   python main.py
   ```
   
   The API will be available at `http://localhost:8000`
   API documentation at `http://localhost:8000/api/docs`

## Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```
   
   The frontend will be available at `http://localhost:3000`

## Google OAuth2 Setup

1. **Go to Google Cloud Console:**
   - Visit https://console.cloud.google.com/
   - Create a new project or select existing one

2. **Enable Google+ API:**
   - Go to APIs & Services > Library
   - Search for "Google+ API" and enable it

3. **Create OAuth2 credentials:**
   - Go to APIs & Services > Credentials
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized origins:
     - `http://localhost:3000` (frontend)
     - `http://localhost:8000` (backend)
   - Add authorized redirect URIs:
     - `http://localhost:3000`

4. **Configure environment variables:**
   - Copy the Client ID to both backend and frontend `.env` files
   - Copy the Client Secret to backend `.env` file

## Database Schema

The application uses the following main tables:

- `users` - User profiles and authentication data

To create the initial migration:
```bash
cd backend
alembic revision --autogenerate -m "Create initial tables"
alembic upgrade head
```

## Testing the Authentication Flow

1. Start both backend and frontend servers
2. Navigate to `http://localhost:3000`
3. Click "Sign in with Google"
4. Complete Google OAuth flow
5. You should be redirected to the dashboard

## Troubleshooting

### Common Issues:

1. **"Invalid Google token" error:**
   - Check that your Google Client ID is correct
   - Ensure the token is being sent properly from frontend

2. **Database connection error:**
   - Verify PostgreSQL is running
   - Check database URL in .env file
   - Ensure database exists

3. **CORS errors:**
   - Check that frontend URL is in backend's ALLOWED_ORIGINS
   - Verify API calls are going to correct backend URL

4. **Google Sign-In button not appearing:**
   - Check browser console for JavaScript errors
   - Verify Google Client ID is set in frontend .env
   - Ensure Google Sign-In script is loading

## Next Steps

After successful authentication setup:

1. Implement document upload functionality
2. Add LLM integration for document parsing
3. Build IPP stage workflows
4. Add project generation features

For additional help, check the main README.md or create an issue in the repository.