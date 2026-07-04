const palettes = [
  ["#22d3ee", "#a78bfa", "#f8fafc"],
  ["#14b8a6", "#f97316", "#fef3c7"],
  ["#38bdf8", "#f472b6", "#ecfeff"],
  ["#84cc16", "#06b6d4", "#f7fee7"],
  ["#f59e0b", "#818cf8", "#fff7ed"],
  ["#10b981", "#c084fc", "#f0fdf4"],
];

function pick(seed: number, index: number) {
  return palettes[(seed + index) % palettes.length];
}

export function ArticleIllustration({
  title,
  tags,
  seed,
  compact = false,
}: {
  title: string;
  tags: string[];
  seed: number;
  compact?: boolean;
}) {
  const gradientId = `visual-bg-${seed}-${tags.length}`;
  const [primary, secondary, paper] = pick(seed, tags.length);
  const variant = seed % 5;
  const xShift = (seed % 17) - 8;
  const yShift = (seed % 11) - 5;

  return (
    <div className={compact ? "cartoon-visual cartoon-visual-compact" : "cartoon-visual"}>
      <svg
        viewBox="0 0 360 220"
        role="img"
        aria-label={`${title} cartoon illustration`}
        className="h-full w-full"
      >
        <rect width="360" height="220" rx="18" fill={`url(#${gradientId})`} />
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={primary} stopOpacity="0.22" />
            <stop offset="55%" stopColor={secondary} stopOpacity="0.12" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path
          d="M42 168 C82 140 104 176 142 150 C176 126 198 150 232 132 C278 108 305 130 330 106"
          fill="none"
          stroke={primary}
          strokeWidth="8"
          strokeLinecap="round"
          opacity="0.52"
        />
        <rect x="48" y="42" width="118" height="96" rx="16" fill={paper} opacity="0.92" />
        <rect x="66" y="64" width="76" height="8" rx="4" fill={primary} opacity="0.8" />
        <rect x="66" y="84" width="54" height="8" rx="4" fill={secondary} opacity="0.75" />
        <rect x="66" y="104" width="82" height="8" rx="4" fill="currentColor" opacity="0.18" />

        <g transform={`translate(${188 + xShift} ${52 + yShift})`}>
          <circle cx="42" cy="38" r="28" fill={paper} />
          <path
            d="M20 37 C30 10 66 12 72 38 C62 28 42 32 20 37Z"
            fill={secondary}
            opacity="0.86"
          />
          <circle cx="34" cy="38" r="3.5" fill="#0f172a" />
          <circle cx="52" cy="38" r="3.5" fill="#0f172a" />
          <path d="M36 51 Q43 57 52 51" fill="none" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
          <path
            d="M18 90 C22 68 62 66 70 90 L78 148 L8 148 Z"
            fill={primary}
            opacity="0.9"
          />
          <path d="M22 94 L-2 122" stroke={paper} strokeWidth="11" strokeLinecap="round" />
          <path d="M68 94 L100 78" stroke={paper} strokeWidth="11" strokeLinecap="round" />
          <circle cx="102" cy="76" r="8" fill={secondary} />
        </g>

        <g opacity="0.78">
          {Array.from({ length: compact ? 3 : 5 }).map((_, index) => (
            <g key={index} transform={`translate(${238 + index * 20} ${150 - ((seed + index) % 4) * 12})`}>
              <circle r={variant + 5 + index} fill={index % 2 ? secondary : primary} opacity="0.2" />
              <circle r="3" fill={index % 2 ? secondary : primary} />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
