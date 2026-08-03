import { supabase } from "../supabaseClient";

export async function entrarComEmail({
  email,
  senha,
}) {
  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

  if (error) {
    throw error;
  }

  return data;
}

export async function cadastrarUsuario({
  nome,
  email,
  senha,
  role = "blogueiro",
}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password: senha,
    options: {
      data: {
        nome,
        role,
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function sair() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

export async function getSessao() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return session;
}

export async function getUsuarioAtual() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  return user;
}

export async function getPerfilAtual() {
  const user = await getUsuarioAtual();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function enviarRecuperacaoSenha(email) {
  const redirectTo = `${window.location.origin}/redefinir-senha`;

  const { data, error } =
    await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo,
      },
    );

  if (error) {
    throw error;
  }

  return data;
}

export function observarAutenticacao(callback) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(
    (event, session) => {
      callback(event, session);
    },
  );

  return () => {
    subscription.unsubscribe();
  };
}