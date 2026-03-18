import { useEffect, useRef, useState } from 'react';
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react';
import RichTextContent from '../RichTextContent';
import { formatAdminTextForDisplay } from '../../lib/textFormat';

const PUBLICATION_TYPES = ['', 'Insight', 'Paper', 'Briefing', 'Protocol', 'Working Paper', 'Article', 'Service'];
const PUBLICATION_VENUES = ['', 'PHAROS', 'LinkedIn', 'Substack', 'Medium', 'Conference', 'Journal', 'Client Deliverable'];
const PUBLICATION_LINK_TARGETS = [
  { value: '', label: 'None' },
  { value: '/about#insights', label: 'About -> PHAROS insights' },
  { value: '/services/menu', label: 'Service offers page' },
];
const PUBLISHER_SECTIONS = [
  {
    value: 'pharos_insights',
    label: 'About -> PHAROS insights',
    description: 'Use for PHAROS-branded insights that should appear on the public About page.',
  },
  {
    value: 'migration_review',
    label: 'Legacy migration review',
    description: 'Use for legacy portfolio or non-PHAROS material that should stay out of the PHAROS public surface.',
  },
  {
    value: 'services_reference',
    label: 'Services -> Reference material',
    description: 'Reserve for service-linked collateral and internal reference pieces.',
  },
];

const getDefaultPublicationLink = (publicationType) => {
  const normalizedType = (publicationType || '').trim().toLowerCase();
  if (normalizedType.includes('insight')) return '/about#insights';
  return '';
};

const isPresetPublicationLink = (linkValue) => PUBLICATION_LINK_TARGETS.some((target) => target.value === linkValue);

const inferSiteSection = (publication = {}) => {
  if (publication.site_section === 'about_publications') return 'pharos_insights';
  if (publication.site_section === 'portfolio_published' || publication.site_section === 'portfolio_working_papers') {
    return 'migration_review';
  }
  if (publication.site_section) return publication.site_section;
  if (publication.status === 'in_development') return 'migration_review';
  if ((publication.link || '').startsWith('/services')) return 'services_reference';
  return 'pharos_insights';
};

const createEmptyPublication = (siteSection = 'pharos_insights') => ({
  type: '',
  title: '',
  venue: '',
  year: '',
  description: '',
  link: '',
  internal: false,
  status: 'draft',
  abstract: '',
  site_section: siteSection,
});

const getSectionDetails = (sectionValue) => PUBLISHER_SECTIONS.find((section) => section.value === sectionValue) || PUBLISHER_SECTIONS[0];

const sortPublications = (left, right) => {
  const rightYear = Number.parseInt(right.year, 10) || 0;
  const leftYear = Number.parseInt(left.year, 10) || 0;
  const yearDelta = rightYear - leftYear;
  if (yearDelta !== 0) return yearDelta;

  return String(right.created_at || '').localeCompare(String(left.created_at || ''));
};

