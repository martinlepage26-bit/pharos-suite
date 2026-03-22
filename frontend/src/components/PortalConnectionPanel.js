const PortalConnectionPanel = ({
  title,
  body,
  draftConfig,
  onDraftChange,
  onSave,
  onReset,
  tokenLabel = 'API token',
  helper,
  saveLabel = 'Save connection',
  resetLabel = 'Reset'
}) => (
  <div className="editorial-panel portal-connection-panel reveal">
    <div className="portal-section-head">
      <div>
        <p className="eyebrow">Connection</p>
        <h2>{title}</h2>
      </div>
      <p className="body-sm portal-connection-copy">{body}</p>
    </div>

    <div className="portal-connection-grid">
      <label className="portal-field">
        <span className="portal-field-label">Base URL</span>
        <input
          type="text"
          value={draftConfig.baseUrl}
          onChange={(event) => onDraftChange('baseUrl', event.target.value)}
          className="portal-input"
          placeholder="http://127.0.0.1:9205"
        />
      </label>

      <label className="portal-field">
        <span className="portal-field-label">{tokenLabel}</span>
        <input
          type="password"
          value={draftConfig.token}
          onChange={(event) => onDraftChange('token', event.target.value)}
          className="portal-input"
          placeholder="Optional until secure actions are needed"
        />
      </label>
    </div>

    {helper ? <p className="portal-note">{helper}</p> : null}

    <div className="portal-action-row">
      <button type="button" className="btn-dark" onClick={onSave}>
        {saveLabel}
      </button>
      <button type="button" className="btn-secondary portal-secondary-button" onClick={onReset}>
        {resetLabel}
      </button>
    </div>
  </div>
);

export default PortalConnectionPanel;
