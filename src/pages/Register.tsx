import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authRequest } from "../utils/auth";

export default function Register() {
  const nav = useNavigate();
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Sign up — PokéArena";
  }, []);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name")).trim();
    const email = String(f.get("email"));
    const password = String(f.get("password"));

    if (!name) return setErr("Enter a trainer name.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErr("Enter a valid email.");
    if (password.length < 8)
      return setErr("Password must be at least 8 characters.");

    setErr("");
    setLoading(true);
    try {
      await authRequest("register", { name, email, password });
      nav("/login");
    } catch (error) {
      setErr(error instanceof Error ? error.message : "Sign up failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <form onSubmit={submit} noValidate className="brut space-y-4 bg-card p-8">
        <h1 className="font-pixel text-lg">Sign up</h1>
        <label className="block font-bold">
          Trainer name
          <input
            name="name"
            className="brut-sm mt-1 w-full bg-background px-3 py-2 outline-none focus:bg-accent"
          />
        </label>
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
        <button
          disabled={loading}
          className="brut press w-full bg-primary py-3 font-pixel text-xs text-primary-foreground disabled:opacity-60"
        >
          {loading ? "..." : "Sign up"}
        </button>
        <p className="text-center text-sm">
          <Link to="/login" className="font-bold underline">
            I already have an account
          </Link>
        </p>
      </form>
    </div>
  );
}