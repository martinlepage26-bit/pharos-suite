import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControlLabel,
  Grid,
  MenuItem,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { GovernanceProgramApi } from "../api";
import type { AssessmentGovernanceContext, GovernanceArtifactRecord, GovernancePolicy, TrainingModule } from "../types";

interface Props {
  assessmentId: string;
  apiClient: GovernanceProgramApi;
}

export function AssessmentGovernanceEditor({ assessmentId, apiClient }: Props) {
  const [context, setContext] = useState<AssessmentGovernanceContext | null>(null);
  const [artifacts, setArtifacts] = useState<GovernanceArtifactRecord[]>([]);
  const [policies, setPolicies] = useState<GovernancePolicy[]>([]);
  const [trainingModules, setTrainingModules] = useState<TrainingModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const [nextContext, nextArtifacts, nextPolicies, nextTraining] = await Promise.all([
          apiClient.getAssessmentGovernanceContext(assessmentId),
          apiClient.getArtifacts(),
          apiClient.getPolicies(),
          apiClient.getTrainingModules(),
        ]);
        if (!cancelled) {
          setContext(nextContext);
          setArtifacts(nextArtifacts);
          setPolicies(nextPolicies);
          setTrainingModules(nextTraining);
          setError(null);
        }
      } catch (nextError) {
        if (!cancelled) {
          setError(nextError instanceof Error ? nextError.message : "Failed to load governance context");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [assessmentId, apiClient]);

  const selectedArtifactIds = useMemo(
    () => new Set(context?.governance_artifacts.map((item) => item.artifact_id) ?? []),
    [context]
  );

  const toggleArtifact = (artifact: GovernanceArtifactRecord) => {
    if (!context) return;
    const exists = selectedArtifactIds.has(artifact.id);
    const nextArtifacts = exists
      ? context.governance_artifacts.filter((item) => item.artifact_id !== artifact.id)
      : [
          ...context.governance_artifacts,
          {
            artifact_id: artifact.id,
            artifact_type: artifact.artifact_type,
            title: artifact.title,
            summary: artifact.summary,
            tags: artifact.tags,
            linked_control_ids: artifact.linked_control_ids,
            required: false,
            taxonomy: artifact.taxonomy ?? null,
          },
        ];
    setContext({ ...context, governance_artifacts: nextArtifacts });
  };

  const save = async () => {
    if (!context) return;
    try {
      setSaving(true);
      const updated = await apiClient.updateAssessmentGovernanceContext(assessmentId, {
        criteria: context.criteria,
        workflow: context.workflow,
        governance_artifacts: context.governance_artifacts,
        training_recommendation_ids: context.training_recommendation_ids,
      });
      setContext(updated);
      setError(null);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Failed to save governance context");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={6}>
        <CircularProgress />
      </Box>
    );
  }

  if (!context) {
    return <Alert severity="error">{error ?? "Assessment governance context is unavailable."}</Alert>;
  }

  return (
    <Stack spacing={3}>
      {error ? <Alert severity="error">{error}</Alert> : null}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Assessment governance context
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Assessment owner"
              value={context.criteria.assessment_owner ?? ""}
              onChange={(event) =>
                setContext({
                  ...context,
                  criteria: { ...context.criteria, assessment_owner: event.target.value },
                })
              }
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              type="number"
              label="Review window (days)"
              value={context.criteria.review_window_days}
              onChange={(event) =>
                setContext({
                  ...context,
                  criteria: { ...context.criteria, review_window_days: Number(event.target.value) || 0 },
                })
              }
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              select
              fullWidth
              label="Current stage"
              value={context.workflow.current_stage}
              onChange={(event) =>
                setContext({
                  ...context,
                  workflow: { ...context.workflow, current_stage: event.target.value },
                })
              }
            >
              {["intake", "evidence_collection", "review", "approval", "monitoring"].map((stage) => (
                <MenuItem key={stage} value={stage}>
                  {stage}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={context.criteria.committee_required}
                  onChange={(event) =>
                    setContext({
                      ...context,
                      criteria: { ...context.criteria, committee_required: event.target.checked },
                    })
                  }
                />
              }
              label="Committee review required"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={context.criteria.executive_visibility_required}
                  onChange={(event) =>
                    setContext({
                      ...context,
                      criteria: { ...context.criteria, executive_visibility_required: event.target.checked },
                    })
                  }
                />
              }
              label="Executive visibility required"
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Attached policies
        </Typography>
        <Stack direction="row" gap={1} flexWrap="wrap">
          {policies.map((policy) => {
            const selected = context.criteria.applicable_policy_ids.includes(policy.id);
            return (
              <Chip
                key={policy.id}
                label={policy.title}
                color={selected ? "primary" : "default"}
                variant={selected ? "filled" : "outlined"}
                onClick={() => {
                  const nextPolicyIds = selected
                    ? context.criteria.applicable_policy_ids.filter((item) => item !== policy.id)
                    : [...context.criteria.applicable_policy_ids, policy.id];
                  setContext({
                    ...context,
                    criteria: { ...context.criteria, applicable_policy_ids: nextPolicyIds },
                  });
                }}
              />
            );
          })}
        </Stack>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Governance artifacts
        </Typography>
        <Stack spacing={1.5}>
          {artifacts.map((artifact) => (
            <Box
              key={artifact.id}
              sx={{
                border: "1px solid",
                borderColor: selectedArtifactIds.has(artifact.id) ? "primary.main" : "divider",
                borderRadius: 2,
                p: 2,
                cursor: "pointer",
              }}
              onClick={() => toggleArtifact(artifact)}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                <Box>
                  <Typography fontWeight={600}>{artifact.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {artifact.summary}
                  </Typography>
                  {artifact.taxonomy ? (
                    <Typography variant="caption" color="text.secondary">
                      {artifact.taxonomy.domain} · {artifact.taxonomy.artifact_class} · {artifact.taxonomy.lifecycle_stage}
                    </Typography>
                  ) : null}
                </Box>
                <Chip
                  label={selectedArtifactIds.has(artifact.id) ? "Attached" : "Available"}
                  color={selectedArtifactIds.has(artifact.id) ? "primary" : "default"}
                  size="small"
                />
              </Stack>
            </Box>
          ))}
        </Stack>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recommended training
        </Typography>
        <Stack direction="row" gap={1} flexWrap="wrap">
          {trainingModules.map((module) => {
            const selected = context.training_recommendation_ids.includes(module.id);
            return (
              <Chip
                key={module.id}
                label={module.title}
                color={selected ? "success" : "default"}
                variant={selected ? "filled" : "outlined"}
                onClick={() => {
                  const nextIds = selected
                    ? context.training_recommendation_ids.filter((item) => item !== module.id)
                    : [...context.training_recommendation_ids, module.id];
                  setContext({ ...context, training_recommendation_ids: nextIds });
                }}
              />
            );
          })}
        </Stack>
      </Paper>

      <Box display="flex" justifyContent="flex-end">
        <Button variant="contained" onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Save governance context"}
        </Button>
      </Box>
    </Stack>
  );
}
