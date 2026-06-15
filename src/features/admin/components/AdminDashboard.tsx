import * as React from "react"
import { AdminHeader } from "./AdminHeader"
import { AdminMetricsGrid } from "./AdminMetricsGrid"
import { AdminFilters } from "./AdminFilters"
import { AdminTable } from "./AdminTable"
import { SettingsModal } from "./SettingsModal"
import { calcularMetricas } from "../utils/metrics"
import { useReservasFilter } from "../hooks/useReservasFilter"
import type { Reserva } from "./AdminTableRow"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface Props { initialReservas: Reserva[]; initialSettingsOpen?: boolean; settingsMessage?: string; }

export function AdminDashboard({ initialReservas, initialSettingsOpen = false, settingsMessage }: Props) {
  const [reservas, setReservas] = React.useState<Reserva[]>(initialReservas);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(initialSettingsOpen);
  const [updatingPago, setUpdatingPago] = React.useState<Set<string>>(new Set());
  const [updatingEntrega, setUpdatingEntrega] = React.useState<Set<string>>(new Set());
  const [deletingIds, setDeletingIds] = React.useState<Set<string>>(new Set());

  // Estados para diálogos de confirmación
  const [reservaToDelete, setReservaToDelete] = React.useState<Reserva | null>(null);
  const [isDeleteAllOpen, setIsDeleteAllOpen] = React.useState(false);
  const [deleteAllPassword, setDeleteAllPassword] = React.useState("");
  const [deleteAllError, setDeleteAllError] = React.useState<string | null>(null);
  const [isDeletingAll, setIsDeletingAll] = React.useState(false);

  const { search, setSearch, sortBy, setSortBy, filterStatus, setFilterStatus, filtered } = useReservasFilter(reservas);
  const { porcionesTotales, recaudacionReal, totalDelivery, totalRecojo } = calcularMetricas(reservas);

  const togglePago = async (id: string, current: boolean) => {
    setUpdatingPago(p => new Set(p).add(id));
    try {
      const res = await fetch("/api/toggle-pago", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, estadoPago: !current })
      });
      if (res.ok) setReservas(p => p.map(r => r.id === id ? { ...r, estadoPago: !current } : r));
    } catch (e) { console.error(e); }
    finally { setUpdatingPago(p => { const n = new Set(p); n.delete(id); return n; }); }
  };

  const toggleEntrega = async (id: string, current: boolean) => {
    setUpdatingEntrega(p => new Set(p).add(id));
    try {
      const res = await fetch("/api/toggle-entrega", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, entregado: !current })
      });
      if (res.ok) setReservas(p => p.map(r => r.id === id ? { ...r, entregado: !current } : r));
    } catch (e) { console.error(e); }
    finally { setUpdatingEntrega(p => { const n = new Set(p); n.delete(id); return n; }); }
  };

  const deleteReservaRequest = (id: string) => {
    const res = reservas.find(r => r.id === id);
    if (res) setReservaToDelete(res);
  };

  const handleConfirmDeleteReserva = async () => {
    if (!reservaToDelete) return;
    const id = reservaToDelete.id;
    setReservaToDelete(null);
    setDeletingIds(p => new Set(p).add(id));
    try {
      const res = await fetch("/api/delete-reserva", {
        method: "DELETE", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      if (res.ok) setReservas(p => p.filter(r => r.id !== id));
    } catch (e) { console.error(e); }
    finally { setDeletingIds(p => { const n = new Set(p); n.delete(id); return n; }); }
  };

  const handleDeleteAllConfirm = async () => {
    if (!deleteAllPassword) {
      setDeleteAllError("La contraseña es requerida");
      return;
    }
    setIsDeletingAll(true);
    setDeleteAllError(null);
    try {
      const res = await fetch("/api/delete-all-reservas", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: deleteAllPassword })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setReservas([]);
        setIsDeleteAllOpen(false);
        setDeleteAllPassword("");
      } else {
        setDeleteAllError(data.error || "Ocurrió un error al eliminar los datos.");
      }
    } catch (e) {
      console.error(e);
      setDeleteAllError("Error de conexión al servidor.");
    } finally {
      setIsDeletingAll(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6 w-full min-w-0">
      <AdminHeader onSettingsClick={() => setIsSettingsOpen(true)} onDeleteAllClick={() => setIsDeleteAllOpen(true)} />
      <AdminMetricsGrid recaudacionReal={recaudacionReal} porcionesTotales={porcionesTotales} totalDelivery={totalDelivery} totalRecojo={totalRecojo} />
      <AdminFilters search={search} setSearch={setSearch} sortBy={sortBy} setSortBy={setSortBy} filterStatus={filterStatus} setFilterStatus={setFilterStatus} />
      <AdminTable reservas={filtered} updatingPagoIds={updatingPago} updatingEntregaIds={updatingEntrega} deletingIds={deletingIds} onTogglePago={togglePago} onToggleEntrega={toggleEntrega} onDeleteReserva={deleteReservaRequest} />
      <SettingsModal isOpen={isSettingsOpen} onOpenChange={setIsSettingsOpen} initialMessage={settingsMessage} />

      {/* Modal de confirmación para eliminar reserva individual */}
      <Dialog open={!!reservaToDelete} onOpenChange={(open) => !open && setReservaToDelete(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-red-600 font-bold flex items-center gap-2">
              ⚠️ Confirmar Eliminación
            </DialogTitle>
            <DialogDescription className="mt-2 text-slate-600">
              ¿Estás seguro de que deseas eliminar la reserva de <strong>{reservaToDelete?.nombre}</strong>? 
              <br />
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2 flex flex-col sm:flex-row">
            <Button
              variant="outline"
              onClick={() => setReservaToDelete(null)}
              className="font-semibold rounded-xl cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDeleteReserva}
              className="font-bold rounded-xl cursor-pointer bg-red-600 hover:bg-red-700 text-white"
            >
              Confirmar y Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de confirmación para eliminar todas las reservas con contraseña */}
      <Dialog open={isDeleteAllOpen} onOpenChange={(open) => {
        if (!open) {
          setIsDeleteAllOpen(false);
          setDeleteAllPassword("");
          setDeleteAllError(null);
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-red-600 font-bold flex items-center gap-2">
              🚨 PELIGRO: Eliminar Base de Datos
            </DialogTitle>
            <DialogDescription className="mt-2 text-slate-600">
              Esta acción eliminará de forma permanente <strong>TODAS</strong> las reservas de la base de datos.
              <br />
              <span className="text-xs text-red-500 font-semibold">
                ¡Esta acción es irreversible!
              </span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-2 py-4">
            <Label htmlFor="delete-all-password" className="text-xs font-semibold text-slate-700">
              Ingresa la contraseña de administrador para confirmar:
            </Label>
            <Input
              id="delete-all-password"
              type="password"
              placeholder="Contraseña"
              value={deleteAllPassword}
              onChange={(e) => setDeleteAllPassword(e.target.value)}
              className="h-10 rounded-xl bg-slate-50 border-slate-200"
              disabled={isDeletingAll}
            />
            {deleteAllError && (
              <p className="text-xs text-red-500 font-medium mt-1">
                {deleteAllError}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 flex flex-col sm:flex-row">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteAllOpen(false);
                setDeleteAllPassword("");
                setDeleteAllError(null);
              }}
              className="font-semibold rounded-xl cursor-pointer"
              disabled={isDeletingAll}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAllConfirm}
              className="font-bold rounded-xl cursor-pointer bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2"
              disabled={isDeletingAll || !deleteAllPassword}
            >
              {isDeletingAll ? (
                <>
                  <Loader2 className="animate-spin size-4" />
                  Eliminando...
                </>
              ) : (
                "Eliminar todo permanentemente"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
