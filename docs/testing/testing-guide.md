# Testing Guide
## Ignatian AI Augmentation Agent

### Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Environment Setup](#environment-setup)
4. [Manual Testing Workflow](#manual-testing-workflow)
5. [Feature Testing](#feature-testing)
6. [API Testing](#api-testing)
7. [LLM Integration Testing](#llm-integration-testing)
8. [Database Testing](#database-testing)
9. [Authentication Testing](#authentication-testing)
10. [Error Handling Testing](#error-handling-testing)
11. [Performance Testing](#performance-testing)
12. [Automated Testing](#automated-testing)
13. [Troubleshooting](#troubleshooting)

---

## Overview

This guide provides comprehensive testing procedures for the Ignatian AI Augmentation Agent, covering all five stages of the Ignatian Pedagogical Paradigm (IPP) workflow and supporting systems.

### Application Architecture
- **Frontend**: React TypeScript application with Tailwind CSS
- **Backend**: FastAPI Python service with PostgreSQL database
- **Authentication**: Google OAuth2 integration
- **AI Integration**: OpenAI GPT-4o-mini for document analysis and synthesis
- **IPP Stages**: Context → Experience → Reflection → Action → Evaluation

---

## Prerequisites

### Required Software
- **Node.js** (v16 or higher)
- **Python** (3.8 or higher)
- **PostgreSQL** (v12 or higher)
- **Git**
- **Modern web browser** (Chrome, Firefox, Safari)

### Required Accounts
- **Google Cloud Platform** account for OAuth setup
- **OpenAI API** account with GPT-4o-mini access
- **AWS RDS** instance (or local PostgreSQL)

### Environment Variables
Ensure all required environment variables are configured:
```bash
# Backend (.env)
DATABASE_URL=postgresql://user:password@host:port/database
OPENAI_API_KEY=your_openai_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET_KEY=your_jwt_secret

# Frontend (.env)
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## Environment Setup

### 1. Clone and Setup Repository
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

# Run database migrations
alembic upgrade head

# Start backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

### 4. Verify Services
- **Backend**: http://localhost:8000/docs (FastAPI Swagger UI)
- **Frontend**: http://localhost:3000 (React application)
- **Database**: Verify connection with your PostgreSQL client

---

## Manual Testing Workflow

### Complete IPP Journey Test

This test covers the full user journey through all five IPP stages.

#### **Test Data Preparation**
Prepare sample documents for testing:

**Sample Resume** (`test-resume.txt`):
```
John Smith
Email: john.smith@email.com
Phone: (555) 123-4567

EDUCATION
Bachelor of Business Administration
Loyola Marymount University, 2024
GPA: 3.7/4.0

EXPERIENCE
Marketing Intern - TechStart Inc. (Summer 2023)
- Analyzed customer data using Excel and SQL
- Created marketing campaign reports with 15% engagement improvement
- Collaborated with cross-functional teams on product launches

Volunteer Tutor - LMU Community Outreach (2022-2024)
- Tutored underprivileged high school students in mathematics
- Developed personalized learning plans for 20+ students
- Improved student performance by average of 25%

SKILLS
- Data Analysis (Excel, SQL, Python basics)
- Marketing Analytics (Google Analytics, Social Media)
- Communication (English, Spanish - conversational)
- Leadership and mentoring

PROJECTS
Student Success Dashboard (Capstone Project)
- Built web dashboard tracking student academic performance
- Used Python and JavaScript for data visualization
- Presented to university administration with implementation recommendations
```

**Sample Job Description** (`test-job.txt`):
```
Customer Success Analyst - GrowthTech Solutions

ABOUT US
GrowthTech Solutions helps businesses achieve sustainable growth through data-driven insights and customer-focused strategies. We're a mission-driven company committed to creating positive impact for our clients and communities.

ROLE OVERVIEW
We're seeking a Customer Success Analyst to help our clients maximize value from our platform. You'll analyze customer data, identify growth opportunities, and work collaboratively with our team to ensure customer success.

RESPONSIBILITIES
- Analyze customer usage data to identify trends and opportunities
- Create reports and dashboards for customer success teams
- Collaborate with customers to understand their goals and challenges
- Develop recommendations for product improvements based on customer feedback
- Present findings to both technical and non-technical stakeholders

REQUIREMENTS
- Bachelor's degree in Business, Analytics, or related field
- 1-2 years experience with data analysis tools (Excel, SQL preferred)
- Strong communication skills and customer service orientation
- Experience with data visualization tools (Tableau, Power BI, or similar)
- Collaborative mindset and ability to work in diverse teams

PREFERRED QUALIFICATIONS
- Experience in customer success or account management
- Background in education or non-profit sectors
- Bilingual capabilities (Spanish a plus)
- Passion for helping others succeed

COMPANY VALUES
- Customer-first mindset
- Continuous learning and growth
- Diversity, equity, and inclusion
- Social responsibility and community impact
```

#### **Stage 1: Context Stage Testing**

1. **Navigate to Application**
   ```
   URL: http://localhost:3000
   Expected: Login page with Google authentication button
   ```

2. **Authentication Test**
   ```
   Action: Click "Sign in with Google"
   Expected: Google OAuth flow, successful login, redirect to dashboard
   ```

3. **Document Upload Test**
   ```
   Action: Navigate to Context stage
   Expected: Upload interface with drag-and-drop areas for resume and job description
   
   Action: Upload test-resume.txt and test-job.txt
   Expected: Files uploaded successfully, processing indicators appear
   ```

4. **LLM Analysis Test**
   ```
   Action: Wait for analysis completion
   Expected: 
   - Progress bar shows real-time updates for 5 analysis steps:
     * Step 1: "Analyzing your background and experiences..." (20%)
     * Step 2: "Understanding role requirements..." (40%)
     * Step 3: "Finding meaningful connections..." (60%)
     * Step 4: "Extracting specific evidence..." (80%)
     * Step 5: "Creating your personalized summary..." (100%)
   - Analysis completes within 45-60 seconds total
   - Context summary appears with insights about candidate-role fit
   - "Continue to Experience Stage" button becomes available
   ```

5. **Analysis Quality Verification**
   ```
   Verify the analysis includes:
   - Resume skills extraction (Data Analysis, Marketing, Communication)
   - Job requirements identification (SQL, collaboration, customer focus)
   - Initial connections between candidate background and role
   - Multiple evidence points (1-2 quotes) per matched requirement in the Detailed Skills Evidence table
   - Encouraging tone with growth opportunities mentioned
   
   Verify the Detailed Skills Evidence table shows:
   - Direct matches with numbered evidence points (e.g., "1. Quote one" "2. Quote two")
   - Skill gaps with mitigation strategies
   - Tab navigation between All/Matches/Gaps views
   ```

#### **Stage 2: Experience Stage Testing**

1. **Navigation Test**
   ```
   Action: Click "Continue to Experience Stage"
   Expected: Experience Stage interface loads with analysis results
   ```

2. **Experience Display Test**
   ```
   Expected Interface Elements:
   - Analysis summary from Context stage
   - Categorized experiences (skills, achievements, connections)
   - Relevance scores for each item
   - Selection checkboxes for meaningful experiences
   ```

3. **Experience Selection Test**
   ```
   Action: Select 3-5 experiences that resonate most
   Examples: Marketing internship, tutoring experience, student dashboard project
   
   Expected: 
   - Checkboxes update selection state
   - Selected count updates
   - Elaboration text areas appear for selected items
   ```

4. **Elaboration Test**
   ```
   Action: Add personal elaboration for selected experiences
   Example: "The tutoring experience was meaningful because it showed me how data and personalized approaches can help others succeed."
   
   Expected:
   - Text areas accept input
   - Character count or validation if implemented
   - "Continue to Reflection" button enables after sufficient selections
   ```

#### **Stage 3: Reflection Stage Testing**

1. **Navigation Test**
   ```
   Action: Click "Continue to Reflection Stage"
   Expected: Reflection Stage loads with two-tab interface
   ```

2. **Synthesis Tab Test**
   ```
   Expected Elements:
   - Selected experiences summary
   - AI-generated synthesis with narrative summary
   - Key connections identified
   - Unique value proposition
   - Growth areas and surprising insights
   - "Begin Ignatian Reflection" button
   ```

3. **Ignatian Reflection Tab Test**
   ```
   Action: Click "Begin Ignatian Reflection"
   Expected:
   - Tab switches to reflection prompts
   - 4-6 reflection questions in categories:
     * Values alignment
     * Service to others  
     * Personal mission
     * Growth opportunities
   ```

4. **Reflection Response Test**
   ```
   Action: Complete at least 3 reflection responses
   Example responses:
   - Values: "I'm energized by work that combines analytical thinking with helping others grow..."
   - Service: "I see this role as a way to help businesses better serve their customers..."
   - Mission: "I feel called to use data to create more equitable outcomes..."
   
   Expected:
   - Text areas accept thoughtful responses
   - Progress tracking shows completion
   - "Continue to Action Stage" enables after 3+ completed reflections
   ```

#### **Stage 4: Action Stage Testing**

1. **Navigation Test**
   ```
   Action: Click "Continue to Action Stage"
   Expected: Action Stage loads with project generation interface
   ```

2. **Project Plan Generation Test**
   ```
   Expected Elements:
   - Project overview with title and description
   - Clear objectives and target skills
   - Detailed deliverables with timelines
   - Implementation steps broken into phases
   - Interview talking points
   - Values integration statement
   ```

3. **Project Plan Verification**
   ```
   Verify project plan includes:
   - Authentic connection to user's experiences and values
   - Technical skills demonstration relevant to target role
   - Service dimension showing how project helps others
   - Realistic timeline and implementation steps
   - Professional quality suitable for portfolio
   ```

4. **Navigation Test**
   ```
   Action: Click "Continue to Evaluation Stage"
   Expected: Seamless transition to final stage
   ```

#### **Stage 5: Evaluation Stage Testing**

1. **Interface Test**
   ```
   Expected Elements:
   - Three-tab interface: Interview, Assessment, Reflection
   - Project summary at top
   - Progress tracking for completion requirements
   ```

2. **Mock Interview Tab Test**
   ```
   Expected Elements:
   - 6-8 interview questions across categories:
     * Behavioral (past experiences)
     * Technical (problem-solving skills)
     * Values-based (cultural alignment)
     * Project-specific (portfolio discussion)
   - Detailed preparation guidance for each question
   - Response text areas for practice
   ```

3. **Self-Assessment Tab Test**
   ```
   Expected Elements:
   - 5 assessment areas (technical skills, communication, values integration, etc.)
   - Star rating system (1-5 scale)
   - Reflection prompts for each area
   - Progress tracking showing completed assessments
   ```

4. **Final Reflection Tab Test**
   ```
   Expected Elements:
   - Capstone reflection prompts about entire journey
   - Large text area for comprehensive reflection
   - Guidance questions about growth, insights, and future steps
   ```

5. **Completion Test**
   ```
   Action: Complete all requirements (3+ interviews, 3+ assessments, final reflection)
   Expected: 
   - Completion celebration interface
   - "Export Portfolio" and "Return to Dashboard" options
   - Journey completion confirmation
   ```

---

## Feature Testing

### Authentication System

#### **Google OAuth Integration**
```bash
# Test Cases
1. Initial login flow
2. Token refresh handling
3. Logout functionality
4. Protected route access
5. Session persistence
```

**Test Procedure**:
1. **First-time Login**
   - Clear browser data
   - Navigate to application
   - Click "Sign in with Google"
   - Complete OAuth flow
   - Verify successful redirect and user data storage

2. **Session Persistence**
   - Close and reopen browser
   - Navigate to application
   - Verify automatic login without re-authentication

3. **Protected Routes**
   - Try accessing `/context`, `/experience`, etc. without login
   - Verify redirect to login page
   - Login and verify access granted

### Document Processing

#### **File Upload System**
```bash
# Test Cases
1. Supported file formats (PDF, TXT, DOC, DOCX)
2. File size limits
3. Text extraction accuracy
4. Error handling for corrupted files
5. Multiple file uploads
```

**Test Procedure**:
1. **Format Testing**
   ```bash
   # Test with different file formats
   - test-resume.pdf
   - test-resume.txt
   - test-resume.docx
   - test-job-description.pdf
   ```

2. **Size Limit Testing**
   ```bash
   # Test with large files
   - Create 10MB+ test file
   - Verify size limit enforcement
   - Check error message clarity
   ```

3. **Text Extraction Verification**
   ```bash
   # Compare extracted text with original
   - Upload formatted resume
   - Verify key information preserved
   - Check special characters and formatting
   ```

### Database Operations

#### **Data Persistence Testing**
```bash
# Test Cases
1. User data storage and retrieval
2. Document metadata persistence
3. Analysis results caching
4. Cross-session data consistency
5. Concurrent user handling
```

**Test Procedure**:
1. **User Journey Persistence**
   ```sql
   -- Verify data storage at each stage
   SELECT * FROM users WHERE email = 'test@example.com';
   SELECT * FROM documents WHERE user_id = 1;
   SELECT * FROM analysis_results WHERE user_id = 1;
   ```

2. **Multi-Session Testing**
   - Start journey in one browser session
   - Continue in different browser/device
   - Verify data consistency and progress preservation

---

## API Testing

### Backend API Endpoints

#### **Authentication Endpoints**
```bash
# Test Google OAuth callback
curl -X POST http://localhost:8000/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{"token": "google_oauth_token"}'

# Test protected endpoint
curl -X GET http://localhost:8000/api/user/profile \
  -H "Authorization: Bearer jwt_token"
```

#### **Document Upload Endpoints**
```bash
# Test document upload
curl -X POST http://localhost:8000/api/documents/upload \
  -H "Authorization: Bearer jwt_token" \
  -F "file=@test-resume.pdf" \
  -F "document_type=resume"

# Test document analysis trigger
curl -X POST http://localhost:8000/api/analysis/start \
  -H "Authorization: Bearer jwt_token" \
  -H "Content-Type: application/json"
```

#### **Analysis Endpoints**
```bash
# Check analysis status
curl -X GET http://localhost:8000/api/analysis/latest/status \
  -H "Authorization: Bearer jwt_token"

# Get analysis results
curl -X GET http://localhost:8000/api/analysis/latest/results \
  -H "Authorization: Bearer jwt_token"
```

### API Response Validation

#### **Expected Response Formats**
```json
// Analysis Status Response
{
  "id": 123,
  "status": "completed",
  "resume_analysis": { ... },
  "job_analysis": { ... },
  "connections_analysis": { ... },
  "context_summary": "...",
  "created_at": "2024-12-18T10:30:00Z",
  "completed_at": "2024-12-18T10:32:00Z"
}

// Error Response
{
  "error": "Authentication required",
  "status_code": 401,
  "timestamp": "2024-12-18T10:30:00Z"
}
```

---

## LLM Integration Testing

### Multiple LLM Calls Pipeline Testing

The Context Stage analysis involves **5 separate LLM API calls** executed in sequence. Each call must be tested individually and as part of the complete pipeline.

#### **Pipeline Overview**
```python
# The 5-step analysis pipeline with expected timings:
1. Resume Analysis (17-20 seconds)
2. Job Description Analysis (5-7 seconds)  
3. Connection Finding (8-10 seconds)
4. Evidence Extraction (10-12 seconds)
5. Summary Generation (5-7 seconds)
# Total: 45-60 seconds
```

#### **Progress Tracking Test**
```python
# Test progress updates during analysis
async def test_analysis_progress_tracking():
    from app.services.analysis_service import AnalysisService
    
    analysis_service = AnalysisService()
    analysis_id = 1
    
    # Monitor progress updates
    progress_updates = []
    
    async def track_progress():
        while True:
            status = await analysis_service.get_analysis_status(analysis_id)
            progress_updates.append({
                'step': status.get('progress_step'),
                'percentage': status.get('progress_percentage'),
                'message': status.get('progress_message')
            })
            if status.get('status') == 'completed':
                break
            await asyncio.sleep(0.5)
    
    # Start analysis and tracking
    analysis_task = asyncio.create_task(
        analysis_service._perform_analysis(analysis_id, resume_text, job_text)
    )
    tracking_task = asyncio.create_task(track_progress())
    
    await analysis_task
    await tracking_task
    
    # Verify progress tracking
    assert len(progress_updates) >= 5  # At least one update per step
    assert progress_updates[-1]['percentage'] == 100
    print("✅ Progress tracking test passed")
```

### OpenAI API Integration

#### **Basic LLM Functionality**
```python
# Test script: test_llm_integration.py
import asyncio
from app.services.llm_service import llm_service

async def test_resume_analysis():
    resume_text = "Sample resume content..."
    result = await llm_service.analyze_resume(resume_text)
    
    # Verify response structure
    assert 'skills' in result
    assert 'experience' in result
    assert 'strengths' in result
    
    print("✅ Resume analysis test passed")

async def test_job_analysis():
    job_text = "Sample job description..."
    result = await llm_service.analyze_job_description(job_text)
    
    # Verify response structure
    assert 'required_skills' in result
    assert 'responsibilities' in result
    assert 'company_values' in result
    
    print("✅ Job analysis test passed")

# Run tests
asyncio.run(test_resume_analysis())
asyncio.run(test_job_analysis())
```

#### **Enhanced Evidence Extraction Testing**
```python
# Test multiple evidence points extraction
async def test_evidence_extraction_array():
    """Test that evidence extraction returns arrays with up to 2 quotes"""
    from app.services.llm_service import llm_service
    
    resume_text = """
    John Smith - Software Engineer
    Experience:
    - Developed Python data analysis tools for marketing team
    - Created automated reporting dashboards using SQL and Tableau
    - Led cross-functional team of 5 engineers on customer analytics project
    - Implemented machine learning models for customer segmentation
    """
    
    job_text = """
    Data Analyst Position
    Requirements:
    - Experience with Python for data analysis
    - SQL and data visualization skills
    - Team collaboration abilities
    """
    
    result = await llm_service.extract_detailed_evidence(resume_text, job_text)
    
    # Verify evidence is returned as arrays
    assert 'direct_evidence' in result
    for evidence in result['direct_evidence']:
        assert 'candidate_evidence' in evidence
        # Check if it's an array
        assert isinstance(evidence['candidate_evidence'], list)
        # Should have 1-2 evidence points
        assert 1 <= len(evidence['candidate_evidence']) <= 2
        # Each evidence should be a non-empty string
        for quote in evidence['candidate_evidence']:
            assert isinstance(quote, str)
            assert len(quote) > 0
    
    print("✅ Evidence array extraction test passed")

async def test_evidence_backward_compatibility():
    """Test that frontend handles both string and array evidence formats"""
    from frontend.src.utils.transformConnectionsData import transformConnectionsData
    
    # Test with string format (old)
    old_format = {
        'skill_alignment': {
            'direct_matches': [{
                'skill': 'Python',
                'candidate_evidence': 'Developed Python tools',  # String
                'confidence_score': 9.0
            }]
        }
    }
    
    # Test with array format (new)
    new_format = {
        'skill_alignment': {
            'direct_matches': [{
                'skill': 'Python',
                'candidate_evidence': [  # Array
                    'Developed Python data analysis tools',
                    'Implemented ML models using Python'
                ],
                'confidence_score': 9.0
            }]
        }
    }
    
    # Both should transform successfully
    old_result = transformConnectionsData(old_format)
    new_result = transformConnectionsData(new_format)
    
    assert old_result is not None
    assert new_result is not None
    print("✅ Backward compatibility test passed")
```

#### **Enhanced LLM Service Testing**
```python
# Test enhanced prompts
from app.services.enhanced_llm_service import enhanced_llm_service

async def test_enhanced_analysis():
    user_context = {
        'academic_level': 'undergraduate',
        'major': 'business administration',
        'career_stage': 'early career',
        'values_focus': 'service orientation'
    }
    
    resume_analysis = await enhanced_llm_service.analyze_resume_enhanced(
        resume_text, user_context
    )
    
    # Verify enhanced features
    assert 'metadata' in resume_analysis
    assert 'confidence_score' in resume_analysis['metadata']
    assert 'values_indicators' in resume_analysis
    assert 'character_strengths' in resume_analysis
    
    print("✅ Enhanced LLM analysis test passed")
```

### LLM Response Quality Testing

#### **Content Quality Validation**
```python
def validate_analysis_quality(analysis_result):
    """Validate LLM analysis meets quality standards"""
    
    quality_checks = {
        'has_specific_skills': len(analysis_result.get('skills', [])) >= 3,
        'has_experience_details': len(analysis_result.get('experience', [])) >= 1,
        'has_ignatian_elements': 'values_indicators' in analysis_result,
        'has_confidence_score': analysis_result.get('metadata', {}).get('confidence_score', 0) > 0.7,
        'has_growth_areas': len(analysis_result.get('growth_areas', [])) >= 2
    }
    
    passed_checks = sum(quality_checks.values())
    total_checks = len(quality_checks)
    
    print(f"Quality Score: {passed_checks}/{total_checks}")
    for check, passed in quality_checks.items():
        print(f"  {check}: {'✅' if passed else '❌'}")
    
    return passed_checks >= total_checks * 0.8  # 80% pass rate
```

---

## Database Testing

### Database Schema Validation

#### **Table Structure Tests**
```sql
-- Verify user table structure
\d users;

-- Check required columns exist
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users';

-- Verify foreign key relationships
SELECT 
    tc.table_name, 
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE constraint_type = 'FOREIGN KEY';
```

#### **Data Integrity Tests**
```sql
-- Test user creation
INSERT INTO users (email, name, google_id, created_at) 
VALUES ('test@example.com', 'Test User', 'google123', NOW());

-- Test document creation with user reference
INSERT INTO documents (user_id, filename, file_type, file_size, content, created_at)
VALUES (1, 'test-resume.pdf', 'resume', 1024, 'Sample content...', NOW());

-- Test analysis results creation
INSERT INTO analysis_results (user_id, status, created_at)
VALUES (1, 'pending', NOW());

-- Verify cascade deletes work properly
DELETE FROM users WHERE email = 'test@example.com';
-- Check that related documents and analysis are also deleted
```

### Performance Testing

#### **Database Query Performance**
```sql
-- Test query performance with EXPLAIN ANALYZE
EXPLAIN ANALYZE SELECT * FROM analysis_results 
WHERE user_id = 1 
ORDER BY created_at DESC 
LIMIT 1;

-- Check index usage
EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM documents 
WHERE user_id = 1 AND file_type = 'resume';

-- Monitor slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
WHERE mean_time > 100 
ORDER BY mean_time DESC;
```

---

## Authentication Testing

### Google OAuth Flow

#### **OAuth Configuration Verification**
```bash
# Verify environment variables
echo $GOOGLE_CLIENT_ID
echo $GOOGLE_CLIENT_SECRET

# Test OAuth endpoints
curl -X GET "https://accounts.google.com/.well-known/openid_configuration"
```

#### **JWT Token Testing**
```python
# Test JWT token generation and validation
from app.core.security import create_access_token, verify_token

# Generate token
token = create_access_token(data={"sub": "user@example.com"})
print(f"Generated token: {token}")

# Verify token
payload = verify_token(token)
print(f"Token payload: {payload}")

# Test expired token handling
import time
time.sleep(3600)  # Wait for token expiration
try:
    expired_payload = verify_token(token)
except Exception as e:
    print(f"Expected expiration error: {e}")
```

### Security Testing

#### **Authorization Tests**
```bash
# Test accessing protected routes without token
curl -X GET http://localhost:8000/api/user/profile
# Expected: 401 Unauthorized

# Test with invalid token
curl -X GET http://localhost:8000/api/user/profile \
  -H "Authorization: Bearer invalid_token"
# Expected: 401 Unauthorized

# Test with valid token
curl -X GET http://localhost:8000/api/user/profile \
  -H "Authorization: Bearer valid_jwt_token"
# Expected: 200 OK with user data
```

---

## Error Handling Testing

### Frontend Error Handling

#### **Network Error Scenarios**
```javascript
// Test network failure handling
// 1. Disconnect network during analysis
// 2. Verify user-friendly error messages
// 3. Check retry mechanisms

// Test API error handling
// 1. Return 500 error from backend
// 2. Verify graceful degradation
// 3. Check error reporting to user
```

#### **File Upload Error Testing**
```bash
# Test various error scenarios
1. Upload unsupported file format (.exe, .zip)
2. Upload empty file
3. Upload corrupted PDF
4. Upload file exceeding size limit
5. Network interruption during upload
```

### Backend Error Handling

#### **LLM Service Error Testing**
```python
# Test LLM API failures
async def test_llm_error_handling():
    # Mock OpenAI API failure
    with patch('openai.ChatCompletion.create') as mock_create:
        mock_create.side_effect = Exception("API Rate Limit")
        
        result = await llm_service.analyze_resume("test content")
        
        # Verify graceful error handling
        assert 'error' in result
        assert 'rate limit' in result['error'].lower()
        
    print("✅ LLM error handling test passed")
```

#### **Database Error Testing**
```python
# Test database connection failures
async def test_db_error_handling():
    # Mock database connection failure
    with patch('sqlalchemy.create_engine') as mock_engine:
        mock_engine.side_effect = Exception("Connection failed")
        
        # Test various database operations
        # Verify appropriate error responses
        
    print("✅ Database error handling test passed")
```

---

## Performance Testing

### Load Testing

#### **Frontend Performance**
```bash
# Install testing tools
npm install -g lighthouse
npm install -g @web/test-runner

# Run Lighthouse audit
lighthouse http://localhost:3000 --output html --output-path ./lighthouse-report.html

# Check Core Web Vitals
# - First Contentful Paint (FCP)
# - Largest Contentful Paint (LCP)
# - Cumulative Layout Shift (CLS)
# - First Input Delay (FID)
```

#### **Backend Performance**
```bash
# Install load testing tools
pip install locust

# Create load test script: locustfile.py
from locust import HttpUser, task, between

class APIUser(HttpUser):
    wait_time = between(1, 3)
    
    def on_start(self):
        # Login and get token
        response = self.client.post("/api/auth/google", json={"token": "test_token"})
        self.token = response.json()["access_token"]
        self.headers = {"Authorization": f"Bearer {self.token}"}
    
    @task(3)
    def upload_document(self):
        files = {"file": ("test.txt", "Sample content", "text/plain")}
        self.client.post("/api/documents/upload", files=files, headers=self.headers)
    
    @task(2)
    def check_analysis_status(self):
        self.client.get("/api/analysis/latest/status", headers=self.headers)
    
    @task(1)
    def get_user_profile(self):
        self.client.get("/api/user/profile", headers=self.headers)

# Run load test
locust -f locustfile.py --host=http://localhost:8000
```

### Database Performance

#### **Query Performance Testing**
```sql
-- Create performance test data
INSERT INTO users (email, name, google_id, created_at)
SELECT 
    'user' || generate_series(1, 1000) || '@test.com',
    'User ' || generate_series(1, 1000),
    'google' || generate_series(1, 1000),
    NOW() - (random() * interval '365 days')
FROM generate_series(1, 1000);

-- Test query performance under load
EXPLAIN (ANALYZE, BUFFERS) 
SELECT u.*, COUNT(d.id) as document_count
FROM users u
LEFT JOIN documents d ON u.id = d.user_id
GROUP BY u.id
ORDER BY u.created_at DESC
LIMIT 50;

-- Monitor connection pool usage
SELECT * FROM pg_stat_activity WHERE state = 'active';
```

---

## Automated Testing

### Unit Testing

#### **Backend Unit Tests**
```python
# tests/test_llm_service.py
import pytest
from app.services.llm_service import llm_service

@pytest.mark.asyncio
async def test_resume_analysis():
    """Test resume analysis with sample data"""
    resume_text = """
    John Smith
    Software Engineer
    Skills: Python, JavaScript, React
    Experience: 3 years at TechCorp
    """
    
    result = await llm_service.analyze_resume(resume_text)
    
    assert result is not None
    assert 'skills' in result
    assert 'experience' in result
    assert len(result['skills']) > 0

@pytest.mark.asyncio
async def test_job_analysis():
    """Test job description analysis"""
    job_text = """
    Senior Developer Position
    Requirements: Python, 5+ years experience
    Responsibilities: Lead development team
    """
    
    result = await llm_service.analyze_job_description(job_text)
    
    assert result is not None
    assert 'required_skills' in result
    assert 'responsibilities' in result

# Run tests
pytest tests/test_llm_service.py -v
```

#### **Frontend Unit Tests**
```javascript
// src/components/__tests__/ContextStage.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ContextStage from '../context/ContextStage';
import { AuthProvider } from '../../contexts/AuthContext';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('ContextStage', () => {
  test('renders upload interface', () => {
    renderWithProviders(<ContextStage />);
    
    expect(screen.getByText('Upload Resume')).toBeInTheDocument();
    expect(screen.getByText('Upload Job Description')).toBeInTheDocument();
  });

  test('handles file upload', async () => {
    renderWithProviders(<ContextStage />);
    
    const file = new File(['resume content'], 'resume.txt', { type: 'text/plain' });
    const input = screen.getByLabelText(/upload resume/i);
    
    fireEvent.change(input, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(screen.getByText('resume.txt')).toBeInTheDocument();
    });
  });
});

// Run tests
npm test
```

### Integration Testing

#### **End-to-End Testing with Playwright**
```javascript
// tests/e2e/ipp-journey.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Complete IPP Journey', () => {
  test('user can complete full journey', async ({ page }) => {
    // Login
    await page.goto('http://localhost:3000');
    await page.click('button:has-text("Sign in with Google")');
    // Handle OAuth flow (mock in test environment)
    
    // Context Stage
    await page.goto('http://localhost:3000/context');
    await page.setInputFiles('#resume-upload', 'test-data/sample-resume.pdf');
    await page.setInputFiles('#job-upload', 'test-data/sample-job.pdf');
    await page.click('button:has-text("Start Analysis")');
    
    // Wait for analysis completion
    await expect(page.locator('text=Analysis Complete')).toBeVisible({ timeout: 60000 });
    
    // Experience Stage
    await page.click('button:has-text("Continue to Experience")');
    await expect(page).toHaveURL(/.*\/experience/);
    
    // Select experiences
    await page.check('input[type="checkbox"]').nth(0);
    await page.check('input[type="checkbox"]').nth(1);
    await page.check('input[type="checkbox"]').nth(2);
    
    // Add elaborations
    await page.fill('textarea[placeholder*="elaboration"]', 'This experience was meaningful because...');
    
    // Reflection Stage
    await page.click('button:has-text("Continue to Reflection")');
    await expect(page).toHaveURL(/.*\/reflection/);
    
    // Complete reflections
    await page.click('button:has-text("Begin Ignatian Reflection")');
    const reflectionQuestions = page.locator('textarea[placeholder*="reflect"]');
    const count = await reflectionQuestions.count();
    
    for (let i = 0; i < Math.min(count, 3); i++) {
      await reflectionQuestions.nth(i).fill('Deep reflection response about values and calling...');
    }
    
    // Action Stage
    await page.click('button:has-text("Continue to Action")');
    await expect(page).toHaveURL(/.*\/action/);
    await expect(page.locator('text=Portfolio Project')).toBeVisible();
    
    // Evaluation Stage
    await page.click('button:has-text("Continue to Evaluation")');
    await expect(page).toHaveURL(/.*\/evaluation/);
    
    // Complete evaluation requirements
    await page.click('text=Mock Interview');
    // Fill interview responses...
    
    await page.click('text=Self-Assessment');
    // Complete assessments...
    
    await page.click('text=Final Reflection');
    await page.fill('textarea[placeholder*="journey"]', 'Final reflection on complete experience...');
    
    // Verify completion
    await expect(page.locator('text=Congratulations')).toBeVisible();
  });
});

// Run tests
npx playwright test
```

---

## Troubleshooting

### Common Issues

#### **Backend Issues**

**Database Connection Errors**
```bash
# Check database status
pg_isready -h localhost -p 5432

# Verify connection string
psql $DATABASE_URL

# Check for migration issues
alembic current
alembic history
```

**OpenAI API Issues**
```bash
# Test API key
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"

# Check rate limits
curl -I https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

**Google OAuth Issues**
```bash
# Verify OAuth configuration
curl "https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=$ACCESS_TOKEN"

# Check client ID configuration
echo $GOOGLE_CLIENT_ID
echo $REACT_APP_GOOGLE_CLIENT_ID
```

#### **Frontend Issues**

**Build Errors**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run type-check

# Verify environment variables
echo $REACT_APP_API_URL
echo $REACT_APP_GOOGLE_CLIENT_ID
```

**Runtime Errors**
```bash
# Check browser console for errors
# Verify API connectivity
curl http://localhost:8000/api/health

# Check CORS configuration
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     http://localhost:8000/api/auth/google
```

### Debugging Tools

#### **Backend Debugging**
```python
# Add logging to FastAPI
import logging
logging.basicConfig(level=logging.DEBUG)

# Use debugger
import pdb; pdb.set_trace()

# Monitor database queries
# Add to settings.py
DATABASE_URL = "postgresql://user:pass@host/db?echo=true"
```

#### **Frontend Debugging**
```javascript
// React Developer Tools
// Redux DevTools (if using Redux)
// Browser Network tab for API calls
// Console logging

console.log('Debug info:', { state, props, data });

// Error boundaries for catching React errors
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.error('Component error:', error, errorInfo);
  }
}
```

### Performance Monitoring

#### **Application Monitoring**
```bash
# Backend monitoring
pip install prometheus-client
pip install psutil

# Frontend monitoring
npm install @sentry/react
npm install web-vitals

# Database monitoring
SELECT * FROM pg_stat_activity;
SELECT * FROM pg_stat_user_tables;
```

#### **LLM Pipeline Performance Benchmarks**
```python
# Expected timings for each LLM call
PERFORMANCE_BENCHMARKS = {
    'resume_analysis': {'min': 15, 'max': 25, 'typical': 20},
    'job_analysis': {'min': 4, 'max': 10, 'typical': 7},
    'connections_finding': {'min': 6, 'max': 15, 'typical': 10},
    'evidence_extraction': {'min': 8, 'max': 18, 'typical': 12},
    'summary_generation': {'min': 4, 'max': 10, 'typical': 7},
    'total_pipeline': {'min': 40, 'max': 75, 'typical': 60}
}

async def test_pipeline_performance():
    """Test that LLM pipeline completes within expected timeframes"""
    import time
    from app.services.analysis_service import AnalysisService
    
    start_time = time.time()
    timings = {}
    
    # Track each step
    # ... (analysis code with timing for each step)
    
    total_time = time.time() - start_time
    
    # Verify performance
    assert total_time <= PERFORMANCE_BENCHMARKS['total_pipeline']['max']
    print(f"✅ Pipeline completed in {total_time:.1f}s (benchmark: {PERFORMANCE_BENCHMARKS['total_pipeline']['typical']}s)")
```

---

## Test Execution Checklist

### Pre-Testing Setup
- [ ] Environment variables configured
- [ ] Database migrations up to date
- [ ] Backend server running on port 8000
- [ ] Frontend server running on port 3000
- [ ] Test data files prepared
- [ ] API keys valid and working

### Manual Testing Checklist
- [ ] Complete IPP journey (Context → Evaluation)
- [ ] Google OAuth authentication flow
- [ ] Document upload and processing
- [ ] LLM analysis completion with progress tracking (5 steps)
- [ ] Multiple evidence points display (1-2 quotes per requirement)
- [ ] Experience selection and elaboration
- [ ] Reflection synthesis and prompts
- [ ] Portfolio project generation
- [ ] Mock interview questions
- [ ] Self-assessment framework
- [ ] Final reflection completion

### Automated Testing Checklist
- [ ] Backend unit tests passing
- [ ] Frontend unit tests passing
- [ ] Integration tests passing
- [ ] End-to-end tests passing
- [ ] Performance tests within thresholds
- [ ] Security tests passing

### Error Testing Checklist
- [ ] Network failure handling
- [ ] File upload errors
- [ ] LLM API failures
- [ ] Database connection issues
- [ ] Authentication errors
- [ ] Invalid input handling

### Post-Testing Verification
- [ ] No console errors in browser
- [ ] No backend error logs
- [ ] Database integrity maintained
- [ ] Performance metrics acceptable
- [ ] Security vulnerabilities addressed
- [ ] Test data cleaned up

This comprehensive testing guide ensures the Ignatian AI Augmentation Agent functions correctly across all components and provides a reliable, high-quality user experience through the complete IPP journey.