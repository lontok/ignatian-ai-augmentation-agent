# Ignatian AI Augmentation Agent — PRD (MVP)

### TL;DR

The Ignatian AI Augmentation Agent is a web app for students
that converts job listings and student resumes into tailored
portfolio project plans. By embedding the Ignatian Pedagogical Paradigm
(IPP) and its five elements—context, experience, reflection, action, and
evaluation—the app helps students showcase skills, connect their values,
and confidently prepare for job interviews. All core experiences are
enriched by a Large Language Model (LLM) accessed via API, which
dynamically researches job/industry/company info and generates deeply
personalized reflective prompts and project plans. Authentication is
streamlined via Google sign-in (any Google email) for fast, secure onboarding. The outcome:
increased student job readiness, stronger interview results, and deeper
personal growth.

------------------------------------------------------------------------

## Goals

### Business Goals

- Increase career placement rates among students.

- Deepen student engagement with Ignatian values throughout the job
  preparation process.

- Streamline students’ ability to create value-driven portfolio projects
  aligned with employer needs.

- Capture data for continuous program assessment and research.

- Establish a scalable foundation for broader educational use.

### User Goals

- Make it easier to convert job listings and resumes into stand-out
  portfolio projects.

- Help students articulate and integrate their skills, personal values,
  and Ignatian habits in interviews.

- Boost student confidence by providing clear, actionable project
  blueprints.

- Provide meaningful reflection opportunities throughout the career
  preparation journey.

- Offer practical evidence of fit to potential employers.

### Non-Goals

- Does not automatically match students with employers, beyond generating project artifacts.

- Does not try to replace career counselors or professional coaching.

- Does not automatically match students with employers, beyond
  generating project artifacts.

------------------------------------------------------------------------

## User Stories

**Persona 1: Business Student (Career Seeker)**

- As a business student, I want to upload a job listing and my resume so
  that the app can help me create a focused project plan that aligns
  with employer requirements.

- As a business student, I want LLM-powered reflection guides during my
  project so I can connect my values and Ignatian practices to my work
  in ways that are highly relevant to the job and industry.

- As a business student, I want to generate a portfolio artifact I can
  confidently discuss in interviews, so I clearly demonstrate my fit for
  a role.

**Persona 2: Faculty Mentor**

- As a faculty mentor, I want to review student project plans, so I can
  support their professional growth while tracking Ignatian integration.

- As a mentor, I want to view aggregated outcomes to assess the
  program’s impact.

**Persona 3: Researcher**

- As a researcher, I want access to anonymized student usage and outcome
  data, so I can measure the app’s holistic impact.

------------------------------------------------------------------------

## Functional Requirements

### Core Functional Requirements

**IPP Framing and Flow (Critical Priority)**

The app’s entire user journey mirrors the five-stage Ignatian
Pedagogical Paradigm. Each stage is distinctive and powered by
LLM-driven personalization:

1.  **Context**

    - Student signs in with Google to begin.

    - Uploads both the target job description and their resume.

    - The LLM, via API, parses both documents, extracting key
      responsibilities, skills, company mission, industry, and aligning
      these with student’s prior experience.

    - App supplements initial data with LLM-driven research to bring in
      company, industry, and job-specific trends and nuances—helping
      students see not only what’s being asked, but why.

    - The app explicitly prompts users for additional backdrop: major,
      interests, recent experiences, and what motivates them at this
      stage—ensuring that the user’s “world” is the foundation before
      moving forward.

2.  **Experience**

    - App visually and interactively presents the “raw data” (job needs,
      resume strengths, LLM-researched context).

    - LLM surfaces points of resonance and relevance—highlighting which
      aspects of the resume and background most closely align with
      employer needs.

    - Students actively engage by affirming, elaborating on, or
      selecting experiences (using voice or text input) that stand out
      to them or feel most relevant.

    - Agent encourages students to go beyond resume bullets, recalling
      related skills, interests, or strengths that connect to the
      highlighted requirements, guided by Ignatian-style prompts crafted
      by the LLM.

3.  **Sense-Making (Bridge)**

    - After Experience, the app synthesizes what’s surfaced—summarizing
      or visualizing the connections and gaps found.

    - The LLM offers interpretations, identifies intriguing linkages,
      and invites users to reflect: “Here’s what’s resonating: these
      skills, these experiences, these gaps.”

    - Interactive follow-up: app asks “Which of these connections feels
      most significant or surprising to you?” Students are prompted to
      indicate, annotate, or voice-record their initial reactions.

    - This concrete feedback sets the stage for deeper
      meaning-making—moving from “what happened” to “why it matters.”

