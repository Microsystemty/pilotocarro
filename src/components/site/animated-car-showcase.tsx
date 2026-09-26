import { Gauge, ShieldCheck, Sparkles } from "lucide-react";
import sportSedan from "@/assets/hero-sport-sedan.png";

export function AnimatedCarShowcase() {
  return (
    <div className="car-showcase" aria-label="Experiência automotiva premium">
      <div className="car-showcase__glow" />
      <div className="car-showcase__badge">
        <Sparkles className="h-4 w-4" /> Seleção exclusiva
      </div>
      <div className="car-showcase__speed-lines" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <img
        src={sportSedan}
        className="car-showcase__vehicle"
        alt="Sedã esportivo premium vermelho em movimento"
      />
      <div className="car-showcase__reflection" aria-hidden="true" />

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
