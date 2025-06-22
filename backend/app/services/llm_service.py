import openai
import logging
import json
import re
from typing import Dict, Any, Optional, List
from sqlalchemy.orm import Session

from config.settings import settings
from app.models.document import Document
from app.models.user import User

logger = logging.getLogger(__name__)

class LLMService:
    """
    Consolidated LLM Service with improved prompt engineering, few-shot learning,
    chain-of-thought reasoning, and adaptive personalization for the Ignatian
    Pedagogical Paradigm implementation.
    """
    
    def __init__(self):
        self.client = openai.OpenAI(api_key=settings.openai_api_key)
        self.model = "gpt-4o-mini"  # Using the latest efficient model
        self.prompt_version = "v2.1"
    
    def _get_system_prompt(self, user_context: Optional[Dict[str, Any]] = None) -> str:
        """Enhanced system prompt with user context and detailed Ignatian guidance"""
        
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

When asked to provide JSON output, always return valid JSON without any additional text, markdown formatting, or code blocks."""

        if user_context:
            user_details = f"""

STUDENT CONTEXT:
- Academic Level: {user_context.get('academic_level', 'undergraduate')}
- Major/Field: {user_context.get('major', 'business or related field')}
- Career Stage: {user_context.get('career_stage', 'early career exploration')}
- Personal Interests: {user_context.get('interests', 'developing professional identity')}
- Values Priority: {user_context.get('values_focus', 'authentic career alignment')}

Tailor your responses to this student's specific context and developmental stage."""
            base_prompt += user_details

        return base_prompt
    
    async def analyze_resume(self, resume_text: str, user_context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Analyze resume and extract key information with Ignatian pedagogical focus"""
        
        prompt = f"""TASK: Analyze the following resume using chain-of-thought reasoning and the Ignatian principle of understanding CONTEXT.

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
    "analysis_version": "{self.prompt_version}",
    "confidence_score": 0.85,
    "analysis_timestamp": "timestamp"
  }},
  "personal_info": {{
    "name": "extracted or 'Not provided'",
    "contact_details": "summary of available contact info",
    "location": "city/state if mentioned"
  }},
  "skills": {{
    "technical": ["list of technical skills"],
    "soft": ["list of soft skills with evidence"]
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
  "experience": [
    {{
      "role": "position title",
      "organization": "company name",
      "duration": "time period",
      "key_achievements": ["achievement 1", "achievement 2"],
      "service_impact": "how this role served others or created value",
      "transferable_skills": ["skill that transfers to other roles"],
      "growth_indicators": "what this shows about their development"
    }}
  ],
  "education": {{
    "degree": "degree type and field",
    "institution": "school name",
    "achievements": ["relevant achievements"],
    "extracurricular": ["activities showing character/values"]
  }},
  "projects": [
    {{
      "title": "project name",
      "description": "what they accomplished",
      "impact": "value created or problem solved",
      "skills_demonstrated": ["technical and soft skills shown"]
    }}
  ],
  "strengths": [
    {{
      "strength": "key strength",
      "evidence": "specific example",
      "workplace_value": "how this benefits employers"
    }}
  ],
  "career_level": "entry-level/mid-level/senior/executive",
  "industries": ["relevant industries/domains"],
  "character_strengths": [
    {{
      "strength": "identified character trait",
      "evidence": "specific examples",
      "ignatian_dimension": "service/excellence/growth/collaboration",
      "potential_in_workplace": "how this would benefit employers"
    }}
  ],
  "values_indicators": {{
    "service_orientation": ["examples of serving others/community"],
    "collaboration": ["evidence of teamwork"],
    "continuous_learning": ["examples of seeking growth"],
    "excellence_pursuit": ["evidence of striving for quality"],
    "cultural_awareness": ["signs of global/diverse perspective"]
  }},
  "growth_mindset": {{
    "indicators": ["specific examples of learning from challenges"],
    "development_areas": ["areas they're actively improving"],
    "readiness_for_growth": "assessment of openness to new challenges"
  }},
  "career_trajectory": {{
    "current_level": "entry-level/emerging professional/experienced",
    "progression_pattern": "description of how they've grown",
    "readiness_indicators": "signs of preparation for next level",
    "growth_areas": ["areas for continued development"]
  }},
  "recommended_next_steps": [
    "specific suggestion for their development",
    "area to explore further",
    "opportunity to pursue"
  ]
}}

