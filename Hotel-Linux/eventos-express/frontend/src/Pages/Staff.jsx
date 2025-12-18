import React, { useState, useEffect } from "react";

export default function StaffEvento() {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    id_staff: null,
    nombre: "",
    rol: "",
    telefono: "",
    activo: true,
  });

  // PAGINACIÓN
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/staff");
      const data = await response.json();
      setStaffList(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Error al cargar el staff");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Reajustar página si cambia el total
  const totalPages = Math.ceil(staffList.length / pageSize);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages || 1);
    }
  }, [totalPages, page]);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro quieres eliminar este staff?")) return;
    try {
      await fetch(`http://localhost:3000/api/staff/${id}`, { method: "DELETE" });
      fetchStaff();
    } catch (err) {
      setError("Error al eliminar staff");
    }
  };

  const handleEdit = (s) => {
    setFormData(s);
    setFormVisible(true);
  };

  const handleCreate = () => {
    setFormData({
      id_staff: null,
      nombre: "",
      rol: "",
      telefono: "",
      activo: true,
    });
    setFormVisible(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = formData.id_staff ? "PUT" : "POST";
    const url = formData.id_staff
      ? `http://localhost:3000/api/staff/${formData.id_staff}`
      : "http://localhost:3000/api/staff";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then(() => {
        setFormVisible(false);
        fetchStaff();
      })
      .catch(() => setError("Error al guardar staff"));
  };

  // DATOS PAGINADOS
  const startIndex = (page - 1) * pageSize;
  const pagedStaff = staffList.slice(startIndex, startIndex + pageSize);

  // PÁGINAS VISIBLES - Modificado para mostrar siempre 1 y última
  const getVisiblePages = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    const maxVisible = 5;
    let start = Math.max(2, page - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    if (end >= totalPages) {
      end = totalPages - 1;
      start = Math.max(2, end - maxVisible + 1);
    }

    // Siempre agregar la primera página
    pages.push(1);

    // Agregar "..." si hay espacio entre 1 y el inicio
    if (start > 2) {
      pages.push("...");
    }

    // Agregar páginas del medio
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Agregar "..." si hay espacio entre el final y la última página
    if (end < totalPages - 1) {
      pages.push("...");
    }

    // Siempre agregar la última página
    pages.push(totalPages);

    return pages;
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        padding: "2rem",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* HEADER */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "2rem",
            marginBottom: "2rem",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "1.875rem",
              fontWeight: 700,
              color: "#1e3c72",
            }}
          >
            Staff
          </h1>
          <button
            onClick={handleCreate}
            style={{
              background:
                "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              padding: "0.6rem 1rem",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Nuevo Staff
          </button>
        </div>

        {/* TABLA */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "2rem",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            overflowX: "auto",
          }}
        >
          {loading ? (
            <p>Cargando...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f0f4f8" }}>
                  <th style={{ padding: "0.75rem", textAlign: "left" }}>
                    Nombre
                  </th>
                  <th style={{ padding: "0.75rem", textAlign: "left" }}>
                    Rol
                  </th>
                  <th style={{ padding: "0.75rem", textAlign: "left" }}>
                    Teléfono
                  </th>
                  <th style={{ padding: "0.75rem", textAlign: "center" }}>
                    Activo
                  </th>
                  <th style={{ padding: "0.75rem", textAlign: "center" }}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {pagedStaff.map((s) => (
                  <tr
                    key={s.id_staff}
                    style={{ borderBottom: "1px solid #e2e8f0" }}
                  >
                    <td style={{ padding: "0.75rem" }}>{s.nombre}</td>
                    <td style={{ padding: "0.75rem" }}>{s.rol}</td>
                    <td style={{ padding: "0.75rem" }}>{s.telefono}</td>
                    <td style={{ padding: "0.75rem", textAlign: "center" }}>
                      {s.activo ? "Sí" : "No"}
                    </td>
                    <td
                      style={{
                        padding: "0.75rem",
                        display: "flex",
                        gap: "0.5rem",
                        justifyContent: "center",
                      }}
                    >
                      <button
                        onClick={() => handleEdit(s)}
                        style={{
                          background: "#3b82f6",
                          color: "white",
                          border: "none",
                          padding: "0.4rem 0.6rem",
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(s.id_staff)}
                        style={{
                          background: "#ef4444",
                          color: "white",
                          border: "none",
                          padding: "0.4rem 0.6rem",
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
                {pagedStaff.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      style={{ textAlign: "center", padding: "1rem" }}
                    >
                      No hay staff registrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {/* PAGINACIÓN */}
          {totalPages > 1 && (
            <div
              style={{
                marginTop: "1.5rem",
                display: "flex",
                gap: "0.5rem",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{
                  padding: "0.5rem 0.75rem",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  background: page === 1 ? "#e5e7eb" : "white",
                  cursor: page === 1 ? "not-allowed" : "pointer",
                }}
              >
                ‹
              </button>

              {getVisiblePages().map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => typeof p === "number" && setPage(p)}
                  disabled={p === "..."}
                  style={{
                    padding: "0.5rem 0.75rem",
                    borderRadius: "6px",
                    border:
                      p === page
                        ? "2px solid #667eea"
                        : "1px solid #cbd5e1",
                    background: p === page ? "#e0e7ff" : "white",
                    cursor: p === "..." ? "default" : "pointer",
                    fontWeight: p === page ? 700 : 500,
                  }}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() =>
                  setPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={page === totalPages}
                style={{
                  padding: "0.5rem 0.75rem",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  background:
                    page === totalPages ? "#e5e7eb" : "white",
                  cursor:
                    page === totalPages ? "not-allowed" : "pointer",
                }}
              >
                ›
              </button>
            </div>
          )}
        </div>

        {/* MODAL */}
        {formVisible && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
            }}
          >
            <div
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "2rem",
                minWidth: "320px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700 }}>
                {formData.id_staff ? "Editar Staff" : "Nuevo Staff"}
              </h3>

              <input
                type="text"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                required
                style={{
                  padding: "0.6rem",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                }}
              />

              <input
                type="text"
                placeholder="Rol"
                value={formData.rol}
                onChange={(e) =>
                  setFormData({ ...formData, rol: e.target.value })
                }
                style={{
                  padding: "0.6rem",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                }}
              />

              <input
                type="text"
                placeholder="Teléfono"
                value={formData.telefono}
                onChange={(e) =>
                  setFormData({ ...formData, telefono: e.target.value })
                }
                style={{
                  padding: "0.6rem",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                }}
              />

              <label
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <input
                  type="checkbox"
                  checked={formData.activo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      activo: e.target.checked,
                    })
                  }
                />
                Activo
              </label>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "1rem",
                }}
              >
                <button
                  onClick={handleSubmit}
                  style={{
                    background: "#667eea",
                    color: "white",
                    border: "none",
                    padding: "0.6rem 1rem",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Guardar
                </button>
                <button
                  onClick={() => setFormVisible(false)}
                  style={{
                    background: "#f3f4f6",
                    color: "#111827",
                    border: "none",
                    padding: "0.6rem 1rem",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
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