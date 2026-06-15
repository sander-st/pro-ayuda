import type { APIRoute } from 'astro';
import { prisma } from '../../lib/db';

export const DELETE: APIRoute = async ({ request, cookies }) => {
  try {
    const authCookie = cookies.get('admin_auth');
    if (authCookie?.value !== 'authenticated') {
      return new Response(JSON.stringify({ error: 'No autorizado' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    interface DeleteRequest {
      id: string;
    }
    const { id } = (await request.json()) as DeleteRequest;

    if (!id) {
      return new Response(JSON.stringify({ error: 'Datos inválidos' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await prisma.reserva.delete({
      where: { id }
    });

    return new Response(JSON.stringify({ success: true }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error al eliminar reserva:', error);
    return new Response(JSON.stringify({ error: 'Error del servidor' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
