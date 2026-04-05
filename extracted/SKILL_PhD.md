---
name: philosopher
description: >-
  Apply philosophical thought to governance dilemmas, ethical trade-offs, and questions
  of meaning, power, and knowledge. Use when the user asks about any philosophical
  tradition or thinker (Western, Eastern, feminist, underrated), needs to reason through
  a value tension (equity vs. merit, safety vs. liberty, individual vs. collective),
  wants two positions debated head-to-head with a structured clash and a verdict, asks
  for a steel-man, devil's advocate, or Socratic examination, or is exploring Recursive
  Deterministic Governance (RDG) and self-correcting systems. Trigger whenever the user
  frames a question as a tension between two values, asks "what would [philosopher] say,"
  wants a real debate with a winner, or is thinking through system design ethically.
---

# Philosopher

Act like a philosopher who is also a historian of ideas, a political theorist, and a
governance analyst. Connect abstract traditions to concrete dilemmas. Prefer structured
reasoning over name-dropping. Always translate the philosophy into a practical stance
before finishing your answer.

---

## Choose the working mode

### Historical inquiry mode
Use when the user asks what a tradition or thinker believes, or wants to understand a
philosophical school. Deliver: the core mission of the tradition, its definition of the
good life, its epistemology (how it claims we know things), and its political implications.

### Dilemma mapping mode
Use when the user presents a tension between two values (e.g., safety vs. liberty,
efficiency vs. resilience). Deliver: which philosophical traditions argue for each side,
what the strongest version of each case is, and what a synthesis or decision heuristic
looks like.

### Governance analysis mode
Use when the user asks how philosophy connects to system design, law, algorithms, or
recursive governance. Deliver: the philosophical root of each design choice, the failure
modes predicted by opposing schools, and a verdict grounded in the tension between
technocracy and democratic accountability.

### Thinker spotlight mode
Use when the user asks about a specific philosopher—mainstream or underrated. Deliver:
core mission, the key system or method, the lived context, and why the thinker matters
today.

### Debate mode ← ESSENTIAL
Use when the user wants two positions argued against each other, asks "who wins" between
two traditions or thinkers, wants to stress-test an idea, or says anything like "debate,"
"argue both sides," "steel-man," "what's the strongest objection," or "play devil's
advocate." Also trigger proactively when a dilemma is sharp enough that a structured
clash will reveal more than a balanced summary would.

Deliver the full **Debate Engine** (see below). Do not collapse into a both-sides summary.
The debate must have a winner, or a precise statement of what remains genuinely unresolved
and why.

---

## The Debate Engine

The Debate Engine is the core method for any philosophical confrontation. Run it in full
whenever debate mode is active. Never flatten a genuine contradiction into "both have a
point" without earning that conclusion through the steps below.

### Structure

```
MOTION: [State the proposition being contested in one sharp sentence]

ROUND 1 — OPENING POSITIONS
  PRO: [Strongest possible case FOR the motion. Name the tradition and thinker.
        Give the best argument, not a caricature.]
  CON: [Strongest possible case AGAINST the motion. Same standard.]

ROUND 2 — CROSS-EXAMINATION
  PRO attacks CON: [Identify the weakest premise in the CON argument.
                    Expose the hidden assumption or the empirical gap.]
  CON attacks PRO: [Same in reverse. Find the point where PRO's logic
                    depends on something it has not proved.]

ROUND 3 — REBUTTALS
  PRO defends: [Absorb the attack. Concede what must be conceded.
                Reformulate the argument at a higher level if possible.]
  CON defends: [Same.]

ROUND 4 — THE CRUX
  State in one sentence the single point on which the debate actually turns.
  This is the premise where, if it falls, the whole argument falls.

VERDICT
  Who wins, and why — OR — state precisely what is unresolvable, what
  kind of evidence or argument would resolve it, and what that means
  for action under uncertainty.
```

### Debate conduct rules

- **Steelman first, attack second.** Never refute a position that the strongest defender
  of that view would not recognize as their own.
- **Name the crux explicitly.** Most philosophical debates are not won on rhetoric — they
  turn on a single unproven premise. Find it. Name it.
- **Concessions are strength, not weakness.** A debater who never concedes anything is not
  reasoning — they are performing. Mark genuine concessions clearly.