4.  **Reflection**

    - The agent now shifts into the heart of the Ignatian process, using
      LLM-powered questions to prompt the student to grapple with
      meaning, purpose, and interpersonal connection.

    - Prompts probe: “How does this role align with your deeper values
      or mission?” “How might this job let you serve others?” “What
      tensions or opportunities does this raise?”

    - LLM adapts reflections based on user inputs from sense-making,
      dynamically customizing follow-up for authenticity and depth.

    - App strongly encourages voice input for richer, more narrative
      reflection.

5.  **Action**

    - Armed with all this, the LLM crafts a tangible, hands-on portfolio
      project plan or artifact.

    - Project is directly mapped to both employer’s actual needs and the
      student’s personal/interpersonal narrative as established earlier,
      making it an authentic extension of both.

    - Clear, actionable steps are displayed for student follow-through
      and later interview discussion.

6.  **Evaluation**

    - App (with optional faculty input) prompts students to review their
      completed project and reflect on learning, growth, and next steps.

    - Includes a guided self-assessment and mock interview feature: LLM
      generates custom interview questions informed by job, company, and
      the artifacts/experience history the student built up—reinforcing
      reflection and building readiness.

### Additional Functional Requirements

- **Comprehensive Resume and Job Description Parsing**

  - LLM parses, extracts, and organizes both documents.

  - All prompts and project plans dynamically adapt based on contents
    (no generic templates).

- **Automated Contextual Research**

  - LLM brings in live research on company, industry, and job to enrich
    all subsequent prompts and project generation.

- **Google Authentication**

  - All user accounts are managed by secure Google OAuth2 sign-in.

- **Portfolio Artifact Export**

  - Enables PDF and/or web export of project plans and reflection
    records.

- **Project Tracking Dashboard**

  - Tracks user’s progress through IPP stages, project status, and
    reflection history.

- **Analytics and Feedback**

  - Capture engagement, completion rates, prompt effectiveness, and
    user-perceived usefulness.

------------------------------------------------------------------------

## User Experience

### Entry Point & Onboarding

- Users land and authenticate quickly via Google sign-in.

- Onboarding clearly presents the IPP: “five-stage cycle built for head,
  heart, and hands,” and the role of the LLM in enriching every phase
  with high-context adaptation.

- Short explanation sets up why users provide both resume and job
  description, and how stepwise engagement advances them from “just
  another applicant” to reflective, confidence-filled candidate.

### Core Journey through the IPP

1.  **Context**

    - Upload job description and resume.

    - Complete a background profile (major, interests, recent
      experiences, motivations).

    - LLM parses all inputs and pulls additional insights from external
      sources—results shared as part of setup.

2.  **Experience**

    - UI visualizes overlaps and distinctive elements between student’s
      resume, background, and job/industry info.

    - Students review these, then engage in voice or text input to
      select, elaborate on, or narrate standout experiences.

    - LLM-powered Ignatian-style prompts draw out not just what they’ve
      done, but what they remember or feel most strongly about these
      experiences.

3.  **Sense-Making (Bridge)**

    - App recaps: “Here’s what we’re seeing—your strengths, your gaps,
      your unique angles.”

    - LLM proposes potential narratives, asks users to zone in on
      connections that surprise or inspire them.

    - Interactive elements: click, annotate, or voice-record what stands
      out and why.

4.  **Reflection**

    - Deep-dive prompts appear, tailored to user selections and the
      LLM’s dynamic understanding of job/industry/company/candidate fit.

    - Prompts focus on meaning, value alignment, vocational motivations,
      and authentic “head-heart” resonance with the opportunity.

    - Students respond with speech or text, driving at the “so what?”
      behind their preparation.

5.  **Action**

    - LLM synthesizes everything into a customized, values-driven
      portfolio project plan or artifact.

    - Projects are practical, prominent, and connect explicitly both to
      employer needs and to the student’s lived narrative.

6.  **Evaluation**

    - App (with option for faculty co-pilot) directs a structured
      review:

      - Did the project demonstrate real skill and growth?

      - What challenges remain?

      - LLM guides a mock interview that leverages both original job
        description and student’s narrative history for high-fidelity
        practice.

    - Reflective records saved to dashboard for later review and future
      cycles.

### Key UI Elements

- IPP journey mapped visually at the top of every page: user always
  knows which stage they’re in.

- Voice-to-text always available for richer input.

- LLM-generated summaries and insights displayed throughout.

- Editable, transparent “LLM research notes” sidebar so students see
  what external info is being considered.

- Secure Google sign-in & quick-access dashboard.

------------------------------------------------------------------------

## Narrative

Maya, a sophomore in LMU’s College of Business Administration, is
considering a summer internship for which she isn’t sure she’s
qualified. She’s new to the company and its sector, but wants to make
her application stand out.

Instead of going it alone, Maya signs in with her LMU Google account and
uploads both her carefully researched job posting and her resume.
Instantly, the app—powered by a cutting-edge LLM—brings together the
real needs of this employer, deep background about the industry, and
Maya’s own journey at LMU. It asks Maya a bit more about her interests,
recent projects, and what drew her to the opportunity.

