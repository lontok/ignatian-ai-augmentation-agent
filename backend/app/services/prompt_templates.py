"""
Enhanced Prompt Templates for Ignatian AI Augmentation Agent
============================================================

This module contains all LLM prompt templates with sophisticated prompt engineering
techniques including few-shot learning, chain-of-thought reasoning, and adaptive
personalization based on user context.

All prompts are designed around the Ignatian Pedagogical Paradigm (IPP) and 
incorporate the following principles:
- Context understanding and analysis
- Experience engagement and reflection  
- Values-based discernment and decision-making
- Action planning with authentic purpose alignment
- Evaluation and continued growth
"""

from typing import Dict, Any, Optional, List
import json

class PromptTemplates:
    """Enhanced prompt templates with Ignatian pedagogical integration"""
    
    PROMPT_VERSION = "v2.0"
    
    @staticmethod
    def get_enhanced_system_prompt(user_context: Optional[Dict[str, Any]] = None) -> str:
        """
        Enhanced system prompt with user context and detailed Ignatian guidance
        
        This is the foundational prompt that establishes the AI's role as an Ignatian
        educator and career counselor, setting the tone for all subsequent interactions.
        """
        
        base_prompt = """You are Dr. Elena Rodriguez, an expert career counselor and educator with 15 years of experience in the Ignatian Pedagogical Paradigm (IPP). You specialize in helping students discover authentic connections between their background and career aspirations.

IGNATIAN PEDAGOGICAL PARADIGM PRINCIPLES:
1. CONTEXT: Understanding the student's world, experiences, and current situation
2. EXPERIENCE: Engaging with data and insights in personally meaningful ways  
3. REFLECTION: Deep contemplation on meaning, values, and personal calling
4. ACTION: Translating insights into concrete, values-driven projects
5. EVALUATION: Assessing growth, learning, and readiness for next steps

YOUR APPROACH:
- Be encouraging yet realistic about growth opportunities
- Focus on authentic connections over superficial matches
- Integrate spiritual depth with practical career preparation
- Emphasize service to others and personal mission
- Use reflective questioning that promotes self-discovery
- Maintain a tone that is warm, wise, and growth-oriented

CORE IGNATIAN VALUES TO INTEGRATE:
- Cura Personalis (care for the whole person)
- Magis (excellence, the more, continuous improvement)
- Service to Others (working for the common good)
- Discernment (thoughtful decision-making guided by values)
- Formation (holistic development of mind, heart, and spirit)

RESPONSE QUALITY STANDARDS:
- Provide specific, actionable insights rather than generic advice
- Use concrete examples and evidence to support recommendations
- Maintain professional depth while being accessible
- Balance technical analysis with values integration
- Always connect insights back to the student's growth and calling"""

        if user_context:
            user_details = f"""

STUDENT CONTEXT:
- Academic Level: {user_context.get('academic_level', 'undergraduate')}
- Major/Field: {user_context.get('major', 'business or related field')}
- Career Stage: {user_context.get('career_stage', 'early career exploration')}
- Personal Interests: {user_context.get('interests', 'developing professional identity')}
- Values Priority: {user_context.get('values_focus', 'authentic career alignment')}
- Previous Experience: {user_context.get('experience_level', 'developing professional skills')}

Tailor your responses to this student's specific context and developmental stage. Use language and examples appropriate for their level while challenging them to grow."""
            base_prompt += user_details

        return base_prompt

    @staticmethod
    def get_resume_analysis_prompt(resume_text: str) -> str:
        """
        Enhanced resume analysis prompt with chain-of-thought reasoning and few-shot learning
        
        This prompt analyzes resumes through an Ignatian lens, looking beyond skills to 
        understand the person's journey, values, and potential for authentic career development.
        """
        
        return f"""TASK: Analyze the following resume using chain-of-thought reasoning and the Ignatian principle of understanding CONTEXT.

REASONING PROCESS:
1. First, read through the entire resume to understand the person's journey
2. Identify patterns in their experiences that reveal character and values
3. Extract technical competencies while noting how they serve others
4. Assess career trajectory and growth mindset indicators
5. Consider how their background connects to Ignatian values

EXAMPLE ANALYSIS (Few-Shot Learning):
For a resume showing: Marketing internship + Finance club + Volunteer tutoring + Spanish fluency

Step 1 - Journey Pattern: Shows progression from academic learning to practical application
Step 2 - Character Indicators: Chooses service activities alongside career development  
Step 3 - Technical Skills: Marketing analytics, financial modeling, bilingual communication
Step 4 - Growth Mindset: Seeks diverse experiences, takes on leadership roles
Step 5 - Ignatian Alignment: Service orientation through tutoring, cultural bridge-building

OUTPUT SCHEMA (JSON):
{{
  "metadata": {{
    "analysis_version": "{PromptTemplates.PROMPT_VERSION}",
    "confidence_score": 0.85,
    "analysis_timestamp": "2024-12-18T10:30:00Z"
  }},
  "personal_info": {{
    "name": "extracted or 'Not provided'",
    "contact_details": "summary of available contact info",
    "location": "city/state if mentioned"
  }},
  "technical_skills": [
    {{
      "skill": "skill name",
      "category": "technical/software/analytical/etc",
      "proficiency_level": "beginner/intermediate/advanced/expert",
      "evidence": "where this skill was demonstrated"
    }}
  ],
  "soft_skills": [
    {{
      "skill": "skill name", 
      "evidence": "specific example from resume",
      "ignatian_alignment": "how this connects to service/growth/collaboration"
    }}
  ],
  "experience_analysis": [
    {{
      "role": "position title",
      "organization": "company/org name",
      "duration": "time period",
      "key_achievements": ["achievement 1", "achievement 2"],
      "transferable_skills": ["skill that transfers to other roles"],
      "service_orientation": "how this role served others or common good",
      "growth_indicators": "what this shows about their development"
    }}
  ],
  "education": {{
    "degree": "degree type and field",
    "institution": "school name",
    "achievements": ["relevant academic achievements"],
    "extracurricular": ["activities showing character/values"]
  }},
  "projects_portfolio": [
    {{
      "title": "project name",
      "description": "what they accomplished",
      "skills_demonstrated": ["technical and soft skills shown"],
      "impact": "outcomes or value created"
    }}
  ],
  "character_strengths": [
    {{
      "strength": "key strength identified",
      "evidence": "specific examples supporting this",
      "potential_in_workplace": "how this would benefit employers",
      "ignatian_dimension": "connection to Ignatian values"
    }}
  ],
  "career_trajectory": {{
    "current_level": "entry-level/emerging professional/experienced",
    "progression_pattern": "description of how they've grown",
    "readiness_indicators": "signs of preparation for next level",
    "growth_areas": ["areas for continued development"]
  }},
  "values_indicators": {{
    "service_to_others": ["examples of serving others/community"],
    "collaboration": ["evidence of teamwork and bringing out best in others"],
    "continuous_learning": ["examples of seeking growth and development"],
    "excellence_pursuit": ["evidence of striving for quality and improvement"],
    "cultural_awareness": ["signs of global/diverse perspective"]
  }},
  "industry_experience": ["industries/sectors where they have experience"],
  "recommended_next_steps": [
    "specific suggestion for their development",
    "area to explore further",
    "opportunity to pursue"
  ]
}}

NOW ANALYZE THIS RESUME:
{resume_text}

Apply the reasoning process step-by-step, then provide the complete JSON analysis following the schema above. Focus on understanding this person's unique journey and how their experiences reflect Ignatian values of service, growth, and authentic development."""

    @staticmethod
    def get_job_analysis_prompt(job_text: str) -> str:
        """
        Enhanced job description analysis with cultural values extraction and service dimension assessment
        
        This prompt goes beyond surface requirements to understand the organization's values,
        growth opportunities, and potential for meaningful service through the role.
        """
        
        return f"""TASK: Analyze this job description using Ignatian principles to understand what the employer truly values and how the role serves the common good.

CHAIN-OF-THOUGHT PROCESS:
1. Identify explicit requirements (skills, experience, education)
2. Extract implicit values from language and priorities
3. Assess growth opportunities and development potential
4. Evaluate how this role serves others/creates positive impact
5. Consider cultural fit indicators and organizational values

EXAMPLE ANALYSIS (Few-Shot Learning):
For a job posting mentioning: "Collaborative data analyst...improving customer experience...diverse team...continuous learning environment"

Step 1 - Explicit: Python, SQL, 2+ years experience, Bachelor's degree
Step 2 - Implicit Values: Collaboration over individual achievement, customer focus, diversity commitment
Step 3 - Growth Potential: "continuous learning" suggests development opportunities
Step 4 - Service Dimension: "improving customer experience" = serving others through work
Step 5 - Cultural Fit: Team-oriented, learning-focused, inclusive environment

OUTPUT SCHEMA (JSON):
{{
  "metadata": {{
    "analysis_version": "{PromptTemplates.PROMPT_VERSION}",
    "confidence_score": 0.90,
    "analysis_timestamp": "2024-12-18T10:30:00Z"
  }},
  "role_overview": {{
    "job_title": "exact title from posting",
    "company": "company name if provided",
    "department": "department/team if mentioned",
    "location": "work location details",
    "employment_type": "full-time/part-time/contract/etc"
  }},
  "technical_requirements": {{
    "required_skills": [
      {{
        "skill": "specific skill name",
        "importance": "critical/important/preferred",
        "proficiency_level": "expected level",
        "application_context": "how this skill is used in the role"
      }}
    ],
    "preferred_skills": [
      {{
        "skill": "nice-to-have skill",
        "value_add": "how this enhances performance",
        "growth_opportunity": "potential to develop this skill"
      }}
    ],
    "tools_technologies": ["specific tools, software, platforms mentioned"]
  }},
  "experience_requirements": {{
    "years_required": "minimum experience needed",
    "industry_experience": "specific industry background needed",
    "role_types": ["types of previous roles that would prepare someone"],
    "leadership_level": "individual contributor/team lead/manager",
    "project_experience": ["types of projects they expect experience with"]
  }},
  "education_requirements": {{
    "degree_level": "required education level",
    "preferred_fields": ["relevant majors or fields of study"],
    "certifications": ["professional certifications mentioned"],
    "alternative_qualifications": "equivalent experience considerations"
  }},
  "key_responsibilities": [
    {{
      "responsibility": "main duty or responsibility",
      "skills_required": ["skills needed for this responsibility"],
      "impact_scope": "who benefits from this work",
      "growth_potential": "how this responsibility could lead to development"
    }}
  ],
  "organizational_culture": {{
    "stated_values": ["explicitly mentioned company values"],
    "cultural_indicators": [
      {{
        "indicator": "cultural clue from language",
        "interpretation": "what this suggests about workplace culture",
        "ignatian_alignment": "how this connects to Ignatian values"
      }}
    ],
    "collaboration_style": "individual/team-based/cross-functional",
    "learning_environment": "description of growth and development opportunities",
    "service_orientation": "how the role/company serves others or common good"
  }},
  "success_indicators": [
    {{
      "metric": "how success is measured",
      "timeline": "expected timeframe for achievement",
      "support_provided": "resources or support mentioned"
    }}
  ],
  "growth_opportunities": {{
    "career_progression": "advancement possibilities mentioned",
    "skill_development": "learning opportunities described",
    "mentorship": "mentoring or coaching availability",
    "cross_functional": "opportunities to work across departments"
  }},
  "compensation_benefits": {{
    "salary_range": "if mentioned",
    "benefits_overview": ["benefits and perks listed"],
    "work_life_balance": "indicators of work-life integration",
    "values_alignment_benefits": "benefits that reflect organizational values"
  }},
  "ideal_candidate_profile": {{
    "personality_traits": ["personality characteristics suggested"],
    "working_style": "preferred approach to work",
    "values_alignment": ["values the candidate should share"],
    "long_term_potential": "what they're looking for in terms of growth"
  }},
  "red_flags_considerations": [
    "potential concerns or areas that need clarification"
  ],
  "ignatian_alignment_assessment": {{
    "service_to_others": "how this role serves the common good",
    "personal_growth": "opportunities for holistic development",
    "values_integration": "potential for authentic values expression",
    "discernment_factors": "key considerations for thoughtful decision-making"
  }}
}}

NOW ANALYZE THIS JOB DESCRIPTION:
{job_text}

Follow the step-by-step reasoning process, then provide the complete JSON analysis. Focus on understanding not just what skills they want, but what kind of person and values they're seeking, and how this role could serve the common good."""

    @staticmethod
    def get_connections_analysis_prompt(resume_analysis: Dict[str, Any], job_analysis: Dict[str, Any]) -> str:
        """
        Enhanced connections analysis using sophisticated matching algorithms and Ignatian discernment
        
        This prompt performs deep analysis of alignment between candidate and role, going beyond
        surface matches to explore authentic fit, growth potential, and service opportunities.
        """
        
        return f"""TASK: Using the Ignatian Pedagogical Paradigm, conduct a sophisticated analysis of connections between this candidate and role. Focus on authentic alignment, growth potential, and service opportunities.

IGNATIAN ANALYSIS FRAMEWORK:
1. CONTEXT ASSESSMENT: How well does their background prepare them for this environment?
2. EXPERIENCE CONNECTIONS: What experiences translate most powerfully to this role?
3. REFLECTION OPPORTUNITIES: What deeper questions should they explore about fit and calling?
4. ACTION POTENTIAL: What specific projects would demonstrate their value and growth?
5. EVALUATION CRITERIA: How can they assess success and continued development?

SOPHISTICATED MATCHING PROCESS:
- Direct Skill Alignment (exact matches with high confidence)
- Transferable Skill Bridges (skills that adapt to new context)
- Values Resonance (deeper alignment beyond technical capabilities)
- Growth Trajectory Fit (how this role advances their development)
- Service Integration (how their unique gifts serve others in this context)

EXAMPLE CONNECTIONS ANALYSIS (Few-Shot Learning):
Candidate: Marketing intern + volunteer tutor + bilingual + finance coursework
Role: Customer Success Analyst at diverse tech company

Direct Skills: Data analysis (marketing internship → customer analytics)
Transferable: Teaching ability (tutoring → customer training/support)
Values Resonance: Service orientation + diversity appreciation align with company culture
Growth Trajectory: Role offers pathway to customer experience leadership
Service Integration: Helps underrepresented customers succeed with technology

OUTPUT SCHEMA (JSON):
{{
  "metadata": {{
    "analysis_version": "{PromptTemplates.PROMPT_VERSION}",
    "confidence_score": 0.88,
    "analysis_timestamp": "2024-12-18T10:30:00Z",
    "matching_algorithm": "ignatian_holistic_v2"
  }},
  "executive_summary": {{
    "overall_fit_score": 8.5,
    "fit_rationale": "2-3 sentence explanation of overall alignment",
    "unique_value_proposition": "what makes this candidate special for this role",
    "primary_growth_edge": "main area where they'll be stretched and developed"
  }},
  "skill_alignment": {{
    "direct_matches": [
      {{
        "skill": "specific skill name",
        "candidate_evidence": "where they demonstrated this",
        "role_application": "how it applies to the job",
        "confidence_score": 9.2,
        "strength_level": "strong/moderate/developing"
      }}
    ],
    "transferable_skills": [
      {{
        "candidate_skill": "skill they have",
        "role_requirement": "what the job needs",
        "transfer_pathway": "how one connects to the other",
        "development_needed": "what they'd need to learn/adapt",
        "confidence_score": 7.8,
        "timeline_to_proficiency": "3-6 months"
      }}
    ],
    "skill_gaps": [
      {{
        "missing_skill": "what they don't have yet",
        "importance": "critical/important/nice-to-have",
        "learning_pathway": "how they could develop this",
        "mitigation_strategy": "how to address this gap",
        "portfolio_project_opportunity": "how to demonstrate growth in this area"
      }}
    ]
  }},
  "experience_connections": [
    {{
      "candidate_experience": "specific experience from their background",
      "role_relevance": "how this prepares them for job responsibilities",
      "transferable_lessons": "what they learned that applies",
      "storytelling_potential": "how to present this in interviews",
      "depth_score": 8.0
    }}
  ],
  "values_cultural_alignment": {{
    "shared_values": [
      {{
        "value": "specific value",
        "candidate_evidence": "how they've demonstrated this",
        "company_evidence": "how the company expresses this",
        "alignment_strength": "strong/moderate/emerging",
        "interview_talking_point": "how to discuss this alignment"
      }}
    ],
    "cultural_fit_indicators": [
      "specific evidence of cultural compatibility"
    ],
    "potential_culture_contributions": [
      "unique perspectives or strengths they'd bring to the culture"
    ]
  }},
  "growth_development_analysis": {{
    "immediate_growth_areas": [
      {{
        "area": "skill or competency to develop",
        "current_level": "where they are now",
        "target_level": "where they need to be",
        "development_timeline": "realistic timeframe",
        "support_needed": "resources or mentoring required",
        "success_indicators": "how to measure progress"
      }}
    ],
    "long_term_trajectory": {{
      "6_month_goals": ["realistic 6-month development targets"],
      "1_year_potential": "where they could be in a year",
      "career_advancement": "how this role advances their career goals",
      "leadership_development": "leadership potential and development pathway"
    }}
  }},
  "service_impact_potential": {{
    "direct_service_opportunities": "how this role serves others",
    "unique_service_contributions": "special ways their background helps them serve",
    "community_impact": "broader impact beyond the immediate role",
    "values_integration": "how they can express their deepest values through this work"
  }},
  "portfolio_project_recommendations": [
    {{
      "project_theme": "overall project focus",
      "specific_deliverables": ["concrete outputs to create"],
      "skills_demonstrated": ["skills this would showcase"],
      "service_dimension": "how this project serves others",
      "differentiation_factor": "what makes this project unique",
      "feasibility_score": 8.5,
      "impact_potential": "high/medium/low"
    }}
  ],
  "ignatian_reflection_prompts": [
    {{
      "category": "values_alignment/service_to_others/personal_mission/growth_opportunities",
      "question": "thoughtful question for deeper reflection",
      "context": "why this question matters for their discernment",
      "follow_up": "additional question to deepen reflection"
    }}
  ],
  "interview_preparation": {{
    "storytelling_opportunities": [
      {{
        "story_theme": "overarching narrative thread",
        "specific_examples": ["concrete stories to tell"],
        "key_messages": ["main points to communicate"],
        "values_integration": "how to weave in their deeper purpose"
      }}
    ],
    "potential_concerns": [
      {{
        "concern": "what employers might worry about",
        "mitigation_strategy": "how to address this proactively",
        "strength_reframe": "how to position this as a positive"
      }}
    ]
  }},
  "decision_making_framework": {{
    "key_factors_to_explore": ["important considerations for their decision"],
    "questions_to_ask_employer": ["thoughtful questions for interviews"],
    "deal_breakers": ["potential red flags to watch for"],
    "growth_indicators": ["signs this would be a good growth opportunity"]
  }},
  "next_steps_recommendations": [
    {{
      "action": "specific next step to take",
      "timeline": "when to do this",
      "resources_needed": "what support or tools they need",
      "success_criteria": "how to know they've done this well"
    }}
  ]
}}

CANDIDATE ANALYSIS:
{json.dumps(resume_analysis, indent=2)}

ROLE ANALYSIS:  
{json.dumps(job_analysis, indent=2)}

Apply the Ignatian framework and sophisticated matching process to provide a comprehensive connections analysis. Focus on authentic alignment, meaningful growth opportunities, and how this role could serve as a genuine calling in their career journey."""

    @staticmethod
    def get_context_summary_prompt(resume_analysis: Dict[str, Any], job_analysis: Dict[str, Any], connections: Dict[str, Any]) -> str:
        """
        Enhanced context summary with personalized narrative arc and encouragement
        
        This prompt creates a compelling narrative that helps students understand their 
        current situation with clarity, hope, and excitement for growth.
        """
        
        return f"""TASK: Create a compelling narrative summary for the CONTEXT stage of this student's Ignatian journey. This summary should help them understand their current situation with clarity, hope, and excitement for growth.

IGNATIAN CONTEXT PRINCIPLES:
- Honor their unique journey and experiences
- Acknowledge both strengths and growth edges honestly
- Create excitement about potential and possibilities  
- Set the foundation for meaningful reflection and action
- Use encouraging, wisdom-filled tone that builds confidence

NARRATIVE ARC STRUCTURE:
1. RECOGNITION: "Here's what we see in your journey so far..."
2. CONNECTION: "Here's how your experiences connect to this opportunity..."
3. POTENTIAL: "Here's the exciting growth possible for you..."
4. INVITATION: "Here's what we'll explore together in the next stage..."

EXAMPLE NARRATIVE (Few-Shot Learning):
For a student with: Marketing internship + tutoring + finance coursework → Customer Success Analyst role

"Your journey tells a beautiful story of someone who naturally bridges analytical thinking with genuine care for others. Through your marketing internship, you've developed strong data analysis skills, but more importantly, you've learned how numbers can tell human stories. Your volunteer tutoring experience reveals something even deeper—you have a gift for meeting people where they are and helping them succeed, which is exactly what customer success requires.

What's particularly exciting is how your finance coursework has given you the business acumen to understand what customers truly need to achieve their goals. This combination of analytical capability, service orientation, and business insight creates a unique value proposition for the Customer Success Analyst role.

The growth edge here is beautiful too—this role would stretch your technical skills in new directions while allowing you to serve others in ways that align perfectly with your values. You'd be helping customers succeed with technology, which combines your analytical strengths with your natural gift for supporting others' growth.

In our next stage together, we'll explore which of your experiences resonate most deeply with you and how they connect to your sense of calling and purpose in this field."

YOUR INPUTS:
RESUME ANALYSIS: {json.dumps(resume_analysis, indent=2)}
JOB ANALYSIS: {json.dumps(job_analysis, indent=2)}  
CONNECTIONS: {json.dumps(connections, indent=2)}

Write a 3-4 paragraph narrative summary that follows the structure above. Use warm, encouraging language that helps the student see both their current strengths and exciting growth potential. Focus on authentic connections rather than superficial matches, and help them feel both confident and excited about the journey ahead."""

    @staticmethod
    def get_reflection_synthesis_prompt(selected_experiences: List[Dict[str, Any]], connections_analysis: Dict[str, Any]) -> str:
        """
        Enhanced reflection synthesis using Ignatian discernment principles
        
        This prompt synthesizes the student's selected experiences into a compelling narrative
        that reveals deeper patterns, connections, and insights about their calling and purpose.
        """
        
        return f"""TASK: Using Ignatian principles of discernment and reflection, synthesize the student's selected experiences into a compelling narrative that reveals deeper patterns, connections, and insights about their calling and purpose.

IGNATIAN SYNTHESIS FRAMEWORK:
1. PATTERN RECOGNITION: What consistent themes emerge across their choices?
2. VALUES IDENTIFICATION: What deeper values are reflected in what energizes them?
3. GIFTS DISCOVERY: What unique gifts and strengths keep appearing?
4. SERVICE ORIENTATION: How do their experiences show a heart for serving others?
5. GROWTH TRAJECTORY: What does their journey reveal about how they develop and learn?
6. CALLING INDICATORS: What clues point toward their deeper purpose and mission?

DISCERNMENT QUESTIONS TO EXPLORE:
- What experiences bring them life and energy vs. drain them?
- When do they feel most authentically themselves?
- How do they naturally contribute to the common good?
- What patterns of growth and development do they show?
- How do their technical skills serve their deeper values?

EXAMPLE SYNTHESIS (Few-Shot Learning):
Selected Experiences: Marketing analytics project + Peer tutoring + Cross-cultural volunteering
Pattern: Consistently chooses opportunities that combine analytical work with human connection
Values: Justice, service, bridge-building between different communities
Gifts: Ability to make complex information accessible, cultural sensitivity, collaborative leadership
Service: Uses skills to amplify underrepresented voices and create inclusive environments
Growth: Seeks challenges that stretch both technical abilities and cultural competence
Calling Indicators: Drawn to work that serves justice and inclusion through analytical excellence

OUTPUT SCHEMA (JSON):
{{
  "metadata": {{
    "analysis_version": "{PromptTemplates.PROMPT_VERSION}",
    "confidence_score": 0.92,
    "synthesis_timestamp": "2024-12-18T10:30:00Z"
  }},
  "narrative_summary": "2-3 paragraph compelling story that weaves together their experiences into a coherent narrative about who they are and what they're called to do",
  "core_patterns": [
    {{
      "pattern_name": "descriptive name for the pattern",
      "description": "what this pattern looks like across their experiences",
      "evidence": ["specific examples that demonstrate this pattern"],
      "significance": "why this pattern matters for their career and calling",
      "strength_indicator": 0.9
    }}
  ],
  "values_constellation": {{
    "primary_values": [
      {{
        "value": "core value name",
        "definition": "how they express this value",
        "evidence": ["specific examples showing this value in action"],
        "workplace_application": "how this value would show up in their career",
        "growth_edge": "how this value invites them to grow"
      }}
    ],
    "values_integration": "how their different values work together harmoniously",
    "values_tensions": "any creative tensions between values that invite growth"
  }},
  "unique_gifts_strengths": [
    {{
      "gift": "specific gift or strength",
      "description": "how this gift manifests",
      "development_level": "emerging/developing/strong/exceptional",
      "impact_potential": "how this gift serves others",
      "cultivation_opportunities": "how they can further develop this gift"
    }}
  ],
  "service_orientation_analysis": {{
    "service_patterns": ["how they consistently serve others"],
    "service_motivation": "what drives their desire to serve",
    "service_gifts": ["particular ways they're gifted for service"],
    "service_growth_edge": "how their service could expand or deepen",
    "social_justice_connections": "how their work connects to justice and equity"
  }},
  "growth_development_insights": {{
    "learning_style_indicators": ["how they naturally learn and grow"],
    "challenge_preference": "types of challenges that energize vs. drain them",
    "support_needs": ["what kind of support helps them thrive"],
    "growth_trajectory": "the arc of development visible in their journey",
    "next_level_readiness": "signs they're ready for increased responsibility"
  }},
  "calling_purpose_indicators": {{
    "energy_sources": ["what consistently gives them life and energy"],
    "authenticity_markers": ["when they seem most genuinely themselves"],
    "impact_desires": ["the kind of difference they want to make"],
    "legacy_themes": ["what they seem to want to be remembered for"],
    "spiritual_dimensions": ["how their work connects to deeper meaning and purpose"]
  }},
  "integration_opportunities": {{
    "technical_heart_bridges": ["how they integrate technical skills with heart values"],
    "individual_community_balance": ["how they balance personal growth with service to others"],
    "present_future_connections": ["how their current experiences prepare them for their calling"],
    "workplace_values_alignment": ["opportunities to express their values through work"]
  }},
  "surprising_insights": [
    {{
      "insight": "unexpected discovery about them",
      "evidence": "what led to this insight",
      "implications": "what this means for their development",
      "exploration_invitation": "how they might explore this further"
    }}
  ],
  "reflection_invitations": [
    {{
      "category": "values_alignment/service_calling/growth_edges/purpose_clarification",
      "invitation": "specific area for deeper reflection",
      "guiding_questions": ["questions to help them reflect"],
      "contemplation_focus": "what to pay attention to in their reflection"
    }}
  ]
}}

SELECTED EXPERIENCES TO SYNTHESIZE:
{json.dumps(selected_experiences, indent=2)}

CONNECTIONS ANALYSIS CONTEXT:
{json.dumps(connections_analysis, indent=2)}

Provide a rich, nuanced synthesis that helps this student understand the deeper patterns and meaning in their journey. Focus on authentic discovery rather than what sounds good, and help them see how their experiences point toward their unique calling and contribution to the world."""

    @staticmethod
    def get_ignatian_reflection_prompts_template(synthesis_analysis: Dict[str, Any]) -> str:
        """
        Enhanced Ignatian reflection prompts based on synthesis insights
        
        This template generates personalized reflection prompts that invite deep contemplation,
        values clarification, and discernment about calling and purpose.
        """
        
        return f"""TASK: Generate personalized Ignatian reflection prompts based on this student's synthesis analysis. These prompts should invite deep contemplation, values clarification, and discernment about their calling and purpose.

IGNATIAN REFLECTION PRINCIPLES:
- Contemplation: Deep, unhurried reflection on meaning and purpose
- Discernment: Careful attention to what brings life vs. what drains energy
- Examen: Reflective review of experiences to find God's movement
- Magis: Exploring the "more" - how to give their greatest gift
- Service: Understanding how their gifts serve the common good
- Integration: Bringing together head, heart, and hands

PROMPT CATEGORIES (Generate 2 prompts per category):
1. VALUES_ALIGNMENT: Understanding core values and how they guide choices
2. SERVICE_TO_OTHERS: Exploring calling to serve the common good
3. PERSONAL_MISSION: Clarifying unique contribution and purpose
4. GROWTH_OPPORTUNITIES: Embracing areas for development and stretch

EXAMPLE PROMPTS (Few-Shot Learning):
For someone whose synthesis shows: Bridge-building between communities + analytical gifts + justice orientation

VALUES_ALIGNMENT: "As you reflect on the experiences where you felt most alive and authentic, what core values do you see consistently guiding your choices? How might these values help you discern which career opportunities align with your deepest truth?"

SERVICE_TO_OTHERS: "You have a beautiful gift for bridging different communities through your analytical work. How do you sense God or life calling you to use this gift to serve justice and healing in our world?"

PERSONAL_MISSION: "Looking at the pattern of choosing opportunities that advance both analytical excellence and social justice, what unique contribution do you sense you're called to make that others might not be positioned to offer?"

GROWTH_OPPORTUNITIES: "What tensions or challenges in your experiences might be inviting you to grow in new ways? How might embracing these growth edges actually serve your deeper mission more fully?"

OUTPUT SCHEMA (JSON):
{{
  "prompts": [
    {{
      "id": "unique identifier",
      "category": "values_alignment/service_to_others/personal_mission/growth_opportunities",
      "question": "primary reflection question tailored to their synthesis",
      "context": "Ignatian background/principle that informs this question",
      "personal_connection": "how this connects specifically to their experiences",
      "follow_up": "additional question to deepen the reflection",
      "contemplation_guidance": "suggestions for how to approach this reflection",
      "discernment_indicators": "what to pay attention to as they reflect"
    }}
  ]
}}

SYNTHESIS ANALYSIS TO INFORM PROMPTS:
{json.dumps(synthesis_analysis, indent=2)}

Generate 8 total prompts (2 per category) that are deeply personalized to this student's unique journey, values, and calling indicators. Each prompt should invite them into genuine contemplation and help them discern their authentic path forward."""

    @staticmethod
    def get_portfolio_project_template(synthesis_analysis: Dict[str, Any], reflection_responses: Dict[str, str]) -> str:
        """
        Enhanced portfolio project generation based on complete Ignatian journey
        
        This template designs portfolio projects that authentically integrate the student's
        technical capabilities, values, and calling based on their complete Ignatian journey.
        """
        
        return f"""TASK: Design a portfolio project that authentically integrates this student's technical capabilities, values, and calling based on their complete Ignatian journey of synthesis and reflection.

IGNATIAN PROJECT DESIGN PRINCIPLES:
- AUTHENTICITY: The project should feel like a genuine expression of who they are
- SERVICE: It should serve others and contribute to the common good
- EXCELLENCE: It should demonstrate technical competence and professional quality
- GROWTH: It should stretch them and invite continued development
- INTEGRATION: It should bring together their head, heart, and hands
- IMPACT: It should create real value in the world

PROJECT DESIGN FRAMEWORK:
1. CALLING ALIGNMENT: How does this project express their unique calling?
2. SKILL DEMONSTRATION: What technical skills does it showcase?
3. VALUES INTEGRATION: How does it advance their deepest values?
4. SERVICE DIMENSION: Who does it serve and how?
5. GROWTH OPPORTUNITY: How does it invite them to stretch and develop?
6. PORTFOLIO VALUE: How does it position them for their career goals?

EXAMPLE PROJECT (Few-Shot Learning):
Student Profile: Data analysis skills + justice values + bilingual abilities + education background
Synthesis Themes: Bridge-building, accessible communication, equity advancement
Reflection Insights: Called to use analysis to amplify underrepresented voices

PROJECT: "Educational Equity Analytics Dashboard"
- Technical: Data visualization, statistical analysis, web development
- Service: Helps school districts identify and address achievement gaps
- Values: Advances justice through evidence-based education improvement
- Growth: Develops public policy communication and stakeholder engagement skills
- Authenticity: Combines analytical gifts with passion for educational justice

OUTPUT SCHEMA (JSON):
{{
  "metadata": {{
    "project_version": "{PromptTemplates.PROMPT_VERSION}",
    "design_confidence": 0.91,
    "creation_timestamp": "2024-12-18T10:30:00Z"
  }},
  "project_overview": {{
    "title": "compelling project title",
    "tagline": "one-sentence description of the project's purpose",
    "overview": "2-3 paragraph description of what this project accomplishes",
    "unique_value_proposition": "what makes this project special and impactful",
    "calling_connection": "how this project expresses their unique calling"
  }},
  "objectives_outcomes": {{
    "primary_objectives": [
      "main goal 1",
      "main goal 2", 
      "main goal 3"
    ],
    "learning_objectives": [
      "skill/knowledge they'll develop",
      "area of growth they'll experience"
    ],
    "impact_objectives": [
      "difference this will make for others",
      "contribution to common good"
    ],
    "career_objectives": [
      "how this advances their professional goals",
      "positioning for future opportunities"
    ]
  }},
  "technical_demonstration": {{
    "core_skills_showcased": [
      {{
        "skill": "technical skill demonstrated",
        "application": "how it's used in the project",
        "proficiency_level": "level they'll achieve",
        "evidence_artifacts": "what outputs demonstrate this skill"
      }}
    ],
    "technology_stack": [
      "specific tools, languages, platforms used"
    ],
    "complexity_indicators": [
      "aspects that show technical sophistication"
    ],
    "innovation_elements": [
      "creative or novel approaches used"
    ]
  }},
  "values_service_integration": {{
    "values_expression": [
      {{
        "value": "core value",
        "manifestation": "how it's expressed in the project",
        "impact": "difference this makes"
      }}
    ],
    "service_dimensions": [
      {{
        "stakeholder_group": "who is served",
        "service_provided": "how they're helped",
        "impact_measurement": "how to measure the benefit"
      }}
    ],
    "social_justice_connections": [
      "how the project advances justice/equity"
    ],
    "common_good_contribution": "how this serves the broader community"
  }},
  "implementation_roadmap": {{
    "phases": [
      {{
        "phase_name": "phase title",
        "duration": "time estimate",
        "key_activities": [
          "main tasks in this phase"
        ],
        "deliverables": [
          "outputs produced in this phase"
        ],
        "skills_development": [
          "capabilities developed during this phase"
        ],
        "milestone_indicators": [
          "how to know this phase is complete"
        ]
      }}
    ],
    "total_timeline": "overall project duration",
    "resource_requirements": [
      "tools, data, access, or support needed"
    ],
    "risk_mitigation": [
      {{
        "risk": "potential challenge",
        "likelihood": "high/medium/low",
        "mitigation": "how to address or prevent this"
      }}
    ]
  }},
  "deliverables_portfolio": [
    {{
      "deliverable_name": "specific output",
      "description": "what this deliverable includes",
      "audience": "who this is for",
      "skills_demonstrated": [
        "competencies this showcases"
      ],
      "presentation_format": "how this will be presented",
      "professional_polish": "standards for quality and presentation"
    }}
  ],
  "interview_preparation": {{
    "storytelling_framework": {{
      "situation": "how to set up the project context",
      "task": "what challenge they were addressing",
      "action": "what they did and how they did it",
      "result": "what they accomplished and learned",
      "reflection": "what this means for their development and calling"
    }},
    "technical_talking_points": [
      {{
        "topic": "technical area to discuss",
        "key_points": [
          "main things to highlight"
        ],
        "evidence": "specific examples to share",
        "growth_demonstration": "how this shows their development"
      }}
    ],
    "values_integration_stories": [
      {{
        "scenario": "situation that demonstrates values",
        "decision_process": "how they chose their approach",
        "values_expression": "how their values guided them",
        "impact_story": "difference this made"
      }}
    ],
    "growth_reflection_points": [
      "insights about their development through the project"
    ]
  }},
  "future_development": {{
    "extension_opportunities": [
      "how this project could grow or expand"
    ],
    "skill_building_pathways": [
      "next skills to develop based on this foundation"
    ],
    "network_building": [
      "relationships this project could help them build"
    ],
    "career_positioning": [
      "how this positions them for next opportunities"
    ]
  }},
  "reflection_integration": {{
    "ongoing_reflection_prompts": [
      "questions to consider during the project"
    ],
    "values_check_ins": [
      "ways to ensure the project stays aligned with their values"
    ],
    "growth_monitoring": [
      "how to track their development through the project"
    ],
    "calling_discernment": [
      "how this project informs their understanding of their calling"
    ]
  }}
}}

INPUTS FOR PROJECT DESIGN:

SYNTHESIS ANALYSIS:
{json.dumps(synthesis_analysis, indent=2)}

REFLECTION RESPONSES:
{json.dumps(reflection_responses, indent=2)}

Design a portfolio project that feels like an authentic expression of this student's unique gifts, values, and calling while demonstrating professional competence and creating real value in the world. The project should feel both challenging and energizing, stretching their capabilities while aligning with their deeper purpose."""

    @staticmethod
    def get_interview_questions_template(project_plan: Dict[str, Any], connections_analysis: Dict[str, Any]) -> str:
        """
        Enhanced interview question generation with sophisticated preparation guidance
        
        This template generates interview questions tailored to the student's portfolio project
        and background, with detailed preparation guidance for authentic, values-driven responses.
        """
        
        return f"""TASK: Generate sophisticated interview questions tailored to this student's portfolio project and background, with detailed preparation guidance for authentic, values-driven responses.

INTERVIEW QUESTION FRAMEWORK:
- BEHAVIORAL: Past experiences that predict future performance
- TECHNICAL: Skills and problem-solving capabilities
- VALUES-BASED: Alignment with organizational culture and purpose
- PROJECT-SPECIFIC: Deep dive into their portfolio work
- GROWTH-ORIENTED: Learning mindset and development potential
- LEADERSHIP: Influence and collaboration capabilities

QUESTION DESIGN PRINCIPLES:
- Questions should be realistic for their target role level
- Include both common questions and unique angles
- Provide detailed guidance for authentic responses
- Connect their experiences to professional competencies
- Help them tell compelling stories that integrate values and skills

EXAMPLE QUESTION SET (Few-Shot Learning):
For a Customer Success Analyst candidate with educational equity project:

BEHAVIORAL: "Tell me about a time when you had to analyze complex data to solve a problem that affected multiple stakeholders. How did you approach it?"
Preparation Guidance: Use the educational equity project - discuss stakeholder mapping, data analysis methodology, communication of findings to different audiences

VALUES-BASED: "How do you ensure that your analytical work creates value not just for the business, but for the end users or customers?"
Preparation Guidance: Connect to justice values and commitment to serving underrepresented communities through equitable access to education

OUTPUT SCHEMA (JSON):
{{
  "questions": [
    {{
      "id": "unique identifier",
      "category": "behavioral/technical/values_based/project_specific/growth_oriented/leadership",
      "question": "the actual interview question",
      "context": "why interviewers ask this question",
      "competencies_assessed": [
        "specific skills or traits being evaluated"
      ],
      "preparation_guidance": {{
        "story_framework": "which experiences to draw from",
        "key_points_to_highlight": [
          "main messages to communicate"
        ],
        "evidence_to_include": [
          "specific examples or metrics to mention"
        ],
        "values_integration": "how to authentically weave in their values",
        "technical_depth": "level of technical detail to include",
        "growth_demonstration": "how to show learning and development"
      }},
      "sample_response_structure": {{
        "opening": "how to start the response",
        "body": "main content to cover",
        "conclusion": "how to wrap up effectively",
        "bridge_to_values": "natural way to connect to their purpose"
      }},
      "follow_up_questions": [
        "likely follow-up questions they should be prepared for"
      ],
      "red_flags_to_avoid": [
        "common mistakes or weak responses to this question"
      ],
      "authenticity_tips": [
        "how to be genuine and natural in their response"
      ]
    }}
  ]
}}

PROJECT PLAN CONTEXT:
{json.dumps(project_plan, indent=2)}

CONNECTIONS ANALYSIS CONTEXT:
{json.dumps(connections_analysis, indent=2)}

Generate 8-10 interview questions across all categories that would be realistic for their target role. Focus on questions that allow them to showcase both their technical competence and their values-driven approach to work. Provide detailed, practical guidance that helps them prepare authentic, compelling responses."""

# Example usage:
# templates = PromptTemplates()
# system_prompt = templates.get_enhanced_system_prompt(user_context)
# resume_prompt = templates.get_resume_analysis_prompt(resume_text)