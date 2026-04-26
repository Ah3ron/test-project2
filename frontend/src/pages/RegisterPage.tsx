import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../lib/auth-client";
import { useRegisterFormStore } from "../store";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { name, email, password, error, loading, setName, setEmail, setPassword, setError, setLoading, reset } = useRegisterFormStore();

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

    reset();
    navigate("/");
  };

  return (
    <div className="hero bg-base-200 flex-1">
      <div className="hero-content flex-col lg:flex-row-reverse w-full max-w-4xl">
        <div className="text-center lg:text-left lg:pl-8">
          <h1 className="text-5xl font-bold">Начните сейчас</h1>
          <p className="py-6 text-lg opacity-70">
            Создайте аккаунт, чтобы управлять проектами и отслеживать прогресс вашей команды.
          </p>
        </div>
        <div className="card w-full max-w-md shadow-2xl bg-base-100">
          <div className="card-body">
            <h2 className="card-title text-2xl justify-center mb-2">Регистрация</h2>

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
                <span>Имя</span>
                <input
                  type="text"
                  className="input input-bordered input-md w-full"
                  placeholder="Иван Иванов"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>

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
                  placeholder="Минимум 8 символов"
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
                {loading ? <span className="loading loading-spinner loading-sm" /> : "Зарегистрироваться"}
              </button>
            </form>

            <p className="text-center text-sm mt-4">
              Уже есть аккаунт?{" "}
              <Link to="/login" className="link link-primary font-semibold">
                Войти
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
