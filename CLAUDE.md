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

**Current State**: Complete IPP implementation with all 5 stages functional. Enhanced LLM integration with multiple evidence points per job requirement.

**Completed Features**:
- Google OAuth2 authentication (backend + frontend)
- User management and JWT tokens
- Protected routes and authentication context
- Full IPP journey implementation (Context → Experience → Reflection → Action → Evaluation)
- Document upload and LLM analysis with progress tracking
- Enhanced evidence extraction (up to 2 quotes per requirement)
- Portfolio project generation with values integration
- Mock interview and self-assessment framework

**Recent Updates**:
- Modified LLM prompts to return multiple evidence points per job requirement
- Added real-time progress tracking for the 5-step analysis pipeline
- Updated frontend to handle both string and array evidence formats

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

## Database Setup

The app uses AWS RDS PostgreSQL with environment-specific schemas:

**Database Structure**:
- **Database**: `ignatian_ai` 
- **Schemas**: `dev`, `qa`, `prod`
- **Tables**: Created in environment-specific schema (e.g., `dev.users`)

**Environment Configuration**:
- Development: `DB_SCHEMA=dev`
- QA: `DB_SCHEMA=qa` 
- Production: `DB_SCHEMA=prod`

## Authentication Setup

The app uses Google OAuth2 for authentication. Required environment variables:

**Backend (.env)**:
- `DATABASE_URL` - AWS RDS PostgreSQL connection string
- `DB_SCHEMA` - Database schema (dev/qa/prod)
- `GOOGLE_CLIENT_ID` - Google OAuth2 client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth2 client secret
- `SECRET_KEY` - JWT signing key

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

## Documentation Structure

**Key Documentation Locations**:
- `/docs/` - Main documentation directory
  - `/docs/ai-llm/` - LLM and AI-related documentation
    - `llm-prompt-engineering-guide.md` - Comprehensive prompt engineering guide
    - `prompt-optimization-summary.md` - Performance metrics and improvements
  - `/docs/testing/` - Testing documentation
    - `testing-guide.md` - Main testing guide with manual and automated procedures
    - `google-oauth-test-plan.md` - OAuth authentication test procedures
    - `ui-testing-plan-scratchpad.md` - UI testing plans for IPP stages
  - `prd.md` - Product Requirements Document
  - `README.md` - Project overview and setup instructions

**Important Files**:
- `/backend/app/services/llm_service.py` - Core LLM service with analysis pipeline
- `/backend/app/services/enhanced_llm_service.py` - Enhanced LLM service with advanced prompts
- `/backend/app/services/prompt_templates.py` - Organized prompt templates
- `/frontend/src/components/ConnectionsDetailTable.tsx` - Evidence display component
- `/frontend/src/utils/transformConnectionsData.ts` - Data transformation utilities