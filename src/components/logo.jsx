import logoEquipeRR from "../assets/logo-equipe-rr.png";

export default function Logo({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-purple-400/20 bg-[#0b1020] shadow-lg shadow-purple-950/40">
        <img
          src={logoEquipeRR}
          alt="Logo da EQUIPE RR"
          className="h-full w-full object-cover"
        />
      </div>

      {!compact && (
        <div>
          <h1 className="text-xl font-black tracking-wide text-white">
            EQUIPE RR
          </h1>
          <p className="text-xs text-slate-500">
            Blogueiros e agentes
          </p>
        </div>
      )}
    </div>
  );
}