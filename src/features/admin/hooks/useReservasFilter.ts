import * as React from "react"
import type { Reserva } from "../components/AdminTableRow"

export function useReservasFilter(reservas: Reserva[]) {
  const [search, setSearch] = React.useState("")
  const [sortBy, setSortBy] = React.useState("fecha-desc")
  const [filterStatus, setFilterStatus] = React.useState("all")

  const filtered = React.useMemo(() => {
    return reservas
      .filter((r) => {
        const query = search.toLowerCase()
        const matchesSearch =
          r.nombre.toLowerCase().includes(query) ||
          r.id.toLowerCase().includes(query) ||
          r.whatsapp.includes(query)

        if (!matchesSearch) return false
        if (filterStatus === "pagados") return r.estadoPago
        if (filterStatus === "pendientes-pago") return !r.estadoPago
        if (filterStatus === "entregados") return r.entregado
        if (filterStatus === "pendientes-entrega") return !r.entregado
        if (filterStatus === "delivery") return r.tipoEntrega === "DELIVERY"
        if (filterStatus === "recojo") return r.tipoEntrega === "RECOJO"
        return true
      })
      .sort((a, b) => {
        if (sortBy === "nombre-asc") return a.nombre.localeCompare(b.nombre)
        if (sortBy === "nombre-desc") return b.nombre.localeCompare(a.nombre)
        if (sortBy === "cantidad-desc") return b.cantidad - a.cantidad
        if (sortBy === "cantidad-asc") return a.cantidad - b.cantidad
        if (sortBy === "fecha-asc") return new Date(a.fechaCreacion).getTime() - new Date(b.fechaCreacion).getTime()
        return new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
      })
  }, [reservas, search, sortBy, filterStatus])

  return { search, setSearch, sortBy, setSortBy, filterStatus, setFilterStatus, filtered }
}
