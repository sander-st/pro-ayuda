import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatMoneda } from "../utils/metrics"

interface AdminMetricsGridProps {
  recaudacionReal: number;
  porcionesTotales: number;
  totalDelivery: number;
  totalRecojo: number;
}

export function AdminMetricsGrid({
  recaudacionReal,
  porcionesTotales,
  totalDelivery,
  totalRecojo,
}: AdminMetricsGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      <Card className="border border-slate-100 shadow-sm rounded-2xl p-3 sm:p-4">
        <CardHeader className="p-0 pb-1">
          <CardTitle className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Recaudación</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <p className="text-lg sm:text-2xl font-extrabold text-emerald-600">{formatMoneda(recaudacionReal)}</p>
          <p className="text-[10px] text-slate-400 font-medium">Pagos verificados</p>
        </CardContent>
      </Card>
      <Card className="border border-slate-100 shadow-sm rounded-2xl p-3 sm:p-4">
        <CardHeader className="p-0 pb-1">
          <CardTitle className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Vendidas</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <p className="text-lg sm:text-2xl font-extrabold text-slate-900">{porcionesTotales}</p>
          <p className="text-[10px] text-slate-400 font-medium">Porciones totales</p>
        </CardContent>
      </Card>
      <Card className="border border-slate-100 shadow-sm rounded-2xl p-3 sm:p-4">
        <CardHeader className="p-0 pb-1">
          <CardTitle className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Delivery</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <p className="text-lg sm:text-2xl font-extrabold text-blue-600">{totalDelivery}</p>
          <p className="text-[10px] text-slate-400 font-medium">Para despachar</p>
        </CardContent>
      </Card>
      <Card className="border border-slate-100 shadow-sm rounded-2xl p-3 sm:p-4">
        <CardHeader className="p-0 pb-1">
          <CardTitle className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Local</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <p className="text-lg sm:text-2xl font-extrabold text-amber-500">{totalRecojo}</p>
          <p className="text-[10px] text-slate-400 font-medium">Entrega en puerta</p>
        </CardContent>
      </Card>
    </div>
  )
}
