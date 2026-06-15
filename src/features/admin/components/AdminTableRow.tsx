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
  
  let rowClass = "hover:bg-slate-50 transition-colors text-xs sm:text-sm";
  if (reserva.entregado) {
    rowClass = "bg-amber-50/40 hover:bg-amber-50/60 transition-colors text-xs sm:text-sm";
  } else if (reserva.estadoPago) {
    rowClass = "bg-emerald-50/40 hover:bg-emerald-50/60 transition-colors text-xs sm:text-sm";
  }

  return (
    <TableRow className={rowClass}>
      <TableCell className="font-mono text-slate-500 text-[10px] sm:text-xs uppercase p-2.5 sm:p-4">{reserva.id.substring(0, 8)}</TableCell>
      <TableCell className="p-2.5 sm:p-4">
        <p className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1">{reserva.nombre}</p>
        <a href={whatsappUrl} target="_blank" rel="noreferrer" className="text-emerald-600 font-medium hover:underline text-[10px] sm:text-xs mt-0.5 block">WA: {reserva.whatsapp}</a>
      </TableCell>
      <TableCell className="p-2.5 sm:p-4">
        <div className="flex items-center gap-1 sm:gap-2">
          <Badge variant="secondary" className="font-bold px-1.5 py-0 text-[10px] sm:text-xs">{reserva.cantidad}x</Badge>
          <span className="text-slate-500 font-semibold text-[10px] sm:text-xs">{formatMoneda(total)}</span>
        </div>
      </TableCell>
      <TableCell className="p-2.5 sm:p-4">
        <Badge variant={reserva.tipoEntrega === 'DELIVERY' ? 'default' : 'outline'} className={`px-1.5 py-0 text-[10px] sm:text-xs ${reserva.tipoEntrega === 'DELIVERY' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' : 'bg-amber-100 text-amber-700 border-transparent hover:bg-amber-100'}`}>{reserva.tipoEntrega}</Badge>
        {reserva.direccion && <p className="text-[10px] text-slate-400 mt-0.5 max-w-[100px] sm:max-w-[150px] truncate" title={reserva.direccion}>{reserva.direccion}</p>}
      </TableCell>
      <TableCell className="p-2.5 sm:p-4">
        <Button onClick={() => onTogglePago(reserva.id, reserva.estadoPago)} disabled={isUpdatingPago} size="sm" className={`h-7 px-2 text-[10px] sm:text-xs font-bold cursor-pointer w-22 sm:w-28 ${reserva.estadoPago ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-rose-100 text-rose-700 hover:bg-rose-200'}`}>
          {isUpdatingPago ? <Loader2 className="animate-spin" data-icon="inline-start" /> : (reserva.estadoPago ? 'PAGADO' : 'PENDIENTE')}
        </Button>
      </TableCell>
      <TableCell className="p-2.5 sm:p-4">
        <Button onClick={() => onToggleEntrega(reserva.id, reserva.entregado)} disabled={isUpdatingEntrega} size="sm" className={`h-7 px-2 text-[10px] sm:text-xs font-bold cursor-pointer w-26 sm:w-32 ${reserva.entregado ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'}`}>
          {isUpdatingEntrega ? <Loader2 className="animate-spin" data-icon="inline-start" /> : (reserva.entregado ? 'ENTREGADO' : 'POR DESPACHAR')}
        </Button>
      </TableCell>
    </TableRow>
  );
}
