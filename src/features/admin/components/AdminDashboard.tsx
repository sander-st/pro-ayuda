import * as React from "react"
import { AdminHeader } from "./AdminHeader"
import { AdminMetricsGrid } from "./AdminMetricsGrid"
import { AdminFilters } from "./AdminFilters"
import { AdminTable } from "./AdminTable"
import { SettingsModal } from "./SettingsModal"
import { calcularMetricas } from "../utils/metrics"
import { useReservasFilter } from "../hooks/useReservasFilter"
import type { Reserva } from "./AdminTableRow"

interface Props { initialReservas: Reserva[]; initialSettingsOpen?: boolean; settingsMessage?: string; }

export function AdminDashboard({ initialReservas, initialSettingsOpen = false, settingsMessage }: Props) {
  const [reservas, setReservas] = React.useState<Reserva[]>(initialReservas);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(initialSettingsOpen);
  const [updatingPago, setUpdatingPago] = React.useState<Set<string>>(new Set());
  const [updatingEntrega, setUpdatingEntrega] = React.useState<Set<string>>(new Set());

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

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6 w-full min-w-0">
      <AdminHeader onSettingsClick={() => setIsSettingsOpen(true)} />
      <AdminMetricsGrid recaudacionReal={recaudacionReal} porcionesTotales={porcionesTotales} totalDelivery={totalDelivery} totalRecojo={totalRecojo} />
      <AdminFilters search={search} setSearch={setSearch} sortBy={sortBy} setSortBy={setSortBy} filterStatus={filterStatus} setFilterStatus={setFilterStatus} />
      <AdminTable reservas={filtered} updatingPagoIds={updatingPago} updatingEntregaIds={updatingEntrega} onTogglePago={togglePago} onToggleEntrega={toggleEntrega} />
      <SettingsModal isOpen={isSettingsOpen} onOpenChange={setIsSettingsOpen} initialMessage={settingsMessage} />
    </div>
  );
}