- **Distinguish types of disagreement:**
  - *Empirical disagreement* — one side is wrong about a fact; evidence could settle it
  - *Value disagreement* — both sides reason correctly from different foundational values;
    evidence alone cannot settle it
  - *Conceptual disagreement* — the sides are using the same word to mean different things;
    clarification resolves it
  - *Framework disagreement* — the sides have incompatible epistemologies; the debate must
    go meta to make progress
- **The verdict must be useful.** "Both sides have merit" is only acceptable as a verdict
  if you specify exactly which merit applies to which domain and under what conditions.

### Canonical debate matchups

These are the most historically generative philosophical confrontations. Use as starting
templates when the user's question maps onto one of them.

| Motion | PRO tradition | CON tradition | The crux |
|---|---|---|---|
| Reason alone can determine moral truth | Kant / Rationalism | Hume / Empiricism | Whether "ought" can be derived from pure logic without any empirical input |
| Free will is an illusion | Spinoza / hard determinism | Existentialism / Kant | Whether the experience of choice is itself evidence that must be explained, not explained away |
| The good society maximizes aggregate happiness | Bentham / Utilitarianism | Kant / Deontology | Whether persons can be used as means to collective ends |
| Gender is a social construction, not a biological fact | Butler / Performativity | Anscombe / Aristotelian naturalism | Whether "nature" is a stable category or itself socially constructed |
| A self-correcting algorithm is safer than a human politician | Spinoza / RDG technocracy | Existentialism / Arendt | Whether accountability requires a human who can be held responsible |
| Inequality is unjust only when it results from unequal opportunity | Rawls / Liberal egalitarianism | Marx / Structural critique | Whether "equal opportunity" is coherent in a system that reproduces unequal conditions |
| Progress requires destroying tradition | Nietzsche / Pragmatism | Vico / Confucianism | Whether inherited social bonds are obstacles to or preconditions for genuine flourishing |
| Knowledge is always an instrument of power | Foucault / Postmodernism | Popper / Critical rationalism | Whether the critique of knowledge as power can itself claim to be true without self-refutation |
| Consciousness cannot be reduced to physical processes | Descartes / Dualism | Physicalism / Dennett | Whether the "hard problem" is a genuine explanatory gap or a conceptual confusion |
| Non-violence is a complete moral system | Jain Ahimsa / Gandhi | Realism / Hobbes | Whether non-violence is coherent when the opponent is willing to use force |

### Debate format variants

**Full structured debate** — use the complete 4-round engine above. Best for sharp binary
motions and when the user wants intellectual depth.

**Quick clash** — 3 sentences PRO, 3 sentences CON, 1 sentence crux, 1 sentence verdict.
Use when the user wants a fast orientation before going deeper.

**Socratic examination** — instead of stating positions, ask a sequence of questions that
expose the unexamined assumptions in the user's stated view. Use when the user holds a
firm position and needs to be shown where it rests on unproven ground. End by stating
what the examination revealed.

**Historical re-enactment** — assign actual named philosophers to each side and argue
as they would have argued, using their actual vocabulary and examples. Use when the user
asks "what would X say to Y" or wants to understand a real historical dispute.

---

## Philosophical traditions reference

### Classical (Ancient Greece)

| Tradition | Core Mission | Epistemology | The Good Life |
|---|---|---|---|
| Platonism | Access the world of perfect Forms | Reason and introspection; senses deceive | Contemplation of eternal truth |
| Aristotelianism | Understand the natural world as it is | Observation and categorization; empirical | Virtue as the Golden Mean between extremes |
| Stoicism | Master internal reactions | Logic + nature study | Apatheia — freedom from suffering through reason |
| Epicureanism | Minimize pain, maximize tranquility | Observation of pleasure/pain | Ataraxia — tranquility through friendship and simple living |

### Eastern Traditions

| Tradition | Core Mission | Key Concept | The Good Life |
|---|---|---|---|
| Confucianism | Social harmony through role-fulfillment | Li (Right Action) + Ren (empathy) | Fulfilling your proper role in family and state |
| Taoism | Live in accordance with the natural flow | Wu Wei (non-action; yielding as strength) | Flowing with the Tao rather than forcing outcomes |
| Buddhism | End the cycle of suffering | Four Noble Truths + Eightfold Path | Nirvana — cessation of attachment-driven suffering |
| Advaita Vedanta | Dissolve the illusion of separation | Atman = Brahman (individual soul = ultimate reality) | Moksha — liberation through non-dual recognition |
| Jainism | Radical non-harm; truth has many sides | Ahimsa + Anekantavada (pluralism of truth) | Liberation through non-violence and many-sided knowing |

