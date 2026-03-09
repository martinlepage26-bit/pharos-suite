import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Play,
  Radar,
  RotateCcw,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

const BEST_SCORE_KEY = 'govern-ai-game-best-score';
const ROUND_SECONDS = 45;
const START_INTEGRITY = 3;
const MAX_INTEGRITY = 5;
const LANE_POSITIONS = [16.666, 50, 83.333];

const LANES = [
  {
    id: 'procurement',
    title: 'Procurement',
    shortTitle: 'Buyer review',
    description: 'Questionnaires, vendor packets, and buyer diligence.',
    icon: BriefcaseBusiness
  },
  {
    id: 'audit',
    title: 'Audit',
    shortTitle: 'Evidence review',
    description: 'Traceability, control evidence, and reconstruction requests.',
    icon: Radar
  },
  {
    id: 'oversight',
    title: 'Oversight',
    shortTitle: 'Executive review',
    description: 'Leadership briefings, escalations, and board review.',
    icon: Building2
  }
];

const TASK_TEMPLATES = [
  { title: 'Customer questionnaire', shortLabel: 'Questionnaire', laneIndex: 0 },
  { title: 'Vendor diligence packet', shortLabel: 'Vendor packet', laneIndex: 0, priority: true },
  { title: 'Procurement red flag', shortLabel: 'Red flag', laneIndex: 0 },
  { title: 'Control trace request', shortLabel: 'Trace request', laneIndex: 1 },
  { title: 'Evidence gap review', shortLabel: 'Evidence gap', laneIndex: 1, priority: true },
  { title: 'Audit replay demand', shortLabel: 'Replay demand', laneIndex: 1 },
  { title: 'Executive briefing', shortLabel: 'Briefing', laneIndex: 2 },
  { title: 'Board escalation', shortLabel: 'Board escalation', laneIndex: 2, priority: true },
  { title: 'Risk committee note', shortLabel: 'Risk note', laneIndex: 2 }
];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const readBestScore = () => {
  if (typeof window === 'undefined') {
    return 0;
  }

  try {
    const stored = Number(window.localStorage.getItem(BEST_SCORE_KEY) || 0);
    return Number.isFinite(stored) ? stored : 0;
  } catch (error) {
    return 0;
  }
};

const createBaseGameState = (phase, bestScore) => ({
  phase,
  laneIndex: 1,
  items: [],
  score: 0,
  integrity: START_INTEGRITY,
  combo: 0,
  cleared: 0,
  missed: 0,
  timeLeft: ROUND_SECONDS,
  bestScore,
  status: 'Route each incoming governance packet into the correct review lane.',
  resultTitle: '',
  resultBody: ''
});

