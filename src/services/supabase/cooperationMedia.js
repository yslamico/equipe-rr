import { supabase } from "../supabaseClient";

const BUCKET = "midias-cooperacoes";
const SIGNED_URL_SECONDS = 60 * 60;

function sanitizeFileName(value) {
  return String(value || "arquivo")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

function mapFromDatabase(row, signedUrl = "") {
  return {
    id: row.id,
    cooperacaoId: row.cooperacao_id,
    titulo: row.titulo || "",
    tipo: row.tipo || "imagem",
    arquivoPath: row.arquivo_path || "",
    url: signedUrl,
    criadoEm: row.created_at || "",
  };
}

export async function getMidiasCooperacaoSupabase(
  cooperacaoId,
) {
  const { data, error } = await supabase
    .from("cooperacao_midias")
    .select("*")
    .eq("cooperacao_id", cooperacaoId)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Erro ao buscar mídias da cooperação:",
      error,
    );
    throw error;
  }

  const rows = data || [];

  if (!rows.length) {
    return [];
  }

  const paths = rows.map(
    (item) => item.arquivo_path,
  );

  const {
    data: signedData,
    error: signedError,
  } = await supabase.storage
    .from(BUCKET)
    .createSignedUrls(
      paths,
      SIGNED_URL_SECONDS,
    );

  if (signedError) {
    console.error(
      "Erro ao gerar URLs das mídias:",
      signedError,
    );
    throw signedError;
  }

  return rows.map((row, index) =>
    mapFromDatabase(
      row,
      signedData?.[index]?.signedUrl || "",
    ),
  );
}

export async function uploadMidiasCooperacaoSupabase(
  cooperacaoId,
  files,
) {
  const uploaded = [];

  for (const file of files) {
    const safeName =
      sanitizeFileName(file.name);

    const uniquePart =
      typeof crypto !== "undefined" &&
      crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}`;

    const path =
      `${cooperacaoId}/${uniquePart}-${safeName}`;

    const tipo = file.type.startsWith(
      "video/",
    )
      ? "video"
      : "imagem";

    const {
      error: uploadError,
    } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType:
          file.type || undefined,
      });

    if (uploadError) {
      console.error(
        `Erro no upload de ${file.name}:`,
        uploadError,
      );
      throw uploadError;
    }

    const {
      data: row,
      error: insertError,
    } = await supabase
      .from("cooperacao_midias")
      .insert({
        cooperacao_id:
          cooperacaoId,
        titulo: file.name,
        tipo,
        arquivo_path: path,
        arquivo_url: null,
      })
      .select()
      .single();

    if (insertError) {
      await supabase.storage
        .from(BUCKET)
        .remove([path]);

      console.error(
        "Erro ao registrar mídia:",
        insertError,
      );
      throw insertError;
    }

    uploaded.push(row);
  }

  return uploaded;
}

export async function removeMidiaCooperacaoSupabase(
  midia,
) {
  const {
    error: storageError,
  } = await supabase.storage
    .from(BUCKET)
    .remove([midia.arquivoPath]);

  if (storageError) {
    console.error(
      "Erro ao excluir arquivo do Storage:",
      storageError,
    );
    throw storageError;
  }

  const { error } = await supabase
    .from("cooperacao_midias")
    .delete()
    .eq("id", midia.id);

  if (error) {
    console.error(
      "Erro ao excluir registro da mídia:",
      error,
    );
    throw error;
  }
}

export async function getDownloadUrlMidia(
  arquivoPath,
) {
  const { data, error } =
    await supabase.storage
      .from(BUCKET)
      .createSignedUrl(
        arquivoPath,
        60,
        {
          download: true,
        },
      );

  if (error) {
    console.error(
      "Erro ao gerar link de download:",
      error,
    );
    throw error;
  }

  return data?.signedUrl || "";
}