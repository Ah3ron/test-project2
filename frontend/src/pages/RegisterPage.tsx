import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../lib/auth-client";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = await signUp.email({ name, email, password });

    if (authError) {
      setError(authError.message || "Ошибка регистрации");
      setLoading(false);
      return;
    }

    navigate("/");
  };

  return (
    <div className="flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md shadow-xl bg-base-100">
        <div className="card-body">
          <h2 className="card-title text-2xl justify-center mb-4">Регистрация</h2>

          {error && (
            <div role="alert" className="alert alert-error">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <label className="floating-label">
              <span>Имя</span>
              <input
                type="text"
                className="input input-md w-full"
                placeholder="Иван Иванов"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>

            <label className="floating-label">
              <span>Эл. почта</span>
              <input
                type="email"
                className="input input-md w-full"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label className="floating-label">
              <span>Пароль</span>
              <input
                type="password"
                className="input input-md w-full"
                placeholder="Минимум 8 символов"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </label>

            <button
              type="submit"
              className={`btn btn-primary btn-block ${loading ? "btn-disabled" : ""}`}
              disabled={loading}
            >
              {loading ? <span className="loading loading-spinner loading-sm" /> : "Зарегистрироваться"}
            </button>
          </form>

          <p className="text-center text-sm mt-4">
            Уже есть аккаунт?{" "}
            <Link to="/login" className="link link-primary">
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
