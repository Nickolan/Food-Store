# 🎨 FoodStore Frontend — Portal de Cliente & Panel de Administración

Bienvenido al frontend de **FoodStore**. Esta es una SPA (Single Page Application) moderna y reactiva construida sobre **React 19**, **Vite** y **TypeScript**. La interfaz está diseñada de forma responsiva (Mobile-First) y cuenta con un flujo completo de compras, seguimiento de pedidos en tiempo real e integración con pasarela de pago, además de paneles administrativos dedicados para la gestión de productos, inventario, pedidos y estadísticas del negocio.

---

## 👥 Integrantes (Equipo BOT)
- 👤 **Nicolas Navarrete**
- 👤 **Lautaro Ferreria**
- 👤 **Rafael Navarro**
- 👤 **Lucas Gordillo**

---

## 🛠️ Stack Tecnológico

El proyecto está construido utilizando las siguientes tecnologías y herramientas modernas de desarrollo web:

*   **Núcleo:** React 19 (SPA) + TypeScript
*   **Herramienta de Construcción:** Vite (rápido y eficiente)
*   **Estilos y Layout:** TailwindCSS (Mobile-First & responsive)
*   **Gestión de Estado:** Zustand (ligero, intuitivo y persistente para el carrito)
*   **Consumo de API:** Axios (con interceptores para manejo de tokens y sesiones)
*   **Manejo de Formularios:** @tanstack/react-form (tipado estricto y excelente performance)
*   **Tablas de Datos:** @tanstack/react-table (ordenamiento, filtrado y paginación)
*   **Consultas y Caché de Servidor:** @tanstack/react-query (sincronización y re-fetch inteligente)
*   **Gráficos y Estadísticas:** Recharts (visualizaciones dinámicas en el panel de administrador)
*   **Notificaciones:** React Hot Toast (mensajes dinámicos no intrusivos)

---

## 🚀 Instrucciones de Setup (Instalación en Limpio)

Seguí estos pasos para clonar, configurar y levantar la aplicación del frontend en tu entorno local.

### 📋 Prerrequisitos
Antes de comenzar, asegúrate de tener instalado en tu máquina limpia:
1.  **Node.js**: Versión `v18.0.0` o superior (Recomendado: `LTS v20+` o `v22+`).
2.  **npm**: Versión `v9.0.0` o superior (viene integrado con Node.js).

---

### ⚙️ Paso a Paso para Levantar el Frontend

#### 1. Navegar al directorio del Frontend
Abre una terminal nueva y dirígete a la carpeta raíz del frontend:
```bash
cd Food-Store
```

#### 2. Configurar Variables de Entorno
Crea el archivo `.env` para que la aplicación conozca dónde se encuentra el backend. Puedes copiar el archivo de ejemplo:

*   **En Linux/macOS/Git Bash:**
    ```bash
    cp .env.example .env
    ```
*   **En Windows (PowerShell):**
    ```powershell
    Copy-Item .env.example .env
    ```
*   **En Windows (CMD):**
    ```cmd
    copy .env.example .env
    ```

Abre el archivo `.env` recién creado. Por defecto, contiene:
```env
VITE_API_BASE_URL=http://localhost:8000/api/v6
```
> [!NOTE]
> Si tu backend corre en otro puerto u otra dirección IP, actualiza el valor de `VITE_API_BASE_URL` para que coincida con la URL base del servidor FastAPI.

#### 3. Instalar las Dependencias
Ejecuta el gestor de paquetes para descargar todas las librerías necesarias del proyecto:
```bash
npm install
```

#### 4. Ejecutar el Servidor de Desarrollo
Inicia el servidor local de desarrollo provisto por Vite:
```bash
npm run dev
```

