import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import SignalStrip from '../components/SignalStrip';

export const METHODS_COPY = {
  en: {
    label: 'Conceptual method',
    title: 'A conceptual method for integrating ethics into AI models',
    body: 'A bounded, inspectable, reconstructable method for turning ethical concerns into control surfaces, decision rules, and review-ready governance inside AI workflows.',
    overviewTitle: 'What is this conceptual method?',
    overviewBody: 'A conceptual ethics-integration method that uses recursive AI transformation of a bounded corpus to extract inspectable workflow controls.',
    definition: 'Recursive deterministic AI governance is a conceptual control-design practice for integrating ethics into AI models by using recursive transformation of a bounded corpus to identify, test, and harden the interfaces at which models acquire practical agency.',
    origin: 'This method emerged from a mixed training set: sociology, cultural studies, comparative literature, applied ethics, and regulated clinical and pharmaceutical environments. Its early archive was treated not as decoration, but as ethical and governance input for recursive testing.',
    coreTerms: [
      {
        num: 'Term 01',
        title: 'Recursive',
        description: 'The same or related materials move through repeated cycles of rendering, comparison, revision, and control extraction for diagnostic clarity, not just more output.'
      },
      {
        num: 'Term 02',
        title: 'Deterministic',
        description: 'The pathway is explicit, constrained, reviewable, and capable of producing reproducible control decisions. The aim is identical accountability, not identical wording.'
      },
      {
        num: 'Term 03',
        title: 'Governance',
        description: 'Constraint design embedded in workflow at intake, classification, transformation, approval, deployment, monitoring, and incident review.'
      }
    ],
    pipelineTitle: 'The 10-stage pipeline',
    pipelineBody: 'Each stage names the governing question and the control point that keeps the workflow inspectable.',
    questionLabel: 'Primary question',
    controlLabel: 'Control point',
    pipeline: [
      {
        num: '01',
        title: 'Corpus formation',
        description: 'Build a bounded source corpus from your own materials and tag each source by type, sensitivity, intended use, and epistemic status.',
        question: 'What exactly is being allowed to enter the recursive loop?',
        control: 'intake rules · provenance tagging · consent boundary · rights boundary · sensitivity flagging'
      },
      {
        num: '02',
        title: 'Intent embedding',
        description: 'Declare the operative intent for each pass so analytic, generative, adversarial, and diagnostic uses do not collapse together.',
        question: 'What work is this pass meant to perform?',
        control: 'declared purpose · permitted transformation range · prohibited inferences · output role'
      },
      {
        num: '03',
        title: 'Multi-model rendering',
        description: 'Submit the same bounded materials across systems, prompts, and formats to surface stability, drift, and representational differences.',
        question: 'What remains stable across renderings, and what changes?',
        control: 'model log · prompt log · output classification · confidence note · storage discipline'
      },
      {
        num: '04',
        title: 'Triangulation of detached meaning',
        description: 'Compare outputs against one another and against the source corpus to identify recurring mechanisms, contradictions, and pressure points.',
        question: 'What latent structure emerges from cross-output comparison?',
        control: 'comparison matrix · stability markers · contradiction register · hallucination flag · novelty flag'
      },
      {
        num: '05',
        title: 'Recursive return pass',
        description: 'Feed comparison back into the system only when the next pass increases explanatory power rather than repeating the same framing.',
        question: 'Does the recursion escalate the analysis, or merely restate it?',
        control: 'escalation test · redundancy test · bounded iteration count · stop rule'
      },
      {
        num: '06',
        title: 'Control extraction',
        description: 'Translate recurrent patterns into governance controls such as review gates, provenance requirements, publication limits, and escalation triggers.',
        question: 'What safeguard is implied by this pattern?',
        control: 'control statement · rationale · accountable actor · evidence artifact · review interval'
      },
      {
        num: '07',
        title: 'Determinism hardening',
        description: 'Make the pathway reconstructable so any important decision can be traced through source, transformation, review, and release conditions.',
        question: 'Could another reviewer reconstruct why this output was accepted, revised, or rejected?',
        control: 'version history · decision log · acceptance criteria · rejection criteria · audit trail'
      },
      {
        num: '08',
        title: 'Deployment binding',
        description: 'Attach the controls to real workflow interfaces such as intake, drafting, publication, procurement, escalation, or monitoring.',
        question: 'Where in the workflow does this control live?',
        control: 'interface map · owner assignment · implementation artifact · training requirement'
      },
      {
        num: '09',
        title: 'Failure harvesting',
        description: 'Treat uneven oversight, abandoned outputs, and forgotten branches as evidence of where review density or control strength was missing.',
        question: 'What failed because the control was absent, weak, or misplaced?',
        control: 'failure register · near-miss analysis · asymmetry map · corrective action'
      },
      {
        num: '10',
        title: 'Public articulation',
        description: 'Translate the private method into public-facing language that shows mechanism, workflow, controls, and evidence without mystification.',
        question: 'Can an external reader see the discipline, not just the concept?',
        control: 'mechanism-first prose · bounded claims · receipts for factual claims · clear consequence domains'
      }
    ],
    probeTitle: 'Cultural material as governance probe',
    probeBody: 'Raw cultural materials are not decorative here. They are instruments for exposing hidden classificatory logic, drift, and representational bias.',
    probeCards: [
      {
        title: 'Diagnostic probes',
        description: 'Culturally dense material tests how a model classifies ambiguity, gender, agency, danger, authority, and deviance. That reveals governance risk.'
      },
      {
        title: 'Archives of social patterning',
        description: 'Cultural materials carry sedimented norms about who gets to act, who gets believed, and who gets feared. Recursive processing shows how those scripts are reproduced or reorganized.'
      },
      {
        title: 'Stress tests for agency',
        description: 'Symbolically unstable figures reveal how AI handles actors whose agency is contested, overdetermined, or socially charged.'
      },
      {
        title: 'Control-extraction devices',
        description: 'Repeated passes across prompts, models, and genres make stable meanings, drifting meanings, and disappearing meanings visible enough to govern.'
      }
    ],
    probeSequenceLabel: 'Inference sequence',
    probeSequenceBody: 'raw cultural material -> model rendering -> comparative reading -> bias or drift detection -> governance control',
    probeSequenceNote: 'Culture is where power hides before it becomes procedure.',
    formulaTitle: 'Minimal formula',
    formulaBody: 'The compact operational sequence: governance as a series of bounded, accountable steps.',
    formulaDefinition: 'Recursive deterministic AI governance is the practice of using repeated AI transformations of a bounded corpus to identify where meaning, power, and downstream effects stabilize, then converting those recurrent patterns into inspectable workflow controls.',
    formulaSteps: [
      {
        tag: 'BOUND',
        title: 'Bound the corpus',
        description: 'Define exactly what materials enter the recursive loop and tag their sensitivity, provenance, and epistemic status.'
      },
      {
        tag: 'DECLARE',
        title: 'Declare the intent',
        description: 'State what work each AI pass is meant to perform before running it.'
      },
      {
        tag: 'RENDER',
        title: 'Render across systems',
        description: 'Submit the same material through different models, prompts, and formats to surface variation.'
      },
      {
        tag: 'COMPARE',
        title: 'Compare the outputs',
        description: 'Map what stays stable, what drifts, and what disappears. Treat that as structural evidence.'
      },
      {
        tag: 'RECUR',
        title: 'Recur only when stakes increase',
        description: 'Feed comparison back only when the next pass raises explanatory power and passes a stop-rule test.'
      },
      {
        tag: 'EXTRACT',
        title: 'Extract controls from patterns',
        description: 'Turn recurrent patterns into review gates, use limits, documentation fields, and escalation triggers.'
      },
      {
        tag: 'BIND',
        title: 'Bind controls to workflow interfaces',
        description: 'Attach governance controls to real workflow locations with owners and evidence artifacts.'
      },
      {
        tag: 'LOG',
        title: 'Log consequential decisions',
        description: 'Keep an audit trail that allows any major acceptance, revision, or rejection to be reconstructed later.'
      },
      {
        tag: 'HARVEST',
        title: 'Harvest failures as evidence',
        description: 'Treat failures, abandoned branches, and asymmetries as governance evidence rather than disposable residue.'
      }
    ],
    featuresTitle: 'Five distinguishing features',
    featuresBody: 'What separates this method from generic AI prompt iteration or checklist-style compliance.',
    features: [
      {
        num: '01',
        title: 'Cultural materials as governance instruments',
        description: 'Cultural and symbolic materials are used as analytic sensors for representation, agency, power, normativity, and consent.'
      },
      {
        num: '02',
        title: 'Recursion as extraction, not amplification',
        description: 'Repeated passes are used to reveal where control must attach, not simply to generate more text.'
      },
      {
        num: '03',
        title: 'Interpretive disciplines joined to regulated-environment instincts',
        description: 'Traceability, bounded deviation, accountability, and inspection readiness are carried from regulated settings into AI governance work.'
      },
      {
        num: '04',
        title: 'Agency as distributed and interface-bound',
        description: 'AI becomes governable by mapping where its effects enter institutional action, not by pretending those effects do not exist.'
      },
      {
        num: '05',
        title: 'Partial failure converted into method',
        description: 'Uneven oversight and abandoned branches become comparative cases that expose the difference between productivity and governable workflow.'
      }
    ],
    failureTitle: 'Failure mode doctrine',
    failureBody: 'Uneven oversight, abandoned outputs, and forgotten branches are not just losses. They are comparative cases and governance evidence.',
    failureCards: [
      {
        tag: 'Failure type',
        title: 'Epistemic drift',
        description: 'Productivity without control density creates influence without a reconstructable pathway, making audit and review weak or impossible.'
      },
      {
        tag: 'Failure type',
        title: 'Consent ambiguity',
        description: 'Recursive reuse without declared intent at each pass leaves transformation range unbounded and governance responsibility unclear.'
      },
      {
        tag: 'Failure type',
        title: 'Archive instability',
        description: 'Abandoned outputs and forgotten branches show where review density was absent and oversight was applied unevenly.'
      },
      {
        tag: 'Productive use',
        title: 'Harvesting failure',
        description: 'Each failure condition points to a missing control: a review gate, provenance rule, escalation trigger, or documentation requirement.'
      }
    ],
    failureSequenceLabel: 'Failure register control points',
    failureSequenceBody: 'collect -> failure register -> near-miss analysis -> asymmetry map -> corrective action',
    failureSequenceNote: 'The method did not arise from perfect control. It arose from contrast.',
    glossaryTitle: 'Glossary of core terms',
    glossaryBody: 'Definitions as used within this method, not generic AI shorthand.',
    glossary: [
      {
        term: 'Recursive',
        definition: 'The same or related materials are passed through repeated cycles of rendering, comparison, revision, and control extraction. Recursion is diagnostic, not amplificatory.'
      },
      {
        term: 'Deterministic',
        definition: 'The governing pathway is explicit, constrained, reviewable, and capable of producing reproducible control decisions.'
      },
      {
        term: 'Governance',
        definition: 'Constraint design embedded in workflow, especially at intake, classification, transformation, approval, deployment, monitoring, and incident review.'
      },
      {
        term: 'Agency',
        definition: 'The capacity of AI outputs to produce effects beyond the model boundary by shaping downstream decisions, representations, classifications, or actions.'
      },
      {
        term: 'Cultural probe',
        definition: 'Symbolic or representational material used to expose how AI systems classify ambiguity, authority, deviance, gender, and power.'
      },
      {
        term: 'Control surface',
        definition: 'A site in a workflow where governance must attach because recursive comparison revealed drift, stability, or downstream consequence.'
      },
      {
        term: 'Determinism hardening',
        definition: 'The work of making a governance pathway reconstructable so every major decision can be traced through source, transformation, review, and release.'
      },
      {
        term: 'Deployment binding',
        definition: 'Attaching extracted controls to real workflow interfaces with owners, evidence artifacts, and training requirements.'
      },
      {
        term: 'Failure harvesting',
        definition: 'Treating abandoned outputs, uneven oversight, and near-misses as comparative governance evidence.'
      },
      {
        term: 'Epistemic status',
        definition: 'A tagging attribute that records the reliability, completeness, and review state of a corpus item during intake.'
      }
    ]
  },
  fr: {
    label: 'Methode conceptuelle',
    title: 'Une methode conceptuelle pour integrer l’ethique aux modeles d’IA',
    body: 'Une methode bornee, inspectable et reconstructible pour convertir les questions ethiques en surfaces de controle, regles decisionnelles et gouvernance prete pour la revue dans les workflows d’IA.',
    overviewTitle: 'Qu’est-ce que cette methode conceptuelle?',
    overviewBody: 'Une methode d’integration de l’ethique qui utilise la transformation recursive par IA d’un corpus borne pour extraire des controles de workflow inspectables.',
    definition: 'La gouvernance recursive deterministe de l’IA est une pratique conceptuelle de conception de controles pour integrer l’ethique dans les modeles d’IA en utilisant la transformation recursive d’un corpus borne afin d’identifier, tester et renforcer les interfaces ou les modeles acquierent une agence pratique.',
    origin: 'Cette methode vient d’un ensemble de formations croisees: sociologie, etudes culturelles, litterature comparee, ethique appliquee et environnements cliniques et pharmaceutiques reglementes. L’archive initiale n’etait pas decorative, mais servait d’entree ethique et de gouvernance pour des tests recursifs.',
    coreTerms: [
      {
        num: 'Terme 01',
        title: 'Recursif',
        description: 'Les memes materiaux, ou des materiaux lies, passent par des cycles repetes de rendu, comparaison, revision et extraction de controles pour gagner en clarte diagnostique.'
      },
      {
        num: 'Terme 02',
        title: 'Deterministe',
        description: 'Le parcours est explicite, borne, revisable et capable de produire des decisions de controle reproductibles. L’objectif est une responsabilite identique, non un texte identique.'
      },
      {
        num: 'Terme 03',
        title: 'Gouvernance',
        description: 'Une conception de contraintes integree au workflow, de l’entree jusqu’a l’incident, en passant par la classification, la transformation, l’approbation et le deploiement.'
      }
    ],
    pipelineTitle: 'Le pipeline en 10 etapes',
    pipelineBody: 'Chaque etape nomme la question de gouvernance et le point de controle qui garde le workflow inspectable.',
    questionLabel: 'Question principale',
    controlLabel: 'Point de controle',
    pipeline: [
      {
        num: '01',
        title: 'Formation du corpus',
        description: 'Constituer un corpus source borne et etiqueter chaque element selon son type, sa sensibilite, son usage prevu et son statut epistemique.',
        question: 'Qu’est-ce qui est exactement autorise a entrer dans la boucle recursive?',
        control: 'regles d’entree · etiquetage de provenance · frontiere de consentement · frontiere de droits · signalement de sensibilite'
      },
      {
        num: '02',
        title: 'Encodage de l’intention',
        description: 'Declarer l’intention operative de chaque passe afin de ne pas melanger les usages analytiques, generatifs, adversariaux et diagnostiques.',
        question: 'Quel travail cette passe doit-elle accomplir?',
        control: 'objectif declare · plage de transformation permise · inférences interdites · role de la sortie'
      },
      {
        num: '03',
        title: 'Rendu multi-modeles',
        description: 'Soumettre le meme materiau borne a plusieurs systemes, prompts et formats pour faire apparaitre stabilite, derive et differences de representation.',
        question: 'Qu’est-ce qui reste stable d’un rendu a l’autre, et qu’est-ce qui change?',
        control: 'journal des modeles · journal des prompts · classification des sorties · note de confiance · discipline de stockage'
      },
      {
        num: '04',
        title: 'Triangulation du sens detache',
        description: 'Comparer les sorties entre elles et avec le corpus source pour identifier mecanismes recurrents, contradictions et points de pression.',
        question: 'Quelle structure latente emerge de la comparaison croisee?',
        control: 'matrice de comparaison · marqueurs de stabilite · registre des contradictions · signalement d’hallucination · signalement de nouveaute'
      },
      {
        num: '05',
        title: 'Passe de retour recursive',
        description: 'Reinjecter la comparaison dans le systeme seulement si la passe suivante augmente la puissance explicative au lieu de repeter le meme cadrage.',
        question: 'La recursion augmente-t-elle l’analyse, ou la reformule-t-elle simplement?',
        control: 'test d’escalade · test de redondance · nombre borne d’iterations · regle d’arret'
      },
      {
        num: '06',
        title: 'Extraction des controles',
        description: 'Traduire les motifs recurrents en controles de gouvernance: portes de revue, exigences de provenance, limites de publication et seuils d’escalade.',
        question: 'Quelle sauvegarde ce motif implique-t-il?',
        control: 'enonce de controle · justification · acteur responsable · artefact de preuve · intervalle de revue'
      },
      {
        num: '07',
        title: 'Renforcement du determinisme',
        description: 'Rendre le parcours reconstructible afin que toute decision importante puisse etre retracee jusqu’a la source, la transformation, la revue et la diffusion.',
        question: 'Un autre evaluateur pourrait-il reconstruire pourquoi cette sortie a ete acceptee, revisee ou rejetee?',
        control: 'historique des versions · journal des decisions · criteres d’acceptation · criteres de rejet · piste d’audit'
      },
      {
        num: '08',
        title: 'Liaison au deploiement',
        description: 'Attacher les controles a de vraies interfaces de workflow comme l’accueil, la redaction, la publication, l’approvisionnement, l’escalade ou la surveillance.',
        question: 'Ou ce controle vit-il dans le workflow?',
        control: 'carte des interfaces · attribution du proprietaire · artefact d’implementation · exigence de formation'
      },
      {
        num: '09',
        title: 'Collecte des echecs',
        description: 'Traiter l’oversight inegal, les sorties abandonnees et les branches oubliees comme des preuves de controle insuffisant ou mal place.',
        question: 'Qu’est-ce qui a echoue parce que le controle etait absent, faible ou mal positionne?',
        control: 'registre des echecs · analyse des quasi-incidents · carte des asymetries · action corrective'
      },
      {
        num: '10',
        title: 'Articulation publique',
        description: 'Traduire la methode privee en langage public qui montre le mecanisme, le workflow, les controles et les preuves sans mystification.',
        question: 'Un lecteur externe peut-il voir la discipline, et pas seulement le concept?',
        control: 'prose centree sur le mecanisme · revendications bornees · traces des affirmations factuelles · domaines de consequence explicites'
      }
    ],
    probeTitle: 'Le materiau culturel comme sonde de gouvernance',
    probeBody: 'Ici, les materiaux culturels bruts ne sont pas decoratifs. Ce sont des instruments pour exposer les logiques classificatoires cachees, les derives et les biais de representation.',
    probeCards: [
      {
        title: 'Sondes diagnostiques',
        description: 'Un materiau culturel dense teste comment un modele classe l’ambiguite, le genre, l’agence, le danger, l’autorite et la deviance. C’est un signal de risque de gouvernance.'
      },
      {
        title: 'Archives des modeles sociaux',
        description: 'Les materiaux culturels portent des normes sedimentées sur qui peut agir, qui est cru et qui est craint. Le traitement recursif montre comment ces scripts sont reproduits ou reordonnes.'
      },
      {
        title: 'Stress tests de l’agence',
        description: 'Les figures symboliquement instables revelent comment l’IA traite des acteurs dont l’agence est contestee, surchargee ou socialement chargee.'
      },
      {
        title: 'Dispositifs d’extraction de controles',
        description: 'Les passes repetées a travers prompts, modeles et genres rendent visibles les sens stables, les derives et les effacements assez clairement pour pouvoir les gouverner.'
      }
    ],
    probeSequenceLabel: 'Sequence d’inference',
    probeSequenceBody: 'materiau culturel brut -> rendu du modele -> lecture comparative -> detection des biais ou derives -> controle de gouvernance',
    probeSequenceNote: 'La culture est l’endroit ou le pouvoir se cache avant de devenir procedure.',
    formulaTitle: 'Formule minimale',
    formulaBody: 'La sequence operationnelle compacte: la gouvernance comme serie d’etapes bornees et responsables.',
    formulaDefinition: 'La gouvernance recursive deterministe de l’IA consiste a utiliser des transformations repetées d’un corpus borne pour identifier ou le sens, le pouvoir et les effets en aval se stabilisent, puis a convertir ces motifs recurrents en controles de workflow inspectables.',
    formulaSteps: [
      {
        tag: 'BORNER',
        title: 'Borner le corpus',
        description: 'Definir exactement quels materiaux entrent dans la boucle recursive et etiqueter leur sensibilite, provenance et statut epistemique.'
      },
      {
        tag: 'DECLARER',
        title: 'Declarer l’intention',
        description: 'Indiquer le travail attendu de chaque passe avant de la lancer.'
      },
      {
        tag: 'RENDRE',
        title: 'Rendre a travers les systemes',
        description: 'Soumettre le meme materiau a differents modeles, prompts et formats pour faire apparaitre la variation.'
      },
      {
        tag: 'COMPARER',
        title: 'Comparer les sorties',
        description: 'Cartographier ce qui reste stable, ce qui derive et ce qui disparait. Traiter cela comme une preuve structurelle.'
      },
      {
        tag: 'RECURRER',
        title: 'Revenir seulement si l’enjeu augmente',
        description: 'Reinjecter la comparaison seulement si la passe suivante augmente la puissance explicative et respecte une regle d’arret.'
      },
      {
        tag: 'EXTRAIRE',
        title: 'Extraire les controles',
        description: 'Transformer les motifs recurrents en portes de revue, limites d’usage, champs documentaires et seuils d’escalade.'
      },
      {
        tag: 'LIER',
        title: 'Lier aux interfaces',
        description: 'Attacher les controles de gouvernance a de vraies interfaces de workflow avec proprietaires et artefacts de preuve.'
      },
      {
        tag: 'JOURNALISER',
        title: 'Journaliser les decisions',
        description: 'Conserver une piste d’audit qui permet de reconstruire toute acceptation, revision ou rejection majeure.'
      },
      {
        tag: 'COLLECTER',
        title: 'Collecter les echecs comme preuves',
        description: 'Traiter les echecs, branches abandonnees et asymetries comme de la preuve de gouvernance.'
      }
    ],
    featuresTitle: 'Cinq traits distinctifs',
    featuresBody: 'Ce qui separe cette methode d’une iteration generique de prompts ou d’une conformite par checklist.',
    features: [
      {
        num: '01',
        title: 'Les materiaux culturels comme instruments de gouvernance',
        description: 'Les materiaux culturels et symboliques servent de capteurs analytiques de representation, d’agence, de pouvoir, de normativite et de consentement.'
      },
      {
        num: '02',
        title: 'La recursion comme extraction, pas comme amplification',
        description: 'Les passes repetées servent a reveler ou le controle doit s’attacher, pas simplement a produire plus de texte.'
      },
      {
        num: '03',
        title: 'Disciplines interpretatives et reflexes de milieux reglementes',
        description: 'Tracabilite, deviation bornee, responsabilite et preparation a l’inspection sont transportees des milieux reglementes vers la gouvernance de l’IA.'
      },
      {
        num: '04',
        title: 'Une agence distribuee et liee aux interfaces',
        description: 'L’IA devient gouvernable quand on cartographie l’endroit ou ses effets entrent dans l’action institutionnelle.'
      },
      {
        num: '05',
        title: 'L’echec partiel converti en methode',
        description: 'Les branches abandonnees et l’oversight inegal deviennent des cas comparatifs qui montrent la difference entre productivite et workflow gouvernable.'
      }
    ],
    failureTitle: 'Doctrine des modes d’echec',
    failureBody: 'Oversight inegal, sorties abandonnees et branches oubliees ne sont pas seulement des pertes. Ce sont des cas comparatifs et des preuves de gouvernance.',
    failureCards: [
      {
        tag: 'Type d’echec',
        title: 'Derive epistemique',
        description: 'Une productivite sans densite de controle cree de l’influence sans parcours reconstructible, ce qui affaiblit l’audit et la revue.'
      },
      {
        tag: 'Type d’echec',
        title: 'Ambiguite du consentement',
        description: 'La reutilisation recursive sans intention declaree a chaque passe laisse la plage de transformation non bornee et la responsabilite floue.'
      },
      {
        tag: 'Type d’echec',
        title: 'Instabilite de l’archive',
        description: 'Les sorties abandonnees et les branches oubliees montrent ou la densite de revue etait absente et ou l’oversight etait inegal.'
      },
      {
        tag: 'Usage productif',
        title: 'Collecter l’echec',
        description: 'Chaque condition d’echec pointe vers un controle manquant: porte de revue, regle de provenance, seuil d’escalade ou exigence documentaire.'
      }
    ],
    failureSequenceLabel: 'Points de controle du registre d’echec',
    failureSequenceBody: 'collecte -> registre d’echec -> analyse des quasi-incidents -> carte des asymetries -> action corrective',
    failureSequenceNote: 'La methode n’est pas nee du controle parfait. Elle est nee du contraste.',
    glossaryTitle: 'Glossaire des termes centraux',
    glossaryBody: 'Definitions telles qu’utilisees dans cette methode, et non comme simple jargon general sur l’IA.',
    glossary: [
      {
        term: 'Recursif',
        definition: 'Les memes materiaux, ou des materiaux lies, passent par des cycles repetes de rendu, comparaison, revision et extraction de controles. La recursion est diagnostique.'
      },
      {
        term: 'Deterministe',
        definition: 'Le parcours de gouvernance est explicite, borne, revisable et capable de produire des decisions de controle reproductibles.'
      },
      {
        term: 'Gouvernance',
        definition: 'Une conception de contraintes integree au workflow, surtout a l’entree, la classification, la transformation, l’approbation, le deploiement, la surveillance et la revue d’incident.'
      },
      {
        term: 'Agence',
        definition: 'La capacite des sorties de l’IA a produire des effets au-dela du modele en influençant des decisions, representations, classifications ou actions.'
      },
      {
        term: 'Sonde culturelle',
        definition: 'Un materiau symbolique ou representatif utilise pour exposer la maniere dont les systemes d’IA classent l’ambiguite, l’autorite, la deviance, le genre et le pouvoir.'
      },
      {
        term: 'Surface de controle',
        definition: 'Un site du workflow ou la gouvernance doit s’attacher parce qu’une comparaison recursive y a revele derive, stabilite ou consequence en aval.'
      },
      {
        term: 'Renforcement du determinisme',
        definition: 'Le travail qui rend un parcours de gouvernance reconstructible afin que chaque decision majeure puisse etre retracee.'
      },
      {
        term: 'Liaison au deploiement',
        definition: 'L’attachement des controles extraits a de vraies interfaces de workflow avec proprietaires, artefacts de preuve et exigences de formation.'
      },
      {
        term: 'Collecte des echecs',
        definition: 'Le fait de traiter sorties abandonnees, oversight inegal et quasi-incidents comme des preuves comparatives de gouvernance.'
      },
      {
        term: 'Statut epistemique',
        definition: 'Un attribut d’etiquetage qui indique la fiabilite, l’exhaustivite et l’etat de revue d’un element du corpus.'
      }
    ]
  }
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
    summary: [
      {
        label: 'Who it serves',
        title: 'Organizations facing scrutiny',
        description: 'Built for procurement, audit, vendor diligence, and committee oversight rather than abstract governance branding.'
      },
      {
        label: 'Operating standard',
        title: 'Claims stay tied to evidence',
        description: 'Decision rights, thresholds, and documentation should remain explicit and reviewable instead of being inferred after the fact.'
      },
      {
        label: 'Public entry point',
        title: 'Debrief first, then route the work',
        description: 'The public-facing practice begins with a short debrief that identifies the right governance path.'
      }
    ],
    credibilityLabel: 'Practitioner-researcher credibility',
    credibilityTitle: 'Why this practice can speak to both theory and live review pressure',
    credibilityBody: 'PHAROS is informed by advisory work, method development, and system design under real evidence constraints rather than by governance branding alone.',
    credibilityCards: [
      {
        label: 'Practice',
        title: 'Built around procurement, audit, and oversight',
        description: 'The public-facing work starts from concrete review conditions such as procurement questionnaires, audit requests, vendor diligence, and committee scrutiny.'
      },
      {
        label: 'Research',
        title: 'Grounded in interpretive and ethical disciplines',
        description: 'The method draws on sociology, cultural studies, comparative literature, and applied ethics to surface governance mechanisms that generic compliance language often misses.'
      },
      {
        label: 'Systems',
        title: 'Evidence discipline shaped by regulated environments',
        description: 'Traceability, review gates, lineage, and fail-closed claim boundaries are informed by work shaped around regulated clinical and pharmaceutical settings.'
      }
    ],
    methodButton: 'Open method',
    methodHighlights: ['Bounded inputs', 'Inspectable controls', 'Reconstructable decisions'],
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
    modulesLabel: 'PHAROS products',
    modulesTitle: 'AurorA & CompassAI',
    modulesBody: 'AurorA and CompassAI are PHAROS products developed by Martin Lepage in accordance with Deterministic AI governance models by InfraFabric, with permission. AurorA handles evidence and document processing. CompassAI handles governance intake, assessment, and output generation. Their product surfaces remain under PHAROS while separate standalone hosting is still being staged.',
    modules: [
      {
        title: 'AurorA',
        description: 'A PHAROS evidence and document engine developed by Martin Lepage in accordance with Deterministic AI governance models by InfraFabric, with permission.',
        portalPath: '/portal/aurorai'
      },
      {
        title: 'CompassAI',
        description: 'A PHAROS governance engine developed by Martin Lepage in accordance with Deterministic AI governance models by InfraFabric, with permission.',
        portalPath: '/portal/compassai'
      }
    ],
    portalButton: 'Open product',
    adminButton: 'Admin',
    pharosLabel: 'Why PHAROS',
    pharosTitle: 'A lighthouse name for a governance system',
    pharosBody: 'The Pharos of Alexandria, one of the Seven Wonders of the ancient world, was not only a monument. It was orientation infrastructure: it made the coastline legible at distance, marked the threshold of safe entry, and helped ships move without striking what they could not yet see. This governance system carries that name for the same reason. PHAROS exists to make AI pathways, thresholds, evidence, and decision rights visible early enough that an organization can move under scrutiny without steering blind.'
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
    summary: [
      {
        label: 'Pour qui',
        title: 'Les organisations sous examen',
        description: 'La pratique sert l approvisionnement, l audit, la diligence fournisseur et la surveillance de comite plutot qu un discours abstrait sur la gouvernance.'
      },
      {
        label: 'Norme operative',
        title: 'Les revendications restent attachees a la preuve',
        description: 'Les droits decisionnels, les seuils et la documentation doivent rester explicites et revisables plutot que reconstruits apres coup.'
      },
      {
        label: 'Entree publique',
        title: 'Commencer par un echange, puis router le travail',
        description: 'La pratique publique commence par un court echange qui identifie le bon parcours de gouvernance.'
      }
    ],
    credibilityLabel: 'Credibilite praticien-chercheur',
    credibilityTitle: 'Pourquoi cette pratique peut parler a la fois a la theorie et a la pression de revue reelle',
    credibilityBody: 'PHAROS est informe par du travail de conseil, du developpement methodologique et de la conception de systemes sous vraies contraintes de preuve, et non par une simple couche de branding.',
    credibilityCards: [
      {
        label: 'Pratique',
        title: 'Construit autour de l approvisionnement, de l audit et de la supervision',
        description: 'Le travail public commence par des conditions de revue concretes comme les questionnaires d acheteurs, les demandes d audit, la diligence fournisseur et le scrutiny des comites.'
      },
      {
        label: 'Recherche',
        title: 'Ancre dans les disciplines interpretatives et ethiques',
        description: 'La methode s appuie sur la sociologie, les etudes culturelles, la litterature comparee et l ethique appliquee pour faire remonter des mecanismes de gouvernance que la prose generique de conformite laisse souvent invisibles.'
      },
      {
        label: 'Systemes',
        title: 'Une discipline de preuve faconnee par des environnements reglementes',
        description: 'La tracabilite, les portes de revue, la lineage et les limites de revendication fail-closed sont influencees par des contextes cliniques et pharmaceutiques reglementes.'
      }
    ],
    methodButton: 'Ouvrir la methode',
    methodHighlights: ['Entrées bornées', 'Contrôles inspectables', 'Décisions reconstructibles'],
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
    modulesLabel: 'Produits PHAROS',
    modulesTitle: 'AurorA et CompassAI',
    modulesBody: 'AurorA et CompassAI sont des produits PHAROS développés par Martin Lepage conformément aux modèles de gouvernance déterministe d’InfraFabric, avec permission. AurorA prend en charge la preuve et le traitement documentaire. CompassAI prend en charge l’accueil de gouvernance, l’évaluation et la production des livrables. Leurs surfaces produit demeurent sous PHAROS tant que leur hébergement autonome n’est pas encore stabilisé.',
    modules: [
      {
        title: 'AurorA',
        description: 'Un moteur PHAROS de preuve et de traitement documentaire développé par Martin Lepage conformément aux modèles de gouvernance déterministe d’InfraFabric, avec permission.',
        portalPath: '/portal/aurorai'
      },
      {
        title: 'CompassAI',
        description: 'Un moteur PHAROS de gouvernance développé par Martin Lepage conformément aux modèles de gouvernance déterministe d’InfraFabric, avec permission.',
        portalPath: '/portal/compassai'
      }
    ],
    portalButton: 'Ouvrir le produit',
    adminButton: 'Admin',
    pharosLabel: 'Pourquoi PHAROS',
    pharosTitle: 'Un nom de phare pour un système de gouvernance',
    pharosBody: 'Le Pharos d’Alexandrie, l’une des sept merveilles du monde antique, n’était pas seulement un monument. C’était une infrastructure d’orientation : il rendait la côte lisible à distance, signalait le seuil d’entrée sûr et aidait les navires à avancer sans heurter ce qu’ils ne voyaient pas encore. Notre système de gouvernance porte ce nom pour la même raison. PHAROS sert à rendre les trajectoires d’IA, les seuils, la preuve et les droits décisionnels assez visibles tôt dans le processus pour qu’une organisation avance sous examen sans naviguer à l’aveugle.'
  }
};

