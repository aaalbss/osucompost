import { ResponsiveBump } from '@nivo/bump';

const GraficoBumpContenedores = () => {
    // Datos de ejemplo: cantidad de contenedores recogidos por tipo en diferentes meses
    const data = [
        {
            id: "16L",
            data: [
                { x: "Enero", y: 12 },
                { x: "Febrero", y: 18 },
                { x: "Marzo", y: 15 },
                { x: "Abril", y: 20 }
            ]
        },
        {
            id: "160L",
            data: [
                { x: "Enero", y: 8 },
                { x: "Febrero", y: 14 },
                { x: "Marzo", y: 10 },
                { x: "Abril", y: 16 }
            ]
        },
        {
            id: "800L",
            data: [
                { x: "Enero", y: 5 },
                { x: "Febrero", y: 7 },
                { x: "Marzo", y: 12 },
                { x: "Abril", y: 9 }
            ]
        },
        {
            id: "1200L",
            data: [
                { x: "Enero", y: 3 },
                { x: "Febrero", y: 6 },
                { x: "Marzo", y: 4 },
                { x: "Abril", y: 5 }
            ]
        }
    ];

    return (
        <div style={{ height: 400 }}>
            <h2 style={{ textAlign: 'center', fontWeight: 'bold', marginBottom:'0px' }}>
                CONTENEDORES RECOGIDOS SEGÚN EL TIPO
            </h2>
            <ResponsiveBump
                data={data}
                margin={{ top: 40, right: 100, bottom: 60, left: 100 }}
                colors={{ scheme: "category10" }}
                lineWidth={3}
                activeLineWidth={6}
                inactiveLineWidth={2}
                inactiveOpacity={0.3}
                pointSize={10}
                activePointSize={16}
                pointBorderWidth={2}
                pointBorderColor={{ from: "serie.color" }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'MES',
                    legendOffset: 20,  // Ajusta el espacio del título
                    legendPosition: 'middle'
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'NÚMERO DE CONTENEDORES',
                    legendOffset: -40,  // Ajusta el espacio del título
                    legendPosition: 'middle'
                }}
            />
        </div>
    );
};

export default GraficoBumpContenedores;
