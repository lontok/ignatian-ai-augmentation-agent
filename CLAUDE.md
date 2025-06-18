# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The Ignatian AI Augmentation Agent is a web application designed for LMU business students that converts job listings and student resumes into tailored portfolio project plans. The app embeds the Ignatian Pedagogical Paradigm (IPP) with its five elements: Context, Experience, Reflection, Action, and Evaluation.

## Architecture (Planned)

Based on the PRD, the system will consist of:

- **Frontend**: React-based web UI/UX for student interaction
- **Backend**: Python API for orchestration, security, and business logic  
- **Database**: PostgreSQL for persistent user/project/reflection data
- **Authentication**: Google OAuth2 for secure sign-in
- **AI Integration**: LLM API calls for document parsing, research, and project generation
- **Exports**: PDF/Web export functionality for portfolio artifacts

## Core User Flow (IPP Stages)

The application follows the five-stage Ignatian Pedagogical Paradigm:

1. **Context**: Upload job description + resume, LLM parses and researches
2. **Experience**: Interactive visualization of overlaps and student engagement
3. **Sense-Making**: Synthesis and connection identification
4. **Reflection**: Deep Ignatian-style prompts for meaning and values
5. **Action**: LLM-generated portfolio project plans
6. **Evaluation**: Project review and mock interview preparation

## Key Features

- Resume and job description parsing via LLM
- Automated contextual research on companies/industries
- Voice-to-text input capabilities
- Progress tracking through IPP stages
- Portfolio artifact export (PDF/Web)
- Mock interview generation
- Analytics and feedback collection

## Development Status

**Current State**: Google OAuth2 authentication system implemented and ready for testing.

**Completed Features**:
- Google OAuth2 authentication (backend + frontend)
- User management and JWT tokens
- Protected routes and authentication context
- Basic dashboard with IPP stage overview
- Database models and migrations setup

**Next Steps**: Document upload functionality and LLM integration for Context stage.

## Commands

### Backend Development
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python main.py  # Start FastAPI server on port 8000
```

### Frontend Development  
```bash
cd frontend
npm install
npm start  # Start React dev server on port 3000
```

### Database Management
```bash
cd backend
alembic revision --autogenerate -m "Description"
alembic upgrade head
```

## Authentication Setup

The app uses Google OAuth2 for authentication. Required environment variables:

**Backend (.env)**:
- `GOOGLE_CLIENT_ID` - Google OAuth2 client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth2 client secret
- `SECRET_KEY` - JWT signing key
- `DATABASE_URL` - PostgreSQL connection string

**Frontend (.env)**:
- `REACT_APP_GOOGLE_CLIENT_ID` - Same Google OAuth2 client ID
- `REACT_APP_API_URL` - Backend API URL (default: http://localhost:8000/api)

## Data Privacy & Security

- Google OAuth2 authentication (any Google email accepted)
- JWT token-based session management
- Secure backend with limited LLM API data sharing
- Anonymous research data handling where applicable

## Target Users

- Primary: Students preparing for job applications
- Secondary: Faculty mentors and researchers
- Focus: Business and career development education