import { useEffect, useState } from "react";
import { Alert, Box, Button, Grid, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material";
import { GovernanceProgramApi } from "../api";
import type { AISystemCreatePayload, GovernancePolicy } from "../types";

interface Props {
  clientId: string;
  apiClient: GovernanceProgramApi;
}

const initialState: AISystemCreatePayload = {
  client_id: "",
  system_name: "",
  system_type: "",
  system_description: "",
  decision_role: "Advisory",
  user_type: "Internal",
  high_stakes: false,
  intended_use: "",
  data_sources: [],
  evaluation_method: "",
  human_override: false,
  inventory_profile: {
    business_capability: "",
    lifecycle_stage: "intake",
    deployment_environment: "",
    vendor_name: "",
    model_provider: "",
    model_family: "",
    deployment_regions: [],
    data_classifications: [],
    user_populations: [],
    downstream_dependencies: [],
    incident_contact: "",
    review_frequency: "",
  },
  applicable_policy_ids: [],
  linked_control_ids: [],
  training_requirement_ids: [],
};

export function SystemInventoryOnboarding({ clientId, apiClient }: Props) {
  const [payload, setPayload] = useState<AISystemCreatePayload>({ ...initialState, client_id: clientId });
  const [policies, setPolicies] = useState<GovernancePolicy[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void apiClient.getPolicies().then((items) => {
      if (!cancelled) setPolicies(items);
    });
    return () => {
      cancelled = true;
    };
  }, [apiClient]);

  const submit = async () => {
    try {
      await apiClient.createSystem(payload);
      setStatus(`Created system profile for ${payload.system_name}`);
      setError(null);
      setPayload({ ...initialState, client_id: clientId });
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Failed to create system");
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Stack spacing={2.5}>
        <Typography variant="h6">AI system inventory onboarding</Typography>
        {status ? <Alert severity="success">{status}</Alert> : null}
        {error ? <Alert severity="error">{error}</Alert> : null}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="System name"
              value={payload.system_name}
              onChange={(event) => setPayload({ ...payload, system_name: event.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="System type"
              value={payload.system_type}
              onChange={(event) => setPayload({ ...payload, system_type: event.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Decision role"
              value={payload.decision_role}
              onChange={(event) => setPayload({ ...payload, decision_role: event.target.value })}
            >
              {["Informational", "Advisory", "Human-in-the-loop", "Automated"].map((value) => (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Vendor name"
              value={payload.inventory_profile.vendor_name}
              onChange={(event) =>
                setPayload({
                  ...payload,
                  inventory_profile: { ...payload.inventory_profile, vendor_name: event.target.value },
                })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              minRows={4}
              label="System description"
              value={payload.system_description}
              onChange={(event) => setPayload({ ...payload, system_description: event.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              SelectProps={{ multiple: true }}
              label="Applicable policies"
              value={payload.applicable_policy_ids}
              onChange={(event) =>
                setPayload({
                  ...payload,
                  applicable_policy_ids: event.target.value as string[],
                })
              }
            >
              {policies.map((policy) => (
                <MenuItem key={policy.id} value={policy.id}>
                  {policy.title}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="flex-end">
          <Button variant="contained" onClick={submit}>
            Create system profile
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}
