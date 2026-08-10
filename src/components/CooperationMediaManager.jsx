import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Download,
  Film,
  Image as ImageIcon,
  Images,
  LoaderCircle,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";

import {
  getDownloadUrlMidia,
  getMidiasCooperacaoSupabase,
  removeMidiaCooperacaoSupabase,
  uploadMidiasCooperacaoSupabase,
} from "../services/supabase/cooperationMedia";

function formatSize(bytes) {
  if (!Number.isFinite(bytes)) {
    return "";
  }

  if (bytes < 1024 * 1024) {
    return `${Math.max(
      1,
      Math.round(bytes / 1024),
    )} KB`;
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(1)} MB`;
}

export default function CooperationMediaManager({
  cooperacaoId,
}) {
  const [midias, setMidias] =
    useState([]);
  const [arquivos, setArquivos] =
    useState([]);
  const [loading, setLoading] =
    useState(true);
  const [uploading, setUploading] =
    useState(false);
  const [erro, setErro] =
    useState("");
  const [mensagem, setMensagem] =
    useState("");

  const previews = useMemo(
    () =>
      arquivos.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      })),
    [arquivos],
  );

  useEffect(() => {
    return () => {
      previews.forEach((item) =>
        URL.revokeObjectURL(item.url),
      );
    };
  }, [previews]);

  async function carregar() {
    if (!cooperacaoId) {
      setMidias([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setErro("");

      const data =
        await getMidiasCooperacaoSupabase(
          cooperacaoId,
        );

      setMidias(data || []);
    } catch (error) {
      console.error(error);
      setErro(
        error?.message ||
          "Não foi possível carregar as mídias.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, [cooperacaoId]);

  function selecionarArquivos(event) {
    const selecionados = Array.from(
      event.target.files || [],
    ).filter(
      (file) =>
        file.type.startsWith("image/") ||
        file.type.startsWith("video/"),
    );

    setArquivos((current) => [
      ...current,
      ...selecionados,
    ]);

    setErro("");
    setMensagem("");

    event.target.value = "";
  }

  function removerSelecionado(index) {
    setArquivos((current) =>
      current.filter(
        (_, itemIndex) =>
          itemIndex !== index,
      ),
    );
  }

  async function enviarTodos() {
    if (!arquivos.length) {
      return;
    }

    try {
      setUploading(true);
      setErro("");
      setMensagem("");

      await uploadMidiasCooperacaoSupabase(
        cooperacaoId,
        arquivos,
      );

      const total = arquivos.length;

      setArquivos([]);
      await carregar();

      setMensagem(
        `${total} mídia(s) enviada(s) com sucesso.`,
      );
    } catch (error) {
      console.error(error);
      setErro(
        error?.message ||
          "Não foi possível enviar as mídias.",
      );
    } finally {
      setUploading(false);
    }
  }

  async function excluir(midia) {
    const confirmar = window.confirm(
      `Excluir "${midia.titulo || "mídia"}"?`,
    );

    if (!confirmar) {
      return;
    }

    try {
      setErro("");
      setMensagem("");

      await removeMidiaCooperacaoSupabase(
        midia,
      );

      setMidias((current) =>
        current.filter(
          (item) => item.id !== midia.id,
        ),
      );

      setMensagem("Mídia excluída.");
    } catch (error) {
      console.error(error);
      setErro(
        error?.message ||
          "Não foi possível excluir.",
      );
    }
  }

  async function baixar(midia) {
    try {
      setErro("");

      const url =
        await getDownloadUrlMidia(
          midia.arquivoPath,
        );

      if (!url) {
        throw new Error(
          "Link de download indisponível.",
        );
      }

      window.open(
        url,
        "_blank",
        "noopener,noreferrer",
      );
    } catch (error) {
      console.error(error);
      setErro(
        error?.message ||
          "Não foi possível baixar.",
      );
    }
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-[#0b1020]/90 p-4 shadow-xl backdrop-blur-xl sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-fuchsia-300">
            Materiais
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white">
            Mídias da plataforma
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Selecione várias fotos e vídeos de uma vez. No celular,
            este botão abre sua galeria/arquivos.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1.5 text-xs font-semibold text-purple-200">
          <Images size={15} />
          {midias.length} mídia(s)
        </div>
      </div>

      <div className="mt-5 rounded-3xl border border-dashed border-purple-400/30 bg-[#070b18] p-4 sm:p-6">
        <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/[0.02] px-4 text-center transition hover:bg-white/[0.04]">
          <UploadCloud
            size={32}
            className="text-purple-300"
          />

          <strong className="mt-3 text-white">
            Selecionar da galeria / arquivos
          </strong>

          <span className="mt-1 text-xs text-slate-500">
            Fotos e vídeos • pode selecionar vários de uma vez
          </span>

          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={selecionarArquivos}
            className="hidden"
          />
        </label>

        {arquivos.length > 0 && (
          <>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {previews.map(
                ({ file, url }, index) => {
                  const isVideo =
                    file.type.startsWith(
                      "video/",
                    );

                  return (
                    <div
                      key={`${file.name}-${index}`}
                      className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]"
                    >
                      <div className="relative aspect-video overflow-hidden bg-black/30">
                        {isVideo ? (
                          <video
                            src={url}
                            className="h-full w-full object-cover"
                            muted
                            playsInline
                          />
                        ) : (
                          <img
                            src={url}
                            alt={file.name}
                            className="h-full w-full object-cover"
                          />
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            removerSelecionado(
                              index,
                            )
                          }
                          className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-xl bg-black/70 text-white backdrop-blur"
                          aria-label="Remover seleção"
                        >
                          <X size={17} />
                        </button>
                      </div>

                      <div className="p-3">
                        <div className="flex items-center gap-2">
                          {isVideo ? (
                            <Film
                              size={16}
                              className="shrink-0 text-fuchsia-300"
                            />
                          ) : (
                            <ImageIcon
                              size={16}
                              className="shrink-0 text-purple-300"
                            />
                          )}

                          <p className="min-w-0 flex-1 truncate text-sm font-semibold text-white">
                            {file.name}
                          </p>
                        </div>

                        <p className="mt-1 text-xs text-slate-500">
                          {formatSize(
                            file.size,
                          )}
                        </p>
                      </div>
                    </div>
                  );
                },
              )}
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-400">
                {arquivos.length} arquivo(s) selecionado(s)
              </p>

              <button
                type="button"
                onClick={enviarTodos}
                disabled={uploading}
                className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 px-5 font-bold text-white shadow-lg shadow-purple-950/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {uploading ? (
                  <LoaderCircle
                    size={19}
                    className="animate-spin"
                  />
                ) : (
                  <UploadCloud size={19} />
                )}

                {uploading
                  ? "Enviando..."
                  : "Enviar todas"}
              </button>
            </div>
          </>
        )}
      </div>

      {(erro || mensagem) && (
        <div
          className={[
            "mt-4 rounded-2xl border p-4 text-sm",
            erro
              ? "border-red-500/20 bg-red-500/10 text-red-300"
              : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
          ].join(" ")}
        >
          {erro || mensagem}
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-lg font-black text-white">
          Arquivos enviados
        </h3>

        {loading ? (
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
            <LoaderCircle
              size={18}
              className="animate-spin"
            />
            Carregando mídias...
          </div>
        ) : midias.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-center text-sm text-slate-500">
            Nenhuma mídia enviada ainda.
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {midias.map((midia) => (
              <article
                key={midia.id}
                className="overflow-hidden rounded-3xl border border-white/10 bg-[#070b18]"
              >
                <div className="aspect-video overflow-hidden bg-black/30">
                  {midia.tipo ===
                  "video" ? (
                    <video
                      src={midia.url}
                      controls
                      playsInline
                      preload="metadata"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <img
                      src={midia.url}
                      alt={
                        midia.titulo ||
                        "Mídia da cooperação"
                      }
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-2">
                    {midia.tipo ===
                    "video" ? (
                      <Film
                        size={17}
                        className="shrink-0 text-fuchsia-300"
                      />
                    ) : (
                      <ImageIcon
                        size={17}
                        className="shrink-0 text-purple-300"
                      />
                    )}

                    <p className="min-w-0 flex-1 truncate text-sm font-semibold text-white">
                      {midia.titulo ||
                        "Arquivo"}
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        baixar(midia)
                      }
                      className="flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 text-xs font-semibold text-slate-300 hover:bg-white/[0.06]"
                    >
                      <Download
                        size={16}
                      />
                      Baixar
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        excluir(midia)
                      }
                      className="flex min-h-10 items-center justify-center gap-2 rounded-xl border border-red-500/15 bg-red-500/10 px-3 text-xs font-semibold text-red-300 hover:bg-red-500/15"
                    >
                      <Trash2
                        size={16}
                      />
                      Excluir
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <p className="mt-5 text-xs leading-5 text-slate-600">
        Dica: vídeos maiores podem demorar mais no celular. Para arquivos
        grandes, mantenha a tela aberta até o envio terminar.
      </p>
    </section>
  );
}