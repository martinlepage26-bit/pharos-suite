const EMBLEM_CENTER = 384;

const polarPoint = (radius, angleDegrees) => {
  const radians = ((angleDegrees - 90) * Math.PI) / 180;

  return {
    x: EMBLEM_CENTER + Math.cos(radians) * radius,
    y: EMBLEM_CENTER + Math.sin(radians) * radius
  };
};

const buildRayPoints = (angleDegrees, innerRadius, outerRadius, innerSpread, outerSpread) => {
  const innerLeft = polarPoint(innerRadius, angleDegrees - innerSpread);
  const outerLeft = polarPoint(outerRadius, angleDegrees - outerSpread);
  const tip = polarPoint(outerRadius + 28, angleDegrees);
  const outerRight = polarPoint(outerRadius, angleDegrees + outerSpread);
  const innerRight = polarPoint(innerRadius, angleDegrees + innerSpread);

  return [
    `${innerLeft.x.toFixed(1)},${innerLeft.y.toFixed(1)}`,
    `${outerLeft.x.toFixed(1)},${outerLeft.y.toFixed(1)}`,
    `${tip.x.toFixed(1)},${tip.y.toFixed(1)}`,
    `${outerRight.x.toFixed(1)},${outerRight.y.toFixed(1)}`,
    `${innerRight.x.toFixed(1)},${innerRight.y.toFixed(1)}`
  ].join(' ');
};

const rays = Array.from({ length: 34 }, (_, index) => {
  const angle = (360 / 34) * index;
  const isPrimary = index % 2 === 0;

  return {
    angle,
    opacity: isPrimary ? 0.92 : 0.62,
    points: buildRayPoints(
      angle,
      isPrimary ? 142 : 156,
      isPrimary ? 274 : 242,
      isPrimary ? 3.2 : 2.2,
      isPrimary ? 1.2 : 0.92
    )
  };
});

const nodes = [
  { x: 384, y: 384, r: 18, core: true },
  { x: 384, y: 306, r: 10 },
  { x: 446, y: 328, r: 10 },
  { x: 476, y: 386, r: 10 },
  { x: 444, y: 450, r: 10 },
  { x: 384, y: 478, r: 10 },
  { x: 324, y: 450, r: 10 },
  { x: 292, y: 386, r: 10 },
  { x: 322, y: 328, r: 10 },
  { x: 384, y: 340, r: 9 },
  { x: 424, y: 360, r: 9 },
  { x: 424, y: 410, r: 9 },
  { x: 384, y: 430, r: 9 },
  { x: 344, y: 410, r: 9 },
  { x: 344, y: 360, r: 9 }
];

const links = [
  [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 1],
  [9, 10], [10, 11], [11, 12], [12, 13], [13, 14], [14, 9],
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8],
  [9, 1], [9, 2], [10, 2], [10, 3], [11, 3], [11, 4], [12, 4], [12, 5],
  [13, 5], [13, 6], [14, 6], [14, 7], [9, 8], [10, 0], [11, 0], [12, 0], [13, 0], [14, 0]
];

const stairWidths = [78, 116, 154, 192, 230, 268];

