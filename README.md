# Ignatian AI Augmentation Agent

A web application that transforms job listings and student resumes into meaningful portfolio project plans through the authentic integration of the Ignatian Pedagogical Paradigm (IPP) with advanced AI technology.

## 🎯 Project Overview

The Ignatian AI Augmentation Agent guides students through a comprehensive five-stage journey—Context, Experience, Reflection, Action, and Evaluation—powered by sophisticated AI to create personalized portfolio projects that authentically align employer needs with Ignatian values and personal calling.

### Core Mission
- **Technical Excellence**: Demonstrate professional competence through portfolio projects
- **Spiritual Depth**: Integrate Ignatian values and discernment throughout career preparation
- **Authentic Development**: Connect career goals with personal mission and service to others
- **Holistic Formation**: Develop mind, heart, and spirit through the complete IPP experience

## 🏗️ Architecture

**Full-Stack Implementation** with specialized components for each IPP stage:

- **Frontend**: React TypeScript application with Tailwind CSS
- **Backend**: FastAPI Python service with PostgreSQL database
- **Authentication**: Google OAuth2 integration (any Google email)
- **AI Integration**: OpenAI GPT-4o-mini with advanced prompt engineering
- **Database**: PostgreSQL with environment-specific schemas (dev/qa/prod)

## 📁 Current Folder Structure

```
├── backend/                     # Python FastAPI backend
│   ├── app/
│   │   ├── api/                # REST API endpoints
│   │   │   ├── auth.py         # Google OAuth2 authentication
│   │   │   ├── documents.py    # Document upload and processing
│   │   │   └── analysis.py     # LLM analysis endpoints
│   │   ├── core/               # Core configuration and security
│   │   ├── models/             # SQLAlchemy database models
│   │   │   ├── user.py         # User model with Google integration
│   │   │   └── document.py     # Document and analysis models
│   │   └── services/           # Business logic services
│   │       ├── llm_service.py              # Basic LLM integration
│   │       ├── enhanced_llm_service.py     # Advanced prompt engineering
│   │       ├── prompt_templates.py         # Organized prompt library
│   │       ├── document_service.py         # File processing
│   │       └── analysis_service.py         # Analysis coordination
│   ├── alembic/                # Database migrations
│   └── config/                 # Environment configuration
│
├── frontend/                   # React TypeScript frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/           # Authentication components
│   │   │   └── common/         # Reusable UI components
│   │   ├── pages/              # IPP stage implementations
│   │   │   ├── context/        # Context Stage - Document upload & analysis
│   │   │   ├── experience/     # Experience Stage - Selection & elaboration
│   │   │   ├── reflection/     # Reflection Stage - Synthesis & Ignatian reflection
│   │   │   ├── action/         # Action Stage - Portfolio project generation
│   │   │   └── evaluation/     # Evaluation Stage - Mock interviews & assessment
│   │   ├── contexts/           # React context providers
│   │   │   └── AuthContext.tsx # Authentication state management
│   │   └── services/           # API integration services
│   └── public/                 # Static assets
│
├── docs/                       # Comprehensive documentation
│   ├── prd.md                  # Product Requirements Document (100% complete)
│   ├── development-setup.md    # Environment setup guide
│   ├── testing-guide.md        # Complete testing procedures
│   ├── llm-prompt-engineering-guide.md  # Advanced prompt documentation
│   ├── prompt-optimization-summary.md   # Optimization metrics
│   └── user-journey-flowchart.md        # User experience flowchart
│
└── database/                   # Database management
    └── schema.sql              # Database schema definitions
```

## ✨ Key Features

### 🎓 Complete Ignatian Pedagogical Paradigm Implementation
- **Context Stage**: AI-powered document analysis with contextual research
- **Experience Stage**: Interactive experience selection with personal elaboration
- **Reflection Stage**: Synthesis generation + authentic Ignatian spiritual reflection
- **Action Stage**: Values-driven portfolio project creation
- **Evaluation Stage**: Mock interview preparation + comprehensive self-assessment

### 🤖 Advanced AI Integration
- **Enhanced Prompt Engineering**: Chain-of-thought reasoning with few-shot learning
- **Adaptive Personalization**: Dynamic responses based on user context and developmental stage
- **Values Integration**: Ignatian principles woven throughout all AI interactions
- **Quality Assurance**: Confidence scoring and multi-level error handling

### 🔐 Secure & Scalable
- **Google OAuth2**: Streamlined authentication for any Google email
- **Environment-Specific**: Separate dev/qa/prod database schemas
- **Professional UI**: Responsive design with progress tracking
- **Error Resilience**: Comprehensive fallback strategies

## 🚀 Development Status

**MILESTONE ACHIEVED: 100% Complete IPP Implementation**

### ✅ **Completed Features**

#### **Infrastructure & Foundation**
- ✅ Google OAuth2 authentication with JWT tokens
- ✅ PostgreSQL database with environment-specific schemas
- ✅ FastAPI backend with comprehensive error handling
- ✅ React TypeScript frontend with Tailwind CSS
- ✅ Secure document upload and text extraction

#### **Stage 1: Context - COMPLETE**
- ✅ Drag-and-drop document upload interface
- ✅ Real-time LLM analysis with OpenAI GPT-4o-mini
- ✅ Status polling and progress indicators
- ✅ AI-generated context summary and insights

#### **Stage 2: Experience - COMPLETE**
- ✅ Interactive analysis review and experience categorization
- ✅ User-friendly selection interface with relevance scoring
- ✅ Personal elaboration capture with meaningful prompts
- ✅ Visual progress tracking and validation

