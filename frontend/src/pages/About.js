import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import LighthouseGlyph from '../components/LighthouseGlyph';
import RichTextContent from '../components/RichTextContent';
import { useLanguage } from '../context/LanguageContext';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

const sortPublications = (left, right) => {
  const rightYear = Number.parseInt(right.year, 10) || 0;
  const leftYear = Number.parseInt(left.year, 10) || 0;
  const yearDelta = rightYear - leftYear;
  if (yearDelta !== 0) return yearDelta;

  return String(right.created_at || '').localeCompare(String(left.created_at || ''));
};

const FEATURED_PUBLICATION = {
  id: 'pub-trust-advantage-analysis',
  link: '/publications/trust-advantage-analysis',
  internal: true,
  status: 'published',
  site_section: 'about_publications',
  created_at: '2026-03-09T00:00:00Z'
};

const ABOUT_COPY = {
  en: {
    eyebrow: 'About',
    practiceLabel: 'Practice posture',
    practiceTitle: 'Legible governance under pressure',
    heroTitle: 'PHAROS AI Governance',
    heroBody: 'PHAROS is the public-facing AI governance practice led by Martin Lepage: a Montreal-based advisory centered on evidence, deterministic decision rights, controls, and review-ready documentation.',
    heroBody2: 'The work is built for organizations facing procurement pressure, audit review, vendor diligence, or committee oversight and needing governance that remains legible under scrutiny.',
    location: 'Montreal · Quebec · Canada',
    bookDebrief: 'Book a debrief',
    viewResearch: 'View research',
    practiceBody: 'The standard is simple: governance documentation should derive from evidence, decision rights and thresholds should stay explicit, and public claims should not outrun what the underlying architecture can support.',
    practiceBody2: 'That posture carries through the advisory work, the documentation structure, and the in-house systems supporting evidence handling and governance assessment behind the scenes.',
    infraLabel: 'InfraFabric',
    infraTitle: 'The structural framework under the deeper architecture work',
    infraBody: 'InfraFabric is the governance framework that preserves provenance, review gates, evidence lineage, and auditability so no capability claim outruns the state of the underlying infrastructure.',
    infraCards: [
      {
        title: 'Claim discipline',
        description: 'InfraFabric keeps capability claims tied to what the evidence and infrastructure can actually support right now.'
      },
      {
        title: 'Evidence lineage',
        description: 'Artifacts, processing runs, review decisions, evidence packages, assessments, and audit events stay explicit instead of collapsing into vague status.'
      },
      {
        title: 'Fail-closed posture',
        description: 'If lineage is missing or review evidence is incomplete, the claim narrows and the state stays provisional.'
      }
    ],
    modulesLabel: 'Internal modules',
    modulesTitle: 'AurorAI & CompassAI',
    modulesBody: 'AurorAI and CompassAI are in-house systems developed by Martin Lepage in accordance with Deterministic AI governance models by InfraFabric, with permission. AurorAI handles evidence and document processing. CompassAI handles governance intake, assessment, and output generation. Portal access is available below, and the shared admin surface remains separate.',
    modules: [
      {
        title: 'AurorAI',
        description: 'An in-house evidence and document engine developed by Martin Lepage in accordance with Deterministic AI governance models by InfraFabric, with permission.',
        portalPath: '/portal/aurorai'
      },
      {
        title: 'CompassAI',
        description: 'An in-house governance engine developed by Martin Lepage in accordance with Deterministic AI governance models by InfraFabric, with permission.',
        portalPath: '/portal/compassai'
      }
    ],
    portalButton: 'Client portal',
    adminButton: 'Admin',
    pharosLabel: 'Why PHAROS',
    pharosTitle: 'A lighthouse name for a governance system',
    pharosBody: 'The Pharos of Alexandria, one of the Seven Wonders of the ancient world, was not only a monument. It was orientation infrastructure: it made the coastline legible at distance, marked the threshold of safe entry, and helped ships move without striking what they could not yet see. This governance system carries that name for the same reason. PHAROS exists to make AI pathways, thresholds, evidence, and decision rights visible early enough that an organization can move under scrutiny without steering blind.',
    publicationsTitle: 'New Publications Every Week',
    loading: 'Loading publications',
    empty: 'No publications are assigned to the About page yet. Publish them from the Admin publisher and they will appear here.',
    readPublication: 'Read publication',
    openDocument: 'Open document',
    featuredPublication: {
      ...FEATURED_PUBLICATION,
      type: 'Insight',
      title: 'The Trust Advantage: Why Expertise Wins in the Era of AI-Driven Sales',
      venue: 'PHAROS',
      year: '2026',
      description: 'A PHAROS analysis of LinkedIn Sales Navigator’s 2025 Trust Advantage report, read alongside a governance paper on algorithmic fluency and interruption.',
      abstract: 'This publication argues that in AI-saturated sales environments, trust is built less through access to information than through timely human expertise, contextual judgment, and career-defensible proof. It links LinkedIn’s commercial findings on buyer trust to a governance lens focused on fluency, interruption, and review-ready accountability.'
    }
  },
  fr: {
    eyebrow: 'À propos',
    practiceLabel: 'Posture de pratique',
    practiceTitle: 'Une gouvernance lisible quand la pression monte',
    heroTitle: 'PHAROS AI Governance',
    heroBody: 'PHAROS est la pratique publique de gouvernance de l’IA dirigée par Martin Lepage, à Montréal, et centrée sur la preuve, des droits décisionnels déterministes, des contrôles explicites et une documentation prête pour l’examen.',
    heroBody2: 'Le travail vise les organisations qui font face à la pression de l’approvisionnement, à l’audit, à la diligence fournisseur ou à la surveillance de comité et qui ont besoin d’une gouvernance qui demeure lisible sous examen.',
    location: 'Montréal · Québec · Canada',
    bookDebrief: 'Réserver un échange',
    viewResearch: 'Voir la recherche',
    practiceBody: 'La norme est simple : la documentation de gouvernance doit découler de la preuve, les droits décisionnels et les seuils doivent rester explicites, et les déclarations publiques ne doivent pas dépasser ce que l’architecture sous-jacente peut réellement soutenir.',
    practiceBody2: 'Cette posture traverse le conseil, la structure documentaire et les systèmes internes qui soutiennent en arrière-plan le traitement de la preuve et l’évaluation de gouvernance.',
    infraLabel: 'InfraFabric',
    infraTitle: 'Le cadre structurel derrière l’architecture de fond',
    infraBody: 'InfraFabric est le cadre de gouvernance qui préserve la provenance, les portes de révision, la chaîne de preuve et l’auditabilité afin qu’aucune revendication de capacité ne dépasse l’état réel de l’infrastructure.',
    infraCards: [
      {
        title: 'Discipline des revendications',
        description: 'InfraFabric rattache les promesses de capacité à ce que la preuve et l’infrastructure peuvent soutenir maintenant.'
      },
      {
        title: 'Chaîne de preuve',
        description: 'Les artefacts, traitements, décisions de révision, dossiers de preuve, évaluations et événements d’audit demeurent explicites au lieu de se dissoudre dans un statut vague.'
      },
      {
        title: 'Posture de repli sûr',
        description: 'S’il manque de la traçabilité ou si la preuve de révision est incomplète, la revendication se resserre et l’état demeure provisoire.'
      }
    ],
    modulesLabel: 'Modules internes',
    modulesTitle: 'AurorAI et CompassAI',
    modulesBody: 'AurorAI et CompassAI sont des systèmes internes développés par Martin Lepage conformément aux modèles de gouvernance déterministe d’InfraFabric, avec permission. AurorAI prend en charge la preuve et le traitement documentaire. CompassAI prend en charge l’accueil de gouvernance, l’évaluation et la production des livrables. Les portails clients apparaissent ci-dessous, tandis que la surface d’administration demeure distincte.',
    modules: [
      {
        title: 'AurorAI',
        description: 'Un moteur interne de preuve et de traitement documentaire développé par Martin Lepage conformément aux modèles de gouvernance déterministe d’InfraFabric, avec permission.',
        portalPath: '/portal/aurorai'
      },
      {
        title: 'CompassAI',
        description: 'Un moteur interne de gouvernance développé par Martin Lepage conformément aux modèles de gouvernance déterministe d’InfraFabric, avec permission.',
        portalPath: '/portal/compassai'
      }
    ],
    portalButton: 'Portail client',
    adminButton: 'Admin',
    pharosLabel: 'Pourquoi PHAROS',
    pharosTitle: 'Un nom de phare pour un système de gouvernance',
    pharosBody: 'Le Pharos d’Alexandrie, l’une des sept merveilles du monde antique, n’était pas seulement un monument. C’était une infrastructure d’orientation : il rendait la côte lisible à distance, signalait le seuil d’entrée sûr et aidait les navires à avancer sans heurter ce qu’ils ne voyaient pas encore. Notre système de gouvernance porte ce nom pour la même raison. PHAROS sert à rendre les trajectoires d’IA, les seuils, la preuve et les droits décisionnels assez visibles tôt dans le processus pour qu’une organisation avance sous examen sans naviguer à l’aveugle.',
    publicationsTitle: 'Nouvelles publications chaque semaine',
    loading: 'Chargement des publications',
    empty: 'Aucune publication n’est encore assignée à la page À propos. Publiez-les dans l’éditeur Admin et elles apparaîtront ici.',
    readPublication: 'Lire la publication',
    openDocument: 'Ouvrir le document',
    featuredPublication: {
      ...FEATURED_PUBLICATION,
      type: 'Analyse',
      title: 'The Trust Advantage: Why Expertise Wins in the Era of AI-Driven Sales',
      venue: 'PHAROS',
      year: '2026',
      description: 'Une analyse PHAROS du rapport Trust Advantage 2025 de LinkedIn Sales Navigator, lue à la lumière d’un texte de gouvernance sur la fluence algorithmique et l’interruption.',
      abstract: 'Cette publication soutient que, dans des environnements de vente saturés par l’IA, la confiance se construit moins par l’accès à l’information que par l’expertise humaine au bon moment, le jugement contextuel et une preuve défendable. Elle met en relation les constats commerciaux de LinkedIn sur la confiance des acheteurs avec une lecture de gouvernance axée sur la fluence, l’interruption et une reddition de comptes prête pour l’examen.'
    }
  }
};