const HeroRadiantEmblem = ({ className = '' }) => (
  <svg
    className={className}
    viewBox="0 0 768 768"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <radialGradient id="hero-emblem-orb" cx="50%" cy="42%" r="62%">
        <stop offset="0%" stopColor="#f3fbff" />
        <stop offset="20%" stopColor="#cbeeff" />
        <stop offset="48%" stopColor="#7ccfff" />
        <stop offset="72%" stopColor="#2f7cf4" />
        <stop offset="100%" stopColor="#102045" />
      </radialGradient>
      <linearGradient id="hero-emblem-stroke" x1="140" y1="86" x2="628" y2="682" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#f0fbff" />
        <stop offset="28%" stopColor="#bde8ff" />
        <stop offset="56%" stopColor="#62bfff" />
        <stop offset="100%" stopColor="#1f56dc" />
      </linearGradient>
      <linearGradient id="hero-emblem-ray" x1="384" y1="196" x2="384" y2="88" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#c4e8ff" stopOpacity="0.12" />
        <stop offset="58%" stopColor="#d6f2ff" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#f8fdff" stopOpacity="1" />
      </linearGradient>
      <linearGradient id="hero-emblem-step" x1="384" y1="484" x2="384" y2="640" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#f1fbff" />
        <stop offset="46%" stopColor="#d1efff" />
        <stop offset="100%" stopColor="#67b8ff" />
      </linearGradient>
      <filter id="hero-emblem-glow" x="-25%" y="-25%" width="150%" height="150%">
        <feDropShadow dx="0" dy="0" stdDeviation="14" floodColor="#8fd7ff" floodOpacity="0.42" />
        <feDropShadow dx="0" dy="0" stdDeviation="26" floodColor="#235be8" floodOpacity="0.18" />
      </filter>
    </defs>

    <g filter="url(#hero-emblem-glow)">
      <circle cx="384" cy="384" r="338" fill="none" stroke="url(#hero-emblem-stroke)" strokeWidth="10" opacity="0.5" />
      <circle cx="384" cy="384" r="306" fill="none" stroke="url(#hero-emblem-stroke)" strokeWidth="12" opacity="0.4" />
      <circle cx="384" cy="384" r="274" fill="none" stroke="url(#hero-emblem-stroke)" strokeWidth="12" opacity="0.52" />
      <circle cx="384" cy="384" r="242" fill="none" stroke="url(#hero-emblem-stroke)" strokeWidth="10" opacity="0.48" />
      <circle cx="384" cy="384" r="210" fill="none" stroke="url(#hero-emblem-stroke)" strokeWidth="8" opacity="0.4" />

      {rays.map((ray) => (
        <polygon key={ray.angle} points={ray.points} fill="url(#hero-emblem-ray)" opacity={ray.opacity} />
      ))}

      <circle cx="384" cy="384" r="120" fill="url(#hero-emblem-orb)" opacity="0.2" />
      <circle cx="384" cy="384" r="92" fill="url(#hero-emblem-orb)" opacity="0.92" />
      <circle cx="384" cy="384" r="104" fill="none" stroke="url(#hero-emblem-stroke)" strokeWidth="7" opacity="0.54" />
      <circle cx="384" cy="384" r="136" fill="none" stroke="url(#hero-emblem-stroke)" strokeWidth="10" opacity="0.28" />

      <g stroke="url(#hero-emblem-stroke)" strokeWidth="4.5" strokeLinecap="round" opacity="0.5">
        {links.map(([fromIndex, toIndex]) => (
          <line
            key={`${fromIndex}-${toIndex}`}
            x1={nodes[fromIndex].x}
            y1={nodes[fromIndex].y}
            x2={nodes[toIndex].x}
            y2={nodes[toIndex].y}
          />
        ))}
      </g>

      <g>
        {nodes.map((node, index) => (
          <g key={`${node.x}-${node.y}-${index}`}>
            <circle cx={node.x} cy={node.y} r={node.r * 1.85} fill="#bfe8ff" opacity="0.18" />
            <circle cx={node.x} cy={node.y} r={node.r} fill={node.core ? '#f4fcff' : '#e5f7ff'} />
            <circle
              cx={node.x}
              cy={node.y}
              r={node.r}
              fill="none"
              stroke={node.core ? '#9fdcff' : '#7ccfff'}
              strokeWidth={node.core ? '3.5' : '2.4'}
              opacity="0.82"
            />
          </g>
        ))}
      </g>

      <path
        d="M334 448C350 438 366 432 384 432C402 432 418 438 434 448L454 612H314L334 448Z"
        fill="url(#hero-emblem-step)"
        opacity="0.92"
      />
      <path
        d="M346 468C358 460 370 456 384 456C398 456 410 460 422 468L434 596H334L346 468Z"
        fill="#183c8e"
        opacity="0.42"
      />

      {stairWidths.map((width, index) => (
        <rect
          key={width}
          x={384 - width / 2}
          y={500 + index * 28}
          width={width}
          height="16"
          rx="3"
          fill="url(#hero-emblem-step)"
          opacity={1 - index * 0.07}
        />
      ))}
    </g>
  </svg>
);

export default HeroRadiantEmblem;
