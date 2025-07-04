# UI Testing Plan Scratchpad - IPP Stages

## Overview
Test the complete user journey through all 5 IPP stages, validating LLM integration at each step.

## Stage 1: Context (Document Upload & Analysis)

### Test Objectives:
1. Resume upload and parsing
2. Job description upload and parsing
3. LLM analysis of documents
4. Company/industry research

### Key Validations:
- File upload functionality (PDF, DOCX, TXT)
- Progress bar shows 5 distinct steps with percentages:
  - Step 1: Resume analysis (20%)
  - Step 2: Job analysis (40%)
  - Step 3: Connections finding (60%)
  - Step 4: Evidence extraction (80%)
  - Step 5: Summary generation (100%)
- LLM correctly extracts:
  - Skills and experience from resume
  - Job requirements from description
  - Company context and industry info
  - Multiple evidence quotes (1-2) per requirement
- Error handling for invalid files
- Loading states during LLM processing
- Total completion time: 45-60 seconds

### Test Scenarios:
- Upload various file formats
- Test with different resume styles
- Various job description formats
- Network failure handling

## Stage 2: Experience (Interactive Visualization)

### Test Objectives:
1. Display skill overlap visualization
2. Interactive engagement with data
3. LLM-generated insights

### Key Validations:
- Visualization renders correctly
- Skill matching accuracy
- Interactive elements respond
- LLM provides relevant insights about gaps

### Test Scenarios:
- Different skill overlap percentages
- Click/hover interactions
- Mobile responsiveness

## Stage 3: Reflection (Ignatian Prompts)

### Test Objectives:
1. LLM generates meaningful reflection prompts
2. User input capture
3. Voice-to-text functionality

### Key Validations:
- Prompt relevance to user context
- Text input saves properly
- Voice input accuracy
- Character limits/validation

### Test Scenarios:
- Multiple reflection sessions
- Long-form responses
- Voice input in different environments

## Stage 4: Action (Project Generation)

### Test Objectives:
1. LLM generates portfolio projects
2. Project customization
3. Resource recommendations

### Key Validations:
- Project relevance to job requirements
- Complexity appropriate to skill level
- Resource links valid
- Project steps actionable

### Test Scenarios:
- Different career levels (entry/mid/senior)
- Various industries
- Technical vs non-technical roles

## Stage 5: Evaluation (Review & Interview Prep)

### Test Objectives:
1. Project review interface
2. Mock interview generation
3. Export functionality

### Key Validations:
- Interview questions relevant
- PDF/Web export quality
- Progress tracking accuracy
- Feedback collection

### Test Scenarios:
- Export different formats
- Various interview styles
- Progress analytics

## Cross-Stage Testing

### Progressive Flow:
- Test transitions between stages
- Validate data persistence
- Check stage locking/unlocking logic

### LLM Content Quality:
- Consistency across stages
- Context retention
- Personalization accuracy

### Performance Testing:
- LLM response times
- Concurrent user handling
- Large file processing

## Automated Test Implementation

### Puppeteer Test Suite Structure:
```javascript
// Example test structure
- test_stage1_upload.js
- test_stage2_visualization.js
- test_stage3_reflection.js
- test_stage4_projects.js
- test_stage5_evaluation.js
- test_flow_complete.js
```

### Key Metrics to Track:
- LLM response accuracy
- Processing time per stage
- User completion rates
- Error frequencies

## Priority Order

1. **High Priority:** Stage 1 (Context) - Foundation for all other stages
2. **High Priority:** Stage 4 (Action) - Core value proposition
3. **Medium Priority:** Stages 2, 3, 5 - Enhanced user experience
4. **Low Priority:** Export features, analytics

## Current Status
- ✅ Google OAuth authentication tested and documented
- ✅ Stage 1 (Context) - Document upload and LLM analysis implemented
- ✅ Progress tracking with 5-step pipeline implemented
- ✅ Multiple evidence extraction (1-2 quotes per requirement) implemented
- 🔄 All 5 IPP stages now functional - comprehensive testing needed

## Recent Updates Testing Focus

### Multiple Evidence Points
- Verify ConnectionsDetailTable displays 1-2 evidence quotes per requirement
- Test numbered display format (1. First quote, 2. Second quote)
- Verify backward compatibility with string format
- Test tab navigation (All/Matches/Gaps)

### Progress Tracking
- Verify smooth progress bar animations
- Test progress messages match the 5 steps
- Confirm timing aligns with benchmarks
- Test interruption/error scenarios

### Performance Testing
- Measure total pipeline time (target: 45-60s)
- Monitor individual step timings
- Test with various document sizes
- Check concurrent user handling

## Notes
- This is a living document - update as we progress through testing
- Add specific test results and findings as we go
- Document any LLM-specific issues or optimizations needed