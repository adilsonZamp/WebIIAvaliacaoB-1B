import { useState, type FormEvent } from "react";
import { Client } from "../../../api/api";
import axios from "axios";

interface CadastrarClienteModalProps {
	onClose: () => void;
	onSuccess: () => void;
}

interface ClienteForm {
	nomeCompleto: string;
	email: string;
	senha: string;
	confirmaSenha: string;
	cpf: string;
	tipo: string;
	cidade: string;
	estado: string;
	rua: string;
	numero: string;
}

const ESTADOS_BR = [
	"AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
	"MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
	"RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

const initialForm: ClienteForm = {
	nomeCompleto: "",
	email: "",
	senha: "",
	confirmaSenha: "",
	cpf: "",
	tipo: "",
	cidade: "",
	estado: "",
	rua: "",
	numero: "",
};

function formatCPF(value: string): string {
	const digits = value.replace(/\D/g, "").slice(0, 11);
	return digits
		.replace(/(\d{3})(\d)/, "$1.$2")
		.replace(/(\d{3})(\d)/, "$1.$2")
		.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export default function CadastrarClienteModal({
	onClose,
	onSuccess,
}: CadastrarClienteModalProps) {
	const [form, setForm] = useState<ClienteForm>(initialForm);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [showSenha, setShowSenha] = useState(false);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		if (name === "cpf") {
			setForm((prev) => ({ ...prev, cpf: formatCPF(value) }));
		} else {
			setForm((prev) => ({ ...prev, [name]: value }));
		}
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError("");

		const { nomeCompleto, email, senha, confirmaSenha, cpf, cidade, estado, rua, numero } = form;
		if (!nomeCompleto || !email || !senha || !confirmaSenha || !cpf) {
			setError("Preencha todos os campos obrigatórios.");
			return;
		}

		setLoading(true);
		try {
			console.log(cpf.replaceAll('.', '').replace('-', ''));
			
			await Client.post('/signup', {
				nome: nomeCompleto,
				email: email,
				password: senha,
				passwordConfirmation: confirmaSenha,
				cpf: cpf.replaceAll('.', '').replace('-', ''),
				tipo: "Cliente",
				//opcionais
				cidade: cidade,
				estado: estado,
				rua: rua,
				numero: numero
			})

			onSuccess();
			onClose();
		} catch (error: unknown) {
			if (axios.isAxiosError(error)) {
				setError(error instanceof Error ? error.response?.data.errors[0].message : "Erro inesperado.");
			} else {
				setError("Erro sinistro");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			className="modal fade show d-block"
			tabIndex={-1}
			style={{ background: "rgba(0,0,0,0.5)" }}
			onClick={(e) => e.target === e.currentTarget && onClose()}
		>
			<div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
				<div className="modal-content border-0 shadow-lg" style={{ borderRadius: 16 }}>
					<div className="modal-header border-0 pb-0 px-4 pt-4">
						<div className="d-flex align-items-center gap-3">
							<div
								className="d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary"
								style={{ width: 44, height: 44, borderRadius: 10, fontSize: 20 }}
							>
								<i className="bi bi-person-plus" />
							</div>
							<div>
								<h5 className="modal-title fw-semibold mb-0">Cadastrar Cliente</h5>
								<p className="text-muted small mb-0">Preencha os dados do novo cliente</p>
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

						<form id="form-cliente" onSubmit={handleSubmit} noValidate>
							{/* Dados pessoais */}
							<p className="text-muted small fw-semibold text-uppercase letter-spacing mb-2 mt-1">
								Dados pessoais
							</p>
							<div className="row g-3 mb-3">
								<div className="col-12">
									<label className="form-label small fw-medium">Nome completo *</label>
									<input
										type="text"
										name="nomeCompleto"
										className="form-control"
										placeholder="João da Silva"
										value={form.nomeCompleto}
										onChange={handleChange}
										required
									/>
								</div>
								<div className="col-md-6">
									<label className="form-label small fw-medium">E-mail *</label>
									<input
										type="email"
										name="email"
										className="form-control"
										placeholder="joao@email.com"
										value={form.email}
										onChange={handleChange}
										required
									/>
								</div>
								<div className="col-md-6">
									<label className="form-label small fw-medium">CPF *</label>
									<input
										type="text"
										name="cpf"
										className="form-control"
										placeholder="000.000.000-00"
										value={form.cpf}
										onChange={handleChange}
										maxLength={14}
										required
									/>
								</div>
								<div className="col-md-6">
									<label className="form-label small fw-medium">Senha *</label>
									<div className="input-group">
										<input
											type={showSenha ? "text" : "password"}
											name="senha"
											className="form-control border-end-0"
											placeholder="••••••••"
											value={form.senha}
											onChange={handleChange}
											required
										/>
										<input
											type={showSenha ? "text" : "password"}
											name="confirmaSenha"
											className="form-control border-end-0"
											placeholder="••••••••"
											value={form.confirmaSenha}
											onChange={handleChange}
											required
										/>
										<button
											type="button"
											className="btn btn-outline-secondary border-start-0"
											onClick={() => setShowSenha((p) => !p)}
											aria-label={showSenha ? "Ocultar senha" : "Mostrar senha"}
										>
											<i className={`bi ${showSenha ? "bi-eye-slash" : "bi-eye"}`} />
										</button>
									</div>
								</div>
							</div>

							{/* Endereço */}
							<p className="text-muted small fw-semibold text-uppercase mb-2 mt-3">
								Endereço
							</p>
							<div className="row g-3">
								<div className="col-md-6">
									<label className="form-label small fw-medium">Rua</label>
									<input
										type="text"
										name="rua"
										className="form-control"
										placeholder="Rua das Flores"
										value={form.rua}
										onChange={handleChange}
										required
									/>
								</div>
								<div className="col-md-2">
									<label className="form-label small fw-medium">Número</label>
									<input
										type="text"
										name="numero"
										className="form-control"
										placeholder="123"
										value={form.numero}
										onChange={handleChange}
										required
									/>
								</div>
								<div className="col-md-4">
									<label className="form-label small fw-medium">Cidade</label>
									<input
										type="text"
										name="cidade"
										className="form-control"
										placeholder="São Paulo"
										value={form.cidade}
										onChange={handleChange}
										required
									/>
								</div>
								<div className="col-md-3">
									<label className="form-label small fw-medium">Estado</label>
									<select
										name="estado"
										className="form-select"
										value={form.estado}
										onChange={handleChange}
										required
									>
										<option value="">UF</option>
										{ESTADOS_BR.map((uf) => (
											<option key={uf} value={uf}>
												{uf}
											</option>
										))}
									</select>
								</div>
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
							form="form-cliente"
							className="btn btn-primary px-4 d-flex align-items-center gap-2"
							disabled={loading}
						>
							{loading ? (
								<>
									<span className="spinner-border spinner-border-sm" />
									Salvando...
								</>
							) : (
								<>
									<i className="bi bi-check-lg" />
									Cadastrar Cliente
								</>
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}