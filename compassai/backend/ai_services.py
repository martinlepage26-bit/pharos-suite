"""
AI Services Module for Compass AI
Provides Gemini Flash inference for:
- Content generation (reports, recommendations)
- Document/policy analysis
- Market intelligence
- Contract analysis
"""

import json
import os
import re
from pathlib import Path
from typing import Any, Dict, List, Optional

from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv(Path(__file__).parent / ".env")

_GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY", "")
_MODEL = "gemini-2.0-flash"

# Lazy client — created on first use so import doesn't fail without a key.
_client: Optional[genai.Client] = None


def _get_client() -> genai.Client:
    global _client
    if _client is None:
        if not _GOOGLE_API_KEY:
            raise RuntimeError(
                "GOOGLE_API_KEY environment variable is required for AI features"
            )
        _client = genai.Client(api_key=_GOOGLE_API_KEY)
    return _client


def _extract_json(text: str) -> Optional[dict]:
    """Extract the first JSON object from a response string."""
    try:
        match = re.search(r"\{[\s\S]*\}", text or "")
        if match:
            return json.loads(match.group())
    except Exception:
        pass
    return None


class AIService:
    """Gemini Flash AI Service for Compass AI Governance Engine"""

    async def _generate(self, system_message: str, prompt: str) -> Optional[str]:
        """Send a prompt to Gemini and return the text response."""
        client = _get_client()
        try:
            response = await client.aio.models.generate_content(
                model=_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=system_message,
                    temperature=0.3,
                ),
            )
            return response.text
        except Exception as exc:
            raise RuntimeError(f"Gemini request failed: {exc}") from exc

    async def _generate_json(self, system_message: str, prompt: str) -> Optional[str]:
        """Send a prompt requesting a JSON response from Gemini."""
        client = _get_client()
        try:
            response = await client.aio.models.generate_content(
                model=_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=system_message,
                    temperature=0.2,
                    response_mime_type="application/json",
                ),
            )
            return response.text
        except Exception as exc:
            raise RuntimeError(f"Gemini JSON request failed: {exc}") from exc

    async def generate_executive_summary(self, assessment_data: Dict[str, Any]) -> str:
        """Generate an executive summary from assessment results."""
        system_message = (
            "You are an AI Governance expert. Generate concise, professional executive "
            "summaries for AI governance assessments. Focus on key findings, risk level, "
            "and critical recommendations. Be direct and actionable. Format with clear sections."
        )
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
4. Priority recommendations (3 bullets)"""

        try:
            response = await self._generate(system_message, prompt)
            return response or "Executive summary unavailable. Confirm GOOGLE_API_KEY is set."
        except Exception as exc:
            return f"Executive summary unavailable: {exc}"

    async def generate_remediation_plan(
        self, assessment_data: Dict[str, Any], sector: str
    ) -> Dict[str, List[str]]:
        """Generate AI-powered remediation recommendations."""
        system_message = (
            f"You are an AI Governance remediation specialist for the {sector} sector. "
            "Generate specific, actionable remediation steps based on assessment findings. "
            "Consider industry-specific regulations and best practices."
        )
        controls = assessment_data.get("controls", [])
        low_maturity = [c for c in controls if c.get("maturity", 100) < 60]

        prompt = f"""Based on this governance assessment, generate a remediation plan:

Sector: {sector}
Overall Score: {assessment_data.get('score', 'N/A')}/100
Risk Tier: {assessment_data.get('risk_tier', 'N/A')}

Controls Needing Attention:
{json.dumps(low_maturity[:10], indent=2)}

Critical Flags: {', '.join(assessment_data.get('critical_flags', [])) or 'None'}

Return JSON with this exact structure:
{{
    "immediate_actions": ["action1", "action2", "action3"],
    "short_term_actions": ["action1", "action2", "action3"],
    "medium_term_actions": ["action1", "action2", "action3"],
    "resource_requirements": ["requirement1", "requirement2"]
}}"""

        _FALLBACK: Dict[str, List[str]] = {
            "immediate_actions": ["Review assessment findings"],
            "short_term_actions": [],
            "medium_term_actions": [],
            "resource_requirements": [],
        }
        try:
            text = await self._generate_json(system_message, prompt)
            return _extract_json(text or "") or _FALLBACK
        except Exception:
            return _FALLBACK

    async def analyze_policy_document(
        self, document_text: str, controls: List[Dict]
    ) -> Dict[str, Any]:
        """Analyze a policy document for governance compliance."""
        system_message = (
            "You are an AI policy compliance analyst. Analyze documents to identify: "
            "1. Governance controls addressed, 2. Compliance gaps, "
            "3. Recommendations for improvement. Be thorough but concise."
        )
        control_names = [c.get("control_name", "") for c in controls[:20]]

        prompt = f"""Analyze this AI governance policy document:

---DOCUMENT START---
{document_text[:8000]}
---DOCUMENT END---

