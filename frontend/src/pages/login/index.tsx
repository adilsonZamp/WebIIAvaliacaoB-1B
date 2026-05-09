import { useEffect, useState, type FormEvent } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Client, setToken } from "../../../api/api";
import { useNavigate } from 'react-router';

interface LoginFormData {
    email: string;
    password: string;
    remember: boolean;
}

export default function Login() {
    const [formData, setFormData] = useState<LoginFormData>({
        email: "",
        password: "",
        remember: false,
    });
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Login';
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setError("");

        if (!formData.email || !formData.password) {
            setError("Por favor, preencha e-mail e senha.");
            return;
        }

        // Aqui você integraria com sua API de autenticação
        Client.post('/login', {
            email: formData.email,
            password: formData.password
        }).then(response => {
            if (response.status === 200) {
                const load = response.data.data
                //setDataUser(response.data.user)
                console.log("Data: "+load.token)
                setToken(load.token)
                navigate('/home');
            } else {
                alert('não deu');
            }
        });
    };

    return (
        <div
            className="d-flex align-items-center justify-content-center"
            style={{ minHeight: "100vh", background: "#f8f9fa" }}
        >
            <div
                className="card shadow-sm p-4"
                style={{ width: "100%", maxWidth: "420px", borderRadius: "16px" }}
            >
                <div className="text-center mb-4">
                    <div 
                        className="d-inline-flex align-items-center justify-content-center bg-primary text-white mb-3"
                        style={{ width: 52, height: 52, borderRadius: 12, fontSize: 24 }}
                    >{/* resolver esse estilo aqui */}
                        <i className="bi bi-box-seam" />
                    </div>
                    <h1 className="h5 fw-semibold mb-1">Bem-vindo de volta</h1>
                    <p className="text-muted small mb-0">Faça login para continuar</p>
                </div>

                {error && (
                    <div className="alert alert-danger py-2 small" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label fw-medium small">
                            E-mail
                        </label>
                        <div className="input-group">
                            <span className="input-group-text bg-transparent">
                                <i className="bi bi-envelope text-muted" />
                            </span>
                            <input
                                type="email"
                                id="email"
                                className="form-control"
                                placeholder="seunome@email.com"
                                value={formData.email}
                                onChange={handleChange}
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    <div className="mb-2">
                        <label htmlFor="password" className="form-label fw-medium small">
                            Senha
                        </label>
                        <div className="input-group">
                            <span className="input-group-text bg-transparent">
                                <i className="bi bi-lock text-muted" />
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                className="form-control border-end-0"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className="btn btn-outline-secondary border-start-0"
                                onClick={() => setShowPassword((prev) => !prev)}
                                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                            >
                                <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} />
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-100 fw-medium py-2">
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
}