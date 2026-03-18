import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CalendarClock,
  FileBadge2,
  FileUp,
  Gauge,
  Landmark,
  LoaderCircle,
  Network,
  Pencil,
  RefreshCw,
  ShieldCheck,
  Trash2
} from 'lucide-react';
import SignalStrip from '../components/SignalStrip';
import PortalConnectionPanel from '../components/PortalConnectionPanel';
import {
  clearModuleConfig,
  formatDateTime,
  getModuleConfig,
  normalizeModuleConfig,
  requestModuleJson,
  saveModuleConfig
} from '../lib/modulePortalApi';

const MODULE_KEY = 'compassai';

const defaultClientForm = {
  company_name: '',
  sector: 'SaaS',
  contact_name: '',
  contact_email: '',
  contact_title: '',
  jurisdiction: ''
};

const defaultSystemForm = {
  client_id: '',
  system_name: '',
  system_type: '',
  system_description: '',
  decision_role: 'Informational',
  user_type: 'Internal',
  high_stakes: false,
  intended_use: '',
  human_override: false
};

const defaultAssessmentForm = {
  client_id: '',
  ai_system_id: '',
  strict_mode: true
};

const defaultScheduleForm = {
  client_id: '',
  ai_system_id: '',
  frequency: 'monthly',
  notify_emails: ''
};

const defaultEvidenceForm = {
  assessment_id: '',
  control_id: '',
  description: '',
  file: null
};

const fallbackSectors = ['SaaS', 'Healthcare', 'Education', 'Public', 'Finance', 'Construction', 'Other'];

const heroSignals = [
  {
    label: 'Module',
    title: 'Governance execution layer',
    description: 'CompassAI turns evidence, system records, and review logic into assessments, deliverables, and scheduled governance follow-through.'
  },
  {
    label: 'Live now',
    title: 'Read surfaces first',
    description: 'The PHAROS shell can read live stats, records, benchmarks, and deliverables immediately while token-gated actions stay explicit.'
  },
  {
    label: 'Priority',
    title: 'One coherent flow',
    description: 'Clients, systems, assessments, evidence, and scheduled reviews now sit in one page instead of fragmented admin threads.'
  }
];

const safeArray = (value) => (Array.isArray(value) ? value : []);

const statusTone = (error) => (error ? 'error' : 'success');

const getSafeConfig = () => normalizeModuleConfig(MODULE_KEY, getModuleConfig(MODULE_KEY));