Check against these governance controls:
{json.dumps(control_names, indent=2)}

Return JSON:
{{
    "summary": "Brief document summary",
    "controls_addressed": ["control1", "control2"],
    "controls_missing": ["control1", "control2"],
    "compliance_score": 0,
    "gaps": ["gap1", "gap2"],
    "recommendations": ["rec1", "rec2"],
    "risk_areas": ["area1", "area2"]
}}"""

        _FALLBACK: Dict[str, Any] = {
            "summary": "Analysis pending",
            "controls_addressed": [],
            "controls_missing": [],
            "compliance_score": 0,
            "gaps": [],
            "recommendations": [],
            "risk_areas": [],
        }
        try:
            text = await self._generate_json(system_message, prompt)
            return _extract_json(text or "") or _FALLBACK
        except Exception:
            return _FALLBACK

    async def analyze_contract(self, contract_text: str) -> Dict[str, Any]:
        """Analyze a contract for AI governance clauses."""
        system_message = (
            "You are an AI contract analyst specializing in AI governance and compliance. "
            "Identify AI-related clauses, data handling terms, liability provisions, and "
            "compliance requirements."
        )
        prompt = f"""Analyze this contract for AI governance implications:

---CONTRACT START---
{contract_text[:8000]}
---CONTRACT END---

Return JSON:
{{
    "ai_clauses": [{{"clause": "text", "analysis": "explanation", "risk_level": "low/medium/high"}}],
    "data_provisions": [{{"provision": "text", "compliant": true}}],
    "liability_terms": ["term1", "term2"],
    "compliance_requirements": ["req1", "req2"],
    "missing_protections": ["protection1", "protection2"],
    "overall_risk": "low/medium/high",
    "recommendations": ["rec1", "rec2"]
}}"""

        _FALLBACK: Dict[str, Any] = {
            "ai_clauses": [],
            "data_provisions": [],
            "liability_terms": [],
            "compliance_requirements": [],
            "missing_protections": [],
            "overall_risk": "unknown",
            "recommendations": ["Manual review recommended"],
        }
        try:
            text = await self._generate_json(system_message, prompt)
            return _extract_json(text or "") or _FALLBACK
        except Exception:
            return _FALLBACK

    async def get_market_intelligence(
        self, sector: str, topics: List[str] = None
    ) -> Dict[str, Any]:
        """Generate market intelligence about AI regulations and trends."""
        system_message = (
            f"You are an AI governance market intelligence analyst specializing in the {sector} sector. "
            "Provide current insights on AI regulations, compliance trends, and industry developments."
        )
        topics_str = (
            ", ".join(topics) if topics
            else "AI regulations, compliance frameworks, enforcement trends"
        )
        prompt = f"""Provide market intelligence for AI governance in the {sector} sector:

Focus areas: {topics_str}

Return JSON:
{{
    "regulatory_updates": [{{"regulation": "name", "status": "active/upcoming", "deadline": "date or null", "impact": "description"}}],
    "compliance_trends": ["trend1", "trend2"],
    "enforcement_actions": [{{"action": "description", "impact": "high/medium/low"}}],
    "best_practices": ["practice1", "practice2"],
    "risk_alerts": ["alert1", "alert2"],
    "recommendations": ["rec1", "rec2"]
}}"""

        _FALLBACK: Dict[str, Any] = {
            "regulatory_updates": [],
            "compliance_trends": [],
            "enforcement_actions": [],
            "best_practices": [],
            "risk_alerts": [],
            "recommendations": ["Analysis pending"],
        }
        try:
            text = await self._generate_json(system_message, prompt)
            return _extract_json(text or "") or _FALLBACK
        except Exception:
            return _FALLBACK

    async def auto_fill_from_document(self, document_text: str) -> Dict[str, Any]:
        """Extract client/system information from uploaded documents for auto-fill."""
        system_message = (
            "You are a document parser specializing in extracting structured information "
            "about organizations and AI systems from documents. Extract relevant fields accurately."
        )
        prompt = f"""Extract organization and AI system information from this document:

---DOCUMENT---
{document_text[:6000]}
---END DOCUMENT---

Return JSON:
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
        "data_sources": ["source1"],
        "high_stakes": false,
        "decision_role": "Informational/Advisory/Human-in-the-loop/Automated"
    }},
    "confidence_score": 0,
    "extracted_fields_count": 0
}}"""

        _FALLBACK: Dict[str, Any] = {
            "client_info": {},
            "ai_system_info": {},
            "confidence_score": 0,
            "extracted_fields_count": 0,
        }
        try:
            text = await self._generate_json(system_message, prompt)
            return _extract_json(text or "") or _FALLBACK
        except Exception:
            return _FALLBACK


# Singleton for default use
default_ai_service = AIService()


async def get_ai_service() -> AIService:
    """Return an AIService instance."""
    return AIService()
