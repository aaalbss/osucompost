import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip as ChartTooltip, Legend as ChartLegend, ArcElement } from 'chart.js';
import { 
  LineChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  Line as RechartsLine,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend
} from 'recharts';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, ChartTooltip, ChartLegend, ArcElement);

const ResiduosRecogidos = () => {
  const [acumuladoTotal, setAcumuladoTotal] = useState(0);
  const [kgRecogidos, setKgRecogidos] = useState(0);
  const [remuneracion, setRemuneracion] = useState(0);

  const barChartRef = useRef(null);
  const lineChartRef = useRef(null);
  const remunerationChartRef = useRef(null);
  const bumpChartRef = useRef(null);

  const isBarChartVisible = useInView(barChartRef, { once: false, amount: 0.3 });
  const isLineChartVisible = useInView(lineChartRef, { once: false, amount: 0.3 });
  const isRemunerationChartVisible = useInView(remunerationChartRef, { once: false, amount: 0.3 });
  const isBumpChartVisible = useInView(bumpChartRef, { once: false, amount: 0.3 });

  const contenedores = [
    { tipo: '16L', numContenedores: 40, tpoContenedor: 16 },
    { tipo: '160L', numContenedores: 5, tpoContenedor: 160 },
    { tipo: '800L', numContenedores: 2, tpoContenedor: 800 },
    { tipo: '1200L', numContenedores: 1, tpoContenedor: 1200 },
  ];

  const bumpData = [
    {
      mes: "Enero",
      "16L": 12,
      "160L": 8,
      "800L": 5,
      "1200L": 3
    },
    {
      mes: "Febrero",
      "16L": 18,
      "160L": 14,
      "800L": 7,
      "1200L": 6
    },
    {
      mes: "Marzo",
      "16L": 15,
      "160L": 10,
      "800L": 12,
      "1200L": 4
    },
    {
      mes: "Abril",
      "16L": 20,
      "160L": 16,
      "800L": 9,
      "1200L": 5
    }
  ];

  useEffect(() => {
    let totalResiduos = 0;
    contenedores.forEach(cont => {
      totalResiduos += cont.numContenedores * cont.tpoContenedor;
    });

    const kgTotales = totalResiduos * 0.625;
    const remuneracionTotal = totalResiduos * 0.02;

    setAcumuladoTotal(totalResiduos);
    setKgRecogidos(kgTotales);
    setRemuneracion(remuneracionTotal);
  }, []);

  const barChartData = {
    labels: contenedores.map(cont => cont.tipo),
    datasets: [
      {
        label: 'Acumulado Total (L)',
        data: contenedores.map(cont => cont.numContenedores * cont.tpoContenedor),
        backgroundColor: 'rgb(71, 99, 55)',
      },
    ],
  };

  const lineChartData = {
    labels: contenedores.map(cont => cont.tipo),
    datasets: [
      {
        label: 'KG Recogidos',
        data: contenedores.map(cont => cont.numContenedores * cont.tpoContenedor * 0.625),
        borderColor: 'rgb(71, 99, 55)',
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const remunerationChartData = {
    labels: contenedores.map(cont => cont.tipo),
    datasets: [
      {
        label: 'Remuneración (€)',
        data: contenedores.map(cont => cont.numContenedores * cont.tpoContenedor * 0.02),
        backgroundColor: 'rgb(71, 99, 55)',
      },
    ],
  };

  const chartVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="p-6">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 2 }}
        className="space-y-8"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">ACUMULADO TOTAL DE RESIDUOS RECOGIDOS</h2>
          <p className="text-xl">{acumuladoTotal} L</p>
          <p className="text-xl">{kgRecogidos.toFixed(2)} KG</p>
          <p className="text-xl">Remuneración: {remuneracion.toFixed(2)} €</p>
        </div>

        <div className="w-4/5 mx-auto space-y-12">
          <motion.div
            ref={barChartRef}
            variants={chartVariants}
            initial="hidden"
            animate={isBarChartVisible ? "visible" : "hidden"}
          >
            <h3 className="text-xl font-semibold mb-4">Acumulado Total (L)</h3>
            <Bar data={barChartData} />
          </motion.div>
          
          <motion.div
            ref={lineChartRef}
            variants={chartVariants}
            initial="hidden"
            animate={isLineChartVisible ? "visible" : "hidden"}
          >
            <h3 className="text-xl font-semibold mb-4">KG Recogidos</h3>
            <Line data={lineChartData} />
          </motion.div>
          
          <motion.div
            ref={remunerationChartRef}
            variants={chartVariants}
            initial="hidden"
            animate={isRemunerationChartVisible ? "visible" : "hidden"}
          >
            <h3 className="text-xl font-semibold mb-4">Remuneración (€)</h3>
            <Bar data={remunerationChartData} />
          </motion.div>

          <motion.div
            ref={bumpChartRef}
            variants={chartVariants}
            initial="hidden"
            animate={isBumpChartVisible ? "visible" : "hidden"}
            className="h-[600px]"
          >
            <h3 className="text-xl font-semibold mb-4 text-center">
              CONTENEDORES RECOGIDOS SEGÚN EL TIPO
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={bumpData}
                margin={{ top: 40, right: 30, left: 60, bottom: 90 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="mes" 
                  label={{ 
                    value: 'MES', 
                    position: 'bottom', 
                    offset: 5
                  }}
                />
                <YAxis 
                  label={{ 
                    value: ' NÚMERO DE CONTENEDORES ', 
                    angle: -90, 
                    position:'center', 
                    offset: -20  // Aumentado para alejarlo más
                  }}
                  domain={[0, 25]}
                  ticks={[0, 5, 10, 15, 20, 25]}
                />
                <RechartsTooltip />
                <RechartsLegend 
                  verticalAlign="bottom"  // Coloca la leyenda en la parte inferior
                  align="center"
                  height={36}
                  wrapperStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '8px',
                    padding: '8px',
                    marginTop: '20px',
                    marginBottom: '-40px',
                    marginLeft: '10px',
                  }}
                />
                <RechartsLine
                  type="monotone"
                  dataKey="16L"
                  stroke="#8884d8"
                  strokeWidth={3}
                  dot={{ r: 6 }}
                  activeDot={{ r: 8 }}
                />
                <RechartsLine
                  type="monotone"
                  dataKey="160L"
                  stroke="#82ca9d"
                  strokeWidth={3}
                  dot={{ r: 6 }}
                  activeDot={{ r: 8 }}
                />
                <RechartsLine
                  type="monotone"
                  dataKey="800L"
                  stroke="#ffc658"
                  strokeWidth={3}
                  dot={{ r: 6 }}
                  activeDot={{ r: 8 }}
                />
                <RechartsLine
                  type="monotone"
                  dataKey="1200L"
                  stroke="#ff7300"
                  strokeWidth={3}
                  dot={{ r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResiduosRecogidos;
