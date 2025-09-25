export async function obtenerDatosEstadisticos() {
  try {
    const res = await fetch('http://localhost:3001/reportes');
    if (!res.ok) {
      throw new Error(`Error fetching data: ${res.status}`);
    }
    const reportes = await res.json();

    const totalReportes = reportes.length;
    const problemasResueltos = reportes.filter(r => r.state === 'atendido').length;
    const usuariosActivos = new Set(reportes.map(r => r.userId || 'anonymous')).size; // Fallback si no hay userId

    // Para promedio de días: solo para reportes atendidos con fechas
    const dias = reportes
      .filter(r => r.state === 'atendido' && r.fechaResolucion && r.fechaCreacion)
      .map(r => {
        const inicio = new Date(r.fechaCreacion);
        const fin = new Date(r.fechaResolucion);
        return (fin - inicio) / (1000 * 60 * 60 * 24); // Diferencia en días
      });

    const promedioDias = dias.length > 0
      ? (dias.reduce((a, b) => a + b, 0) / dias.length).toFixed(1)
      : '0';

    return { totalReportes, problemasResueltos, usuariosActivos, promedioDias };
  } catch (error) {
    console.error('Error obteniendo datos estadísticos:', error);
    return { totalReportes: 0, problemasResueltos: 0, usuariosActivos: 0, promedioDias: '0' };
  }
}

