import type { APIRoute } from 'astro';
import { prisma } from '../../lib/db';

export const PATCH: APIRoute = async ({ request }) => {
  try {
    interface ToggleEntregaRequest {
      id: string;
      entregado: boolean;
    }
    const { id, entregado } = (await request.json()) as ToggleEntregaRequest;

    if (!id || typeof entregado !== 'boolean') {
      return new Response(JSON.stringify({ error: 'Datos inválidos' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const reserva = await prisma.reserva.update({
      where: { id },
      data: { entregado }
    });

    return new Response(JSON.stringify({ success: true, reserva }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error al actualizar entrega:', error);
    return new Response(JSON.stringify({ error: 'Error del servidor' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