The LLM highlights alignments between the job’s demands and Maya’s
achievements—then invites her to select, elaborate, or voice-narrate
moments that mattered most. She picks her marketing internship and a
finance competition, explaining what she learned and how she felt at
each.

Now, the app offers a moment of sense-making: “Here are unique strengths
and gaps we see—what surprises you? What feels most meaningful as you
consider this role?” Maya draws connections she hadn’t seen before.

Powerful, Ignatian-inspired prompts then drive her to examine her
motivations and aspirations: “How does this role help you serve others?
Where do your own goals and this company’s mission align—or perhaps,
create tension?” Maya responds in detail, speaking from the heart.

Based on this, the LLM crafts a tailor-made project plan—a portfolio
piece directly relevant to the job, but also rich with Maya’s personal
story. She exports her plan, practices interview responses the app
generates, and heads into her interview brimming with confidence.

------------------------------------------------------------------------

## Success Metrics

### User-Centric Metrics

- Number of unique student users completing at least one project plan.

- Number of students reporting increased confidence in interviews.

- Number of project artifacts mentioned in job applications or
  interviews (captured via student survey).

- Change in students’ self-reported sense of wholeness/integration
  (pre/post-app surveys).

### Business Metrics

- Career placement rates for app users versus LMU average.

- Aggregate student engagement (sessions, repeat usage).

- Faculty/researcher adoption for curricular support.

### Technical Metrics

- Percentage of successful LLM API calls.

- LLM-generated prompt relevance/engagement scores (via user feedback).

- Monthly active users (MAU).

- System uptime \>99% during pilot.

### Tracking Plan

- Google-authenticated logins/registrations.

- Job listing/resume uploads and successful LLM analysis.

- Number and quality of AI-generated project plans.

- Reflection prompts completed.

- Project artifacts exported.

- User feedback on LLM-driven prompt value and perceived “real-world
  fit.”

- Student survey completions (confidence, wholeness, job outcome).

------------------------------------------------------------------------

## Technical Considerations

### Technical Needs

- Job and resume parsing using secure API calls to a leading LLM.

- LLM-driven project plan and prompt generation via external API.

- Web UI/UX (likely React or similar; lightweight, rapid development).

- Backend in Python (API orchestration, security, logic).

- PostgreSQL for persistent user/project/reflection data.

- Basic analytics setup.

- Integration with Google sign-in (OAuth2) for streamlined, secure
  onboarding.

### Integration Points

- Google sign-in (OAuth2) for account creation and session management.

- LLM integration (via paid API and/or open source models as available).

- Resume and job parsing leveraging LLM’s NLP strengths.

- Export (PDF/Web) for project artifacts.

- LMS integration considered post-MVP.

### Data Storage & Privacy

- Secure student data storage in AWS/hosted environment.

- Compliance with LMU data/privacy policies and all regulations (FERPA).

- No resume or job data leaves the secure backend except for LLM API
  calls; all research anonymized as needed.

- IRB approval pursued for any research publication using student data.

### Scalability & Performance

- Designed for rapid onboarding and minimal delay due to Google
  authentication and LLM API responsiveness.

- System built for pilot cohort with easy extensibility.

- Caching and rate-limiting on LLM queries to control costs and latency.

### Potential Challenges

- Handling LLM errors, downtime, or API quota limits without degrading
  user experience.

- LLM accuracy and cultural fit for Ignatian prompts.

- Ensuring Google sign-in is compatible across all LMU user types.

- Building trust in AI-generated recommendations.

------------------------------------------------------------------------

## Milestones & Sequencing

### Project Estimate

- Small Team: 2 weeks (targeted MVP pilot).

### Team Size & Composition

- 1 Developer (full-stack; Python/NLP/backend & basic frontend)

- 2 Researchers (user testing, outcome tracking, Ignatian content)

- Product lead/mentor: ad hoc (project oversight, content input)

### Suggested Phases

1.  **Requirements & Design (2–3 days)**

    - Finalize Google sign-in and LLM integration spec.

    - Wireframes (Dev/Researchers).

    - Ignatian content reviewed for AI fit (Researchers).

2.  **Core Build & Integration (8–9 days)**

    - End-to-end MVP: secure authentication, full LLM-driven workflow,
      dashboard, PDF export.

3.  **User Testing & Data Capture (2 days)**

    - Real pilot flow, focus on LLM prompt/test effectiveness.

4.  **Analysis & Iteration (1–2 days)**

    - Usage, outcome review; tune LLM prompt strategies, UI edits.

5.  **Report & Next Steps (1 day)**

    - Pilot summary/report; recommendations for scaling and expanded LLM
      capabilities.

------------------------------------------------------------------------
