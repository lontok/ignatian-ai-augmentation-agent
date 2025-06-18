# Ignatian AI Augmentation Agent

A web application for students that converts job listings and student resumes into tailored portfolio project plans using the Ignatian Pedagogical Paradigm (IPP).

## Project Overview

The Ignatian AI Augmentation Agent guides students through a five-stage process—Context, Experience, Reflection, Action, and Evaluation—powered by AI to create personalized portfolio projects that align with both employer needs and Ignatian values.

## Architecture

This project follows a full-stack architecture with separate frontend and backend services:

- **Frontend**: React-based web application
- **Backend**: Python API with FastAPI/Flask
- **Database**: PostgreSQL for persistent data
- **Authentication**: Google OAuth2
- **AI Integration**: LLM API for document parsing and project generation

## Folder Structure

```
├── backend/                    # Python backend API
│   ├── app/                   # Core application logic
│   │   ├── api/              # REST API endpoints
│   │   ├── auth/             # Google OAuth2 authentication
│   │   ├── core/             # Core business logic
│   │   ├── llm/              # LLM integration and prompts
│   │   └── models/           # Database models
│   ├── services/             # Business services
│   │   ├── document_parser/  # Resume/job parsing
│   │   ├── research/         # Contextual research
│   │   ├── project_generator/# Portfolio generation
│   │   └── export/           # PDF/web export
│   ├── database/             # Database management
│   │   ├── migrations/       # Schema migrations
│   │   └── seeds/            # Initial data
│   ├── config/               # Backend configuration
│   ├── utils/                # Utility functions
│   └── tests/                # Backend tests
│
├── frontend/                  # React frontend application
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── common/       # Reusable components
│   │   │   ├── ipp/          # IPP stage components
│   │   │   ├── dashboard/    # Dashboard components
│   │   │   └── auth/         # Auth components
│   │   ├── pages/            # IPP stage pages
│   │   │   ├── context/      # Context stage
│   │   │   ├── experience/   # Experience stage
│   │   │   ├── reflection/   # Reflection stage
│   │   │   ├── action/       # Action stage
│   │   │   └── evaluation/   # Evaluation stage
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API services
│   │   ├── contexts/         # React contexts
│   │   ├── types/            # TypeScript definitions
│   │   └── utils/            # Frontend utilities
│   ├── public/               # Static assets
│   │   ├── images/           # Image assets
│   │   └── icons/            # Icon assets
│   └── tests/                # Frontend tests
│
├── database/                 # Database schemas and models
│   ├── schemas/              # Schema definitions
│   ├── models/               # Data models
│   ├── migrations/           # Database migrations
│   └── seeds/                # Sample data
│
├── config/                   # Configuration files
│   ├── environments/         # Environment configs
│   ├── docker/               # Docker configurations
│   └── nginx/                # Web server config
│
├── deployment/               # Deployment configurations
│   ├── aws/                  # AWS deployment
│   └── scripts/              # Deployment scripts
│
├── shared/                   # Shared utilities and types
│   ├── types/                # Shared TypeScript types
│   ├── constants/            # Application constants
│   └── utils/                # Shared utilities
│
├── tests/                    # Cross-platform tests
│   ├── unit/                 # Unit tests
│   ├── integration/          # Integration tests
│   └── e2e/                  # End-to-end tests
│
└── docs/                     # Documentation
    └── prd.md                # Product Requirements Document
```

## Key Features

- **Ignatian Pedagogical Paradigm**: Five-stage guided process (Context, Experience, Reflection, Action, Evaluation)
- **AI-Powered Analysis**: LLM-driven document parsing and contextual research
- **Portfolio Generation**: Customized project plans aligned with job requirements and personal values
- **Google Authentication**: Secure OAuth2 integration (any Google email)
- **Voice Input**: Speech-to-text for richer reflection responses
- **Export Capabilities**: PDF and web export of portfolio artifacts
- **Progress Tracking**: Dashboard to monitor IPP stage completion
- **Mock Interviews**: AI-generated interview questions based on projects

## Development Status

**Current Phase**: Initial setup and architecture planning

This project is in early development. The folder structure has been established based on the PRD requirements, and implementation is ready to begin.

## Getting Started

*Development setup instructions will be added as the project progresses.*

## Technology Stack (Planned)

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Python (FastAPI/Flask), SQLAlchemy
- **Database**: PostgreSQL
- **Authentication**: Google OAuth2
- **AI/ML**: OpenAI API or similar LLM service
- **Deployment**: AWS/Docker
- **Testing**: Jest, Pytest, Cypress

## Contributing

This project is designed for educational use in business and career development. Contribution guidelines will be established as development progresses.

## License

See LICENSE file for details.