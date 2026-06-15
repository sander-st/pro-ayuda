import * as React from "react"
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { AdminTableRow, type Reserva } from "./AdminTableRow"

interface TableProps {
  reservas: Reserva[];
  updatingPagoIds: Set<string>;
  updatingEntregaIds: Set<string>;
  onTogglePago: (id: string, current: boolean) => void;
  onToggleEntrega: (id: string, current: boolean) => void;
}

export function AdminTable({ reservas, updatingPagoIds, updatingEntregaIds, onTogglePago, onToggleEntrega }: TableProps) {
  return (
    <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white">
      <CardContent className="p-0 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-100">
              <TableHead className="w-[80px] sm:w-[100px] font-bold text-slate-500 uppercase tracking-wider text-[10px] sm:text-xs p-2.5 sm:p-4">ID Ticket</TableHead>
              <TableHead className="font-bold text-slate-500 uppercase tracking-wider text-[10px] sm:text-xs p-2.5 sm:p-4">Cliente</TableHead>
              <TableHead className="font-bold text-slate-500 uppercase tracking-wider text-[10px] sm:text-xs p-2.5 sm:p-4">Detalle</TableHead>
              <TableHead className="font-bold text-slate-500 uppercase tracking-wider text-[10px] sm:text-xs p-2.5 sm:p-4">Entrega</TableHead>
              <TableHead className="font-bold text-slate-500 uppercase tracking-wider text-[10px] sm:text-xs p-2.5 sm:p-4">Pago</TableHead>
              <TableHead className="font-bold text-slate-500 uppercase tracking-wider text-[10px] sm:text-xs p-2.5 sm:p-4">Logística</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservas.map((r) => (
              <AdminTableRow
                key={r.id}
                reserva={r}
                isUpdatingPago={updatingPagoIds.has(r.id)}
                isUpdatingEntrega={updatingEntregaIds.has(r.id)}
                onTogglePago={onTogglePago}
                onToggleEntrega={onToggleEntrega}
              />
            ))}
            {reservas.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="p-8 text-center text-slate-500 font-medium">
                  No hay reservas registradas aún.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
