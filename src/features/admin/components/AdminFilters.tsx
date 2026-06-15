import * as React from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between mb-4">
      <div className="relative flex-1 sm:max-w-xs md:max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
        <Input
          type="text"
          placeholder="Buscar por ticket, nombre o whatsapp..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-white border-slate-200 rounded-xl"
        />
      </div>
      <div className="grid grid-cols-2 sm:flex gap-2">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-[140px] rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm cursor-pointer">
            <SelectValue placeholder="Todos los estados" />
          </SelectTrigger>
          <SelectContent position="popper" className="bg-white rounded-xl border border-slate-100 shadow-lg text-xs">
            <SelectGroup>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="pagados">Pagados</SelectItem>
              <SelectItem value="pendientes-pago">Pendientes Pago</SelectItem>
              <SelectItem value="entregados">Entregados</SelectItem>
              <SelectItem value="pendientes-entrega">Por despachar</SelectItem>
              <SelectItem value="delivery">Delivery</SelectItem>
              <SelectItem value="recojo">Recojo Local</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[170px] rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm cursor-pointer">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent position="popper" className="bg-white rounded-xl border border-slate-100 shadow-lg text-xs">
            <SelectGroup>
              <SelectItem value="fecha-desc">Más recientes primero</SelectItem>
              <SelectItem value="fecha-asc">Más antiguos primero</SelectItem>
              <SelectItem value="nombre-asc">Nombre (A-Z)</SelectItem>
              <SelectItem value="nombre-desc">Nombre (Z-A)</SelectItem>
              <SelectItem value="cantidad-desc">Mayor cantidad</SelectItem>
              <SelectItem value="cantidad-asc">Menor cantidad</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
