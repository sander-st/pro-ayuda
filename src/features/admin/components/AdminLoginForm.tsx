import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"

interface AdminLoginFormProps {
  error?: string;
}

export function AdminLoginForm({ error }: AdminLoginFormProps) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full border border-slate-100 shadow-xl rounded-3xl relative overflow-hidden group">
        <div className="absolute -top-24 -right-24 size-48 bg-orange-100/50 rounded-full blur-3xl group-hover:bg-orange-200/50 transition-colors duration-500" />
        <CardHeader className="text-center relative z-10">
          <div className="size-12 bg-gradient-to-tr from-orange-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/30">
            <Lock className="text-white" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Acceso Panel</CardTitle>
          <CardDescription>Ingresa tu contraseña para continuar</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <form method="POST" className="flex flex-col gap-4">
            <input type="hidden" name="action" value="login" />
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Contraseña de acceso</Label>
              <Input
                type="password"
                id="password"
                name="password"
                required
                placeholder="Ingresa la contraseña"
              />
            </div>
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm font-medium px-4 py-2.5 rounded-lg border border-destructive/20">
                {error}
              </div>
            )}
            <Button type="submit" size="lg" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md cursor-pointer">
              Ingresar al Panel
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
