import { Gauge, ShieldCheck, Sparkles } from "lucide-react";

export function AnimatedCarShowcase() {
  return (
    <div className="car-showcase" aria-label="Experiência automotiva premium">
      <div className="car-showcase__glow" />
      <div className="car-showcase__badge">
        <Sparkles className="h-4 w-4" /> Seleção exclusiva
      </div>

      <svg
        viewBox="0 0 760 320"
        className="car-showcase__vehicle"
        role="img"
        aria-label="Ilustração animada de um automóvel esportivo"
      >
        <defs>
          <linearGradient id="carPaint" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ff4a45" />
            <stop offset="0.5" stopColor="#e51920" />
            <stop offset="1" stopColor="#7d0710" />
          </linearGradient>
          <linearGradient id="carGlass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#cce7ef" stopOpacity=".9" />
            <stop offset="1" stopColor="#1c2930" stopOpacity=".96" />
          </linearGradient>
          <filter id="carShadow" x="-20%" y="-20%" width="140%" height="160%">
            <feDropShadow dx="0" dy="16" stdDeviation="14" floodColor="#000" floodOpacity=".55" />
          </filter>
        </defs>

        <g className="car-showcase__body" filter="url(#carShadow)">
          <path
            d="M72 218c8-38 33-62 82-72l103-20 62-65c17-18 42-28 69-28h105c36 0 68 14 92 40l52 57 58 14c35 8 56 31 58 64l-4 22h-71c-5-48-35-76-78-76-45 0-75 29-80 76H267c-5-47-35-76-79-76-44 0-74 29-79 76H67z"
            fill="url(#carPaint)"
          />
          <path
            d="M283 120l56-57c11-11 28-18 46-18h42v75zm160 0V45h46c26 0 49 10 67 29l40 46z"
            fill="url(#carGlass)"
            stroke="#ffffff"
            strokeOpacity=".22"
            strokeWidth="3"
          />
          <path
            d="M91 177c107-13 197-22 270-25 114-5 215 0 315 18"
            fill="none"
            stroke="#ff8c86"
            strokeOpacity=".72"
            strokeWidth="4"
          />
          <path
            d="M104 218h553"
            fill="none"
            stroke="#57060b"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path d="M657 163l43 12 10 20h-54z" fill="#fff3cf" opacity=".92" />
          <path d="M85 181l55-13-11 29H78z" fill="#ff302e" />
          <rect x="386" y="139" width="45" height="5" rx="2.5" fill="#30070a" opacity=".8" />
        </g>

        {[188, 598].map((cx) => (
          <g key={cx} className="car-showcase__wheel">
            <circle cx={cx} cy="230" r="54" fill="#08090b" stroke="#2f3034" strokeWidth="7" />
            <circle cx={cx} cy="230" r="34" fill="#15171b" stroke="#90949b" strokeWidth="3" />
            {[0, 45, 90, 135].map((angle) => (
              <path
                key={angle}
                d={`M${cx - 29} 230h58M${cx} 201v58`}
                stroke="#b8bbc0"
                strokeWidth="5"
                strokeLinecap="round"
                transform={`rotate(${angle} ${cx} 230)`}
              />
            ))}
            <circle cx={cx} cy="230" r="9" fill="#e51d24" />
          </g>
        ))}
      </svg>

      <div className="car-showcase__road">
        <span />
        <span />
        <span />
      </div>

      <div className="car-showcase__stat car-showcase__stat--left">
        <Gauge className="h-5 w-5 text-primary" />
        <span>
          <strong>Performance</strong> que impressiona
        </span>
      </div>
      <div className="car-showcase__stat car-showcase__stat--right">
        <ShieldCheck className="h-5 w-5 text-primary" />
        <span>
          <strong>Procedência</strong> verificada
        </span>
      </div>
    </div>
  );
}