const PortalCompassAI = () => {
  const [config, setConfig] = useState(getSafeConfig);
  const [draftConfig, setDraftConfig] = useState(getSafeConfig);

  const [loading, setLoading] = useState(true);
  const [secureLoading, setSecureLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [secureError, setSecureError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [actionError, setActionError] = useState('');

  const [stats, setStats] = useState(null);
  const [clients, setClients] = useState([]);
  const [systems, setSystems] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [selectedBenchmarkSector, setSelectedBenchmarkSector] = useState('SaaS');
  const [benchmark, setBenchmark] = useState(null);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState('');
  const [deliverables, setDeliverables] = useState(null);
  const [scheduledAssessments, setScheduledAssessments] = useState([]);
  const [dueAssessments, setDueAssessments] = useState([]);

  const [clientForm, setClientForm] = useState(defaultClientForm);
  const [editingClientId, setEditingClientId] = useState('');

  const [systemForm, setSystemForm] = useState(defaultSystemForm);
  const [editingSystemId, setEditingSystemId] = useState('');

  const [assessmentForm, setAssessmentForm] = useState(defaultAssessmentForm);
  const [scheduleForm, setScheduleForm] = useState(defaultScheduleForm);
  const [evidenceForm, setEvidenceForm] = useState(defaultEvidenceForm);

  const authenticated = Boolean(config?.token);

  const sectorOptions = Array.from(new Set([
    ...fallbackSectors,
    ...clients.map((client) => client.sector).filter(Boolean)
  ]));

  const resetActionState = () => {
    setActionMessage('');
    setActionError('');
  };

  const loadPublicData = async () => {
    setLoading(true);
    setLoadError('');

    try {
      const [statsPayload, clientsPayload, systemsPayload, assessmentsPayload] = await Promise.all([
        requestModuleJson({ baseUrl: config.baseUrl, path: '/api/stats/dashboard' }),
        requestModuleJson({ baseUrl: config.baseUrl, path: '/api/clients' }),
        requestModuleJson({ baseUrl: config.baseUrl, path: '/api/ai-systems' }),
        requestModuleJson({ baseUrl: config.baseUrl, path: '/api/assessments' })
      ]);

      const nextClients = safeArray(clientsPayload);
      const nextSystems = safeArray(systemsPayload);
      const nextAssessments = safeArray(assessmentsPayload);

      setStats(statsPayload);
      setClients(nextClients);
      setSystems(nextSystems);
      setAssessments(nextAssessments);

      if (!selectedAssessmentId && nextAssessments[0]?.id) {
        setSelectedAssessmentId(nextAssessments[0].id);
      }

      if (!selectedBenchmarkSector && nextClients[0]?.sector) {
        setSelectedBenchmarkSector(nextClients[0].sector);
      }

      setAssessmentForm((current) => ({
        ...current,
        client_id: current.client_id || nextClients[0]?.id || '',
        ai_system_id: current.ai_system_id || nextSystems[0]?.id || ''
      }));

      setSystemForm((current) => ({
        ...current,
        client_id: current.client_id || nextClients[0]?.id || ''
      }));

      setScheduleForm((current) => ({
        ...current,
        client_id: current.client_id || nextClients[0]?.id || '',
        ai_system_id: current.ai_system_id || nextSystems[0]?.id || ''
      }));
    } catch (error) {
      setLoadError(error.message || 'Could not load CompassAI data.');
    } finally {
      setLoading(false);
    }
  };

  const loadSecureData = async () => {
    if (!authenticated) {
      setScheduledAssessments([]);
      setDueAssessments([]);
      setSecureError('');
      return;
    }

    setSecureLoading(true);
    setSecureError('');

    try {
      const [scheduledPayload, duePayload] = await Promise.all([
        requestModuleJson({
          baseUrl: config.baseUrl,
          path: '/api/scheduled-assessments',
          token: config.token
        }),
        requestModuleJson({
          baseUrl: config.baseUrl,
          path: '/api/scheduled-assessments/due',
          token: config.token
        })
      ]);

      setScheduledAssessments(safeArray(scheduledPayload));
      setDueAssessments(safeArray(duePayload));
    } catch (error) {
      setSecureError(error.message || 'Secure CompassAI endpoints could not be loaded.');
    } finally {
      setSecureLoading(false);
    }
  };

  const loadBenchmark = async () => {
    if (!selectedBenchmarkSector) {
      setBenchmark(null);
      return;
    }

    try {
      const payload = await requestModuleJson({
        baseUrl: config.baseUrl,
        path: `/api/benchmarks/${encodeURIComponent(selectedBenchmarkSector)}`
      });
      setBenchmark(payload);
    } catch (error) {
      setBenchmark(null);
    }
  };

  const loadDeliverables = async () => {
    if (!selectedAssessmentId) {
      setDeliverables(null);
      return;
    }

    try {
      const payload = await requestModuleJson({
        baseUrl: config.baseUrl,
        path: `/api/assessments/${selectedAssessmentId}/deliverables`
      });
      setDeliverables(payload);
    } catch (error) {
      setDeliverables(null);
    }
  };

  useEffect(() => {
    loadPublicData();
  }, [config.baseUrl]);

  useEffect(() => {
    loadSecureData();
  }, [config.baseUrl, config.token]);

  useEffect(() => {
    loadBenchmark();
  }, [config.baseUrl, selectedBenchmarkSector]);

  useEffect(() => {
    loadDeliverables();
  }, [config.baseUrl, selectedAssessmentId]);

  const handleDraftChange = (field, value) => {
    setDraftConfig((current) => ({ ...current, [field]: value }));
  };

  const handleSaveConnection = () => {
    const nextConfig = normalizeModuleConfig(MODULE_KEY, draftConfig);
    saveModuleConfig(MODULE_KEY, nextConfig);
    setConfig(nextConfig);
    resetActionState();
    setActionMessage('CompassAI connection updated.');
  };

  const handleResetConnection = () => {
    clearModuleConfig(MODULE_KEY);
    const nextConfig = getSafeConfig();
    setConfig(nextConfig);
    setDraftConfig(nextConfig);
    resetActionState();
    setActionMessage('CompassAI connection reset to local defaults.');
  };

  const submitClient = async (event) => {
    event.preventDefault();
    resetActionState();

    try {
      await requestModuleJson({
        baseUrl: config.baseUrl,
        path: editingClientId ? `/api/clients/${editingClientId}` : '/api/clients',
        token: config.token,
        method: editingClientId ? 'PUT' : 'POST',
        body: {
          company_name: clientForm.company_name,
          sector: clientForm.sector,
          primary_contact: {
            name: clientForm.contact_name,
            email: clientForm.contact_email,
            title: clientForm.contact_title
          },
          jurisdiction: clientForm.jurisdiction || null
        }
      });

      setActionMessage(editingClientId ? 'Client updated.' : 'Client created.');
      setClientForm(defaultClientForm);
      setEditingClientId('');
      await loadPublicData();
    } catch (error) {
      setActionError(error.message || 'Client save failed.');
    }
  };

  const beginEditClient = (client) => {
    setEditingClientId(client.id);
    setClientForm({
      company_name: client.company_name || '',
      sector: client.sector || 'SaaS',
      contact_name: client.primary_contact?.name || '',
      contact_email: client.primary_contact?.email || '',
      contact_title: client.primary_contact?.title || '',
      jurisdiction: client.jurisdiction || ''
    });
  };

  const deleteClient = async (clientId) => {
    if (!window.confirm('Delete this client record?')) return;

    resetActionState();
    try {
      await requestModuleJson({
        baseUrl: config.baseUrl,
        path: `/api/clients/${clientId}`,
        token: config.token,
        method: 'DELETE'
      });
      setActionMessage('Client deleted.');
      await loadPublicData();
    } catch (error) {
      setActionError(error.message || 'Client delete failed.');
    }
  };

  const submitSystem = async (event) => {
    event.preventDefault();
    resetActionState();

    try {
      await requestModuleJson({
        baseUrl: config.baseUrl,
        path: editingSystemId ? `/api/ai-systems/${editingSystemId}` : '/api/ai-systems',
        token: config.token,
        method: editingSystemId ? 'PUT' : 'POST',
        body: {
          client_id: systemForm.client_id,
          system_name: systemForm.system_name,
          system_type: systemForm.system_type,
          system_description: systemForm.system_description,
          decision_role: systemForm.decision_role,
          user_type: systemForm.user_type,
          high_stakes: systemForm.high_stakes,
          intended_use: systemForm.intended_use || null,
          human_override: systemForm.human_override
        }
      });

      setActionMessage(editingSystemId ? 'AI system updated.' : 'AI system created.');
      setEditingSystemId('');
      setSystemForm((current) => ({
        ...defaultSystemForm,
        client_id: current.client_id || clients[0]?.id || ''
      }));
      await loadPublicData();
    } catch (error) {
      setActionError(error.message || 'System save failed.');
    }
  };

  const beginEditSystem = (system) => {
    setEditingSystemId(system.id);
    setSystemForm({
      client_id: system.client_id || '',
      system_name: system.system_name || '',
      system_type: system.system_type || '',
      system_description: system.system_description || '',
      decision_role: system.decision_role || 'Informational',
      user_type: system.user_type || 'Internal',
      high_stakes: Boolean(system.high_stakes),
      intended_use: system.intended_use || '',
      human_override: Boolean(system.human_override)
    });
  };

  const deleteSystem = async (systemId) => {
    if (!window.confirm('Delete this AI system record?')) return;

    resetActionState();
    try {
      await requestModuleJson({
        baseUrl: config.baseUrl,
        path: `/api/ai-systems/${systemId}`,
        token: config.token,
        method: 'DELETE'
      });
      setActionMessage('AI system deleted.');
      await loadPublicData();
    } catch (error) {
      setActionError(error.message || 'System delete failed.');
    }
  };

  const submitAssessment = async (event) => {
    event.preventDefault();
    resetActionState();

    try {
      const payload = await requestModuleJson({
        baseUrl: config.baseUrl,
        path: '/api/assessments',
        token: config.token,
        method: 'POST',
        body: {
          client_id: assessmentForm.client_id,
          ai_system_id: assessmentForm.ai_system_id,
          queries: [],
          strict_mode: assessmentForm.strict_mode,
          governance: {
            scope_locked: false,
            allowed_uses_defined: false,
            prohibited_uses_defined: false
          }
        }
      });

      setActionMessage('Assessment created.');
      setSelectedAssessmentId(payload.id);
      await loadPublicData();
      await loadDeliverables();
    } catch (error) {
      setActionError(error.message || 'Assessment creation failed.');
    }
  };

  const submitSchedule = async (event) => {
    event.preventDefault();
    resetActionState();

    try {
      await requestModuleJson({
        baseUrl: config.baseUrl,
        path: '/api/scheduled-assessments',
        token: config.token,
        method: 'POST',
        body: {
          client_id: scheduleForm.client_id,
          ai_system_id: scheduleForm.ai_system_id,
          frequency: scheduleForm.frequency,
          notify_emails: scheduleForm.notify_emails
            .split(',')
            .map((value) => value.trim())
            .filter(Boolean)
        }
      });

      setActionMessage('Scheduled review created.');
      setScheduleForm((current) => ({ ...current, notify_emails: '' }));
      await loadSecureData();
    } catch (error) {
      setActionError(error.message || 'Schedule creation failed.');
    }
  };

  const deleteSchedule = async (scheduleId) => {
    if (!window.confirm('Deactivate this scheduled review?')) return;

    resetActionState();
    try {
      await requestModuleJson({
        baseUrl: config.baseUrl,
        path: `/api/scheduled-assessments/${scheduleId}`,
        token: config.token,
        method: 'DELETE'
      });
      setActionMessage('Scheduled review removed.');
      await loadSecureData();
    } catch (error) {
      setActionError(error.message || 'Schedule removal failed.');
    }
  };

  const submitEvidence = async (event) => {
    event.preventDefault();
    resetActionState();

    if (!evidenceForm.file) {
      setActionError('Choose a file before uploading evidence.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('assessment_id', evidenceForm.assessment_id);
      formData.append('control_id', evidenceForm.control_id);
      formData.append('description', evidenceForm.description);
      formData.append('file', evidenceForm.file);

      await requestModuleJson({
        baseUrl: config.baseUrl,
        path: '/api/evidence/upload',
        token: config.token,
        method: 'POST',
        formData
      });

      setActionMessage('Evidence uploaded.');
      setEvidenceForm((current) => ({
        ...defaultEvidenceForm,
        assessment_id: current.assessment_id || selectedAssessmentId
      }));
    } catch (error) {
      setActionError(error.message || 'Evidence upload failed.');
    }
  };

  const selectedAssessment = assessments.find((assessment) => assessment.id === selectedAssessmentId) || null;

  return (
    <div data-testid="portal-compassai-page">
      <div className="page-hero portal-module-hero">
        <div className="container">
          <div className="section-header">
            <p className="eyebrow">PHAROS product</p>
            <h1>CompassAI</h1>
            <p className="body-lg" style={{ marginTop: '16px' }}>
              Govern client records, system inventories, evidence, risk assessments, deliverables, and review cadence from one PHAROS-hosted surface.
            </p>
          </div>

          <SignalStrip items={heroSignals} className="signal-grid-page signal-grid-light" />
        </div>
      </div>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container portal-stack">
          <PortalConnectionPanel
            title="CompassAI backend connection"
            body="Public reads work immediately against the configured base URL. Create, update, schedule, and secure actions use the token field."
            draftConfig={draftConfig}
            onDraftChange={handleDraftChange}
            onSave={handleSaveConnection}
            onReset={handleResetConnection}
            tokenLabel="CompassAI bearer token"
            helper="Default local target is http://127.0.0.1:9205. Keep the token empty if you only need dashboard reads, clients, systems, assessments, and deliverables."
          />

          {(actionMessage || actionError || loadError || secureError) ? (
            <div className={`portal-status portal-status-${statusTone(actionError || loadError || secureError)}`}>
              {actionError || loadError || secureError || actionMessage}
            </div>
          ) : null}

          <div className="portal-metric-grid">
            <div className="portal-metric-card">
              <Gauge />
              <span className="portal-metric-label">Assessments</span>
              <strong>{stats?.assessments_count ?? assessments.length}</strong>
              <span className="portal-metric-foot">Average score {stats?.average_score ?? 0}</span>
            </div>
            <div className="portal-metric-card">
              <Landmark />
              <span className="portal-metric-label">Clients</span>
              <strong>{stats?.clients_count ?? clients.length}</strong>
              <span className="portal-metric-foot">Records available for governance intake</span>
            </div>
            <div className="portal-metric-card">
              <Network />
              <span className="portal-metric-label">AI systems</span>
              <strong>{stats?.systems_count ?? systems.length}</strong>
              <span className="portal-metric-foot">Tracked under one evidence shell</span>
            </div>
            <div className="portal-metric-card">
              <CalendarClock />
              <span className="portal-metric-label">Scheduled reviews</span>
              <strong>{authenticated ? scheduledAssessments.length : 0}</strong>
              <span className="portal-metric-foot">{authenticated ? `${dueAssessments.length} currently due` : 'Token needed for secure schedules'}</span>
            </div>
          </div>

          {loading ? (
            <div className="portal-empty">
              <LoaderCircle className="portal-spin" />
              <p>Loading CompassAI records and metrics...</p>
            </div>
          ) : (
            <>
              <div className="portal-grid portal-grid-halves">
                <div className="editorial-panel portal-card">
                  <div className="portal-section-head">
                    <div>
                      <p className="eyebrow">Client registry</p>
                      <h2>Manage organizations in scope</h2>
                    </div>
                    <p className="body-sm">
                      Create or refine the organizational record that anchors sector, contact, and jurisdiction.
                    </p>
                  </div>

                  <form className="portal-form" onSubmit={submitClient}>
                    <div className="portal-form-grid">
                      <label className="portal-field">
                        <span className="portal-field-label">Company name</span>
                        <input
                          className="portal-input"
                          value={clientForm.company_name}
                          onChange={(event) => setClientForm((current) => ({ ...current, company_name: event.target.value }))}
                          required
                        />
                      </label>
                      <label className="portal-field">
                        <span className="portal-field-label">Sector</span>
                        <select
                          className="portal-select"
                          value={clientForm.sector}
                          onChange={(event) => setClientForm((current) => ({ ...current, sector: event.target.value }))}
                        >
                          {fallbackSectors.map((sector) => (
                            <option key={sector} value={sector}>{sector}</option>
                          ))}
                        </select>
                      </label>
                      <label className="portal-field">
                        <span className="portal-field-label">Primary contact</span>
                        <input
                          className="portal-input"
                          value={clientForm.contact_name}
                          onChange={(event) => setClientForm((current) => ({ ...current, contact_name: event.target.value }))}
                          required
                        />
                      </label>
                      <label className="portal-field">
                        <span className="portal-field-label">Contact email</span>
                        <input
                          type="email"
                          className="portal-input"
                          value={clientForm.contact_email}
                          onChange={(event) => setClientForm((current) => ({ ...current, contact_email: event.target.value }))}
                          required
                        />
                      </label>
                      <label className="portal-field">
                        <span className="portal-field-label">Contact title</span>
                        <input
                          className="portal-input"
                          value={clientForm.contact_title}
                          onChange={(event) => setClientForm((current) => ({ ...current, contact_title: event.target.value }))}
                        />
                      </label>
                      <label className="portal-field">
                        <span className="portal-field-label">Jurisdiction</span>
                        <input
                          className="portal-input"
                          value={clientForm.jurisdiction}
                          onChange={(event) => setClientForm((current) => ({ ...current, jurisdiction: event.target.value }))}
                        />
                      </label>
                    </div>

                    <div className="portal-action-row">
                      <button type="submit" className="btn-dark" disabled={!authenticated}>
                        {editingClientId ? 'Update client' : 'Create client'}
                      </button>
                      {editingClientId ? (
                        <button
                          type="button"
                          className="btn-secondary portal-secondary-button"
                          onClick={() => {
                            setEditingClientId('');
                            setClientForm(defaultClientForm);
                          }}
                        >
                          Cancel edit
                        </button>
                      ) : null}
                    </div>
                  </form>

                  <div className="portal-list">
                    {clients.length === 0 ? (
                      <div className="portal-empty">
                        <p>No client records returned from CompassAI yet.</p>
                      </div>
                    ) : clients.map((client) => (
                      <div key={client.id} className="scope-note portal-record">
                        <div className="portal-record-top">
                          <div>
                            <strong>{client.company_name}</strong>
                            <p>{client.sector} · {client.primary_contact?.name || 'No contact listed'}</p>
                          </div>
                          <div className="portal-record-actions">
                            <button type="button" className="portal-icon-button" onClick={() => beginEditClient(client)} disabled={!authenticated}>
                              <Pencil size={16} />
                            </button>
                            <button type="button" className="portal-icon-button" onClick={() => deleteClient(client.id)} disabled={!authenticated}>
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <p className="portal-muted">{client.primary_contact?.email || 'No email'}{client.jurisdiction ? ` · ${client.jurisdiction}` : ''}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="editorial-panel portal-card">
                  <div className="portal-section-head">
                    <div>
                      <p className="eyebrow">System records</p>
                      <h2>Maintain the AI system register</h2>
                    </div>
                    <p className="body-sm">
                      Keep intended use, decision role, user exposure, and stakes attached to each system before assessment logic runs.
                    </p>
                  </div>

                  <form className="portal-form" onSubmit={submitSystem}>
                    <div className="portal-form-grid">
                      <label className="portal-field">
                        <span className="portal-field-label">Client</span>
                        <select
                          className="portal-select"
                          value={systemForm.client_id}
                          onChange={(event) => setSystemForm((current) => ({ ...current, client_id: event.target.value }))}
                          required
                        >
                          <option value="">Select a client</option>
                          {clients.map((client) => (
                            <option key={client.id} value={client.id}>{client.company_name}</option>
                          ))}
                        </select>
                      </label>
                      <label className="portal-field">
                        <span className="portal-field-label">System name</span>
                        <input
                          className="portal-input"
                          value={systemForm.system_name}
                          onChange={(event) => setSystemForm((current) => ({ ...current, system_name: event.target.value }))}
                          required
                        />
                      </label>
                      <label className="portal-field">
                        <span className="portal-field-label">System type</span>
                        <input
                          className="portal-input"
                          value={systemForm.system_type}
                          onChange={(event) => setSystemForm((current) => ({ ...current, system_type: event.target.value }))}
                          required
                        />
                      </label>
                      <label className="portal-field">
                        <span className="portal-field-label">Decision role</span>
                        <select
                          className="portal-select"
                          value={systemForm.decision_role}
                          onChange={(event) => setSystemForm((current) => ({ ...current, decision_role: event.target.value }))}
                        >
                          {['Informational', 'Advisory', 'Human-in-the-loop', 'Automated'].map((role) => (
                            <option key={role} value={role}>{role}</option>
                          ))}
                        </select>
                      </label>
                      <label className="portal-field">
                        <span className="portal-field-label">User type</span>
                        <select
                          className="portal-select"
                          value={systemForm.user_type}
                          onChange={(event) => setSystemForm((current) => ({ ...current, user_type: event.target.value }))}
                        >
                          {['Internal', 'External', 'Both'].map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </label>
                      <label className="portal-field">
                        <span className="portal-field-label">Intended use</span>
                        <input
                          className="portal-input"
                          value={systemForm.intended_use}
                          onChange={(event) => setSystemForm((current) => ({ ...current, intended_use: event.target.value }))}
                        />
                      </label>
                    </div>

                    <label className="portal-field">
                      <span className="portal-field-label">Description</span>
                      <textarea
                        className="portal-textarea"
                        value={systemForm.system_description}
                        onChange={(event) => setSystemForm((current) => ({ ...current, system_description: event.target.value }))}
                        rows={4}
                      />
                    </label>

                    <div className="portal-checkbox-row">
                      <label className="portal-checkbox">
                        <input
                          type="checkbox"
                          checked={systemForm.high_stakes}
                          onChange={(event) => setSystemForm((current) => ({ ...current, high_stakes: event.target.checked }))}
                        />
                        <span>High stakes</span>
                      </label>
                      <label className="portal-checkbox">
                        <input
                          type="checkbox"
                          checked={systemForm.human_override}
                          onChange={(event) => setSystemForm((current) => ({ ...current, human_override: event.target.checked }))}
                        />
                        <span>Human override available</span>
                      </label>
                    </div>

                    <div className="portal-action-row">
                      <button type="submit" className="btn-dark" disabled={!authenticated}>
                        {editingSystemId ? 'Update system' : 'Create system'}
                      </button>
                      {editingSystemId ? (
                        <button
                          type="button"
                          className="btn-secondary portal-secondary-button"
                          onClick={() => {
                            setEditingSystemId('');
                            setSystemForm((current) => ({ ...defaultSystemForm, client_id: current.client_id || clients[0]?.id || '' }));
                          }}
                        >
                          Cancel edit
                        </button>
                      ) : null}
                    </div>
                  </form>

                  <div className="portal-list">
                    {systems.length === 0 ? (
                      <div className="portal-empty">
                        <p>No AI systems returned from CompassAI yet.</p>
                      </div>
                    ) : systems.map((system) => (
                      <div key={system.id} className="scope-note portal-record">
                        <div className="portal-record-top">
                          <div>
                            <strong>{system.system_name}</strong>
                            <p>{system.system_type} · {system.decision_role}</p>
                          </div>
                          <div className="portal-record-actions">
                            <button type="button" className="portal-icon-button" onClick={() => beginEditSystem(system)} disabled={!authenticated}>
                              <Pencil size={16} />
                            </button>
                            <button type="button" className="portal-icon-button" onClick={() => deleteSystem(system.id)} disabled={!authenticated}>
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <p className="portal-muted">
                          {system.high_stakes ? 'High stakes' : 'Standard stakes'}
                          {system.user_type ? ` · ${system.user_type}` : ''}
                          {system.human_override ? ' · Human override' : ''}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="portal-grid portal-grid-halves">
                <div className="editorial-panel portal-card">
                  <div className="portal-section-head">
                    <div>
                      <p className="eyebrow">Assessment engine</p>
                      <h2>Run governance scoring and retrieve deliverables</h2>
                    </div>
                    <p className="body-sm">
                      Assessments remain tied to a client and system record, then surface readiness, risk tier, and the downstream package required for review.
                    </p>
                  </div>

                  <form className="portal-form" onSubmit={submitAssessment}>
                    <div className="portal-form-grid">
                      <label className="portal-field">
                        <span className="portal-field-label">Client</span>
                        <select
                          className="portal-select"
                          value={assessmentForm.client_id}
                          onChange={(event) => setAssessmentForm((current) => ({ ...current, client_id: event.target.value }))}
                          required
                        >
                          <option value="">Select a client</option>
                          {clients.map((client) => (
                            <option key={client.id} value={client.id}>{client.company_name}</option>
                          ))}
                        </select>
                      </label>
                      <label className="portal-field">
                        <span className="portal-field-label">AI system</span>
                        <select
                          className="portal-select"
                          value={assessmentForm.ai_system_id}
                          onChange={(event) => setAssessmentForm((current) => ({ ...current, ai_system_id: event.target.value }))}
                          required
                        >
                          <option value="">Select a system</option>
                          {systems.map((system) => (
                            <option key={system.id} value={system.id}>{system.system_name}</option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <label className="portal-checkbox">
                      <input
                        type="checkbox"
                        checked={assessmentForm.strict_mode}
                        onChange={(event) => setAssessmentForm((current) => ({ ...current, strict_mode: event.target.checked }))}
                      />
                      <span>Strict mode</span>
                    </label>

                    <div className="portal-action-row">
                      <button type="submit" className="btn-dark" disabled={!authenticated}>
                        Create assessment
                      </button>
                    </div>
                  </form>

                  <div className="portal-list">
                    {assessments.length === 0 ? (
                      <div className="portal-empty">
                        <p>No assessments returned yet.</p>
                      </div>
                    ) : assessments.map((assessment) => (
                      <button
                        type="button"
                        key={assessment.id}
                        className={`scope-note portal-record portal-record-button${selectedAssessmentId === assessment.id ? ' active' : ''}`}
                        onClick={() => setSelectedAssessmentId(assessment.id)}
                      >
                        <div className="portal-record-top">
                          <div>
                            <strong>{assessment.result?.risk_tier || 'Pending'} · Score {assessment.result?.score ?? 0}</strong>
                            <p>{formatDateTime(assessment.created_at)}</p>
                          </div>
                          <span className="portal-pill">{assessment.result?.readiness || 'Pending'}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="editorial-panel portal-card">
                  <div className="portal-section-head">
                    <div>
                      <p className="eyebrow">Deliverables</p>
                      <h2>Read the package a review body will see</h2>
                    </div>
                    <p className="body-sm">
                      The package view is wired to the selected assessment so the PHAROS shell shows the same roadmap, evidence requests, and checklist logic as CompassAI.
                    </p>
                  </div>

                  {!selectedAssessment || !deliverables ? (
                    <div className="portal-empty">
                      <FileBadge2 />
                      <p>Select an assessment to load deliverables.</p>
                    </div>
                  ) : (
                    <div className="portal-stack-sm">
                      <div className="scope-note">
                        <strong>Assessment {selectedAssessment.id.slice(0, 8)}</strong>
                        <p>
                          Risk tier {selectedAssessment.result?.risk_tier || 'Pending'} ·
                          {' '}Evidence confidence {selectedAssessment.result?.evidence_confidence ?? 0}
                        </p>
                      </div>

                      <div className="portal-summary-grid">
                        <div className="scope-note">
                          <strong>Immediate actions</strong>
                          <ul className="portal-inline-list">
                            {safeArray(deliverables.roadmap?.immediate_actions).slice(0, 4).map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                            {safeArray(deliverables.roadmap?.immediate_actions).length === 0 ? <li>No immediate actions listed.</li> : null}
                          </ul>
                        </div>
                        <div className="scope-note">
                          <strong>Evidence requests</strong>
                          <ul className="portal-inline-list">
                            {safeArray(deliverables.evidence_requests).slice(0, 4).map((item) => (
                              <li key={item.control_id || item.control_name}>{item.control_name || item.control_id}</li>
                            ))}
                            {safeArray(deliverables.evidence_requests).length === 0 ? <li>No additional evidence requested.</li> : null}
                          </ul>
                        </div>
                      </div>

                      <div className="scope-note">
                        <strong>Normative alignment</strong>
                        <div className="portal-key-value-grid">
                          {Object.entries(deliverables.normative_alignment || {}).map(([key, value]) => (
                            <div key={key} className="portal-key-value">
                              <span>{key.replace(/_/g, ' ')}</span>
                              <strong>{value ? 'Aligned' : 'Not aligned'}</strong>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="portal-grid portal-grid-halves">
                <div className="editorial-panel portal-card">
                  <div className="portal-section-head">
                    <div>
                      <p className="eyebrow">Benchmarks</p>
                      <h2>Compare posture against sector baselines</h2>
                    </div>
                    <p className="body-sm">
                      Benchmarks are public in the current backend, so the PHAROS shell can expose them before the secured admin surface is finalized.
                    </p>
                  </div>

                  <div className="portal-toolbar">
                    <label className="portal-field">
                      <span className="portal-field-label">Sector</span>
                      <select
                        className="portal-select"
                        value={selectedBenchmarkSector}
                        onChange={(event) => setSelectedBenchmarkSector(event.target.value)}
                      >
                        {sectorOptions.map((sector) => (
                          <option key={sector} value={sector}>{sector}</option>
                        ))}
                      </select>
                    </label>
                    <button type="button" className="btn-secondary portal-secondary-button" onClick={loadBenchmark}>
                      Refresh benchmark
                    </button>
                  </div>

                  {benchmark ? (
                    <div className="portal-summary-grid">
                      <div className="scope-note">
                        <strong>{benchmark.total_assessments || 0} assessments</strong>
                        <p>Average score {benchmark.avg_score || 0} · Median {benchmark.median_score || 0}</p>
                      </div>
                      <div className="scope-note">
                        <strong>Risk distribution</strong>
                        <p>
                          {Object.entries(benchmark.risk_distribution || {}).map(([tier, count]) => `${tier}: ${count}`).join(' · ') || 'No sector history yet'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="portal-empty">
                      <p>No benchmark returned for this sector yet.</p>
                    </div>
                  )}
                </div>

                <div className="editorial-panel portal-card">
                  <div className="portal-section-head">
                    <div>
                      <p className="eyebrow">Scheduled reviews</p>
                      <h2>Set the recurring governance cadence</h2>
                    </div>
                    <p className="body-sm">
                      Scheduled reviews are token-gated today because they affect active governance cadence and downstream notifications.
                    </p>
                  </div>

                  <form className="portal-form" onSubmit={submitSchedule}>
                    <div className="portal-form-grid">
                      <label className="portal-field">
                        <span className="portal-field-label">Client</span>
                        <select
                          className="portal-select"
                          value={scheduleForm.client_id}
                          onChange={(event) => setScheduleForm((current) => ({ ...current, client_id: event.target.value }))}
                          required
                        >
                          <option value="">Select a client</option>
                          {clients.map((client) => (
                            <option key={client.id} value={client.id}>{client.company_name}</option>
                          ))}
                        </select>
                      </label>
                      <label className="portal-field">
                        <span className="portal-field-label">AI system</span>
                        <select
                          className="portal-select"
                          value={scheduleForm.ai_system_id}
                          onChange={(event) => setScheduleForm((current) => ({ ...current, ai_system_id: event.target.value }))}
                          required
                        >
                          <option value="">Select a system</option>
                          {systems.map((system) => (
                            <option key={system.id} value={system.id}>{system.system_name}</option>
                          ))}
                        </select>
                      </label>
                      <label className="portal-field">
                        <span className="portal-field-label">Frequency</span>
                        <select
                          className="portal-select"
                          value={scheduleForm.frequency}
                          onChange={(event) => setScheduleForm((current) => ({ ...current, frequency: event.target.value }))}
                        >
                          {['weekly', 'monthly', 'quarterly', 'annually'].map((frequency) => (
                            <option key={frequency} value={frequency}>{frequency}</option>
                          ))}
                        </select>
                      </label>
                      <label className="portal-field">
                        <span className="portal-field-label">Notify emails</span>
                        <input
                          className="portal-input"
                          value={scheduleForm.notify_emails}
                          onChange={(event) => setScheduleForm((current) => ({ ...current, notify_emails: event.target.value }))}
                          placeholder="team@example.com, counsel@example.com"
                        />
                      </label>
                    </div>

                    <div className="portal-action-row">
                      <button type="submit" className="btn-dark" disabled={!authenticated}>
                        Create schedule
                      </button>
                    </div>
                  </form>

                  {secureLoading ? (
                    <div className="portal-empty">
                      <LoaderCircle className="portal-spin" />
                      <p>Loading scheduled reviews...</p>
                    </div>
                  ) : !authenticated ? (
                    <div className="portal-empty">
                      <ShieldCheck />
                      <p>Add a CompassAI token above to manage schedules and due reviews.</p>
                    </div>
                  ) : (
                    <div className="portal-list">
                      {scheduledAssessments.length === 0 ? (
                        <div className="portal-empty">
                          <p>No scheduled reviews configured yet.</p>
                        </div>
                      ) : scheduledAssessments.map((schedule) => (
                        <div key={schedule.id} className="scope-note portal-record">
                          <div className="portal-record-top">
                            <div>
                              <strong>{schedule.frequency}</strong>
                              <p>Next due {formatDateTime(schedule.next_due)}</p>
                            </div>
                            <button type="button" className="portal-icon-button" onClick={() => deleteSchedule(schedule.id)}>
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}

                      {dueAssessments.length > 0 ? (
                        <div className="scope-note portal-record portal-highlight">
                          <strong>{dueAssessments.length} review(s) currently due</strong>
                          <p>CompassAI is already flagging due cadence items through the scheduled-review endpoint.</p>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>

              <div className="editorial-panel portal-card">
                <div className="portal-section-head">
                  <div>
                    <p className="eyebrow">Evidence upload</p>
                    <h2>Attach supporting files to a control path</h2>
                  </div>
                  <p className="body-sm">
                    This route consumes the existing evidence upload endpoint directly, so PHAROS can attach files to assessment controls before deeper backend consolidation.
                  </p>
                </div>

                <form className="portal-form" onSubmit={submitEvidence}>
                  <div className="portal-form-grid">
                    <label className="portal-field">
                      <span className="portal-field-label">Assessment</span>
                      <select
                        className="portal-select"
                        value={evidenceForm.assessment_id}
                        onChange={(event) => setEvidenceForm((current) => ({ ...current, assessment_id: event.target.value }))}
                        required
                      >
                        <option value="">Select an assessment</option>
                        {assessments.map((assessment) => (
                          <option key={assessment.id} value={assessment.id}>
                            {assessment.id.slice(0, 8)} · {assessment.result?.risk_tier || 'Pending'}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="portal-field">
                      <span className="portal-field-label">Control ID</span>
                      <input
                        className="portal-input"
                        value={evidenceForm.control_id}
                        onChange={(event) => setEvidenceForm((current) => ({ ...current, control_id: event.target.value }))}
                        placeholder="e.g. GOV-01"
                        required
                      />
                    </label>
                    <label className="portal-field">
                      <span className="portal-field-label">Description</span>
                      <input
                        className="portal-input"
                        value={evidenceForm.description}
                        onChange={(event) => setEvidenceForm((current) => ({ ...current, description: event.target.value }))}
                      />
                    </label>
                    <label className="portal-field">
                      <span className="portal-field-label">File</span>
                      <input
                        type="file"
                        className="portal-input portal-input-file"
                        onChange={(event) => setEvidenceForm((current) => ({ ...current, file: event.target.files?.[0] || null }))}
                        required
                      />
                    </label>
                  </div>

                  <div className="portal-action-row">
                    <button type="submit" className="btn-dark">
                      <FileUp size={16} />
                      Upload evidence
                    </button>
                  </div>
                </form>
              </div>

              <div className="editorial-panel-dark portal-card portal-module-next-step">
                <div className="portal-section-head">
                  <div>
                    <p className="eyebrow">Downstream fit</p>
                    <h2>CompassAI is now live inside the PHAROS shell</h2>
                  </div>
                  <p className="body-sm">
                    The next backend move is consolidation, not reinvention: keep the PHAROS routes as the product shell, then rationalize auth, secret handling, and repository boundaries behind them.
                  </p>
                </div>

                <div className="portal-action-row">
                  <Link to="/portal/aurorai" className="btn-primary">
                    Open AurorAI
                    <ArrowRight />
                  </Link>
                  <button type="button" className="btn-secondary portal-secondary-button" onClick={loadPublicData}>
                    <RefreshCw size={16} />
                    Refresh CompassAI
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default PortalCompassAI;
