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
        """
        
        try:
            response = await self._call_openai(prompt.format(job_text=job_text))
            return self._parse_json_response(response)
        except Exception as e:
            print(f"Error analyzing job description: {str(e)}")
            return {"error": "Failed to analyze job description", "details": str(e)}
    
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
    
    async def generate_context_summary(self, resume_analysis: Dict[str, Any], job_analysis: Dict[str, Any], connections: Dict[str, Any]) -> str:
        """Generate a narrative summary for the Context stage completion"""
        
        prompt = """
        Create a compelling narrative summary that captures the Context stage of the Ignatian Pedagogical Paradigm. This should help the student understand their current situation in relation to their target role.

        Resume Analysis: {resume_analysis}
        Job Analysis: {job_analysis}
        Connections: {connections}

        Write a 2-3 paragraph summary that:
        1. Acknowledges their current strengths and experience
        2. Highlights the most promising connections to the target role
        3. Sets the stage for deeper exploration in the Experience stage
        4. Uses encouraging, reflective tone consistent with Ignatian pedagogy

        Focus on helping the student see both their potential and their growth edge.
        """
        
        try:
            response = await self._call_openai(
                prompt.format(
                    resume_analysis=resume_analysis,
                    job_analysis=job_analysis,
                    connections=connections
                )
            )
            return response.strip()
        except Exception as e:
            print(f"Error generating context summary: {str(e)}")
            return "Unable to generate context summary at this time."
    
    async def _call_openai(self, prompt: str) -> str:
        """Make API call to OpenAI"""
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system", 
                        "content": "You are an expert career counselor and educator trained in the Ignatian Pedagogical Paradigm. You help students discover authentic connections between their background and career aspirations, focusing on growth, reflection, and purposeful action."
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