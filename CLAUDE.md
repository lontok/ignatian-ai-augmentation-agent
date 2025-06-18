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

**Current State**: Early planning phase with PRD documentation only. No implementation code exists yet.

**Next Steps**: The project needs initial setup including technology stack selection, environment configuration, and core architecture implementation.

## Data Privacy & Security

- FERPA compliance required for student data
- Secure backend with limited LLM API data sharing
- Google OAuth2 for authentication
- Anonymous research data handling
- IRB approval needed for research publications

## Target Users

- Primary: LMU business students preparing for job applications
- Secondary: Faculty mentors and researchers
- Institution: Loyola Marymount University College of Business Administration