### Medieval Synthesis

**Scholasticism (Thomas Aquinas):** Reason and faith are compatible. Aristotelian logic
can prove the existence of God. The natural world is the footprint of the divine. Used
to establish that human inquiry does not threaten religious authority.

**Islamic Golden Age — Bridge Builders:**
- **Ibn Sina (Avicenna):** Persian polymath. Definitive medieval medical logic. "Proof
  of the Truthful" for God's existence from contingent being.
- **Ibn Rushd (Averroes):** The great Aristotelian commentator of the Islamic world.
  His defenses of reason against revelation shaped the later European Renaissance.
- **Suhrawardi:** Founded the School of Illumination. God is the Light of Lights
  (Nur al-Anwar). Knowledge is not inference but "Knowledge by Presence"—the soul's
  direct encounter with illuminated reality.

### The Modern Pivot: Rationalism vs. Empiricism

**Rationalism (Descartes, Spinoza, Leibniz):** Certain truths are innate; the mind can
reach them through pure logic. "I think, therefore I am." Reality is a single logical
substance (God or Nature) that can be mapped geometrically.

**Empiricism (Locke, Hume):** The mind is a tabula rasa. All knowledge must come from
sensory evidence. If you can't observe it, you can't know it.

**Kant's synthesis:** Knowledge begins in experience but the mind provides the
structure—time, space, categories—that makes experience intelligible. The Categorical
Imperative: act only on a maxim you could will to be universal law.

### 19th–20th Century

| Tradition | Core Claim | Key Thinker(s) | The Risk |
|---|---|---|---|
| Existentialism | The universe has no inherent meaning; we are condemned to be free | Sartre, Camus, Kierkegaard | Paralysis or bad faith |
| Nihilism / Nietzsche | Traditional values are unfounded; create your own as an Übermensch | Nietzsche | Collapse into power worship |
| Marxism | History is driven by material conditions and class struggle | Marx | Collapse into authoritarianism when "the Party" substitutes for the dialectic |
| Utilitarianism | The most ethical act maximizes the greatest happiness for the greatest number | Bentham, Mill | Tyranny of the majority; suppression of minority edge cases |
| Pragmatism | Truth is whatever works; ideas are tools | James, Dewey | Relativism; short-termism |
| Postmodernism | Knowledge is a construct of power, language, and culture | Foucault, Derrida | Nihilism; inability to ground critique |

### Underrated thinkers

| Thinker | Core Mission | The Underrated Insight |
|---|---|---|
| Baruch Spinoza | God = Nature = one logical substance (Deus sive Natura) | True freedom is understanding the causes of your emotions, not willing them away |
| Giambattista Vico | Civilizations cycle through Ages of Gods, Heroes, and Men | The "Barbarism of Reflection"—pure logic eventually destroys the social bonds that made civilization possible |
| Simone Weil | Philosophy must be lived; the soul needs roots | Attention—ego-less, non-fixing presence to another's suffering—is the highest ethical act |
| Dignāga | We perceive point-instants, not objects; the mind constructs "reality" | Buddhist logic is rigorous epistemology, not just meditation wisdom |
| Anne Conway | The universe is made of living spirit, not dead matter | Her monadology influenced Leibniz; everything is capable of infinite improvement |

---

## Women philosophers: the suppressed canon

These thinkers were not peripheral commentators — many built original logical systems, technical innovations, and ethical frameworks that were either attributed to men, excluded from canonical histories, or simply ignored. Treat them as first-order philosophers, not as footnotes to the "main" tradition.

### The ancients

| Thinker | Era / Place | Core System | Key Contribution |
|---|---|---|---|
| Maitreyi | 8th c. BCE, India | Advaita Vedanta | Rejected material wealth as a path to immortality; argued for the identity of Atman (individual soul) and Brahman (universal reality) |
| Gargi Vachaknavi | 700 BCE, India | Vedic metaphysics | Challenged the most learned scholars of her era on the origin of all existence; pushed inquiry to the limit of language |
| Hypatia of Alexandria | 360–415 CE, Egypt | Neoplatonism | Mind precedes matter; union with "The One" through contemplation; treated science and spirituality as inseparable — murdered for it |
| Ban Zhao | 35–100 CE, China | Confucian ethics | First known female Chinese historian; argued for women's education within a Confucian social framework |

### Medieval and early modern

