📋 PLAN DE IMPLEMENTACIÓN: PLATAFORMA WEB - POLLADA SOLIDARIA

Arquitectura: Astro (SSR para Node) + Tailwind CSS + Prisma ORM + PostgreSQL
Orquestador de Automatización: Antigravity CLI (agy)

Este documento contiene la especificación de arquitectura, el esquema de datos y la secuencia exacta de objetivos de ingeniería para construir una aplicación web robusta, auto-administrada y móvil-first.

🏛️ 1. Arquitectura y Estructura del Proyecto

El proyecto se estructurará bajo el patrón híbrido de Astro, utilizando SSR (Server-Side Rendering) para procesar operaciones seguras en el backend (Prisma, consultas a base de datos y endpoints de actualización) y componentes altamente interactivos en el frontend usando Vanilla JS optimizado para mantener la velocidad de carga al máximo en dispositivos móviles.

📂 Estructura de Directorios Propuesta

├── prisma/
│ └── schema.prisma # Definición de modelos de base de datos
├── src/
│ ├── components/
│ │ ├── TicketCanvas.astro # Componente cliente para renderizado de Ticket PNG
│ │ ├── Header.astro # Hero section e información del caso social
│ │ ├── Formulario.astro # Formulario reactivo con condicionales de entrega
│ │ └── MetricasAdmin.astro # Tarjetas de resumen del panel de control
│ ├── layouts/
│ │ └── Layout.astro # Estructura HTML base, viewport y tipografías (Plus Jakarta Sans)
│ ├── pages/
│ │ ├── index.astro # Landing page principal (Público)
│ │ ├── admin.astro # Panel de control del organizador (Dashboard)
│ │ └── api/
│ │ ├── reservas.ts # Endpoint POST: Creación de reserva y generación de link WA
│ │ ├── toggle-pago.ts # Endpoint PATCH: Actualizar estado de pago
│ │ └── toggle-entrega.ts # Endpoint PATCH: Actualizar estado de entrega
├── astro.config.mjs # Configuración de Astro en modo SSR (Node Adapter)
├── tailwind.config.mjs # Tokens de diseño y paleta de colores personalizada
└── package.json

💾 2. Modelado de Base de Datos (Prisma Schema)

El motor relacional (PostgreSQL) clasificará los pedidos y garantizará la integridad de los datos logísticos de entrega mediante tipos enumerados estandarizados.

// prisma/schema.prisma

datasource db {
provider = "postgresql"
url = env("DATABASE_URL")
}

generator client {
provider = "prisma-client-js"
}

enum TipoEntrega {
DELIVERY
RECOJO
}

model Reserva {
id String @id @default(cuid()) // Identificador único (CUID)
nombre String // Nombre completo del comprador
whatsapp String // Número de teléfono de contacto (9 dígitos)
cantidad Int // Cantidad de porciones solicitadas
tipoEntrega TipoEntrega // Enum: DELIVERY o RECOJO
direccion String? // Opcional: Requerido solo si tipoEntrega es DELIVERY
estadoPago Boolean @default(false) // Control de verificación de Yape/BCP
entregado Boolean @default(false) // Control de despacho/entrega final
fechaCreacion DateTime @default(now()) // Timestamp de registro
}

🚀 3. Hitos de Desarrollo (Milestones para Antigravity CLI)

Ejecuta cada uno de los siguientes hitos de forma secuencial en tu terminal utilizando el comando /goal de agy.

📌 Hito 1: Inicialización del Entorno y Capa de Datos (ORM)

Objetivo: Configurar la base del proyecto Astro con soporte SSR, Tailwind CSS y la conexión inicial a PostgreSQL mediante Prisma ORM.

🛠️ Comando para Antigravity CLI:

/goal Configurar el entorno Astro en modo SSR (Node adapter), instalar e inicializar Tailwind CSS, configurar Prisma ORM con el modelo Reserva (PostgreSQL) detallado en el plan de arquitectura y validar la compilación base.

Directrices Técnicas:

Configurar astro.config.mjs con output: 'server' y @astrojs/node.

Integrar la inicialización del cliente de Prisma en un archivo de utilidades para evitar múltiples instancias activas en caliente:

// src/lib/db.ts
import { PrismaClient } from '@prisma/client';
export const prisma = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;

📌 Hito 2: UI Móvil-First y Formulario Dinámico de Reserva

Objetivo: Diseñar una interfaz limpia y persuasiva enfocada en la conversión y recolección de fondos, con comportamiento dinámico según el método de entrega seleccionado.

🛠️ Comando para Antigravity CLI:

/goal Diseñar la Landing Page principal en Astro utilizando Tailwind CSS. Debe incluir una sección informativa de ayuda social, los datos y números de cuenta de pago (Yape/Plin, BCP) con botones de 'Copiar al Portapapeles' y un formulario dinámico que oculte/muestre el campo de dirección según el tipo de entrega (Delivery/Recojo).

