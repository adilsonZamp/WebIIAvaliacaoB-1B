import { useState, type FormEvent } from "react";

interface TransferirModalProps {
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

interface TransferirForm {
  numeroConta: string;
  digito: string;
  valor: string;
}

const initialForm: TransferirForm = {
  numeroConta: "",
  digito: "",
  valor: "",
};

export default function TransferirModal({ onClose, onSuccess }: TransferirModalProps) {
  const [form, setForm] = useState<TransferirForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null); // null = oculto

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Permite apenas dígitos para conta e dígito
    if (name === "numeroConta" || name === "digito") {
      if (/\D/.test(value)) return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg(null); // Limpa erro ao digitar
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const { numeroConta, digito, valor } = form;

    if (!numeroConta || !digito || !valor) {
      setErrorMsg("Preencha todos os campos para continuar.");
      return;
    }

    const valorNum = parseFloat(valor.replace(",", "."));
    if (isNaN(valorNum) || valorNum <= 0) {
      setErrorMsg("Informe um valor válido maior que zero.");
      return;
    }

    setLoading(true);
    try {
      // Substitua pela URL real da sua API
      const response = await fetch("/api/transferencias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contaDestino: numeroConta,
          digitoDestino: digito,
          valor: valorNum,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // O backend envia a mensagem de erro — exibimos diretamente
        setErrorMsg(data.message || "Não foi possível realizar a transferência.");
        return;
      }

      onSuccess(data.message || "Transferência realizada com sucesso!");
      onClose();
    } catch {
      setErrorMsg("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      style={{ background: "rgba(0,0,0,0.55)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-dialog modal-sm modal-dialog-centered">
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
                  background: "#eff6ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  color: "#2563eb",
                }}
              >
                <i className="bi bi-send" />
              </div>
              <div>
                <h5 className="fw-semibold mb-0" style={{ color: "#1a1a2e" }}>
                  Transferir
                </h5>
                <p className="text-muted small mb-0">Para outra conta</p>
              </div>
            </div>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Fechar"
            />
          </div>

          {/* Corpo */}
          <div className="modal-body px-4 py-3">
            {/* Caixa de erro — oculta enquanto não há erro */}
            {errorMsg !== null && (
              <div
                className="d-flex align-items-start gap-2 p-3 rounded-3 mb-3"
                style={{
                  background: "#fff5f5",
                  border: "1px solid #fecaca",
                  color: "#dc2626",
                }}
                role="alert"
              >
                <i className="bi bi-exclamation-circle-fill mt-1 flex-shrink-0" />
                <span style={{ fontSize: "0.85rem" }}>{errorMsg}</span>
              </div>
            )}

            <form id="form-transferir" onSubmit={handleSubmit} noValidate>
              {/* Conta + Dígito lado a lado */}
              <div className="row g-2 mb-3">
                <div className="col-8">
                  <label className="form-label small fw-medium" style={{ color: "#374151" }}>
                    Número da conta
                  </label>
                  <input
                    type="text"
                    name="numeroConta"
                    inputMode="numeric"
                    className="form-control"
                    placeholder="00000000"
                    value={form.numeroConta}
                    onChange={handleChange}
                    maxLength={12}
                    required
                  />
                </div>
                <div className="col-4">
                  <label className="form-label small fw-medium" style={{ color: "#374151" }}>
                    Dígito
                  </label>
                  <input
                    type="text"
                    name="digito"
                    inputMode="numeric"
                    className="form-control"
                    placeholder="0"
                    value={form.digito}
                    onChange={handleChange}
                    maxLength={2}
                    required
                  />
                </div>
              </div>

              {/* Valor */}
              <div className="mb-1">
                <label className="form-label small fw-medium" style={{ color: "#374151" }}>
                  Valor (R$)
                </label>
                <div className="input-group">
                  <span
                    className="input-group-text bg-transparent"
                    style={{ color: "#6b7280", fontSize: "0.875rem" }}
                  >
                    R$
                  </span>
                  <input
                    type="number"
                    name="valor"
                    inputMode="decimal"
                    className="form-control"
                    placeholder="0,00"
                    min="0.01"
                    step="0.01"
                    value={form.valor}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="modal-footer border-0 px-4 pb-4 pt-1 gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary px-3"
              onClick={onClose}
              disabled={loading}
              style={{ borderRadius: 8 }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="form-transferir"
              className="btn btn-primary px-3 d-flex align-items-center gap-2 flex-grow-1 justify-content-center"
              disabled={loading}
              style={{ borderRadius: 8 }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" />
                  Enviando...
                </>
              ) : (
                <>
                  <i className="bi bi-send-fill" />
                  Confirmar transferência
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}