const Game = () => {
  const [game, setGame] = useState(() => createBaseGameState('idle', readBestScore()));
  const boardRef = useRef(null);
  const animationRef = useRef(null);
  const elapsedRef = useRef(0);
  const spawnAccumulatorRef = useRef(0);
  const nextIdRef = useRef(0);

  const stopLoop = useCallback(() => {
    if (animationRef.current) {
      window.cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  const resetLoopState = useCallback(() => {
    elapsedRef.current = 0;
    spawnAccumulatorRef.current = 0;
    nextIdRef.current = 0;
  }, []);

  const buildTask = useCallback(() => {
    const elapsed = elapsedRef.current;
    const template = TASK_TEMPLATES[Math.floor(Math.random() * TASK_TEMPLATES.length)];
    nextIdRef.current += 1;

    return {
      id: nextIdRef.current,
      laneIndex: template.laneIndex,
      title: template.title,
      shortLabel: template.shortLabel,
      priority: Boolean(template.priority),
      y: -10,
      speed: 17 + Math.random() * 8 + Math.min(elapsed * 0.35, 9)
    };
  }, []);

  const moveLane = useCallback((targetIndex) => {
    setGame((current) => ({
      ...current,
      laneIndex: clamp(targetIndex, 0, LANES.length - 1)
    }));
  }, []);

  const shiftLane = useCallback((delta) => {
    setGame((current) => ({
      ...current,
      laneIndex: clamp(current.laneIndex + delta, 0, LANES.length - 1)
    }));
  }, []);

  const focusBoard = useCallback(() => {
    window.setTimeout(() => {
      boardRef.current?.focus();
    }, 0);
  }, []);

  const startGame = useCallback(() => {
    stopLoop();
    resetLoopState();
    setGame(createBaseGameState('running', Math.max(readBestScore(), game.bestScore)));
    focusBoard();
  }, [focusBoard, game.bestScore, resetLoopState, stopLoop]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key } = event;

      if (key === 'ArrowLeft' || key === 'a' || key === 'A') {
        event.preventDefault();
        shiftLane(-1);
        return;
      }

      if (key === 'ArrowRight' || key === 'd' || key === 'D') {
        event.preventDefault();
        shiftLane(1);
        return;
      }

      if (key === '1') {
        moveLane(0);
        return;
      }

      if (key === '2') {
        moveLane(1);
        return;
      }

      if (key === '3') {
        moveLane(2);
        return;
      }

      if (key === ' ' || key === 'Enter') {
        if (game.phase !== 'running') {
          event.preventDefault();
          startGame();
        }
        return;
      }

      if ((key === 'r' || key === 'R') && game.phase !== 'running') {
        event.preventDefault();
        startGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [game.phase, moveLane, shiftLane, startGame]);

  useEffect(() => {
    if (game.phase !== 'running') {
      return undefined;
    }

    let active = true;
    let lastFrame = window.performance.now();

    const tick = (now) => {
      if (!active) {
        return;
      }

      const delta = Math.min((now - lastFrame) / 1000, 0.05);
      lastFrame = now;
      elapsedRef.current += delta;
      spawnAccumulatorRef.current += delta;

      let shouldStop = false;

      setGame((current) => {
        const cadence = Math.max(0.4, 0.95 - Math.min(elapsedRef.current * 0.014, 0.48));
        let items = current.items.map((item) => ({
          ...item,
          y: item.y + item.speed * delta
        }));

        if (spawnAccumulatorRef.current >= cadence) {
          spawnAccumulatorRef.current = 0;
          items = [...items, buildTask()];
        }

        let score = current.score;
        let integrity = current.integrity;
        let combo = current.combo;
        let cleared = current.cleared;
        let missed = current.missed;
        let status = current.status;
        const survivors = [];

        items.forEach((item) => {
          if (item.y >= 86) {
            if (item.laneIndex === current.laneIndex) {
              score += 12 + combo * 2 + (item.priority ? 6 : 0);
              cleared += 1;
              combo += 1;
              status = `${item.shortLabel} routed into ${LANES[item.laneIndex].title}.`;

              if (combo > 0 && combo % 6 === 0 && integrity < MAX_INTEGRITY) {
                integrity += 1;
                status = 'Control discipline restored one point of system integrity.';
              }
            } else {
              integrity -= 1;
              missed += 1;
              combo = 0;
              status = `${item.shortLabel} slipped into the wrong review lane.`;
            }
          } else {
            survivors.push(item);
          }
        });

        const timeLeft = Math.max(0, current.timeLeft - delta);
        const bestScore = Math.max(current.bestScore, score);

        if (integrity <= 0) {
          shouldStop = true;
          return {
            ...current,
            phase: 'ended',
            items: survivors,
            score,
            integrity: 0,
            combo,
            cleared,
            missed,
            timeLeft,
            bestScore,
            status: 'Too many packets slipped past review.',
            resultTitle: 'Integrity failed',
            resultBody: 'The review line broke down before the shift ended. Re-run the lane logic and tighten the response.'
          };
        }

        if (timeLeft <= 0) {
          shouldStop = true;
          return {
            ...current,
            phase: 'ended',
            items: survivors,
            score,
            integrity,
            combo,
            cleared,
            missed,
            timeLeft: 0,
            bestScore,
            status: 'Shift complete. The review line held through the timer.',
            resultTitle: 'Shift complete',
            resultBody: 'You kept the governance surface legible until the clock ran out.'
          };
        }

        return {
          ...current,
          items: survivors,
          score,
          integrity,
          combo,
          cleared,
          missed,
          timeLeft,
          bestScore,
          status
        };
      });

      if (!shouldStop) {
        animationRef.current = window.requestAnimationFrame(tick);
      }
    };

    animationRef.current = window.requestAnimationFrame(tick);

    return () => {
      active = false;
      stopLoop();
    };
  }, [buildTask, game.phase, stopLoop]);

  useEffect(() => {
    if (game.phase === 'ended') {
      try {
        window.localStorage.setItem(BEST_SCORE_KEY, String(game.bestScore));
      } catch (error) {
        // Ignore storage failures and keep the local run playable.
      }
    }
  }, [game.bestScore, game.phase]);

  useEffect(() => () => stopLoop(), [stopLoop]);

  const accuracy = useMemo(() => {
    const attempts = game.cleared + game.missed;
    if (!attempts) {
      return 100;
    }

    return Math.round((game.cleared / attempts) * 100);
  }, [game.cleared, game.missed]);

  const integrityPips = Array.from({ length: MAX_INTEGRITY }, (_, index) => index < game.integrity);

  return (
    <div className="govern-game-page" data-testid="game-page">
      <section className="govern-game-page__hero">
        <div className="container">
          <div className="govern-game-page__hero-copy">
            <p className="eyebrow">Playable version</p>
            <h1>Governance Grid: hold the review line under pressure.</h1>
            <p className="body-lg">
              A browser-playable mini-game built from the same site logic: incoming packets hit the system fast, and you
              keep governance legible by routing each one into the right review lane.
            </p>
            <div className="hero-cta-row">
              <button type="button" className="btn-primary" onClick={startGame} data-testid="game-start-btn">
                Start run
                <Play size={16} />
              </button>
              <Link to="/services" className="btn-secondary">
                View services
              </Link>
              <Link to="/connect" className="btn-outline">
                Book a debrief
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section govern-game-page__section">
        <div className="container">
          <div className="govern-game">
            <aside className="govern-game__sidebar">
              <div className="govern-game__panel">
                <p className="eyebrow">Mission logic</p>
                <h2>Route what arrives before pressure outruns the controls.</h2>
                <p className="body-sm">
                  Move left or right with the arrow keys or A / D. Match each incoming governance packet to the correct
                  lane: Procurement, Audit, or Oversight. Miss too many and system integrity collapses.
                </p>
              </div>

              <div className="govern-game__stats" data-testid="game-stats">
                <article className="govern-game__stat">
                  <span>Score</span>
                  <strong data-testid="game-score">{game.score}</strong>
                </article>
                <article className="govern-game__stat">
                  <span>Best run</span>
                  <strong>{game.bestScore}</strong>
                </article>
                <article className="govern-game__stat">
                  <span>Combo</span>
                  <strong>{game.combo}</strong>
                </article>
                <article className="govern-game__stat">
                  <span>Accuracy</span>
                  <strong>{accuracy}%</strong>
                </article>
              </div>

              <div className="govern-game__panel govern-game__panel--compact">
                <div className="govern-game__integrity">
                  <div>
                    <p className="eyebrow">Integrity</p>
                    <strong>{game.integrity} / {MAX_INTEGRITY}</strong>
                  </div>
                  <div className="govern-game__integrity-pips" aria-label={`Integrity ${game.integrity} out of ${MAX_INTEGRITY}`}>
                    {integrityPips.map((active, index) => (
                      <span key={index} className={active ? 'is-active' : ''} />
                    ))}
                  </div>
                </div>

                <div className="govern-game__timer">
                  <TimerBadge timeLeft={game.timeLeft} />
                </div>
              </div>

              <div className="govern-game__panel govern-game__panel--compact">
                <p className="eyebrow">Lane map</p>
                <div className="govern-game__lane-guide">
                  {LANES.map((lane) => {
                    const Icon = lane.icon;
                    return (
                      <article key={lane.id} className={`govern-game__lane-guide-card govern-game__lane-guide-card--${lane.id}`}>
                        <div className="govern-game__lane-guide-head">
                          <Icon size={16} />
                          <strong>{lane.title}</strong>
                        </div>
                        <p>{lane.description}</p>
                      </article>
                    );
                  })}
                </div>
              </div>

              <div className="govern-game__panel govern-game__panel--compact">
                <p className="eyebrow">Run status</p>
                <p className="govern-game__status" data-testid="game-status">{game.status}</p>
                <div className="govern-game__sidebar-actions">
                  <button type="button" className="btn-secondary" onClick={startGame}>
                    {game.phase === 'running' ? 'Restart run' : 'Play again'}
                    <RotateCcw size={16} />
                  </button>
                </div>
              </div>
            </aside>

            <div className="govern-game__board-shell">
              <div className="govern-game__lane-header">
                {LANES.map((lane, index) => {
                  const Icon = lane.icon;
                  return (
                    <div
                      key={lane.id}
                      className={`govern-game__lane-label govern-game__lane-label--${lane.id}${game.laneIndex === index ? ' is-active' : ''}`}
                    >
                      <Icon size={16} />
                      <div>
                        <strong>{lane.title}</strong>
                        <span>{lane.shortTitle}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div
                ref={boardRef}
                className="govern-game__board"
                tabIndex="0"
                role="application"
                aria-label="Governance routing game board"
                data-testid="game-board"
              >
                <div className="govern-game__gridlines" />

                {LANES.map((lane, index) => (
                  <div
                    key={lane.id}
                    className={`govern-game__lane-column govern-game__lane-column--${lane.id}${game.laneIndex === index ? ' is-active' : ''}`}
                    style={{ left: `${index * 33.333}%` }}
                  />
                ))}

                <div className="govern-game__judgment-line">
                  <span>Review line</span>
                </div>

                {game.items.map((item) => (
                  <article
                    key={item.id}
                    className={`govern-game__packet govern-game__packet--${LANES[item.laneIndex].id}${item.priority ? ' is-priority' : ''}`}
                    style={{ left: `${LANE_POSITIONS[item.laneIndex]}%`, top: `${item.y}%` }}
                  >
                    <span>{item.shortLabel}</span>
                    {item.priority ? <strong>Hot</strong> : null}
                  </article>
                ))}

                <div
                  className={`govern-game__player govern-game__player--${LANES[game.laneIndex].id}`}
                  style={{ left: `${LANE_POSITIONS[game.laneIndex]}%` }}
                  data-testid="game-player"
                >
                  <ShieldCheck size={18} />
                  <div>
                    <strong>PHAROS</strong>
                    <span>{LANES[game.laneIndex].title}</span>
                  </div>
                </div>

                {game.phase !== 'running' ? (
                  <div className="govern-game__overlay">
                    <div className="govern-game__overlay-card">
                      {game.phase === 'idle' ? (
                        <>
                          <p className="eyebrow">Ready state</p>
                          <h3>Stabilize the packet flow.</h3>
                          <p>
                            Keep the correct lane under your beacon, route packets cleanly, and hold integrity through the
                            full shift.
                          </p>
                          <button type="button" className="btn-primary" onClick={startGame}>
                            Start run
                            <Play size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <p className="eyebrow">Run complete</p>
                          <h3>{game.resultTitle}</h3>
                          <p>{game.resultBody}</p>
                          <div className="govern-game__overlay-summary">
                            <article>
                              <span>Score</span>
                              <strong>{game.score}</strong>
                            </article>
                            <article>
                              <span>Cleared</span>
                              <strong>{game.cleared}</strong>
                            </article>
                            <article>
                              <span>Missed</span>
                              <strong>{game.missed}</strong>
                            </article>
                          </div>
                          <div className="govern-game__overlay-actions">
                            <button type="button" className="btn-primary" onClick={startGame} data-testid="game-restart-btn">
                              Play again
                              <RotateCcw size={16} />
                            </button>
                            <Link to="/connect" className="btn-secondary">
                              Turn this into a real engagement
                            </Link>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="govern-game__controls" data-testid="game-controls">
                {LANES.map((lane, index) => {
                  const Icon = lane.icon;
                  return (
                    <button
                      key={lane.id}
                      type="button"
                      className={`govern-game__control govern-game__control--${lane.id}${game.laneIndex === index ? ' is-active' : ''}`}
                      onClick={() => moveLane(index)}
                      data-testid={`game-lane-${lane.id}`}
                    >
                      <Icon size={16} />
                      {lane.title}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="govern-game__meta">
            <article className="govern-game__meta-card">
              <Sparkles size={18} />
              <div>
                <strong>Why this fits the site</strong>
                <p>The game turns the same brand promise into a mechanic: legibility under pressure, not theatre after the fact.</p>
              </div>
            </article>
            <article className="govern-game__meta-card">
              <ShieldCheck size={18} />
              <div>
                <strong>Keyboard controls</strong>
                <p>Use Left / Right or A / D to move, 1 / 2 / 3 to jump lanes, and Space or Enter to start a new run.</p>
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
};

const TimerBadge = ({ timeLeft }) => (
  <div className="govern-game__timer-badge">
    <span>Time left</span>
    <strong>{timeLeft.toFixed(1)}s</strong>
  </div>
);

export default Game;
