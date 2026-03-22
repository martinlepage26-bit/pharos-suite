from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, List, Optional, Sequence, Union
import os
import json
import requests

@dataclass
class UserMessage:
    content: str
    role: str = "user"

@dataclass
class SystemMessage:
    content: str
    role: str = "system"

@dataclass
class AssistantMessage:
    content: str
    role: str = "assistant"

Message = Union[UserMessage, SystemMessage, AssistantMessage, Dict[str, Any]]

class LlmChat:
    """
    Minimal OpenAI-compatible chat client.

    Supports:
      - OpenAI Chat Completions compatible endpoint
      - Any OpenAI-compatible base URL (e.g. local gateways)

    Env vars:
      - OPENAI_API_KEY
      - OPENAI_BASE_URL (default: https://api.openai.com/v1)
      - OPENAI_MODEL (optional default model)
    """

    def __init__(
        self,
        model: Optional[str] = None,
        api_key: Optional[str] = None,
        base_url: Optional[str] = None,
        temperature: float = 0.2,
        max_tokens: int = 1024,
        timeout_s: int = 120,
    ) -> None:
        self.model = model or os.getenv("OPENAI_MODEL") or "gpt-4o-mini"
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        self.base_url = (base_url or os.getenv("OPENAI_BASE_URL") or "https://api.openai.com/v1").rstrip("/")
        self.temperature = float(temperature)
        self.max_tokens = int(max_tokens)
        self.timeout_s = int(timeout_s)

    def _normalize_messages(self, messages: Sequence[Message]) -> List[Dict[str, str]]:
        out: List[Dict[str, str]] = []
        for m in messages:
            if isinstance(m, dict):
                role = m.get("role")
                content = m.get("content")
                if not role or content is None:
                    raise ValueError(f"Bad message dict: {m}")
                out.append({"role": str(role), "content": str(content)})
            else:
                out.append({"role": getattr(m, "role", "user"), "content": getattr(m, "content", "")})
        return out

    def chat(self, messages: Sequence[Message], **kwargs: Any) -> str:
        """
        Send messages, return assistant content string.
        """
        if not self.api_key:
            raise RuntimeError(
                "OPENAI_API_KEY is not set. Set it in your environment to enable LLM calls."
            )

        payload: Dict[str, Any] = {
            "model": kwargs.get("model", self.model),
            "messages": self._normalize_messages(messages),
            "temperature": kwargs.get("temperature", self.temperature),
            "max_tokens": kwargs.get("max_tokens", self.max_tokens),
        }

        url = f"{self.base_url}/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        r = requests.post(url, headers=headers, data=json.dumps(payload), timeout=self.timeout_s)
        if r.status_code >= 400:
            raise RuntimeError(f"LLM request failed ({r.status_code}): {r.text}")

        data = r.json()
        try:
            return data["choices"][0]["message"]["content"]
        except Exception as e:
            raise RuntimeError(f"Unexpected LLM response format: {data}") from e

    # Some codebases call invoke() instead of chat()
    def invoke(self, messages: Sequence[Message], **kwargs: Any) -> str:
        return self.chat(messages, **kwargs)
