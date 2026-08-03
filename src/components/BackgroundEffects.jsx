export default function BackgroundEffects() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#050816]">
      <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl animate-pulse" />
      <div className="absolute right-[-120px] top-[15%] h-96 w-96 rounded-full bg-fuchsia-600/15 blur-3xl animate-pulse" />
      <div className="absolute bottom-[-140px] left-[30%] h-[420px] w-[420px] rounded-full bg-purple-600/15 blur-3xl animate-pulse" />

      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
        }}
      />
    </div>
  );
}