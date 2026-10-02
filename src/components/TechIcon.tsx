const glyphs: Record<
  string,
  (props: { className?: string }) => React.ReactElement
> = {
  react: ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="2.1" fill="currentColor" />
      <ellipse cx="12" cy="12" rx="9.5" ry="3.7" stroke="currentColor" strokeWidth="1.2" />
      <ellipse cx="12" cy="12" rx="9.5" ry="3.7" stroke="currentColor" strokeWidth="1.2" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9.5" ry="3.7" stroke="currentColor" strokeWidth="1.2" transform="rotate(120 12 12)" />
    </svg>
  ),
  next: ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9.4" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8.6 15.6V8.4l6.8 9.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  django: ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4 5h7.4v9.2H4z" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4 16.4h5.2M6.2 16.4v2.4M4 20h4.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M13.2 7.2h7.2M13.2 12h7.2M13.2 16.8h4.6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  laravel: ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 4 21 19H3z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M12 9.4 17.2 19H6.8z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M4.6 19 12 9.4 19.4 19" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" opacity="0.55" />
    </svg>
  ),
  node: ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 2.8 20 7.4v9.2L12 21.2 4 16.6V7.4z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M9.4 14.6 12 13l2.6 1.6v3.2L12 19.4l-2.6-1.6z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" opacity="0.7" />
    </svg>
  ),
  typescript: ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M6.6 11h4.2M8.7 11v6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="m13.4 17 2.6-6 2.6 6M14.4 14.6h3.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  javascript: ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M10.6 11.2c0-1.4-2.6-1.8-2.6-.2 0 1.9 2.6 1.4 2.6 3.6 0 1.9-2.9 1.8-3.1.1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M13.8 11.6v4.4c0 1.9 2.8 1.8 2.9.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  tailwind: ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M3 12c1.4-2.8 2.9-4.2 4.4-4.2 2.2 0 2.9 2.8 5.1 2.8 1.5 0 2.5-1.4 3.9-4.2.4 2.8 1.3 4.2 2.6 4.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.9 16c1.4-2.8 2.9-4.2 4.4-4.2 2.2 0 2.9 2.8 5.1 2.8 1.5 0 2.5-1.4 3.9-4.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
    </svg>
  ),
  bootstrap: ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8.2 7.4h3.6c2.6 0 2.6 3.6 0 3.6H8.2zm0 3.6h4.1c2.9 0 2.9 4.4 0 4.4H8.2z" stroke="currentColor" strokeWidth="1.15" strokeLinejoin="round" />
      <path d="M14.4 15.4h3.4" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" />
    </svg>
  ),
  ai: ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="6.5" y="6.5" width="11" height="11" rx="3" stroke="currentColor" strokeWidth="1.2" />
      <rect x="10" y="10" width="4" height="4" rx="1" fill="currentColor" opacity="0.8" />
      <path d="M10 3.2v3.3M14 3.2v3.3M10 17.5v3.3M14 17.5v3.3M3.2 10h3.3M3.2 14h3.3M17.5 10h3.3M17.5 14h3.3" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" />
    </svg>
  ),
};

export default function TechIcon({
  id,
  className = "h-5 w-5",
}: {
  id: string;
  className?: string;
}) {
  const Glyph = glyphs[id];
  if (!Glyph) return null;
  return <Glyph className={className} />;
}