import React, { useEffect, useState } from 'react';
import { obtenerDatosEstadisticos } from '../services/feth';
function ResumenEstadisticas() {
  const [datos, setDatos] = useState(null);

  useEffect(() => {
    async function cargarDatos() {
      const resultado = await obtenerDatosEstadisticos();
      setDatos(resultado);
    }

    cargarDatos();
  }, []);

  if (!datos) return <p>Cargando estadísticas...</p>;

  return (
    <div className="resumen-estadisticas">
      <div className="dato">📝 {datos.totalReportes} Reportes Totales</div>
      <div className="dato">✅ {datos.problemasResueltos} Problemas Resueltos</div>
      <div className="dato">👥 {datos.usuariosActivos} Usuarios Activos</div>
      <div className="dato">⏱ {datos.promedioDias} Días Promedio</div>
    </div>
  );
}

export default ResumenEstadisticas;
