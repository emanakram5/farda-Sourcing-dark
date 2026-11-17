
import './Logo.css';

export default function Logo({ variant = 'dark', size = 30 }) {
  const fill = variant === 'light' ? '#FFFFFF' : '#111111';

  return (
    <span
      className={`logo logo--${variant}`}
      aria-label="Farda Sourcing"
    >
      <svg
        width={size}
        height={size * 1.08}
        viewBox="0 0 140 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Left vertical block */}
        <rect x="0" y="0" width="42" height="145" fill={fill} />

        {/* Top horizontal block */}
        <rect x="48" y="0" width="90" height="43" fill={fill} />

        {/* Middle square block */}
        <rect x="48" y="50" width="46" height="44" fill={fill} />

        {/* Green bottom-right square */}
        <rect x="94" y="100" width="44" height="44" fill="#70D900" />
      </svg>

      <span className="logo__text">
        <span className="logo__name">FARDA</span>
        <span className="logo__sub">SOURCING</span>
      </span>
    </span>
  );
}
