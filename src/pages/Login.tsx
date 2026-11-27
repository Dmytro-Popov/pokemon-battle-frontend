import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { authRequest, setSession } from "../utils/auth";
import RetroLoader from "../components/RetroLoader";

export default function Login() {
  const nav = useNavigate();
  const location = useLocation();
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Log in — PokéArena";
  }, []);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email"));
    const password = String(f.get("password"));

    if (!/^\S+@\S+\.\S+$/.test(email)) return setErr("Enter a valid email.");
    if (password.length < 8)
      return setErr("Password must be at least 8 characters.");

    setErr("");
    setLoading(true);
    try {
      const { accessToken, username } = await authRequest("login", { email, password });
      if (!accessToken) throw new Error("No token received.");
      setSession( accessToken, username );
      nav(location.state?.from ?? "/", { replace: true });
    } catch (error) {
      setErr(error instanceof Error ? error.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <form onSubmit={submit} noValidate className="brut space-y-4 bg-card p-8">
        <h1 className="font-pixel text-lg">Log in</h1>
        <label className="block font-bold">
          Email
          <input
            name="email"
            type="email"
            className="brut-sm mt-1 w-full bg-background px-3 py-2 outline-none focus:bg-accent"
          />
        </label>
        <label className="block font-bold">
          Password
          <input
            name="password"
            type="password"
            className="brut-sm mt-1 w-full bg-background px-3 py-2 outline-none focus:bg-accent"
          />
        </label>
        {err && (
          <p className="brut-sm bg-destructive px-3 py-2 text-sm font-bold text-primary-foreground">
            {err}
          </p>
        )}
        {loading && <RetroLoader label="Logging in" />}
        <button
          disabled={loading}
          className="brut press w-full bg-primary py-3 font-pixel text-xs text-primary-foreground disabled:opacity-60"
        >
          {loading ? "..." : "Log in"}
        </button>
        <p className="text-center text-sm">
          <Link to="/register" className="font-bold underline">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}