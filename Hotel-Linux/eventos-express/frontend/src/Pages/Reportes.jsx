import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const reportesConfig = [
  { endpoint: "eventos-responsable", title: "Eventos con Responsable" },
  { endpoint: "eventos-participantes", title: "Eventos con Participantes" },
  { endpoint: "eventos-staff", title: "Eventos con Staff" },
  { endpoint: "materiales-responsable", title: "Materiales con Responsable" },
  { endpoint: "full", title: "Reporte Completo" },
];

export default function DashboardReportes() {
  const [activeTab, setActiveTab] = useState(reportesConfig[0].endpoint);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Filtros de fecha
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  // Paginación
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatDataForDisplay = (rawData) => {
    return rawData.map(row => {
      const formattedRow = { ...row };
      Object.keys(formattedRow).forEach(key => {
        if (key.toLowerCase().includes("fecha") && formattedRow[key]) {
          formattedRow[key] = formatDate(formattedRow[key]);
        }
      });
      return formattedRow;
    });
  };

  const fetchData = async (endpoint) => {
    try {
      setLoading(true);
      let url = `http://localhost:3000/api/reportes/${endpoint}?`;
      
      if (fechaInicio) url += `fecha_inicio=${fechaInicio}&`;
      if (fechaFin) url += `fecha_fin=${fechaFin}&`;

      const res = await fetch(url);
      const json = await res.json();
      const formattedData = formatDataForDisplay(Array.isArray(json) ? json : []);
      setData(formattedData);
      setError("");
      setPage(1); // Reset a página 1 cuando cambian los datos
    } catch (err) {
      setError("Error al cargar los datos");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab, fechaInicio, fechaFin]);

  const clearFilters = () => {
    setFechaInicio("");
    setFechaFin("");
  };

  // Paginación
  const startIndex = (page - 1) * pageSize;
  const pagedData = data.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(data.length / pageSize);

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

  const exportCSV = () => {
    if (!data.length) return;
    const header = Object.keys(data[0]);
    const rows = data.map(obj => header.map(h => obj[h]));
    const csvContent = [header.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `${activeTab}_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const exportXLSX = () => {
    if (!data.length) return;
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reporte");
    XLSX.writeFile(wb, `${activeTab}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportPDF = () => {
    if (!data.length) return;

    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });

    // Título
    doc.setFontSize(18);
    doc.setTextColor(40);
    const title = reportesConfig.find(r => r.endpoint === activeTab)?.title || "";
    doc.text(title, doc.internal.pageSize.getWidth() / 2, 30, { align: "center" });

    // Subtítulo con filtros si existen
    if (fechaInicio || fechaFin) {
      doc.setFontSize(10);
      doc.setTextColor(100);
      let filterText = "Filtrado: ";
      if (fechaInicio) filterText += `Desde ${fechaInicio} `;
      if (fechaFin) filterText += `Hasta ${fechaFin}`;
      doc.text(filterText, doc.internal.pageSize.getWidth() / 2, 45, { align: "center" });
    }

    // Columnas y filas
    const columns = Object.keys(data[0]);
    const rows = data.map(obj => columns.map(c => obj[c]));

    autoTable(doc, {
      startY: fechaInicio || fechaFin ? 55 : 50,
      head: [columns],
      body: rows,
      theme: "grid",
      headStyles: { fillColor: [102, 126, 234], textColor: 255, fontStyle: "bold" },
      bodyStyles: { fontSize: 9 },
      alternateRowStyles: { fillColor: [240, 243, 248] },
      margin: { left: 20, right: 20 },
    });

    // Pie de página con fecha
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(`Exportado: ${new Date().toLocaleString("es-MX")}`, doc.internal.pageSize.getWidth() - 20, doc.internal.pageSize.getHeight() - 10, { align: "right" });
    }

    doc.save(`${activeTab}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const activeTitle = reportesConfig.find(r => r.endpoint === activeTab)?.title;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", padding: "2rem", fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Pestañas */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
          {reportesConfig.map((r) => (
            <button
              key={r.endpoint}
              onClick={() => setActiveTab(r.endpoint)}
              style={{
                padding: "0.6rem 1rem",
                borderRadius: "8px",
                border: activeTab === r.endpoint ? "2px solid #667eea" : "1px solid #cbd5e1",
                background: activeTab === r.endpoint ? "#e0e7ff" : "white",
                cursor: "pointer",
                fontWeight: activeTab === r.endpoint ? 700 : 500
              }}
            >
              {r.title}
            </button>
          ))}
        </div>

        {/* Filtros de fecha */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "1.5rem",
            marginBottom: "1.5rem",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div style={{ flex: "0 1 200px" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.9rem", color: "#374151" }}>
              Fecha Inicio
            </label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              style={{
                width: "100%",
                padding: "0.6rem",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                fontSize: "0.95rem",
              }}
            />
          </div>

          <div style={{ flex: "0 1 200px" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.9rem", color: "#374151" }}>
              Fecha Fin
            </label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              style={{
                width: "100%",
                padding: "0.6rem",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                fontSize: "0.95rem",
              }}
            />
          </div>

          {(fechaInicio || fechaFin) && (
            <button
              onClick={clearFilters}
              style={{
                padding: "0.6rem 1rem",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                background: "#f3f4f6",
                cursor: "pointer",
                fontSize: "0.95rem",
                fontWeight: 500,
                marginTop: "1.5rem"
              }}
            >
              Limpiar filtros
            </button>
          )}

          <div style={{ flex: "1 1 auto", display: "flex", justifyContent: "flex-end", alignItems: "flex-end", marginTop: "1.5rem" }}>
            <span style={{ fontSize: "0.9rem", color: "#6b7280" }}>
              Total registros: <strong>{data.length}</strong>
            </span>
          </div>
        </div>

        {/* Header tabla + export */}
        <div style={{ background: "white", borderRadius: "16px", padding: "2rem", marginBottom: "2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <h1 style={{ margin: 0, fontSize: "1.875rem", fontWeight: 700, color: "#1e3c72" }}>{activeTitle}</h1>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button onClick={exportCSV} disabled={!data.length} style={{...btnStyle, opacity: data.length ? 1 : 0.5, cursor: data.length ? "pointer" : "not-allowed"}}>CSV</button>
            <button onClick={exportXLSX} disabled={!data.length} style={{...btnStyle, opacity: data.length ? 1 : 0.5, cursor: data.length ? "pointer" : "not-allowed"}}>XLSX</button>
            <button onClick={exportPDF} disabled={!data.length} style={{...btnStyle, opacity: data.length ? 1 : 0.5, cursor: data.length ? "pointer" : "not-allowed"}}>PDF</button>
          </div>
        </div>

        {/* Tabla */}
        <div style={{ background: "white", borderRadius: "16px", padding: "2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", overflowX: "auto" }}>
          {loading ? <p>Cargando...</p> : error ? <p style={{ color: "#ef4444" }}>{error}</p> : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f0f4f8" }}>
                  {data[0] && Object.keys(data[0]).map((key) => (
                    <th key={key} style={{ padding: "0.75rem", textAlign: "left", fontWeight: 600, color: "#374151" }}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pagedData.length === 0 && (
                  <tr>
                    <td colSpan={data[0] ? Object.keys(data[0]).length : 1} style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>
                      No hay datos que coincidan con los filtros
                    </td>
                  </tr>
                )}
                {pagedData.map((row, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #e2e8f0" }}>
                    {Object.values(row).map((val, j) => (
                      <td key={j} style={{ padding: "0.75rem", color: "#374151" }}>{val?.toString() || "-"}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Paginación Dinámica */}
          {totalPages > 0 && !loading && !error && (
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
          {totalPages > 0 && !loading && !error && (
            <div style={{ marginTop: "1rem", textAlign: "center", color: "#6b7280", fontSize: "0.875rem" }}>
              Mostrando {startIndex + 1} - {Math.min(startIndex + pageSize, data.length)} de {data.length} registros
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const btnStyle = {
  background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  border: "none",
  padding: "0.6rem 1rem",
  borderRadius: "8px",
  fontWeight: 600
};