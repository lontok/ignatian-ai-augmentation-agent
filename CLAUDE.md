# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Code Style & Conventions

### TypeScript/React
- Use TypeScript for all new components
- Follow existing patterns in the codebase
- Prefer functional components with hooks over class components
- Use absolute imports from configured paths (e.g., `@/components`)
- Maintain consistent prop interfaces

### Python/Backend
- Follow PEP 8 style guidelines
- Use type hints for function parameters and returns
- Prefer async/await for I/O operations
- Keep functions focused and single-purpose

## Naming Conventions

- **Components**: PascalCase (e.g., `PathSelection.tsx`, `ContextStage.tsx`)
- **Utilities**: camelCase (e.g., `transformConnectionsData.ts`, `getItemText.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `SUPPORTED_FILE_FORMATS`)
- **CSS Classes**: kebab-case (e.g., `mode-indicator`, `upload-area`)
- **API Endpoints**: kebab-case (e.g., `/api/analysis/resume/start`)
- **Database Tables**: snake_case (e.g., `document_analyses`)

## Development Workflow

### Important Rules
- **NO automatic commits** - Wait for explicit user instruction
- **NO proactive file creation** - Only create files when necessary
- **NO emojis in code** - Unless explicitly requested by user
- **Prefer editing existing files** over creating new ones

### After Code Changes
1. Run linters: `npm run lint` (frontend) or `flake8` (backend)
2. Run type checking: `npm run typecheck` (frontend)
3. Test changes in browser before marking complete
4. Update `tasks.md` with implementation details
5. **Update `CHANGELOG.md`** under [Unreleased] section if changes include:
   - New features → Added
   - Modified functionality → Changed
   - Bug fixes → Fixed
   - Removed features → Removed
6. Note any new technical debt or follow-up tasks

### Commit Message Format
```
type: brief description

Longer explanation if needed

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

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

## IPP Implementation Notes

### Core Principles
- **Context = Resume Only**: Understanding who the student is
- **Experience = Job Descriptions**: Exploring career opportunities
- Maintain Ignatian values throughout all stages
- Each stage should validate completion before proceeding
- Support cyclical navigation (users can go back)

### Stage Requirements
1. **Context**: Resume upload and personal background
2. **Experience**: Job descriptions (1 for Interview Prep, 3-5 for Exploration)
3. **Reflection**: Values-based questions and synthesis
4. **Action**: Portfolio project generation
5. **Evaluation**: Interview preparation and self-assessment

### Path-Specific Considerations
- **Exploration Mode**: Focus on overlap analysis and multi-target projects
- **Interview Prep Mode**: Focus on single job deep alignment
- Always show mode indicator throughout the journey

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

## Testing Requirements

### UI Testing
- Test all changes in browser before marking complete
- Verify responsive design on different screen sizes
- Check error states and loading states
- Ensure proper form validation
- Test navigation flow between IPP stages

### LLM Testing
- Verify LLM responses match expected format
- Test with various resume formats (PDF parsing)
- Check handling of malformed job descriptions
- Ensure extraction includes all required fields
- Test timeout and error scenarios

### Integration Testing
- Test authentication flow end-to-end
- Verify file upload size limits
- Check session persistence across stages
- Test path switching scenarios
- Verify data persistence in database

### Edge Cases to Consider
- Empty or minimal resumes
- Non-English documents
- Very large files
- Network interruptions during analysis
- Multiple simultaneous uploads

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

## Documentation Updates

### When to Update Documentation
- After completing any task, update `tasks.md`
- After significant changes, update `CHANGELOG.md`
- When discovering technical debt, add to `tasks.md`
- For architectural decisions, update this file
- For stakeholder updates, update `prd.md`

### CHANGELOG.md Guidelines
- Keep entries under `[Unreleased]` until version bump
- Use clear, user-focused language
- Group related changes together
- Reference issue/task IDs when applicable
- Categories: Added, Changed, Fixed, Removed

### Documentation Standards
- Keep code comments minimal (code should be self-documenting)
- Document complex algorithms or business logic
- Update API documentation for new endpoints
- Include examples for utility functions
- Reference specific file paths and line numbers in tasks

## Restrictions & Best Practices

### DO NOT
- Create new files unless absolutely necessary
- Add emojis to code (unless user requests)
- Commit automatically (wait for user instruction)
- Create proactive documentation (README.md, etc.)
- Over-engineer solutions

### ALWAYS
- Check if functionality exists before creating new
- Follow existing patterns in the codebase
- Test in browser before completion
- Update tasks.md after work
- Consider Ignatian principles in implementation