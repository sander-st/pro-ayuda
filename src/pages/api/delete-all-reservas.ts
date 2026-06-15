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

    interface DeleteAllRequest {
      password?: string;
    }
    const { password } = (await request.json()) as DeleteAllRequest;

    if (!password) {
      return new Response(JSON.stringify({ error: 'La contraseña es requerida' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Obtener la contraseña configurada
    const config = await prisma.adminConfig.findUnique({ where: { id: 1 } });
    if (!config || password !== config.password) {
      return new Response(JSON.stringify({ error: 'Contraseña incorrecta' }), { 
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await prisma.reserva.deleteMany({});

    return new Response(JSON.stringify({ success: true }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error al eliminar todas las reservas:', error);
    return new Response(JSON.stringify({ error: 'Error del servidor' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