NOW ANALYZE THIS RESUME:
{resume_text}

Apply the reasoning process step-by-step, then provide the complete JSON analysis following the schema above.
Focus on understanding this person's unique journey and how their experiences reflect values of service, growth, and authentic development.
Return ONLY valid JSON without any markdown formatting or additional text.
"""
        
        # Log that we're using the enhanced Ignatian prompt
        logger.info("Using enhanced Ignatian resume analysis prompt with chain-of-thought reasoning")
        logger.debug(f"Prompt includes: character_strengths, values_indicators, growth_mindset fields")
        
        try:
            response = await self._call_openai(prompt, user_context)
            result = self._parse_json_response(response)
            
            # Ensure backward compatibility by maintaining old structure
            if "technical_skills" in result and "skills" not in result:
                result["skills"] = {
                    "technical": [skill["skill"] for skill in result.get("technical_skills", [])],
                    "soft": [skill["skill"] for skill in result.get("soft_skills", [])]
                }
            
            # Log what fields were returned
            logger.info(f"Resume analysis returned fields: {list(result.keys())}")
            if 'character_strengths' in result:
                logger.info(f"Character strengths found: {len(result.get('character_strengths', []))}")
            if 'values_indicators' in result:
                logger.info(f"Values indicators found: {result.get('values_indicators', {}).keys()}")
            
            return result
        except Exception as e:
            logger.error(f"Error analyzing resume: {str(e)}")
            return self._create_error_response("resume analysis", str(e))
    
    async def analyze_job_description(self, job_text: str, user_context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Analyze job description and extract key requirements with enhanced cultural values extraction"""
        
        prompt = f"""TASK: Analyze this job description using Ignatian principles to understand what the employer truly values and how the role serves the common good.

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
    "analysis_version": "{self.prompt_version}",
    "confidence_score": 0.90,
    "analysis_timestamp": "timestamp"
  }},
  "job_title": "The position title",
  "company": "Company name if mentioned",
  "role_overview": {{
    "department": "department/team if mentioned",
    "location": "work location details",
    "employment_type": "full-time/part-time/contract/etc"
  }},
  "required_skills": ["Essential technical and soft skills required"],
  "preferred_skills": ["Nice-to-have skills mentioned"],
  "technical_requirements": {{
    "required_skills": [
      {{
        "skill": "specific skill name",
        "importance": "critical/important/preferred",
        "proficiency_level": "expected level",
        "application_context": "how this skill is used in the role"
      }}
    ],
    "tools_technologies": ["specific tools, software, platforms mentioned"]
  }},
  "responsibilities": ["Key job responsibilities and duties"],
  "qualifications": ["Education and experience requirements"],
  "job_level": "Estimated level (entry-level, mid-level, senior, executive)",
  "industry": "Industry or domain",
  "key_requirements": ["Top 5 most important requirements for this role"],
  "company_values": ["Any company values or culture mentions"],
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
  "growth_opportunities": {{
    "career_progression": "advancement possibilities mentioned",
    "skill_development": "learning opportunities described",
    "mentorship": "mentoring or coaching availability",
    "cross_functional": "opportunities to work across departments"
  }},
  "ignatian_alignment_assessment": {{
    "service_to_others": "how this role serves the common good",
    "personal_growth": "opportunities for holistic development",
    "values_integration": "potential for authentic values expression",
    "discernment_factors": "key considerations for thoughtful decision-making"
  }}
}}

Job description text:
{job_text}

Follow the step-by-step reasoning process, then provide the complete JSON analysis.
Focus on understanding not just what skills they want, but what kind of person and values they're seeking, and how this role could serve the common good.
Return ONLY valid JSON without any markdown formatting or additional text.
"""
        
        try:
            response = await self._call_openai(prompt, user_context)
            result = self._parse_json_response(response)
            
            # Ensure backward compatibility
            if "metadata" in result:
                # Remove metadata for backward compatibility if needed
                pass
            
            return result
        except Exception as e:
            logger.error(f"Error analyzing job description: {str(e)}")
            return self._create_error_response("job description analysis", str(e))
    
    async def extract_detailed_evidence(self, resume_text: str, job_text: str) -> Dict[str, Any]:
        """Extract specific quotes and evidence from resume and job description"""
        
        prompt = """
        Extract EXACT QUOTES from the job description and resume to show evidence of matches and gaps.
        
        Job Description:
        {job_text}
        
        Resume:
        {resume_text}
        
        Provide a JSON response with this EXACT structure:
        {{
            "skill_alignment": {{
                "direct_matches": [
                    {{
                        "skill": "exact job requirement text in quotes",
                        "job_requirement_snippet": "exact quote from job description",
                        "candidate_evidence": [
                            "first exact quote from resume that shows this skill",
                            "second exact quote from resume that provides additional evidence (if available)"
                        ],
                        "connection_explanations": [
                            "brief explanation of why the first evidence demonstrates the requirement",
                            "brief explanation of why the second evidence demonstrates the requirement (if applicable)"
                        ],
                        "role_application": "how this applies to the role",
                        "confidence_score": 8,
                        "strength_level": "strong",
                        "source_reference": "Section from job description like 'Requirements', 'Responsibilities', 'What are we looking for?'"
                    }}
                ],
                "skill_gaps": [
                    {{
                        "missing_skill": "exact job requirement text in quotes",
                        "job_requirement_snippet": "exact quote from job description",
                        "importance": "critical/important/nice-to-have",
                        "learning_pathway": "suggested way to develop this",
                        "mitigation_strategy": "how to address this gap",
                        "portfolio_project_opportunity": "project idea to demonstrate this",
                        "source_reference": "Section from job description like 'Requirements', 'Responsibilities', 'What are we looking for?'"
                    }}
                ]
            }}
        }}
        
        IMPORTANT RULES:
        1. Use EXACT QUOTES from the documents - do not paraphrase or summarize
        2. For job_requirement_snippet, copy the exact text from the job description
        3. A requirement is a DIRECT MATCH only if you can find EXACT EVIDENCE in the resume
        4. If you cannot find direct evidence in the resume for a job requirement, it MUST go in skill_gaps, NOT direct_matches
        5. For direct_matches, the candidate_evidence field is now an ARRAY of 1-2 exact quotes from the resume
        6. For direct_matches, the connection_explanations field is an ARRAY that matches candidate_evidence
        7. Each connection explanation should be 1-2 sentences explaining why that specific evidence demonstrates the requirement
        8. If you have 2 pieces of evidence, you MUST have 2 connection explanations
        9. Try to find 2 different pieces of evidence from the resume for each requirement when possible
        10. Each evidence quote should be from a different section/experience in the resume
        11. Never put "— (no direct evidence)" in the direct_matches section - those belong in skill_gaps
        12. Include at least 3-5 direct matches (with real evidence) and 2-4 gaps
        13. Return ONLY the JSON object, no other text or formatting
        """
        
        try:
            response = await self._call_openai(
                prompt.format(
                    job_text=job_text,
                    resume_text=resume_text
                )
            )
            return self._parse_json_response(response)
        except Exception as e:
            logger.error(f"Error extracting detailed evidence: {str(e)}")
            return self._create_error_response("evidence extraction", str(e))
    
    async def find_connections(self, resume_analysis: Dict[str, Any], job_analysis: Dict[str, Any], user_context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Enhanced connections analysis using sophisticated matching algorithms"""
        
        prompt = f"""TASK: Using the Ignatian Pedagogical Paradigm, conduct a sophisticated analysis of connections between this candidate and role. Focus on authentic alignment, growth potential, and service opportunities.

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
    "analysis_version": "{self.prompt_version}",
    "confidence_score": 0.88,
    "matching_algorithm": "ignatian_holistic_v2"
  }},
  "skill_matches": [
    {{
      "skill": "matched skill",
      "confidence_score": 8.5,
      "evidence": "specific evidence from resume"
    }}
  ],
  "experience_connections": [
    {{
      "candidate_experience": "specific experience from their background",
      "role_relevance": "how this prepares them for job responsibilities",
      "transferable_lessons": "what they learned that applies",
      "storytelling_potential": "how to present this in interviews"
    }}
  ],
  "growth_opportunities": [
    {{
      "area": "skill or competency to develop",
      "current_level": "where they are now",
      "target_level": "where they need to be",
      "development_timeline": "realistic timeframe",
      "support_needed": "resources or mentoring required"
    }}
  ],
  "value_alignment": {{
    "shared_values": ["values that align between candidate and company"],
    "cultural_fit_indicators": ["specific evidence of cultural compatibility"],
    "service_orientation": "how their background shows commitment to serving others"
  }},
  "unique_strengths": ["What makes this candidate stand out for this role"],
  "development_areas": ["Skills or experiences the candidate should develop"],
  "portfolio_project_themes": [
    {{
      "theme": "project focus area",
      "skills_demonstrated": ["skills this would showcase"],
      "service_dimension": "how this project serves others",
      "feasibility_score": 8.5
    }}
  ],
  "ignatian_reflection_points": [
    {{
      "category": "values_alignment/service_to_others/personal_mission/growth_opportunities",
      "question": "thoughtful question for deeper reflection",
      "context": "why this question matters for their discernment"
    }}
  ],
  "overall_fit_score": 8.5,
  "next_steps_suggestions": [
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

Apply the Ignatian framework and sophisticated matching process to provide a comprehensive connections analysis.
Focus on authentic alignment, meaningful growth opportunities, and how this role could serve as a genuine calling in their career journey.
Return ONLY valid JSON without any markdown formatting or additional text.
"""
        
        try:
            response = await self._call_openai(prompt, user_context)
            return self._parse_json_response(response)
        except Exception as e:
            logger.error(f"Error finding connections: {str(e)}")
            return self._create_error_response("connections analysis", str(e))
    
    async def generate_context_summary(self, resume_analysis: Dict[str, Any], job_analysis: Dict[str, Any], connections: Dict[str, Any]) -> Dict[str, Any]:
        """Generate a structured summary for the Context stage completion"""
        
        company_name = job_analysis.get('company', 'the company')
        job_title = job_analysis.get('job_title', 'the role')
        
        prompt = """
        Create a structured analysis for the Context stage of the Ignatian Pedagogical Paradigm. 
        
        Resume Analysis: {resume_analysis}
        Job Analysis: {job_analysis}
        Connections: {connections}
        
        You MUST provide your response in valid JSON format with exactly these fields:
        {{
            "context_summary": "A 2-3 paragraph narrative summary that acknowledges their current strengths, highlights promising connections, and sets the stage for deeper exploration. Use an encouraging, reflective tone consistent with Ignatian pedagogy.",
            "role_fit_narrative": "A concise 2-3 sentence explanation of why this candidate makes sense for {job_title} at {company_name}. Focus on the key transferable experiences and skills that position them well.",
            "strengths": [
                "List 3-5 key job requirements that are clearly evident in the candidate's resume",
                "Each should be a specific skill, experience, or qualification that matches the job requirements",
                "Keep each point concise but specific"
            ],
            "gaps": [
                "List 2-4 job requirements that are not yet evident in the candidate's resume", 
                "These should be areas for growth or skills to develop",
                "Frame constructively as opportunities for development"
            ]
        }}
        
        IMPORTANT: Return ONLY the JSON object. Do not include any other text, markdown formatting, or code blocks.
        """
        
        try:
            response = await self._call_openai(
                prompt.format(
                    resume_analysis=resume_analysis,
                    job_analysis=job_analysis,
                    connections=connections,
                    job_title=job_title,
                    company_name=company_name
                )
            )
            
            # Parse the JSON response using the existing method
            result = self._parse_json_response(response)
            
            # Check if parsing was successful
            if "error" in result:
                logger.error(f"Error parsing context summary JSON: {result.get('error')}")
                logger.debug(f"Raw response: {result.get('raw_response', '')[:500]}...")  # Log first 500 chars
                
                # Try to extract the fields manually if JSON parsing failed
                return {
                    "context_summary": "Unable to generate complete context summary. Please try again.",
                    "role_fit_narrative": "",
                    "strengths": [],
                    "gaps": []
                }
            
            # Ensure all required fields exist with proper defaults
            return {
                "context_summary": result.get("context_summary", ""),
                "role_fit_narrative": result.get("role_fit_narrative", ""),
                "strengths": result.get("strengths", []),
                "gaps": result.get("gaps", [])
            }
                
        except Exception as e:
            logger.error(f"Error generating context summary: {str(e)}")
            return {
                "context_summary": "Unable to generate context summary at this time.",
                "role_fit_narrative": "",
                "strengths": [],
                "gaps": []
            }
    
    # Enhanced methods from enhanced_llm_service.py
    
    async def generate_reflection_synthesis(self, selected_experiences: List[Dict[str, Any]], connections_analysis: Dict[str, Any], user_context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Enhanced reflection synthesis using Ignatian discernment principles"""
        
        prompt = f"""TASK: Using Ignatian principles of discernment and reflection, synthesize the student's selected experiences into a compelling narrative that reveals deeper patterns, connections, and insights about their calling and purpose.

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

OUTPUT SCHEMA (JSON):
{{
  "metadata": {{
    "analysis_version": "{self.prompt_version}",
    "confidence_score": 0.92
  }},
  "narrative_summary": "2-3 paragraph compelling story that weaves together their experiences into a coherent narrative about who they are and what they're called to do",
  "core_patterns": [
    {{
      "pattern_name": "descriptive name for the pattern",
      "description": "what this pattern looks like across their experiences",
      "evidence": ["specific examples that demonstrate this pattern"],
      "significance": "why this pattern matters for their career and calling"
    }}
  ],
  "values_constellation": {{
    "primary_values": [
      {{
        "value": "core value name",
        "definition": "how they express this value",
        "evidence": ["specific examples showing this value in action"],
        "workplace_application": "how this value would show up in their career"
      }}
    ],
    "values_integration": "how their different values work together harmoniously"
  }},
  "unique_gifts_strengths": [
    {{
      "gift": "specific gift or strength",
      "description": "how this gift manifests",
      "impact_potential": "how this gift serves others",
      "cultivation_opportunities": "how they can further develop this gift"
    }}
  ],
  "service_orientation_analysis": {{
    "service_patterns": ["how they consistently serve others"],
    "service_motivation": "what drives their desire to serve",
    "service_growth_edge": "how their service could expand or deepen"
  }},
  "calling_purpose_indicators": {{
    "energy_sources": ["what consistently gives them life and energy"],
    "authenticity_markers": ["when they seem most genuinely themselves"],
    "impact_desires": ["the kind of difference they want to make"]
  }},
  "reflection_invitations": [
    {{
      "category": "values_alignment/service_calling/growth_edges/purpose_clarification",
      "invitation": "specific area for deeper reflection",
      "guiding_questions": ["questions to help them reflect"]
    }}
  ]
}}

SELECTED EXPERIENCES TO SYNTHESIZE:
{json.dumps(selected_experiences, indent=2)}

CONNECTIONS ANALYSIS CONTEXT:
{json.dumps(connections_analysis, indent=2)}

Provide a rich, nuanced synthesis that helps this student understand the deeper patterns and meaning in their journey.
Return ONLY valid JSON without any markdown formatting or additional text.
"""
        
        try:
            response = await self._call_openai(prompt, user_context)
            return self._parse_json_response(response)
        except Exception as e:
            logger.error(f"Error generating reflection synthesis: {str(e)}")
            return self._create_error_response("reflection synthesis", str(e))
    
    async def generate_ignatian_reflection_prompts(self, synthesis_analysis: Dict[str, Any], user_context: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        """Enhanced Ignatian reflection prompts based on synthesis insights"""
        
        prompt = f"""TASK: Generate personalized Ignatian reflection prompts based on this student's synthesis analysis. These prompts should invite deep contemplation, values clarification, and discernment about their calling and purpose.

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
      "contemplation_guidance": "suggestions for how to approach this reflection"
    }}
  ]
}}

SYNTHESIS ANALYSIS TO INFORM PROMPTS:
{json.dumps(synthesis_analysis, indent=2)}

Generate 8 total prompts (2 per category) that are deeply personalized to this student's unique journey, values, and calling indicators.
Return ONLY valid JSON without any markdown formatting or additional text.
"""
        
        try:
            response = await self._call_openai(prompt, user_context)
            result = self._parse_json_response(response)
            return result.get('prompts', [])
        except Exception as e:
            logger.error(f"Error generating reflection prompts: {str(e)}")
            return self._create_fallback_reflection_prompts()
    
    async def generate_portfolio_project(self, synthesis_analysis: Dict[str, Any], reflection_responses: Dict[str, str], user_context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Enhanced portfolio project generation based on complete Ignatian journey"""
        
        prompt = f"""TASK: Design a portfolio project that authentically integrates this student's technical capabilities, values, and calling based on their complete Ignatian journey of synthesis and reflection.

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

OUTPUT SCHEMA (JSON):
{{
  "metadata": {{
    "project_version": "{self.prompt_version}",
    "design_confidence": 0.91
  }},
  "project_overview": {{
    "title": "compelling project title",
    "tagline": "one-sentence description of the project's purpose",
    "overview": "2-3 paragraph description of what this project accomplishes",
    "unique_value_proposition": "what makes this project special and impactful",
    "calling_connection": "how this project expresses their unique calling"
  }},
  "objectives_outcomes": {{
    "primary_objectives": ["main goal 1", "main goal 2", "main goal 3"],
    "learning_objectives": ["skill/knowledge they'll develop"],
    "impact_objectives": ["difference this will make for others"],
    "career_objectives": ["how this advances their professional goals"]
  }},
  "technical_demonstration": {{
    "core_skills_showcased": [
      {{
        "skill": "technical skill demonstrated",
        "application": "how it's used in the project",
        "proficiency_level": "level they'll achieve"
      }}
    ],
    "technology_stack": ["specific tools, languages, platforms used"],
    "complexity_indicators": ["aspects that show technical sophistication"]
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
    "common_good_contribution": "how this serves the broader community"
  }},
  "implementation_roadmap": {{
    "phases": [
      {{
        "phase_name": "phase title",
        "duration": "time estimate",
        "key_activities": ["main tasks in this phase"],
        "deliverables": ["outputs produced in this phase"],
        "milestone_indicators": ["how to know this phase is complete"]
      }}
    ],
    "total_timeline": "overall project duration",
    "resource_requirements": ["tools, data, access, or support needed"]
  }},
  "deliverables_portfolio": [
    {{
      "deliverable_name": "specific output",
      "description": "what this deliverable includes",
      "skills_demonstrated": ["competencies this showcases"],
      "presentation_format": "how this will be presented"
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
        "key_points": ["main things to highlight"],
        "evidence": "specific examples to share"
      }}
    ],
    "values_integration_stories": [
      {{
        "scenario": "situation that demonstrates values",
        "decision_process": "how they chose their approach",
        "values_expression": "how their values guided them",
        "impact_story": "difference this made"
      }}
    ]
  }}
}}

INPUTS FOR PROJECT DESIGN:

SYNTHESIS ANALYSIS:
{json.dumps(synthesis_analysis, indent=2)}

REFLECTION RESPONSES:
{json.dumps(reflection_responses, indent=2)}

Design a portfolio project that feels like an authentic expression of this student's unique gifts, values, and calling while demonstrating professional competence and creating real value in the world.
Return ONLY valid JSON without any markdown formatting or additional text.
"""
        
        try:
            response = await self._call_openai(prompt, user_context)
            return self._parse_json_response(response)
        except Exception as e:
            logger.error(f"Error generating portfolio project: {str(e)}")
            return self._create_error_response("portfolio project generation", str(e))
    
    async def generate_interview_questions(self, project_plan: Dict[str, Any], connections_analysis: Dict[str, Any], user_context: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        """Enhanced interview question generation with sophisticated preparation guidance"""
        
        prompt = f"""TASK: Generate sophisticated interview questions tailored to this student's portfolio project and background, with detailed preparation guidance for authentic, values-driven responses.

INTERVIEW QUESTION FRAMEWORK:
- BEHAVIORAL: Past experiences that predict future performance
- TECHNICAL: Skills and problem-solving capabilities
- VALUES-BASED: Alignment with organizational culture and purpose
- PROJECT-SPECIFIC: Deep dive into their portfolio work
- GROWTH-ORIENTED: Learning mindset and development potential
- LEADERSHIP: Influence and collaboration capabilities

OUTPUT SCHEMA (JSON):
{{
  "questions": [
    {{
      "id": "unique identifier",
      "category": "behavioral/technical/values_based/project_specific/growth_oriented/leadership",
      "question": "the actual interview question",
      "context": "why interviewers ask this question",
      "competencies_assessed": ["specific skills or traits being evaluated"],
      "preparation_guidance": {{
        "story_framework": "which experiences to draw from",
        "key_points_to_highlight": ["main messages to communicate"],
        "evidence_to_include": ["specific examples or metrics to mention"],
        "values_integration": "how to authentically weave in their values",
        "technical_depth": "level of technical detail to include",
        "growth_demonstration": "how to show learning and development"
      }},
      "sample_response_structure": {{
        "opening": "how to start the response",
        "body": "main content to cover",
        "conclusion": "how to wrap up effectively"
      }},
      "follow_up_questions": ["likely follow-up questions they should be prepared for"],
      "authenticity_tips": ["how to be genuine and natural in their response"]
    }}
  ]
}}

PROJECT PLAN CONTEXT:
{json.dumps(project_plan, indent=2)}

CONNECTIONS ANALYSIS CONTEXT:
{json.dumps(connections_analysis, indent=2)}

Generate 8-10 interview questions across all categories that would be realistic for their target role.
Return ONLY valid JSON without any markdown formatting or additional text.
"""
        
        try:
            response = await self._call_openai(prompt, user_context)
            result = self._parse_json_response(response)
            return result.get('questions', [])
        except Exception as e:
            logger.error(f"Error generating interview questions: {str(e)}")
            return self._create_fallback_interview_questions()
    
    async def _call_openai(self, prompt: str, user_context: Optional[Dict[str, Any]] = None) -> str:
        """Enhanced OpenAI API call with user context and improved error handling"""
        try:
            system_prompt = self._get_system_prompt(user_context)
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=4000,
                presence_penalty=0.1,
                frequency_penalty=0.1
            )
            return response.choices[0].message.content
        except Exception as e:
            raise Exception(f"OpenAI API call failed: {str(e)}")
    
    def _parse_json_response(self, response: str) -> Dict[str, Any]:
        """Enhanced JSON parsing with better error handling and validation"""
        try:
            # Clean up the response
            response = response.strip()
            
            # Try direct JSON parsing first
            return json.loads(response)
        except json.JSONDecodeError:
            # Try to extract JSON from markdown code blocks
            json_patterns = [
                r'```json\s*(\{.*\})\s*```',
                r'```\s*(\{.*\})\s*```',
                r'(\{.*\})'
            ]
            
            for pattern in json_patterns:
                json_match = re.search(pattern, response, re.DOTALL)
                if json_match:
                    try:
                        return json.loads(json_match.group(1))
                    except json.JSONDecodeError:
                        continue
            
            # If all parsing fails, create structured error response
            return {
                "error": "Failed to parse LLM response as JSON",
                "raw_response": response,
                "parsing_attempts": len(json_patterns)
            }
    
    def _create_error_response(self, operation: str, error_details: str) -> Dict[str, Any]:
        """Create standardized error response structure"""
        return {
            "error": f"Failed to complete {operation}",
            "details": error_details,
            "service_version": self.prompt_version,
            "suggested_action": "Please try again or contact support if the issue persists"
        }
    
    def _create_fallback_reflection_prompts(self) -> List[Dict[str, Any]]:
        """Fallback reflection prompts if generation fails"""
        return [
            {
                "id": "fallback-values-1",
                "category": "values_alignment",
                "question": "Looking at the experiences that have energized you most, what deeper values do you see consistently guiding your choices?",
                "context": "The Ignatian tradition emphasizes understanding our deepest values and how they guide our decisions.",
                "follow_up": "How might these values help you discern which opportunities align with your authentic self?"
            },
            {
                "id": "fallback-service-1", 
                "category": "service_to_others",
                "question": "How do you sense this potential role allowing you to be 'a person for others' - contributing to something larger than yourself?",
                "context": "Ignatian spirituality calls us to consider how our work serves the broader human community.",
                "follow_up": "What specific aspects of this service feel most meaningful to you personally?"
            }
        ]
    
    def _create_fallback_interview_questions(self) -> List[Dict[str, Any]]:
        """Fallback interview questions if generation fails"""
        return [
            {
                "id": "fallback-behavioral-1",
                "category": "behavioral",
                "question": "Tell me about a time when you had to analyze complex information to solve a problem. How did you approach it?",
                "context": "This question assesses problem-solving methodology and analytical thinking.",
                "preparation_guidance": {
                    "story_framework": "Use your portfolio project or a significant academic/work experience",
                    "key_points_to_highlight": [
                        "Your systematic approach to analysis",
                        "How you handled complexity and ambiguity",
                        "The impact of your solution"
                    ]
                }
            }
        ]

# Global instance
llm_service = LLMService()