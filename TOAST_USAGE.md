# 🔔 Sistema de Notificaciones Toast - Guía de Uso

## Implementación Completa

El sistema de toasts está completamente integrado en la aplicación y listo para usar.

## Cómo Usar

### 1. Importar el Hook

```javascript
import { useToast } from '../contexts/ToastContext';
```

### 2. Usar en tu Componente

```javascript
const MiComponente = () => {
  const { success, error, warning, info } = useToast();

  const handleAction = () => {
    // Mostrar toast de éxito
    success('¡Operación exitosa!');
    
    // Mostrar toast de error
    error('Ocurrió un error');
    
    // Mostrar toast de advertencia
    warning('Ten cuidado con esto');
    
    // Mostrar toast informativo
    info('Información importante');
  };

  return <button onClick={handleAction}>Hacer algo</button>;
};
```

### 3. Personalizar Duración

```javascript
// Toast que dura 5 segundos (por defecto son 3 segundos)
success('Mensaje largo', 5000);
error('Error crítico', 10000);
```

## Tipos de Toast

### ✅ Success (Verde)
```javascript
success('¡Reporte enviado exitosamente!');
```
- **Color:** Verde (#48BB78)
- **Uso:** Confirmaciones, operaciones exitosas
- **Ejemplos:** "Guardado", "Enviado", "Actualizado"

### ❌ Error (Rojo)
```javascript
error('Error al procesar la solicitud');
```
- **Color:** Rojo (#FC8181)
- **Uso:** Errores, fallos, validaciones
- **Ejemplos:** "Error de conexión", "Campos inválidos"

### ⚠️ Warning (Naranja)
```javascript
warning('Esta acción no se puede deshacer');
```
- **Color:** Naranja (#F6AD55)
- **Uso:** Advertencias, precauciones
- **Ejemplos:** "Confirmación requerida", "Límite alcanzado"

### ℹ️ Info (Azul)
```javascript
info('Actualizando datos...');
```
- **Color:** Azul (#5A67D8)
- **Uso:** Información general, estados
- **Ejemplos:** "Cargando", "Procesando"

## Ejemplos de Uso Real

### En Dashboard
```javascript
// Al eliminar un reporte
success('Reporte eliminado exitosamente');

// Al actualizar estado
success('Estado actualizado correctamente');

// Al exportar CSV
success('Archivo CSV descargado exitosamente');

// Error de conexión
error('Error al conectar con el servidor');
```

### En ReportForm
```javascript
// Validación fallida
error('Por favor, selecciona una ubicación válida en el mapa');

// Envío exitoso
success('¡Reporte enviado exitosamente! Gracias por tu colaboración.');

// Error al enviar
error('Error al enviar el reporte. Por favor, intenta nuevamente.');
```

### En Login/Register
```javascript
// Login exitoso
success(`¡Bienvenido ${user.name}!`);

// Credenciales inválidas
error('Credenciales inválidas. Verifica tu correo y contraseña');

// Registro exitoso
success(`¡Cuenta creada exitosamente! Bienvenido ${user.name}`);

// Contraseñas no coinciden
error('Las contraseñas no coinciden');
```

## Características

- ✅ **Auto-cierre:** Se cierran automáticamente después de 3 segundos (configurable)
- ✅ **Cierre manual:** Botón X para cerrar manualmente
- ✅ **Múltiples toasts:** Se pueden mostrar varios al mismo tiempo
- ✅ **Animaciones:** Entrada y salida suaves
- ✅ **Responsive:** Se adapta a móviles
- ✅ **Hover:** Efecto de elevación al pasar el mouse
- ✅ **Posición fija:** Esquina superior derecha (no interfiere con el contenido)

## Ubicación en Pantalla

- **Desktop:** Esquina superior derecha
- **Móvil:** Ancho completo en la parte superior

## Personalización Avanzada

Si necesitas más control, puedes usar el método `addToast`:

```javascript
const { addToast } = useToast();

addToast('Mensaje personalizado', 'success', 5000);
```

## Archivos del Sistema

- `src/components/Toast.jsx` - Componente individual
- `src/components/ToastContainer.jsx` - Contenedor de toasts
- `src/contexts/ToastContext.jsx` - Context y hook
- `src/styles/Toast.css` - Estilos
- `src/App.jsx` - Integración global

## Integrado en

✅ Dashboard (eliminar, actualizar, exportar)
✅ ReportForm (validaciones, envío)
✅ LoginForm (login, validaciones)
✅ RegisterForm (registro, validaciones)

## Próximas Mejoras Opcionales

- [ ] Sonidos de notificación
- [ ] Progreso visual del tiempo restante
- [ ] Acciones en toasts (botones)
- [ ] Posiciones configurables
- [ ] Temas personalizados
