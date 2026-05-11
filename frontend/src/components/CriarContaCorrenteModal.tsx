import { useState, useEffect, type FormEvent } from "react";

interface Cliente {
  id: string | number;
  nomeCompleto: string;
  cpf: string;
}

interface CriarContaCorrenteModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface ContaForm {
  numeroConta: string;
  numeroAgencia: string;
  saldo: string;
  clienteId: string;
}

const initialForm: ContaForm = {
  numeroConta: "",
  numeroAgencia: "",
  saldo: "",
  clienteId: "",
};

export default function CriarContaCorrenteModal({
  onClose,
  onSuccess,
}: CriarContaCorrenteModalProps) {
  const [form, setForm] = useState<ContaForm>(initialForm);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loadingClientes, setLoadingClientes] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Busca os clientes cadastrados na API
  useEffect(() => {
    const fetchClientes = async () => {
      setLoadingClientes(true);
      try {
        // Substitua pela URL real da sua API
        const response = await fetch("/api/clientes");
        if (!response.ok) throw new Error("Erro ao buscar clientes.");
        const data: Cliente[] = await response.json();
        setClientes(data);
      } catch {
        setError("Não foi possível carregar a lista de clientes.");
      } finally {
        setLoadingClientes(false);
      }
    };
    fetchClientes();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const { numeroConta, numeroAgencia, saldo, clienteId } = form;
    if (!numeroConta || !numeroAgencia || !saldo || !clienteId) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    const saldoNum = parseFloat(saldo.replace(",", "."));
    if (isNaN(saldoNum) || saldoNum < 0) {
      setError("Saldo inválido. Informe um valor numérico positivo.");
      return;
    }

    setLoading(true);
    try {
      // Substitua pela URL real da sua API
      const response = await fetch("/api/contas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          numeroConta,
          numeroAgencia,
          saldo: saldoNum,
          clienteId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Erro ao criar conta corrente.");
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  const formatCPFDisplay = (cpf: string) =>
    cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");

  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-dialog modal-md modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: 16 }}>
          <div className="modal-header border-0 pb-0 px-4 pt-4">
            <div className="d-flex align-items-center gap-3">
              <div
                className="d-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success"
                style={{ width: 44, height: 44, borderRadius: 10, fontSize: 20 }}
              >
                <i className="bi bi-bank" />
              </div>
              <div>
                <h5 className="modal-title fw-semibold mb-0">Criar Conta Corrente</h5>
                <p className="text-muted small mb-0">Associe uma conta a um cliente</p>
              </div>
            </div>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Fechar"
            />
          </div>

          <div className="modal-body px-4 py-3">
            {error && (
              <div className="alert alert-danger py-2 small d-flex align-items-center gap-2">
                <i className="bi bi-exclamation-circle-fill" />
                {error}
              </div>
            )}

            <form id="form-conta" onSubmit={handleSubmit} noValidate>
              {/* Dados da conta */}
              <p className="text-muted small fw-semibold text-uppercase mb-2 mt-1">
                Dados da conta
              </p>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-medium">Número da conta *</label>
                  <input
                    type="text"
                    name="numeroConta"
                    className="form-control"
                    placeholder="00000-0"
                    value={form.numeroConta}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-medium">Número da agência *</label>
                  <input
                    type="text"
                    name="numeroAgencia"
                    className="form-control"
                    placeholder="0000"
                    value={form.numeroAgencia}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-medium">Saldo inicial (R$) *</label>
                  <div className="input-group">
                    <span className="input-group-text bg-transparent text-muted small">
                      R$
                    </span>
                    <input
                      type="number"
                      name="saldo"
                      className="form-control"
                      placeholder="0,00"
                      min="0"
                      step="0.01"
                      value={form.saldo}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Titular */}
              <p className="text-muted small fw-semibold text-uppercase mb-2 mt-3">
                Titular da conta
              </p>
              <div>
                <label className="form-label small fw-medium">Cliente *</label>
                {loadingClientes ? (
                  <div className="d-flex align-items-center gap-2 text-muted small py-2">
                    <span className="spinner-border spinner-border-sm" />
                    Carregando clientes...
                  </div>
                ) : (
                  <select
                    name="clienteId"
                    className="form-select"
                    value={form.clienteId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecione um cliente</option>
                    {clientes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nomeCompleto} — CPF:{" "}
                        {c.cpf.length === 11
                          ? formatCPFDisplay(c.cpf)
                          : c.cpf}
                      </option>
                    ))}
                  </select>
                )}
                {!loadingClientes && clientes.length === 0 && !error && (
                  <p className="text-muted small mt-1 mb-0">
                    <i className="bi bi-info-circle me-1" />
                    Nenhum cliente cadastrado. Cadastre um cliente primeiro.
                  </p>
                )}
              </div>
            </form>
          </div>

          <div className="modal-footer border-0 px-4 pb-4 pt-2 gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary px-4"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="form-conta"
              className="btn btn-success px-4 d-flex align-items-center gap-2"
              disabled={loading || loadingClientes}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" />
                  Salvando...
                </>
              ) : (
                <>
                  <i className="bi bi-check-lg" />
                  Criar Conta
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}