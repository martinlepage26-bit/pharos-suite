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
    description: 'AurorA handles intake, classification, extraction, citation capture, and evidence packaging before records move into CompassAI.'
  },
  {
    label: 'Current backend truth',
    title: 'PDF and TXT only today',
    description: 'The PHAROS route exposes the live upload contract honestly while flagging `.doc`, `.docx`, and OCR as the next backend lift.'
  },
  {
    label: 'Governance value',
    title: 'Every processing step becomes auditable',
    description: 'Categorization, extraction, summaries, citations, and handoff status now surface as governed workflow events instead of hidden background tasks.'
  }
];

const getSafeConfig = () => normalizeModuleConfig(MODULE_KEY, getModuleConfig(MODULE_KEY));

const PortalAurorA = () => {
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

  const authenticated = Boolean(config?.token);

  const categoryBreakdown = useMemo(() => normalizeList(stats, 'stats'), [stats]);

  const resetActionState = () => {
    setActionMessage('');
    setActionError('');
    setOperationResult(null);
  };

  const loadPublicData = async () => {
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
      setLoadError(error.message || 'Could not load AurorA pipeline metadata.');
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async () => {
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
    if (!authenticated || !selectedDocId) {
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
    setActionMessage('AurorA connection updated.');
  };

  const handleResetConnection = () => {
    clearModuleConfig(MODULE_KEY);
    const nextConfig = getSafeConfig();
    setConfig(nextConfig);
    setDraftConfig(nextConfig);
    resetActionState();
    setActionMessage('AurorA connection reset to local defaults.');
  };

  const uploadDocument = async (event) => {
    event.preventDefault();
    resetActionState();

    if (!uploadForm.file) {
      setActionError('Choose a PDF or TXT file before upload.');
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

      setActionMessage('Document uploaded to AurorA.');
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
            <h1>AurorA</h1>
            <p className="body-lg" style={{ marginTop: '16px' }}>
              Process documents into classified, extractable, governance-ready evidence while keeping each stage legible inside the PHAROS shell.
            </p>
          </div>

          <SignalStrip items={heroSignals} className="signal-grid-page signal-grid-light" />
        </div>
      </div>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container portal-stack">
          <PortalConnectionPanel
            title="AurorA backend connection"
            body="Pipeline metadata and category stats are public. Upload, document actions, and handoff flows require the AurorA API token."
            draftConfig={draftConfig}
            onDraftChange={handleDraftChange}
            onSave={handleSaveConnection}
            onReset={handleResetConnection}
            tokenLabel="AurorA API token"
            helper="Default local target is http://127.0.0.1:9206. The current backend only accepts PDF and TXT uploads; DOC/DOCX extraction and OCR still need implementation."
          />

          {(actionMessage || actionError || loadError || secureError) ? (
            <div className={`portal-status portal-status-${actionError || loadError || secureError ? 'error' : 'success'}`}>
              {actionError || loadError || secureError || actionMessage}
            </div>
          ) : null}

          <div className="portal-metric-grid">
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
              <span className="portal-metric-foot">Indexed inside AurorA</span>
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
          </div>

          {loading ? (
            <div className="portal-empty">
              <LoaderCircle className="portal-spin" />
              <p>Loading AurorA pipeline metadata...</p>
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
                      The PHAROS route now exposes the same mission, stage order, and golden rules the AurorA backend publishes directly.
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
                      <h2>See what AurorA is already classifying</h2>
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
                      The frontend now targets the live upload endpoint directly. Current backend support is PDF and TXT only; DOC, DOCX, and OCR remain next-phase work.
                    </p>
                  </div>

                  <div className="portal-status portal-status-warning">
                    <AlertTriangle size={16} />
                    <span>
                      Current backend constraint: `.doc`, `.docx`, and scanned-document OCR are not implemented yet, so this route deliberately reflects the real upload boundary instead of masking it.
                    </span>
                  </div>

                  <form className="portal-form" onSubmit={uploadDocument}>
                    <label className="portal-field">
                      <span className="portal-field-label">Document file</span>
                      <input
                        type="file"
                        className="portal-input portal-input-file"
                        accept=".pdf,.txt"
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
                      <p>Loading AurorA document records...</p>
                    </div>
                  ) : !authenticated ? (
                    <div className="portal-empty">
                      <ShieldCheck />
                      <p>Add an AurorA token above to list documents and run the processing pipeline.</p>
                    </div>
                  ) : (
                    <div className="portal-list">
                      {documents.length === 0 ? (
                        <div className="portal-empty">
                          <p>No AurorA documents are indexed yet.</p>
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
                              <button
                                type="button"
                                className="portal-icon-button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  deleteDocument(document.id);
                                }}
                              >
                                <Trash2 size={16} />
                              </button>
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
                      These buttons call the live AurorA endpoints for the selected document. Each response is shown immediately so the PHAROS shell doubles as a review surface.
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
                    This is the key bridge between the two modules: AurorA packages the document, then hands it to CompassAI’s governance intake using the append-only evidence endpoint.
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
                    <h2>AurorA now feeds the same shell that CompassAI lives in</h2>
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
                    Refresh AurorA
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

export default PortalAurorA;