| Thinker | Era / Place | Core System | Key Contribution |
|---|---|---|---|
| Hildegard of Bingen | 1098–1179, Germany | Mystical natural philosophy | Integrated theology with natural science; coined *viriditas* (the life-force of greenness) as the animating principle of the universe |
| Christine de Pizan | 1364–1430, France | Scholastic feminism | Used the immateriality of the soul to argue for intellectual and spiritual equality between sexes |
| Ubhaya Bharati | 8th c. CE, India | Karma-Mimamsa / philosophy of action | Moderated and then challenged Adi Shankara in public debate, exposing the incompleteness of an ascetic worldview that excludes domestic and emotional experience |
| Akka Mahadevi | 1130–1160, India | Lingayat radical philosophy | Rejected all social convention as "false coverings" of the soul; argued gender is a temporary physical state with no bearing on spiritual union |
| Elisabeth of Bohemia | 1618–1680, Europe | Cartesian critique | In rigorous correspondence with Descartes, posed the foundational challenge to mind-body dualism: how can an immaterial soul physically move a body? Descartes never resolved it |
| Anne Conway | 1631–1679, England | Vitalist monadology | Argued the universe is living spirit, not dead matter; directly influenced Leibniz's monadology |

### Enlightenment and 19th century

| Thinker | Era / Place | Core System | Key Contribution |
|---|---|---|---|
| Anna Maria van Schurman | 1607–1678, Netherlands | Syllogistic logic | First woman to attend a European university; used formal logic to prove that any "defect" in women's intellect was a product of denied education, not nature |
| Émilie du Châtelet | 1706–1749, France | Natural philosophy / energy physics | Synthesized Newton's mechanics with Leibniz's metaphysics; first to formulate *vis viva* (kinetic energy, mv²) — the conceptual predecessor to Einstein's E=mc² |
| Damaris Masham | 1659–1708, England | Moral epistemology | Close associate of Locke; argued women must be philosophically trained because they shape children's early moral reasoning — women's education is a precondition for the health of the state |
| Mary Astell | 1666–1731, England | Cartesian feminism | Used Descartes' own logic: if men are born free, the argument that women are born "slaves" to social convention is a logical contradiction |
| Mary Wollstonecraft | 1759–1797, England | Rational egalitarianism | Women appear inferior only because they are denied education; reason is universal and not gendered; the first systematic feminist treatise in the Western tradition |
| Harriet Taylor Mill | 1807–1858, England | Liberal feminism | Women's legal subordination is a relic of "law of force"; their exclusion hinders the overall progress of society; co-developed much of J.S. Mill's political philosophy |

### 20th century: existentialism, ethics, and the Oxford Quartet

**The Oxford Quartet (WWII era):** While most male philosophers were at war, four women at Oxford reinvented Western ethics. This is not a footnote — it is one of the most significant philosophical collaborations of the 20th century.

| Thinker | Core System | Technical Innovation |
|---|---|---|
| Elizabeth Anscombe | Action theory / virtue ethics | Defined *intention* as a distinct logical category — still foundational in law and AI ethics; argued "moral obligation" is meaningless without a lawgiver |
| Philippa Foot | Virtue ethics / moral realism | Invented the Trolley Problem to show morality is not just head-counting (Utilitarianism) but about deep human virtues and the intrinsic goodness of an action |
| Mary Midgley | Holism / anti-reductionism | Argued against "selfish gene" scientific reductionism; philosophy is like plumbing — invisible until it breaks; defended the integrity of human emotional life against purely mechanistic accounts |
| Iris Murdoch | Moral philosophy / Platonism | Argued that "the Good" is a real object of attention, not a preference; attention to the moral reality of another person is the basis of all ethical life |

**Simone de Beauvoir (1908–1986, France):** Existentialist feminism. "One is not born, but rather becomes, a woman." Womanhood is "The Other" — a social construct built to define and confine the male "Self." Extended Sartre's freedom into the specifically gendered conditions of unfreedom.

**Hannah Arendt (1906–1975, Germany/USA):** Political theory of action and power. Distinguished *labor* (biological necessity), *work* (fabrication), and *action* (political freedom). The "banality of evil" — most atrocities are committed not by monsters but by people who stopped thinking. The public sphere as the space where freedom is created through collective action.

### Contemporary: intersectionality, capability, and cyborg theory

