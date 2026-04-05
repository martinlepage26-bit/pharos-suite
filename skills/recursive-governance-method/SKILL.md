---
name: recursive-governance-method
description: Recursive governance analysis for mixed archives, manuscripts, governance notes, bibliographies, storyboards, and connector-sourced materials. Use when the task requires recursive data analysis, separation of source layers from generated layers, control extraction, evidence hierarchy construction, detection of method lock or governance-on-governance drift, production of bounded findings, or drafting of function-specific AI authorship and disclosure language from heterogeneous materials.
---

# Recursive Governance Method

Use this skill to turn heterogeneous materials into a bounded governance analysis instead of a loose thematic summary.

## Default workflow

Run the work in this order:

1. **Assemble the packet**
   - Use uploaded files first.
   - If key materials are missing and connectors are available, use them to retrieve the relevant files or threads.
   - Treat every file or connector result as an artifact with a role, not just as content.

2. **Triage the archive**
   - Run `scripts/archive_triage.py` on the local files when the user has uploaded files or when connector materials are saved locally.
   - Use the triage output to separate:
     - source-bearing artifacts
     - generated or editorial artifacts
     - control artifacts
     - visualization or presentation artifacts
   - Never collapse these layers into a single evidentiary pool.

3. **Set the governing object**
   - Decide whether the analysis is primarily about:
     - a source tree
     - a recursive workflow
     - a governance failure
     - a disclosure/authorship problem
     - a control design problem
   - Say this explicitly before drawing conclusions.

4. **Build the evidence hierarchy**
   - Rank artifacts by what they can support.
   - Prefer source-bearing materials for factual claims.
   - Use generated drafts, storyboard artifacts, and later syntheses to inspect drift, escalation, or method lock.
   - Do not treat polished summary language as stronger evidence than a lower-level source.

5. **Run recursive analysis**
   - Use the tests in `references/method-rules.md`.
   - Ask, in order:
     - what is first-order source material?
     - what is already a derived artifact?
     - what re-enters the loop as if it were source?
     - where do admissibility rules change?
     - where does the workflow harden into authority?
     - where is interruption missing?

6. **Extract controls**
   - Translate recurring failure patterns into governance controls.
   - Use `references/templates.md` for the default output shapes.
   - If the user wants a structured register, write findings into JSON and run `scripts/control_register.py`.

7. **Write bounded conclusions**
   - Distinguish evidence from inference.
   - Name the consequence domain for each major conclusion: authorship, auditability, workflow, legitimacy, documentation, release, or review.
   - Prefer “supports reading,” “suggests,” or “instantiates” unless the packet genuinely warrants stronger language.

## Connector use

When files are not fully in the chat:
- Use available connectors to gather the smallest sufficient packet.
- Retrieve the actual document, not just snippets, before making load-bearing claims.
- Keep a visible distinction between connector-sourced originals and any summaries generated during the session.

## Decision rules

Apply these rules consistently:

- **Artifact hierarchy beats fluency.** A neat synthesis does not outrank the source tree that it compresses.
- **Generated layers are evidence of process, not automatic evidence of fact.** Use them to diagnose routing, drift, pressure, omission, or control logic.
- **Recursion must earn another pass.** If the next pass only restates or decorates the prior one, stop.
- **Controls must bind to interfaces.** A control is incomplete until it names owner, trigger, evidence, and review interval.
- **Disclosure must be function-specific.** For authorship questions, disclose what layer of reasoning the system shaped: clerical, structural, or epistemic.

## Output modes

Choose the output mode that the archive supports best:

- **Recursive analysis memo** for mixed packets and early diagnosis
- **Control register** for workflow governance and accountability design
- **Evidence hierarchy note** when the archive is messy or contested
- **Disclosure language** when the packet raises authorship or academic integrity questions
- **Reviewer-pressure memo** when the packet contains manuscript drafts or revised versions

Use the default templates in `references/templates.md`.

## Local scripts

### `scripts/archive_triage.py`
Run this first on local files when there is more than one artifact.

Example:
```bash
python scripts/archive_triage.py /path/to/file1.md /path/to/file2.html --format markdown
```

Use the output to decide what counts as source, generated synthesis, control artifact, or visualization.

### `scripts/control_register.py`
Use this when the user wants a structured control table or governance register.

Example:
```bash
python scripts/control_register.py findings.json > control-register.md
```

The input JSON should be a list of objects with keys such as:
`finding`, `mechanism`, `control`, `owner`, `evidence`, `review_interval`, `consequence_domain`.

## References

- Read `references/method-rules.md` for the actual recursive tests and stop rules.
- Read `references/templates.md` for output templates and disclosure language patterns.
- Read `references/example-prompts.md` when the user needs sample prompts or when testing the skill.
