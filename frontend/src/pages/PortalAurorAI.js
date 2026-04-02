import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  FileSearch,
  FileUp,
  Layers3,
  Link2,
  LoaderCircle,
  RefreshCw,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Trash2
} from 'lucide-react';
import SignalStrip from '../components/SignalStrip';
import PortalConnectionPanel from '../components/PortalConnectionPanel';
import {
  clearModuleConfig,
  formatDateTime,
  getModuleConfig,
  normalizeModuleConfig,
  normalizeList,
  requestModuleJson,
  saveModuleConfig
} from '../lib/modulePortalApi';

const MODULE_KEY = 'aurorai';

const defaultUploadForm = {
  file: null
};

const defaultPackageForm = {
  usecase_id: '',
  producer: 'aurorai',
  artifact_type: 'evidence_package',
  compassai_base_url: process.env.REACT_APP_COMPASSAI_URL || ''
};

const heroSignals = [
  {
    label: 'Module',
    title: 'Document intelligence layer',
    description: 'Aurora handles intake, classification, extraction, citation capture, and evidence packaging before records move into CompassAI.'
  },
  {
    label: 'Current backend truth',
    title: 'PDF, TXT, DOCX, guarded OCR',
    description: 'Aurora now accepts `.pdf`, `.txt`, and `.docx`. Image-only PDFs attempt OCR, and if the OCR runtime is unavailable the record stays explicit about that boundary.'
  },
  {
    label: 'Governance value',
    title: 'Every processing step becomes auditable',
    description: 'Categorization, extraction, summaries, citations, and handoff status now surface as governed workflow events instead of hidden background tasks.'
  }
];

const previewHeroSignals = [
  {
    label: 'Route',
    title: 'Aurora preview route',
    description: 'This preview keeps the Aurora route visible without exposing a public module API.'
  },
  {
    label: 'Preview boundary',
    title: 'Module API not publicly configured',
    description: 'No public Aurora module origin is configured for this PHAROS preview.'
  },
  {
    label: 'Current state',
    title: 'Live module data not exposed',
    description: 'Pipeline, category, document, upload, and handoff calls stay off on this preview.'
  }
];

const getSafeConfig = () => normalizeModuleConfig(MODULE_KEY, getModuleConfig(MODULE_KEY));

