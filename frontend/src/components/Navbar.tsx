import { Link, useNavigate } from "react-router-dom";
import { signOut, useSession } from "../lib/auth-client";

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="navbar bg-base-200">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost text-xl">
          Трекер проектов
        </Link>
      </div>
      <div className="navbar-end gap-2">
        {isPending && <span className="loading loading-spinner loading-sm" />}
        {!isPending && session && (
          <>
            <span className="text-sm opacity-70">{session.user.email}</span>
            <button className="btn btn-ghost btn-sm" onClick={handleSignOut}>
              Выйти
            </button>
          </>
        )}
        {!isPending && !session && (
          <Link to="/login" className="btn btn-primary btn-sm">
            Войти
          </Link>
        )}
      </div>
    </div>
  );
}