const PublicationPublisher = ({ apiUrl, publications, onRefresh, request = fetch, t }) => {
  const [selectedSection, setSelectedSection] = useState('pharos_insights');
  const [editingPublication, setEditingPublication] = useState(null);
  const [form, setForm] = useState(createEmptyPublication());
  const [linkTarget, setLinkTarget] = useState('');
  const [customLink, setCustomLink] = useState('');
  const [showPreview, setShowPreview] = useState(true);
  const [requestState, setRequestState] = useState({ loading: false, error: '', message: '' });
  const editorRef = useRef(null);

  useEffect(() => {
    if (editingPublication) return;
    setForm((current) => (
      current.site_section === selectedSection ? current : { ...current, site_section: selectedSection }
    ));
  }, [editingPublication, selectedSection]);

  const selectedSectionDetails = getSectionDetails(selectedSection);
  const filteredPublications = [...publications]
    .filter((publication) => inferSiteSection(publication) === selectedSection)
    .sort(sortPublications);

  const getSectionCount = (sectionValue) => publications.filter((publication) => inferSiteSection(publication) === sectionValue).length;

  const startNewPublication = (sectionValue = selectedSection) => {
    setEditingPublication(null);
    setSelectedSection(sectionValue);
    setForm(createEmptyPublication(sectionValue));
    setLinkTarget('');
    setCustomLink('');
    setRequestState({ loading: false, error: '', message: '' });
  };

  const handleEditPublication = (publication) => {
    const siteSection = inferSiteSection(publication);
    const existingLink = (publication.link || '').trim();

    setEditingPublication(publication);
    setSelectedSection(siteSection);
    setForm({
      type: publication.type || '',
      title: publication.title || '',
      venue: publication.venue || '',
      year: publication.year || '',
      description: publication.description || '',
      link: publication.link || '',
      internal: Boolean(publication.internal),
      status: publication.status || 'draft',
      abstract: publication.abstract || '',
      site_section: siteSection,
    });

    if (isPresetPublicationLink(existingLink)) {
      setLinkTarget(existingLink);
      setCustomLink('');
    } else {
      setLinkTarget('');
      setCustomLink(existingLink);
    }

    setRequestState({ loading: false, error: '', message: '' });
  };

  const updateDescriptionValue = (nextValue, selectionStart, selectionEnd) => {
    setForm((current) => ({ ...current, description: nextValue }));

    window.requestAnimationFrame(() => {
      if (!editorRef.current) return;
      editorRef.current.focus();
      if (typeof selectionStart === 'number' && typeof selectionEnd === 'number') {
        editorRef.current.setSelectionRange(selectionStart, selectionEnd);
      }
    });
  };

  const applyInlineFormat = (prefix, suffix = prefix) => {
    const textarea = editorRef.current;
    const value = form.description || '';
    const selectionStart = textarea?.selectionStart ?? value.length;
    const selectionEnd = textarea?.selectionEnd ?? value.length;
    const selectedText = value.slice(selectionStart, selectionEnd) || 'Text';
    const nextValue = `${value.slice(0, selectionStart)}${prefix}${selectedText}${suffix}${value.slice(selectionEnd)}`;

    updateDescriptionValue(
      nextValue,
      selectionStart + prefix.length,
      selectionStart + prefix.length + selectedText.length
    );
  };

  const applyListFormat = (type) => {
    const textarea = editorRef.current;
    const value = form.description || '';
    const selectionStart = textarea?.selectionStart ?? value.length;
    const selectionEnd = textarea?.selectionEnd ?? value.length;
    const selectedText = value.slice(selectionStart, selectionEnd);
    const source = selectedText || (type === 'ordered' ? 'First item\nSecond item' : 'First point\nSecond point');
    const lines = source.split('\n').map((line) => line.trim()).filter(Boolean);

    const formatted = lines.map((line, index) => {
      const normalizedLine = line.replace(/^[-*•]\s+/, '').replace(/^\d+\.\s+/, '');
      return type === 'ordered' ? `${index + 1}. ${normalizedLine}` : `- ${normalizedLine}`;
    }).join('\n');

    const nextValue = `${value.slice(0, selectionStart)}${formatted}${value.slice(selectionEnd)}`;

    updateDescriptionValue(nextValue, selectionStart, selectionStart + formatted.length);
  };

  const persistPublication = async (mode) => {
    if (!form.title.trim()) {
      setRequestState({ loading: false, error: 'A title is required before saving.', message: '' });
      return;
    }

    setRequestState({ loading: true, error: '', message: '' });

    try {
      const inferredLink = getDefaultPublicationLink(form.type);
      const resolvedLink = (customLink || linkTarget || inferredLink).trim();
      const payload = {
        ...form,
        status: mode === 'publish' ? 'published' : form.status,
        link: resolvedLink,
        internal: resolvedLink.startsWith('/') || form.internal,
      };
      const endpoint = editingPublication ? `${apiUrl}/api/publications/${editingPublication.id}` : `${apiUrl}/api/publications`;
      const method = editingPublication ? 'PUT' : 'POST';
      const response = await request(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Publication request failed with ${response.status}`);
      }

      const savedPublication = await response.json();
      const savedLink = (savedPublication.link || '').trim();
      await onRefresh();
      setEditingPublication(savedPublication);
      setForm({
        type: savedPublication.type || '',
        title: savedPublication.title || '',
        venue: savedPublication.venue || '',
        year: savedPublication.year || '',
        description: savedPublication.description || '',
        link: savedPublication.link || '',
        internal: Boolean(savedPublication.internal),
        status: savedPublication.status || 'draft',
        abstract: savedPublication.abstract || '',
        site_section: inferSiteSection(savedPublication),
      });
      setSelectedSection(inferSiteSection(savedPublication));
      if (isPresetPublicationLink(savedLink)) {
        setLinkTarget(savedLink);
        setCustomLink('');
      } else {
        setLinkTarget('');
        setCustomLink(savedLink);
      }
      setRequestState({
        loading: false,
        error: '',
        message: mode === 'publish' ? 'Publication published to the selected website section.' : 'Publication saved.',
      });
      if (mode === 'publish') {
        setShowPreview(true);
      }
    } catch (error) {
      setRequestState({
        loading: false,
        error: error.message || 'Publication could not be saved.',
        message: '',
      });
    }
  };

  const handleDeletePublication = async (publication) => {
    if (!window.confirm(t.admin.deleteConfirm)) return;

    setRequestState({ loading: false, error: '', message: '' });
    const response = await request(`${apiUrl}/api/publications/${publication.id}`, { method: 'DELETE' });
    if (!response.ok) {
      setRequestState({ loading: false, error: 'Publication could not be deleted.', message: '' });
      return;
    }

    await onRefresh();

    if (editingPublication?.id === publication.id) {
      startNewPublication(selectedSection);
    }
  };

  return (
    <div className="publisher-shell" data-testid="publication-form">
      <aside className="publisher-sidebar card">
        <div className="publisher-sidebar-header">
          <p className="publisher-sidebar-kicker">{t.admin.publisherLabel || 'Publisher'}</p>
          <h3>{t.admin.websiteSections || 'Website sections'}</h3>
          <p>{t.admin.publisherIntro || 'Choose where the publication should appear, then shape the content before saving or publishing.'}</p>
        </div>

        <div className="publisher-section-list">
          {PUBLISHER_SECTIONS.map((section) => (
            <button
              key={section.value}
              type="button"
              onClick={() => setSelectedSection(section.value)}
              className={`publisher-section-button ${selectedSection === section.value ? 'is-active' : ''}`}
            >
              <span>{section.label}</span>
              <strong>{getSectionCount(section.value)}</strong>
              <small>{section.description}</small>
            </button>
          ))}
        </div>

        <div className="publisher-sidebar-divider" />

        <div className="publisher-sidebar-header">
          <div className="publisher-sidebar-row">
            <h4>{t.admin.entries || 'Entries'}</h4>
            <button type="button" onClick={() => startNewPublication(selectedSection)} className="btn-ghost text-sm" data-testid="add-publication-btn">
              <Plus className="w-4 h-4" />
              {t.admin.addPublication}
            </button>
          </div>
          <p>{filteredPublications.length ? `${filteredPublications.length} item(s) in this section.` : 'No entries in this section yet.'}</p>
        </div>

        <div className="publisher-entry-list">
          {filteredPublications.length ? filteredPublications.map((publication) => (
            <button
              key={publication.id}
              type="button"
              onClick={() => handleEditPublication(publication)}
              className={`publisher-entry ${editingPublication?.id === publication.id ? 'is-active' : ''}`}
            >
              <div className="publisher-entry-meta">
                <span>{publication.type || 'Publication'}</span>
                <span className={`publisher-status-pill publisher-status-${publication.status || 'draft'}`}>
                  {publication.status === 'published'
                    ? t.admin.published
                    : publication.status === 'in_development'
                      ? t.admin.inDevelopment
                      : t.admin.draft}
                </span>
              </div>
              <strong>{publication.title}</strong>
              <p>{formatAdminTextForDisplay(publication.abstract || publication.description || 'No preview copy yet.')}</p>
            </button>
          )) : (
            <div className="publisher-empty-state">
              <p>{t.admin.noPublications}</p>
            </div>
          )}
        </div>
      </aside>

      <section className="publisher-editor card">
        <div className="publisher-editor-header">
          <div>
            <p className="publisher-sidebar-kicker">{selectedSectionDetails.label}</p>
            <h3>{editingPublication ? t.admin.editPublication : t.admin.addPublication}</h3>
            <p>{selectedSectionDetails.description}</p>
          </div>
          <div className="publisher-editor-actions">
            {editingPublication ? (
              <button type="button" onClick={() => handleDeletePublication(editingPublication)} className="btn-ghost text-sm">
                <Trash2 className="w-4 h-4" />
                {t.admin.delete}
              </button>
            ) : null}
            <button type="button" onClick={() => setShowPreview((current) => !current)} className="btn-outline text-sm">
              <Eye className="w-4 h-4" />
              {showPreview ? (t.admin.hidePreview || 'Hide preview') : (t.admin.preview || 'Preview')}
            </button>
          </div>
        </div>

        {requestState.error ? <div className="publisher-notice publisher-notice-error">{requestState.error}</div> : null}
        {requestState.message ? <div className="publisher-notice publisher-notice-success">{requestState.message}</div> : null}

        <div className="publisher-field-grid">
          <label>
            <span>{t.admin.title} *</span>
            <input
              type="text"
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              placeholder="Publication title"
              data-testid="pub-title"
            />
          </label>

          <label>
            <span>{t.admin.type}</span>
            <select value={form.type} onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))}>
              {PUBLICATION_TYPES.map((option) => (
                <option key={option || 'empty-publication-type'} value={option}>
                  {option || 'Select type'}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>{t.admin.venue}</span>
            <select value={form.venue} onChange={(event) => setForm((current) => ({ ...current, venue: event.target.value }))}>
              {PUBLICATION_VENUES.map((option) => (
                <option key={option || 'empty-publication-venue'} value={option}>
                  {option || 'Select venue'}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>{t.admin.year}</span>
            <input
              type="text"
              value={form.year}
              onChange={(event) => setForm((current) => ({ ...current, year: event.target.value }))}
              placeholder="2026"
            />
          </label>

          <label>
            <span>{t.admin.status}</span>
            <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}>
              <option value="published">{t.admin.published}</option>
              <option value="in_development">{t.admin.inDevelopment}</option>
              <option value="draft">{t.admin.draft}</option>
            </select>
          </label>

          <label>
            <span>{t.admin.section || 'Section'}</span>
            <select
              value={form.site_section}
              onChange={(event) => {
                setForm((current) => ({ ...current, site_section: event.target.value }));
                setSelectedSection(event.target.value);
              }}
            >
              {PUBLISHER_SECTIONS.map((section) => (
                <option key={section.value} value={section.value}>{section.label}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="publisher-field-grid publisher-field-grid-tight">
          <label className="publisher-field-span-full">
            <span>{t.admin.abstract || 'Abstract'}</span>
            <textarea
              value={form.abstract}
              onChange={(event) => setForm((current) => ({ ...current, abstract: event.target.value }))}
              rows={3}
              placeholder="Short summary shown above the publication body."
            />
          </label>
        </div>

        <div className="publisher-editor-block">
          <div className="publisher-editor-block-header">
            <div>
              <h4>{t.admin.content || 'Content editor'}</h4>
              <p>{t.admin.editorHelp || 'Formatting supports bold, italic, underline, bullets, and numbered lists.'}</p>
            </div>
            <div className="publisher-toolbar">
              <button type="button" onClick={() => applyInlineFormat('**')}>Bold</button>
              <button type="button" onClick={() => applyInlineFormat('*')}>Italic</button>
              <button type="button" onClick={() => applyInlineFormat('<u>', '</u>')}>Underline</button>
              <button type="button" onClick={() => applyListFormat('unordered')}>Bullets</button>
              <button type="button" onClick={() => applyListFormat('ordered')}>Numbers</button>
            </div>
          </div>

          <textarea
            ref={editorRef}
            value={form.description}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            rows={12}
            className="publisher-editor-textarea"
            placeholder="Write the publication body here."
          />
        </div>

        <div className="publisher-field-grid">
          <label>
            <span>{t.admin.linkTarget || 'Link target'}</span>
            <select value={linkTarget} onChange={(event) => setLinkTarget(event.target.value)}>
              {PUBLICATION_LINK_TARGETS.map((target) => (
                <option key={target.value || 'empty-link-target'} value={target.value}>{target.label}</option>
              ))}
            </select>
          </label>

          <label>
            <span>{t.admin.link || 'Link'}</span>
            <input
              type="text"
              value={customLink}
              onChange={(event) => setCustomLink(event.target.value)}
              placeholder="/about#insights or https://..."
            />
          </label>

          <label className="publisher-checkbox">
            <input
              type="checkbox"
              checked={form.internal}
              onChange={(event) => setForm((current) => ({ ...current, internal: event.target.checked }))}
            />
            <span>{t.admin.internal}</span>
          </label>
        </div>

        <div className="publisher-submit-row">
          <button
            type="button"
            onClick={() => persistPublication('save')}
            className="btn-primary text-sm"
            data-testid="pub-save-btn"
            disabled={requestState.loading}
          >
            {requestState.loading ? (t.admin.saving || 'Saving...') : t.admin.save}
          </button>
          <button
            type="button"
            onClick={() => persistPublication('publish')}
            className="btn-dark text-sm"
            disabled={requestState.loading}
          >
            {t.admin.publish || 'Publish'}
          </button>
          <button type="button" onClick={() => startNewPublication(selectedSection)} className="btn-ghost text-sm">
            <Pencil className="w-4 h-4" />
            {t.admin.newDraft || 'New draft'}
          </button>
        </div>
      </section>

      {showPreview ? (
        <aside className="publisher-preview card">
          <div className="publisher-preview-header">
            <p className="publisher-sidebar-kicker">{t.admin.preview || 'Preview'}</p>
            <h3>{form.title || 'Untitled publication'}</h3>
            <p>{selectedSectionDetails.label}</p>
          </div>

          <div className="publisher-preview-meta">
            {form.type ? <span>{form.type}</span> : null}
            {form.year ? <span>{form.year}</span> : null}
            {form.venue ? <span>{form.venue}</span> : null}
          </div>

          {form.abstract ? <p className="publisher-preview-abstract">{form.abstract}</p> : null}

          {form.description ? (
            <RichTextContent text={form.description} />
          ) : (
            <div className="publisher-empty-state">
              <p>{t.admin.previewEmpty || 'Start writing and the formatted preview will appear here.'}</p>
            </div>
          )}
        </aside>
      ) : null}
    </div>
  );
};

export default PublicationPublisher;
