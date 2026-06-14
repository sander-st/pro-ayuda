# 🎫 Pollada Solidaria - Plataforma Web

Una aplicación web robusta, modular y móvil-first para gestionar la venta y distribución de boletos de una "Pollada Solidaria". Está diseñada con Astro (SSR), Tailwind CSS, Prisma ORM y PostgreSQL, optimizada para un alto rendimiento y adaptada para ser desplegada en **Netlify**.

---

## 🚀 Características Principales

### 📱 Para los Compradores (Landing Page)
- **Información del Evento**: Sección persuasiva con detalles del caso social y métodos de pago (Yape/Plin, BCP).
- **Copiado al Portapapeles**: Botones interactivos rápidos para copiar números de cuenta y celular de pago sin errores.
- **Formulario Dinámico**: Oculta o muestra campos de dirección según el tipo de entrega seleccionado (Delivery / Recojo).
- **Generación de Ticket Digital (HTML5 Canvas)**: Al confirmar la reserva, el navegador genera dinámicamente un ticket en imagen PNG personalizada con el nombre, cantidad de porciones e identificador de ticket.
- **Integración con WhatsApp**: Redirección automática y estructurada con emojis para enviar la confirmación y captura de pantalla del pago directamente a los organizadores.

### 📊 Para los Organizadores (Panel Administrativo)
- **Consola de Métricas**: Tarjetas informativas con el total de porciones vendidas, dinero real recaudado (solamente reservas pagadas), y distribución logística (Delivery vs. Recojo en Local).
- **Control de Acceso**: Autenticación simple mediante contraseña almacenada en base de datos.
- **Gestión de Pedidos en Tiempo Real**: Tabla interactiva para alternar los estados de pago (`estadoPago`) y entrega (`entregado`) mediante peticiones `fetch` asíncronas a endpoints dedicados.

---

## 🏛️ Arquitectura del Proyecto

El proyecto sigue los principios de la **Clean Architecture** (Arquitectura Limpia) y el patrón modular:

```text
├── prisma/
│   └── schema.prisma        # Modelo de datos y definición de PostgreSQL
├── src/
│   ├── components/
│   │   ├── TicketCanvas.astro # Canvas HTML5 para renderizar el boleto digital en PNG
│   │   └── ...
│   ├── features/            # Lógica y módulos organizados por dominio
│   ├── layouts/
│   │   └── Layout.astro     # Plantilla base y tipografías (Plus Jakarta Sans)
│   ├── lib/
│   │   └── db.ts            # Cliente unificado de Prisma para evitar fugas de conexión
│   ├── pages/
│   │   ├── index.astro      # Portal público para clientes
│   │   ├── admin.astro      # Panel de administración e inicio de sesión
│   │   └── api/             # Endpoints del servidor (SSR)
│   │       ├── reservas.ts      # Registro de nuevas reservas y enlace de WhatsApp
│   │       ├── toggle-entrega.ts # Actualización de despacho/entrega
│   │       └── toggle-pago.ts    # Actualización de confirmación de pago
│   ├── styles/              # Configuración de estilos globales y Tailwind CSS
├── netlify.toml             # Configuración del despliegue para Netlify
├── astro.config.mjs         # Configuración del motor SSR de Astro y adaptador Netlify
└── package.json             # Dependencias y comandos de ejecución
```

---

## 💾 Modelado de Datos (Prisma Schema)

La base de datos utiliza PostgreSQL con la siguiente estructura:

*   **`Reserva`**: Almacena el nombre del comprador, número de WhatsApp, cantidad de porciones, tipo de entrega (Delivery o Recojo en Local), dirección física (opcional), estado de pago y estado de entrega.
*   **`AdminConfig`**: Almacena las configuraciones de administración, como la contraseña de acceso al panel de control.

---

## 🛠️ Desarrollo Local

### Requisitos Previos
- Node.js >= 22.12.0
- pnpm instalado (`npm i -g pnpm`)
- Una base de datos PostgreSQL activa

### Instrucciones de Instalación

1. **Clonar el repositorio**:
   ```bash
   git clone <url-del-repositorio>
   cd pro-ayuda
   ```

2. **Instalar dependencias**:
   ```bash
   pnpm install
   ```

3. **Configurar Variables de Entorno**:
   Crea un archivo `.env` en la raíz del proyecto y añade tu cadena de conexión de PostgreSQL:
   ```env
   DATABASE_URL="postgresql://usuario:password@localhost:5432/pollada_db?schema=public"
   ```

4. **Empujar la Estructura de la Base de Datos**:
   Sincroniza el esquema de Prisma con PostgreSQL:
   ```bash
   pnpm prisma db push
   ```

5. **Iniciar Servidor de Desarrollo**:
   ```bash
   pnpm dev
   ```
   El sitio estará disponible en `http://localhost:4321`.

---

## ☁️ Despliegue en Netlify

El proyecto ya cuenta con el adaptador oficial `@astrojs/netlify` configurado en [astro.config.mjs](file:///home/s4nder/Desktop/s4nder/repos/pro-ayuda/astro.config.mjs) y un archivo [netlify.toml](file:///home/s4nder/Desktop/s4nder/repos/pro-ayuda/netlify.toml).

### Pasos para Desplegar:
1. Sube tu código a un repositorio Git (GitHub, GitLab, etc.).
2. Conecta tu repositorio en tu cuenta de Netlify.
3. Netlify detectará automáticamente el archivo `netlify.toml` y configurará los siguientes parámetros:
   - **Build Command**: `pnpm build`
   - **Publish Directory**: `dist`
4. **IMPORTANTE**: Ve a la pestaña **Site configuration** > **Environment variables** en el panel de control de tu sitio en Netlify y añade la siguiente variable:
   - `DATABASE_URL`: Tu cadena de conexión PostgreSQL de producción (ej. Prisma Accelerate, Neon, Supabase).
5. Haz clic en **Deploy site**. ¡Tu aplicación estará en línea y se ejecutará bajo demanda en Netlify Serverless!
