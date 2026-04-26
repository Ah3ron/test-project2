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
    <div className="hero bg-base-200 flex-1">
      <div className="hero-content flex-col lg:flex-row-reverse w-full max-w-4xl">
        <div className="text-center lg:text-left lg:pl-8">
          <h1 className="text-5xl font-bold">Трекер проектов</h1>
          <p className="py-6 text-lg opacity-70">
            Управляйте проектами, отслеживайте статусы и ведите историю изменений в одном месте.
          </p>
        </div>
        <div className="card w-full max-w-md shadow-2xl bg-base-100">
          <div className="card-body">
            <h2 className="card-title text-2xl justify-center mb-2">Вход</h2>

            {error && (
              <div role="alert" className="alert alert-error">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <label className="floating-label">
                <span>Эл. почта</span>
                <input
                  type="email"
                  className="input input-bordered input-md w-full"
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
                  className="input input-bordered input-md w-full"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </label>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={loading}
              >
                {loading ? <span className="loading loading-spinner loading-sm" /> : "Войти"}
              </button>
            </form>

            <p className="text-center text-sm mt-4">
              Нет аккаунта?{" "}
              <Link to="/register" className="link link-primary font-semibold">
                Регистрация
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
