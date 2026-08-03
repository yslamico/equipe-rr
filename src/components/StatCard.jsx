export default function StatCard({
  titulo,
  valor,
  cor = "purple",
  icone,
}) {
  const colors = {
    purple:
      "from-purple-600 to-fuchsia-500 shadow-purple-900/40",

    blue:
      "from-blue-600 to-cyan-500 shadow-blue-900/40",

    green:
      "from-emerald-600 to-green-500 shadow-green-900/40",

    orange:
      "from-orange-500 to-yellow-500 shadow-orange-900/40",
  };

  return (
    <div className="rounded-3xl bg-[#0b1020] border border-white/10 p-6 hover:border-purple-500/30 transition">

      <div className="flex justify-between items-center">

        <div>

          <p className="text-slate-400 text-sm">
            {titulo}
          </p>

          <h2 className="text-3xl font-bold text-white mt-3">
            {valor}
          </h2>

        </div>

        <div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colors[cor]} flex items-center justify-center shadow-lg`}
        >
          {icone}
        </div>

      </div>

    </div>
  );
}