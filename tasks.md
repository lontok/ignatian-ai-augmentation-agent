# Development Tasks & Technical Requirements

## Current Sprint: Context Stage Enhancement
**Goal**: Align Context stage with Ignatian pedagogical requirements  
**Sprint End**: TBD  
**Last Updated**: 2025-06-21 (June 21, 2025)

## 🚨 Active Development

### IN PROGRESS

### BLOCKED

## 📋 IPP Stage Implementation Status

### Stage 1: Context (Resume Analysis) - 85% Complete

#### ✅ Completed
- [x] Path selection screen - `/frontend/src/pages/PathSelection.tsx`
- [x] Resume-only upload interface - `/frontend/src/pages/context/ContextStage.tsx`
- [x] Mode indicator badge throughout app
- [x] Basic LLM extraction - `/backend/app/services/llm_service.py:14-41`
- [x] Progress tracking during analysis
- [x] Fix React rendering errors with object arrays
- [x] Align Context Stage extraction with Ignatian pedagogical goals
- [x] Enhanced LLM prompts with chain-of-thought reasoning
- [x] Added values/character analysis extraction
- [x] Service orientation extraction from experiences
- [x] Growth indicators and transferable skills identification
- [x] Add backend resume-only analysis endpoint - `/backend/app/api/analysis.py:53-84`
- [x] Frontend integration with resume-only endpoint - `/frontend/src/pages/context/ContextStage.tsx:175`
- [x] Re-analyze button for enhanced Ignatian insights
- [x] Display support for new Ignatian fields (character strengths, values, growth mindset)

#### 🔧 Current LLM Extraction (Enhanced)
File: `/backend/app/services/llm_service.py:14-111`
- personal_info (name, contact, location)
- skills (technical and soft with evidence)
- experience (with service_impact field)
- education (including extracurricular)
- projects (with impact assessment)
- strengths (with evidence and workplace_value)
- career_level
- industries
- **NEW**: character_strengths (with Ignatian dimensions)
- **NEW**: values_indicators (service, collaboration, learning, excellence)
- **NEW**: growth_mindset (indicators, development areas, readiness)

#### ❌ Missing Ignatian Requirements
- [ ] Personal background questionnaire component
- [ ] Values inventory assessment UI component
- [ ] Skills self-assessment tool
- [ ] Mission/purpose capture form

#### 📝 Technical Tasks
- [x] Enhance prompt in `llm_service.py` for Ignatian extraction
- [x] Update frontend to handle new Ignatian fields
- [ ] Add pre-upload questionnaire component
- [ ] Create values inventory UI component
- [ ] Add validation for Ignatian fields

### Stage 2: Experience (Job Upload) - 0% Complete

#### Requirements
- [ ] Multi-file upload component (3-5 files for Exploration Mode)
- [ ] Single file upload (Interview Prep Mode)
- [ ] Job parsing service enhancement
- [ ] Overlap analysis algorithm implementation
- [ ] D3.js Venn diagram visualization
- [ ] Coverage scoring system
- [ ] Strategic recommendations panel

#### Technical Tasks
- [ ] Create `MultiFileUpload.tsx` component
- [ ] Implement `/api/jobs/multi-upload` endpoint
- [ ] Create overlap analysis service
- [ ] Add D3.js dependency and setup
- [ ] Design coverage score algorithm
- [ ] Create job analysis data models

### Stage 3: Reflection - Complete ✅
- Synthesis generation implemented
- Ignatian reflection prompts implemented
- Values-based questioning system complete

### Stage 4: Action - Complete ✅
- Portfolio project generation implemented
- Implementation blueprints complete
- Interview talking points generation

### Stage 5: Evaluation - Complete ✅
- Mock interview questions implemented
- Self-assessment framework complete
- Final reflection system

## 🐛 Bug Fixes

### High Priority
- [ ] Analysis polling memory leak in `ContextStage.tsx`
- [ ] Session storage path persistence issue

