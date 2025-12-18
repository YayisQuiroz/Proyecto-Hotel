import React, { useState, useEffect } from "react";

export default function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    id_evento: null,
    titulo: "",
    descripcion: "",
    id_categoria: "",
    fecha_inicio: "",
    fecha_fin: "",
    id_salon: "",
    usuario_responsable: "",
    activo: true,
  });

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const fetchEventos = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/eventos");
      let data = await response.json();
      data = data.filter(e => e.activo);
      setEventos(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Error al cargar eventos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  const totalPages = Math.ceil(eventos.length / pageSize);
  useEffect(() => {
    if (page > totalPages) setPage(totalPages || 1);
  }, [totalPages, page]);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro quieres eliminar este evento?")) return;
    try {
      await fetch(`http://localhost:3000/api/eventos/${id}`, { method: "DELETE" });
      fetchEventos();
    } catch {
      setError("Error al eliminar evento");
    }
  };

  const handleEdit = (evento) => {
    setFormData(evento);
    setFormVisible(true);
  };

  const handleCreate = () => {
    setFormData({
      id_evento: null,
      titulo: "",
      descripcion: "",
      id_categoria: "",
      fecha_inicio: "",
      fecha_fin: "",
      id_salon: "",
      usuario_responsable: "",
      activo: true,
    });
    setFormVisible(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = formData.id_evento ? "PUT" : "POST";
    const url = formData.id_evento
      ? `http://localhost:3000/api/eventos/${formData.id_evento}`
      : "http://localhost:3000/api/eventos";

    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setFormVisible(false);
      fetchEventos();
    } catch {
      setError("Error al guardar evento");
    }
  };

  const startIndex = (page - 1) * pageSize;
  const pagedEventos = eventos.slice(startIndex, startIndex + pageSize);

  const getVisiblePages = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

    const pages = [];
    const maxVisible = 5;
    let start = Math.max(2, page - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    if (end >= totalPages) {
      end = totalPages - 1;
      start = Math.max(2, end - maxVisible + 1);
    }

    pages.push(1);
    if (start > 2) pages.push("...");

    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push("...");

    pages.push(totalPages);
    return pages;
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", padding: "2rem", fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>

        {/* HEADER */}
        <div style={{ background: "white", borderRadius: "16px", padding: "2rem", marginBottom: "2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={{ margin: 0, fontSize: "1.875rem", fontWeight: 700, color: "#1e3c72" }}>Eventos</h1>
          <button onClick={handleCreate} style={{ background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)", color: "white", border: "none", padding: "0.6rem 1rem", borderRadius: "8px", cursor: "pointer", fontWeight: 600 }}>
            Nuevo Evento
          </button>
        </div>

        {/* FORMULARIO */}
        {formVisible && (
          <div style={{ marginBottom: "2rem", background: "white", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <input type="text" placeholder="Título" value={formData.titulo} onChange={e => setFormData({ ...formData, titulo: e.target.value })} required style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
              <textarea placeholder="Descripción" value={formData.descripcion} onChange={e => setFormData({ ...formData, descripcion: e.target.value })} required style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
              <input type="text" placeholder="Categoría ID" value={formData.id_categoria} onChange={e => setFormData({ ...formData, id_categoria: e.target.value })} style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
              <input type="datetime-local" placeholder="Inicio" value={formData.fecha_inicio} onChange={e => setFormData({ ...formData, fecha_inicio: e.target.value })} style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
              <input type="datetime-local" placeholder="Fin" value={formData.fecha_fin} onChange={e => setFormData({ ...formData, fecha_fin: e.target.value })} style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
              <input type="number" placeholder="Salón ID" value={formData.id_salon} onChange={e => setFormData({ ...formData, id_salon: e.target.value })} style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
              <input type="number" placeholder="Usuario Responsable" value={formData.usuario_responsable} onChange={e => setFormData({ ...formData, usuario_responsable: e.target.value })} style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
              <div style={{ display: "flex", gap: "1rem" }}>
                <button type="submit" style={{ background: "#10b981", color: "white", border: "none", padding: "0.5rem 1rem", borderRadius: "6px", cursor: "pointer" }}>Guardar</button>
                <button type="button" onClick={() => setFormVisible(false)} style={{ background: "#ef4444", color: "white", border: "none", padding: "0.5rem 1rem", borderRadius: "6px", cursor: "pointer" }}>Cancelar</button>
              </div>
            </form>
          </div>
        )}

        {/* TABLA */}
        <div style={{ background: "white", borderRadius: "16px", padding: "2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", overflowX: "auto" }}>
          {loading ? <p>Cargando...</p> : error ? <p>{error}</p> : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f0f4f8" }}>
                  <th style={{ padding: "0.75rem" }}>Título</th>
                  <th style={{ padding: "0.75rem" }}>Descripción</th>
                  <th style={{ padding: "0.75rem" }}>Inicio</th>
                  <th style={{ padding: "0.75rem" }}>Fin</th>
                  <th style={{ padding: "0.75rem" }}>Salón</th>
                  <th style={{ padding: "0.75rem" }}>Usuario Responsable</th>
                  <th style={{ padding: "0.75rem", textAlign: "center" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pagedEventos.map(e => (
                  <tr key={e.id_evento} style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "0.75rem" }}>{e.titulo}</td>
                    <td style={{ padding: "0.75rem" }}>{e.descripcion}</td>
                    <td style={{ padding: "0.75rem" }}>{new Date(e.fecha_inicio).toLocaleString()}</td>
                    <td style={{ padding: "0.75rem" }}>{new Date(e.fecha_fin).toLocaleString()}</td>
                    <td style={{ padding: "0.75rem" }}>{e.id_salon}</td>
                    <td style={{ padding: "0.75rem" }}>{e.usuario_responsable}</td>
                    <td style={{ padding: "0.75rem", display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                      <button onClick={() => handleEdit(e)} style={{ background: "#3b82f6", color: "white", border: "none", padding: "0.4rem 0.6rem", borderRadius: "6px", cursor: "pointer" }}>Editar</button>
                      <button onClick={() => handleDelete(e.id_evento)} style={{ background: "#ef4444", color: "white", border: "none", padding: "0.4rem 0.6rem", borderRadius: "6px", cursor: "pointer" }}>Eliminar</button>
                    </td>
                  </tr>
                ))}
                {pagedEventos.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "1rem" }}>
                      No hay eventos registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {/* PAGINACIÓN */}
          {totalPages > 1 && (
            <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.5rem", justifyContent: "center", alignItems: "center" }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1px solid #cbd5e1", background: page === 1 ? "#e5e7eb" : "white", cursor: page === 1 ? "not-allowed" : "pointer" }}>‹</button>
              {getVisiblePages().map((p, idx) => (
                <button key={idx} onClick={() => typeof p === "number" && setPage(p)} disabled={p === "..."} style={{ padding: "0.5rem 0.75rem", borderRadius: "6px", border: p === page ? "2px solid #667eea" : "1px solid #cbd5e1", background: p === page ? "#e0e7ff" : "white", cursor: p === "..." ? "default" : "pointer", fontWeight: p === page ? 700 : 500 }}>{p}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1px solid #cbd5e1", background: page === totalPages ? "#e5e7eb" : "white", cursor: page === totalPages ? "not-allowed" : "pointer" }}>›</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
