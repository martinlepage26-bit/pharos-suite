// COMPASSai — policy template registry
// Source: Spec 07 — compassai-policy-deliverables-and-approval §templates

import type { DeliverableType } from "./types";

export const CURRENT_POLICY_VERSION = "policy-2026-03-31.module07.v1";

export const POLICY_TEMPLATES: Record<
  DeliverableType,
  {
    templateId: string;
    title: string;
    jurisdictionCode: string;
  }
> = {
  use_case_record: {
    templateId: "TPL-UC-001",
    title: "Use Case Record",
    jurisdictionCode: "CA-QC",
  },
  model_card: {
    templateId: "TPL-MC-001",
    title: "Model Card",
    jurisdictionCode: "CA-QC",
  },
  risk_assessment: {
    templateId: "TPL-RA-001",
    title: "Risk Assessment",
    jurisdictionCode: "CA-QC",
  },
  dpia: {
    templateId: "TPL-DPIA-001",
    title: "DPIA",
    jurisdictionCode: "CA-QC",
  },
  monitoring_plan: {
    templateId: "TPL-MP-001",
    title: "Monitoring Plan",
    jurisdictionCode: "CA-QC",
  },
  monitoring_plan_with_alert_thresholds: {
    templateId: "TPL-MPA-001",
    title: "Monitoring Plan With Alert Thresholds",
    jurisdictionCode: "CA-QC",
  },
  approval_record: {
    templateId: "TPL-AR-001",
    title: "Approval Record",
    jurisdictionCode: "CA-QC",
  },
  independent_review_report: {
    templateId: "TPL-IR-001",
    title: "Independent Review Report",
    jurisdictionCode: "CA-QC",
  },
  red_team_findings: {
    templateId: "TPL-RT-001",
    title: "Red-Team Findings",
    jurisdictionCode: "CA-QC",
  },
  recertification_schedule: {
    templateId: "TPL-RS-001",
    title: "Recertification Schedule",
    jurisdictionCode: "CA-QC",
  },
};