### Medium Priority
- [ ] File size validation not working for large PDFs
- [ ] Error boundaries missing in key components

## 🛠️ Technical Debt

### Consolidation Needed
- [ ] Merge `llm_service.py` and `enhanced_llm_service.py`
  - Both files have overlapping functionality
  - Enhanced version has better Ignatian prompts
  - Need to consolidate into single service

### TypeScript Improvements
- [ ] Add proper types for analysis results
- [ ] Create interfaces for LLM responses
- [ ] Type safety for API responses

### Performance
- [ ] Implement loading skeletons
- [ ] Add request caching for analysis
- [ ] Optimize bundle size

## 🧪 Testing Requirements

### Context Stage
- [ ] Validate all Ignatian extraction fields
- [ ] Test with various resume formats
- [ ] Verify questionnaire data persistence
- [ ] Test values inventory flow

### Experience Stage
- [ ] Multi-file upload handling
- [ ] File size limits (5 files max)
- [ ] Overlap analysis accuracy
- [ ] Venn diagram interactions

### Integration Tests
- [ ] Path switching scenarios
- [ ] Data persistence across stages
- [ ] Cross-browser compatibility
- [ ] Mobile responsiveness

## 📚 API Documentation Needs

### New Endpoints Required
```
POST /api/analysis/resume/start
{
  "resume_document_id": number
}

GET /api/analysis/resume/{id}

POST /api/jobs/multi-upload
{
  "files": File[],
  "mode": "exploration" | "interview"
}

GET /api/jobs/overlap-analysis/{job_ids}
```

### Existing Endpoints to Update
- `POST /api/analysis/start` - Add mode parameter
- `GET /api/documents/` - Add filtering by type

## 📝 Notes & References

### Key Files
- LLM Service: `/backend/app/services/llm_service.py`
- Enhanced LLM: `/backend/app/services/enhanced_llm_service.py`
- Context Stage: `/frontend/src/pages/context/ContextStage.tsx`
- Path Selection: `/frontend/src/pages/PathSelection.tsx`

### Important Decisions
- Context = Resume only (not job descriptions)
- Experience = Job descriptions upload
- Two paths: Exploration (3-5 jobs) vs Interview Prep (1 job)
- Using GPT-4o-mini for all LLM operations

### Dependencies to Add
- D3.js for Venn diagram visualization
- React-dropzone for multi-file upload
- Lodash for overlap analysis utilities

## 🔄 Recently Completed (Last 7 Days)

### 2025-06-21
- [x] Implement Path Selection Screen
- [x] Update Context Stage for resume-only upload
- [x] Add mode indicator badge
- [x] Fix React child rendering errors
- [x] Test path selection and context flows
- [x] Reorganize documentation into three focused files:
  - CLAUDE.md: AI assistant coding guidelines
  - tasks.md: Developer implementation tracking
  - prd-stakeholder.md: Executive overview
  - Archived development-notes.md to .archive/
- [x] Create CHANGELOG.md with version history
- [x] Add git hook for changelog reminders
- [x] Update documentation workflow in CLAUDE.md
- [x] Enhance Context Stage LLM extraction with Ignatian pedagogical elements:
  - Added character_strengths with Ignatian dimensions
  - Added values_indicators (service, collaboration, learning, excellence)
  - Added growth_mindset assessment
  - Enhanced prompts with chain-of-thought reasoning
  - Updated system prompt with Dr. Elena Rodriguez persona
- [x] Create backend resume-only analysis endpoint:
  - Added `/api/analysis/resume/start` endpoint
  - Implemented `start_resume_analysis` method in analysis service
  - Added logging to verify Ignatian prompts are used
- [x] Implement re-analyze functionality:
  - Added "Re-analyze with Enhanced Insights" button
  - Frontend properly clears previous results before re-analyzing
  - Updated to use new resume-only endpoint

### Previous
- [x] Google OAuth2 implementation
- [x] All 5 IPP stages UI implementation
- [x] LLM integration with progress tracking
- [x] Multiple evidence points per requirement