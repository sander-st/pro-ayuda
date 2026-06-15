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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card className="border border-slate-100 shadow-sm rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Recaudación Real</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-extrabold text-emerald-600">{formatMoneda(recaudacionReal)}</p>
          <p className="text-xs text-slate-400 mt-2 font-medium">Solo pagos verificados</p>
        </CardContent>
      </Card>
      <Card className="border border-slate-100 shadow-sm rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Porciones Vendidas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-extrabold text-slate-900">{porcionesTotales}</p>
          <p className="text-xs text-slate-400 mt-2 font-medium">Total general reservado</p>
        </CardContent>
      </Card>
      <Card className="border border-slate-100 shadow-sm rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Envíos Delivery</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-extrabold text-blue-600">{totalDelivery}</p>
          <p className="text-xs text-slate-400 mt-2 font-medium">Pedidos para despachar</p>
        </CardContent>
      </Card>
      <Card className="border border-slate-100 shadow-sm rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Recojo Local</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-extrabold text-amber-500">{totalRecojo}</p>
          <p className="text-xs text-slate-400 mt-2 font-medium">Entregas en puerta</p>
        </CardContent>
      </Card>
    </div>
  )
}
