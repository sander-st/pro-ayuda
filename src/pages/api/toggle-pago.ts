import type { APIRoute } from 'astro';
import { prisma } from '../../lib/db';

export const PATCH: APIRoute = async ({ request }) => {
  try {
    interface TogglePagoRequest {
      id: string;
      estadoPago: boolean;
    }
    const { id, estadoPago } = (await request.json()) as TogglePagoRequest;

    if (!id || typeof estadoPago !== 'boolean') {
      return new Response(JSON.stringify({ error: 'Datos inválidos' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const reserva = await prisma.reserva.update({
      where: { id },
      data: { estadoPago }
    });

    return new Response(JSON.stringify({ success: true, reserva }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error al actualizar pago:', error);
    return new Response(JSON.stringify({ error: 'Error del servidor' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
