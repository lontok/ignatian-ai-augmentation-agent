# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- 

### Changed
- 

### Fixed
- 

### Removed
- 

## [0.2.0] - 2025-06-21

### Added
- Re-analyze button in Context Stage for existing resumes
- Support for displaying enhanced Ignatian analysis fields in the frontend
- Backend resume-only analysis endpoint `/api/analysis/resume/start`
- Logging to verify Ignatian prompts are being used

### Changed
- Enhanced Context Stage resume analysis with Ignatian pedagogical elements
- Added values extraction: service orientation, character strengths, growth mindset, collaboration indicators
- Improved LLM prompts with chain-of-thought reasoning and few-shot learning examples
- Updated system prompt to include Dr. Elena Rodriguez persona with Ignatian expertise
- Updated frontend to handle both old and new resume analysis formats
- Enhanced display of experience and education with service impact indicators

### Fixed
- TypeScript type errors when rendering new Ignatian field structures
- Frontend now properly uses resume-only endpoint instead of full analysis endpoint

## [0.1.0] - 2025-06-21

### Added
- Path selection screen allowing users to choose between Exploration Mode (3-5 jobs) and Interview Prep Mode (1 job)
- Mode indicator badge that persists throughout the application journey
- Comprehensive documentation reorganization:
  - `CLAUDE.md` for AI assistant coding guidelines
  - `tasks.md` for developer task tracking
  - Consolidated `prd.md` for all stakeholders

### Changed
- Context stage now only accepts resume uploads (job descriptions moved to Experience stage)
- Updated navigation flow to start with path selection after authentication
- Reorganized documentation from development-notes.md into focused, role-specific files
- Consolidated two PRD files into single stakeholder-friendly document

### Fixed
- React rendering errors when displaying arrays of objects in resume analysis
- Backend port conflict with Airbyte (port 8000)
- TypeScript strict null checking errors in disabled code sections

## [0.0.3] - 2025-06-19

### Added
- Enhanced LLM integration with multiple evidence points per job requirement  
- Real-time progress tracking with step-by-step progress bar
- "Why This Connects" column in evidence table
- Comprehensive testing documentation

### Changed
- LLM prompts now return up to 2 evidence quotes per job requirement
- Frontend components handle both string and array evidence formats

## [0.0.2] - 2025-06-18

### Added
- Complete implementation of all 5 IPP stages (Context, Experience, Reflection, Action, Evaluation)
- Google OAuth2 authentication with JWT tokens
- PostgreSQL database with environment-specific schemas (dev/qa/prod)
- Document upload and text extraction functionality
- LLM analysis pipeline with OpenAI GPT-4o-mini
- Experience Stage with interactive selection interface
- Reflection Stage with enhanced Sense-Making integration
- Self-assessment framework with star ratings
- Mock interview question generation

## [0.0.1] - 2025-06-17

### Added
- Initial project setup with React frontend and FastAPI backend
- Comprehensive project structure and documentation
- Product Requirements Document (PRD)
- README with complete folder structure