Una vez ejecutado, la terminal mostrará la URL de acceso local. Por defecto:
👉 **[http://localhost:5173](http://localhost:5173)**

#### 5. Compilar para Producción (Opcional)
Para validar que no existan errores de tipado o empaquetado y generar el bundle final de producción:
```bash
npm run build
```
Para previsualizar la compilación localmente:
```bash
npm run preview
```

---

## 👥 Credenciales de Prueba (Usuarios Semilla)

Para probar la plataforma con diferentes niveles de acceso y flujos de trabajo, la base de datos se inicializa automáticamente en el backend con **4 usuarios preconfigurados** (definidos en `Server/app/db/seed.py`). 

> [!IMPORTANT]
> A diferencia de versiones anteriores de la documentación, las contraseñas reales son seguras, están capitalizadas y finalizan con `1234!`. Asegúrate de ingresar las credenciales tal como se detallan en la siguiente tabla:

| Rol de Usuario | Email de Acceso | Contraseña | Permisos e Interacción en el Frontend |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@foodstore.com` | `Admin1234!` | Acceso completo: administración de usuarios, creación/edición de productos, ingredientes y visualización de reportes del negocio. |
| **Stock Manager** | `stock@foodstore.com` | `Stock1234!` | Acceso exclusivo al control de inventario: abastecimiento y actualización de insumos e ingredientes. |
| **Pedidos Manager** | `pedidos@foodstore.com` | `Pedidos1234!` | Acceso a la gestión operativa: control de la cocina, cambio de estados de pedidos (`EN PREPARACIÓN`, `EN CAMINO`, etc.). |
| **Cliente** | `client@foodstore.com` | `Client1234!` | Acceso de consumidor: exploración del catálogo de platos, armado de carrito, proceso de checkout y consulta de historial de compras personales. |

---

## 📁 Estructura del Código Fuente (`src/`)

El código sigue una arquitectura modular y limpia para facilitar su mantenimiento:

*   📂 **`api/`**: Contiene las definiciones de llamadas HTTP utilizando Axios agrupadas por entidad (`authApi`, `productosApi`, `pedidosApi`, etc.).
*   📂 **`config/`**: Configuraciones generales de la app (por ejemplo, resolución de variables de entorno).
*   📂 **`context/`**: Proveedores de contexto de React (como el `AuthContext` para mantener la sesión activa).
*   📂 **`features/`**: Componentes globales reutilizables e interactivos (Navbar, Sidebar interactiva plegable, CarritoDrawer, etc.).
*   📂 **`hooks/`**: Custom hooks globales (`useCarrito`, `useAuth`, etc.) para desacoplar la lógica de estado de los componentes visuales.
*   📂 **`models/`**: Definiciones de interfaces TypeScript que estructuran los modelos de datos compartidos con el backend.
*   📂 **`pages/`**: Vistas completas de la aplicación (Landing, Catálogo, Login, Checkout, Mis Pedidos, y todas las pantallas de administración adaptadas para dispositivos móviles).
*   📂 **`reducer/`**: Lógica de gestión de estado del carrito de compras.

---

## 🛠️ &nbsp; Resolución de Problemas Comunes (Troubleshooting)

### 🔴 "Error de conexión con el servidor" al intentar iniciar sesión
*   **Causa:** El backend no está corriendo, o la variable `VITE_API_BASE_URL` en tu `.env` apunta a una dirección incorrecta.
*   **Solución:** Verifica que el servidor FastAPI esté corriendo en `http://localhost:8000`. Chequea que el `.env` del frontend tenga la URL exacta con la versión del API (`/api/v6`).

### 🔴 Bloqueo por políticas de CORS en las peticiones del navegador
*   **Causa:** El backend no permite peticiones provenientes del puerto del frontend (ej. `http://localhost:5173`).
*   **Solución:** Asegúrate de que en el archivo `.env` del servidor tengas configurada la variable `CORS_ORIGINS` permitiendo el origen del frontend: `CORS_ORIGINS=["http://localhost:5173", "http://127.0.0.1:5173"]`.

### 🔴 Error al compilar o dependencias conflictivas tras una actualización
*   **Causa:** Caché de npm desactualizada o conflictos con versiones locales.
*   **Solución:** Limpia las dependencias e instálalas de nuevo:
    ```bash
    rm -rf node_modules package-lock.json
    npm install
    ```