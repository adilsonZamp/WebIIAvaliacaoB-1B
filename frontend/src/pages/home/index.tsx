import React, { useState, Component, useEffect } from 'react'
import { Client, removeToken } from '../../../api/api';
import ExtratoModal, { type Transacao } from '../../components/cliente/ExtratoModal';
import TransferirModal from '../../components/cliente/TransacaoModal';
import { useNavigate } from 'react-router-dom';
import { getDataUser, removeDataUser } from '../../services/UserService';

// Dados do cliente logado — substituir por contexto
interface Cliente {
    id: number,
    nome: string;
    agencia: string;
    conta: string;
    digito: string;
}

const clienteLogado: Cliente = {
    id: 0,
    nome: "",
    agencia: "",
    conta: "",
    digito: "",
};

type ModalAberto = "extrato" | "transferir" | null;

function formatarMoeda(valor: number): string {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatarData(data: string): string {
    try {
        return new Date(data).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
        });
    } catch {
        return data;
    }
}

export default function ClienteHomePage() {
    const [saldo, setSaldo] = useState<number | null>(null);
    const [saldoVisivel, setSaldoVisivel] = useState(true);
    const [transacoes, setTransacoes] = useState<Transacao[]>([]);
    const [loadingDados, setLoadingDados] = useState(true);
    const [modalAberto, setModalAberto] = useState<ModalAberto>(null);
    const [toast, setToast] = useState<{ msg: string; tipo: "success" | "danger" } | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Home - Cliente';
		if (!getDataUser()) {
			navigate('/');
		} else {
            console.log(getDataUser().toString());
            console.log(JSON.stringify(getDataUser()));
            
			clienteLogado.nome = getDataUser().nome;
			console.log(getDataUser().toString());
		}

        const atualizaDadosCliente = async () => {
            setLoadingDados(true);
            try {
                const id = clienteLogado.id;
                var response;
                await response = Client.get('listarTransacoesCliente/{id}');
                setSaldo(response.data.saldo);
                // setTransacoes(response.data.tra.slice(0, 5));
            } catch {
                // Dados não carregados — UI lida com null/[]
            } finally {
                setLoadingDados(false);
            }
        };
        atualizaDadosCliente();
    }, []);

    const showToast = (msg: string, tipo: "success" | "danger") => {
        setToast({ msg, tipo });
        setTimeout(() => setToast(null), 4000);
    };

    const iniciais = clienteLogado.nome
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase();

    const saudacao = () => {
        const h = new Date().getHours();
        if (h < 12) return "Bom dia";
        if (h < 18) return "Boa tarde";
        return "Boa noite";
    };

    function logout() {
		Client.post('/logout');
		removeDataUser();
		removeToken();
		navigate('/');
	}

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(160deg, #f0f4ff 0%, #f8fafc 100%)",
                fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
            }}
        >
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
						BanIF
					</a>

					<div className="d-flex align-items-center gap-3 ms-auto">
						<span className="text-muted small d-none d-md-block">
							Agência {clienteLogado.agencia}
						</span>
						<div className="d-flex align-items-center gap-2">
							<div
								className="d-flex align-items-center justify-content-center bg-primary text-white fw-semibold"
								style={{ width: 36, height: 36, borderRadius: "50%", fontSize: 13 }}
							>
								{clienteLogado.nome.charAt(0).toUpperCase()}
							</div>
							<span className="small fw-medium d-none d-sm-block">{clienteLogado.nome}</span>
						</div>
						<button className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1" onClick={logout}>
							<i className="bi bi-box-arrow-right" />
							<span className="d-none d-sm-inline">Sair</span>
						</button>
					</div>
				</div>
			</nav>

            {/* ── Conteúdo ── */}
            <div className="container py-4" style={{ maxWidth: 640 }}>
                {/* Saudação */}
                <p className="text-muted small mb-1 mt-2">
                    {saudacao()}, {clienteLogado.nome.split(" ")[0]} 👋
                </p>

                {/* ── Card de saldo ── */}
                <div
                    className="mb-4 p-4"
                    style={{
                        background: "linear-gradient(135deg, #3b5bdb 0%, #1d3fb5 100%)",
                        borderRadius: 20,
                        color: "#fff",
                        boxShadow: "0 12px 32px rgba(59,91,219,0.28)",
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    {/* Círculo decorativo */}
                    <div
                        style={{
                            position: "absolute",
                            top: -40,
                            right: -40,
                            width: 160,
                            height: 160,
                            borderRadius: "50%",
                            background: "rgba(255,255,255,0.07)",
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            bottom: -30,
                            right: 60,
                            width: 100,
                            height: 100,
                            borderRadius: "50%",
                            background: "rgba(255,255,255,0.05)",
                        }}
                    />

                    <div className="d-flex justify-content-between align-items-start mb-1">
                        <div>
                            <p style={{ opacity: 0.75, fontSize: "0.8rem", margin: 0 }}>
                                Conta {clienteLogado.conta}-{clienteLogado.digito} · Ag {clienteLogado.agencia}
                            </p>
                            <p style={{ opacity: 0.75, fontSize: "0.8rem", margin: 0 }}>
                                Saldo disponível
                            </p>
                        </div>
                        <button
                            onClick={() => setSaldoVisivel((v) => !v)}
                            style={{
                                background: "rgba(255,255,255,0.15)",
                                border: "none",
                                borderRadius: 8,
                                color: "#fff",
                                padding: "5px 10px",
                                cursor: "pointer",
                                fontSize: 15,
                            }}
                            aria-label={saldoVisivel ? "Ocultar saldo" : "Mostrar saldo"}
                        >
                            <i className={`bi ${saldoVisivel ? "bi-eye-slash" : "bi-eye"}`} />
                        </button>
                    </div>

                    <div className="mt-2 mb-3">
                        {loadingDados ? (
                            <div
                                style={{
                                    height: 38,
                                    width: 180,
                                    borderRadius: 8,
                                    background: "rgba(255,255,255,0.15)",
                                    animation: "pulse 1.5s infinite",
                                }}
                            />
                        ) : saldoVisivel ? (
                            <p style={{ fontSize: "2rem", fontWeight: 700, margin: 0, letterSpacing: "-0.5px" }}>
                                {saldo !== null ? formatarMoeda(saldo) : "—"}
                            </p>
                        ) : (
                            <p style={{ fontSize: "2rem", fontWeight: 700, margin: 0, letterSpacing: "4px" }}>
                                ••••••
                            </p>
                        )}
                    </div>
                </div>

                {/* ── Ações rápidas ── */}
                <div className="row g-2 mb-4">
                    <div className="col-4">
                        <button
                            className="w-100 d-flex flex-column align-items-center justify-content-center gap-2 py-3 px-1"
                            style={{
                                background: "#fff",
                                border: "1px solid #e8edf5",
                                borderRadius: 14,
                                cursor: "pointer",
                                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                                transition: "box-shadow 0.15s, transform 0.15s",
                                color: "#3b5bdb",
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 16px rgba(59,91,219,0.18)";
                                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)";
                                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                            }}
                            onClick={() => setModalAberto("transferir")}
                        >
                            <span
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 12,
                                    background: "#eff2ff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 18,
                                }}
                            >
                                <i className="bi bi-send" />
                            </span>
                            <span style={{ fontSize: "0.75rem", fontWeight: 500, color: "#374151" }}>
                                Transferir
                            </span>
                        </button>
                    </div>

                    <div className="col-4">
                        <button
                            className="w-100 d-flex flex-column align-items-center justify-content-center gap-2 py-3 px-1"
                            style={{
                                background: "#fff",
                                border: "1px solid #e8edf5",
                                borderRadius: 14,
                                cursor: "pointer",
                                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                                transition: "box-shadow 0.15s, transform 0.15s",
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)";
                                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)";
                                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                            }}
                            onClick={() => setModalAberto("extrato")}
                        >
                            <span
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 12,
                                    background: "#f0fdf4",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 18,
                                    color: "#16a34a",
                                }}
                            >
                                <i className="bi bi-receipt" />
                            </span>
                            <span style={{ fontSize: "0.75rem", fontWeight: 500, color: "#374151" }}>
                                Extrato
                            </span>
                        </button>
                    </div>

                    <div className="col-4">
                        <button
                            className="w-100 d-flex flex-column align-items-center justify-content-center gap-2 py-3 px-1"
                            style={{
                                background: "#fff",
                                border: "1px solid #e8edf5",
                                borderRadius: 14,
                                cursor: "pointer",
                                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                                transition: "box-shadow 0.15s, transform 0.15s",
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)";
                                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)";
                                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                            }}
                            //navigate para a tela de investimentos
                            onClick={() => alert("Navegar para tela de aplicações")}
                        >
                            <span
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 12,
                                    background: "#fefce8",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 18,
                                    color: "#ca8a04",
                                }}
                            >
                                <i className="bi bi-graph-up-arrow" />
                            </span>
                            <span style={{ fontSize: "0.75rem", fontWeight: 500, color: "#374151" }}>
                                Aplicações
                            </span>
                        </button>
                    </div>
                </div>

                {/* ── Últimas transações (resumo) ── */}
                <div
                    style={{
                        background: "#fff",
                        borderRadius: 18,
                        border: "1px solid #e8edf5",
                        overflow: "hidden",
                        boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
                    }}
                >
                    <div className="d-flex align-items-center justify-content-between px-4 pt-4 pb-2">
                        <p className="fw-semibold mb-0" style={{ color: "#1a1a2e", fontSize: "0.95rem" }}>
                            Últimas movimentações
                        </p>
                        <button
                            className="btn btn-sm"
                            style={{
                                color: "#3b5bdb",
                                fontSize: "0.8rem",
                                fontWeight: 500,
                                padding: "3px 10px",
                                border: "1px solid #dde3f8",
                                borderRadius: 8,
                                background: "#f0f3ff",
                            }}
                            onClick={() => setModalAberto("extrato")}
                        >
                            Ver tudo
                        </button>
                    </div>

                    {loadingDados && (
                        <div className="px-4 pb-4 d-flex flex-column gap-2">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    style={{
                                        height: 52,
                                        borderRadius: 10,
                                        background: "#f3f4f6",
                                        animation: "pulse 1.5s infinite",
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    {!loadingDados && transacoes.length === 0 && (
                        <div className="text-center py-5 text-muted">
                            <i className="bi bi-inbox" style={{ fontSize: 36, opacity: 0.25 }} />
                            <p className="small mt-2 mb-0">Nenhuma transação recente.</p>
                        </div>
                    )}

                    {!loadingDados && transacoes.length > 0 && (
                        <div className="px-3 pb-3">
                            {transacoes.map((t, idx) => {
                                const isEntrada = t.tipo === "entrada";
                                return (
                                    <div
                                        key={t.id}
                                        className="d-flex align-items-center justify-content-between px-2 py-2"
                                        style={{
                                            borderBottom: idx < transacoes.length - 1 ? "1px solid #f3f4f6" : "none",
                                        }}
                                    >
                                        <div className="d-flex align-items-center gap-3">
                                            <div
                                                style={{
                                                    width: 36,
                                                    height: 36,
                                                    borderRadius: "50%",
                                                    background: isEntrada ? "#f0fdf4" : "#fff9f9",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontSize: 15,
                                                    color: isEntrada ? "#16a34a" : "#dc2626",
                                                    flexShrink: 0,
                                                }}
                                            >
                                                <i
                                                    className={`bi ${isEntrada ? "bi-arrow-down-left" : "bi-arrow-up-right"
                                                        }`}
                                                />
                                            </div>
                                            <div>
                                                <p
                                                    className="mb-0"
                                                    style={{
                                                        fontSize: "0.85rem",
                                                        fontWeight: 500,
                                                        color: "#1a1a2e",
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        maxWidth: 180,
                                                    }}
                                                >
                                                    {t.descricao}
                                                </p>
                                                <p className="mb-0" style={{ fontSize: "0.73rem", color: "#9ca3af" }}>
                                                    {formatarData(t.data)}
                                                </p>
                                            </div>
                                        </div>

                                        <span
                                            style={{
                                                fontSize: "0.88rem",
                                                fontWeight: 600,
                                                color: isEntrada ? "#16a34a" : "#dc2626",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {isEntrada ? "+" : "−"}{" "}
                                            {Math.abs(t.valor).toLocaleString("pt-BR", {
                                                style: "currency",
                                                currency: "BRL",
                                            })}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Modais ── */}
            {modalAberto === "extrato" && (
                <ExtratoModal onClose={() => setModalAberto(null)} />
            )}
            {modalAberto === "transferir" && (
                <TransferirModal
                    onClose={() => setModalAberto(null)}
                    onSuccess={(msg) => showToast(msg, "success")}
                />
            )}

            {/* ── Toast ── */}
            {toast && (
                <div
                    role="alert"
                    style={{
                        position: "fixed",
                        bottom: 24,
                        right: 24,
                        zIndex: 9999,
                        background: toast.tipo === "success" ? "#16a34a" : "#dc2626",
                        color: "#fff",
                        borderRadius: 12,
                        padding: "12px 18px",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        minWidth: 260,
                        animation: "slideUp 0.25s ease",
                    }}
                >
                    <i
                        className={`bi ${toast.tipo === "success" ? "bi-check-circle-fill" : "bi-x-circle-fill"
                            }`}
                    />
                    {toast.msg}
                </div>
            )}

            <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes slideUp {
          from { transform: translateY(16px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
        </div>
    );
}