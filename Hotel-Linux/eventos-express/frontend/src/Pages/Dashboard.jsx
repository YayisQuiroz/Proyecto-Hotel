import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Hotel,
  Calendar,
  DoorOpen,
  Users,
  LogOut,
  Box,
  FileText,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  const menuItems = [
    { path: "/dashboard/eventos", icon: Calendar, label: "Eventos", category: "Gestión" },
    { path: "/dashboard/participantes", icon: Users, label: "Participantes", category: "Gestión" },
    { path: "/dashboard/salones", icon: Users, label: "Salones", category: "Gestión" },
    { path: "/dashboard/staff", icon: DoorOpen, label: "Staff", category: "Gestión" },
    { path: "/dashboard/materiales", icon: Box, label: "Materiales", category: "Logística" },
    { path: "/dashboard/reportes", icon: FileText, label: "Reportes", category: "Reportes" },
    { path: "/dashboard/categorias", icon: Box, label: "Categorías", category: "Gestión" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    navigate("/"); 
  };

  const groupedMenu = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
      {/* Sidebar */}
      <aside style={{ width: "280px", background: "linear-gradient(180deg, #1e3c72 0%, #2a5298 100%)", color: "white", padding: "2rem 0", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ padding: "0 2rem 2rem", borderBottom: "1px solid rgba(255,255,255,0.1)", marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <Hotel size={32} strokeWidth={2} />
            <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 600 }}>Hotel Admin</h2>
          </div>
          <p style={{ margin: "0.5rem 0 0", fontSize: "0.875rem", opacity: 0.8, fontWeight: 300 }}>Sistema de Gestión</p>
        </div>

        {/* Menu */}
        <nav style={{ flex: 1, padding: "0 1rem" }}>
          {Object.keys(groupedMenu).map((category) => (
            <div key={category} style={{ marginBottom: "1.5rem" }}>
              <p style={{ fontSize: "0.75rem", textTransform: "uppercase", opacity: 0.7, marginBottom: "0.5rem" }}>
                {category}
              </p>
              {groupedMenu[category].map((item) => (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => navigate(item.path)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "0.875rem 1rem",
                    color: "white",
                    background: "transparent",
                    border: "none",
                    textAlign: "left",
                    borderRadius: "8px",
                    marginBottom: "0.5rem",
                    transition: "all 0.2s ease",
                    fontSize: "0.95rem",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; e.currentTarget.style.transform = "translateX(4px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "translateX(0)"; }}
                >
                  <item.icon size={20} />
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: "1rem" }}>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              padding: "0.875rem",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "white",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "0.95rem",
              fontWeight: 500,
              transition: "all 0.2s ease",
            }}
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, position: "relative", background: "linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%)", overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "3rem" }}>
        
        {/* Decorativos */}
        <div style={{ position: "absolute", top: "-100px", right: "-150px", width: "300px", height: "300px", background: "rgba(255, 255, 255, 0.15)", borderRadius: "50%", filter: "blur(80px)" }} />
        <div style={{ position: "absolute", bottom: "-120px", left: "-120px", width: "400px", height: "400px", background: "rgba(102, 126, 234, 0.15)", borderRadius: "50%", filter: "blur(100px)" }} />

        {/* Contenido */}
        <div style={{ width: "100%", maxWidth: "1200px", position: "relative", zIndex: 1 }}>
          {/* Banner */}
          <div style={{ display: "flex", alignItems: "center", gap: "2rem", marginBottom: "2rem", background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)", borderRadius: "20px", padding: "2rem", color: "white", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>Bienvenido, Administrador</h1>
              <p style={{ fontSize: "1rem", opacity: 0.9 }}>Gestiona tus eventos, participantes, staff y más desde aquí.</p>
            </div>
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12l2-2 4 4 8-8 4 4" />
            </svg>
          </div>

          {/* Card de bienvenida */}
          <div style={{
            background: "white",
            borderRadius: "20px",
            padding: "2rem",
            boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
            minHeight: "60vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center"
          }}>
            <Calendar size={64} color="#667eea" style={{ marginBottom: "1rem" }} />
            <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.5rem" }}>Dashboard</h2>
            <p style={{ color: "#64748b", fontSize: "1.125rem" }}>Selecciona un módulo del menú lateral para comenzar a gestionar tu hotel.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
