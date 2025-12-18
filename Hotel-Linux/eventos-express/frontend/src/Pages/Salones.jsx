import React, { useState, useEffect } from "react";

export default function Salones() {
  const [salones, setSalones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    id_salon: null,
    nombre: "",
    capacidad: 0,
    ubicacion: "",
    descripcion: "",
    activo: true,
  });

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const fetchSalones = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/salones");
      const data = await response.json();
      setSalones(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Error al cargar salones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalones();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro quieres eliminar este salón?")) return;
    try {
      await fetch(`http://localhost:3000/api/salones/${id}`, { method: "DELETE" });
      fetchSalones();
    } catch (err) {
      setError("Error al eliminar salón");
    }
  };

  const handleEdit = (s) => {
    setFormData(s);
    setFormVisible(true);
  };

  const handleCreate = () => {
    setFormData({
      id_salon: null,
      nombre: "",
      capacidad: 0,
      ubicacion: "",
      descripcion: "",
      activo: true,
    });
    setFormVisible(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = formData.id_salon ? "PUT" : "POST";
    const url = formData.id_salon
      ? `http://localhost:3000/api/salones/${formData.id_salon}`
      : "http://localhost:3000/api/salones";

    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setFormVisible(false);
      fetchSalones();
    } catch (err) {
      setError("Error al guardar salón");
    }
  };

  // Paginación
  const startIndex = (page - 1) * pageSize;
  const pagedSalones = Array.isArray(salones) ? salones.slice(startIndex, startIndex + pageSize) : [];
  const totalPages = Math.ceil((Array.isArray(salones) ? salones.length : 0) / pageSize);

  // Función para generar los números de página dinámicamente
  const getPaginationItems = () => {
    const items = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      items.push(1);
      
      let start = Math.max(2, page - 1);
      let end = Math.min(totalPages - 1, page + 1);
      
      if (page <= 3) {
        start = 2;
        end = Math.min(maxVisible, totalPages - 1);
      }
      
      if (page >= totalPages - 2) {
        start = Math.max(2, totalPages - maxVisible + 1);
        end = totalPages - 1;
      }
      
      if (start > 2) {
        items.push('...');
      }
      
      for (let i = start; i <= end; i++) {
        items.push(i);
      }
      
      if (end < totalPages - 1) {
        items.push('...');
      }
      
      items.push(totalPages);
    }
    
    return items;
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", padding: "2rem", fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ background: "white", borderRadius: "16px", padding: "2rem", marginBottom: "2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={{ margin: 0, fontSize: "1.875rem", fontWeight: 700, color: "#1e3c72" }}>Salones de Evento</h1>
          <button onClick={handleCreate} style={{ background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)", color: "white", border: "none", padding: "0.6rem 1rem", borderRadius: "8px", cursor: "pointer", fontWeight: 600 }}>
            Nuevo Salón
          </button>
        </div>

        {/* Tabla */}
        <div style={{ background: "white", borderRadius: "16px", padding: "2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", overflowX: "auto" }}>
          {loading ? <p>Cargando...</p> : error ? <p>{error}</p> : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f0f4f8" }}>
                  <th style={{ padding: "0.75rem", textAlign: "left" }}>Nombre</th>
                  <th style={{ padding: "0.75rem", textAlign: "left" }}>Capacidad</th>
                  <th style={{ padding: "0.75rem", textAlign: "left" }}>Ubicación</th>
                  <th style={{ padding: "0.75rem", textAlign: "left" }}>Descripción</th>
                  <th style={{ padding: "0.75rem", textAlign: "center" }}>Activo</th>
                  <th style={{ padding: "0.75rem", textAlign: "center" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pagedSalones.map((s) => (
                  <tr key={s.id_salon} style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "0.75rem" }}>{s.nombre}</td>
                    <td style={{ padding: "0.75rem" }}>{s.capacidad} personas</td>
                    <td style={{ padding: "0.75rem" }}>{s.ubicacion}</td>
                    <td style={{ padding: "0.75rem" }}>{s.descripcion}</td>
                    <td style={{ padding: "0.75rem", textAlign: "center" }}>{s.activo ? "Sí" : "No"}</td>
                    <td style={{ padding: "0.75rem", display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                      <button onClick={() => handleEdit(s)} style={{ background: "#3b82f6", color: "white", border: "none", padding: "0.4rem 0.6rem", borderRadius: "6px", cursor: "pointer" }}>Editar</button>
                      <button onClick={() => handleDelete(s.id_salon)} style={{ background: "#ef4444", color: "white", border: "none", padding: "0.4rem 0.6rem", borderRadius: "6px", cursor: "pointer" }}>Eliminar</button>
                    </td>
                  </tr>
                ))}
                {pagedSalones.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "1rem" }}>No hay salones registrados</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {/* Paginación Dinámica */}
          {totalPages > 0 && (
            <div style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", flexWrap: "wrap" }}>
              {/* Botón Anterior */}
              <button 
                onClick={() => setPage(Math.max(1, page - 1))} 
                disabled={page === 1}
                style={{ 
                  padding: "0.5rem 0.75rem", 
                  borderRadius: "6px", 
                  border: "1px solid #cbd5e1", 
                  background: page === 1 ? "#f3f4f6" : "white", 
                  cursor: page === 1 ? "not-allowed" : "pointer",
                  color: page === 1 ? "#9ca3af" : "#374151",
                  fontWeight: 500,
                  opacity: page === 1 ? 0.5 : 1
                }}
              >
                ← Anterior
              </button>

              {/* Números de página */}
              {getPaginationItems().map((item, index) => {
                if (item === '...') {
                  return (
                    <span key={`dots-${index}`} style={{ padding: "0.5rem", color: "#6b7280" }}>
                      ...
                    </span>
                  );
                }
                
                return (
                  <button 
                    key={item} 
                    onClick={() => setPage(item)} 
                    style={{ 
                      padding: "0.5rem 0.75rem", 
                      borderRadius: "6px", 
                      border: item === page ? "2px solid #667eea" : "1px solid #cbd5e1", 
                      background: item === page ? "#e0e7ff" : "white", 
                      cursor: "pointer", 
                      fontWeight: item === page ? 700 : 500,
                      color: item === page ? "#667eea" : "#374151",
                      minWidth: "2.5rem"
                    }}
                  >
                    {item}
                  </button>
                );
              })}

              {/* Botón Siguiente */}
              <button 
                onClick={() => setPage(Math.min(totalPages, page + 1))} 
                disabled={page === totalPages}
                style={{ 
                  padding: "0.5rem 0.75rem", 
                  borderRadius: "6px", 
                  border: "1px solid #cbd5e1", 
                  background: page === totalPages ? "#f3f4f6" : "white", 
                  cursor: page === totalPages ? "not-allowed" : "pointer",
                  color: page === totalPages ? "#9ca3af" : "#374151",
                  fontWeight: 500,
                  opacity: page === totalPages ? 0.5 : 1
                }}
              >
                Siguiente →
              </button>
            </div>
          )}

          {/* Info de registros */}
          {totalPages > 0 && (
            <div style={{ marginTop: "1rem", textAlign: "center", color: "#6b7280", fontSize: "0.875rem" }}>
              Mostrando {startIndex + 1} - {Math.min(startIndex + pageSize, salones.length)} de {salones.length} salones
            </div>
          )}
        </div>

        {/* Modal Formulario */}
        {formVisible && (
          <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
            <div style={{ background: "white", borderRadius: "16px", padding: "2rem", minWidth: "400px", boxShadow: "0 20px 40px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <h3 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700 }}>{formData.id_salon ? "Editar Salón" : "Nuevo Salón"}</h3>
              
              <input 
                type="text" 
                placeholder="Nombre del salón" 
                value={formData.nombre} 
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} 
                required 
                style={{ padding: "0.6rem", borderRadius: "8px", border: "1px solid #cbd5e1" }} 
              />
              
              <input 
                type="number" 
                placeholder="Capacidad (personas)" 
                value={formData.capacidad} 
                onChange={(e) => setFormData({ ...formData, capacidad: Number(e.target.value) })} 
                required 
                style={{ padding: "0.6rem", borderRadius: "8px", border: "1px solid #cbd5e1" }} 
              />
              
              <input 
                type="text" 
                placeholder="Ubicación" 
                value={formData.ubicacion} 
                onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })} 
                style={{ padding: "0.6rem", borderRadius: "8px", border: "1px solid #cbd5e1" }} 
              />
              
              <textarea 
                placeholder="Descripción" 
                value={formData.descripcion} 
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} 
                rows={3}
                style={{ padding: "0.6rem", borderRadius: "8px", border: "1px solid #cbd5e1", fontFamily: "inherit", resize: "vertical" }} 
              />
              
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input 
                  type="checkbox" 
                  checked={formData.activo} 
                  onChange={(e) => setFormData({ ...formData, activo: e.target.checked })} 
                />
                Activo
              </label>
              
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "0.5rem" }}>
                <button 
                  onClick={handleSubmit} 
                  style={{ background: "#667eea", color: "white", border: "none", padding: "0.6rem 1rem", borderRadius: "8px", cursor: "pointer", fontWeight: 600 }}
                >
                  Guardar
                </button>
                <button 
                  onClick={() => setFormVisible(false)} 
                  style={{ background: "#f3f4f6", color: "#111827", border: "none", padding: "0.6rem 1rem", borderRadius: "8px", cursor: "pointer" }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}