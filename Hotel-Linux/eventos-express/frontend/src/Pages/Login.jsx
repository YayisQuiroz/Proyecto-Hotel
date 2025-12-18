import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Hotel, Mail, Lock, LogIn, AlertCircle } from "lucide-react";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contraseña: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMensaje(data.error || "Error al iniciar sesión");
        return;
      }

      // ✅ Guarda solo el usuario que devuelve tu API
      // { id_usuario, nombre, apellido, correo, rol }
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      // ✅ Redirige al dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setMensaje("Error al conectar con el servidor");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Circulos decorativos */}
      <div
        style={{
          position: "absolute",
          top: "-100px",
          right: "-100px",
          width: "300px",
          height: "300px",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "50%",
          filter: "blur(60px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-150px",
          left: "-150px",
          width: "400px",
          height: "400px",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "50%",
          filter: "blur(80px)",
        }}
      />

      <div
        style={{
          background: "white",
          borderRadius: "24px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          width: "100%",
          maxWidth: "450px",
          overflow: "hidden",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
            padding: "3rem 2rem",
            textAlign: "center",
            color: "white",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              background: "rgba(255, 255, 255, 0.2)",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
              backdropFilter: "blur(10px)",
              border: "2px solid rgba(255, 255, 255, 0.3)",
            }}
          >
            <Hotel size={40} color="white" />
          </div>
          <h1
            style={{
              margin: "0 0 0.5rem 0",
              fontSize: "2rem",
              fontWeight: "700",
              letterSpacing: "-0.5px",
            }}
          >
            Bienvenido
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: "0.95rem",
              opacity: 0.9,
            }}
          >
            Sistema de Gestión Hotelera
          </p>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleLogin}
          style={{
            padding: "2.5rem 2rem",
          }}
        >
          {/* Campo Email */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#475569",
              }}
            >
              Correo Electrónico
            </label>
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Mail
                size={20}
                style={{
                  position: "absolute",
                  left: "1rem",
                  color: "#94a3b8",
                }}
              />
              <input
                type="email"
                placeholder="ejemplo@hotel.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.875rem 1rem 0.875rem 3rem",
                  border: "2px solid #e2e8f0",
                  borderRadius: "12px",
                  fontSize: "0.95rem",
                  transition: "all 0.2s ease",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          </div>

          {/* Campo Password */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#475569",
              }}
            >
              Contraseña
            </label>
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Lock
                size={20}
                style={{
                  position: "absolute",
                  left: "1rem",
                  color: "#94a3b8",
                }}
              />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.875rem 1rem 0.875rem 3rem",
                  border: "2px solid #e2e8f0",
                  borderRadius: "12px",
                  fontSize: "0.95rem",
                  transition: "all 0.2s ease",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          </div>

          {/* Mensaje de error */}
          {mensaje && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.875rem 1rem",
                background: "#fee2e2",
                border: "1px solid #fecaca",
                borderRadius: "12px",
                marginBottom: "1.5rem",
                color: "#991b1b",
                fontSize: "0.875rem",
              }}
            >
              <AlertCircle size={18} />
              <span>{mensaje}</span>
            </div>
          )}

          {/* Botón Submit */}
          <button
            type="submit"
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              padding: "1rem",
              background:
                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
              outline: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 6px 20px rgba(102, 126, 234, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(102, 126, 234, 0.4)";
            }}
          >
            <LogIn size={20} />
            Iniciar Sesión
          </button>
        </form>

        {/* Footer */}
        <div
          style={{
            padding: "1.5rem 2rem",
            background: "#f8fafc",
            textAlign: "center",
            borderTop: "1px solid #e2e8f0",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "0.875rem",
              color: "#64748b",
            }}
          >
            ¿Necesitas ayuda? Contacta al administrador
          </p>
        </div>
      </div>
    </div>
  );
}