const PortalAurorAI = () => {
  const [config, setConfig] = useState(getSafeConfig);
  const [draftConfig, setDraftConfig] = useState(getSafeConfig);

  const [loading, setLoading] = useState(true);
  const [secureLoading, setSecureLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [secureError, setSecureError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [actionError, setActionError] = useState('');
  const [busyAction, setBusyAction] = useState('');

  const [pipelineInfo, setPipelineInfo] = useState(null);
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [operationResult, setOperationResult] = useState(null);

  const [uploadForm, setUploadForm] = useState(defaultUploadForm);
  const [packageForm, setPackageForm] = useState(defaultPackageForm);

  const moduleOriginConfigured = Boolean(config?.baseUrl);
  const authenticated = Boolean(config?.token);
  const activeHeroSignals = moduleOriginConfigured ? heroSignals : previewHeroSignals;
  const heroBody = moduleOriginConfigured
    ? 'Process documents into classified, extractable, governance-ready evidence while keeping each stage legible inside the PHAROS shell.'
    : 'Preview route only. The Aurora module API is not publicly configured, so live module data is not exposed here.';
  const previewUnavailableMessage = 'Preview unavailable. The Aurora module API is not publicly configured for this PHAROS preview.';
  const connectionBody = moduleOriginConfigured
    ? 'Pipeline metadata and category stats are public. Upload, document actions, and handoff flows require the Aurora API token.'
    : 'Preview unavailable. The Aurora module API is not publicly configured for this PHAROS preview.';
  const connectionHelper = moduleOriginConfigured
    ? 'Default local target is http://127.0.0.1:9206. The backend accepts PDF, TXT, and DOCX uploads. OCR is attempted for scan-heavy PDFs and degrades explicitly when the OCR runtime is unavailable.'
    : 'Live module data is not exposed on this preview until a public Aurora origin is configured.';

  const categoryBreakdown = useMemo(() => normalizeList(stats, 'stats'), [stats]);

  const resetActionState = () => {
    setActionMessage('');
    setActionError('');
    setOperationResult(null);
  };

  const loadPublicData = async () => {
    if (!config.baseUrl) {
      setPipelineInfo(null);
      setStats(null);
      setCategories([]);
      setLoading(false);
      setLoadError('');
      return;
    }

    setLoading(true);
    setLoadError('');

    try {
      const [pipelinePayload, statsPayload, categoriesPayload] = await Promise.all([
        requestModuleJson({ baseUrl: config.baseUrl, path: '/api/idp/pipeline' }),
        requestModuleJson({ baseUrl: config.baseUrl, path: '/api/stats' }),
        requestModuleJson({ baseUrl: config.baseUrl, path: '/api/categories' })
      ]);

      setPipelineInfo(pipelinePayload);
      setStats(statsPayload);
      setCategories(normalizeList(categoriesPayload, 'categories'));
    } catch (error) {
      setLoadError(error.message || 'Could not load Aurora pipeline metadata.');
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async () => {
    if (!config.baseUrl) {
      setDocuments([]);
      setSelectedDoc(null);
      setSelectedDocId('');
      setSecureLoading(false);
      setSecureError('');
      return;
    }

    if (!authenticated) {
      setDocuments([]);
      setSelectedDoc(null);
      setSecureError('');
      return;
    }

    setSecureLoading(true);
    setSecureError('');

    try {
      const payload = await requestModuleJson({
        baseUrl: config.baseUrl,
        path: '/api/documents',
        token: config.token
      });

      const nextDocuments = normalizeList(payload, 'documents');
      setDocuments(nextDocuments);

      if (!selectedDocId && nextDocuments[0]?.id) {
        setSelectedDocId(nextDocuments[0].id);
      }
    } catch (error) {
      setSecureError(error.message || 'Could not load secure document records.');
    } finally {
      setSecureLoading(false);
    }
  };

  const loadDocumentDetail = async () => {
    if (!config.baseUrl || !authenticated || !selectedDocId) {
      setSelectedDoc(null);
      return;
    }

    try {
      const payload = await requestModuleJson({
        baseUrl: config.baseUrl,
        path: `/api/documents/${selectedDocId}`,
        token: config.token
      });
      setSelectedDoc(payload);
    } catch (error) {
      setSelectedDoc(null);
    }
  };

  useEffect(() => {
    loadPublicData();
  }, [config.baseUrl]);

  useEffect(() => {
    loadDocuments();
  }, [config.baseUrl, config.token]);

  useEffect(() => {
    loadDocumentDetail();
  }, [config.baseUrl, config.token, selectedDocId, documents.length]);

  const handleDraftChange = (field, value) => {
    setDraftConfig((current) => ({ ...current, [field]: value }));
  };

  const handleSaveConnection = () => {
    const nextConfig = normalizeModuleConfig(MODULE_KEY, draftConfig);
    saveModuleConfig(MODULE_KEY, nextConfig);
    setConfig(nextConfig);
    resetActionState();
    setActionMessage('Aurora connection updated.');
  };

  const handleResetConnection = () => {
    clearModuleConfig(MODULE_KEY);
    const nextConfig = getSafeConfig();
    setConfig(nextConfig);
    setDraftConfig(nextConfig);
    resetActionState();
    setActionMessage('Aurora connection reset to local defaults.');
  };

  const uploadDocument = async (event) => {
    event.preventDefault();
    resetActionState();

    if (!uploadForm.file) {
      setActionError('Choose a PDF, TXT, or DOCX file before upload.');
      return;
    }

    setBusyAction('upload');
    try {
      const formData = new FormData();
      formData.append('file', uploadForm.file);

      const payload = await requestModuleJson({
        baseUrl: config.baseUrl,
        path: '/api/documents/upload',
        token: config.token,
        method: 'POST',
        formData
      });

      setActionMessage('Document uploaded to Aurora.');
      setUploadForm(defaultUploadForm);
      setSelectedDocId(payload.id);
      await Promise.all([loadDocuments(), loadPublicData()]);
    } catch (error) {
      setActionError(error.message || 'Upload failed.');
    } finally {
      setBusyAction('');
    }
  };

  const runDocumentAction = async (path, successMessage) => {
    if (!selectedDocId) {
      setActionError('Select a document first.');
      return;
    }

    resetActionState();
    setBusyAction(path);

    try {
      const payload = await requestModuleJson({
        baseUrl: config.baseUrl,
        path,
        token: config.token,
        method: 'POST'
      });
      setOperationResult(payload);
      setActionMessage(successMessage);
      await Promise.all([loadDocuments(), loadDocumentDetail(), loadPublicData()]);
    } catch (error) {
      setActionError(error.message || 'Document action failed.');
    } finally {
      setBusyAction('');
    }
  };

  const buildEvidencePackage = async () => {
    if (!selectedDocId) {
      setActionError('Select a document first.');
      return;
    }

    resetActionState();
    setBusyAction('evidence-package');

    try {
      const payload = await requestModuleJson({
        baseUrl: config.baseUrl,
        path: `/api/documents/${selectedDocId}/evidence-package`,
        token: config.token,
        method: 'POST',
        body: {
          usecase_id: packageForm.usecase_id,
          producer: packageForm.producer,
          artifact_type: packageForm.artifact_type
        }
      });
      setOperationResult(payload);
      setActionMessage('Evidence package generated.');
      await Promise.all([loadDocuments(), loadDocumentDetail()]);
    } catch (error) {
      setActionError(error.message || 'Evidence package generation failed.');
    } finally {
      setBusyAction('');
    }
  };

  const handoffToCompass = async () => {
    if (!selectedDocId) {
      setActionError('Select a document first.');
      return;
    }

    resetActionState();
    setBusyAction('handoff');

    try {
      const payload = await requestModuleJson({
        baseUrl: config.baseUrl,
        path: `/api/documents/${selectedDocId}/handoff-to-compassai`,
        token: config.token,
        method: 'POST',
        body: {
          usecase_id: packageForm.usecase_id,
          producer: packageForm.producer,
          artifact_type: packageForm.artifact_type,
          compassai_base_url: packageForm.compassai_base_url
        }
      });
      setOperationResult(payload);
      setActionMessage('Evidence handed off to CompassAI.');
      await Promise.all([loadDocuments(), loadDocumentDetail()]);
    } catch (error) {
      setActionError(error.message || 'CompassAI handoff failed.');
    } finally {
      setBusyAction('');
    }
  };

  const deleteDocument = async (documentId) => {
    if (!window.confirm('Delete this document record and file?')) return;

    resetActionState();
    setBusyAction('delete');

    try {
      await requestModuleJson({
        baseUrl: config.baseUrl,
        path: `/api/documents/${documentId}`,
        token: config.token,
        method: 'DELETE'
      });
      setActionMessage('Document deleted.');
      if (selectedDocId === documentId) {
        setSelectedDocId('');
        setSelectedDoc(null);
      }
      await Promise.all([loadDocuments(), loadPublicData()]);
    } catch (error) {
      setActionError(error.message || 'Delete failed.');
    } finally {
      setBusyAction('');
    }
  };

  return (
    <div data-testid="portal-aurorai-page">
      <div className="page-hero portal-module-hero">
        <div className="container">
          <div className="section-header">
            <p className="eyebrow">PHAROS product</p>
            <h1>Aurora</h1>
            <p className="body-lg" style={{ marginTop: '16px' }}>
              {heroBody}
            </p>
          </div>

          <SignalStrip items={activeHeroSignals} className="signal-grid-page signal-grid-light" />
        </div>
      </div>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container portal-stack">
          <PortalConnectionPanel
            title="Aurora backend connection"
            body={connectionBody}
            draftConfig={draftConfig}
            onDraftChange={handleDraftChange}
            onSave={handleSaveConnection}
            onReset={handleResetConnection}
            tokenLabel="Aurora API token"
            helper={connectionHelper}
          />

          {!moduleOriginConfigured ? (
            <div className="portal-status portal-status-warning">
              <AlertTriangle size={16} />
              <span>{previewUnavailableMessage}</span>
            </div>
          ) : null}

          {(actionMessage || actionError || loadError || secureError) ? (
            <div className={`portal-status portal-status-${actionError || loadError || secureError ? 'error' : 'success'}`}>
              {actionError || loadError || secureError || actionMessage}
            </div>
          ) : null}

          <div className="portal-metric-grid">
            {moduleOriginConfigured ? (
              <>
                <div className="portal-metric-card">
                  <Layers3 />
                  <span className="portal-metric-label">Pipeline stages</span>
                  <strong>{safeArray(pipelineInfo?.pipeline).length || 0}</strong>
                  <span className="portal-metric-foot">Intake to evidence handoff</span>
                </div>
                <div className="portal-metric-card">
                  <FileSearch />
                  <span className="portal-metric-label">Documents</span>
                  <strong>{stats?.total_documents ?? 0}</strong>
                  <span className="portal-metric-foot">Indexed inside Aurora</span>
                </div>
                <div className="portal-metric-card">
                  <Bot />
                  <span className="portal-metric-label">Categories</span>
                  <strong>{categories.length}</strong>
                  <span className="portal-metric-foot">Predefined routing buckets</span>
                </div>
                <div className="portal-metric-card">
                  <ShieldCheck />
                  <span className="portal-metric-label">Secure actions</span>
                  <strong>{authenticated ? 'Enabled' : 'Locked'}</strong>
                  <span className="portal-metric-foot">Token gates upload and downstream actions</span>
                </div>
              </>
            ) : (
              <>
                <div className="portal-metric-card">
                  <Layers3 />
                  <span className="portal-metric-label">Module API</span>
                  <strong>Unavailable</strong>
                  <span className="portal-metric-foot">Not publicly configured for preview</span>
                </div>
                <div className="portal-metric-card">
                  <FileSearch />
                  <span className="portal-metric-label">Live data</span>
                  <strong>Not exposed</strong>
                  <span className="portal-metric-foot">No public Aurora reads on this route</span>
                </div>
                <div className="portal-metric-card">
                  <Bot />
                  <span className="portal-metric-label">Secure actions</span>
                  <strong>Disabled</strong>
                  <span className="portal-metric-foot">Upload and document actions stay off</span>
                </div>
                <div className="portal-metric-card">
                  <ShieldCheck />
                  <span className="portal-metric-label">Route</span>
                  <strong>Available</strong>
                  <span className="portal-metric-foot">Redirect and navigation remain in place</span>
                </div>
              </>
            )}
          </div>

          {!moduleOriginConfigured ? (
            <>
              <div className="portal-grid portal-grid-halves">
                <div className="editorial-panel portal-card">
                  <div className="portal-section-head">
                    <div>
                      <p className="eyebrow">Preview boundary</p>
                      <h2>Preview unavailable</h2>
                    </div>
                    <p className="body-sm">
                      The Aurora module API is not publicly configured for this PHAROS preview. This route remains visible so navigation and redirect behavior can be checked.
                    </p>
                  </div>

                  <div className="scope-note">
                    <strong>What remains true</strong>
                    <ul className="portal-inline-list">
                      <li>`/portal/aurorai` still lands here.</li>
                      <li>No public Aurora module origin is configured.</li>
                      <li>Live module data is not exposed on this preview.</li>
                    </ul>
                  </div>
                </div>

                <div className="editorial-panel portal-card">
                  <div className="portal-section-head">
                    <div>
                      <p className="eyebrow">Disabled for preview</p>
                      <h2>Live module data is not exposed</h2>
                    </div>
                    <p className="body-sm">
                      When the module origin is unset, this route does not request Aurora module endpoints.
                    </p>
                  </div>

                  <div className="scope-note">
                    <strong>Disabled surfaces</strong>
                    <ul className="portal-inline-list">
                      <li>`/api/idp/pipeline`</li>
                      <li>`/api/stats` and `/api/categories`</li>
                      <li>`/api/documents` and upload/process actions</li>
                      <li>CompassAI handoff from this preview route</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="editorial-panel-dark portal-card portal-module-next-step">
                <div className="portal-section-head">
                  <div>
                    <p className="eyebrow">Preview boundary</p>
                    <h2>Aurora stays in preview-only mode here</h2>
                  </div>
                  <p className="body-sm">
                    This page stays preview-only until a public Aurora module origin is configured.
                  </p>
                </div>

                <div className="portal-action-row">
                  <Link to="/portal/compassai" className="btn-primary">
                    Open CompassAI
                    <ArrowRight />
                  </Link>
                </div>
              </div>
            </>
          ) : loading ? (
            <div className="portal-empty">
              <LoaderCircle className="portal-spin" />
              <p>Loading Aurora pipeline metadata...</p>
            </div>
          ) : (
            <>
              <div className="portal-grid portal-grid-halves">
                <div className="editorial-panel portal-card">
                  <div className="portal-section-head">
                    <div>
                      <p className="eyebrow">Pipeline</p>
                      <h2>Read the current IDP contract</h2>
                    </div>
                    <p className="body-sm">
                      The PHAROS route now exposes the same mission, stage order, and golden rules the Aurora backend publishes directly.
                    </p>
                  </div>

                  <div className="portal-list">
                    {safeArray(pipelineInfo?.pipeline).map((stage, index) => (
                      <div key={`${stage}-${index}`} className="scope-note">
                        <strong>{index + 1}. {stage}</strong>
                      </div>
                    ))}
                  </div>

                  <div className="scope-note">
                    <strong>Golden rules</strong>
                    <ul className="portal-inline-list">
                      {safeArray(pipelineInfo?.golden_rules).map((rule) => (
                        <li key={rule}>{rule}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="editorial-panel portal-card">
                  <div className="portal-section-head">
                    <div>
                      <p className="eyebrow">Category footprint</p>
                      <h2>See what Aurora is already classifying</h2>
                    </div>
                    <p className="body-sm">
                      These category counts are public in the backend today, so the PHAROS shell can show adoption without a token.
                    </p>
                  </div>

                  <div className="portal-list">
                    {categoryBreakdown.length === 0 ? (
                      <div className="portal-empty">
                        <p>No category counts returned yet.</p>
                      </div>
                    ) : categoryBreakdown.map((item) => (
                      <div key={item.category} className="scope-note portal-record">
                        <div className="portal-record-top">
                          <strong>{item.category}</strong>
                          <span className="portal-pill">{item.count}</span>
                        </div>
                        <p>{item.percentage}% of indexed documents</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="portal-grid portal-grid-halves">
                <div className="editorial-panel portal-card">
                  <div className="portal-section-head">
                    <div>
                      <p className="eyebrow">Upload</p>
                      <h2>Ingest documents into the evidence pipeline</h2>
                    </div>
                    <p className="body-sm">
                      The frontend now targets the live upload endpoint directly. Current backend support covers PDF, TXT, and DOCX, with OCR fallback for scan-heavy PDFs when the local runtime can provide it.
                    </p>
                  </div>

                  <div className="portal-status portal-status-warning">
                    <AlertTriangle size={16} />
                    <span>
                      Current backend boundary: legacy `.doc` remains unsupported. For image-only PDFs, Aurora will either recover text through OCR or record clearly that OCR was required but unavailable.
                    </span>
                  </div>

                  <form className="portal-form" onSubmit={uploadDocument}>
                    <label className="portal-field">
                      <span className="portal-field-label">Document file</span>
                      <input
                        type="file"
                        className="portal-input portal-input-file"
                        accept=".pdf,.txt,.docx"
                        onChange={(event) => setUploadForm({ file: event.target.files?.[0] || null })}
                        required
                      />
                    </label>

                    <div className="portal-action-row">
                      <button type="submit" className="btn-dark" disabled={!authenticated || busyAction === 'upload'}>
                        <FileUp size={16} />
                        Upload document
                      </button>
                    </div>
                  </form>
                </div>

                <div className="editorial-panel portal-card">
                  <div className="portal-section-head">
                    <div>
                      <p className="eyebrow">Document registry</p>
                      <h2>Work from a live document list</h2>
                    </div>
                    <p className="body-sm">
                      Single-document actions and record detail now share the same audit surface, which keeps the future bulk/single normalization work visible.
                    </p>
                  </div>

                  {secureLoading ? (
                    <div className="portal-empty">
                      <LoaderCircle className="portal-spin" />
                      <p>Loading Aurora document records...</p>
                    </div>
                  ) : !authenticated ? (
                    <div className="portal-empty">
                      <ShieldCheck />
                      <p>Add an Aurora token above to list documents and run the processing pipeline.</p>
                    </div>
                  ) : (
                    <div className="portal-list">
                      {documents.length === 0 ? (
                        <div className="portal-empty">
                          <p>No Aurora documents are indexed yet.</p>
                        </div>
                      ) : documents.map((document) => (
                        <button
                          type="button"
                          key={document.id}
                          className={`scope-note portal-record portal-record-button${selectedDocId === document.id ? ' active' : ''}`}
                          onClick={() => setSelectedDocId(document.id)}
                        >
                          <div className="portal-record-top">
                            <div>
                              <strong>{document.original_filename}</strong>
                              <p>{document.category || 'Uncategorized'} · {document.current_state || 'uploaded'}</p>
                            </div>
                            <div className="portal-record-actions">
                              <span className="portal-pill">{document.page_count || 0} page(s)</span>
                              <span
                                role="button"
                                tabIndex={0}
                                className="portal-icon-button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  deleteDocument(document.id);
                                }}
                                onKeyDown={(event) => {
                                  if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    deleteDocument(document.id);
                                  }
                                }}
                              >
                                <Trash2 size={16} />
                              </span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="portal-grid portal-grid-halves">
                <div className="editorial-panel portal-card">
                  <div className="portal-section-head">
                    <div>
                      <p className="eyebrow">Processing actions</p>
                      <h2>Classify, summarize, extract, and cite</h2>
                    </div>
                    <p className="body-sm">
                      These buttons call the live Aurora endpoints for the selected document. Each response is shown immediately so the PHAROS shell doubles as a review surface.
                    </p>
                  </div>

                  <div className="portal-action-grid">
                    <button
                      type="button"
                      className="btn-dark"
                      disabled={!authenticated || !selectedDocId || busyAction === `/api/documents/${selectedDocId}/categorize`}
                      onClick={() => runDocumentAction(`/api/documents/${selectedDocId}/categorize`, 'Classification complete.')}
                    >
                      <ScanSearch size={16} />
                      Categorize
                    </button>
                    <button
                      type="button"
                      className="btn-dark"
                      disabled={!authenticated || !selectedDocId || busyAction === `/api/documents/${selectedDocId}/summary`}
                      onClick={() => runDocumentAction(`/api/documents/${selectedDocId}/summary`, 'Summary generated.')}
                    >
                      <Sparkles size={16} />
                      Summary
                    </button>
                    <button
                      type="button"
                      className="btn-dark"
                      disabled={!authenticated || !selectedDocId || busyAction === `/api/documents/${selectedDocId}/extract`}
                      onClick={() => runDocumentAction(`/api/documents/${selectedDocId}/extract`, 'Field extraction complete.')}
                    >
                      <FileSearch size={16} />
                      Extract
                    </button>
                    <button
                      type="button"
                      className="btn-dark"
                      disabled={!authenticated || !selectedDocId || busyAction === `/api/documents/${selectedDocId}/citations`}
                      onClick={() => runDocumentAction(`/api/documents/${selectedDocId}/citations`, 'Citation extraction complete.')}
                    >
                      <Layers3 size={16} />
                      Citations
                    </button>
                  </div>

                  {operationResult ? (
                    <div className="scope-note">
                      <strong>Last response</strong>
                      <pre className="portal-pre">{JSON.stringify(operationResult, null, 2)}</pre>
                    </div>
                  ) : (
                    <div className="portal-empty">
                      <p>Select a document and run an action to inspect the live result here.</p>
                    </div>
                  )}
                </div>

                <div className="editorial-panel portal-card">
                  <div className="portal-section-head">
                    <div>
                      <p className="eyebrow">Selected document</p>
                      <h2>Read the current workflow state</h2>
                    </div>
                    <p className="body-sm">
                      The detail view shows how the current backend already captures state transitions, review triggers, and handoff history.
                    </p>
                  </div>

                  {!selectedDoc ? (
                    <div className="portal-empty">
                      <p>Choose a document to inspect its current state.</p>
                    </div>
                  ) : (
                    <div className="portal-stack-sm">
                      <div className="scope-note">
                        <strong>{selectedDoc.original_filename}</strong>
                        <p>
                          {selectedDoc.category || 'Uncategorized'}
                          {' '}· {selectedDoc.current_state || 'uploaded'}
                          {' '}· uploaded {formatDateTime(selectedDoc.uploaded_at)}
                        </p>
                      </div>

                      <div className="portal-key-value-grid">
                        <div className="portal-key-value">
                          <span>Document type</span>
                          <strong>{selectedDoc.document_type || 'Pending'}</strong>
                        </div>
                        <div className="portal-key-value">
                          <span>Review state</span>
                          <strong>{selectedDoc.current_review_state || 'Not started'}</strong>
                        </div>
                        <div className="portal-key-value">
                          <span>Confidence</span>
                          <strong>{selectedDoc.classification_confidence ? `${Math.round(selectedDoc.classification_confidence * 100)}%` : 'N/A'}</strong>
                        </div>
                        <div className="portal-key-value">
                          <span>Review required</span>
                          <strong>{selectedDoc.review_required ? 'Yes' : 'No'}</strong>
                        </div>
                      </div>

                      {selectedDoc.summary ? (
                        <div className="scope-note">
                          <strong>Summary</strong>
                          <p>{selectedDoc.summary}</p>
                        </div>
                      ) : null}

                      {(selectedDoc.control_checks || selectedDoc.handoff_history || selectedDoc.package_history) ? (
                        <div className="portal-summary-grid">
                          <div className="scope-note">
                            <strong>Control checks</strong>
                            <ul className="portal-inline-list">
                              {Object.entries(selectedDoc.control_checks || {}).flatMap(([key, value]) => (
                                safeArray(value).slice(0, 3).map((item) => <li key={`${key}-${item}`}>{item}</li>)
                              ))}
                              {!Object.values(selectedDoc.control_checks || {}).some((value) => safeArray(value).length > 0) ? <li>No flagged items yet.</li> : null}
                            </ul>
                          </div>
                          <div className="scope-note">
                            <strong>Handoff/package history</strong>
                            <ul className="portal-inline-list">
                              {safeArray(selectedDoc.package_history).slice(0, 2).map((item) => (
                                <li key={item.id}>Package v{item.version} · {item.usecase_id}</li>
                              ))}
                              {safeArray(selectedDoc.handoff_history).slice(0, 2).map((item) => (
                                <li key={item.id}>Handoff {item.status} · {item.target}</li>
                              ))}
                              {safeArray(selectedDoc.package_history).length === 0 && safeArray(selectedDoc.handoff_history).length === 0 ? <li>No package or handoff history yet.</li> : null}
                            </ul>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>

              <div className="editorial-panel portal-card">
                <div className="portal-section-head">
                  <div>
                    <p className="eyebrow">Evidence handoff</p>
                    <h2>Turn document output into CompassAI-ready evidence</h2>
                  </div>
                  <p className="body-sm">
                    This is the key bridge between the two modules: Aurora packages the document, then hands it to CompassAI’s governance intake using the append-only evidence endpoint.
                  </p>
                </div>

                <div className="portal-form-grid">
                  <label className="portal-field">
                    <span className="portal-field-label">Use case ID</span>
                    <input
                      className="portal-input"
                      value={packageForm.usecase_id}
                      onChange={(event) => setPackageForm((current) => ({ ...current, usecase_id: event.target.value }))}
                      placeholder="CompassAI use-case UUID"
                    />
                  </label>
                  <label className="portal-field">
                    <span className="portal-field-label">Producer</span>
                    <input
                      className="portal-input"
                      value={packageForm.producer}
                      onChange={(event) => setPackageForm((current) => ({ ...current, producer: event.target.value }))}
                    />
                  </label>
                  <label className="portal-field">
                    <span className="portal-field-label">Artifact type</span>
                    <input
                      className="portal-input"
                      value={packageForm.artifact_type}
                      onChange={(event) => setPackageForm((current) => ({ ...current, artifact_type: event.target.value }))}
                    />
                  </label>
                  <label className="portal-field">
                    <span className="portal-field-label">CompassAI base URL</span>
                    <input
                      className="portal-input"
                      value={packageForm.compassai_base_url}
                      onChange={(event) => setPackageForm((current) => ({ ...current, compassai_base_url: event.target.value }))}
                    />
                  </label>
                </div>

                <div className="portal-action-row">
                  <button type="button" className="btn-dark" disabled={!authenticated || !selectedDocId || busyAction === 'evidence-package'} onClick={buildEvidencePackage}>
                    <Link2 size={16} />
                    Build evidence package
                  </button>
                  <button type="button" className="btn-dark" disabled={!authenticated || !selectedDocId || busyAction === 'handoff'} onClick={handoffToCompass}>
                    <ArrowRight size={16} />
                    Handoff to CompassAI
                  </button>
                </div>
              </div>

              <div className="editorial-panel-dark portal-card portal-module-next-step">
                <div className="portal-section-head">
                  <div>
                    <p className="eyebrow">Module alignment</p>
                    <h2>Aurora now feeds CompassAI inside the PHAROS shell</h2>
                  </div>
                  <p className="body-sm">
                    The next backend step is to close the document-format and OCR gaps, then normalize bulk and single-document audit behavior behind this same PHAROS front end.
                  </p>
                </div>

                <div className="portal-action-row">
                  <Link to="/portal/compassai" className="btn-primary">
                    Open CompassAI
                    <ArrowRight />
                  </Link>
                  <button type="button" className="btn-secondary portal-secondary-button" onClick={() => Promise.all([loadPublicData(), loadDocuments(), loadDocumentDetail()])}>
                    <RefreshCw size={16} />
                    Refresh Aurora
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

const safeArray = (value) => (Array.isArray(value) ? value : []);

export default PortalAurorAI;
