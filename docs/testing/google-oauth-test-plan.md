# Google OAuth Authentication Test Plan

## Overview
This document outlines the test plan for verifying Google OAuth authentication functionality in the Ignatian AI Augmentation Agent application using Puppeteer.

## Prerequisites

### Environment Setup
1. Ensure both backend and frontend servers are running:
   ```bash
   # Terminal 1: Start backend (port 8000)
   cd backend
   python main.py
   
   # Terminal 2: Start frontend (port 3000)
   cd frontend
   npm start
   ```

2. Verify servers are running:
   ```bash
   # Check backend health
   curl http://localhost:8000/health
   
   # Check frontend
   curl http://localhost:3000
   ```

### Puppeteer Configuration
- Use non-headless mode for visual testing: `{ headless: false }`
- Recommended viewport: 1200x800

## Test Steps

### 1. Navigate to Application
```javascript
// Navigate to frontend
url: "http://localhost:3000"
```

### 2. Locate and Click Google Sign-In Button
**Selector**: `.nsm7Bb-HzV7m-LgbsSe`

**Alternative selectors**:
- `[role="button"]` (if multiple buttons, filter by text content)
- Parent div containing Google sign-in elements

**Verification before clicking**:
```javascript
// Verify button exists
document.querySelector('.nsm7Bb-HzV7m-LgbsSe')
```

### 3. Handle Google Authentication
**Manual Steps**:
1. Select Google account or enter email
2. Enter password
3. Complete 2FA if enabled
4. Grant permissions to the application

**Note**: Due to Google's anti-automation measures, manual authentication is recommended for testing.

### 4. Verify Successful Authentication

**Expected elements on success page**:
- Success message containing "Successfully Logged In!"
- User profile information:
  - Name field
  - Email field
  - User ID
  - Token status showing "Present"
  - Login timestamp
- "Go to Dashboard" button

### 5. Navigate to Dashboard
**Click dashboard button**:
```javascript
// Find button by text content
const buttons = Array.from(document.querySelectorAll('button'));
const dashboardButton = buttons.find(btn => btn.textContent.includes('Go to Dashboard'));
dashboardButton.click();
```

### 6. Verify Dashboard Access

**Expected dashboard elements**:
- Personalized welcome message (e.g., "Welcome back, [Name]!")
- IPP stages layout (5 stages):
  - Context (Stage 1) - Should have "Start Context Stage" button
  - Experience (Stage 2) - Initially locked
  - Reflection (Stage 3) - Initially locked
  - Action (Stage 4) - Initially locked
  - Evaluation (Stage 5) - Initially locked
- Progress tracking panel showing:
  - Projects Started: 0
  - Projects Completed: 0
  - Total Reflections: 0
- User menu in top right with name and dropdown

## Key Selectors Reference

| Element | Selector | Notes |
|---------|----------|-------|
| Google Sign-In Button | `.nsm7Bb-HzV7m-LgbsSe` | Main Google button class |
| User Menu | Top right corner | Contains user name after login |
| Dashboard Button | `button` containing "Go to Dashboard" | Use text search |
| Stage Cards | `.context`, `.experience`, etc. | Each IPP stage |

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Backend Not Responding
- Check backend logs: `tail -f backend.log`
- Verify environment variables in `.env` file
- Ensure database connection is active

### Frontend Issues
- Check browser console for errors
- Verify `REACT_APP_API_URL` is set correctly
- Clear browser cache/cookies if needed

## Success Criteria

1. ✅ User can click Google sign-in button
2. ✅ Google OAuth flow completes successfully
3. ✅ User profile data is retrieved and displayed
4. ✅ JWT token is generated and stored
5. ✅ User can access protected dashboard route
6. ✅ Dashboard shows personalized content
7. ✅ User session persists across page refreshes

## Notes for Automation

- Consider using test accounts for CI/CD automation
- Mock authentication endpoints for unit tests
- Use environment variables for test credentials (never commit)
- Screenshot key states for debugging failed tests