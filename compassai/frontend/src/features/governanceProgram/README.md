# Governance Program Frontend Module

This directory contains staged React + TypeScript + Material UI components for the CompassAI governance-program integration.

The intended product shape is a hosted web workbench. Assessments, evidence uploads, committee actions, and dashboard views should happen online inside CompassAI, not through a desktop assessment flow.

## Why staged

The current repository does not include a runnable frontend package manifest or a populated `src/` tree. These components are therefore provided as a clean drop-in module rather than a claimed fully wired application.

## Included components

- `AssessmentGovernanceEditor.tsx`
- `AssessmentEvidencePanel.tsx`
- `SystemInventoryOnboarding.tsx`
- `GovernanceCommitteeWorkspace.tsx`
- `ExecutiveDashboard.tsx`

## Expected integration path

1. Restore or create the real frontend package manifest.
2. Install React, TypeScript, and Material UI dependencies.
3. Mount these components under a route tree such as `/workbench/governance`.
4. Wrap `GovernanceProgramApi` in your auth and state-management layer.
5. Add route loaders, toasts, and form validation consistent with the eventual CompassAI design system.
6. Keep file handling server-backed so uploaded evidence, governance artifacts, and decisions remain centralized online.
