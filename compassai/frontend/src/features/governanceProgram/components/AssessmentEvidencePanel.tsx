import { useState } from "react";
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { GovernanceProgramApi } from "../api";

interface Props {
  assessmentId: string;
  apiClient: GovernanceProgramApi;
}

export function AssessmentEvidencePanel({ assessmentId, apiClient }: Props) {
  const [controlId, setControlId] = useState("GENERAL");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!file) {
      setError("Choose a file before uploading.");
      return;
    }

    try {
      setError(null);
      const response = await apiClient.uploadEvidence(assessmentId, controlId, description, file);
      setStatus(`Uploaded ${response.filename ?? file.name}`);
      setFile(null);
      setDescription("");
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Evidence upload failed");
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h6">Assessment evidence</Typography>
        {status ? <Alert severity="success">{status}</Alert> : null}
        {error ? <Alert severity="error">{error}</Alert> : null}
        <TextField label="Control ID" value={controlId} onChange={(event) => setControlId(event.target.value)} />
        <TextField
          label="Description"
          multiline
          minRows={3}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <Box>
          <Button component="label" variant="outlined">
            Choose evidence file
            <input
              hidden
              type="file"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
          </Button>
          {file ? (
            <Typography variant="body2" sx={{ mt: 1 }}>
              {file.name}
            </Typography>
          ) : null}
        </Box>
        <Box display="flex" justifyContent="flex-end">
          <Button variant="contained" onClick={submit}>
            Upload evidence
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}