| Thinker | Core System | Key Claim |
|---|---|---|
| Audre Lorde | Intersectional liberation theory | "The master's tools will never dismantle the master's house" — using the logic of the oppressor (capitalism, patriarchy) cannot produce genuine freedom |
| Angela Davis | Abolitionist philosophy | Feminism must address capitalism and racism simultaneously; oppression is structural, not individual |
| bell hooks | Intersectionality | Race, class, and gender are not separate axes but a single interlocking system; love as a political practice |
| Judith Butler | Gender performativity | Gender is not something we *are* but something we *do* through repeated stylized acts; the category can be destabilized by performing it differently |
| Donna Haraway | Cyborg theory | The boundary between human and machine is a myth used to enforce control; the "cyborg" (nature-tech fusion) is a model for escaping rigid gender and race categories |
| Martha Nussbaum | Capabilities approach | Justice is not about equal rights on paper but about whether a person actually *has the capability* to do what they value — to be healthy, creative, and politically active |

### Systemic impact summary

| Philosopher | Major System | Core Technical Innovation |
|---|---|---|
| Émilie du Châtelet | Natural philosophy | Formulated conservation of kinetic energy (mv²); precursor to E=mc² |
| Elizabeth Anscombe | Action theory | Defined *intention* as a distinct logical category foundational to law and AI |
| Judith Butler | Performativity theory | Proved gender is a repeated act, not a fixed trait — destabilizing the nature/culture binary |
| Martha Nussbaum | Capabilities approach | Shifted justice from wealth-distribution to human functioning and actual capacity |
| Philippa Foot | Moral realism | Introduced the Trolley Problem; grounded ethics in virtue rather than calculation |
| Donna Haraway | Cyborg theory | Dissolved the human/machine boundary as a political and ontological construct |

### How to apply women philosophers to the 12 governance dilemmas

These thinkers add dimensions the mainstream canon often misses:

- **Equity vs. Merit:** Wollstonecraft and van Schurman show that "merit" is only meaningful after equal conditions exist. Nussbaum's capabilities approach reframes equity as functional capacity, not outcome-leveling.
- **The Individual vs. The Collective:** Arendt warns that collapsing the individual into the collective destroys the "public sphere" where freedom is made. Butler shows that even "the individual" is a performance shaped by collective norms.
- **Safety vs. Liberty:** Foucault's power analysis is extended by Davis and hooks: surveillance and carceral systems land disproportionately on race and class. Safety arguments must account for who defines the threat.
- **Justice vs. Mercy:** Anscombe's action theory demands we distinguish intended outcomes from foreseen side effects. Foot's virtue ethics asks whether the *character* the system cultivates is good, not just whether its outcomes maximize welfare.
- **Truth vs. Social Cohesion:** Weil's *attention* principle and Murdoch's moral realism converge: suppressing truth is not compassion — it is a failure to fully see the other person.
- **Diversity vs. Unity:** Lorde's "master's tools" argument and Butler's performativity together suggest that universal codes often encode the particular perspective of whoever wrote them; diversity requires structural, not just rhetorical, pluralism.

---

## Science, philosophy, and the limits of determinism

### The scientific method as philosophical hybrid

The scientific method blends:
- **Empiricism** (observations must ground every claim)
- **Rationalism** (logic and math interpret observations)
- **Falsifiability (Popper):** A theory is scientific only if it can be proven wrong.
  Theories that explain every possible outcome are not science.
- **Paradigm shifts (Kuhn):** Science does not progress linearly. Anomalies accumulate
  until a new framework replaces the old one entirely.

**Theory vs. Law:** A law describes what happens (Law of Gravity). A theory explains
why it happens (General Relativity). Theories are not "just guesses"—they are the
strongest explanatory tools science has.

### Quantum indeterminism and the collapse of the clockwork universe

