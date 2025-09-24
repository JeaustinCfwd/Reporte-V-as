export async function obtenerDatosEstadisticos() {
const res = await fetch('http://localhost:3001/ReportForm');
const reportes = await res.json();


const totalReportes = reportes.length;
const problemasResueltos = reportes.filter(r => r.estado === 'Resuelto').length;
const usuariosActivos = new Set(reportes.map(r => r.usuarioId)).size;

const dias = reportes.filter (r => r.estado === 'resultado' && r.fechaResolucion).
map(r => {
 const inicio = new Date(r.fechaCreacion);
const fin = new Date(r.fechaResolucion);
 return (fin - inicio) / (1000 * 60 * 60 * 24); // Diferencia en días
});

const promedioDias = dias.length > 0
 ? (dias.reduce((a, b) => a + b, 0) / dias.length).toFixed(1)
 : 0;

return { totalReportes, problemasResueltos, usuariosActivos, promedioDias };
}

