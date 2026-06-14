import type { Reserva } from '@prisma/client';

export const COSTO_PORCION = 20.00;

export interface Metricas {
  porcionesTotales: number;
  recaudacionReal: number;
  totalDelivery: number;
  totalRecojo: number;
}

export function calcularMetricas(reservas: Reserva[]): Metricas {
  const porcionesTotales = reservas.reduce((acc, r) => acc + r.cantidad, 0);
  const recaudacionReal = reservas
    .filter(r => r.estadoPago === true)
    .reduce((acc, r) => acc + (r.cantidad * COSTO_PORCION), 0);

  const totalDelivery = reservas.filter(r => r.tipoEntrega === 'DELIVERY').length;
  const totalRecojo = reservas.filter(r => r.tipoEntrega === 'RECOJO').length;

  return { porcionesTotales, recaudacionReal, totalDelivery, totalRecojo };
}

export function formatMoneda(monto: number): string {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(monto);
}