Directrices Técnicas:

Diseñar con Tailwind CSS priorizando pantallas táctiles (anchos fluidos, zonas de toque amplias de mínimo 44px).

Implementar la lógica condicional en el cliente sin frameworks pesados utilizando un <script> nativo de Astro:

Si el usuario selecciona RECOJO, ocultar el campo de dirección y mostrar una tarjeta destacada con la dirección física: Nuevo Vistalegre - Vistalegre - Nasca, con un enlace directo a mapas.

Si selecciona DELIVERY, mostrar el campo de dirección/referencia y añadir la propiedad required.

📌 Hito 3: Procesamiento SSR e Integración de WhatsApp API

Objetivo: Desarrollar el endpoint del servidor para registrar de forma segura la reserva en la base de datos y preparar el mensaje personalizado que el cliente enviará a los coordinadores.

🛠️ Comando para Antigravity CLI:

/goal Crear el endpoint API POST en 'src/pages/api/reservas.ts' para validar la data de entrada, registrar la reserva mediante Prisma en PostgreSQL y responder con un objeto JSON que incluya el ID de la reserva y la URL de redirección directa a la API de WhatsApp formateada con emojis.

Directrices de Formateo de WhatsApp:

El mensaje de confirmación debe ir estructurado profesionalmente:

¡Hola! Acabo de registrar mi reserva para la pollada solidaria. 🎫

👤 Nombre: [Nombre Completo]
🔢 Cantidad: [Cantidad] porción(es)
🛵 Entrega: [Delivery / Recojo]
📍 Dirección: [Dirección si aplica o "Recojo en local"]
🆔 ID Ticket: [ID de Reserva]

Adjunto captura de pantalla de mi transferencia de pago. 📸

Reemplazar caracteres especiales y espacios usando encodeURIComponent().

📌 Hito 4: Motor de Generación Gráfica de Tickets (HTML5 Canvas)

Objetivo: Proporcionar al usuario un ticket digital estético (con diseño de cupón físico de rifa benéfica) generado enteramente en el cliente para descarga instantánea.

🛠️ Comando para Antigravity CLI:

/goal Desarrollar el componente de cliente 'TicketCanvas' en Astro que utilice la API HTML5 Canvas del navegador para renderizar dinámicamente un ticket gráfico con diseño profesional (degradado cálido, talón de control, datos del comprador, ID de reserva y cantidad de porciones) y permitir su descarga inmediata en formato PNG.

Directrices Técnicas de Renderizado:

Crear un canvas en memoria de 800x400 píxeles para asegurar nitidez (Retina/High-DPI).

Dibujar una línea divisoria discontinua que simule el precorte del boleto, separando el cuerpo principal del talón de control logístico.

Integrar la función de descarga directa sin intervención del servidor:

const link = document.createElement('a');
link.download = `ticket-${reservaId}.png`;
link.href = canvas.toDataURL('image/png');
link.click();

📌 Hito 5: Panel de Control Administrativo (Dashboard SSR)

Objetivo: Desarrollar la consola de administración en tiempo real donde los coordinadores del evento benéfico puedan gestionar la cocina, los despachos de delivery y la validación de pagos.

🛠️ Comando para Antigravity CLI:

/goal Crear la ruta '/admin' en Astro que consulte en tiempo real la base de datos de PostgreSQL con Prisma para mostrar tarjetas de métricas (Porciones totales vendidas, recaudación monetaria real, totales para Delivery y Local) y una tabla interactiva para marcar pedidos como pagados y entregados mediante endpoints API rápidos.

Directrices Técnicas:

Métricas: - Total Recaudado debe ser calculado únicamente sumando los registros donde estadoPago === true multiplicado por el costo unitario de la porción (S/. 15.00).

Interactividad Reactiva (Endpoints Auxiliares):

Implementar los endpoints src/pages/api/toggle-pago.ts y src/pages/api/toggle-entrega.ts usando el método PATCH.

Usar JavaScript en la vista de administración para realizar peticiones fetch() a estos endpoints y actualizar visualmente las clases de Tailwind (ej. de rojo "Pendiente" a verde "Pagado") sin recargar la página completa, manteniendo la fluidez táctil para los administradores.

🛠️ 4. Guía de Ejecución para el Operador

Abre la interfaz interactiva de Antigravity CLI en la raíz del proyecto:

agy

Ejecuta el comando /goal especificado en el Hito 1. Permite que la IA instale las dependencias y configure los archivos principales.

Al finalizar cada hito, realiza pruebas de compilación y ejecuta el comando del siguiente hito.

Recuerda configurar tus variables de entorno en el archivo .env antes de inicializar Prisma:

DATABASE_URL="postgresql://usuario:password@localhost:5432/pollada_db?schema=public"
