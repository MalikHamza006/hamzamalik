export default function Background() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 max-w-full overflow-hidden bg-ink-950 [contain:paint]"
    >
      <div className="absolute inset-0 grid-lines fade-mask-y opacity-70" />

      <div className="absolute -top-[22rem] left-1/2 h-[52rem] w-[52rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(127,29,29,0.30),rgba(127,29,29,0.07)_42%,transparent_68%)] blur-[80px]" />

      <div className="absolute top-[38%] -left-[18rem] h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(153,27,27,0.20),transparent_65%)] blur-[90px]" />

      <div className="absolute top-[72%] -right-[16rem] h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(185,28,28,0.16),transparent_66%)] blur-[90px]" />

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />

      <div className="noise absolute inset-0 opacity-[0.028] mix-blend-overlay" />
    </div>
  );
}