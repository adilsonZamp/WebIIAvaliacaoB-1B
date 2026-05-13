import { useState, useEffect } from "react";

export interface Transacao {
  id: string | number;
  descricao: string;
  valor: number; // positivo = entrada, negativo = saída
  data: string;  // ISO string ou dd/mm/yyyy
  tipo: "entrada" | "saida";
}

interface ExtratoModalProps {
  onClose: () => void;
}

function formatarMoeda(valor: number): string {
  return Math.abs(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatarData(data: string): string {
  try {
    const d = new Date(data);
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return data;
  }
}

export default function ExtratoModal({ onClose }: ExtratoModalProps) {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExtrato = async () => {
      setLoading(true);
      setError("");
      try {
        // Substitua pela URL real da sua API
        const response = await fetch("/api/extrato");
        if (!response.ok) throw new Error("Não foi possível carregar o extrato.");
        const data: Transacao[] = await response.json();
        setTransacoes(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Erro inesperado.");
      } finally {
        setLoading(false);
      }
    };
    fetchExtrato();
  }, []);

  const totalEntradas = transacoes
    .filter((t) => t.tipo === "entrada")
    .reduce((acc, t) => acc + Math.abs(t.valor), 0);

  const totalSaidas = transacoes
    .filter((t) => t.tipo === "saida")
    .reduce((acc, t) => acc + Math.abs(t.valor), 0);

  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      style={{ background: "rgba(0,0,0,0.55)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div
          className="modal-content border-0 shadow-lg"
          style={{ borderRadius: 18 }}
        >
          {/* Header */}
          <div className="modal-header border-0 px-4 pt-4 pb-0">
            <div className="d-flex align-items-center gap-3">
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 11,
                  background: "#f0f4ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  color: "#3b5bdb",
                }}
              >
                <i className="bi bi-receipt" />
              </div>
              <div>
                <h5 className="fw-semibold mb-0" style={{ color: "#1a1a2e" }}>
                  Extrato Completo
                </h5>
                <p className="text-muted small mb-0">Histórico de todas as movimentações</p>
              </div>
            </div>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Fechar"
            />
          </div>

          {/* Resumo de totais */}
          {!loading && !error && transacoes.length > 0 && (
            <div className="px-4 pt-3 pb-1">
              <div className="row g-2">
                <div className="col-6">
                  <div
                    className="rounded-3 p-3"
                    style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}
                  >
                    <p className="small text-muted mb-0">Total de entradas</p>
                    <p
                      className="fw-bold mb-0 mt-1"
                      style={{ color: "#16a34a", fontSize: "1rem" }}
                    >
                      + {formatarMoeda(totalEntradas)}
                    </p>
                  </div>
                </div>
                <div className="col-6">
                  <div
                    className="rounded-3 p-3"
                    style={{ background: "#fff5f5", border: "1px solid #fecaca" }}
                  >
                    <p className="small text-muted mb-0">Total de saídas</p>
                    <p
                      className="fw-bold mb-0 mt-1"
                      style={{ color: "#dc2626", fontSize: "1rem" }}
                    >
                      − {formatarMoeda(totalSaidas)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Corpo */}
          <div className="modal-body px-4 py-3">
            {loading && (
              <div className="d-flex flex-column align-items-center py-5 text-muted">
                <span
                  className="spinner-border mb-3"
                  style={{ color: "#3b5bdb" }}
                />
                <p className="small mb-0">Carregando extrato...</p>
              </div>
            )}

            {error && (
              <div
                className="alert py-3 d-flex align-items-center gap-2"
                style={{
                  background: "#fff5f5",
                  border: "1px solid #fecaca",
                  color: "#dc2626",
                  borderRadius: 10,
                }}
              >
                <i className="bi bi-exclamation-circle-fill" />
                <span className="small">{error}</span>
              </div>
            )}

            {!loading && !error && transacoes.length === 0 && (
              <div className="text-center py-5 text-muted">
                <i className="bi bi-inbox" style={{ fontSize: 40, opacity: 0.3 }} />
                <p className="mt-3 small mb-0">Nenhuma transação encontrada.</p>
              </div>
            )}

            {!loading && !error && transacoes.length > 0 && (
              <div className="d-flex flex-column gap-2">
                {transacoes.map((t) => {
                  const isEntrada = t.tipo === "entrada";
                  return (
                    <div
                      key={t.id}
                      className="d-flex align-items-center justify-content-between p-3 rounded-3"
                      style={{
                        background: isEntrada ? "#f0fdf4" : "#fff9f9",
                        border: `1px solid ${isEntrada ? "#d1fae5" : "#fee2e2"}`,
                      }}
                    >
                      <div className="d-flex align-items-center gap-3">
                        {/* Ícone */}
                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: "50%",
                            background: isEntrada ? "#dcfce7" : "#fee2e2",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 16,
                            color: isEntrada ? "#16a34a" : "#dc2626",
                            flexShrink: 0,
                          }}
                        >
                          <i
                            className={`bi ${
                              isEntrada ? "bi-arrow-down-left" : "bi-arrow-up-right"
                            }`}
                          />
                        </div>

                        <div>
                          <p
                            className="fw-medium mb-0"
                            style={{ fontSize: "0.9rem", color: "#1a1a2e" }}
                          >
                            {t.descricao}
                          </p>
                          <p className="text-muted mb-0" style={{ fontSize: "0.78rem" }}>
                            {formatarData(t.data)}
                          </p>
                        </div>
                      </div>

                      {/* Valor */}
                      <span
                        className="fw-bold"
                        style={{
                          fontSize: "0.95rem",
                          color: isEntrada ? "#16a34a" : "#dc2626",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {isEntrada ? "+" : "−"} {formatarMoeda(t.valor)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer border-0 px-4 pb-4 pt-0">
            <button
              className="btn btn-outline-secondary px-4"
              onClick={onClose}
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}