const About = () => {
  const { language } = useLanguage();
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);

  const copy = ABOUT_COPY[language];
  const infraFabricCards = useMemo(() => copy.infraCards, [copy.infraCards]);
  const moduleCards = useMemo(() => copy.modules, [copy.modules]);
  const staticPublications = useMemo(() => [copy.featuredPublication], [copy.featuredPublication]);

  useEffect(() => {
    fetch(`${API_URL}/api/publications`)
      .then((response) => response.json())
      .then((data) => {
        const aboutPublications = data
          .filter((publication) => (
            publication.status === 'published' &&
            (!publication.site_section || publication.site_section === 'about_publications')
          ))
          .sort(sortPublications);

        const mergedPublications = [...staticPublications];
        aboutPublications.forEach((publication) => {
          if (!mergedPublications.some((item) => item.id === publication.id)) {
            mergedPublications.push(publication);
          }
        });

        setPublications(mergedPublications.sort(sortPublications));
        setLoading(false);
      })
      .catch(() => {
        setPublications(staticPublications);
        setLoading(false);
      });
  }, [staticPublications]);

  return (
    <div data-testid="about-page">
      <div className="page-hero">
        <div className="container">
          <div className="about-hero-split">
            <div>
              <p className="eyebrow" style={{ marginBottom: '16px' }}>{copy.eyebrow}</p>
              <div className="brand-kicker brand-kicker-static">
                <LighthouseGlyph className="brand-kicker-mark" title="" />
                <span>PHAROS AI GOVERNANCE</span>
              </div>
              <h1>{copy.heroTitle}</h1>
              <p className="body-lg" style={{ marginTop: '20px' }}>
                {copy.heroBody}
              </p>
              <div className="divider" />
              <p className="body-sm">
                {copy.heroBody2}
              </p>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-muted-light)', marginTop: '12px', fontWeight: 500 }}>
                {copy.location}
              </p>
              <div style={{ marginTop: '32px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                <Link to="/connect" className="btn-dark">
                  {copy.bookDebrief}
                  <ArrowRight />
                </Link>
                <Link to="/research" className="btn-outline">{copy.viewResearch}</Link>
              </div>
            </div>

            <div className="reveal visible">
              <div className="editorial-panel">
                <p className="eyebrow" style={{ marginBottom: '16px' }}>{copy.practiceLabel}</p>
                <h2 style={{ fontSize: '1.75rem', marginBottom: '16px' }}>{copy.practiceTitle}</h2>
                <p className="body-sm">
                  {copy.practiceBody}
                </p>
                <div className="divider" />
                <p className="body-sm" style={{ marginTop: '16px' }}>
                  {copy.practiceBody2}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="section" style={{ background: 'var(--color-bg-alt)' }}>
        <div className="container">
          <div className="section-header reveal">
            <p className="eyebrow">{copy.infraLabel}</p>
            <h2>{copy.infraTitle}</h2>
            <p className="body-sm">
              {copy.infraBody}
            </p>
          </div>

          <div className="grid-3 stagger">
            {infraFabricCards.map((item) => (
              <div key={item.title} className="card reveal">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header reveal">
            <p className="eyebrow">{copy.modulesLabel}</p>
            <h2>{copy.modulesTitle}</h2>
            <p className="body-sm">
              {copy.modulesBody}
            </p>
          </div>

          <div className="grid-2 stagger">
            {moduleCards.map((item) => (
              <div key={item.title} className="card reveal">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div style={{ marginTop: '22px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  <Link to={item.portalPath} className="btn-dark">
                    {copy.portalButton}
                    <ArrowRight />
                  </Link>
                  <Link to="/admin" className="btn-outline">{copy.adminButton}</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--color-bg-alt)' }}>
        <div className="container">
          <div className="editorial-panel reveal visible" style={{ maxWidth: '860px', margin: '0 auto' }}>
            <p className="eyebrow" style={{ marginBottom: '16px' }}>{copy.pharosLabel}</p>
            <h2 style={{ fontSize: '1.95rem', marginBottom: '18px' }}>{copy.pharosTitle}</h2>
            <p className="body-sm" style={{ marginBottom: 0 }}>
              {copy.pharosBody}
            </p>
          </div>
        </div>
      </section>

      <section className="section" id="publications">
        <div className="container">
          <div className="section-header reveal">
            <h2>{copy.publicationsTitle}</h2>
          </div>

          {loading ? <p className="body-sm">{copy.loading}</p> : null}

          {!loading && publications.length > 0 ? (
            <div className="stagger" style={{ display: 'grid', gap: '20px' }}>
              {publications.map((publication) => {
                const previewText = publication.abstract || publication.description;
                const meta = (
                  <div className="publication-card-meta">
                    {publication.type ? <span className="eyebrow" style={{ marginBottom: 0 }}>{publication.type}</span> : null}
                    {publication.year ? <span className="research-date">{publication.year}</span> : null}
                    {publication.venue ? <span className="research-date">{publication.venue}</span> : null}
                  </div>
                );

                const content = (
                  <>
                    {meta}
                    <h3 style={{ marginBottom: '12px' }}>{publication.title}</h3>
                    {previewText ? <RichTextContent text={previewText} /> : null}
                    {publication.link ? (
                      <div
                        style={{
                          marginTop: '18px',
                          paddingTop: '14px',
                          borderTop: '1px solid var(--color-border-light)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: 'var(--color-accent)'
                        }}
                      >
                        <span>{publication.internal ? copy.readPublication : copy.openDocument}</span>
                        {publication.internal ? <ArrowRight size={16} /> : <ExternalLink size={16} />}
                      </div>
                    ) : null}
                  </>
                );

                if (!publication.link) {
                  return (
                    <div key={publication.id} className="card reveal">
                      {content}
                    </div>
                  );
                }

                if (publication.internal) {
                  return (
                    <Link key={publication.id} to={publication.link} className="card reveal">
                      {content}
                    </Link>
                  );
                }

                return (
                  <a key={publication.id} href={publication.link} target="_blank" rel="noreferrer" className="card reveal">
                    <div style={{ flex: 1 }}>{content}</div>
                  </a>
                );
              })}
            </div>
          ) : null}

          {!loading && publications.length === 0 ? (
            <div className="editorial-panel reveal">
              <p className="body-sm" style={{ marginBottom: 0 }}>
                {copy.empty}
              </p>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
};

export default About;
