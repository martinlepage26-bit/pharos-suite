(async () => {
  const mappingTable = document.getElementById('mappingTable');
  const timelineTable = document.getElementById('timelineTable');
  const quickTable = document.getElementById('quickTable');
  const quickBody = document.getElementById('quickBody');
  const visualPanel = document.getElementById('visualPanel');

  if (!mappingTable || !timelineTable || !quickTable || !quickBody || !visualPanel) return;

  const searchInput = document.getElementById('filterSearch');
  const scoreInput = document.getElementById('scoreMin');
  const scoreLabel = document.getElementById('scoreLabel');
  const topOnly = document.getElementById('topOnly');
  const hideGeneric = document.getElementById('hideGeneric');
  const compactMode = document.getElementById('compactMode');

  const viewMode = document.getElementById('viewMode');
  const viewBadge = document.getElementById('viewBadge');
  const categorySelect = document.getElementById('categorySelect');
  const dateSelect = document.getElementById('dateSelect');

  const compareLeft = document.getElementById('compareLeft');
  const compareRight = document.getElementById('compareRight');
  const compareCardA = document.getElementById('compareCardA');
  const compareCardB = document.getElementById('compareCardB');
  const compareDiff = document.getElementById('compareDiff');

  const statOriginals = document.getElementById('statOriginals');
  const statVisible = document.getElementById('statVisible');
  const statAvg = document.getElementById('statAvg');

  const timelineBars = document.getElementById('timelineBars');
  const metaInspector = document.getElementById('metaInspector');
  const timelinePanel = document.getElementById('timelinePanel');
  const compareGrid = document.querySelector('#visualPanel .compare-grid');
  const controlsGrid = visualPanel.querySelector('.controls-grid');

  if (!searchInput || !scoreInput || !scoreLabel || !topOnly || !hideGeneric || !compactMode || !viewMode || !viewBadge || !categorySelect || !dateSelect || !compareLeft || !compareRight || !compareCardA || !compareCardB || !compareDiff || !statOriginals || !statVisible || !statAvg || !timelineBars || !metaInspector || !timelinePanel || !compareGrid || !controlsGrid) {
    return;
  }

  const safe = (x) => String(x == null ? '' : x);
  const cleanText = (cell) => (cell && cell.textContent ? cell.textContent.trim() : '');

  function escapeHtml(str) {
    return safe(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  // Access control is now enforced server-side in Cloudflare middleware.
  // Keep the frontend unlocked and avoid embedding credential material client-side.
  function unlockView() {
    document.body.classList.remove('auth-locked');
  }

  async function requirePassphraseGate() {
    unlockView();
  }

  function injectStyles() {
    if (document.getElementById('trackerDashboardStyles')) return;

    const style = document.createElement('style');
    style.id = 'trackerDashboardStyles';
    style.textContent = `
      .layer-title {
        margin: 0 0 8px;
        color: var(--navy);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-size: 0.84rem;
        font-weight: 800;
      }
      .exec-layer {
        border: 1px solid var(--line);
        border-radius: 12px;
        padding: 10px;
        margin-bottom: 10px;
        background: linear-gradient(180deg, #fff 0%, #f9f5ff 100%);
      }
      .kpi-grid {
        display: grid;
        grid-template-columns: repeat(5, minmax(150px, 1fr));
        gap: 8px;
      }
      .kpi-card {
        border: 1px solid var(--line);
        border-radius: 10px;
        background: #fff;
        padding: 8px;
      }
      .kpi-name {
        font-size: 0.68rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #4b4b67;
        font-weight: 700;
      }
      .kpi-value {
        font-size: 1.08rem;
        font-weight: 800;
        margin-top: 4px;
      }
      .kpi-note {
        margin-top: 4px;
        font-size: 0.71rem;
        color: #616172;
      }
      .legend-wrap {
        margin-top: 10px;
        display: grid;
        grid-template-columns: 1fr;
        gap: 8px;
      }
      .legend-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(180px, 1fr));
        gap: 8px;
      }
      .legend-item {
        border: 1px solid var(--line);
        border-radius: 10px;
        padding: 6px 8px;
        background: #fff;
        font-size: 0.75rem;
      }
      .status-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        border-radius: 999px;
        border: 1px solid var(--line);
        padding: 2px 8px;
        font-size: 0.68rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        white-space: nowrap;
      }
      .status-badge .tag {
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        font-size: 0.66rem;
        opacity: 0.9;
      }
      .status-matched { background: #ecf9f1; color: #175636; border-color: #bae2cb; }
      .status-likely { background: #eef5ff; color: #1d3e75; border-color: #c0d4f5; }
      .status-review { background: #fff4e8; color: #7b460f; border-color: #f3d2ab; }
      .status-master-only { background: #f2efff; color: #4d2f82; border-color: #d8c9f4; }
      .status-hephaistos-only { background: #ecf3ff; color: #1d3e75; border-color: #c3d4f3; }
      .status-ambiguous { background: #fdeff3; color: #7f1f48; border-color: #efc5d5; }
      .status-missing { background: #f5f5f8; color: #44445a; border-color: #d8d8e0; }
      .warning-band {
        border: 1px dashed #d8b4b4;
        border-radius: 10px;
        padding: 8px;
        background: #fff8f8;
        font-size: 0.75rem;
        color: #482323;
      }
      .warning-band ul {
        margin: 6px 0 0;
        padding-left: 18px;
      }
      .chip-row {
        margin-top: 8px;
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        align-items: center;
      }
      .filter-chip {
        border: 1px solid var(--line);
        border-radius: 999px;
        padding: 2px 8px;
        font-size: 0.7rem;
        background: #fff;
        color: #2f3156;
        cursor: pointer;
      }
      .filter-chip:hover,
      .filter-chip:focus {
        outline: none;
        border-color: var(--purple);
        background: #faf4ff;
      }
      .chip-help {
        font-size: 0.71rem;
        color: #64647a;
      }
      .analytics-layer {
        border: 1px solid var(--line);
        border-radius: 12px;
        padding: 10px;
        margin-bottom: 10px;
        background: linear-gradient(180deg, #fff 0%, #fdfaff 100%);
      }
      .analytics-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 8px;
      }
      .chart-card {
        border: 1px solid var(--line);
        border-radius: 10px;
        padding: 8px;
        background: #fff;
      }
      .chart-card h3 {
        margin: 0 0 6px;
        font-size: 0.77rem;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: var(--navy);
      }
      .chart-note {
        margin-top: 6px;
        font-size: 0.69rem;
        color: #666677;
      }
      .dist-list {
        display: grid;
        gap: 5px;
      }
      .dist-row {
        display: grid;
        grid-template-columns: minmax(90px, 1.2fr) minmax(120px, 2.6fr) 64px;
        gap: 6px;
        align-items: center;
        font-size: 0.72rem;
      }
      .dist-label {
        color: #303050;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .dist-track {
        position: relative;
        height: 9px;
        border-radius: 999px;
        background: #efe7fb;
        overflow: hidden;
      }
      .dist-fill {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        border-radius: inherit;
        background: linear-gradient(90deg, #102753 0%, #5b2a86 100%);
      }
      .dist-value {
        text-align: right;
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        color: #3f3f50;
      }
      .donut-wrap {
        display: grid;
        grid-template-columns: 110px 1fr;
        gap: 8px;
        align-items: center;
      }
      .donut {
        width: 104px;
        height: 104px;
        border-radius: 50%;
        position: relative;
        border: 1px solid var(--line);
      }
      .donut::after {
        content: '';
        position: absolute;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: #fff;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border: 1px solid #efe7fb;
      }
      .legend-list {
        display: grid;
        gap: 4px;
        font-size: 0.72rem;
      }
      .legend-line {
        display: grid;
        grid-template-columns: 12px 1fr auto;
        align-items: center;
        gap: 6px;
      }
      .legend-dot {
        width: 10px;
        height: 10px;
        border-radius: 2px;
        border: 1px solid rgba(0,0,0,0.15);
      }
      .control-dock {
        position: sticky;
        top: 0;
        z-index: 4;
        background: linear-gradient(180deg, rgba(255,255,255,0.97), rgba(255,255,255,0.93));
        border: 1px solid var(--line);
        border-radius: 12px;
        padding: 8px;
        margin-bottom: 10px;
        backdrop-filter: blur(2px);
      }
      .audit-extra-controls {
        display: grid;
        grid-template-columns: repeat(4, minmax(180px, 1fr));
        gap: 8px;
        margin-top: 8px;
      }
      .control-group-title {
        font-size: 0.72rem;
        color: #4e4e64;
        margin: 2px 0 4px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-weight: 700;
      }
      .scale-wrap {
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .meter {
        display: inline-flex;
        gap: 2px;
      }
      .meter i {
        width: 10px;
        height: 8px;
        border-radius: 2px;
        background: #e4deef;
        border: 1px solid #d3c8e7;
      }
      .meter i.on {
        background: linear-gradient(180deg, #5b2a86, #102753);
        border-color: #4f3880;
      }
      .meter-label {
        font-size: 0.7rem;
        color: #3b3b55;
        text-transform: uppercase;
        font-weight: 700;
        letter-spacing: 0.04em;
      }
      .record-title {
        font-weight: 800;
        color: #15152d;
        margin-bottom: 4px;
      }
      .badge-stack {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
      }
      .data-chip {
        display: inline-block;
        border: 1px solid var(--line);
        border-radius: 999px;
        padding: 2px 8px;
        font-size: 0.67rem;
        background: #f6f8ff;
        color: #2f3468;
        white-space: nowrap;
      }
      .format-chip {
        display: inline-block;
        border: 1px solid #cfd8f0;
        border-radius: 6px;
        padding: 1px 5px;
        font-size: 0.66rem;
        margin-right: 4px;
        background: #eef4ff;
        color: #2b4976;
      }
      .chrono-strip {
        border: 1px solid #ded4ef;
        border-radius: 8px;
        padding: 4px 6px;
        background: #fcf9ff;
        font-size: 0.68rem;
        line-height: 1.3;
      }
      .chrono-date {
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        color: #2f2f48;
      }
      .freshness-tag {
        display: inline-block;
        margin-top: 4px;
        border: 1px solid #d8c8f3;
        border-radius: 999px;
        padding: 1px 6px;
        font-size: 0.62rem;
        background: #f5efff;
        color: #513080;
      }
      .attention-cell {
        display: grid;
        gap: 4px;
      }
      .path-preview {
        font-size: 0.66rem;
        color: #4f4f66;
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        margin-top: 4px;
      }
      .meta-inspector.audit {
        margin-top: 10px;
        background: #fff;
      }
      .inspector-head {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 8px;
        margin-bottom: 8px;
      }
      .inspector-title {
        margin: 0;
        color: var(--navy);
        font-size: 0.95rem;
      }
      .inspector-grid {
        display: grid;
        grid-template-columns: 180px 1fr;
        gap: 6px 10px;
        font-size: 0.78rem;
      }
      .inspector-key {
        text-transform: uppercase;
        letter-spacing: 0.04em;
        font-size: 0.7rem;
        color: #50506a;
        font-weight: 700;
      }
      .inspector-val {
        word-break: break-word;
        color: #22223a;
      }
      .inline-path {
        display: grid;
        gap: 3px;
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        font-size: 0.71rem;
      }
      .path-file {
        color: #142f61;
        font-weight: 700;
      }
      .path-context {
        color: #5b5b73;
      }
      .raw-details {
        margin-top: 8px;
      }
      .raw-details summary {
        cursor: pointer;
        font-size: 0.77rem;
        font-weight: 700;
        color: #2f3358;
      }
      .inner-table-wrap {
        margin-top: 6px;
        border: 1px solid var(--line);
        border-radius: 10px;
        overflow: auto;
      }
      .inner-table {
        width: 100%;
        border-collapse: collapse;
        min-width: 640px;
        font-size: 0.74rem;
      }
      .inner-table th,
      .inner-table td {
        border-bottom: 1px solid #efe7fb;
        padding: 6px;
        text-align: left;
        vertical-align: top;
      }
      .inner-table th {
        background: #f5efff;
        color: #27345f;
        position: sticky;
        top: 0;
      }
      .compare-subtitle {
        margin: 6px 0 0;
        color: #5c5c74;
        font-size: 0.72rem;
      }
      .timeline-controls {
        display: grid;
        grid-template-columns: repeat(4, minmax(180px, 1fr));
        gap: 8px;
        margin-bottom: 10px;
      }
      .timeline-inspector {
        margin-top: 8px;
        border: 1px solid var(--line);
        border-radius: 10px;
        padding: 8px;
        background: #fdfaff;
        font-size: 0.78rem;
      }
      .timeline-row {
        cursor: pointer;
        transition: background 0.15s ease;
        border-radius: 8px;
        padding: 2px 4px;
      }
      .timeline-row:hover { background: #f3ecff; }
      .timeline-row.active { background: #e7dbff; }
      .record-summary-details {
        margin-top: 8px;
      }
      .record-summary-details summary {
        cursor: pointer;
        color: #363a67;
        font-size: 0.74rem;
        font-weight: 700;
      }
      @media (max-width: 1280px) {
        .kpi-grid { grid-template-columns: repeat(3, minmax(150px, 1fr)); }
        .legend-grid { grid-template-columns: repeat(2, minmax(170px, 1fr)); }
        .analytics-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .audit-extra-controls { grid-template-columns: repeat(2, minmax(180px, 1fr)); }
      }
      @media (max-width: 860px) {
        .kpi-grid { grid-template-columns: repeat(2, minmax(130px, 1fr)); }
        .legend-grid { grid-template-columns: 1fr; }
        .analytics-grid { grid-template-columns: 1fr; }
        .audit-extra-controls { grid-template-columns: 1fr; }
        .timeline-controls { grid-template-columns: 1fr; }
        .inspector-grid { grid-template-columns: 1fr; }
        .dist-row { grid-template-columns: minmax(80px,1fr) minmax(100px,2fr) 58px; }
      }
    `;
    document.head.appendChild(style);
  }

  const STATUS_MODEL = {
    matched: {
      label: 'Matched',
      short: 'OK',
      className: 'status-matched',
      help: 'High-confidence one-to-one alignment.'
    },
    likely_matched: {
      label: 'Likely Matched',
      short: 'LIKELY',
      className: 'status-likely',
      help: 'Strong signal but not fully conflict-free.'
    },
    needs_review: {
      label: 'Needs Review',
      short: 'REVIEW',
      className: 'status-review',
      help: 'Insufficient confidence or unresolved variance.'
    },
    master_pack_only: {
      label: 'Master Pack Only',
      short: 'MASTER',
      className: 'status-master-only',
      help: 'Original present without rebuilt counterpart.'
    },
    hephaistos_only: {
      label: 'Hephaistos Only',
      short: 'HEPH',
      className: 'status-hephaistos-only',
      help: 'Rebuilt present without original counterpart.'
    },
    ambiguous_collision: {
      label: 'Ambiguous / Collision',
      short: 'AMBIG',
      className: 'status-ambiguous',
      help: 'Competing variants are too close to disambiguate automatically.'
    },
    missing_metadata: {
      label: 'Missing Metadata',
      short: 'MISSING',
      className: 'status-missing',
      help: 'Critical metadata fields are empty or generic.'
    }
  };

  const CONFIDENCE_ORDER = ['high', 'medium', 'low'];
  const DONUT_COLORS = ['#102753', '#5b2a86', '#7b4cb1', '#2c5f9e', '#7a2f5f', '#59607f', '#ad6a22'];

  function confidenceClass(score) {
    if (score >= 0.78) return 'high';
    if (score >= 0.58) return 'medium';
    return 'low';
  }

  function confidenceLabel(score) {
    const c = confidenceClass(score);
    if (c === 'high') return 'High';
    if (c === 'medium') return 'Medium';
    return 'Low';
  }

  function meterLevelFromPercent(percent) {
    if (percent >= 85) return 5;
    if (percent >= 65) return 4;
    if (percent >= 45) return 3;
    if (percent >= 25) return 2;
    if (percent > 0) return 1;
    return 0;
  }

  function renderMeter(value, max, label) {
    const ratio = max > 0 ? Math.max(0, Math.min(1, value / max)) : 0;
    const level = meterLevelFromPercent(ratio * 100);
    const segments = Array.from({ length: 5 }, (_, i) => `<i class="${i < level ? 'on' : ''}"></i>`).join('');
    return `<span class="scale-wrap"><span class="meter" aria-hidden="true">${segments}</span><span class="meter-label">${escapeHtml(label)}</span></span>`;
  }

  function safeLower(value) {
    return safe(value).toLowerCase();
  }

  function normalizeSpace(value) {
    return safe(value).replace(/\s+/g, ' ').trim();
  }

  function extractExtension(...values) {
    for (const value of values) {
      const text = safe(value).trim();
      if (!text) continue;
      const normalized = text.replace(/\\/g, '/');
      const leaf = normalized.split('/').pop() || normalized;
      const m = leaf.match(/\.([A-Za-z0-9]{1,8})$/);
      if (m) return m[1].toLowerCase();
    }
    return 'none';
  }

  function firstPathSegment(pathText) {
    const path = safe(pathText).replace(/\\/g, '/').trim();
    if (!path) return '';
    const pieces = path.split('/').filter(Boolean);
    if (!pieces.length) return '';
    if (pieces.length === 1) return '';
    return pieces[0];
  }

  function prettyTitle(name) {
    const text = normalizeSpace(name);
    if (!text) return 'Untitled';
    const withoutExt = text.replace(/\.[A-Za-z0-9]{1,8}$/, '');
    const cleaned = withoutExt
      .replace(/[_]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return cleaned || text;
  }

  function normalizeGroupKey(name, pathText) {
    const candidate = normalizeSpace(name) || normalizeSpace(pathText) || 'untitled';
    return candidate
      .toLowerCase()
      .replace(/\.[a-z0-9]{1,8}$/i, '')
      .replace(/[_\-]+/g, ' ')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function validDateParts(y, m, d) {
    const yy = Number(y);
    const mm = Number(m);
    const dd = Number(d);
    if (!Number.isInteger(yy) || !Number.isInteger(mm) || !Number.isInteger(dd)) return false;
    if (yy < 2000 || yy > 2099) return false;
    const dt = new Date(Date.UTC(yy, mm - 1, dd));
    return dt.getUTCFullYear() === yy && dt.getUTCMonth() === mm - 1 && dt.getUTCDate() === dd;
  }

  function extractDates(text) {
    const source = safe(text);
    const set = new Set();

    const dashRe = /\b(20\d{2})-(\d{2})-(\d{2})\b/g;
    let m;
    while ((m = dashRe.exec(source)) !== null) {
      if (validDateParts(m[1], m[2], m[3])) set.add(`${m[1]}-${m[2]}-${m[3]}`);
    }

    const compactRe = /\b(20\d{2})(\d{2})(\d{2})\b/g;
    while ((m = compactRe.exec(source)) !== null) {
      if (validDateParts(m[1], m[2], m[3])) set.add(`${m[1]}-${m[2]}-${m[3]}`);
    }

    return Array.from(set).sort();
  }

  function toDateNum(dateStr) {
    if (!dateStr || dateStr === 'undated') return Number.NaN;
    const parts = dateStr.split('-').map(Number);
    if (parts.length !== 3) return Number.NaN;
    return Date.UTC(parts[0], parts[1] - 1, parts[2]);
  }

  function daysBetween(dateA, dateB) {
    const a = toDateNum(dateA);
    const b = toDateNum(dateB);
    if (Number.isNaN(a) || Number.isNaN(b)) return null;
    return Math.max(0, Math.round((b - a) / 86400000));
  }

  function detectVersionSignals(...texts) {
    const source = texts.map((v) => safe(v)).join(' | ');
    const lower = source.toLowerCase();
    const signals = new Set();

    if (/\bv\d+(?:\.\d+)?\b/i.test(source)) signals.add('v-token');
    if (/\bversion\b/i.test(source)) signals.add('version');
    if (/\bfinal\b/i.test(source)) signals.add('final');
    if (/\bdraft\b/i.test(source)) signals.add('draft');
    if (/\brev(?:ised|ision)?\b/i.test(source)) signals.add('revised');
    if (/\bpass\s*\d*\b/i.test(source)) signals.add('pass');
    if (/\bcopy(?:\s*\(\d+\)|\s*\d+)?\b/i.test(source)) signals.add('copy');
    if (/\bnormalized\b/i.test(source)) signals.add('normalized');
    if (/\bmaster\b/i.test(source)) signals.add('master');
    if (/\b20\d{2}-\d{2}-\d{2}\b/.test(source) || /\b20\d{6}\b/.test(source)) signals.add('dated-tag');
    if (/\bexport\b/.test(lower)) signals.add('export');

    return Array.from(signals);
  }

  function isGenericValue(value) {
    const lower = safeLower(value);
    if (!lower) return true;
    if (lower === 'context-dependent') return true;
    if (lower === 'named artifact') return true;
    if (lower === 'document') return true;
    if (lower.includes('how this artifact contributes')) return true;
    if (lower.includes('maintains legibility')) return true;
    return false;
  }

  function shortenPath(pathText) {
    const raw = safe(pathText).replace(/\\/g, '/').trim();
    if (!raw) return { short: 'n/a', context: 'n/a', file: 'n/a', full: '' };

    const parts = raw.split('/').filter(Boolean);
    const file = parts[parts.length - 1] || raw;
    const contextParts = parts.slice(0, -1);
    const context = contextParts.join('/') || '(root)';

    if (parts.length <= 4) {
      return {
        short: raw,
        context,
        file,
        full: raw
      };
    }

    const short = `${parts.slice(0, 1).join('/')}/.../${parts.slice(-3).join('/')}`;
    return {
      short,
      context,
      file,
      full: raw
    };
  }

  function countBy(items, keyFn) {
    const map = new Map();
    for (const item of items) {
      const key = keyFn(item);
      map.set(key, (map.get(key) || 0) + 1);
    }
    return map;
  }

  function topFromCountMap(map, fallback) {
    let bestKey = fallback;
    let bestCount = -1;
    for (const [key, count] of map.entries()) {
      if (count > bestCount) {
        bestCount = count;
        bestKey = key;
      }
    }
    return bestKey;
  }

  function parseTimelineRows() {
    return Array.from(timelineTable.tBodies[0]?.rows || []).map((tr) => ({
      tr,
      date: cleanText(tr.cells[0]),
      hephaistos: Number.parseFloat(cleanText(tr.cells[1])) || 0,
      masterPack: Number.parseFloat(cleanText(tr.cells[2])) || 0,
      masterCore: Number.parseFloat(cleanText(tr.cells[3])) || 0
    }));
  }

  const timelineRows = parseTimelineRows();

  function startOfWeekUTC(dateStr) {
    const [y, m, d] = dateStr.split('-').map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d));
    const day = dt.getUTCDay();
    const diff = (day + 6) % 7;
    dt.setUTCDate(dt.getUTCDate() - diff);
    return dt.toISOString().slice(0, 10);
  }

  function startOfMonth(dateStr) {
    return `${dateStr.slice(0, 7)}-01`;
  }

  function bucketDate(dateStr, segment) {
    if (!dateStr || dateStr === 'undated') return 'undated';
    if (segment === 'month') return startOfMonth(dateStr);
    if (segment === 'week') return startOfWeekUTC(dateStr);
    return dateStr;
  }

  function parseMappingRows() {
    const rows = Array.from(mappingTable.tBodies[0]?.rows || []);

    return rows.map((tr, index) => {
      const cells = tr.cells;
      const rec = {
        id: `rec_${index}`,
        tr,
        originalName: cleanText(cells[0]),
        originalPath: cleanText(cells[1]),
        originalRole: cleanText(cells[2]),
        originalMethodClass: cleanText(cells[3]),
        originalPhase: cleanText(cells[4]),
        originalProblem: cleanText(cells[5]),
        originalGovernance: cleanText(cells[6]),
        rebuiltName: cleanText(cells[7]),
        rebuiltPath: cleanText(cells[8]),
        rebuiltRole: cleanText(cells[9]),
        rebuiltMethodClass: cleanText(cells[10]),
        rebuiltPhase: cleanText(cells[11]),
        rebuiltProblem: cleanText(cells[12]),
        rebuiltGovernance: cleanText(cells[13]),
        adjacentTerms: cleanText(cells[14]),
        failureIfMisunderstood: cleanText(cells[15]),
        score: Number.parseFloat(cleanText(cells[16])) || 0
      };

      rec.methodClass = rec.originalMethodClass || rec.rebuiltMethodClass || 'unspecified class';
      rec.latestRole = rec.rebuiltRole || rec.originalRole || 'unspecified role';
      rec.phaseLayer = rec.rebuiltPhase || rec.originalPhase || 'unspecified phase';
      rec.governanceFunction = rec.rebuiltGovernance || rec.originalGovernance || 'unspecified function';
      rec.workTitle = prettyTitle(rec.originalName || rec.originalPath || rec.rebuiltName || rec.rebuiltPath);
      rec.groupKey = normalizeGroupKey(rec.originalName, rec.originalPath || rec.rebuiltPath);
      rec.family = firstPathSegment(rec.originalPath) || firstPathSegment(rec.rebuiltPath) || rec.methodClass;
      rec.dateSignals = extractDates([
        rec.originalName,
        rec.originalPath,
        rec.rebuiltName,
        rec.rebuiltPath,
        rec.originalProblem,
        rec.rebuiltProblem
      ].join(' '));
      rec.dateKey = rec.dateSignals[0] || 'undated';
      rec.formats = Array.from(new Set([
        extractExtension(rec.originalName, rec.originalPath),
        extractExtension(rec.rebuiltName, rec.rebuiltPath)
      ])).filter(Boolean);
      rec.versionSignals = detectVersionSignals(
        rec.originalName,
        rec.rebuiltName,
        rec.originalPath,
        rec.rebuiltPath
      );
      rec.generic = isGenericValue(rec.originalRole) && isGenericValue(rec.originalMethodClass) && isGenericValue(rec.governanceFunction);

      tr.dataset.recordId = rec.id;
      tr.dataset.groupKey = rec.groupKey;
      tr.dataset.score = String(rec.score);
      tr.dataset.methodClass = rec.methodClass;
      tr.dataset.family = rec.family;
      tr.dataset.role = rec.latestRole;
      tr.dataset.phase = rec.phaseLayer;
      tr.dataset.governance = rec.governanceFunction;
      tr.dataset.dateKey = rec.dateKey;

      rec.searchBlob = [
        rec.workTitle,
        rec.originalName,
        rec.rebuiltName,
        rec.originalPath,
        rec.rebuiltPath,
        rec.latestRole,
        rec.methodClass,
        rec.phaseLayer,
        rec.governanceFunction,
        rec.adjacentTerms,
        rec.failureIfMisunderstood,
        rec.family,
        rec.dateSignals.join(' '),
        rec.versionSignals.join(' ')
      ].join(' ').toLowerCase();

      return rec;
    });
  }

  const records = parseMappingRows();

  function buildGroups() {
    const grouped = new Map();

    for (const rec of records) {
      if (!grouped.has(rec.groupKey)) grouped.set(rec.groupKey, []);
      grouped.get(rec.groupKey).push(rec);
    }

    const groups = Array.from(grouped.entries()).map(([groupKey, recs]) => {
      const sorted = recs.slice().sort((a, b) => b.score - a.score || a.rebuiltName.localeCompare(b.rebuiltName));
      const best = sorted[0];
      const filesInGroup = recs.length;
      const uniqueVariants = new Set(recs.map((r) => r.rebuiltName || r.rebuiltPath || 'n/a'));
      const uniqueOriginals = new Set(recs.map((r) => r.originalName || r.originalPath || 'n/a'));
      const uniqueFamilies = countBy(recs, (r) => r.family || 'unspecified family');
      const uniqueRoles = countBy(recs, (r) => r.latestRole || 'unspecified role');
      const uniqueClasses = countBy(recs, (r) => r.methodClass || 'unspecified class');
      const uniqueFunctions = countBy(recs, (r) => r.governanceFunction || 'unspecified function');

      const allDates = Array.from(new Set(recs.flatMap((r) => r.dateSignals || []))).sort();
      const firstSeen = allDates[0] || 'undated';
      const latestSeen = allDates[allDates.length - 1] || 'undated';
      const spreadDays = daysBetween(firstSeen, latestSeen);

      const formats = Array.from(new Set(recs.flatMap((r) => r.formats || []))).filter(Boolean).sort();
      const versionSignals = Array.from(new Set(recs.flatMap((r) => r.versionSignals || []))).sort();
      const allPaths = Array.from(new Set(recs.flatMap((r) => [r.originalPath, r.rebuiltPath].filter(Boolean))));

      const latestPath = best.rebuiltPath || best.originalPath || '';
      const latestPathPieces = shortenPath(latestPath);
      const latestFile = best.rebuiltName || best.originalName || 'n/a';
      const latestContext = best.governanceFunction || 'unspecified function';

      const family = topFromCountMap(uniqueFamilies, best.family || 'unspecified family');
      const latestRole = topFromCountMap(uniqueRoles, best.latestRole || 'unspecified role');
      const methodClass = topFromCountMap(uniqueClasses, best.methodClass || 'unspecified class');
      const dominantFunction = topFromCountMap(uniqueFunctions, best.governanceFunction || 'unspecified function');

      const confidence = confidenceClass(best.score);
      const confidenceLabelText = confidenceLabel(best.score);

      const methodConflict = new Set(recs.map((r) => `${r.originalRole}|${r.originalMethodClass}|${r.phaseLayer}`)).size > 1;
      const missingMetadataSignal = [
        family,
        latestRole,
        methodClass,
        latestContext,
        best.originalProblem,
        best.rebuiltProblem
      ].filter((v) => isGenericValue(v)).length >= 3;
      const hasOriginal = recs.some((r) => safe(r.originalName || r.originalPath).trim().length > 0);
      const hasRebuilt = recs.some((r) => safe(r.rebuiltName || r.rebuiltPath).trim().length > 0);
      const scoreGap = sorted[1] ? Math.abs(sorted[0].score - sorted[1].score) : 1;
      const collisionRisk = uniqueVariants.size > 1 && scoreGap <= 0.08;

      let status = 'needs_review';
      if (!hasOriginal && hasRebuilt) status = 'hephaistos_only';
      else if (hasOriginal && !hasRebuilt) status = 'master_pack_only';
      else if (missingMetadataSignal && best.score < 0.82) status = 'missing_metadata';
      else if (collisionRisk) status = 'ambiguous_collision';
      else if (best.score >= 0.82 && uniqueVariants.size === 1 && !methodConflict) status = 'matched';
      else if (best.score >= 0.65) status = 'likely_matched';
      else status = 'needs_review';

      const complexityScore = Math.min(100, filesInGroup * 9 + uniqueVariants.size * 18 + versionSignals.length * 6);
      const complexityLabel = complexityScore >= 75 ? 'high' : complexityScore >= 45 ? 'medium' : 'low';

      let urgencyScore = 20;
      if (status === 'needs_review') urgencyScore += 40;
      if (status === 'ambiguous_collision') urgencyScore += 55;
      if (status === 'missing_metadata') urgencyScore += 48;
      if (status === 'master_pack_only' || status === 'hephaistos_only') urgencyScore += 52;
      if (confidence === 'low') urgencyScore += 24;
      if (confidence === 'medium') urgencyScore += 12;
      if (uniqueVariants.size > 1) urgencyScore += 14;
      if (methodConflict) urgencyScore += 10;
      if (latestPath.length > 95) urgencyScore += 6;
      urgencyScore = Math.min(100, urgencyScore);

      const urgencyLabel = urgencyScore >= 80 ? 'immediate' : urgencyScore >= 60 ? 'high' : urgencyScore >= 40 ? 'medium' : 'low';

      const htmlExportSignal = formats.includes('html') || formats.includes('htm') || /\bexport\b/i.test(latestFile) || /\bexport\b/i.test(latestPath);

      const sourceBasis = [
        'mapping-lineage',
        allDates.length ? 'embedded-date-signals' : 'no-date-signal',
        best.score ? 'score-derived' : 'no-score'
      ].join(' + ');

      const otherPaths = allPaths.filter((p) => p !== latestPath).slice(0, 5);

      const flags = [];
      if (uniqueVariants.size > 1) flags.push('multiple variants');
      if (collisionRisk) flags.push('collision risk');
      if (methodConflict) flags.push('conflicting role/method');
      if (missingMetadataSignal) flags.push('missing metadata');
      if (confidence === 'low') flags.push('low confidence');
      if (!allDates.length) flags.push('undated');
      if (latestPath.length > 95) flags.push('long path');

      return {
        groupKey,
        workTitle: best.workTitle,
        family,
        methodClass,
        latestRole,
        phaseLayer: best.phaseLayer,
        firstSeen,
        latestSeen,
        spreadDays,
        filesInGroup,
        uniqueFileVariants: uniqueVariants.size,
        formats,
        versionSignals,
        latestFile,
        latestContext,
        latestPath,
        latestPathPieces,
        authorshipConfidence: confidenceLabelText,
        confidence,
        confidenceScore: best.score,
        sourceBasis,
        otherPaths,
        status,
        statusInfo: STATUS_MODEL[status] || STATUS_MODEL.needs_review,
        complexityScore,
        complexityLabel,
        urgencyScore,
        urgencyLabel,
        flags,
        collisionRisk,
        methodConflict,
        missingMetadataSignal,
        htmlExportSignal,
        scoreGap,
        records: recs,
        bestRecord: best,
        searchBlob: recs.map((r) => r.searchBlob).join(' '),
        dominantFunction,
        uniqueOriginalCount: uniqueOriginals.size,
        dateSignals: allDates
      };
    });

    const datedLatest = groups
      .map((g) => g.latestSeen)
      .filter((d) => d && d !== 'undated')
      .sort();
    const maxLatest = datedLatest[datedLatest.length - 1] || null;

    for (const group of groups) {
      if (!maxLatest || group.latestSeen === 'undated') {
        group.freshness = 'undated';
      } else {
        const lag = daysBetween(group.latestSeen, maxLatest);
        if (lag == null) group.freshness = 'undated';
        else if (lag <= 7) group.freshness = 'fresh';
        else if (lag <= 30) group.freshness = 'recent';
        else if (lag <= 90) group.freshness = 'aging';
        else group.freshness = 'stale';
      }
    }

    return groups;
  }

  const groups = buildGroups();
  const groupByKey = new Map(groups.map((g) => [g.groupKey, g]));

  function updateSourceCardsFromTimeline() {
    const sourceCards = document.querySelectorAll('.page > .panel:first-of-type .cards .card');
    if (!sourceCards.length) return;

    const totals = timelineRows.reduce((acc, row) => {
      acc.hephaistos += row.hephaistos;
      acc.masterPack += row.masterPack;
      acc.masterCore += row.masterCore;
      return acc;
    }, { hephaistos: 0, masterPack: 0, masterCore: 0 });

    const mapping = [
      { key: 'hephaistos', total: totals.hephaistos },
      { key: 'masterPack', total: totals.masterPack },
      { key: 'masterCore', total: totals.masterCore }
    ];

    sourceCards.forEach((card, idx) => {
      const num = card.querySelector('.num');
      if (!num || !mapping[idx]) return;
      num.textContent = String(mapping[idx].total);
    });
  }

  function ensureDashboardContainers() {
    if (!document.getElementById('execLayer')) {
      const execLayer = document.createElement('section');
      execLayer.id = 'execLayer';
      execLayer.className = 'exec-layer';
      execLayer.innerHTML = `
        <h3 class="layer-title">Layer A: Executive Summary</h3>
        <div id="kpiGrid" class="kpi-grid"></div>
        <div class="legend-wrap">
          <div id="statusLegend" class="legend-grid"></div>
          <div id="warningBand" class="warning-band"></div>
          <div id="activeFilters" class="chip-row"></div>
        </div>
      `;
      controlsGrid.insertAdjacentElement('beforebegin', execLayer);
    }

    if (!document.getElementById('analyticsLayer')) {
      const analyticsLayer = document.createElement('section');
      analyticsLayer.id = 'analyticsLayer';
      analyticsLayer.className = 'analytics-layer';
      analyticsLayer.innerHTML = `
        <h3 class="layer-title">Layer B: Visual Analytics</h3>
        <div id="analyticsGrid" class="analytics-grid">
          <article class="chart-card"><h3>Family Distribution</h3><div id="chartFamily"></div><div class="chart-note">Grouped by inferred family segment.</div></article>
          <article class="chart-card"><h3>Latest Role Distribution</h3><div id="chartRole"></div><div class="chart-note">Role classes across visible grouped records.</div></article>
          <article class="chart-card"><h3>Confidence Breakdown</h3><div id="chartConfidence"></div><div class="chart-note">Derived from top match score per grouped record.</div></article>
          <article class="chart-card"><h3>Files In Group</h3><div id="chartFilesGroup"></div><div class="chart-note">Complexity pressure by grouped file count.</div></article>
          <article class="chart-card"><h3>Unique Variants</h3><div id="chartVariants"></div><div class="chart-note">Revision and duplication burden by group.</div></article>
          <article class="chart-card"><h3>Status Distribution</h3><div id="chartStatus"></div><div class="chart-note">Status is inferred from score, variants, and metadata signals.</div></article>
          <article class="chart-card"><h3>First Seen Timeline</h3><div id="chartFirstSeen"></div><div class="chart-note">Chronology is archival (creation-date signal), not task deadline.</div></article>
          <article class="chart-card"><h3>Latest Seen Timeline</h3><div id="chartLatestSeen"></div><div class="chart-note">Shows where activity appears most recent in metadata.</div></article>
          <article class="chart-card"><h3>Risk Focus</h3><div id="chartRisk"></div><div class="chart-note">Records flagged by ambiguity, conflicts, or missing metadata.</div></article>
        </div>
      `;
      controlsGrid.insertAdjacentElement('beforebegin', analyticsLayer);
    }

    if (!document.getElementById('controlDock')) {
      const dock = document.createElement('div');
      dock.id = 'controlDock';
      dock.className = 'control-dock';

      const marker = controlsGrid;
      marker.insertAdjacentElement('beforebegin', dock);
      dock.appendChild(marker);

      const extraControls = document.createElement('div');
      extraControls.id = 'auditExtraControls';
      extraControls.className = 'audit-extra-controls';
      extraControls.innerHTML = `
        <div class="control">
          <label for="familyFilter">Family</label>
          <select id="familyFilter"><option value="">All families</option></select>
          <label for="roleFilter" style="margin-top:8px;">Latest Role</label>
          <select id="roleFilter"><option value="">All roles</option></select>
        </div>
        <div class="control">
          <label for="confidenceFilter">Authorship Confidence</label>
          <select id="confidenceFilter">
            <option value="">All confidence</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <label for="statusFilter" style="margin-top:8px;">Reconciliation Status</label>
          <select id="statusFilter"><option value="">All statuses</option></select>
        </div>
        <div class="control">
          <label for="formatFilter">Format</label>
          <select id="formatFilter"><option value="">All formats</option></select>
          <label for="sortBy" style="margin-top:8px;">Sort</label>
          <select id="sortBy">
            <option value="urgency_desc">Urgency (High to Low)</option>
            <option value="confidence_desc">Confidence (High to Low)</option>
            <option value="confidence_asc">Confidence (Low to High)</option>
            <option value="variants_desc">Variants (High to Low)</option>
            <option value="files_desc">Files in Group (High to Low)</option>
            <option value="first_seen_asc">First Seen (Oldest First)</option>
            <option value="latest_seen_desc">Latest Seen (Newest First)</option>
            <option value="title_asc">Work Title (A-Z)</option>
          </select>
        </div>
        <div class="control">
          <div class="control-group-title">Risk Toggles</div>
          <div class="toggles">
            <label><input id="riskOnly" type="checkbox" /> Show only risk / ambiguity</label>
            <label><input id="ambiguousOnly" type="checkbox" /> Show only ambiguous/collision</label>
            <label><input id="duplicateOnly" type="checkbox" /> Show only duplicate / multi-variant</label>
            <label><input id="lowConfidenceOnly" type="checkbox" /> Show only low confidence</label>
          </div>
        </div>
      `;

      dock.appendChild(extraControls);
    }

    const miniCards = visualPanel.querySelectorAll('.mini-stats .card');
    if (miniCards.length >= 3) {
      miniCards[0].querySelector('h3').textContent = 'Visible Groups';
      miniCards[0].querySelector('p').textContent = 'Grouped records matching active filters';
      miniCards[1].querySelector('h3').textContent = 'Visible Variants';
      miniCards[1].querySelector('p').textContent = 'Total unique rebuilt variants in visible groups';
      miniCards[2].querySelector('h3').textContent = 'Avg Confidence (Visible)';
      miniCards[2].querySelector('p').textContent = 'Mean top score for visible grouped records';
    }

    if (!document.getElementById('comparisonMode')) {
      const wrap = document.createElement('div');
      wrap.className = 'control';
      wrap.id = 'compareModeWrap';
      wrap.innerHTML = `
        <label for="comparisonMode">Comparison Mode</label>
        <select id="comparisonMode">
          <option value="overall" selected>Overall Comparison</option>
          <option value="category">Category Comparison</option>
          <option value="function">Function Comparison</option>
          <option value="class">Class Comparison</option>
        </select>
        <div class="tiny">Comparison entity is selected from visible records and grouped metadata.</div>
      `;
      compareGrid.insertAdjacentElement('beforebegin', wrap);
    }

    if (metaInspector && !metaInspector.classList.contains('audit')) {
      metaInspector.classList.add('audit');
    }

    const quickSectionFoot = visualPanel.querySelector('.foot');
    if (quickSectionFoot) {
      quickSectionFoot.textContent = 'Layer D: review table is normalized for fast scan; full raw mapping metadata remains available below and in per-record details.';
    }

    if (timelinePanel && timelineBars && !document.getElementById('timelineControls')) {
      const controls = document.createElement('div');
      controls.className = 'timeline-controls';
      controls.id = 'timelineControls';
      controls.innerHTML = `
        <div class="control">
          <label for="timelineSegment">Timeline Segment</label>
          <select id="timelineSegment">
            <option value="day" selected>Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
        </div>
        <div class="control">
          <label for="timelineFrom">From</label>
          <select id="timelineFrom"></select>
        </div>
        <div class="control">
          <label for="timelineTo">To</label>
          <select id="timelineTo"></select>
        </div>
        <div class="control">
          <label for="timelineZoom">Zoom: <span id="timelineZoomLabel">100%</span></label>
          <input id="timelineZoom" type="range" min="60" max="220" value="100" step="5" />
        </div>
      `;
      timelineBars.insertAdjacentElement('beforebegin', controls);

      const inspector = document.createElement('div');
      inspector.id = 'timelineInspector';
      inspector.className = 'timeline-inspector';
      inspector.textContent = 'Click a timeline segment to inspect details. Day mode can drive the Date filter.';
      timelineBars.insertAdjacentElement('afterend', inspector);
    }
  }

  function installLockButton() {
    // No client-side lock button: access is handled by server-side auth.
  }

  await requirePassphraseGate();
  injectStyles();
  ensureDashboardContainers();
  installLockButton();
  updateSourceCardsFromTimeline();

  const familyFilter = document.getElementById('familyFilter');
  const roleFilter = document.getElementById('roleFilter');
  const confidenceFilter = document.getElementById('confidenceFilter');
  const statusFilter = document.getElementById('statusFilter');
  const formatFilter = document.getElementById('formatFilter');
  const sortBy = document.getElementById('sortBy');
  const riskOnly = document.getElementById('riskOnly');
  const ambiguousOnly = document.getElementById('ambiguousOnly');
  const duplicateOnly = document.getElementById('duplicateOnly');
  const lowConfidenceOnly = document.getElementById('lowConfidenceOnly');

  const comparisonMode = document.getElementById('comparisonMode');
  const timelineSegment = document.getElementById('timelineSegment');
  const timelineFrom = document.getElementById('timelineFrom');
  const timelineTo = document.getElementById('timelineTo');
  const timelineZoom = document.getElementById('timelineZoom');
  const timelineZoomLabel = document.getElementById('timelineZoomLabel');
  const timelineInspector = document.getElementById('timelineInspector');

  const kpiGrid = document.getElementById('kpiGrid');
  const statusLegend = document.getElementById('statusLegend');
  const warningBand = document.getElementById('warningBand');
  const activeFilters = document.getElementById('activeFilters');

  const chartFamily = document.getElementById('chartFamily');
  const chartRole = document.getElementById('chartRole');
  const chartConfidence = document.getElementById('chartConfidence');
  const chartFilesGroup = document.getElementById('chartFilesGroup');
  const chartVariants = document.getElementById('chartVariants');
  const chartStatus = document.getElementById('chartStatus');
  const chartFirstSeen = document.getElementById('chartFirstSeen');
  const chartLatestSeen = document.getElementById('chartLatestSeen');
  const chartRisk = document.getElementById('chartRisk');

  if (!familyFilter || !roleFilter || !confidenceFilter || !statusFilter || !formatFilter || !sortBy || !riskOnly || !ambiguousOnly || !duplicateOnly || !lowConfidenceOnly || !comparisonMode || !timelineSegment || !timelineFrom || !timelineTo || !timelineZoom || !timelineZoomLabel || !timelineInspector || !kpiGrid || !statusLegend || !warningBand || !activeFilters || !chartFamily || !chartRole || !chartConfidence || !chartFilesGroup || !chartVariants || !chartStatus || !chartFirstSeen || !chartLatestSeen || !chartRisk) {
    return;
  }

  function fillSelect(select, values, firstLabel) {
    const previous = select.value;
    select.innerHTML = '';

    const first = document.createElement('option');
    first.value = '';
    first.textContent = firstLabel;
    select.appendChild(first);

    for (const v of values) {
      const o = document.createElement('option');
      o.value = v;
      o.textContent = v;
      select.appendChild(o);
    }

    if (values.includes(previous)) {
      select.value = previous;
    }
  }

  function initializeFilters() {
    const families = Array.from(new Set(groups.map((g) => g.family))).sort();
    const roles = Array.from(new Set(groups.map((g) => g.latestRole))).sort();
    const statuses = Array.from(new Set(groups.map((g) => g.status))).sort((a, b) => (STATUS_MODEL[a]?.label || a).localeCompare(STATUS_MODEL[b]?.label || b));
    const formats = Array.from(new Set(groups.flatMap((g) => g.formats))).filter((x) => x && x !== 'none').sort();
    const categories = Array.from(new Set(groups.map((g) => `${g.family} | ${g.methodClass}`))).sort();
    const dates = Array.from(new Set(groups.map((g) => g.firstSeen))).sort();

    fillSelect(familyFilter, families, 'All families');
    fillSelect(roleFilter, roles, 'All roles');
    fillSelect(statusFilter, statuses.map((s) => STATUS_MODEL[s]?.label || s), 'All statuses');
    fillSelect(formatFilter, formats, 'All formats');

    fillSelect(categorySelect, categories, 'All categories');
    fillSelect(dateSelect, dates, 'All dates');

    const statusLabelByKey = new Map(statuses.map((s) => [STATUS_MODEL[s]?.label || s, s]));
    statusFilter.dataset.labelToKey = JSON.stringify(Object.fromEntries(statusLabelByKey));
  }

  function timelineKeysForSegment(segment) {
    const keys = Array.from(new Set(timelineRows.map((r) => bucketDate(r.date, segment)))).sort((a, b) => {
      if (a === 'undated') return 1;
      if (b === 'undated') return -1;
      return a.localeCompare(b);
    });
    return keys;
  }

  function refreshTimelineRangeOptions() {
    const segment = timelineSegment.value;
    const keys = timelineKeysForSegment(segment);
    fillSelect(timelineFrom, keys, 'Earliest');
    fillSelect(timelineTo, keys, 'Latest');
  }

  initializeFilters();
  refreshTimelineRangeOptions();

  const state = {
    selectedGroupKey: null,
    selectedTimelineKey: null
  };

  function renderStatusBadge(statusKey, includeHelp) {
    const info = STATUS_MODEL[statusKey] || STATUS_MODEL.needs_review;
    const help = includeHelp ? `<span class="tiny">${escapeHtml(info.help)}</span>` : '';
    return `<span class="status-badge ${info.className}"><span>${escapeHtml(info.label)}</span><span class="tag">${escapeHtml(info.short)}</span></span>${help ? `<br>${help}` : ''}`;
  }

  function buildDistribution(items, keyFn) {
    const map = countBy(items, keyFn);
    return Array.from(map.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label));
  }

  function buildBucketDistribution(items, valueFn, buckets) {
    const counts = new Map(buckets.map((b) => [b.label, 0]));

    for (const item of items) {
      const value = valueFn(item);
      const bucket = buckets.find((b) => value >= b.min && value <= b.max) || buckets[buckets.length - 1];
      counts.set(bucket.label, (counts.get(bucket.label) || 0) + 1);
    }

    return buckets.map((b) => ({ label: b.label, value: counts.get(b.label) || 0 }));
  }

  function renderBarDistribution(container, data, topN) {
    const sliced = (topN ? data.slice(0, topN) : data).filter((d) => d.value > 0);
    const total = sliced.reduce((sum, d) => sum + d.value, 0);
    const max = Math.max(1, ...sliced.map((d) => d.value));

    if (!sliced.length) {
      container.innerHTML = '<div class="tiny">No data under current filters.</div>';
      return;
    }

    container.innerHTML = `
      <div class="dist-list">
        ${sliced.map((d) => {
          const pctOfVisible = total ? ((d.value / total) * 100).toFixed(1) : '0.0';
          const width = (d.value / max) * 100;
          return `
            <div class="dist-row">
              <div class="dist-label" title="${escapeHtml(d.label)}">${escapeHtml(d.label)}</div>
              <div class="dist-track"><span class="dist-fill" style="width:${width}%"></span></div>
              <div class="dist-value">${d.value} (${pctOfVisible}%)</div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  function renderDonut(container, data) {
    const list = data.filter((d) => d.value > 0);
    const total = list.reduce((sum, d) => sum + d.value, 0);

    if (!total) {
      container.innerHTML = '<div class="tiny">No data under current filters.</div>';
      return;
    }

    let cursor = 0;
    const parts = [];

    list.forEach((item, idx) => {
      const fraction = item.value / total;
      const next = cursor + fraction * 360;
      const color = DONUT_COLORS[idx % DONUT_COLORS.length];
      parts.push(`${color} ${cursor}deg ${next}deg`);
      cursor = next;
    });

    const legend = list.map((item, idx) => {
      const color = DONUT_COLORS[idx % DONUT_COLORS.length];
      const pct = ((item.value / total) * 100).toFixed(1);
      return `
        <div class="legend-line">
          <span class="legend-dot" style="background:${color}"></span>
          <span>${escapeHtml(item.label)}</span>
          <span class="mono">${item.value} (${pct}%)</span>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="donut-wrap">
        <div class="donut" style="background: conic-gradient(${parts.join(', ')});"></div>
        <div class="legend-list">${legend}</div>
      </div>
    `;
  }

  function renderTimelineDistribution(container, items, dateField) {
    const dated = items.filter((g) => g[dateField] && g[dateField] !== 'undated');
    if (!dated.length) {
      container.innerHTML = '<div class="tiny">No dated records under current filters.</div>';
      return;
    }

    const byMonth = countBy(dated, (g) => g[dateField].slice(0, 7));
    const data = Array.from(byMonth.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => a.label.localeCompare(b.label));

    renderBarDistribution(container, data.slice(-10));
  }

  function renderRiskDistribution(container, items) {
    const buckets = [
      { label: 'Ambiguous / Collision', value: items.filter((g) => g.status === 'ambiguous_collision').length },
      { label: 'Missing Metadata', value: items.filter((g) => g.status === 'missing_metadata').length },
      { label: 'Needs Review', value: items.filter((g) => g.status === 'needs_review').length },
      { label: 'Low Confidence', value: items.filter((g) => g.confidence === 'low').length },
      { label: 'Multi-Variant', value: items.filter((g) => g.uniqueFileVariants > 1).length },
      { label: 'Conflict Signals', value: items.filter((g) => g.methodConflict).length }
    ];

    renderBarDistribution(container, buckets);
  }

  function computeSummaryMetrics(allGroups, visibleGroups) {
    const confidenceCount = {
      high: visibleGroups.filter((g) => g.confidence === 'high').length,
      medium: visibleGroups.filter((g) => g.confidence === 'medium').length,
      low: visibleGroups.filter((g) => g.confidence === 'low').length
    };

    const statusCounts = countBy(visibleGroups, (g) => g.status);

    const totals = {
      totalGroups: allGroups.length,
      visibleGroups: visibleGroups.length,
      totalVariantsVisible: visibleGroups.reduce((sum, g) => sum + g.uniqueFileVariants, 0),
      familyCountVisible: new Set(visibleGroups.map((g) => g.family)).size,
      roleCountVisible: new Set(visibleGroups.map((g) => g.latestRole)).size,
      confidenceCount,
      versionSignalGroups: visibleGroups.filter((g) => g.versionSignals.length > 0).length,
      multiVariantGroups: visibleGroups.filter((g) => g.uniqueFileVariants > 1).length,
      htmlExportGroups: visibleGroups.filter((g) => g.htmlExportSignal).length,
      matched: statusCounts.get('matched') || 0,
      likelyMatched: statusCounts.get('likely_matched') || 0,
      needsReview: statusCounts.get('needs_review') || 0,
      ambiguous: statusCounts.get('ambiguous_collision') || 0,
      missingMetadata: statusCounts.get('missing_metadata') || 0,
      masterOnly: statusCounts.get('master_pack_only') || 0,
      hephaistosOnly: statusCounts.get('hephaistos_only') || 0
    };

    return totals;
  }

  function renderExecutiveSummary(allGroups, visibleGroups) {
    const metrics = computeSummaryMetrics(allGroups, visibleGroups);

    const kpis = [
      { label: 'Tracked Groups', value: metrics.totalGroups, note: 'Total grouped records in tracker' },
      { label: 'Visible Groups', value: metrics.visibleGroups, note: 'After active filters and risk toggles' },
      { label: 'File Variants (Visible)', value: metrics.totalVariantsVisible, note: 'Sum of unique rebuilt variants' },
      { label: 'Families (Visible)', value: metrics.familyCountVisible, note: 'Distinct inferred families' },
      { label: 'Roles (Visible)', value: metrics.roleCountVisible, note: 'Distinct latest roles' },
      { label: 'Confidence High / Med / Low', value: `${metrics.confidenceCount.high}/${metrics.confidenceCount.medium}/${metrics.confidenceCount.low}`, note: 'Derived from top score per grouped record' },
      { label: 'Version Signal Groups', value: metrics.versionSignalGroups, note: 'Any v/final/revision/copy/pass signal detected' },
      { label: 'Multi-Variant Groups', value: metrics.multiVariantGroups, note: 'Groups with more than one rebuilt variant' },
      { label: 'HTML / Export Groups', value: metrics.htmlExportGroups, note: 'Detected by format or export markers' },
      { label: 'Matched / Likely / Review', value: `${metrics.matched}/${metrics.likelyMatched}/${metrics.needsReview}`, note: 'Inferred reconciliation status' }
    ];

    kpiGrid.innerHTML = kpis.map((kpi) => `
      <article class="kpi-card">
        <div class="kpi-name">${escapeHtml(kpi.label)}</div>
        <div class="kpi-value">${escapeHtml(String(kpi.value))}</div>
        <div class="kpi-note">${escapeHtml(kpi.note)}</div>
      </article>
    `).join('');

    const statusKeys = Object.keys(STATUS_MODEL);
    statusLegend.innerHTML = statusKeys.map((key) => {
      const info = STATUS_MODEL[key];
      const count = visibleGroups.filter((g) => g.status === key).length;
      return `
        <div class="legend-item">
          ${renderStatusBadge(key, false)}
          <div class="tiny" style="margin-top:4px;">${escapeHtml(info.help)}</div>
          <div class="tiny" style="margin-top:4px;">Visible count: <strong>${count}</strong></div>
        </div>
      `;
    }).join('');

    const urgent = visibleGroups
      .slice()
      .sort((a, b) => b.urgencyScore - a.urgencyScore || a.workTitle.localeCompare(b.workTitle))
      .slice(0, 5);

    const warningLines = urgent.map((g) => `<li><strong>${escapeHtml(g.workTitle)}</strong> - ${escapeHtml(g.statusInfo.label)} (urgency ${g.urgencyScore})</li>`).join('');

    warningBand.innerHTML = `
      <div><strong>Key warnings:</strong> status categories are inferred from score, variant spread, and metadata quality signals; manual adjudication still required for promotion decisions.</div>
      ${urgent.length ? `<ul>${warningLines}</ul>` : '<div class="tiny" style="margin-top:6px;">No urgent records under active filters.</div>'}
    `;
  }

  function statusLabelToKey() {
    try {
      const raw = statusFilter.dataset.labelToKey || '{}';
      return JSON.parse(raw);
    } catch (_) {
      return {};
    }
  }

  function activeStatusKeyFromFilter() {
    if (!statusFilter.value) return '';
    const map = statusLabelToKey();
    return map[statusFilter.value] || '';
  }

  function applyGroupFilters() {
    const query = safe(searchInput.value).trim().toLowerCase();
    const minScore = (Number.parseFloat(scoreInput.value) || 0) / 100;
    const family = familyFilter.value;
    const role = roleFilter.value;
    const confidence = confidenceFilter.value;
    const status = activeStatusKeyFromFilter();
    const format = formatFilter.value;
    const category = categorySelect.value;
    const firstSeen = dateSelect.value;

    scoreLabel.textContent = minScore.toFixed(2);
    viewBadge.textContent = viewMode.value;

    return groups.filter((group) => {
      if (query && !group.searchBlob.includes(query)) return false;
      if (group.confidenceScore < minScore) return false;
      if (family && group.family !== family) return false;
      if (role && group.latestRole !== role) return false;
      if (confidence && group.confidence !== confidence) return false;
      if (status && group.status !== status) return false;
      if (format && !group.formats.includes(format)) return false;
      if (category && `${group.family} | ${group.methodClass}` !== category) return false;
      if (firstSeen && group.firstSeen !== firstSeen) return false;

      if (hideGeneric.checked && group.records.every((r) => r.generic)) return false;

      if (riskOnly.checked) {
        const hasRisk = group.status === 'needs_review' || group.status === 'ambiguous_collision' || group.status === 'missing_metadata' || group.confidence === 'low' || group.uniqueFileVariants > 1 || group.methodConflict;
        if (!hasRisk) return false;
      }
      if (ambiguousOnly.checked && group.status !== 'ambiguous_collision') return false;
      if (duplicateOnly.checked && group.uniqueFileVariants <= 1) return false;
      if (lowConfidenceOnly.checked && group.confidence !== 'low') return false;

      return true;
    });
  }

  function sortVisibleGroups(visibleGroups) {
    const mode = sortBy.value;
    const sorted = visibleGroups.slice();

    sorted.sort((a, b) => {
      if (mode === 'urgency_desc') return b.urgencyScore - a.urgencyScore || b.confidenceScore - a.confidenceScore;
      if (mode === 'confidence_desc') return b.confidenceScore - a.confidenceScore || a.workTitle.localeCompare(b.workTitle);
      if (mode === 'confidence_asc') return a.confidenceScore - b.confidenceScore || a.workTitle.localeCompare(b.workTitle);
      if (mode === 'variants_desc') return b.uniqueFileVariants - a.uniqueFileVariants || b.filesInGroup - a.filesInGroup;
      if (mode === 'files_desc') return b.filesInGroup - a.filesInGroup || b.uniqueFileVariants - a.uniqueFileVariants;
      if (mode === 'first_seen_asc') return safe(a.firstSeen).localeCompare(safe(b.firstSeen));
      if (mode === 'latest_seen_desc') return safe(b.latestSeen).localeCompare(safe(a.latestSeen));
      if (mode === 'title_asc') return a.workTitle.localeCompare(b.workTitle);
      return b.urgencyScore - a.urgencyScore;
    });

    return sorted;
  }

  function renderFilterChips() {
    const chips = [];

    const pushChip = (label, clearFn) => {
      chips.push(`<button class="filter-chip" data-clear="${escapeHtml(clearFn)}">${escapeHtml(label)} x</button>`);
    };

    const minScore = (Number.parseFloat(scoreInput.value) || 0) / 100;
    if (minScore > 0) pushChip(`score >= ${minScore.toFixed(2)}`, 'score');
    if (searchInput.value.trim()) pushChip(`search: ${searchInput.value.trim()}`, 'search');
    if (familyFilter.value) pushChip(`family: ${familyFilter.value}`, 'family');
    if (roleFilter.value) pushChip(`role: ${roleFilter.value}`, 'role');
    if (confidenceFilter.value) pushChip(`confidence: ${confidenceFilter.value}`, 'confidence');
    if (statusFilter.value) pushChip(`status: ${statusFilter.value}`, 'status');
    if (formatFilter.value) pushChip(`format: ${formatFilter.value}`, 'format');
    if (categorySelect.value) pushChip(`category: ${categorySelect.value}`, 'category');
    if (dateSelect.value) pushChip(`first seen: ${dateSelect.value}`, 'date');
    if (riskOnly.checked) pushChip('risk only', 'riskOnly');
    if (ambiguousOnly.checked) pushChip('ambiguous only', 'ambiguousOnly');
    if (duplicateOnly.checked) pushChip('duplicate only', 'duplicateOnly');
    if (lowConfidenceOnly.checked) pushChip('low confidence only', 'lowConfidenceOnly');
    if (hideGeneric.checked) pushChip('hide generic', 'hideGeneric');

    activeFilters.innerHTML = chips.length
      ? `${chips.join('')} <span class="chip-help">Click chip to clear that filter.</span>`
      : '<span class="chip-help">No active filters. Showing full grouped tracker.</span>';

    const buttons = activeFilters.querySelectorAll('.filter-chip');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-clear');
        if (!key) return;

        if (key === 'score') scoreInput.value = '0';
        if (key === 'search') searchInput.value = '';
        if (key === 'family') familyFilter.value = '';
        if (key === 'role') roleFilter.value = '';
        if (key === 'confidence') confidenceFilter.value = '';
        if (key === 'status') statusFilter.value = '';
        if (key === 'format') formatFilter.value = '';
        if (key === 'category') categorySelect.value = '';
        if (key === 'date') dateSelect.value = '';
        if (key === 'riskOnly') riskOnly.checked = false;
        if (key === 'ambiguousOnly') ambiguousOnly.checked = false;
        if (key === 'duplicateOnly') duplicateOnly.checked = false;
        if (key === 'lowConfidenceOnly') lowConfidenceOnly.checked = false;
        if (key === 'hideGeneric') hideGeneric.checked = false;

        applyAll();
      });
    });
  }

  function renderAnalytics(visibleGroups) {
    const families = buildDistribution(visibleGroups, (g) => g.family || 'unspecified family');
    const roles = buildDistribution(visibleGroups, (g) => g.latestRole || 'unspecified role');
    const confidence = buildDistribution(visibleGroups, (g) => g.authorshipConfidence);
    const status = buildDistribution(visibleGroups, (g) => STATUS_MODEL[g.status]?.label || g.status);

    const filesBuckets = buildBucketDistribution(visibleGroups, (g) => g.filesInGroup, [
      { label: '1 file', min: 1, max: 1 },
      { label: '2 files', min: 2, max: 2 },
      { label: '3-4 files', min: 3, max: 4 },
      { label: '5+ files', min: 5, max: Number.POSITIVE_INFINITY }
    ]);

    const variantBuckets = buildBucketDistribution(visibleGroups, (g) => g.uniqueFileVariants, [
      { label: '1 variant', min: 1, max: 1 },
      { label: '2 variants', min: 2, max: 2 },
      { label: '3+ variants', min: 3, max: Number.POSITIVE_INFINITY }
    ]);

    renderBarDistribution(chartFamily, families, 8);
    renderBarDistribution(chartRole, roles, 8);
    renderDonut(chartConfidence, confidence);
    renderBarDistribution(chartFilesGroup, filesBuckets);
    renderBarDistribution(chartVariants, variantBuckets);
    renderDonut(chartStatus, status);
    renderTimelineDistribution(chartFirstSeen, visibleGroups, 'firstSeen');
    renderTimelineDistribution(chartLatestSeen, visibleGroups, 'latestSeen');
    renderRiskDistribution(chartRisk, visibleGroups);
  }

  function renderComparisonOptions(visibleGroups) {
    const mode = comparisonMode.value;

    let options = [];
    if (mode === 'overall') {
      options = visibleGroups.map((g) => ({
        value: g.groupKey,
        label: `${g.workTitle} (${g.confidenceScore.toFixed(3)})`
      }));
    } else if (mode === 'category') {
      options = Array.from(new Set(visibleGroups.map((g) => g.family))).sort().map((key) => ({ value: key, label: key }));
    } else if (mode === 'function') {
      options = Array.from(new Set(visibleGroups.map((g) => g.latestContext))).sort().map((key) => ({ value: key, label: key }));
    } else if (mode === 'class') {
      options = Array.from(new Set(visibleGroups.map((g) => g.methodClass))).sort().map((key) => ({ value: key, label: key }));
    }

    const previousA = compareLeft.value;
    const previousB = compareRight.value;

    compareLeft.innerHTML = '<option value="">Select A</option>';
    compareRight.innerHTML = '<option value="">Select B</option>';

    for (const option of options) {
      const leftOpt = document.createElement('option');
      leftOpt.value = option.value;
      leftOpt.textContent = option.label;
      compareLeft.appendChild(leftOpt);

      const rightOpt = document.createElement('option');
      rightOpt.value = option.value;
      rightOpt.textContent = option.label;
      compareRight.appendChild(rightOpt);
    }

    if (options.some((o) => o.value === previousA)) compareLeft.value = previousA;
    if (options.some((o) => o.value === previousB)) compareRight.value = previousB;

    if (!compareLeft.value && options[0]) compareLeft.value = options[0].value;
    if (!compareRight.value && options[1]) compareRight.value = options[1].value;
    if (!compareRight.value && options[0]) compareRight.value = options[0].value;
  }

  function aggregateComparisonEntity(mode, key, visibleGroups) {
    if (!key) return null;

    if (mode === 'overall') {
      return groupByKey.get(key) || null;
    }

    let subset = [];
    if (mode === 'category') subset = visibleGroups.filter((g) => g.family === key);
    if (mode === 'function') subset = visibleGroups.filter((g) => g.latestContext === key);
    if (mode === 'class') subset = visibleGroups.filter((g) => g.methodClass === key);

    if (!subset.length) return null;

    const avgConfidence = subset.reduce((sum, g) => sum + g.confidenceScore, 0) / subset.length;
    const avgUrgency = subset.reduce((sum, g) => sum + g.urgencyScore, 0) / subset.length;
    const topUrgent = subset.slice().sort((a, b) => b.urgencyScore - a.urgencyScore)[0];
    const topConfidence = subset.slice().sort((a, b) => b.confidenceScore - a.confidenceScore)[0];
    const statuses = buildDistribution(subset, (g) => STATUS_MODEL[g.status]?.label || g.status).slice(0, 3);

    return {
      aggregate: true,
      mode,
      key,
      count: subset.length,
      avgConfidence,
      avgUrgency,
      topUrgent,
      topConfidence,
      dominantRole: topFromCountMap(countBy(subset, (g) => g.latestRole), 'n/a'),
      dominantFamily: topFromCountMap(countBy(subset, (g) => g.family), 'n/a'),
      dominantClass: topFromCountMap(countBy(subset, (g) => g.methodClass), 'n/a'),
      dominantStatus: topFromCountMap(countBy(subset, (g) => STATUS_MODEL[g.status]?.label || g.status), 'n/a'),
      statuses,
      subset
    };
  }

  function renderComparisonCard(el, title, entity) {
    if (!entity) {
      el.innerHTML = `<h3>${escapeHtml(title)}</h3><div class="tiny">Select an entity to compare.</div>`;
      return;
    }

    if (!entity.aggregate) {
      const g = entity;
      el.innerHTML = `
        <h3>${escapeHtml(title)} (overall)</h3>
        <div class="compare-subtitle">${escapeHtml(g.workTitle)}</div>
        <div class="compare-list">
          <div class="compare-line"><strong>Status:</strong> ${renderStatusBadge(g.status, false)}</div>
          <div class="compare-line"><strong>Confidence:</strong> ${g.confidenceScore.toFixed(3)} (${escapeHtml(g.authorshipConfidence)})</div>
          <div class="compare-line"><strong>Family / Class:</strong> ${escapeHtml(g.family)} / ${escapeHtml(g.methodClass)}</div>
          <div class="compare-line"><strong>Latest Role:</strong> ${escapeHtml(g.latestRole)}</div>
          <div class="compare-line"><strong>Files / Variants:</strong> ${g.filesInGroup} / ${g.uniqueFileVariants}</div>
          <div class="compare-line"><strong>Chronology:</strong> ${escapeHtml(g.firstSeen)} -> ${escapeHtml(g.latestSeen)}</div>
        </div>
      `;
      return;
    }

    el.innerHTML = `
      <h3>${escapeHtml(title)} (${escapeHtml(entity.mode)})</h3>
      <div class="compare-subtitle">${escapeHtml(entity.key)}</div>
      <div class="compare-list">
        <div class="compare-line"><strong>Visible groups:</strong> ${entity.count}</div>
        <div class="compare-line"><strong>Avg confidence:</strong> ${entity.avgConfidence.toFixed(3)}</div>
        <div class="compare-line"><strong>Avg urgency:</strong> ${entity.avgUrgency.toFixed(1)}</div>
        <div class="compare-line"><strong>Dominant role:</strong> ${escapeHtml(entity.dominantRole)}</div>
        <div class="compare-line"><strong>Dominant status:</strong> ${escapeHtml(entity.dominantStatus)}</div>
        <div class="compare-line"><strong>Top urgent item:</strong> ${escapeHtml(entity.topUrgent?.workTitle || 'n/a')}</div>
      </div>
    `;
  }

  function compareMetricLine(label, left, right) {
    const same = safe(left) === safe(right);
    return `<div class="compare-line ${same ? 'same' : 'diff'}"><strong>${escapeHtml(label)}:</strong> A = ${escapeHtml(String(left))} | B = ${escapeHtml(String(right))}</div>`;
  }

  function renderComparisonDiff(entityA, entityB) {
    if (!entityA || !entityB) {
      compareDiff.innerHTML = '<h3>Comparison Diff</h3><div class="tiny">Select both entities.</div>';
      return;
    }

    const lines = [];

    if (!entityA.aggregate && !entityB.aggregate) {
      lines.push(compareMetricLine('status', STATUS_MODEL[entityA.status]?.label || entityA.status, STATUS_MODEL[entityB.status]?.label || entityB.status));
      lines.push(compareMetricLine('confidence', entityA.confidenceScore.toFixed(3), entityB.confidenceScore.toFixed(3)));
      lines.push(compareMetricLine('family', entityA.family, entityB.family));
      lines.push(compareMetricLine('class', entityA.methodClass, entityB.methodClass));
      lines.push(compareMetricLine('role', entityA.latestRole, entityB.latestRole));
      lines.push(compareMetricLine('variants', entityA.uniqueFileVariants, entityB.uniqueFileVariants));
      lines.push(compareMetricLine('first seen', entityA.firstSeen, entityB.firstSeen));
      lines.push(compareMetricLine('latest seen', entityA.latestSeen, entityB.latestSeen));
    } else {
      const AavgConf = entityA.aggregate ? entityA.avgConfidence : entityA.confidenceScore;
      const BavgConf = entityB.aggregate ? entityB.avgConfidence : entityB.confidenceScore;
      const Acount = entityA.aggregate ? entityA.count : 1;
      const Bcount = entityB.aggregate ? entityB.count : 1;
      const Astatus = entityA.aggregate ? entityA.dominantStatus : (STATUS_MODEL[entityA.status]?.label || entityA.status);
      const Bstatus = entityB.aggregate ? entityB.dominantStatus : (STATUS_MODEL[entityB.status]?.label || entityB.status);

      lines.push(compareMetricLine('entity size', Acount, Bcount));
      lines.push(compareMetricLine('avg confidence', AavgConf.toFixed(3), BavgConf.toFixed(3)));
      lines.push(compareMetricLine('dominant status', Astatus, Bstatus));
      lines.push(compareMetricLine('dominant role', entityA.aggregate ? entityA.dominantRole : entityA.latestRole, entityB.aggregate ? entityB.dominantRole : entityB.latestRole));
      lines.push(compareMetricLine('dominant class', entityA.aggregate ? entityA.dominantClass : entityA.methodClass, entityB.aggregate ? entityB.dominantClass : entityB.methodClass));
      lines.push(compareMetricLine('top urgent', entityA.aggregate ? entityA.topUrgent?.workTitle || 'n/a' : entityA.workTitle, entityB.aggregate ? entityB.topUrgent?.workTitle || 'n/a' : entityB.workTitle));
    }

    compareDiff.innerHTML = `<h3>Comparison Diff</h3><div class="compare-list">${lines.join('')}</div>`;
  }

  function formatDateSpan(group) {
    const first = group.firstSeen;
    const latest = group.latestSeen;
    const spread = group.spreadDays;
    const span = spread == null ? 'spread unknown' : `${spread} day span`;
    const freshnessLabel = group.freshness === 'fresh' ? 'fresh' : group.freshness === 'recent' ? 'recent' : group.freshness === 'aging' ? 'aging' : group.freshness === 'stale' ? 'stale' : 'undated';

    return `
      <div class="chrono-strip">
        <div><span class="chrono-date">${escapeHtml(first)}</span> -> <span class="chrono-date">${escapeHtml(latest)}</span></div>
        <div class="tiny">${escapeHtml(span)}</div>
        <span class="freshness-tag">${escapeHtml(freshnessLabel)}</span>
      </div>
    `;
  }

  function renderFormats(formats) {
    if (!formats.length) return '<span class="format-chip">none</span>';
    return formats.map((fmt) => `<span class="format-chip">.${escapeHtml(fmt)}</span>`).join(' ');
  }

  function renderPathPreview(group) {
    const p = group.latestPathPieces;
    return `<div class="path-preview" title="${escapeHtml(p.full)}">${escapeHtml(p.short)}</div>`;
  }

  function selectGroup(groupKey) {
    state.selectedGroupKey = groupKey;
    renderInspector();
  }

  function renderInspector() {
    const group = state.selectedGroupKey ? groupByKey.get(state.selectedGroupKey) : null;
    if (!group) {
      metaInspector.textContent = 'Select a record row to inspect detailed metadata, path context, and candidate mappings.';
      return;
    }

    const metadataRows = [
      ['Work Title', group.workTitle],
      ['Family', group.family],
      ['Latest Role', group.latestRole],
      ['Method Class', group.methodClass],
      ['Phase / Layer', group.phaseLayer],
      ['First Seen in Pack', group.firstSeen],
      ['Latest Seen in Pack', group.latestSeen],
      ['Files in Group', String(group.filesInGroup)],
      ['Unique File Variants', String(group.uniqueFileVariants)],
      ['Formats', group.formats.map((f) => `.${f}`).join(', ') || 'none'],
      ['Version Signals Seen', group.versionSignals.join(', ') || 'none'],
      ['Latest File', group.latestFile],
      ['Latest Context', group.latestContext],
      ['Latest Path', group.latestPath || 'n/a'],
      ['Authorship Confidence', `${group.authorshipConfidence} (${group.confidenceScore.toFixed(3)})`],
      ['Source Basis', group.sourceBasis],
      ['Other Paths Sample', group.otherPaths.join(' | ') || 'none']
    ];

    const metadataGrid = metadataRows
      .map(([key, val]) => `<div class="inspector-key">${escapeHtml(key)}</div><div class="inspector-val">${escapeHtml(val)}</div>`)
      .join('');

    const candidateRows = group.records
      .slice()
      .sort((a, b) => b.score - a.score || a.rebuiltName.localeCompare(b.rebuiltName))
      .map((rec, idx) => `
        <tr>
          <td class="mono">${idx + 1}</td>
          <td class="mono">${escapeHtml(rec.originalName)}</td>
          <td class="mono">${escapeHtml(rec.rebuiltName)}</td>
          <td><span class="score-pill ${rec.score >= 0.78 ? 'high' : rec.score >= 0.58 ? 'med' : 'low'}">${rec.score.toFixed(3)}</span></td>
          <td>${escapeHtml(rec.originalRole)} / ${escapeHtml(rec.originalMethodClass)}</td>
          <td>${escapeHtml(rec.governanceFunction)}</td>
          <td class="mono">${escapeHtml(rec.rebuiltPath)}</td>
        </tr>
      `)
      .join('');

    const allFlags = group.flags.length ? group.flags.map((flag) => `<span class="data-chip">${escapeHtml(flag)}</span>`).join(' ') : '<span class="data-chip">no risk flags</span>';

    metaInspector.innerHTML = `
      <div class="inspector-head">
        <h3 class="inspector-title">${escapeHtml(group.workTitle)}</h3>
        <div>${renderStatusBadge(group.status, false)}</div>
      </div>
      <div class="badge-stack" style="margin-bottom:8px;">
        <span class="data-chip">Family: ${escapeHtml(group.family)}</span>
        <span class="data-chip">Role: ${escapeHtml(group.latestRole)}</span>
        <span class="data-chip">Confidence: ${escapeHtml(group.authorshipConfidence)} (${group.confidenceScore.toFixed(3)})</span>
        <span class="data-chip">Files: ${group.filesInGroup}</span>
        <span class="data-chip">Variants: ${group.uniqueFileVariants}</span>
      </div>
      <div class="badge-stack">${allFlags}</div>
      <div class="inspector-grid" style="margin-top:8px;">${metadataGrid}</div>

      <details class="raw-details" open>
        <summary>Path and context details</summary>
        <div class="inline-path" style="margin-top:6px;">
          <div class="path-file">File: ${escapeHtml(group.latestPathPieces.file)}</div>
          <div class="path-context">Context: ${escapeHtml(group.latestPathPieces.context)}</div>
          <div class="path-context">Short: ${escapeHtml(group.latestPathPieces.short)}</div>
          <div class="path-context">Full: ${escapeHtml(group.latestPathPieces.full || 'n/a')}</div>
        </div>
      </details>

      <details class="raw-details">
        <summary>Candidate mapping rows (${group.records.length})</summary>
        <div class="inner-table-wrap">
          <table class="inner-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Original</th>
                <th>Rebuilt</th>
                <th>Score</th>
                <th>Role / Class</th>
                <th>Governance Function</th>
                <th>Rebuilt Path</th>
              </tr>
            </thead>
            <tbody>${candidateRows}</tbody>
          </table>
        </div>
      </details>

      <details class="raw-details">
        <summary>Raw metadata JSON</summary>
        <pre class="small" style="white-space:pre-wrap; margin:6px 0 0;">${escapeHtml(JSON.stringify({
          work_title: group.workTitle,
          family: group.family,
          latest_role: group.latestRole,
          first_seen_in_pack: group.firstSeen,
          latest_seen_in_pack: group.latestSeen,
          files_in_group: group.filesInGroup,
          unique_file_variants: group.uniqueFileVariants,
          formats: group.formats,
          version_signals_seen: group.versionSignals,
          latest_file: group.latestFile,
          latest_context: group.latestContext,
          latest_path: group.latestPath,
          authorship_confidence: group.authorshipConfidence,
          source_basis: group.sourceBasis,
          other_paths_sample: group.otherPaths,
          inferred_status: group.status,
          inferred_urgency: group.urgencyScore
        }, null, 2))}</pre>
      </details>
    `;
  }

  function setQuickHeaders(mode) {
    const head = quickTable.tHead.rows[0].cells;

    if (mode === 'category') {
      head[0].textContent = 'Category (Family)';
      head[1].textContent = 'Role / Class Snapshot';
      head[2].textContent = 'Confidence';
      head[3].textContent = 'Revision Burden';
      head[4].textContent = 'Chronology';
      head[5].textContent = 'Status Distribution';
      head[6].textContent = 'Attention Priority';
      return;
    }

    if (mode === 'date') {
      head[0].textContent = 'First Seen Date';
      head[1].textContent = 'Family / Role Snapshot';
      head[2].textContent = 'Confidence';
      head[3].textContent = 'Revision Burden';
      head[4].textContent = 'Date Span';
      head[5].textContent = 'Status Distribution';
      head[6].textContent = 'Attention Priority';
      return;
    }

    head[0].textContent = 'Work Title';
    head[1].textContent = 'Family / Latest Role';
    head[2].textContent = 'Authorship Confidence';
    head[3].textContent = 'Revision / Duplication';
    head[4].textContent = 'Chronology';
    head[5].textContent = 'Reconciliation Status';
    head[6].textContent = 'Review Urgency';
  }

  function renderGroupRows(visibleGroups) {
    setQuickHeaders('instance');
    quickBody.innerHTML = '';

    for (const group of visibleGroups) {
      const tr = document.createElement('tr');
      tr.tabIndex = 0;
      tr.setAttribute('role', 'button');
      tr.dataset.groupKey = group.groupKey;

      const confidenceMeter = renderMeter(group.confidenceScore * 100, 100, group.authorshipConfidence);
      const complexityMeter = renderMeter(group.complexityScore, 100, group.complexityLabel);
      const urgencyMeter = renderMeter(group.urgencyScore, 100, group.urgencyLabel);

      const versionChips = group.versionSignals.length
        ? group.versionSignals.map((sig) => `<span class="data-chip">${escapeHtml(sig)}</span>`).join(' ')
        : '<span class="data-chip">none</span>';

      const flagChips = group.flags.length
        ? group.flags.slice(0, 3).map((flag) => `<span class="data-chip">${escapeHtml(flag)}</span>`).join(' ')
        : '<span class="data-chip">no flag</span>';

      tr.innerHTML = `
        <td>
          <div class="record-title">${escapeHtml(group.workTitle)}</div>
          <div class="small mono">Latest file: ${escapeHtml(group.latestFile)}</div>
          ${renderPathPreview(group)}
        </td>
        <td>
          <div class="badge-stack">
            <span class="data-chip">Family: ${escapeHtml(group.family)}</span>
            <span class="data-chip">Role: ${escapeHtml(group.latestRole)}</span>
            <span class="data-chip">Class: ${escapeHtml(group.methodClass)}</span>
          </div>
          <div style="margin-top:5px;">${renderFormats(group.formats)}</div>
        </td>
        <td>
          <div>${confidenceMeter}</div>
          <div class="tiny" style="margin-top:4px;">Top score: ${group.confidenceScore.toFixed(3)}</div>
        </td>
        <td>
          <div class="badge-stack">
            <span class="data-chip">Files: ${group.filesInGroup}</span>
            <span class="data-chip">Variants: ${group.uniqueFileVariants}</span>
          </div>
          <div style="margin-top:5px;">${complexityMeter}</div>
          <details class="record-summary-details">
            <summary>Version signals</summary>
            <div style="margin-top:4px;" class="badge-stack">${versionChips}</div>
          </details>
        </td>
        <td>
          ${formatDateSpan(group)}
        </td>
        <td>
          ${renderStatusBadge(group.status, false)}
          <div class="tiny" style="margin-top:4px;">Inferred by score + variant + metadata signals</div>
        </td>
        <td>
          <div class="attention-cell">
            <div>${urgencyMeter}</div>
            <div class="badge-stack">${flagChips}</div>
          </div>
        </td>
      `;

      tr.addEventListener('click', () => {
        state.selectedGroupKey = group.groupKey;
        renderInspector();
      });

      tr.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          state.selectedGroupKey = group.groupKey;
          renderInspector();
        }
      });

      if (state.selectedGroupKey === group.groupKey) {
        tr.style.background = '#f4ecff';
      }

      quickBody.appendChild(tr);
    }

    if (!visibleGroups.length) {
      quickBody.innerHTML = '<tr><td colspan="7" class="small">No grouped records match current filters.</td></tr>';
    }
  }

  function aggregateViewRows(visibleGroups, mode) {
    if (mode === 'category') {
      const map = new Map();
      for (const g of visibleGroups) {
        if (!map.has(g.family)) map.set(g.family, []);
        map.get(g.family).push(g);
      }

      return Array.from(map.entries())
        .map(([key, subset]) => ({
          key,
          subset,
          avgConfidence: subset.reduce((sum, g) => sum + g.confidenceScore, 0) / subset.length,
          avgUrgency: subset.reduce((sum, g) => sum + g.urgencyScore, 0) / subset.length,
          variants: subset.reduce((sum, g) => sum + g.uniqueFileVariants, 0),
          files: subset.reduce((sum, g) => sum + g.filesInGroup, 0),
          dominantRole: topFromCountMap(countBy(subset, (g) => g.latestRole), 'n/a'),
          dominantClass: topFromCountMap(countBy(subset, (g) => g.methodClass), 'n/a'),
          firstSeen: subset.map((g) => g.firstSeen).filter((d) => d !== 'undated').sort()[0] || 'undated',
          latestSeen: subset.map((g) => g.latestSeen).filter((d) => d !== 'undated').sort().slice(-1)[0] || 'undated',
          statusSpread: buildDistribution(subset, (g) => STATUS_MODEL[g.status]?.label || g.status)
        }))
        .sort((a, b) => b.avgUrgency - a.avgUrgency || b.subset.length - a.subset.length);
    }

    const map = new Map();
    for (const g of visibleGroups) {
      const key = g.firstSeen || 'undated';
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(g);
    }

    return Array.from(map.entries())
      .map(([key, subset]) => ({
        key,
        subset,
        avgConfidence: subset.reduce((sum, g) => sum + g.confidenceScore, 0) / subset.length,
        avgUrgency: subset.reduce((sum, g) => sum + g.urgencyScore, 0) / subset.length,
        variants: subset.reduce((sum, g) => sum + g.uniqueFileVariants, 0),
        files: subset.reduce((sum, g) => sum + g.filesInGroup, 0),
        dominantRole: topFromCountMap(countBy(subset, (g) => g.latestRole), 'n/a'),
        dominantFamily: topFromCountMap(countBy(subset, (g) => g.family), 'n/a'),
        latestSeen: subset.map((g) => g.latestSeen).filter((d) => d !== 'undated').sort().slice(-1)[0] || 'undated',
        statusSpread: buildDistribution(subset, (g) => STATUS_MODEL[g.status]?.label || g.status)
      }))
      .sort((a, b) => {
        if (a.key === 'undated') return 1;
        if (b.key === 'undated') return -1;
        return a.key.localeCompare(b.key);
      });
  }

  function renderAggregateRows(visibleGroups, mode) {
    setQuickHeaders(mode);
    quickBody.innerHTML = '';

    const rows = aggregateViewRows(visibleGroups, mode);

    for (const row of rows) {
      const confidenceMeter = renderMeter(row.avgConfidence * 100, 100, confidenceLabel(row.avgConfidence));
      const urgencyMeter = renderMeter(row.avgUrgency, 100, row.avgUrgency >= 80 ? 'immediate' : row.avgUrgency >= 60 ? 'high' : row.avgUrgency >= 40 ? 'medium' : 'low');
      const statusPreview = row.statusSpread.slice(0, 2).map((s) => `<span class="data-chip">${escapeHtml(s.label)}: ${s.value}</span>`).join(' ');

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><div class="record-title">${escapeHtml(row.key)}</div><div class="small">Grouped records: ${row.subset.length}</div></td>
        <td>
          <div class="badge-stack">
            <span class="data-chip">Role: ${escapeHtml(row.dominantRole || 'n/a')}</span>
            <span class="data-chip">${mode === 'category' ? `Class: ${escapeHtml(row.dominantClass || 'n/a')}` : `Family: ${escapeHtml(row.dominantFamily || 'n/a')}`}</span>
          </div>
        </td>
        <td>${confidenceMeter}<div class="tiny" style="margin-top:4px;">Avg: ${row.avgConfidence.toFixed(3)}</div></td>
        <td>
          <div class="badge-stack">
            <span class="data-chip">Files: ${row.files}</span>
            <span class="data-chip">Variants: ${row.variants}</span>
          </div>
        </td>
        <td>
          <div class="chrono-strip">
            <div><span class="chrono-date">${escapeHtml(row.key)}</span>${mode === 'category' ? ` -> <span class="chrono-date">${escapeHtml(row.latestSeen)}</span>` : ''}</div>
            <div class="tiny">${mode === 'category' ? `first seen ${escapeHtml(row.firstSeen)}` : `latest seen ${escapeHtml(row.latestSeen)}`}</div>
          </div>
        </td>
        <td>${statusPreview || '<span class="data-chip">none</span>'}</td>
        <td>${urgencyMeter}</td>
      `;

      tr.addEventListener('click', () => {
        const summary = {
          mode,
          key: row.key,
          grouped_records: row.subset.length,
          avg_confidence: row.avgConfidence.toFixed(3),
          avg_urgency: row.avgUrgency.toFixed(1),
          total_files_in_group: row.files,
          total_unique_variants: row.variants,
          dominant_role: row.dominantRole,
          dominant_class_or_family: mode === 'category' ? row.dominantClass : row.dominantFamily,
          status_distribution: row.statusSpread.map((x) => `${x.label}: ${x.value}`).join(', ')
        };

        metaInspector.innerHTML = `
          <div class="inspector-head">
            <h3 class="inspector-title">${escapeHtml(mode === 'category' ? 'Category Summary' : 'Date Summary')} - ${escapeHtml(row.key)}</h3>
          </div>
          <div class="inspector-grid">
            ${Object.entries(summary).map(([k, v]) => `<div class="inspector-key">${escapeHtml(k.replaceAll('_', ' '))}</div><div class="inspector-val">${escapeHtml(String(v))}</div>`).join('')}
          </div>
          <details class="raw-details">
            <summary>Contributing work titles (${row.subset.length})</summary>
            <div class="inner-table-wrap">
              <table class="inner-table">
                <thead><tr><th>Work Title</th><th>Status</th><th>Confidence</th><th>Files</th><th>Variants</th></tr></thead>
                <tbody>
                  ${row.subset.map((g) => `<tr><td>${escapeHtml(g.workTitle)}</td><td>${renderStatusBadge(g.status, false)}</td><td>${g.confidenceScore.toFixed(3)}</td><td>${g.filesInGroup}</td><td>${g.uniqueFileVariants}</td></tr>`).join('')}
                </tbody>
              </table>
            </div>
          </details>
        `;
      });

      quickBody.appendChild(tr);
    }

    if (!rows.length) {
      quickBody.innerHTML = '<tr><td colspan="7" class="small">No aggregate rows under current filters.</td></tr>';
    }
  }

  function syncRawMappingVisibility(visibleGroups) {
    const visibleKeys = new Set(visibleGroups.map((g) => g.groupKey));
    const bestIds = new Set(visibleGroups.map((g) => g.bestRecord.id));
    const minScore = (Number.parseFloat(scoreInput.value) || 0) / 100;

    for (const rec of records) {
      let show = visibleKeys.has(rec.groupKey);
      if (show && topOnly.checked) show = bestIds.has(rec.id);
      if (show && rec.score < minScore) show = false;
      if (show && hideGeneric.checked && rec.generic) show = false;
      rec.tr.style.display = show ? '' : 'none';
    }

    mappingTable.classList.toggle('compact-mode', compactMode.checked);
  }

  function updateMiniStats(visibleGroups) {
    const visibleVariantTotal = visibleGroups.reduce((sum, g) => sum + g.uniqueFileVariants, 0);
    const avgConfidence = visibleGroups.length
      ? visibleGroups.reduce((sum, g) => sum + g.confidenceScore, 0) / visibleGroups.length
      : 0;

    statOriginals.textContent = String(visibleGroups.length);
    statVisible.textContent = String(visibleVariantTotal);
    statAvg.textContent = avgConfidence.toFixed(3);
  }

  function aggregateTimeline(segment, fromKey, toKey) {
    const grouped = new Map();

    for (const row of timelineRows) {
      const bucket = bucketDate(row.date, segment);
      if (fromKey && bucket < fromKey) continue;
      if (toKey && bucket > toKey) continue;

      if (!grouped.has(bucket)) {
        grouped.set(bucket, {
          key: bucket,
          hephaistos: 0,
          masterPack: 0,
          masterCore: 0,
          points: 0
        });
      }

      const target = grouped.get(bucket);
      target.hephaistos += row.hephaistos;
      target.masterPack += row.masterPack;
      target.masterCore += row.masterCore;
      target.points += 1;
    }

    return Array.from(grouped.values()).sort((a, b) => {
      if (a.key === 'undated') return 1;
      if (b.key === 'undated') return -1;
      return a.key.localeCompare(b.key);
    });
  }

  function renderTimeline(activeKey) {
    const segment = timelineSegment.value;
    const zoom = Number.parseInt(timelineZoom.value || '100', 10);
    const from = timelineFrom.value;
    const to = timelineTo.value;

    timelineZoomLabel.textContent = `${zoom}%`;
    timelineBars.style.maxHeight = `${Math.round(2.7 * zoom)}px`;

    const data = aggregateTimeline(segment, from, to);
    const maxValue = Math.max(1, ...data.flatMap((d) => [d.hephaistos, d.masterPack, d.masterCore]));

    timelineBars.innerHTML = '';

    for (const item of data) {
      const dominant = [
        { key: 'MASTER PACK', value: item.masterPack },
        { key: 'HEPHAISTOS_BUILD', value: item.hephaistos },
        { key: 'MASTERxMASTERxMASTER', value: item.masterCore }
      ].sort((a, b) => b.value - a.value)[0];

      const row = document.createElement('div');
      row.className = `timeline-row${activeKey && activeKey === item.key ? ' active' : ''}`;
      row.innerHTML = `
        <div class="timeline-date">${escapeHtml(item.key)}</div>
        <div class="bars">
          <div class="bar master" title="MASTER PACK: ${item.masterPack}"><span style="width:${(item.masterPack / maxValue) * 100}%"></span></div>
          <div class="bar heph" title="HEPHAISTOS_BUILD: ${item.hephaistos}"><span style="width:${(item.hephaistos / maxValue) * 100}%"></span></div>
          <div class="bar core" title="MASTERxMASTERxMASTER: ${item.masterCore}"><span style="width:${(item.masterCore / maxValue) * 100}%"></span></div>
        </div>
      `;

      row.addEventListener('click', () => {
        state.selectedTimelineKey = item.key;
        const detailRows = {
          timeline_key: item.key,
          segment_mode: segment,
          points_aggregated: item.points,
          hephaistos_total: item.hephaistos,
          master_pack_total: item.masterPack,
          masterx_total: item.masterCore,
          dominant_source: `${dominant.key} (${dominant.value})`
        };

        timelineInspector.innerHTML = `
          <strong>Timeline segment: ${escapeHtml(item.key)}</strong>
          <div class="meta-grid" style="margin-top:6px;">
            ${Object.entries(detailRows).map(([k, v]) => `<div class="meta-key">${escapeHtml(k.replaceAll('_', ' '))}</div><div class="meta-val">${escapeHtml(String(v))}</div>`).join('')}
          </div>
        `;

        if (segment === 'day') {
          const hasDateOption = Array.from(dateSelect.options).some((o) => o.value === item.key);
          if (hasDateOption) {
            dateSelect.value = item.key;
            applyAll();
            return;
          }
        }

        renderTimeline(item.key);
      });

      timelineBars.appendChild(row);
    }

    if (!data.length) {
      timelineBars.innerHTML = '<div class="tiny">No timeline rows under selected range.</div>';
    }
  }

  function renderRecordTable(visibleGroups) {
    if (viewMode.value === 'category') {
      renderAggregateRows(visibleGroups, 'category');
      return;
    }

    if (viewMode.value === 'date') {
      renderAggregateRows(visibleGroups, 'date');
      return;
    }

    renderGroupRows(visibleGroups);

    if (!state.selectedGroupKey && visibleGroups[0]) {
      state.selectedGroupKey = visibleGroups[0].groupKey;
      renderInspector();
    } else if (state.selectedGroupKey && !visibleGroups.some((g) => g.groupKey === state.selectedGroupKey)) {
      state.selectedGroupKey = visibleGroups[0] ? visibleGroups[0].groupKey : null;
      renderInspector();
    }
  }

  function renderComparison(visibleGroups) {
    renderComparisonOptions(visibleGroups);

    const mode = comparisonMode.value;
    const entityA = aggregateComparisonEntity(mode, compareLeft.value, visibleGroups);
    const entityB = aggregateComparisonEntity(mode, compareRight.value, visibleGroups);

    renderComparisonCard(compareCardA, 'Entity A', entityA);
    renderComparisonCard(compareCardB, 'Entity B', entityB);
    renderComparisonDiff(entityA, entityB);
  }

  function applyAll() {
    const visible = sortVisibleGroups(applyGroupFilters());

    updateMiniStats(visible);
    renderExecutiveSummary(groups, visible);
    renderFilterChips();
    renderAnalytics(visible);
    renderRecordTable(visible);
    renderComparison(visible);
    syncRawMappingVisibility(visible);

    if (viewMode.value !== 'instance') {
      state.selectedGroupKey = null;
    }

    renderTimeline(state.selectedTimelineKey);
  }

  searchInput.addEventListener('input', applyAll);
  scoreInput.addEventListener('input', applyAll);
  topOnly.addEventListener('change', applyAll);
  hideGeneric.addEventListener('change', applyAll);
  compactMode.addEventListener('change', applyAll);
  viewMode.addEventListener('change', applyAll);
  categorySelect.addEventListener('change', applyAll);
  dateSelect.addEventListener('change', applyAll);

  familyFilter.addEventListener('change', applyAll);
  roleFilter.addEventListener('change', applyAll);
  confidenceFilter.addEventListener('change', applyAll);
  statusFilter.addEventListener('change', applyAll);
  formatFilter.addEventListener('change', applyAll);
  sortBy.addEventListener('change', applyAll);
  riskOnly.addEventListener('change', applyAll);
  ambiguousOnly.addEventListener('change', applyAll);
  duplicateOnly.addEventListener('change', applyAll);
  lowConfidenceOnly.addEventListener('change', applyAll);

  comparisonMode.addEventListener('change', applyAll);
  compareLeft.addEventListener('change', applyAll);
  compareRight.addEventListener('change', applyAll);

  timelineSegment.addEventListener('change', () => {
    refreshTimelineRangeOptions();
    applyAll();
  });
  timelineFrom.addEventListener('change', applyAll);
  timelineTo.addEventListener('change', applyAll);
  timelineZoom.addEventListener('input', applyAll);

  metaInspector.textContent = 'Select a record row to inspect detailed metadata, path context, and candidate mappings.';
  if (timelineInspector) timelineInspector.textContent = 'Click a timeline segment to inspect details. Day mode can drive the Date filter.';

  applyAll();
})();
