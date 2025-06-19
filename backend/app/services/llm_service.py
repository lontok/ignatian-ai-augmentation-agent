import openai
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session

from config.settings import settings
from app.models.document import Document
from app.models.user import User

class LLMService:
    def __init__(self):
        self.client = openai.OpenAI(api_key=settings.openai_api_key)
        self.model = "gpt-4o-mini"  # Using the latest efficient model
    
    async def analyze_resume(self, resume_text: str) -> Dict[str, Any]:
        """Analyze resume and extract key information"""
        
        prompt = """
        Analyze the following resume and extract key information. Return a structured analysis in JSON format with these sections:

        1. personal_info: Basic information (name, contact details if present)
        2. skills: List of technical and soft skills mentioned
        3. experience: Work experience with key responsibilities and achievements
        4. education: Educational background
        5. projects: Notable projects or accomplishments
        6. strengths: Top 3-5 key strengths based on the content
        7. career_level: Estimate career level (entry-level, mid-level, senior, executive)
        8. industries: Industries or domains of experience

        Resume text:
        {resume_text}

        Provide a comprehensive but concise analysis focused on professional capabilities.
        Return ONLY valid JSON without any markdown formatting or additional text.
        """
        
        try:
            response = await self._call_openai(prompt.format(resume_text=resume_text))
            return self._parse_json_response(response)
        except Exception as e:
            print(f"Error analyzing resume: {str(e)}")
            return {"error": "Failed to analyze resume", "details": str(e)}
    
    async def analyze_job_description(self, job_text: str) -> Dict[str, Any]:
        """Analyze job description and extract key requirements"""
        
        prompt = """
        Analyze the following job description and extract key information. Return a structured analysis in JSON format with these sections:

        1. job_title: The position title
        2. company: Company name if mentioned
        3. required_skills: Essential technical and soft skills required
        4. preferred_skills: Nice-to-have skills mentioned
        5. responsibilities: Key job responsibilities and duties
        6. qualifications: Education and experience requirements
        7. job_level: Estimated level (entry-level, mid-level, senior, executive)
        8. industry: Industry or domain
        9. key_requirements: Top 5 most important requirements for this role
        10. company_values: Any company values or culture mentions

        Job description text:
        {job_text}

        Focus on what the employer is really looking for in an ideal candidate.
        Return ONLY valid JSON without any markdown formatting or additional text.
        """
        
        try:
            response = await self._call_openai(prompt.format(job_text=job_text))
            return self._parse_json_response(response)
        except Exception as e:
            print(f"Error analyzing job description: {str(e)}")
            return {"error": "Failed to analyze job description", "details": str(e)}
    
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
        6. Try to find 2 different pieces of evidence from the resume for each requirement when possible
        7. Each evidence quote should be from a different section/experience in the resume
        8. Never put "— (no direct evidence)" in the direct_matches section - those belong in skill_gaps
        9. Include at least 3-5 direct matches (with real evidence) and 2-4 gaps
        10. Return ONLY the JSON object, no other text or formatting
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
            print(f"Error extracting detailed evidence: {str(e)}")
            return {"error": "Failed to extract evidence", "details": str(e)}
    
    async def find_connections(self, resume_analysis: Dict[str, Any], job_analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Find connections between resume and job requirements using Ignatian context"""
        
        prompt = """
        Using the Ignatian Pedagogical Paradigm approach, analyze the connections between this candidate's background and the job requirements. The IPP emphasizes context, experience, reflection, action, and evaluation.

        Resume Analysis:
        {resume_analysis}

        Job Analysis:
        {job_analysis}

        Provide an analysis in JSON format with these sections:

        1. skill_matches: Skills that directly align (with confidence scores 1-10)
        2. experience_connections: How past experience relates to job requirements
        3. growth_opportunities: Areas where the candidate can grow into the role
        4. value_alignment: How candidate's background aligns with company values/mission
        5. unique_strengths: What makes this candidate stand out for this role
        6. development_areas: Skills or experiences the candidate should develop
        7. portfolio_project_themes: 3-5 potential themes for portfolio projects that would demonstrate fit
        8. ignatian_reflection_points: Key questions for deeper reflection on calling and purpose
        9. overall_fit_score: Numerical score 1-10 for overall role fit
        10. next_steps_suggestions: Recommendations for the candidate

        Focus on authentic connections and growth opportunities, not just surface-level matches.
        Return ONLY valid JSON without any markdown formatting or additional text.
        """
        
        try:
            response = await self._call_openai(
                prompt.format(
                    resume_analysis=resume_analysis,
                    job_analysis=job_analysis
                )
            )
            return self._parse_json_response(response)
        except Exception as e:
            print(f"Error finding connections: {str(e)}")
            return {"error": "Failed to analyze connections", "details": str(e)}
    
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
                print(f"Error parsing context summary JSON: {result.get('error')}")
                print(f"Raw response: {result.get('raw_response', '')[:500]}...")  # Log first 500 chars
                
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
            print(f"Error generating context summary: {str(e)}")
            return {
                "context_summary": "Unable to generate context summary at this time.",
                "role_fit_narrative": "",
                "strengths": [],
                "gaps": []
            }
    
    async def _call_openai(self, prompt: str) -> str:
        """Make API call to OpenAI"""
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system", 
                        "content": "You are an expert career counselor and educator trained in the Ignatian Pedagogical Paradigm. You help students discover authentic connections between their background and career aspirations, focusing on growth, reflection, and purposeful action. When asked to provide JSON output, always return valid JSON without any additional text, markdown formatting, or code blocks."
                    },
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=2000
            )
            return response.choices[0].message.content
        except Exception as e:
            raise Exception(f"OpenAI API call failed: {str(e)}")
    
    def _parse_json_response(self, response: str) -> Dict[str, Any]:
        """Parse JSON response from OpenAI, handling potential formatting issues"""
        import json
        import re
        
        try:
            # Try direct JSON parsing first
            return json.loads(response)
        except json.JSONDecodeError:
            # Try to extract JSON from markdown code blocks
            json_match = re.search(r'```(?:json)?\s*(\{.*\})\s*```', response, re.DOTALL)
            if json_match:
                try:
                    return json.loads(json_match.group(1))
                except json.JSONDecodeError:
                    pass
            
            # If all else fails, return error structure
            return {
                "error": "Failed to parse LLM response as JSON",
                "raw_response": response
            }

# Global instance
llm_service = LLMService()