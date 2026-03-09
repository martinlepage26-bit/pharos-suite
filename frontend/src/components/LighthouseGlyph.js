const LighthouseGlyph = ({ className = '', title = 'PHAROS observability mark' }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden={title ? undefined : true} role={title ? 'img' : 'presentation'}>
    {title ? <title>{title}</title> : null}
    <defs>
      <linearGradient id="govern-gem-gradient" x1="24" y1="15.2" x2="24" y2="22.8" gradientUnits="userSpaceOnUse">
        <stop stopColor="#D9E4FF" />
        <stop offset="0.52" stopColor="#7D96DE" />
        <stop offset="1" stopColor="#7162BE" />
      </linearGradient>
      <radialGradient id="govern-iris-gradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(24 24) rotate(90) scale(8.5)">
        <stop stopColor="#D7E1FF" stopOpacity="0.95" />
        <stop offset="1" stopColor="#8978D8" stopOpacity="0.12" />
      </radialGradient>
      <linearGradient id="govern-beam-gradient" x1="24" y1="8" x2="24" y2="37.5" gradientUnits="userSpaceOnUse">
        <stop stopColor="currentColor" stopOpacity="0.72" />
        <stop offset="1" stopColor="currentColor" stopOpacity="0.22" />
      </linearGradient>
    </defs>

    <path d="M24 2.8L45.2 24L24 45.2L2.8 24L24 2.8Z" stroke="currentColor" strokeWidth="1.75" opacity="0.78" />
    <path d="M7.25 24C12.18 17.08 17.72 13.62 24 13.62C30.28 13.62 35.82 17.08 40.75 24C35.82 30.92 30.28 34.38 24 34.38C17.72 34.38 12.18 30.92 7.25 24Z" stroke="currentColor" strokeWidth="1.7" opacity="0.94" />
    <path d="M12.8 24C16.35 19.35 20.08 17.02 24 17.02C27.92 17.02 31.65 19.35 35.2 24C31.65 28.65 27.92 30.98 24 30.98C20.08 30.98 16.35 28.65 12.8 24Z" stroke="currentColor" strokeWidth="1.05" opacity="0.28" />
    <circle cx="24" cy="24" r="4.3" stroke="url(#govern-iris-gradient)" strokeWidth="1.2" opacity="0.9" />

    <path d="M23.95 8.8V15.2" stroke="url(#govern-beam-gradient)" strokeWidth="1.25" strokeLinecap="round" />
    <path d="M17.15 18.1L10.2 15.25" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" opacity="0.3" />
    <path d="M30.85 18.1L37.8 15.25" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" opacity="0.3" />
    <path d="M16.15 23.45L8.95 22.8" stroke="currentColor" strokeWidth="1.05" strokeLinecap="round" opacity="0.22" />
    <path d="M31.85 23.45L39.05 22.8" stroke="currentColor" strokeWidth="1.05" strokeLinecap="round" opacity="0.22" />

    <path d="M21.4 20.2L24 16.15L26.6 20.2" stroke="currentColor" strokeWidth="1.45" strokeLinejoin="round" fill="currentColor" fillOpacity="0.06" />
    <path d="M20.95 20.2H27.05L28.45 37.2H19.55L20.95 20.2Z" stroke="currentColor" strokeWidth="1.45" fill="currentColor" fillOpacity="0.07" />
    <path d="M20.1 37.2H27.9" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" />
    <path d="M18.9 40.15H29.1" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" />
    <path d="M24 20.2V37.2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity="0.22" />

    <path d="M24 15.5L26.2 17.75L24 20.2L21.8 17.75L24 15.5Z" fill="url(#govern-gem-gradient)" stroke="#E7ECFF" strokeWidth="0.5" />
    <path d="M24 22.25L24.9 23.2L24 24.15L23.1 23.2L24 22.25Z" fill="#C9952F" fillOpacity="0.88" />
  </svg>
);

export default LighthouseGlyph;
