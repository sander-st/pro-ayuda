import * as React from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface FiltersProps {
  search: string;
  setSearch: (v: string) => void;
  sortBy: string;
  setSortBy: (v: string) => void;
  filterStatus: string;
  setFilterStatus: (v: string) => void;
}

export function AdminFilters({ search, setSearch, sortBy, setSortBy, filterStatus, setFilterStatus }: FiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-3 items-center justify-between mb-4">
      <div className="relative w-full md:max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
        <Input
          type="text"
          placeholder="Buscar por ticket, nombre o whatsapp..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-white border-slate-200 rounded-xl h-9"
        />
      </div>
      <div className="flex gap-2 w-full md:w-auto">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="flex-1 md:flex-initial h-9 rounded-xl border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">Todos los estados</option>
          <option value="pagados">Pagados</option>
          <option value="pendientes-pago">Pendientes Pago</option>
          <option value="entregados">Entregados</option>
          <option value="pendientes-entrega">Por despachar</option>
          <option value="delivery">Delivery</option>
          <option value="recojo">Recojo Local</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="flex-1 md:flex-initial h-9 rounded-xl border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="fecha-desc">Más recientes primero</option>
          <option value="fecha-asc">Más antiguos primero</option>
          <option value="nombre-asc">Nombre (A-Z)</option>
          <option value="nombre-desc">Nombre (Z-A)</option>
          <option value="cantidad-desc">Mayor cantidad</option>
          <option value="cantidad-asc">Menor cantidad</option>
        </select>
      </div>
    </div>
  )
}
