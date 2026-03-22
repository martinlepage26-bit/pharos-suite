import { useEffect, useState } from "react";
import { Alert, Grid, List, ListItem, ListItemText, Paper, Stack, Typography } from "@mui/material";
import { GovernanceProgramApi } from "../api";
import type { ExecutiveDashboardData } from "../types";

interface Props {
  apiClient: GovernanceProgramApi;
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h4">{value}</Typography>
    </Paper>
  );
}

export function ExecutiveDashboard({ apiClient }: Props) {
  const [data, setData] = useState<ExecutiveDashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void apiClient
      .getExecutiveDashboard()
      .then((nextData) => {
        if (!cancelled) setData(nextData);
      })
      .catch((nextError) => {
        if (!cancelled) setError(nextError instanceof Error ? nextError.message : "Dashboard load failed");
      });
    return () => {
      cancelled = true;
    };
  }, [apiClient]);

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!data) {
    return <Typography>Loading dashboard...</Typography>;
  }

  return (
    <Stack spacing={3}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard label="Assessments" value={data.summary.total_assessments} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard label="Committees" value={data.summary.governance_committees} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard label="Policies" value={data.summary.policies} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard label="Training modules" value={data.summary.training_modules} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard label="Average evidence confidence" value={data.summary.average_evidence_confidence} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard label="Training links generated" value={data.summary.training_links_generated} />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Risk distribution
            </Typography>
            <List dense>
              {Object.entries(data.risk_distribution).map(([risk, count]) => (
                <ListItem key={risk}>
                  <ListItemText primary={risk} secondary={`${count} assessments`} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Readiness distribution
            </Typography>
            <List dense>
              {Object.entries(data.readiness_distribution).map(([state, count]) => (
                <ListItem key={state}>
                  <ListItemText primary={state} secondary={`${count} assessments`} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
}
