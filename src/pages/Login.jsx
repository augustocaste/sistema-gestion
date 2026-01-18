// src/pages/Login.jsx
import { useState } from "react";
import { login } from "@/supabase/auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/supabase/client";
import { toast } from "sonner";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Checking session for redirect...");
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        toast.success("Ya has iniciado sesión");
        navigate("/", { replace: true });
      }
    };

    checkSession();
  }, [navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success("Inicio de sesión exitoso");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error("Error al iniciar sesión: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <form
        onSubmit={handleSubmit}
        className="
      w-full max-w-sm
      bg-gray-50
      p-8
      rounded-2xl
      space-y-5
      shadow-lg
      border
      border-gray-200
    "
      >
        <h1 className="text-2xl font-semibold text-center text-gray-800">
          Iniciar sesión
        </h1>

        <div className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
          w-full
          rounded-lg
          border
          border-gray-300
          px-4
          py-2.5
          text-gray-800
          placeholder-gray-400
          focus:outline-none
          focus:ring-2
          focus:ring-primary/40
          focus:border-primary
          bg-white
        "
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
          w-full
          rounded-lg
          border
          border-gray-300
          px-4
          py-2.5
          text-gray-800
          placeholder-gray-400
          focus:outline-none
          focus:ring-2
          focus:ring-primary/40
          focus:border-primary
          bg-white
        "
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="
        w-full
        bg-primary
        text-primary-foreground
        py-2.5
        rounded-lg
        font-medium
        transition
        hover:opacity-90
        disabled:opacity-60
        disabled:cursor-not-allowed
      "
        >
          {loading ? "Ingresando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
