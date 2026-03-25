import { useId } from 'react';

const latitudes = [752, 710, 666, 620, 574, 528, 484, 442];
const meridians = [148, 278, 412, 552, 700, 800, 900, 1048, 1188, 1322, 1452];
const stars = [
  { x: 146, y: 120, r: 1.25, o: 0.7 },
  { x: 262, y: 186, r: 1.1, o: 0.54 },
  { x: 332, y: 108, r: 1.55, o: 0.82 },
  { x: 456, y: 164, r: 1.05, o: 0.6 },
  { x: 518, y: 88, r: 1.35, o: 0.74 },
  { x: 642, y: 148, r: 1.25, o: 0.62 },
  { x: 744, y: 102, r: 1.65, o: 0.86 },
  { x: 838, y: 176, r: 1.1, o: 0.58 },
  { x: 926, y: 120, r: 1.25, o: 0.62 },
  { x: 1034, y: 84, r: 1.5, o: 0.78 },
  { x: 1128, y: 146, r: 1.1, o: 0.56 },
  { x: 1242, y: 110, r: 1.35, o: 0.68 },
  { x: 1348, y: 182, r: 1.05, o: 0.54 },
  { x: 1414, y: 98, r: 1.4, o: 0.72 },
  { x: 219, y: 250, r: 1, o: 0.46 },
  { x: 407, y: 274, r: 1.2, o: 0.52 },
  { x: 675, y: 236, r: 1, o: 0.4 },
  { x: 958, y: 264, r: 1.25, o: 0.5 },
  { x: 1216, y: 244, r: 1, o: 0.42 },
  { x: 1468, y: 230, r: 1.2, o: 0.48 }
];

const MeridianField = ({ className = '', variant = 'hero' }) => {
  const id = useId().replace(/:/g, '');
  const goldId = `meridian-gold-${id}`;
  const goldGlowId = `meridian-gold-glow-${id}`;
  const goldSpecularId = `meridian-gold-specular-${id}`;
  const tealId = `meridian-teal-${id}`;
  const starId = `meridian-star-${id}`;

  return (
    <svg
      className={`meridian-field meridian-field--${variant} ${className}`.trim()}
      viewBox="0 0 1600 900"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={goldId} x1="0" y1="0" x2="1600" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#8b6118" stopOpacity="0" />
          <stop offset="0.16" stopColor="#ac7720" stopOpacity="0.76" />
          <stop offset="0.34" stopColor="#f2c969" stopOpacity="0.96" />
          <stop offset="0.5" stopColor="#fff8de" stopOpacity="1" />
          <stop offset="0.66" stopColor="#f0be52" stopOpacity="0.96" />
          <stop offset="0.84" stopColor="#b77d21" stopOpacity="0.76" />
          <stop offset="1" stopColor="#8b6118" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={goldGlowId} x1="0" y1="0" x2="1600" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f4ce73" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff0bc" stopOpacity="0.48" />
          <stop offset="1" stopColor="#f4ce73" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={goldSpecularId} x1="0" y1="0" x2="1600" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fffdf4" stopOpacity="0" />
          <stop offset="0.36" stopColor="#fff4cb" stopOpacity="0.18" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.96" />
          <stop offset="0.64" stopColor="#fff0b7" stopOpacity="0.24" />
          <stop offset="1" stopColor="#fffdf4" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={tealId} x1="800" y1="190" x2="800" y2="900" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#8da4ff" stopOpacity="0.46" />
          <stop offset="0.54" stopColor="#6ccfd6" stopOpacity="0.22" />
          <stop offset="1" stopColor="#6ccfd6" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={starId} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(0.5 0.5) scale(0.5)">
          <stop stopColor="#fff8e4" />
          <stop offset="0.42" stopColor="#f9da8a" stopOpacity="0.92" />
          <stop offset="1" stopColor="#8ec4ff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g opacity="0.95">
        {stars.map((star, index) => (
          <g key={`star-${star.x}-${star.y}`}>
            <circle cx={star.x} cy={star.y} r={star.r * 4.8} fill={`url(#${starId})`} opacity={star.o * 0.18} />
            <circle cx={star.x} cy={star.y} r={star.r} fill="#fff8e4" opacity={star.o} />
            {index % 4 === 0 ? (
              <path
                d={`M${star.x} ${star.y - 5.5}V${star.y + 5.5}M${star.x - 5.5} ${star.y}H${star.x + 5.5}`}
                stroke="#f7da90"
                strokeWidth="0.5"
                strokeLinecap="round"
                opacity={star.o * 0.45}
              />
            ) : null}
          </g>
        ))}
      </g>

      <g opacity="0.76">
        {latitudes.map((y, index) => {
          const shoulderLift = 176 - index * 8;
          const apexLift = 272 - index * 16;
          const latitudePath = `M-220 ${y}C122 ${y - shoulderLift} 474 ${y - apexLift} 800 ${y - apexLift}C1126 ${y - apexLift} 1478 ${y - shoulderLift} 1820 ${y}`;

          return (
            <g key={`lat-${y}`}>
              <path
                d={latitudePath}
                stroke={`url(#${goldGlowId})`}
                strokeWidth={index < 2 ? 4 : 3}
                strokeOpacity={index < 2 ? 0.44 : 0.28}
              />
              <path
                d={latitudePath}
                stroke={`url(#${goldId})`}
                strokeWidth={index < 2 ? 1.5 : 1.18}
                strokeOpacity={index < 2 ? 0.98 : 0.78}
              />
              <path
                d={latitudePath}
                stroke={`url(#${goldSpecularId})`}
                strokeWidth={index < 2 ? 0.54 : 0.4}
                strokeOpacity={index < 2 ? 0.82 : 0.58}
                strokeLinecap="round"
              />
            </g>
          );
        })}

        {meridians.map((x) => {
          const offset = (x - 800) * 0.36;
          const topOffset = (x - 800) * 0.12;
          const meridianPath = `M${x} 1050C${x + offset} 820 ${x + offset * 1.18} 214 ${x + topOffset} -126`;

          return (
            <g key={`mer-${x}`}>
              <path
                d={meridianPath}
                stroke={`url(#${goldGlowId})`}
                strokeWidth="2.7"
                strokeOpacity="0.24"
              />
              <path
                d={meridianPath}
                stroke={`url(#${goldId})`}
                strokeWidth="1.14"
                strokeOpacity="0.72"
              />
              <path
                d={meridianPath}
                stroke={`url(#${goldSpecularId})`}
                strokeWidth="0.34"
                strokeOpacity="0.62"
                strokeLinecap="round"
              />
            </g>
          );
        })}

        <path
          d="M800 900C800 776 800 638 800 118"
          stroke={`url(#${tealId})`}
          strokeWidth="1.4"
          strokeOpacity="0.54"
        />
      </g>
    </svg>
  );
};

export default MeridianField;