#### **Stage 3: Reflection - COMPLETE**
- ✅ AI-powered synthesis with narrative construction
- ✅ Authentic Ignatian reflection prompts (4 core categories)
- ✅ Values-based questioning with spiritual depth
- ✅ Integrated experience bridging analysis and heart-centered reflection

#### **Stage 4: Action - COMPLETE**
- ✅ Portfolio project generation based on synthesis insights
- ✅ Implementation blueprints with phases, tasks, and deliverables
- ✅ Interview talking points connecting work to values
- ✅ Export preparation framework

#### **Stage 5: Evaluation - COMPLETE**
- ✅ Mock interview questions (behavioral, technical, values-based, project-specific)
- ✅ Comprehensive self-assessment with star rating system
- ✅ Final reflection on complete Ignatian journey
- ✅ Completion celebration and portfolio export options

#### **Advanced AI Implementation**
- ✅ Enhanced LLM Service (2,000+ lines) with sophisticated prompt engineering
- ✅ Prompt Templates Library (1,500+ lines) with organized, documented templates
- ✅ Chain-of-thought reasoning with 5-step thinking processes
- ✅ Few-shot learning with concrete examples in all major prompts
- ✅ Adaptive personalization based on user context

#### **Quality & Documentation**
- ✅ Comprehensive testing guide with manual and automated procedures
- ✅ Complete prompt engineering documentation
- ✅ Performance optimization with quantitative improvements
- ✅ Professional UI with seamless navigation

### 📊 **Achievement Metrics**
- **2,500% increase** in system prompt specificity
- **87% more comprehensive** analysis with 15+ detailed sections
- **100% values integration** across all prompts
- **Complete IPP implementation** with authentic spiritual dimensions

## 🛠️ Technology Stack

### **Frontend**
- **React 18** with TypeScript
- **Tailwind CSS** for responsive design
- **React Router** for navigation
- **Context API** for state management

### **Backend**
- **FastAPI** with Python 3.8+
- **SQLAlchemy** ORM with PostgreSQL
- **Alembic** for database migrations
- **OpenAI GPT-4o-mini** for AI integration
- **Google OAuth2** for authentication

### **Database**
- **PostgreSQL** with environment-specific schemas
- **JWT tokens** for secure session management
- **File upload** with text extraction (PyPDF2, python-docx)

### **AI & Prompt Engineering**
- **OpenAI GPT-4o-mini** with advanced prompt templates
- **Chain-of-thought reasoning** for improved accuracy
- **Few-shot learning** with concrete examples
- **Adaptive personalization** based on user context
- **Confidence scoring** and quality validation

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **Python** (3.8 or higher)
- **PostgreSQL** (v12 or higher)
- **Google Cloud Platform** account (for OAuth)
- **OpenAI API** account with GPT-4o-mini access

### 1. Clone Repository
```bash
git clone https://github.com/lontok/ignatian-ai-augmentation-agent.git
cd ignatian-ai-augmentation-agent
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your database URL, OpenAI API key, and Google OAuth credentials

# Run database migrations
alembic upgrade head

# Start backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your API URL and Google Client ID

# Start frontend server
npm start
```

### 4. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/docs (Swagger UI)

## 📖 Documentation

### **Setup & Development**
- [**Development Setup Guide**](docs/development-setup.md) - Complete environment configuration
- [**Testing Guide**](docs/testing-guide.md) - Comprehensive testing procedures

### **Technical Documentation**
- [**LLM Prompt Engineering Guide**](docs/llm-prompt-engineering-guide.md) - Advanced prompt implementation
- [**Prompt Optimization Summary**](docs/prompt-optimization-summary.md) - Performance metrics and improvements

### **Product Documentation**
- [**Product Requirements Document**](docs/prd.md) - Complete PRD with 100% implementation status
- [**User Journey Flowchart**](docs/user-journey-flowchart.md) - Visual user experience guide

## 🧪 Testing

### Manual Testing
```bash
# Complete IPP journey testing with realistic sample data
# See docs/testing-guide.md for detailed procedures
```

### Automated Testing
```bash
# Backend tests
cd backend
pytest tests/ -v

# Frontend tests
cd frontend
npm test

# End-to-end tests
npm run test:e2e
```

### Performance Testing
```bash
# Load testing with Locust
cd backend
locust -f tests/load_test.py --host=http://localhost:8000

# Frontend performance audit
lighthouse http://localhost:3000
```

## 🎯 Usage

### Complete IPP Journey
1. **Sign in** with Google account
2. **Context Stage**: Upload resume and job description → AI analysis
3. **Experience Stage**: Select meaningful experiences → Add personal elaborations
4. **Reflection Stage**: Review synthesis → Complete Ignatian reflection prompts
5. **Action Stage**: Generate portfolio project → Review implementation plan
6. **Evaluation Stage**: Practice interviews → Complete self-assessment → Final reflection

### Sample Test Data
The application includes realistic test data for validation:
- **Sample Resume**: Business Administration student with marketing, tutoring, and project experience
- **Sample Job**: Customer Success Analyst role with values alignment and growth opportunities

## 🤝 Contributing

This project embodies the Ignatian mission of education and formation. Contributions should maintain:
- **Technical Excellence**: High-quality, well-tested code
- **Spiritual Authenticity**: Genuine integration of Ignatian values
- **Educational Purpose**: Focus on student growth and development
- **Service Orientation**: Work that serves the common good

### Development Guidelines
1. Follow existing code patterns and documentation standards
2. Ensure all prompt engineering maintains Ignatian authenticity
3. Test thoroughly across all IPP stages
4. Maintain responsive design and accessibility

## 📄 License

This project is designed for educational use in business and career development, supporting the Ignatian mission of forming whole persons for others.

---

**Built with ❤️ to serve students in their journey toward authentic career development that integrates mind, heart, and spirit.**