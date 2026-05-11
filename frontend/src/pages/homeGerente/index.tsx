import { useEffect, useState } from "react";
import CadastrarClienteModal from "../../components/CadastrarClienteModal";
import CriarContaCorrenteModal from "../../components/CriarContaCorrenteModal";

// Dados do gerente logado — substitua pelo contexto de autenticação real
interface Gerente {
  nome: string;
  agencia: string;
  avatar?: string;
}

const gerenteLogado: Gerente = {
  nome: "Carlos Mendes",
  agencia: "0042",
};

type ModalAberto = "cadastrarCliente" | "criarConta" | null;

export default function HomeGerente() {
  const [modalAberto, setModalAberto] = useState<ModalAberto>(null);
  const [toast, setToast] = useState<{ msg: string; tipo: "success" | "danger" } | null>(null);

  const abrirModal = (modal: ModalAberto) => setModalAberto(modal);
  const fecharModal = () => setModalAberto(null);

  const showToast = (msg: string, tipo: "success" | "danger") => {
    setToast({ msg, tipo });
    setTimeout(() => setToast(null), 3500);
  };
    
  useEffect(() => {
    document.title = 'Home - Gerente';
  });

  const iniciais = gerenteLogado.nome
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f8" }}>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg bg-white border-bottom shadow-sm px-4 py-2">
        <div className="container-fluid px-0">
          <a className="navbar-brand d-flex align-items-center gap-2 fw-semibold" href="#">
            <div
              className="d-flex align-items-center justify-content-center bg-primary text-white"
              style={{ width: 34, height: 34, borderRadius: 8, fontSize: 16 }}
            >
              <i className="bi bi-bank2" />
            </div>
            BancoApp
          </a>

          <div className="d-flex align-items-center gap-3 ms-auto">
            <span className="text-muted small d-none d-md-block">
              Agência {gerenteLogado.agencia}
            </span>
            <div className="d-flex align-items-center gap-2">
              <div
                className="d-flex align-items-center justify-content-center bg-primary text-white fw-semibold"
                style={{ width: 36, height: 36, borderRadius: "50%", fontSize: 13 }}
              >
                {iniciais}
              </div>
              <span className="small fw-medium d-none d-sm-block">{gerenteLogado.nome}</span>
            </div>
            <button className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1">
              <i className="bi bi-box-arrow-right" />
              <span className="d-none d-sm-inline">Sair</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Conteúdo principal */}
      <div className="container py-5">
        {/* Cabeçalho de boas-vindas */}
        <div className="mb-5">
          <h1 className="h3 fw-semibold mb-1">
            Olá, {gerenteLogado.nome.split(" ")[0]} 👋
          </h1>
          <p className="text-muted mb-0">
            Painel do gerente · Agência {gerenteLogado.agencia}
          </p>
        </div>

        {/* Cards de ação rápida */}
        <div className="row g-4 mb-5">
          <div className="col-12 col-sm-6 col-lg-4">
            <div
              className="card border-0 shadow-sm h-100"
              style={{ borderRadius: 16, cursor: "pointer", transition: "transform 0.15s, box-shadow 0.15s" }}
              onClick={() => abrirModal("cadastrarCliente")}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "";
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && abrirModal("cadastrarCliente")}
              aria-label="Cadastrar novo cliente"
            >
              <div className="card-body p-4">
                <div
                  className="d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary mb-3"
                  style={{ width: 52, height: 52, borderRadius: 12, fontSize: 24 }}
                >
                  <i className="bi bi-person-plus-fill" />
                </div>
                <h5 className="fw-semibold mb-1">Cadastrar Cliente</h5>
                <p className="text-muted small mb-3">
                  Registre um novo cliente com dados pessoais e endereço.
                </p>
                <span className="btn btn-primary btn-sm px-3 d-inline-flex align-items-center gap-2">
                  <i className="bi bi-plus-lg" />
                  Cadastrar
                </span>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-4">
            <div
              className="card border-0 shadow-sm h-100"
              style={{ borderRadius: 16, cursor: "pointer", transition: "transform 0.15s, box-shadow 0.15s" }}
              onClick={() => abrirModal("criarConta")}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "";
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && abrirModal("criarConta")}
              aria-label="Criar nova conta corrente"
            >
              <div className="card-body p-4">
                <div
                  className="d-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success mb-3"
                  style={{ width: 52, height: 52, borderRadius: 12, fontSize: 24 }}
                >
                  <i className="bi bi-credit-card-2-front-fill" />
                </div>
                <h5 className="fw-semibold mb-1">Criar Conta Corrente</h5>
                <p className="text-muted small mb-3">
                  Abra uma conta corrente e vincule a um cliente cadastrado.
                </p>
                <span className="btn btn-success btn-sm px-3 d-inline-flex align-items-center gap-2">
                  <i className="bi bi-plus-lg" />
                  Criar Conta
                </span>
              </div>
            </div>
          </div>

          {/* Card informativo — exemplo de extensão futura */}
          <div className="col-12 col-sm-6 col-lg-4">
            <div
              className="card border-0 shadow-sm h-100"
              style={{ borderRadius: 16, background: "linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)" }}
            >
              <div className="card-body p-4 text-white">
                <div
                  className="d-flex align-items-center justify-content-center mb-3"
                  style={{ width: 52, height: 52, borderRadius: 12, background: "rgba(255,255,255,0.2)", fontSize: 24 }}
                >
                  <i className="bi bi-graph-up-arrow" />
                </div>
                <h5 className="fw-semibold mb-1">Visão Geral</h5>
                <p className="mb-0" style={{ opacity: 0.85, fontSize: "0.875rem" }}>
                  Gerencie clientes e contas da sua agência com facilidade e segurança.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Seção de atalhos */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: 16 }}>
          <div className="card-body p-4">
            <h6 className="fw-semibold text-muted text-uppercase small mb-3">
              Ações rápidas
            </h6>
            <div className="d-flex flex-wrap gap-2">
              <button
                className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2"
                onClick={() => abrirModal("cadastrarCliente")}
              >
                <i className="bi bi-person-plus" />
                Novo cliente
              </button>
              <button
                className="btn btn-outline-success btn-sm d-flex align-items-center gap-2"
                onClick={() => abrirModal("criarConta")}
              >
                <i className="bi bi-bank" />
                Nova conta corrente
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modais */}
      {modalAberto === "cadastrarCliente" && (
        <CadastrarClienteModal
          onClose={fecharModal}
          onSuccess={() => showToast("Cliente cadastrado com sucesso!", "success")}
        />
      )}
      {modalAberto === "criarConta" && (
        <CriarContaCorrenteModal
          onClose={fecharModal}
          onSuccess={() => showToast("Conta corrente criada com sucesso!", "success")}
        />
      )}

      {/* Toast de feedback */}
      {toast && (
        <div
          className={`toast show position-fixed bottom-0 end-0 m-4 text-white bg-${toast.tipo} border-0`}
          role="alert"
          style={{ borderRadius: 12, zIndex: 9999, minWidth: 280 }}
        >
          <div className="toast-body d-flex align-items-center gap-2">
            <i className={`bi bi-${toast.tipo === "success" ? "check-circle-fill" : "x-circle-fill"}`} />
            {toast.msg}
          </div>
        </div>
      )}
    </div>
  );
}