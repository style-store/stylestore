# TechStyleStore Perú 🇵🇪

Sistema integral de gestión de ventas, inventarios y tienda virtual para emprendimientos de tecnología.

## 🚀 Guía de Configuración (GitHub)

Si ves el error `remote origin already exists` al intentar conectar tu repositorio, sigue estos pasos:

1. **Limpiar configuración antigua:**
   ```bash
   git remote remove origin
   ```

2. **Conectar a tu repositorio:**
   ```bash
   git remote add origin https://github.com/mirella29/techstyle-peru.git
   ```

3. **Subir cambios por primera vez:**
   ```bash
   git push -u origin main
   ```

## 🔐 Autenticación: ¿Web o Código?

**Recomendación Profesional:**
Es mejor usar la **Autenticación Web de VS Code**. Cuando intentes hacer un `push`, VS Code te pedirá permiso para abrir el navegador. Esto es más seguro y evita tener que configurar "Personal Access Tokens" (PAT) manualmente.

**Si la terminal te pide contraseña:**
No pongas tu contraseña de GitHub (no funcionará). Debes generar un **Token de Acceso Personal** en:
`GitHub > Settings > Developer Settings > Personal access tokens > Tokens (classic)`

## Características principales:
- **Tienda Virtual (Vista Cliente):** Interfaz inspirada en Temu con carrito de compras y checkout rápido.
- **Gestión Administrativa:** CRUD de productos y categorías.
- **Control de Inventario:** Movimientos de entrada/salida y alertas de stock bajo.
- **Facturación:** Generación de boletas/facturas electrónicas representativas con códigos QR de pago.
- **Análisis de Negocio:** Reportes de márgenes de ganancia y ranking de productos más rentables.

## Tecnologías:
- React 19
- Tailwind CSS
- Lucide React
- Recharts
- Vite

## Despliegue:
El proyecto está configurado para desplegarse automáticamente en **Vercel** mediante conexión con este repositorio. Cada `git push` actualizará tu sitio web en vivo.
