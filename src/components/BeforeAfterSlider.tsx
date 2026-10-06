import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BeforeAfterSliderProps {
  before: string;
  after: string;
  alt: string;
}

export default function BeforeAfterSlider({ before, after, alt }: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(0); // 0 = full before, 100 = full after
  const [dragging, setDragging] = useState(false);

  const updateFromClientX = (clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  };

  return (
    <div
      ref={containerRef}
      role="slider"
      aria-label={`${alt} before and after comparison`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(position)}
      aria-valuetext={`${Math.round(position)}% after, ${100 - Math.round(position)}% before`}
      tabIndex={0}
      className="group relative aspect-[3/4] w-full cursor-ew-resize touch-none select-none overflow-hidden rounded-2xl border border-border bg-card focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        setDragging(true);
        updateFromClientX(e.clientX);
      }}
      onPointerMove={(e) => dragging && updateFromClientX(e.clientX)}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
      onKeyDown={(e) => {
        if (["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) e.preventDefault();
        if (e.key === "ArrowRight") setPosition((p) => Math.min(100, p + 5));
        if (e.key === "ArrowLeft") setPosition((p) => Math.max(0, p - 5));
        if (e.key === "Home") setPosition(0);
        if (e.key === "End") setPosition(100);
      }}
    >
      {/* Before (base layer) */}
      <img
        src={before}
        alt={`${alt} — before`}
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* After (revealed as the handle moves right) */}
      <img
        src={after}
        alt={`${alt} — after`}
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      />

      {/* Labels */}
      <span className={`pointer-events-none absolute left-3 top-3 rounded-full bg-background/70 px-3 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur transition-colors ${position > 50 ? "text-primary" : "text-muted-foreground"}`}>
        After
      </span>
      <span className={`pointer-events-none absolute right-3 top-3 rounded-full bg-background/70 px-3 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur transition-colors ${position <= 50 ? "text-primary" : "text-muted-foreground"}`}>
        Before
      </span>

      {/* Divider + handle */}
      <div
        className="pointer-events-none absolute inset-y-0 w-0.5 bg-primary shadow-[var(--shadow-glow)]"
        style={{ left: `${position}%` }}
      >
        <div
          className={`absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-0.5 rounded-full border border-primary bg-background text-primary transition-transform ${
            dragging ? "scale-110" : "group-hover:scale-105"
          }`}
        >
          <ChevronLeft className="h-4 w-4" />
          <ChevronRight className="h-4 w-4 -ml-1" />
        </div>
      </div>
    </div>
  );
}
