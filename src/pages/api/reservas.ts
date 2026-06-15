import type { APIRoute } from 'astro';
import { prisma } from '../../lib/db';

// Número de teléfono de los coordinadores (puede venir de env en prod)
const WHATSAPP_NUMBER = import.meta.env.WHATSAPP_NUMBER || process.env.WHATSAPP_NUMBER || '51968928843';

export const POST: APIRoute = async ({ request }) => {
  try {
    interface ReservaRequest {
      nombre: string;
      whatsapp: string;
      cantidad: string;
      tipoEntrega: 'DELIVERY' | 'RECOJO';
      direccion?: string;
    }
    const data = (await request.json()) as ReservaRequest;
    const { nombre, whatsapp, cantidad, tipoEntrega, direccion } = data;

    // Validación básica de entrada
    if (!nombre || !whatsapp || !cantidad || !tipoEntrega) {
      return new Response(JSON.stringify({ error: 'Faltan campos obligatorios' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Registrar reserva en la base de datos PostgreSQL usando Prisma
    const reserva = await prisma.reserva.create({
      data: {
        nombre,
        whatsapp,
        cantidad: parseInt(cantidad, 10),
        tipoEntrega,
        direccion: tipoEntrega === 'DELIVERY' ? direccion : null,
      }
    });

    // Formatear mensaje profesional para WhatsApp con emojis
    const direccionText = tipoEntrega === 'DELIVERY' && direccion ? direccion : 'Recojo en local';
    
    const mensaje = `¡Hola! Acabo de registrar mi reserva para la pollada solidaria. 🎫

👤 Nombre: ${nombre}
🔢 Cantidad: ${cantidad} porción(es)
🛵 Entrega: ${tipoEntrega === 'DELIVERY' ? 'Delivery' : 'Recojo'}
📍 Dirección: ${direccionText}
🆔 ID Ticket: #${reserva.id.substring(0, 8).toUpperCase()}

Adjunto captura de pantalla de mi transferencia de pago. 📸`;

    // Codificar URL para redirección
    const encodedMensaje = encodeURIComponent(mensaje);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMensaje}`;

    // Respuesta JSON
    return new Response(JSON.stringify({ 
      success: true, 
      id: reserva.id, 
      whatsappUrl 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error al crear reserva:', error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
