# 🛣️ Sistema de Reportes de Vías

Sistema web interactivo para la gestión y visualización de reportes sobre el estado de las vías públicas. Permite a los usuarios reportar problemas en las carreteras, visualizarlos en un mapa interactivo y gestionar su seguimiento mediante un dashboard administrativo.

## ✨ Características Principales

### 🎯 Para Usuarios
- **Creación de Reportes**: Formulario intuitivo para reportar problemas en las vías
- **Geolocalización**: Selección de ubicación mediante mapa interactivo con Leaflet
- **Categorización**: Clasificación de reportes por tipo (baches, señalización, iluminación, etc.)
- **Sistema de Calificación**: Evaluación de la severidad del problema con estrellas
- **Galería de Fotos**: Carga de hasta 3 imágenes por reporte
- **Autenticación**: Sistema de registro e inicio de sesión
- **Perfil de Usuario**: Gestión de información personal y cambio de contraseña

### 📊 Dashboard Administrativo
- **Resumen General**: Visualización de estadísticas clave con gráficos interactivos
- **Lista de Reportes**: Tabla completa con filtros avanzados y gestión de estados
- **Mapa Interactivo**: Visualización geográfica de todos los reportes con marcadores por estado
- **Estadísticas Detalladas**: Métricas y análisis por categoría y estado
- **Exportación CSV**: Descarga de datos para análisis externo
- **Actualización en Tiempo Real**: Refresh automático cada 30 segundos
- **Filtros Avanzados**: Por estado, categoría, fecha y búsqueda de texto

### 🎨 Interfaz de Usuario
- **Diseño Moderno**: UI limpia y profesional con animaciones fluidas
- **Efectos Visuales**: Animaciones con GSAP y efectos 3D
- **Responsive**: Adaptable a dispositivos móviles, tablets y desktop
- **Tema Oscuro/Claro**: Sidebar oscuro con contenido claro para mejor contraste
- **Componentes Interactivos**: Carruseles 3D, efectos de hover y transiciones suaves

## 🚀 Tecnologías Utilizadas

### Frontend
- **React 18.2** - Biblioteca de UI
- **Vite 7.1** - Build tool y dev server
- **React Router DOM 6.28** - Navegación y rutas
- **TailwindCSS 4.1** - Framework de estilos utility-first

### Visualización de Datos
- **Chart.js 4.5** - Gráficos y estadísticas
- **React-ChartJS-2 5.3** - Integración de Chart.js con React
- **Leaflet 1.9** - Mapas interactivos
- **React-Leaflet 4.2** - Componentes de Leaflet para React

### Animaciones y Efectos
- **GSAP 3.13** - Animaciones avanzadas
- **OGL 1.0** - Gráficos WebGL para efectos visuales

### Backend
- **JSON Server 1.0** - API REST mock para desarrollo

### Herramientas de Desarrollo
- **ESLint 9.35** - Linter de código
- **PostCSS 8.5** - Procesador de CSS
- **Autoprefixer 10.4** - Prefijos CSS automáticos

## 📋 Requisitos Previos

- **Node.js** (versión 16 o superior)
- **npm** o **yarn**

## 🔧 Instalación

1. **Clonar el repositorio**
```bash
git clone <https://github.com/JeaustinCfwd/Reporte-V-as.git>
cd Reporte-Vias
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar la base de datos**
El archivo `src/services/db.json` contiene la estructura de datos inicial con:
- `reportes`: Reportes de vías
- `users`: Usuarios registrados
- `reviews`: Calificaciones y comentarios

## 🎮 Uso

### Modo Desarrollo

1. **Iniciar el servidor de desarrollo**
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`

2. **Iniciar el servidor JSON (en otra terminal)**
```bash
npm run server
```
La API estará disponible en `http://localhost:3001`

### Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo con Vite

# Backend Mock
npm run server       # Inicia JSON Server en puerto 3001

# Producción
npm run build        # Construye la aplicación para producción
npm run preview      # Preview de la build de producción

# Calidad de Código
npm run lint         # Ejecuta ESLint para verificar el código
```

## 🎨 Características de la UI

### Componentes Destacados

- **Dashboard**: Panel administrativo completo con sidebar colapsable
- **Gráficos Interactivos**: Visualización de datos con Chart.js
- **Mapa con Leaflet**: Marcadores personalizados por estado de reporte
- **Carruseles 3D**: Efectos visuales avanzados con OGL
- **Sistema de Rating**: Calificación visual con estrellas
- **Formularios Validados**: Validación en tiempo real
- **Efectos de Hover**: Animaciones suaves con GSAP

### Estados de Reportes

- 🆕 **Nuevo**: Reporte recién creado (color rojo)
- 🔍 **En Revisión**: Reporte siendo evaluado (color azul)
- ✅ **Atendido**: Reporte resuelto (color verde)

### Categorías de Reportes

- Baches
- Señalización
- Iluminación
- Limpieza
- Vegetación
- Drenaje
- Otro

## 🔐 Autenticación

El sistema incluye:
- Registro de usuarios con validación de email
- Login con persistencia de sesión
- Gestión de perfil de usuario
- Cambio de contraseña
- Carga de foto de perfil

## 📊 Funcionalidades del Dashboard

### Filtros Disponibles
- **Por Estado**: Nuevos, En Revisión, Atendidos
- **Por Categoría**: Todas las categorías de reportes
- **Por Fecha**: Rango de fechas personalizado
- **Búsqueda**: Por título o descripción

### Vistas del Dashboard
1. **Resumen General**: Cards de estadísticas + gráficos de tendencia
2. **Lista de Reportes**: Tabla completa con acciones
3. **Mapa Interactivo**: Visualización geográfica
4. **Estadísticas Detalladas**: Métricas avanzadas

## 🌐 API Endpoints (JSON Server)

```
GET    /reportes          # Obtener todos los reportes
POST   /reportes          # Crear nuevo reporte
GET    /reportes/:id      # Obtener reporte específico
PATCH  /reportes/:id      # Actualizar reporte
DELETE /reportes/:id      # Eliminar reporte

GET    /users             # Obtener usuarios
POST   /users             # Crear usuario
GET    /users/:id         # Obtener usuario específico
PATCH  /users/:id         # Actualizar usuario

GET    /reviews           # Obtener calificaciones
POST   /reviews           # Crear calificación
```

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👥 Autores

- **Jeaustin CU** - Desarrollo inicial

## 🙏 Agradecimientos

- React y Vite por las herramientas de desarrollo
- Leaflet por los mapas interactivos
- Chart.js por las visualizaciones de datos
- La comunidad open source
