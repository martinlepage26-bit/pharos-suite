export const researchPapers = [
  {
    id: 'hiring-ai-bias',
    title: 'Hiring Automation as Gatekeeping Infrastructure',
    date: '2024-11-15',
    context: 'enterprise-saas',
    type: 'briefing',
    abstract: 'An AI system that filters candidates is not a productivity feature. It is gatekeeping infrastructure. Once it sits upstream of hiring, it allocates opportunity, reshapes labor access, and produces institutional liability.',
    content: `An AI system that filters candidates is not a productivity feature. It is gatekeeping infrastructure. Once it sits upstream of hiring, it allocates opportunity, reshapes labor access, and produces institutional liability. Screening models do not simply "rank resumes." They redistribute attention, compress deliberation, and change what counts as a viable candidate.

The hard part is that bias does not usually appear as an error message. Bias appears as a pattern that looks like "efficiency" until someone forces the pattern into view. Historical hiring data embeds historical hiring decisions, and optimization often treats those patterns as signals to preserve. That mechanism is predictable. The risk is also predictable. A system can appear accurate while systematically downgrading candidates whose resumes carry markers correlated with gender, race, disability, class, or caregiving status.

Amazon reportedly scrapped an internal AI recruiting tool after discovering it systematically downgraded resumes that contained the word "women's," including women's colleges and women's organizations. The model learned from historical hiring data and reproduced patterns that had already favored men in technical roles. This is the predictable outcome of optimizing on a dataset that encodes a biased history while treating that dataset as a neutral training substrate.

The governance failure is not "bias exists." The governance failure is that bias was not framed as a deployment-stopping condition with explicit thresholds, test design, and decision rights. In practice, the most damaging bias failures are not subtle philosophical problems. They are process failures: no pre-defined fairness metrics, no proxy-feature review, no structured validation against the actual decision context, and no monitoring plan that treats drift and feedback loops as expected operational realities.

In hiring, you rarely get one clean "protected attribute" column. Discrimination enters through proxies: school names, club membership, gaps in employment, zip codes, even stylistic markers that correlate with gender, class, or race. If governance does not force the team to name proxy risk early, the model will discover proxies on its own, because proxies often improve predictive performance on the target label.

A defensible control baseline for hiring AI is a sequence of enforceable gates. First, risk-tier the use case as high impact. Second, run bias and performance evaluation across relevant groups. Third, audit features and proxies with structured review. Fourth, document decision rights: who can approve launch, who can pause the system, who owns monitoring. Fifth, implement post-launch monitoring that looks for disparate impact and pharos proxy behavior.

If your organization ever needs to defend hiring automation under scrutiny, you do not win with intentions. You win with evidence.`
  },
  {
    id: 'data-provenance',
    title: 'Training Data as Legal Act: The Clearview Problem',
    date: '2024-10-28',
    context: 'regulated',
    type: 'briefing',
    abstract: 'Training data provenance is not a technical footnote. It is a legal act with institutional consequences. When a system is built on scraped personal data at massive scale, the risk is cross-jurisdiction enforcement and durable reputational harm.',
    content: `Training data provenance is not a technical footnote. It is a legal act with institutional consequences. When a system is built on scraped personal data at massive scale, the risk is not only public backlash. The risk is cross-jurisdiction enforcement and durable reputational harm that attaches to every downstream deployment.

Clearview AI scraped billions of facial images from the web to build a facial recognition database. Regulators in multiple jurisdictions, including Canada and the UK, ruled that the company violated privacy laws. The governance failure themes are clear: the organization treated data collection as something that could be justified after the fact, rather than constrained at the moment of acquisition.

The mechanism matters. Facial data is not "just images." It is biometric data that enables identification, tracking, and inference. Once you collect at scale, you create the possibility of use cases that exceed initial intent. That expansion dynamic is not hypothetical. It is the default path of powerful databases: new clients, new integrations, new contexts of use.

In privacy regulation, the core questions recur. What lawful basis exists for collection. What consent, if any, was obtained. What purpose limitation was declared. What retention and deletion policies exist. What safeguards exist for sensitive data. What transparency is provided to data subjects. If an organization cannot answer these questions with documents and controls, it has not performed governance. It has performed optimism.

This category of incident also exposes a common institutional failure mode: legal review happens too late, and when it arrives, it arrives as cleanup. Governance flips the order. A mature program makes data sourcing a controlled pipeline. Data comes with provenance metadata, collection justification, access rules, retention rules, and a mapped legal basis by jurisdiction.

The operational control set is not exotic. It includes a documented data acquisition policy, privacy impact assessments before ingestion, jurisdictional compliance mapping, and explicit executive sign-off for high-risk data strategies. It also includes downstream constraints: if you cannot justify a dataset, you must limit model capabilities or exclude it entirely.

The strategic lesson is blunt: you cannot build legitimacy on contested data. If your training corpus is a liability, every deployment inherits that liability.`
  },
  {
    id: 'forecasting-financial-risk',
    title: 'Zillow and the $500M Lesson in Model Risk',
    date: '2024-10-12',
    context: 'financial',
    type: 'briefing',
    abstract: 'Model failure is not the scandal. The scandal is letting model failure become balance-sheet failure. Zillow shut down its AI-driven home-buying program after losses reportedly around $500M.',
    content: `Model failure is not the scandal. The scandal is letting model failure become balance-sheet failure. When predictive systems allocate capital, the organization needs model risk management, scenario stress testing, and exposure controls that treat uncertainty as a first-class operating condition.

Zillow shut down its AI-driven home-buying program after significant losses reportedly around $500M, tied to flawed forecasting and operational constraints. The governance lesson is not "AI is bad at housing." The lesson is that a model can be directionally useful and still be financially catastrophic when coupled to aggressive automation, weak stress testing, and insufficient human override authority.

Real markets do not behave like tidy training distributions. They shift with interest rates, local supply shocks, seasonality, and feedback loops. A pricing or forecasting model trained on historical conditions may look strong in backtests and still fail when it encounters a regime change. Governance exists to make that possibility operationally survivable.

There are two failure channels here. The first is technical: model error, drift, and miscalibration under changing conditions. The second is organizational: the translation from model output to real-world action. If the system is used to buy homes at scale, small systematic errors multiply. A one percent error is not a rounding problem. It is a portfolio problem. Without caps and controls, the organization converts uncertainty into exposure.

A defensible program treats this as a high-risk financial use case. It requires independent validation, stress tests against plausible worst-case scenarios, and an operating model that includes kill-switch authority. It also requires friction. That is the unpopular word. Friction slows scale, but friction also prevents runaway loss.

Operational controls that matter include exposure caps by region and timeframe, approval thresholds that force human review when the model deviates from market indicators, and a decision register that documents why the institution accepted risk at that moment.

The deeper lesson is about the fiction of automation smoothness. Organizations love the idea that AI converts markets into controllable systems. Markets punish that fantasy. Governance reintroduces humility as an operational constraint.`
  },
  {
    id: 'risk-scores-due-process',
    title: 'The Dutch Scandal: Algorithmic Suspicion and State Collapse',
    date: '2024-09-25',
    context: 'public-sector',
    type: 'briefing',
    abstract: 'The Dutch government resigned in 2021 after algorithmic risk scoring falsely accused thousands of families of fraud. This is the archetype of what happens when the state operationalizes suspicion through opaque scoring.',
    content: `When an algorithmic score triggers enforcement against citizens, the consequence domain becomes democratic legitimacy. That is not rhetorical. It is structural. A system that flags families as fraud risks, without meaningful explanation and appeal, can produce systemic harm at scale, and the institution will eventually face a legitimacy crisis.

In the Dutch child benefits scandal, algorithmic risk scoring and enforcement practices falsely accused thousands of families of fraud, producing severe financial and social consequences. The Dutch government resigned in 2021. This is the archetype of what happens when the state operationalizes suspicion through opaque scoring.

The governance failure is not simply "bias." It is lack of due process architecture. High-impact decisions require contestability. People must be able to understand the basis of adverse decisions and have a viable pathway to challenge them. Without that, the system becomes a machine for administrative violence.

Mechanism matters. Risk scoring often relies on proxies that correlate with class, ethnicity, immigration status, and neighborhood. Even if the model does not "use race," it can operationalize discrimination through features that function as race-adjacent signals. If governance does not impose explainability requirements and feature constraints, the model will discover the easiest predictors of the label, including socially toxic ones.

A second mechanism is institutional overreliance. Once a risk score is embedded, it starts to discipline frontline workers. People defer because the model appears authoritative, and because deferral reduces personal blame. Governance must actively counteract that deferral by designing human oversight that is real: not "a human clicks approve," but a human can intervene with context, supported by explanations and rights.

A defensible public-sector operating model includes explicit thresholds for mandatory human adjudication, documented explanation obligations, and independent auditing capacity. It also includes an appeals process that is accessible, timely, and structurally capable of overturning automated decisions.

This is where many governance programs fail: they treat oversight as a committee and appeals as a form. Citizens experience oversight as outcomes, not intentions.`
  },
  {
    id: 'vendor-ai-liability',
    title: 'COMPAS and the Black Box Defense',
    date: '2024-09-08',
    context: 'procurement',
    type: 'briefing',
    abstract: 'If a score shapes sentencing outcomes, transparency is not a bonus feature. It is a legitimacy requirement. The COMPAS controversy illustrates why algorithmic systems in criminal justice become public battlegrounds.',
    content: `If a score shapes sentencing outcomes, transparency is not a bonus feature. It is a legitimacy requirement. The COMPAS controversy illustrates why algorithmic systems in criminal justice become public battlegrounds: because they touch liberty, and because people will not accept opaque infrastructure governing life trajectories.

ProPublica's investigation reported racial disparities in recidivism risk scoring, raising questions about fairness metrics, calibration, and accountability. The governance problem here is not only technical disagreement about which fairness definition is "correct." It is institutional incapacity to justify the system's authority.

Risk models can satisfy some fairness metrics while failing others. That is not a bug. It is a structural tension. Governance is the process of choosing, documenting, and defending a fairness definition appropriate to the domain, then constraining use accordingly.

In justice settings, governance must treat a score as advisory, not determinative. The system's role must be bounded, with explicit rules preventing sole reliance. Judges and decision-makers must receive context about limitations and error rates. Institutions must retain audit access and the ability to challenge vendor claims. Without that, the institution cannot credibly claim it is governing the tool. It is renting authority from a black box.

A defensible control baseline includes independent validation, documented fairness choices, and periodic revalidation as populations and policing practices change. It also includes contestability: the ability for affected individuals, defenders, or oversight bodies to interrogate why a score was produced and to challenge its relevance.

Vendor AI often arrives as a shortcut to capability. If governance is weak, it becomes a shortcut to accountability collapse. Outsourcing a model does not outsource responsibility, because customers, regulators, and auditors will look to the deploying organization, not to the supplier, when something fails.

The key governance lesson is that "accuracy" does not settle legitimacy. A system can be statistically impressive and still be unacceptable because it embeds historical injustice, hides causal assumptions, or makes outcomes difficult to contest. Governance must name that gap and build constraints around it.`
  },
  {
    id: 'shadow-ai-leakage',
    title: 'Samsung, ChatGPT, and the Prompt as Leak Vector',
    date: '2024-08-22',
    context: 'enterprise-saas',
    type: 'briefing',
    abstract: 'Shadow AI risk is what happens when institutional policy lags institutional behavior. Samsung reportedly banned ChatGPT after employees pasted proprietary code into the tool. The governance error was not curiosity. It was missing boundaries.',
    content: `Shadow AI risk is what happens when institutional policy lags institutional behavior. Staff will use tools that increase speed and reduce friction. If the organization does not govern that reality, sensitive information becomes prompt content, and prompt content becomes a leak vector.

Samsung reportedly restricted or banned ChatGPT use after employees pasted proprietary code and confidential content into the tool. The governance error was not that engineers were curious. The governance error was that there was no structured boundary between permissible experimentation and prohibited disclosure.

This category of incident is operationally predictable. People treat AI tools as "smart text boxes." They forget that the input may be stored, learned, reviewed, or exposed through logs and vendor processes. Even when vendors promise protections, the organization still has an obligation to manage data handling. If you are serious about governance, you treat prompts as data flows.

The control set is straightforward, but it must be enforceable. First, classify data and define what can be used in external tools. Second, provide an approved secure alternative for legitimate use cases, otherwise staff will route around the policy. Third, train people using realistic examples: code snippets, client data, strategy memos, and incident scenarios. Fourth, implement monitoring where feasible, and create a reporting channel that does not punish people for admitting a mistake early.

The hardest part is cultural. Organizations often write policies that assume perfect compliance, then act shocked when workflows ignore them. Governance is not the policy document. Governance is the combination of policy, tooling, incentives, and safe reporting.

If you cannot offer a safe, sanctioned pathway for AI assistance, you will get unsanctioned pathways. Then you will only learn about them when the damage is already done.`
  },
  {
    id: 'chatbot-institutional-speech',
    title: 'Air Canada and the Chatbot That Became Policy',
    date: '2024-08-05',
    context: 'enterprise-saas',
    type: 'briefing',
    abstract: 'Customer-facing AI does not dilute accountability. It concentrates it. In 2024, Air Canada was ordered to honor a chatbot\'s incorrect refund statement. Screenshots create durable evidence.',
    content: `Customer-facing AI does not dilute accountability. It concentrates it. When an AI system communicates policy, it becomes institutional speech in the eyes of customers, regulators, and courts.

In 2024, an Air Canada chatbot gave a customer incorrect refund information. The airline was ordered to honor the chatbot's statement. The key governance lesson is not "chatbots hallucinate." The lesson is that the organization deployed a communication channel without adequate controls for policy fidelity, escalation, and correction.

The mechanism is simple. Users treat chatbots as official. Screenshots create durable evidence. In disputes, institutions often claim the bot is a separate tool, or that disclaimers should limit reliance. That defense is weak if the organization failed to implement basic source control and monitoring.

Governance for customer-facing chatbots begins with capability scoping. The system must be explicitly limited to retrieval from approved policy sources, or it must route the user to a human agent when the question enters interpretive or exception territory. The boundary must be enforced technically, not merely stated in UI copy.

The second anchor is versioning and ownership. Policy pages need owners, review cadence, and change logs. The bot's knowledge layer must be tied to those pages so the organization can show what the system had access to at the time.

The third anchor is monitoring and remediation. If the system produces incorrect policy statements, the organization must log it, correct it, and document the correction timeline. That documentation is not optional. It is the evidence trail that distinguishes a contained incident from a story about negligence.

The point is not perfection. The point is governability. When something goes wrong, the organization that can produce an evidence trail remains credible, while the organization that can only offer explanations becomes suspect.`
  }
];

export const contexts = [
  {
    id: 'regulated',
    title: 'Regulated Systems',
    description: 'Higher evidence burden, tighter approvals, audit-grade remediation.'
  },
  {
    id: 'enterprise-saas',
    title: 'Enterprise SaaS',
    description: 'Governance that ships: release cadence, drift, and vendorized AI features.'
  },
  {
    id: 'procurement',
    title: 'Procurement & Vendor Risk',
    description: 'Questionnaires become controls: diligence artifacts, contract-backed proof.'
  },
  {
    id: 'public-sector',
    title: 'Public Sector & Due Process',
    description: 'Contestability, appeal pathways, reconstruction under scrutiny.'
  },
  {
    id: 'financial',
    title: 'Financial & Capital Systems',
    description: 'Models move money: exposure controls, stress testing, adverse action logic.'
  },
  {
    id: 'governance-architecture',
    title: 'Governance Architecture & Operating Models',
    description: 'Decision rights, lifecycle gates, evidence trails that scale.'
  }
];
