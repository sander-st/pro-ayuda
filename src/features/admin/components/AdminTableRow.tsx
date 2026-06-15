import * as React from "react"
import { TableRow, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { COSTO_PORCION, formatMoneda } from "../utils/metrics"
import { Loader2 } from "lucide-react"

export interface Reserva {
  id: string;
  nombre: string;
  whatsapp: string;
  cantidad: number;
  tipoEntrega: 'DELIVERY' | 'RECOJO';
  direccion: string | null;
  estadoPago: boolean;
  entregado: boolean;
  fechaCreacion: Date;
}

interface RowProps {
  reserva: Reserva;
  isUpdatingPago: boolean;
  isUpdatingEntrega: boolean;
  onTogglePago: (id: string, current: boolean) => void;
  onToggleEntrega: (id: string, current: boolean) => void;
}

export function AdminTableRow({ reserva, isUpdatingPago, isUpdatingEntrega, onTogglePago, onToggleEntrega }: RowProps) {
  const whatsappUrl = `https://wa.me/${reserva.whatsapp}`;
  const total = reserva.cantidad * COSTO_PORCION;
  return (
    <TableRow className="hover:bg-slate-50 transition-colors">
      <TableCell className="font-mono text-slate-500 text-xs uppercase">{reserva.id.substring(0, 8)}</TableCell>
      <TableCell>
        <p className="font-bold text-slate-900">{reserva.nombre}</p>
        <a href={whatsappUrl} target="_blank" rel="noreferrer" className="text-emerald-600 font-medium hover:underline text-xs mt-0.5 block">WA: {reserva.whatsapp}</a>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="font-bold px-2 py-0.5">{reserva.cantidad} x</Badge>
          <span className="text-slate-500 font-semibold text-xs">{formatMoneda(total)}</span>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={reserva.tipoEntrega === 'DELIVERY' ? 'default' : 'outline'} className={reserva.tipoEntrega === 'DELIVERY' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' : 'bg-amber-100 text-amber-700 border-transparent hover:bg-amber-100'}>{reserva.tipoEntrega}</Badge>
        {reserva.direccion && <p className="text-xs text-slate-400 mt-1 max-w-[150px] truncate" title={reserva.direccion}>{reserva.direccion}</p>}
      </TableCell>
      <TableCell>
        <Button onClick={() => onTogglePago(reserva.id, reserva.estadoPago)} disabled={isUpdatingPago} className={`w-28 h-8 rounded-lg text-xs font-bold cursor-pointer ${reserva.estadoPago ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-rose-100 text-rose-700 hover:bg-rose-200'}`}>
          {isUpdatingPago ? <Loader2 className="animate-spin" data-icon="inline-start" /> : (reserva.estadoPago ? 'PAGADO' : 'PENDIENTE')}
        </Button>
      </TableCell>
      <TableCell>
        <Button onClick={() => onToggleEntrega(reserva.id, reserva.entregado)} disabled={isUpdatingEntrega} className={`w-32 h-8 rounded-lg text-xs font-bold cursor-pointer ${reserva.entregado ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'}`}>
          {isUpdatingEntrega ? <Loader2 className="animate-spin" data-icon="inline-start" /> : (reserva.entregado ? 'ENTREGADO' : 'POR DESPACHAR')}
        </Button>
      </TableCell>
    </TableRow>
  );
}
