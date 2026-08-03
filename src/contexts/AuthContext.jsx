import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getPerfilAtual,
  getSessao,
  observarAutenticacao,
  sair,
} from "../services/supabase/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ativo = true;

    async function carregarSessao() {
      try {
        const sessaoAtual = await getSessao();

        if (!ativo) return;

        setSession(sessaoAtual);

        if (sessaoAtual?.user) {
          const perfilAtual = await getPerfilAtual();

          if (!ativo) return;

          setPerfil(perfilAtual);
        } else {
          setPerfil(null);
        }
      } catch (error) {
        console.error(
          "Erro ao carregar autenticação:",
          error,
        );

        if (ativo) {
          setSession(null);
          setPerfil(null);
        }
      } finally {
        if (ativo) {
          setLoading(false);
        }
      }
    }

    carregarSessao();

    const pararObservacao = observarAutenticacao(
      async (_event, novaSessao) => {
        setSession(novaSessao);

        if (novaSessao?.user) {
          try {
            const perfilAtual = await getPerfilAtual();
            setPerfil(perfilAtual);
          } catch (error) {
            console.error(
              "Erro ao buscar perfil:",
              error,
            );

            setPerfil(null);
          }
        } else {
          setPerfil(null);
        }

        setLoading(false);
      },
    );

    return () => {
      ativo = false;
      pararObservacao();
    };
  }, []);

  async function refreshPerfil() {
    if (!session?.user) {
      setPerfil(null);
      return null;
    }

    const perfilAtual = await getPerfilAtual();
    setPerfil(perfilAtual);

    return perfilAtual;
  }

  async function logout() {
    await sair();
    setSession(null);
    setPerfil(null);
  }

  const value = useMemo(
    () => ({
      session,
      user: session?.user || null,
      perfil,
      loading,
      isAuthenticated: Boolean(session?.user),
      isAdmin: perfil?.role === "admin",
      isBlogueiro: perfil?.role === "blogueiro",
      refreshPerfil,
      logout,
    }),
    [session, perfil, loading],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth deve ser usado dentro de AuthProvider.",
    );
  }

  return context;
}