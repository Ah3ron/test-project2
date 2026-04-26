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
    <div className="navbar bg-base-300 shadow-sm">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost text-xl gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
          </svg>
          <span className="hidden sm:inline">Трекер проектов</span>
        </Link>
      </div>
      <div className="navbar-end gap-2">
        {isPending && <span className="loading loading-spinner loading-sm" />}
        {!isPending && session && (
          <>
            <div className="flex items-center gap-2">
              <div className="avatar avatar-placeholder">
                <div className="bg-neutral text-neutral-content w-8 rounded-full">
                  <span className="text-xs">{session.user.email?.[0]?.toUpperCase() || "?"}</span>
                </div>
              </div>
              <span className="text-sm opacity-70 hidden sm:inline">{session.user.email}</span>
            </div>
            <button className="btn btn-ghost btn-sm gap-1" onClick={handleSignOut}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Выйти</span>
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
