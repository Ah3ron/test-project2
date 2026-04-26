import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signIn, useSession } from "../lib/auth-client";

export default function LoginPage() {
  const navigate = useNavigate();
  const { data: session, isPending } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      navigate("/", { replace: true });
    }
  }, [session, navigate]);

  if (isPending) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = await signIn.email({ email, password });

    if (authError) {
      setError(authError.message || "Ошибка входа");
      setLoading(false);
      return;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-full max-w-md shadow-xl bg-base-100">
        <div className="card-body">
          <h2 className="card-title text-2xl justify-center mb-4">Вход</h2>

          {error && (
            <div role="alert" className="alert alert-error">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
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
                placeholder="••••••••"
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
              {loading ? <span className="loading loading-spinner loading-sm" /> : "Войти"}
            </button>
          </form>

          <p className="text-center text-sm mt-4">
            Нет аккаунта?{" "}
            <Link to="/register" className="link link-primary">
              Регистрация
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
