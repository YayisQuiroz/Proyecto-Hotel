import React, { useState, useEffect } from "react";

export default function Categoria() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    id_categoria: null,
    nombre: "",
    descripcion: "",
    activo: true,
  });

  const [page, setPage] = useState(1);
  const [pageSize] = useState(50); // mostramos 50 por página

  const fetchCategorias = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/categorias");
      const data = await response.json();
      setCategorias(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Error al cargar categorías");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro quieres eliminar esta categoría?")) return;
    try {
      await fetch(`http://localhost:3000/api/categorias/${id}`, { method: "DELETE" });
      fetchCategorias();
    } catch (err) {
      setError("Error al eliminar categoría");
    }
  };

  const handleEdit = (c) => {
    setFormData(c);
    setFormVisible(true);
  };

  const handleCreate = () => {
    setFormData({
      id_categoria: null,
      nombre: "",
      descripcion: "",
      activo: true,
    });
    setFormVisible(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = formData.id_categoria ? "PUT" : "POST";
    const url = formData.id_categoria
      ? `http://localhost:3000/api/categorias/${formData.id_categoria}`
      : "http://localhost:3000/api/categorias";

    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setFormVisible(false);
      fetchCategorias();
    } catch (err) {
      setError("Error al guardar categoría");
    }
  };

  // Paginación
  const startIndex = (page - 1) * pageSize;
  const pagedCategorias = categorias.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(categorias.length / pageSize);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", padding: "2rem", fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ background: "white", borderRadius: "16px", padding: "2rem", marginBottom: "2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={{ margin: 0, fontSize: "1.875rem", fontWeight: 700, color: "#1e3c72" }}>Categorías</h1>
          <button onClick={handleCreate} style={{ background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)", color: "white", border: "none", padding: "0.6rem 1rem", borderRadius: "8px", cursor: "pointer", fontWeight: 600 }}>
            Nueva Categoría
          </button>
        </div>

        {/* Tabla */}
        <div style={{ background: "white", borderRadius: "16px", padding: "2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", overflowX: "auto" }}>
          {loading ? <p>Cargando...</p> : error ? <p>{error}</p> : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f0f4f8" }}>
                  <th style={{ padding: "0.75rem", textAlign: "left" }}>Nombre</th>
                  <th style={{ padding: "0.75rem", textAlign: "left" }}>Descripción</th>
                  <th style={{ padding: "0.75rem", textAlign: "center" }}>Activo</th>
                  <th style={{ padding: "0.75rem", textAlign: "center" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pagedCategorias.map((c) => (
                  <tr key={c.id_categoria} style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "0.75rem" }}>{c.nombre}</td>
                    <td style={{ padding: "0.75rem" }}>{c.descripcion}</td>
                    <td style={{ padding: "0.75rem", textAlign: "center" }}>{c.activo ? "Sí" : "No"}</td>
                    <td style={{ padding: "0.75rem", display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                      <button onClick={() => handleEdit(c)} style={{ background: "#3b82f6", color: "white", border: "none", padding: "0.4rem 0.6rem", borderRadius: "6px", cursor: "pointer" }}>Editar</button>
                      <button onClick={() => handleDelete(c.id_categoria)} style={{ background: "#ef4444", color: "white", border: "none", padding: "0.4rem 0.6rem", borderRadius: "6px", cursor: "pointer" }}>Eliminar</button>
                    </td>
                  </tr>
                ))}
                {pagedCategorias.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", padding: "1rem" }}>No hay categorías registradas</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {/* Paginación */}
          <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} style={{ padding: "0.5rem 0.75rem", borderRadius: "6px", border: p === page ? "2px solid #667eea" : "1px solid #cbd5e1", background: p === page ? "#e0e7ff" : "white", cursor: "pointer", fontWeight: p === page ? 700 : 500 }}>{p}</button>
            ))}
          </div>
        </div>

        {/* Modal Formulario */}
        {formVisible && (
          <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
            <form onSubmit={handleSubmit} style={{ background: "white", borderRadius: "16px", padding: "2rem", minWidth: "320px", boxShadow: "0 20px 40px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <h3 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700 }}>{formData.id_categoria ? "Editar Categoría" : "Nueva Categoría"}</h3>
              <input type="text" placeholder="Nombre" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} required style={{ padding: "0.6rem", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
              <input type="text" placeholder="Descripción" value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} style={{ padding: "0.6rem", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input type="checkbox" checked={formData.activo} onChange={(e) => setFormData({ ...formData, activo: e.target.checked })} />
                Activo
              </label>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                <button type="submit" style={{ background: "#667eea", color: "white", border: "none", padding: "0.6rem 1rem", borderRadius: "8px", cursor: "pointer" }}>Guardar</button>
                <button type="button" onClick={() => setFormVisible(false)} style={{ background: "#f3f4f6", color: "#111827", border: "none", padding: "0.6rem 1rem", borderRadius: "8px", cursor: "pointer" }}>Cancelar</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
