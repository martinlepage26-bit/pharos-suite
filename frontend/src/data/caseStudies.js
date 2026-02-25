export const caseStudies = [
  {
    id: 'finserv-foundation',
    title: 'Governance Foundation for AI-Powered Lending',
    client: 'Regional Financial Services Firm',
    sector: 'Financial Services',
    duration: '8 weeks',
    challenge: 'A regional lender deployed machine learning models for credit decisioning without formal governance structures. Internal audit flagged the gap during routine review, and regulators signaled increased scrutiny of AI-assisted lending.',
    approach: [
      'Conducted AI use case inventory across lending, collections, and fraud detection',
      'Developed risk tiering criteria aligned with model materiality and regulatory exposure',
      'Designed decision rights matrix clarifying approval authority by risk tier',
      'Established governance cadence with monthly model review and quarterly board reporting'
    ],
    outcomes: [
      'Documented 23 AI use cases across 4 business units',
      'Implemented 3-tier risk classification (High/Medium/Low)',
      'Created RACI matrix covering model lifecycle from development to retirement',
      'Passed subsequent regulatory examination with no material findings'
    ],
    quote: 'We went from "we have some models" to "we have a governance program" in two months.',
    deliverables: ['Use Case Inventory', 'Risk Tiering Framework', 'Decision Rights Matrix', 'Governance Calendar']
  },
  {
    id: 'healthcare-vendor',
    title: 'Vendor AI Assessment for Clinical Decision Support',
    client: 'Academic Medical Center',
    sector: 'Healthcare',
    duration: '6 weeks',
    challenge: 'Hospital system evaluating third-party clinical decision support tools needed a structured approach to vendor AI assessment. Procurement lacked criteria for evaluating algorithmic systems, and clinical leadership needed assurance that vendor claims could be verified.',
    approach: [
      'Developed vendor AI questionnaire covering model documentation, validation, and monitoring',
      'Created evaluation scorecard with weighted criteria for clinical AI procurement',
      'Designed contractual requirements for ongoing vendor transparency and audit access',
      'Built reassessment trigger framework for post-deployment monitoring'
    ],
    outcomes: [
      'Standardized vendor assessment across 12 clinical AI procurement decisions',
      'Rejected 2 vendors based on inadequate validation documentation',
      'Negotiated audit access provisions in 5 vendor contracts',
      'Reduced procurement cycle time by 40% through structured evaluation'
    ],
    quote: 'We finally have a way to compare apples to apples when vendors claim their AI is "clinically validated."',
    deliverables: ['Vendor Questionnaire', 'Evaluation Scorecard', 'Contract Language Templates', 'Reassessment Protocol']
  },
  {
    id: 'enterprise-controls',
    title: 'Controls & Evidence Pack for Enterprise AI Platform',
    client: 'Global Technology Company',
    sector: 'Enterprise Technology',
    duration: '12 weeks',
    challenge: 'Enterprise software company building AI features into core platform faced increasing customer questionnaires about AI governance. Sales cycles were extending as customers demanded evidence of responsible AI practices. The company needed audit-ready documentation.',
    approach: [
      'Mapped customer questionnaire requirements to internal control gaps',
      'Designed control register aligned with NIST AI RMF and ISO 42001',
      'Built evidence collection workflows integrated with development lifecycle',
      'Created customer-facing AI governance documentation package'
    ],
    outcomes: [
      'Reduced average questionnaire response time from 3 weeks to 3 days',
      'Achieved SOC 2 + AI attestation readiness',
      'Closed 3 enterprise deals previously stalled on governance concerns',
      'Established repeatable evidence collection across 8 AI product features'
    ],
    quote: 'Governance became a sales enabler instead of a sales blocker.',
    deliverables: ['Control Register', 'Evidence Collection Playbook', 'Customer Documentation Package', 'Audit Response Templates']
  },
  {
    id: 'public-sector-embedding',
    title: 'Embedding Review for Benefits Navigation AI',
    client: 'State Government Agency',
    sector: 'Public Sector',
    duration: '10 weeks',
    challenge: 'State agency deploying conversational AI for benefits navigation needed to ensure the system met due process requirements. Concerns included citizen data handling, contestability of AI-influenced decisions, and equity across demographic groups.',
    approach: [
      'Conducted embedding review assessing refusal pathways and human escalation',
      'Designed trace retention policies limiting data reuse across agency functions',
      'Built fairness monitoring framework tracking service quality by demographic',
      'Established citizen contestability procedures for AI-assisted interactions'
    ],
    outcomes: [
      'Implemented mandatory human review for high-stakes benefit determinations',
      'Created 90-day trace retention limit with automatic purging',
      'Deployed fairness dashboard monitoring 6 demographic dimensions',
      'Established citizen appeal pathway with documented AI interaction history'
    ],
    quote: 'We can now show citizens exactly what the AI contributed to their case and how to contest it.',
    deliverables: ['Embedding Assessment Report', 'Data Retention Policy', 'Fairness Monitoring Dashboard Spec', 'Contestability Procedures']
  },
  {
    id: 'saas-oversight',
    title: 'Oversight Retainer for AI-Native SaaS Platform',
    client: 'Growth-Stage SaaS Company',
    sector: 'Enterprise SaaS',
    duration: 'Ongoing (18 months)',
    challenge: 'Fast-growing SaaS company with AI at the core of its product needed ongoing governance support that could keep pace with rapid feature development. Internal team lacked bandwidth for continuous governance as the AI portfolio expanded.',
    approach: [
      'Established monthly governance review cadence aligned with sprint cycles',
      'Created lightweight intake process for new AI feature governance assessment',
      'Built decision log capturing risk acceptance rationale for each release',
      'Provided on-demand audit and procurement support for enterprise customers'
    ],
    outcomes: [
      'Reviewed 47 AI features across 18 monthly cycles',
      'Maintained sub-24-hour turnaround on customer governance questionnaires',
      'Supported 2 SOC 2 audits and 1 ISO 27001 certification',
      'Zero governance-related deal losses in enterprise segment'
    ],
    quote: 'Having governance expertise on retainer means we ship fast without accumulating risk debt.',
    deliverables: ['Monthly Governance Reports', 'Feature Risk Assessments', 'Decision Log', 'Audit Support']
  }
];