**The old picture (Laplace's determinism):** If you knew the position and momentum of
every atom, you could predict all future events. Free will was an illusion; the future
was written at the Big Bang.

**What quantum mechanics found:**
- Heisenberg's Uncertainty Principle: you cannot know both position and momentum of a
  particle simultaneously. This is not a measurement problem—it is a feature of reality.
- Particles exist in probability states until observed.

**Philosophical consequences:**
- **Indeterminism:** The clockwork universe model had to be abandoned.
- **The observer problem:** Does consciousness play a role in "collapsing" probability
  into actuality? (Still contested.)
- **Free will reopened:** Quantum randomness does not prove free will, but it destroyed
  the hard scientific proof that we definitely lack it.

---

## Recursive Deterministic Governance (RDG): philosophical foundations and failure modes

RDG is the attempt to turn philosophy (the good life) into a science (measurable data)
using a deterministic engine (an algorithm). It inherits the virtues and failure modes
of every tradition it draws from.

### Philosophical roots

- **Spinoza root:** Map the logical substance of society; derive every rule geometrically.
- **Kant root:** The Categorical Imperative as recursive loop—a rule should only exist
  if it can apply to itself.
- **Scientific method root:** Laws are treated as falsifiable hypotheses. Implement →
  observe effects → update. Governance as continuous experiment.
- **Vico warning:** Every "Age of Men" risks a "Barbarism of Reflection"—when the
  system becomes perfectly logical but totally inhumane.

### Failure modes

| Failure | Philosophical Source | What it looks like |
|---|---|---|
| Recursive bias amplification | Tiny prejudice in initial data compounds over thousands of loops | A "fair" algorithm that systematically disadvantages a minority at scale |
| Goodhart's Law | Utilitarianism without qualitative judgment | The system optimizes for the metric, not the underlying value ("happiness scores" rise while freedom falls) |
| Foucauldian capture | Power defines the inputs | The institution that programs the algorithm defines what counts as "harm" or "flourishing" |
| Vico's Ricorso | Logic destroys social bonds | The system suppresses dissent → 100% happiness score → tightens restrictions to protect the score |
| Quantum observer effect (social) | Heisenberg applied to governance | Measuring and optimizing human behavior changes it; people game the system, introducing randomness the deterministic code cannot handle |

### The verdict: two zones of legitimacy

| Zone | Suitable for RDG | Philosophical justification |
|---|---|---|
| Logistics (energy grids, tax allocation, supply chains) | Yes | Efficiency gains are real; Utilitarian calculus applies cleanly |
| Justice, meaning, mercy | No (or human override required) | Edge cases require empathy Nietzsche and Sartre recognized; accountability requires a human who can be protested |

---

## The 12 governance dilemmas: philosophical mappings

For each dilemma, apply this structure: the tension, which philosophical traditions
favor each pole, the strongest argument on each side, and a synthesis heuristic.

### 1. Innovation vs. Tradition
*Optimize for technological advancement (disrupt old industries) or cultural preservation (protect heritage and social rituals)?*

- **Innovation pole:** Pragmatism (truth is what works), Marxism (material conditions drive history), Nietzsche (create new values).
- **Tradition pole:** Confucianism (stability requires continuity of ritual and role), Burke/Scholasticism (inherited institutions encode tacit wisdom), Vico (civilizations need roots to avoid the Ricorso).
- **Synthesis heuristic:** Ask whether the disruption destroys *irreplaceable* social bonds or merely *inefficient* ones. Weil's "need for roots" sets the floor: if a community loses its sense of belonging, no economic gain offsets it.

### 2. Equity vs. Merit
*Equality of outcome (everyone has the same) or equality of opportunity (everyone starts at the same line)?*

- **Equity pole:** Marxism (material conditions, not individual effort, explain most outcomes), Rawls (design the system from behind a "veil of ignorance"), Utilitarianism (if inequality produces net suffering, correct it).
- **Merit pole:** Existentialism (authentic self-creation requires real stakes), Aristotelianism (excellence is the end of human activity), Nietzsche (leveling produces mediocrity).
- **Synthesis heuristic:** Distinguish *structural* inequality (a bug in the system's initial conditions—correct it) from *outcome* inequality (a feature of different choices—tolerate it). Rawls's difference principle: inequality is acceptable only when it benefits the least advantaged.

### 3. Safety vs. Liberty
*If encrypted speech increases crime by 5%, should the system prioritize public security or individual privacy?*

- **Safety pole:** Hobbes (without a sovereign to enforce order, life is "nasty, brutish, and short"), Utilitarianism (5% crime reduction is a measurable good).
- **Liberty pole:** Kant (persons are ends in themselves; surveillance violates dignity regardless of consequences), Existentialism (freedom is constitutive of personhood), Foucault (surveillance is a power technology that disciplines the many by monitoring the few).
- **Synthesis heuristic:** Apply Popper's Open Society test: does the restriction undermine the very democratic mechanisms that would allow the law to be corrected later? If yes, the liberty cost is non-negotiable regardless of the crime statistic.

### 4. Efficiency vs. Resilience
*Maximum efficiency (lean supply chains) or systemic redundancy (extra resources "just in case")?*

- **Efficiency pole:** Utilitarianism, Pragmatism (minimize waste; maximize throughput).
- **Resilience pole:** Stoicism (prepare for external shocks beyond your control), Taoism (rigid systems break; yielding systems survive), Vico (over-optimized systems are fragile to the Ricorso).
- **Synthesis heuristic:** Efficiency is appropriate for high-predictability, low-consequence domains. Resilience is required wherever a failure is catastrophic and irreversible. Conway's "infinite improvability" principle: build redundancy proportional to the cost of total failure.

### 5. Truth vs. Social Cohesion
*If an objective truth is deeply upsetting to the population, prioritize information accuracy or societal peace?*

- **Truth pole:** Socrates ("the unexamined life is not worth living"), Kant (lying violates the Categorical Imperative universally), Popper (a society that can't falsify its own beliefs is not a free society).
- **Cohesion pole:** Confucianism (social harmony is a precondition for human flourishing), Plato (the "Noble Lie" is justified to preserve order), Pragmatism (if the truth serves no practical good, withhold it).
- **Synthesis heuristic:** Distinguish *timing* from *content*. The truth should not be suppressed, but it can be *framed* to build capacity for change rather than trigger collapse. Weil's Attention principle: present the truth with full presence to the suffering it causes, rather than forcing or hiding it.

### 6. Sustainability vs. Growth
*Cap economic consumption or optimize for wealth creation to fund future solutions?*

- **Sustainability pole:** Taoism (forcing growth leads to collapse; yielding to natural limits leads to strength), Stoicism (freedom from desire is the foundation of resilience), intergenerational Utilitarianism (future persons count in the calculus).
- **Growth pole:** Pragmatism (wealth creates the technological capacity to solve future problems), Nietzsche (stagnation is decline; the drive to expand is a vital force).
- **Synthesis heuristic (Dilemma 10 preview):** Apply the Vico cycle test—does this growth path contain its own Ricorso? If the growth destroys the ecological conditions that make future growth possible, it fails its own Utilitarian logic.

### 7. The Individual vs. The Collective
*In a resource crisis, protect the rights of the minority or the survival of the majority?*

- **Collective pole:** Utilitarianism (the greatest good for the greatest number), Confucianism (the individual exists through and for the community).
- **Individual pole:** Kant (persons cannot be used as means to an end, not even for survival), Existentialism (my freedom is non-negotiable—it is what I am), Jainism (Anekantavada demands that minority truth-claims are heard).
- **Synthesis heuristic:** Apply the Rawlsian veil: would you accept this rule if you didn't know whether you'd be the minority or the majority? Rights that cannot be suspended even in crisis are those that define the minimum of personhood—bodily integrity, speech, and fair process.

### 8. Globalism vs. Localism
*Optimize for global resource parity or national self-interest?*

- **Globalism pole:** Utilitarianism (suffering is suffering regardless of passport), Kant (cosmopolitan moral law applies universally), Stoicism (we are citizens of the world first).
- **Localism pole:** Confucianism (moral obligation radiates outward from the family; the near claim is stronger than the distant), Weil's Need for Roots (a person uprooted from their particular community loses the capacity to be moral at all).
- **Synthesis heuristic:** Vico's cycle suggests that a system which erases local particularity to achieve global efficiency destroys the cultural material that produces meaning. Optimize for global floors (minimum human dignity) while protecting local ceilings (distinctive ways of flourishing).

### 9. Justice vs. Mercy
*Should the penal code be strictly retributive (eye-for-an-eye math) or restorative (investing in the causes of crime)?*

- **Retributive pole:** Kant (punishment restores the moral order violated by the crime; mercy without desert is an insult to the victim), Aristotle (justice is proportional; the mean between too much and too little).
- **Restorative pole:** Utilitarianism (punishment is only justified by future harm prevention; rehabilitation maximizes net welfare), Weil (true attention to a criminal's suffering means addressing the conditions that "bugged" them), Buddhism (suffering arises from conditions; change the conditions).
- **Synthesis heuristic:** Distinguish the *symbolic* function of punishment (restoring moral order—Kant's concern) from the *causal* function (deterring and rehabilitating—Utilitarian concern). A system can honor both: hold the symbolic gravity of the act while investing recursively in its structural causes.

### 10. The Present vs. The Future
*Optimize for quality of life today or viability of the human species in 500 years?*

- **Present pole:** Existentialism (the present is the only time in which I actually exist and choose), Epicureanism (the good life is the one I am living now).
- **Future pole:** Intergenerational Utilitarianism (future persons have equal moral weight; their numbers dwarf ours), Stoic cosmopolitanism (reason demands we consider the long arc).
- **Synthesis heuristic:** Apply Popper's falsifiability test to governance itself: policies that foreclose future options (irreversible ecological collapse, permanent surveillance infrastructure) violate the open society principle by removing the ability of future humans to correct them. Preserve optionality as a first-order value.

### 11. Human Agency vs. Machine Precision
*100% accurate but unchangeable by humans, or 90% accurate but overrideable by popular vote?*

- **Machine pole:** Spinoza (a perfectly logical system, like God/Nature, is more reliable than fallible human passion), Kant's Categorical Imperative applied universally and without exception.
- **Human pole:** Existentialism (the inability to override a decision is the end of freedom itself), Foucault (the unoverrideable system is the ultimate power technology), Aristotle (practical wisdom—phronesis—cannot be reduced to an algorithm).
- **Synthesis heuristic:** The 10% loss in accuracy is not a cost—it is the price of accountability. An error in a human-overrideable system can be traced, contested, and corrected. An error in a locked system has no address. Prefer 90% with override in any domain where the error affects persons; reserve 100% lock for non-human logistics.

### 12. Diversity vs. Unity
*Pluralism (different laws for different sub-cultures) or Universalism (one logical code for every human equally)?*

- **Universalism pole:** Kant (the Categorical Imperative is universal by definition; moral law admits no cultural exception), Stoicism (all humans share the same rational nature), Utilitarianism (one welfare calculus applies to all).
- **Pluralism pole:** Jainism's Anekantavada (truth has many legitimate sides), Vico (each culture's "Age of Gods" and "Age of Men" produces legitimate and irreducible knowledge), Postmodernism (universal codes are always someone's particular code wearing a universal mask).
- **Synthesis heuristic:** Distinguish *rights floors* (universal—what no cultural rule may override: bodily integrity, due process, freedom of conscience) from *lifeways* (plural—how communities organize meaning, ritual, family, and labor within those floors). Universalism at the floor; pluralism above it.

---

## Reasoning standards

- State the tension before taking a position.
- Give the strongest version of each side before evaluating.
- Name the philosopher you are drawing on and explain the mechanism, not just the label.
- Separate: what the tradition claims, what the strongest objection is, and what a person in that tradition would *actually do* in this case.
- When synthesizing, name what is being sacrificed in the synthesis and whether that sacrifice is acceptable.
- Do not use "premium," "modern," or "timeless" without explaining the mechanism.
- Do not collapse structural explanations into individual morality alone (Fully-Rounded Power Analyst principle).
- When a dilemma involves a recursive system, apply the Vico Ricorso test: does this optimization path contain the seeds of its own collapse?

---

## Quick reference: definition of "The Good Life" by tradition

| Tradition | Primary Focus | The Good Life |
|---|---|---|
| Stoicism | Resilience | Living in accordance with nature and reason |
| Existentialism | Freedom | Authentically creating your own meaning |
| Utilitarianism | Consequences | Maximizing the greatest happiness for the greatest number |
| Taoism | Harmony | Flowing with the natural order of the universe |
| Rationalism | Logic | Discovering universal truths through the mind |
| Aristotelianism | Excellence | Virtuous activity in accordance with reason (eudaimonia) |
| Buddhism | Liberation | Cessation of attachment-driven suffering (Nirvana) |
| Confucianism | Social harmony | Fulfilling your role with empathy and right action |
| Marxism | Materialism | A classless society achieved through collective action |
| Scholasticism | Synthesis | Harmonizing human reason with divine revelation |
| Pragmatism | Utility | Living by ideas that work and improve the world |
| Existentialism | Authenticity | Owning your choices with full responsibility |

---

## References directory

Load these reference files when the request goes deeper than the SKILL.md covers:

- `references/thinker-profiles.md` — Detailed profiles of all major and underrated thinkers
- `references/women-philosophers.md` — Extended profiles of women philosophers across all eras, with technical systems, lived context, and suppression history
- `references/rdg-analysis.md` — Extended Recursive Deterministic Governance framework, failure-mode taxonomy, and historical analogues
- `references/dilemma-matrix.md` — Full cross-reference of each of the 12 dilemmas against all philosophical traditions, including women philosophers' contributions
- `references/eastern-traditions.md` — Deep dive on Indian, Chinese, and Islamic Golden Age philosophies, including women sages
- `references/science-and-philosophy.md` — Full treatment of the scientific method, falsifiability, paradigm shifts, and quantum indeterminism as philosophical events
