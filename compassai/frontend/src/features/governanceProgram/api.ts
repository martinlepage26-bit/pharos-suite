import type {
  AISystemCreatePayload,
  AssessmentGovernanceContext,
  ExecutiveDashboardData,
  GovernanceArtifactRecord,
  GovernanceCommittee,
  GovernanceCommitteeDecision,
  GovernanceCommitteeMeeting,
  GovernancePolicy,
  TrainingModule,
} from "./types";

export class GovernanceProgramApi {
  constructor(private readonly baseUrl: string, private readonly token?: string) {}

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
        ...(init?.headers ?? {}),
      },
    });

    if (!response.ok) {
      throw new Error(`Request failed (${response.status}): ${await response.text()}`);
    }

    return response.json() as Promise<T>;
  }

  getPolicies() {
    return this.request<GovernancePolicy[]>("/api/governance/policies");
  }

  getArtifacts() {
    return this.request<GovernanceArtifactRecord[]>("/api/governance/artifacts");
  }

  getTrainingModules() {
    return this.request<TrainingModule[]>("/api/governance/training");
  }

  getAssessmentGovernanceContext(assessmentId: string) {
    return this.request<AssessmentGovernanceContext>(`/api/assessments/${assessmentId}/governance-context`);
  }

  updateAssessmentGovernanceContext(assessmentId: string, body: Partial<AssessmentGovernanceContext>) {
    return this.request<AssessmentGovernanceContext>(`/api/assessments/${assessmentId}/governance-context`, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  async uploadEvidence(assessmentId: string, controlId: string, description: string, file: File) {
    const formData = new FormData();
    formData.set("assessment_id", assessmentId);
    formData.set("control_id", controlId);
    formData.set("description", description);
    formData.set("file", file);

    const response = await fetch(`${this.baseUrl}/api/evidence/upload`, {
      method: "POST",
      body: formData,
      headers: this.token ? { Authorization: `Bearer ${this.token}` } : undefined,
    });

    if (!response.ok) {
      throw new Error(`Upload failed (${response.status}): ${await response.text()}`);
    }

    return response.json();
  }

  createSystem(payload: AISystemCreatePayload) {
    return this.request("/api/ai-systems", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  getCommittees() {
    return this.request<GovernanceCommittee[]>("/api/governance/committees");
  }

  getCommitteeMeetings(committeeId: string) {
    return this.request<GovernanceCommitteeMeeting[]>(`/api/governance/committees/${committeeId}/meetings`);
  }

  createCommitteeMeeting(committeeId: string, body: Partial<GovernanceCommitteeMeeting>) {
    return this.request<GovernanceCommitteeMeeting>(`/api/governance/committees/${committeeId}/meetings`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  createCommitteeDecision(committeeId: string, body: Partial<GovernanceCommitteeDecision>) {
    return this.request<GovernanceCommitteeDecision>(`/api/governance/committees/${committeeId}/decisions`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  getExecutiveDashboard() {
    return this.request<ExecutiveDashboardData>("/api/governance/executive-dashboard");
  }
}
