<template>
  <div class="dashboard-container">
    <div class="content-wrapper">
      <!-- Filtros -->
      <div class="filters-card">
        <div class="filter-item">
          <label>Fecha Inicio</label>
          <input type="date" v-model="fechaInicio" />
        </div>
        <div class="filter-item">
          <label>Fecha Fin</label>
          <input type="date" v-model="fechaFin" />
        </div>
        <button v-if="fechaInicio || fechaFin" class="btn-clear" @click="clearFilters">Limpiar filtros</button>

        <div class="total-registros">
          Total registros: <strong>{{ data.length }}</strong>
        </div>
      </div>

      <!-- Export Buttons -->
      <div class="export-card">
        <button @click="exportCSV" :disabled="!data.length" class="btn-export">CSV</button>
        <button @click="exportXLSX" :disabled="!data.length" class="btn-export">XLSX</button>
        <button @click="exportPDF" :disabled="!data.length" class="btn-export">PDF</button>
      </div>

      <!-- Tabla de datos -->
      <div class="table-card">
        <table v-if="!loading && !error">
          <thead>
            <tr>
              <th v-for="key in columns" :key="key">{{ key }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in pagedData" :key="index">
              <td v-for="key in columns" :key="key">{{ row[key] ?? '-' }}</td>
            </tr>
            <tr v-if="pagedData.length === 0">
              <td :colspan="columns.length" style="text-align:center">No hay datos que coincidan con los filtros</td>
            </tr>
          </tbody>
        </table>
        <p v-if="loading">Cargando...</p>
        <p v-if="error" style="color:red">{{ error }}</p>
      </div>

      <!-- Paginación -->
      <div class="pagination" v-if="totalPages > 0 && !loading && !error">
        <button @click="page = Math.max(1, page - 1)" :disabled="page === 1">← Anterior</button>
        <button 
          v-for="item in paginationItems" 
          :key="item" 
          @click="typeof item === 'number' && (page = item)" 
          :disabled="item === '...'"
          :class="{ active: page === item }"
        >
          {{ item }}
        </button>
        <button @click="page = Math.min(totalPages, page + 1)" :disabled="page === totalPages">Siguiente →</button>
      </div>

      <!-- Info registros -->
      <div v-if="!loading && !error" class="info-registros">
        Mostrando {{ startIndex + 1 }} - {{ Math.min(startIndex + pageSize, data.length) }} de {{ data.length }} registros
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const data = ref([]);
const loading = ref(true);
const error = ref("");

const fechaInicio = ref("");
const fechaFin = ref("");

const page = ref(1);
const pageSize = ref(10);

const fetchData = async () => {
  try {
    loading.value = true;
    let url = `https://localhost:44353/api/ReporteEventos?`;
    if (fechaInicio.value) url += `fecha_inicio=${fechaInicio.value}&`;
    if (fechaFin.value) url += `fecha_fin=${fechaFin.value}&`;

    const res = await fetch(url);
    const json = await res.json();
    data.value = formatDataForDisplay(Array.isArray(json) ? json : []);
    error.value = "";
    page.value = 1;
  } catch (err) {
    error.value = "Error al cargar los datos";
    data.value = [];
  } finally {
    loading.value = false;
  }
};

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

onMounted(fetchData);
watch([fechaInicio, fechaFin], fetchData);

const clearFilters = () => {
  fechaInicio.value = "";
  fechaFin.value = "";
};

const columns = computed(() => (data.value[0] ? Object.keys(data.value[0]) : []));
const startIndex = computed(() => (page.value - 1) * pageSize.value);
const pagedData = computed(() => data.value.slice(startIndex.value, startIndex.value + pageSize.value));
const totalPages = computed(() => Math.ceil(data.value.length / pageSize.value));

const paginationItems = computed(() => {
  const items = [];
  const maxVisible = 5;
  if (totalPages.value <= maxVisible + 2) {
    for (let i = 1; i <= totalPages.value; i++) items.push(i);
  } else {
    items.push(1);
    let start = Math.max(2, page.value - 1);
    let end = Math.min(totalPages.value - 1, page.value + 1);
    if (page.value <= 3) start = 2, end = Math.min(maxVisible, totalPages.value - 1);
    if (page.value >= totalPages.value - 2) start = Math.max(2, totalPages.value - maxVisible + 1), end = totalPages.value - 1;
    if (start > 2) items.push('...');
    for (let i = start; i <= end; i++) items.push(i);
    if (end < totalPages.value - 1) items.push('...');
    items.push(totalPages.value);
  }
  return items;
});

// Export functions
const exportCSV = () => {
  if (!data.value.length) return;
  const header = Object.keys(data.value[0]);
  const rows = data.value.map(obj => header.map(h => obj[h]));
  const csvContent = [header.join(","), ...rows.map(r => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, `reporte_${new Date().toISOString().split('T')[0]}.csv`);
};

const exportXLSX = () => {
  if (!data.value.length) return;
  const ws = XLSX.utils.json_to_sheet(data.value);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Reporte");
  XLSX.writeFile(wb, `reporte_${new Date().toISOString().split('T')[0]}.xlsx`);
};

const exportPDF = () => {
  if (!data.value.length) return;
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  doc.setFontSize(18);
  doc.text("Reporte Eventos", doc.internal.pageSize.getWidth() / 2, 30, { align: "center" });

  if (fechaInicio.value || fechaFin.value) {
    doc.setFontSize(10);
    let filterText = "Filtrado: ";
    if (fechaInicio.value) filterText += `Desde ${fechaInicio.value} `;
    if (fechaFin.value) filterText += `Hasta ${fechaFin.value}`;
    doc.text(filterText, doc.internal.pageSize.getWidth() / 2, 45, { align: "center" });
  }

  const cols = Object.keys(data.value[0]);
  const rows = data.value.map(obj => cols.map(c => obj[c]));
  autoTable(doc, {
    startY: fechaInicio.value || fechaFin.value ? 55 : 50,
    head: [cols],
    body: rows,
    theme: "grid",
    headStyles: { fillColor: [102, 126, 234], textColor: 255, fontStyle: "bold" },
    bodyStyles: { fontSize: 9 },
    alternateRowStyles: { fillColor: [240, 243, 248] },
    margin: { left: 20, right: 20 },
  });

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(`Exportado: ${new Date().toLocaleString("es-MX")}`, doc.internal.pageSize.getWidth() - 20, doc.internal.pageSize.getHeight() - 10, { align: "right" });
  }

  doc.save(`reporte_${new Date().toISOString().split('T')[0]}.pdf`);
};
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
.content-wrapper { max-width: 1400px; margin: 0 auto; }
.filters-card {
  display: flex; gap: 1rem; flex-wrap: wrap; align-items: flex-end;
  background: white; border-radius: 16px; padding: 1.5rem; margin-bottom: 1rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}
.filter-item { flex: 0 1 200px; display: flex; flex-direction: column; }
.filter-item label { margin-bottom: 0.5rem; font-weight: 600; font-size: 0.9rem; color: #374151; }
.filter-item input { padding: 0.6rem; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.95rem; }
.btn-clear { padding: 0.6rem 1rem; border-radius: 8px; border: 1px solid #cbd5e1; background: #f3f4f6; cursor: pointer; font-size: 0.95rem; font-weight: 500; }
.total-registros { flex: 1 1 auto; text-align: right; font-size: 0.9rem; color: #6b7280; }
.export-card { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
.btn-export { background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 0.6rem 1rem; border-radius: 8px; font-weight: 600; cursor: pointer; }
.table-card { background: white; border-radius: 16px; padding: 2rem; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow-x: auto; }
.table-card table { width: 100%; border-collapse: collapse; }
.table-card th { background: #f0f4f8; font-weight: 600; padding: 0.75rem; text-align: left; }
.table-card td { padding: 0.75rem; color: #374151; }
.pagination { display: flex; justify-content: center; gap: 0.25rem; margin-top: 1rem; flex-wrap: wrap; }
.pagination button { padding: 0.5rem 0.75rem; border-radius: 6px; border: 1px solid #cbd5e1; cursor: pointer; }
.pagination button.active { border: 2px solid #667eea; font-weight: 700; background: #e0e7ff; }
.info-registros { margin-top: 1rem; text-align: center; color: #6b7280; font-size: 0.875rem; }
</style>
