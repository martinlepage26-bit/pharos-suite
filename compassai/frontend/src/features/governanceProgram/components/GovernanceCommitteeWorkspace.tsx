import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { GovernanceProgramApi } from "../api";
import type { GovernanceCommittee, GovernanceCommitteeMeeting } from "../types";

interface Props {
  apiClient: GovernanceProgramApi;
}

export function GovernanceCommitteeWorkspace({ apiClient }: Props) {
  const [committees, setCommittees] = useState<GovernanceCommittee[]>([]);
  const [selectedCommitteeId, setSelectedCommitteeId] = useState<string>("");
  const [meetings, setMeetings] = useState<GovernanceCommitteeMeeting[]>([]);
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [decisionTitle, setDecisionTitle] = useState("");
  const [decisionOutcome, setDecisionOutcome] = useState("approved");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void apiClient.getCommittees().then((items) => {
      if (!cancelled) {
        setCommittees(items);
        if (!selectedCommitteeId && items[0]) {
          setSelectedCommitteeId(items[0].id);
        }
      }
    });
    return () => {
      cancelled = true;
    };
  }, [apiClient, selectedCommitteeId]);

  useEffect(() => {
    if (!selectedCommitteeId) return;
    let cancelled = false;
    void apiClient.getCommitteeMeetings(selectedCommitteeId).then((items) => {
      if (!cancelled) setMeetings(items);
    });
    return () => {
      cancelled = true;
    };
  }, [apiClient, selectedCommitteeId]);

  const createMeeting = async () => {
    await apiClient.createCommitteeMeeting(selectedCommitteeId, {
      title: meetingTitle,
      scheduled_for: meetingDate,
      agenda_items: [],
      related_assessment_ids: [],
    });
    setStatus("Committee meeting created.");
    setMeetingTitle("");
    setMeetingDate("");
    setMeetings(await apiClient.getCommitteeMeetings(selectedCommitteeId));
  };

  const createDecision = async () => {
    const latestMeeting = meetings[0];
    if (!latestMeeting) return;
    await apiClient.createCommitteeDecision(selectedCommitteeId, {
      meeting_id: latestMeeting.id,
      title: decisionTitle,
      decision: decisionOutcome,
      rationale: "Recorded from governance workbench.",
    });
    setStatus("Committee decision recorded.");
    setDecisionTitle("");
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Stack spacing={2.5}>
        <Typography variant="h6">Governance committee workflow</Typography>
        {status ? <Alert severity="success">{status}</Alert> : null}
        <TextField
          select
          label="Committee"
          value={selectedCommitteeId}
          onChange={(event) => setSelectedCommitteeId(event.target.value)}
        >
          {committees.map((committee) => (
            <MenuItem key={committee.id} value={committee.id}>
              {committee.name}
            </MenuItem>
          ))}
        </TextField>

        <Divider />

        <Typography fontWeight={600}>Schedule meeting</Typography>
        <TextField label="Meeting title" value={meetingTitle} onChange={(event) => setMeetingTitle(event.target.value)} />
        <TextField
          label="Scheduled for"
          type="datetime-local"
          value={meetingDate}
          onChange={(event) => setMeetingDate(event.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <Box display="flex" justifyContent="flex-end">
          <Button variant="contained" onClick={createMeeting} disabled={!selectedCommitteeId || !meetingTitle || !meetingDate}>
            Create meeting
          </Button>
        </Box>

        <Divider />

        <Typography fontWeight={600}>Recorded meetings</Typography>
        <List dense>
          {meetings.map((meeting) => (
            <ListItem key={meeting.id} divider>
              <ListItemText primary={meeting.title} secondary={meeting.scheduled_for} />
            </ListItem>
          ))}
        </List>

        <Divider />

        <Typography fontWeight={600}>Record decision against latest meeting</Typography>
        <TextField label="Decision title" value={decisionTitle} onChange={(event) => setDecisionTitle(event.target.value)} />
        <TextField
          select
          label="Decision outcome"
          value={decisionOutcome}
          onChange={(event) => setDecisionOutcome(event.target.value)}
        >
          {["approved", "rejected", "accepted-risk", "deferred"].map((value) => (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          ))}
        </TextField>
        <Box display="flex" justifyContent="flex-end">
          <Button variant="contained" onClick={createDecision} disabled={!decisionTitle || meetings.length === 0}>
            Record decision
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}
