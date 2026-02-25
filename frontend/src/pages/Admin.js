import { useState } from 'react';
import { Lock, FileText, Plus, Download, Upload, Trash2, Save } from 'lucide-react';

const ADMIN_PASSPHRASE = process.env.REACT_APP_ADMIN_PASSPHRASE || 'AIG-ctrl-2026!';

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [passphrase, setPassphrase] = useState('');
  const [error, setError] = useState('');
  const [drafts, setDrafts] = useState([]);
  const [currentDraft, setCurrentDraft] = useState({
    title: '',
    date: '',
    type: 'briefing',
    context: 'regulated',
    abstract: '',
    content: ''
  });

  const contexts = [
    { id: 'regulated', label: 'Regulated Systems' },
    { id: 'enterprise-saas', label: 'Enterprise SaaS' },
    { id: 'procurement', label: 'Procurement & Vendor Risk' },
    { id: 'public-sector', label: 'Public Sector & Due Process' },
    { id: 'financial', label: 'Financial & Capital Systems' },
    { id: 'governance-architecture', label: 'Governance Architecture' }
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    if (passphrase === ADMIN_PASSPHRASE) {
      setAuthenticated(true);
      setError('');
    } else {
      setError('Invalid passphrase');
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setPassphrase('');
  };

  const handleSaveDraft = () => {
    if (!currentDraft.title || !currentDraft.date) {
      setError('Title and date are required');
      return;
    }
    const newDraft = {
      ...currentDraft,
      id: `draft-${Date.now()}`
    };
    setDrafts([...drafts, newDraft]);
    setCurrentDraft({
      title: '',
      date: '',
      type: 'briefing',
      context: 'regulated',
      abstract: '',
      content: ''
    });
    setError('');
  };

  const handleDeleteDraft = (id) => {
    setDrafts(drafts.filter(d => d.id !== id));
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(drafts, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'posts.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          setDrafts(imported);
        } catch (err) {
          setError('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] py-12 px-6 flex items-center justify-center" data-testid="admin-login">
        <div className="card max-w-md w-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#6366f1]/10 flex items-center justify-center">
              <Lock className="w-5 h-5 text-[#6366f1]" />
            </div>
            <h1 className="font-serif text-2xl font-semibold text-[#1a2744]">Private Posting</h1>
          </div>
          <p className="text-gray-600 text-sm mb-6">
            Draft and export your papers list as posts.json. Replace assets/data/posts.json with the exported file to publish.
          </p>
          <p className="text-xs text-gray-500 mb-6 p-3 bg-[#f8f9fc] rounded-lg">
            Note: this page is a convenience workflow for a static site. It is not a secure authentication system.
          </p>
          
          <form onSubmit={handleLogin}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Passphrase</label>
            <input
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#6366f1] focus:outline-none mb-4"
              placeholder="Enter passphrase"
              data-testid="admin-passphrase"
            />
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button type="submit" className="btn-primary w-full" data-testid="admin-login-btn">
              Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] py-12 px-6 md:px-12" data-testid="admin-page">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl font-semibold text-[#1a2744]">Admin Panel</h1>
          <button onClick={handleLogout} className="text-gray-500 hover:text-[#6366f1] text-sm">
            Log out
          </button>
        </div>

        {/* Add/Edit Form */}
        <div className="card mb-8">
          <h2 className="font-serif text-xl font-semibold text-[#1a2744] mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-[#6366f1]" />
            Add / Edit Paper
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={currentDraft.title}
                onChange={(e) => setCurrentDraft({...currentDraft, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#6366f1] focus:outline-none"
                data-testid="admin-title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date (YYYY-MM-DD)</label>
              <input
                type="date"
                value={currentDraft.date}
                onChange={(e) => setCurrentDraft({...currentDraft, date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#6366f1] focus:outline-none"
                data-testid="admin-date"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={currentDraft.type}
                onChange={(e) => setCurrentDraft({...currentDraft, type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#6366f1] focus:outline-none"
              >
                <option value="briefing">Briefing</option>
                <option value="paper">Paper</option>
                <option value="protocol">Protocol</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Context</label>
              <select
                value={currentDraft.context}
                onChange={(e) => setCurrentDraft({...currentDraft, context: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#6366f1] focus:outline-none"
              >
                {contexts.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Abstract</label>
            <textarea
              value={currentDraft.abstract}
              onChange={(e) => setCurrentDraft({...currentDraft, abstract: e.target.value})}
              rows={2}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#6366f1] focus:outline-none resize-none"
              data-testid="admin-abstract"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              value={currentDraft.content}
              onChange={(e) => setCurrentDraft({...currentDraft, content: e.target.value})}
              rows={8}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#6366f1] focus:outline-none resize-none"
              data-testid="admin-content"
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button onClick={handleSaveDraft} className="btn-primary flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save to drafts
          </button>
        </div>

        {/* Drafts List */}
        <div className="card mb-8">
          <h2 className="font-serif text-xl font-semibold text-[#1a2744] mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#6366f1]" />
            Current Drafts ({drafts.length})
          </h2>
          
          {drafts.length === 0 ? (
            <p className="text-gray-500 text-sm">No drafts yet. Add a paper above.</p>
          ) : (
            <div className="space-y-2">
              {drafts.map((draft) => (
                <div key={draft.id} className="flex items-center justify-between p-3 bg-[#f8f9fc] rounded-lg">
                  <div>
                    <p className="font-medium text-[#1a2744]">{draft.title}</p>
                    <p className="text-xs text-gray-500">{draft.date} · {draft.type} · {draft.context}</p>
                  </div>
                  <button 
                    onClick={() => handleDeleteDraft(draft.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Export/Import */}
        <div className="card">
          <h2 className="font-serif text-xl font-semibold text-[#1a2744] mb-4">Publish Step</h2>
          <ol className="text-gray-600 text-sm space-y-2 mb-6">
            <li>1. Click <strong>Export posts.json</strong>.</li>
            <li>2. Replace assets/data/posts.json with the exported file.</li>
            <li>3. Upload your updated site to your host (or commit if using Git).</li>
          </ol>
          
          <div className="flex flex-wrap gap-4">
            <button onClick={handleExport} className="btn-primary flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export posts.json
            </button>
            <label className="btn-ghost flex items-center gap-2 cursor-pointer">
              <Upload className="w-4 h-4" />
              Import posts.json
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
