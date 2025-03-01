import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const dataMensual = [
  { fecha: "01", "16L": 5, "160L": 2, "800L": 1, "1200L": 0 },
  { fecha: "05", "16L": 8, "160L": 4, "800L": 3, "1200L": 1 },
  { fecha: "10", "16L": 12, "160L": 6, "800L": 4, "1200L": 2 },
  { fecha: "15", "16L": 10, "160L": 5, "800L": 5, "1200L": 3 },
  { fecha: "20", "16L": 15, "160L": 8, "800L": 6, "1200L": 4 },
  { fecha: "25", "16L": 18, "160L": 10, "800L": 7, "1200L": 5 },
  { fecha: "30", "16L": 20, "160L": 12, "800L": 8, "1200L": 6 },
];

const dataAnual = [
  { fecha: "Ene", "16L": 120, "160L": 60, "800L": 40, "1200L": 20 },
  { fecha: "Feb", "16L": 140, "160L": 70, "800L": 50, "1200L": 30 },
  { fecha: "Mar", "16L": 160, "160L": 80, "800L": 60, "1200L": 40 },
  { fecha: "Abr", "16L": 180, "160L": 90, "800L": 70, "1200L": 50 },
  { fecha: "May", "16L": 200, "160L": 100, "800L": 80, "1200L": 60 },
  { fecha: "Jun", "16L": 220, "160L": 110, "800L": 90, "1200L": 70 },
  { fecha: "Jul", "16L": 240, "160L": 120, "800L": 100, "1200L": 80 },
];

const ContenedoresRecogidos = () => {
  const [data, setData] = useState(dataMensual);
  const [periodo, setPeriodo] = useState("mensual");

  const cambiarPeriodo = () => {
    setData(periodo === "mensual" ? dataAnual : dataMensual);
    setPeriodo(periodo === "mensual" ? "anual" : "mensual");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} style={{ textAlign: "center", padding: "20px" }}>
      <h2>Contenedores Recogidos ({periodo === "mensual" ? "Mes" : "Año"})</h2>
      <button onClick={cambiarPeriodo} style={{ marginBottom: "10px", padding: "8px 16px", cursor: "pointer" }}>
        Ver {periodo === "mensual" ? "Anual" : "Mensual"}
      </button>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="16L" stroke="#4CAF50" strokeWidth={3} animationDuration={800} />
          <Line type="monotone" dataKey="160L" stroke="#2196F3" strokeWidth={3} animationDuration={800} />
          <Line type="monotone" dataKey="800L" stroke="#FF9800" strokeWidth={3} animationDuration={800} />
          <Line type="monotone" dataKey="1200L" stroke="#F44336" strokeWidth={3} animationDuration={800} />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default ContenedoresRecogidos;
