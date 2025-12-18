import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import Eventos from "./Pages/Eventos";
import Participantes from "./Pages/Participantes";
import Staff from "./Pages/Staff"
import Categorias from "./Pages/Categorias";
import Materiales from "./Pages/materiales";
import Reportes from "./Pages/Reportes";
import Salones from "./Pages/Salones";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/eventos" element ={<Eventos />} />
        <Route path="/dashboard/participantes" element ={<Participantes/>} />
        <Route path="/dashboard/staff" element ={<Staff/>} />
        <Route path="/dashboard/categorias" element ={<Categorias/>} />
        <Route path="/dashboard/materiales" element ={<Materiales/>} />
        <Route path="/dashboard/reportes" element ={<Reportes/>} />
        <Route path="/dashboard/salones" element ={<Salones/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
