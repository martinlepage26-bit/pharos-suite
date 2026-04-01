import { ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const COPY = {
  en: {
    eyebrow: 'Library',
    title: 'Standards, law, and references for review-grade governance work',
    body:
      'This is a selective reference base for teams answering procurement, audit, and policy scrutiny. Items are grouped by function so readers can move quickly from question to source.',
    sections: [
      {
        title: 'Frameworks and management systems',
        body: 'Use these for governance architecture, controls, and accountability design.',
        items: [
          { name: 'NIST AI Risk Management Framework', url: 'https://www.nist.gov/itl/ai-risk-management-framework', tag: 'Framework', status: 'Current' },
          { name: 'ISO/IEC 42001', url: 'https://www.iso.org/standard/81230.html', tag: 'Standard', status: 'Current' },
          { name: 'OECD AI Principles', url: 'https://oecd.ai/en/ai-principles', tag: 'Policy principles', status: 'Current' },
          { name: 'IEEE Ethically Aligned Design', url: 'https://ethicsinaction.ieee.org/', tag: 'Guidance', status: 'Foundational' }
        ]
      },
      {
        title: 'Law and regulatory direction',
        body: 'Use these when obligations, enforcement, or jurisdictional expectations are in scope.',
        items: [
          { name: 'EU AI Act', url: 'https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai', tag: 'Regulation', status: 'Current' },
          { name: 'Directive on Automated Decision-Making (Canada)', url: 'https://www.canada.ca/en/government/system/digital-government/digital-government-innovations/responsible-use-ai/guide-scope-directive-automated-decision-making.html', tag: 'Directive', status: 'Current' },
          { name: 'OMB Memorandum M-25-21', url: 'https://www.whitehouse.gov/wp-content/uploads/2025/02/M-25-21-Accelerating-Federal-Use-of-AI-through-Innovation-Governance-and-Public-Trust.pdf', tag: 'Federal policy', status: 'Current' },
          { name: 'UK AI Security Institute', url: 'https://www.aisi.gov.uk/', tag: 'Government body', status: 'Current' }
        ]
      },
      {
        title: 'Documentation and evidence references',
        body: 'Use these to structure records that reviewers can inspect and reproduce.',
        items: [
          { name: 'NIST SP 800-53', url: 'https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final', tag: 'Security controls', status: 'Current' },
          { name: 'Model Cards for Model Reporting', url: 'https://arxiv.org/abs/1810.03993', tag: 'Documentation method', status: 'Foundational' },
          { name: 'Datasheets for Datasets', url: 'https://arxiv.org/abs/1803.09010', tag: 'Documentation method', status: 'Foundational' },
          { name: 'AI Incident Database', url: 'https://incidentdatabase.ai/', tag: 'Incident evidence', status: 'Current' }
        ]
      }
    ],
    toolsTitle: 'Execution helpers',
    toolsBody: 'Practical tools for moving from reference to working artifact.',
    tools: [
      {
        name: 'Treasury Board AIA Tool',
        url: 'https://www.canada.ca/en/government/system/digital-government/digital-government-innovations/responsible-use-ai/algorithmic-impact-assessment.html',
        description: 'Impact-assessment workflow for public-sector automated decision systems.'
      },
      {
        name: 'NIST AI RMF Playbook',
        url: 'https://airc.nist.gov/AI_RMF_Knowledge_Base/Playbook',
        description: 'Implementation tactics for applying RMF controls in practice.'
      },
      {
        name: 'Guide to Peer Review of Automated Decision Systems',
        url: 'https://www.canada.ca/en/government/system/digital-government/digital-government-innovations/responsible-use-ai/guide-peer-review-automated-decision-systems.html',
        description: 'Peer-review framing for public-system accountability.'
      }
    ],
    notesTitle: 'Scope note',
    notesBody:
      'This library is intentionally selective. Historical or superseded policy material should be labeled as historical and not treated as active legal obligation without jurisdiction-specific confirmation.'
  },
  fr: {
    eyebrow: 'Bibliothèque',
    title: 'Normes, droit et références pour un travail de gouvernance orienté vers la revue',
    body:
      'Base de références sélective pour les équipes qui répondent à des pressions d’approvisionnement, d’audit et de politique publique. Les sources sont regroupées par fonction afin de passer rapidement de la question à la référence utile.',
    sections: [
      {
        title: 'Cadres et systèmes de management',
        body: 'À utiliser pour l’architecture de gouvernance, les contrôles et la répartition des responsabilités.',
        items: [
          { name: 'NIST AI Risk Management Framework', url: 'https://www.nist.gov/itl/ai-risk-management-framework', tag: 'Cadre', status: 'Actuel' },
          { name: 'ISO/IEC 42001', url: 'https://www.iso.org/standard/81230.html', tag: 'Norme', status: 'Actuel' },
          { name: 'OECD AI Principles', url: 'https://oecd.ai/en/ai-principles', tag: 'Principes de politique publique', status: 'Actuel' },
          { name: 'IEEE Ethically Aligned Design', url: 'https://ethicsinaction.ieee.org/', tag: 'Guide', status: 'Fondamental' }
        ]
      },
      {
        title: 'Droit et orientation réglementaire',
        body: 'À utiliser lorsque des obligations, des mécanismes d’application ou des attentes propres à une juridiction entrent dans la portée.',
        items: [
          { name: 'EU AI Act', url: 'https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai', tag: 'Réglementation', status: 'Actuel' },
          { name: 'Directive on Automated Decision-Making (Canada)', url: 'https://www.canada.ca/en/government/system/digital-government/digital-government-innovations/responsible-use-ai/guide-scope-directive-automated-decision-making.html', tag: 'Directive', status: 'Actuel' },
          { name: 'OMB Memorandum M-25-21', url: 'https://www.whitehouse.gov/wp-content/uploads/2025/02/M-25-21-Accelerating-Federal-Use-of-AI-through-Innovation-Governance-and-Public-Trust.pdf', tag: 'Politique fédérale', status: 'Actuel' },
          { name: 'UK AI Security Institute', url: 'https://www.aisi.gov.uk/', tag: 'Institution gouvernementale', status: 'Actuel' }
        ]
      },
      {
        title: 'Documentation et références de preuve',
        body: 'À utiliser pour structurer des traces que des réviseurs peuvent inspecter et reconstruire.',
        items: [
          { name: 'NIST SP 800-53', url: 'https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final', tag: 'Contrôles de sécurité', status: 'Actuel' },
          { name: 'Model Cards for Model Reporting', url: 'https://arxiv.org/abs/1810.03993', tag: 'Méthode documentaire', status: 'Fondamental' },
          { name: 'Datasheets for Datasets', url: 'https://arxiv.org/abs/1803.09010', tag: 'Méthode documentaire', status: 'Fondamental' },
          { name: 'AI Incident Database', url: 'https://incidentdatabase.ai/', tag: 'Preuve d’incident', status: 'Actuel' }
        ]
      }
    ],
    toolsTitle: 'Outils d’exécution',
    toolsBody: 'Points d’appui pratiques pour passer de la référence à un artefact de travail.',
    tools: [
      {
        name: 'Treasury Board AIA Tool',
        url: 'https://www.canada.ca/en/government/system/digital-government/digital-government-innovations/responsible-use-ai/algorithmic-impact-assessment.html',
        description: 'Démarche d’évaluation d’impact pour les systèmes publics de décision automatisée.'
      },
      {
        name: 'NIST AI RMF Playbook',
        url: 'https://airc.nist.gov/AI_RMF_Knowledge_Base/Playbook',
        description: 'Tactiques de mise en œuvre pour appliquer le RMF dans la pratique.'
      },
      {
        name: 'Guide to Peer Review of Automated Decision Systems',
        url: 'https://www.canada.ca/en/government/system/digital-government/digital-government-innovations/responsible-use-ai/guide-peer-review-automated-decision-systems.html',
        description: 'Cadre de revue par les pairs pour la responsabilité des systèmes publics.'
      }
    ],
    notesTitle: 'Note de portée',
    notesBody:
      'Cette bibliothèque est volontairement sélective. Le matériel de politique publique historique ou remplacé doit être traité comme tel, et non comme une obligation active sans vérification propre à la juridiction concernée.'
  }
};

const Library = () => {
  const { language } = useLanguage();
  const copy = COPY[language];

  return (
    <div data-testid="library-page">
      <section className="section">
        <div className="container section-shell reveal-up">
          <p className="kicker">{copy.eyebrow}</p>
          <h1 style={{ marginTop: '0.7rem' }}>{copy.title}</h1>
          <p className="body-lead" style={{ marginTop: '0.8rem' }}>{copy.body}</p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <div style={{ display: 'grid', gap: '1rem' }}>
            {copy.sections.map((section, sectionIndex) => (
              <article
                key={section.title}
                className="surface reveal-up"
                data-testid={`library-section-${sectionIndex}`}
              >
                <h2>{section.title}</h2>
                <p className="body-sm" style={{ marginTop: '0.55rem' }}>{section.body}</p>
                <div style={{ display: 'grid', gap: '0.65rem', marginTop: '0.85rem' }}>
                  {section.items.map((item, itemIndex) => (
                    <a
                      key={item.name}
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="surface surface-muted"
                      style={{ display: 'block', padding: '0.85rem' }}
                      data-testid={`library-item-${sectionIndex}-${itemIndex}`}
                    >
                      <div className="badge-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ color: 'var(--ink-950)' }}>{item.name}</strong>
                        <span className="badge-chip">{item.status}</span>
                      </div>
                      <p className="body-sm" style={{ marginTop: '0.45rem' }}>{item.tag}</p>
                      <span className="kicker" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.55rem' }}>
                        Open source
                        <ExternalLink size={12} />
                      </span>
                    </a>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <article className="surface reveal-up" data-testid="library-section-tools">
            <h2>{copy.toolsTitle}</h2>
            <p className="body-sm" style={{ marginTop: '0.55rem' }}>{copy.toolsBody}</p>
            <div className="grid-3" style={{ marginTop: '0.85rem' }}>
              {copy.tools.map((tool, index) => (
                <a
                  key={tool.name}
                  href={tool.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`surface surface-muted reveal-up delay-${Math.min(index, 3)}`}
                  data-testid={`library-tool-${index}`}
                >
                  <h3>{tool.name}</h3>
                  <p className="body-sm" style={{ marginTop: '0.5rem' }}>{tool.description}</p>
                  <span className="kicker" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.65rem' }}>
                    Open
                    <ExternalLink size={12} />
                  </span>
                </a>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <div className="surface surface-muted reveal-up">
            <h2>{copy.notesTitle}</h2>
            <p className="body-lead" style={{ marginTop: '0.65rem' }}>{copy.notesBody}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Library;
