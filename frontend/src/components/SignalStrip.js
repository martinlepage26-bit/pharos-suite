const SignalStrip = ({ items, className = '' }) => (
  <div className={`signal-grid ${className}`.trim()}>
    {items.map((item) => (
      <div key={`${item.label}-${item.title}`} className="signal-card">
        <p className="signal-label">{item.label}</p>
        <p className="signal-title">{item.title}</p>
        <p className="signal-body">{item.description}</p>
      </div>
    ))}
  </div>
);

export default SignalStrip;