const About = () => {
  const { language } = useLanguage();

  const copy = ABOUT_COPY[language];
  const methods = METHODS_COPY[language];
  const infraFabricCards = useMemo(() => copy.infraCards, [copy.infraCards]);
  const moduleCards = useMemo(() => copy.modules, [copy.modules]);

  return (
    <div data-testid="about-page">
      <div className="page-hero">
        <div className="container">
          <div className="about-hero-split">
            <div>
              <p className="eyebrow" style={{ marginBottom: '16px' }}>{copy.eyebrow}</p>
              <div className="brand-kicker brand-kicker-static">
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
          <SignalStrip items={copy.summary} className="signal-grid-page reveal visible" />
        </div>
      </div>

      <section className="section section-topless">
        <div className="container">
          <div className="section-header reveal">
            <p className="eyebrow">{copy.credibilityLabel}</p>
            <h2>{copy.credibilityTitle}</h2>
            <p className="body-sm">
              {copy.credibilityBody}
            </p>
          </div>

          <div className="grid-3 stagger">
            {copy.credibilityCards.map((item) => (
              <div key={item.title} className="card reveal">
                <p className="eyebrow" style={{ marginBottom: '12px' }}>{item.label}</p>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
          <div className="editorial-panel reveal visible" style={{ maxWidth: '920px', margin: '0 auto' }}>
            <p className="eyebrow" style={{ marginBottom: '16px' }}>{methods.label}</p>
            <h2 style={{ fontSize: '1.95rem', marginBottom: '18px' }}>{methods.title}</h2>
            <p className="body-sm">{methods.body}</p>
            <div className="jump-links" style={{ marginTop: '24px' }}>
              {copy.methodHighlights.map((item) => (
                <span key={item} className="jump-pill jump-pill-static">{item}</span>
              ))}
            </div>
            <div className="divider" />
            <p className="body-sm" style={{ marginTop: '16px', marginBottom: 0 }}>{methods.overviewBody}</p>
            <div style={{ marginTop: '24px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <Link to="/about/conceptual-method" className="btn-dark">
                {copy.methodButton}
                <ArrowRight />
              </Link>
            </div>
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
    </div>
  );
};

export default About;
