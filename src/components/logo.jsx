import logoBoraCoop from "../assets/logo-boracoop.png";

export default function Logo({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-14 w-14 overflow-hidden rounded-2xl border border-purple-400/20 bg-[#0b1020]">
        <img
          src={logoBoraCoop}
          alt="Logo da BoraCoop"
          className="h-full w-full object-cover"
        />
      </div>

      {!compact && (
        <div>
          <h1 className="text-xl font-black tracking-wide text-white">
            BoraCoop
          </h1>

          <p className="text-xs text-slate-500">
            Bora transformar influência em resultado?
          </p>
        </div>
      )}
    </div>
  );
}