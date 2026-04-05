# Dual-Layer Architecture: Prompt Engineering vs. Context Engineering

Reference material for the skill-architect skill. Load this file when the user asks for theoretical grounding, wants to understand the distinction in depth, or needs the comparison matrices for a presentation or document.

---

## Table of Contents
1. Core Distinction
2. Feature Comparison Matrix
3. Key Components of Context Engineering
4. Implementation Strategies: Prompt Engineering
5. Implementation Strategies: Context Engineering
6. Engineering Tactics Comparison (in a Skill File)
7. Best Practices Checklist
8. Anti-Patterns

---

## 1. Core Distinction

Prompt engineering focuses on the specific instructions given to a model: how you phrase the request. Context engineering focuses on designing the entire information environment the model sees when it responds.

The industry has shifted toward context engineering because modern AI systems, especially autonomous agents, depend less on clever wording and more on having the right data at the right time.

Prompt engineering is the "brain software." Context engineering is the "library hardware." A production-grade skill requires both.

---

## 2. Feature Comparison Matrix

| Feature | Prompt Engineering | Context Engineering |
|---|---|---|
| Primary goal | Writing better instructions | Building better information systems |
| Focus | How you phrase the request | What the model knows when it responds |
| Method | Manual trial-and-error (e.g., "Think step by step") | Programmatic curation of data, memory, and tools |
| Scope | One-off, single-turn interactions | Multi-turn, state-aware systems and agents |
| Mindset | Copywriter or instructional designer | Systems architect or software engineer |

**When to lean on which:**
- **Prompt engineering** for simple tasks where the model already has all necessary information (summarizing a short paragraph, changing the tone of an email).
- **Context engineering** for production-grade applications that require reliability, accuracy, and the ability to handle complex, multi-step workflows.

---

## 3. Key Components of Context Engineering

Context engineering is the "macro-architecture" surrounding a prompt. Four layers:

### Knowledge Retrieval (RAG)
Dynamically pulling relevant facts from databases, files, or the web so the model does not rely on training data alone. In a SKILL.md, this means providing exact file paths and loading conditions rather than pasting content inline.

### Memory Management
Maintaining short-term conversation history and long-term user preferences to provide continuity across sessions. In a SKILL.md, this means defining when to check preference files and when to summarize progress to prevent context drift.

### Tool Orchestration
Defining which APIs, scripts, or functions are available to the AI and how their results flow back into the conversation. In a SKILL.md, this means delegating deterministic operations to scripts instead of describing calculations in prose.

### Context Pruning (Token Management)
Actively removing irrelevant tokens to prevent "context rot," where a model loses focus because its input window is too cluttered. In a SKILL.md, this means specifying what to ignore for certain task types and keeping the body under 500 lines with heavy material externalized.

---

## 4. Implementation Strategies: Prompt Engineering

### Few-Shot Examples
Include 1-2 input/output pairs within instructions to show the model exactly what a correct response looks like. Concrete examples outperform abstract descriptions of desired behavior.

### Negative Constraints
Explicitly list what the AI should not do. Examples: "Do not use deprecated libraries." "Never hard-code API keys." "Do not summarize unless explicitly asked." Each constraint should include a reason so the model understands the principle, not just the rule.

### Action Verbs
Use precise verbs: Extract, Analyze, Synthesize, Validate, Parse, Compare. Avoid vague terms: Help with, Look at, Try to, Work on. The verb sets the model's operational frame.

### Persona and Tone
Define the expert role, the dominant register (technical, concise, analytical), and the optimization target. A well-defined persona reduces drift and keeps output consistent across invocations.

### Chain-of-Thought
For complex reasoning tasks, instruct the model to show or sandbox its reasoning before producing final output. Use tags like `<thought>` to separate reasoning from deliverable.

---

## 5. Implementation Strategies: Context Engineering

### Trigger Keywords in Description
The YAML frontmatter description is the primary trigger mechanism. It must contain the exact terms a user would say to activate the skill. Err toward slightly pushy trigger scope to prevent under-triggering.

### Token Management
Keep the main SKILL.md under 500 lines. Move heavy reference material to a `references/` folder so it loads into context only when the AI specifically needs it. Specify conditions for loading each reference file.

### Tool-First Logic
Instead of telling the AI how to calculate something, point it to a script. This ensures deterministic accuracy and saves context space. The instruction should be "Run `scripts/validate.py`" not a prose description of the validation algorithm.

### Project Table of Contents
For large projects, do not paste the codebase into the skill. Provide a file system map that allows the AI to fetch the right context only when needed. This keeps the context window clean and responses fast.

### Conditional Loading
Define rules for when to load external data: "Use the `search_web` tool only if the local `data/cache.json` is older than 24 hours." "Read `references/deep-dive.md` only when generating [specific object type]."

---

## 6. Engineering Tactics Comparison (in a Skill File)

| Strategy | Prompt Engineering (The "How") | Context Engineering (The "Where") |
|---|---|---|
| Persona | "Act as a security auditor" | Loading `security_policy.pdf` into active memory |
| Constraints | "Do not use deprecated libraries" | Pointing to a list of approved dependencies in `package.json` |
| Execution | Step-by-step reasoning (CoT) | Running a specific script (e.g., `validate.py`) for deterministic results |
| Examples | Adding input/output pairs to the text | Dynamically retrieving similar past code snippets from a vector database (RAG) |
| Format | Specifying Markdown/JSON/template in instructions | Pointing to a template file the model reads and follows |

---

## 7. Best Practices Checklist

### Naming
- Folder name matches the `name` field in YAML frontmatter.
- Both use kebab-case.

### Description
- Written in third person ("Processes files" not "I process files").
- Contains specific trigger keywords.
- Under 1,024 characters.
- Slightly pushy to prevent under-triggering.

### Efficiency
- Filler removed ("Please," "Try your best," "As an AI," "I hope this helps").
- Body under 500 lines.
- Heavy references externalized with loading conditions.
- Deterministic operations delegated to scripts, not described in prose.

### Structure
- Brain and Map sections clearly separated.
- Instructions use action verbs in imperative form.
- Negative constraints include reasons.
- At least one few-shot example for non-trivial output formats.

---

## 8. Anti-Patterns

| Anti-Pattern | What It Looks Like | Fix |
|---|---|---|
| Data dumping | Entire file contents pasted into SKILL.md body | Externalize to `references/` with a path and loading condition |
| Prose calculation | "To calculate the margin, take revenue minus cost, divide by revenue, multiply by 100" | Write a script, point to it: "Run `scripts/calc_margin.py`" |
| Vague persona | No role or tone defined; model defaults to generic assistant | Add `<persona>` block with role, tone, and optimization target |
| Keyword-poor description | "Helps with data tasks" | "Process, clean, transform, and analyze tabular data from CSV, TSV, XLSX files. Triggers on: spreadsheet, data cleaning, column operations, pivot, merge, filter" |
| Monolithic body | 800+ lines, no external references | Split into body (under 500 lines) + `references/` folder |
| Missing negative constraints | Model produces chatty, off-scope, or deprecated output | Add `<negative_constraints>` with specific prohibitions and reasons |
| No few-shot | Complex output format described only in prose | Add 1-2 concrete input/output pairs |
| Conflated layers | Persona instructions mixed with file paths and tool calls in one undifferentiated block | Restructure into separate Brain and Map sections |
