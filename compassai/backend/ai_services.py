"""
AI Services Module for Compass AI
Provides multi-LLM support (GPT-5.2, Claude, Gemini) for:
- Content generation (reports, recommendations)
- Document/policy analysis
- Market intelligence
"""

import os
import json
import asyncio
from typing import Optional, Dict, Any, List
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).parent / '.env')

from pharos_integrations.llm.chat import LlmChat, SystemMessage, UserMessage

# Get API key
PHAROS_LLM_KEY = os.environ.get('PHAROS_LLM_KEY', '')

# Available models configuration
MODELS = {
    "gpt-5.2": {"provider": "openai", "model": "gpt-5.2"},
    "claude": {"provider": "anthropic", "model": "claude-sonnet-4-5-20250929"},
    "gemini": {"provider": "gemini", "model": "gemini-3-flash-preview"}
}


class AIService:
    """Multi-LLM AI Service for Compass AI Governance Engine"""
    
    def __init__(self, model_key: str = "gpt-5.2"):
        self.model_config = MODELS.get(model_key, MODELS["gpt-5.2"])
        self.api_key = os.environ.get("OPENAI_API_KEY") or PHAROS_LLM_KEY
        self.base_url = os.environ.get("OPENAI_BASE_URL")
    
    def _create_chat(self) -> LlmChat:
        """Create a new OpenAI-compatible LlmChat instance."""
        return LlmChat(
            model=self.model_config["model"],
            api_key=self.api_key,
            base_url=self.base_url,
        )

    async def _send_prompt(self, system_message: str, prompt: str) -> Optional[str]:
        if not self.api_key:
            return None

        chat = self._create_chat()
        return await asyncio.to_thread(
            chat.chat,
            [
                SystemMessage(content=system_message),
                UserMessage(content=prompt),
            ],
        )

    async def generate_executive_summary(self, assessment_data: Dict[str, Any]) -> str:
        """Generate an executive summary from assessment results"""
        system_message = """You are an AI Governance expert. Generate concise, professional executive summaries 
        for AI governance assessments. Focus on key findings, risk level, and critical recommendations.
        Be direct and actionable. Format with clear sections."""
        
        prompt = f"""Generate an executive summary for this AI governance assessment:

Assessment Score: {assessment_data.get('score', 'N/A')}/100
Risk Tier: {assessment_data.get('risk_tier', 'N/A')}
Readiness: {assessment_data.get('readiness', 'N/A')}

Category Maturity:
{json.dumps(assessment_data.get('category_maturity', {}), indent=2)}

Critical Flags: {', '.join(assessment_data.get('critical_flags', [])) or 'None'}
Missing Elements: {', '.join(assessment_data.get('missing_elements', [])) or 'None'}

Provide:
1. One-paragraph executive overview
2. Key strengths (2-3 bullets)
3. Critical gaps (2-3 bullets)
4. Priority recommendations (3 bullets)
"""
        
        try:
            response = await self._send_prompt(system_message, prompt)
            return response or "Executive summary unavailable. Confirm the configured LLM endpoint and credentials."
        except Exception as exc:
            return f"Executive summary unavailable. Confirm the configured LLM endpoint and credentials. ({exc})"

    async def generate_remediation_plan(self, assessment_data: Dict[str, Any], sector: str) -> Dict[str, List[str]]:
        """Generate AI-powered remediation recommendations"""
        system_message = f"""You are an AI Governance remediation specialist for the {sector} sector.
        Generate specific, actionable remediation steps based on assessment findings.
        Consider industry-specific regulations and best practices."""
        
        controls = assessment_data.get('controls', [])
        low_maturity_controls = [c for c in controls if c.get('maturity', 100) < 60]
        
        prompt = f"""Based on this governance assessment, generate a remediation plan:

Sector: {sector}
Overall Score: {assessment_data.get('score', 'N/A')}/100
Risk Tier: {assessment_data.get('risk_tier', 'N/A')}

Controls Needing Attention:
{json.dumps(low_maturity_controls[:10], indent=2)}

Critical Flags: {', '.join(assessment_data.get('critical_flags', [])) or 'None'}

Generate a JSON response with this exact structure:
{{
    "immediate_actions": ["action1", "action2", "action3"],
    "short_term_actions": ["action1", "action2", "action3"],
    "medium_term_actions": ["action1", "action2", "action3"],
    "resource_requirements": ["requirement1", "requirement2"]
}}

Be specific and actionable. Include timeframes and responsible parties where relevant.
"""
        
        try:
            response = await self._send_prompt(system_message, prompt)
        except Exception:
            response = None
        
        # Parse JSON from response
        try:
            # Try to extract JSON from the response
            import re
            json_match = re.search(r'\{[\s\S]*\}', response or "")
            if json_match:
                return json.loads(json_match.group())
        except Exception:
            pass
        
        # Fallback structure
        return {
            "immediate_actions": [response[:500] if response else "Review assessment findings"],
            "short_term_actions": [],
            "medium_term_actions": [],
            "resource_requirements": []
        }

    async def analyze_policy_document(self, document_text: str, controls: List[Dict]) -> Dict[str, Any]:
        """Analyze a policy document for governance compliance"""
        system_message = """You are an AI policy compliance analyst. Analyze documents to identify:
        1. Governance controls addressed
        2. Compliance gaps
        3. Recommendations for improvement
        Be thorough but concise."""
        
        control_names = [c.get('control_name', '') for c in controls[:20]]
        
        prompt = f"""Analyze this AI governance policy document:

---DOCUMENT START---
{document_text[:8000]}
---DOCUMENT END---

Check against these governance controls:
{json.dumps(control_names, indent=2)}

Provide analysis as JSON:
{{
    "summary": "Brief document summary",
    "controls_addressed": ["control1", "control2"],
    "controls_missing": ["control1", "control2"],
    "compliance_score": 0-100,
    "gaps": ["gap1", "gap2"],
    "recommendations": ["rec1", "rec2"],
    "risk_areas": ["area1", "area2"]
}}
"""
        
        try:
            response = await self._send_prompt(system_message, prompt)
        except Exception:
            response = None
        
        try:
            import re
            json_match = re.search(r'\{[\s\S]*\}', response or "")
            if json_match:
                return json.loads(json_match.group())
        except Exception:
            pass
        
        return {
            "summary": response[:500] if response else "Analysis pending",
            "controls_addressed": [],
            "controls_missing": [],
            "compliance_score": 0,
            "gaps": [],
            "recommendations": [],
            "risk_areas": []
        }

    async def analyze_contract(self, contract_text: str) -> Dict[str, Any]:
        """Analyze a contract for AI governance clauses"""
        system_message = """You are an AI contract analyst specializing in AI governance and compliance.
        Identify AI-related clauses, data handling terms, liability provisions, and compliance requirements."""
        
        prompt = f"""Analyze this contract for AI governance implications:

---CONTRACT START---
{contract_text[:8000]}
---CONTRACT END---

Identify and analyze:
1. AI-related clauses and terms
2. Data handling and privacy provisions
3. Liability and indemnification for AI
4. Compliance requirements mentioned
5. Risk areas and missing protections

Provide as JSON:
{{
    "ai_clauses": [{{"clause": "text", "analysis": "explanation", "risk_level": "low/medium/high"}}],
    "data_provisions": [{{"provision": "text", "compliant": true/false}}],
    "liability_terms": ["term1", "term2"],
    "compliance_requirements": ["req1", "req2"],
    "missing_protections": ["protection1", "protection2"],
    "overall_risk": "low/medium/high",
    "recommendations": ["rec1", "rec2"]
}}
"""
        
        try:
            response = await self._send_prompt(system_message, prompt)
        except Exception:
            response = None
        
        try:
            import re
            json_match = re.search(r'\{[\s\S]*\}', response or "")
            if json_match:
                return json.loads(json_match.group())
        except Exception:
            pass
        
        return {
            "ai_clauses": [],
            "data_provisions": [],
            "liability_terms": [],
            "compliance_requirements": [],
            "missing_protections": [],
            "overall_risk": "unknown",
            "recommendations": [response[:500] if response else "Manual review recommended"]
        }

    async def get_market_intelligence(self, sector: str, topics: List[str] = None) -> Dict[str, Any]:
        """Generate market intelligence about AI regulations and trends"""
        system_message = f"""You are an AI governance market intelligence analyst specializing in the {sector} sector.
        Provide current insights on AI regulations, compliance trends, and industry developments."""
        
        topics_str = ', '.join(topics) if topics else "AI regulations, compliance frameworks, enforcement trends"
        
        prompt = f"""Provide market intelligence for AI governance in the {sector} sector:

Focus areas: {topics_str}

Generate insights on:
1. Current regulatory landscape
2. Upcoming regulations and deadlines
3. Industry compliance trends
4. Key enforcement actions
5. Best practices emerging

Provide as JSON:
{{
    "regulatory_updates": [{{"regulation": "name", "status": "active/upcoming", "deadline": "date if any", "impact": "description"}}],
    "compliance_trends": ["trend1", "trend2"],
    "enforcement_actions": [{{"action": "description", "impact": "high/medium/low"}}],
    "best_practices": ["practice1", "practice2"],
    "risk_alerts": ["alert1", "alert2"],
    "recommendations": ["rec1", "rec2"]
}}
"""
        
        try:
            response = await self._send_prompt(system_message, prompt)
        except Exception:
            response = None
        
        try:
            import re
            json_match = re.search(r'\{[\s\S]*\}', response or "")
            if json_match:
                return json.loads(json_match.group())
        except Exception:
            pass
        
        return {
            "regulatory_updates": [],
            "compliance_trends": [],
            "enforcement_actions": [],
            "best_practices": [],
            "risk_alerts": [],
            "recommendations": [response[:500] if response else "Analysis pending"]
        }

    async def auto_fill_from_document(self, document_text: str) -> Dict[str, Any]:
        """Extract client/system information from uploaded documents for auto-fill"""
        system_message = """You are a document parser specializing in extracting structured information 
        about organizations and AI systems from documents. Extract relevant fields accurately."""
        
        prompt = f"""Extract organization and AI system information from this document:

---DOCUMENT---
{document_text[:6000]}
---END DOCUMENT---

Extract as JSON:
{{
    "client_info": {{
        "company_name": "extracted or null",
        "sector": "SaaS/Healthcare/Education/Public/Finance/Other",
        "jurisdiction": "extracted or null",
        "contact_name": "extracted or null",
        "contact_email": "extracted or null",
        "contact_title": "extracted or null"
    }},
    "ai_system_info": {{
        "system_name": "extracted or null",
        "system_type": "extracted or null",
        "system_description": "extracted or null",
        "intended_use": "extracted or null",
        "data_sources": ["source1", "source2"],
        "high_stakes": true/false,
        "decision_role": "Informational/Advisory/Human-in-the-loop/Automated"
    }},
    "confidence_score": 0-100,
    "extracted_fields_count": number
}}
"""
        
        try:
            response = await self._send_prompt(system_message, prompt)
        except Exception:
            response = None
        
        try:
            import re
            json_match = re.search(r'\{[\s\S]*\}', response or "")
            if json_match:
                return json.loads(json_match.group())
        except Exception:
            pass
        
        return {
            "client_info": {},
            "ai_system_info": {},
            "confidence_score": 0,
            "extracted_fields_count": 0
        }


# Singleton instance for default model
default_ai_service = AIService("gpt-5.2")


async def get_ai_service(model: str = "gpt-5.2") -> AIService:
    """Get an AI service instance with the specified model"""
    return AIService(model)
