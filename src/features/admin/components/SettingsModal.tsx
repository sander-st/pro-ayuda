import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Key } from "lucide-react"

interface SettingsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialMessage?: string;
}

export function SettingsModal({ isOpen, onOpenChange, initialMessage }: SettingsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full rounded-3xl p-6 border border-slate-100 shadow-2xl">
        <DialogHeader className="flex flex-col items-center text-center">
          <div className="size-10 bg-slate-100 rounded-full flex items-center justify-center mb-3">
            <Key className="text-slate-500" />
          </div>
          <DialogTitle className="text-xl font-bold">Cambiar Contraseña</DialogTitle>
          <DialogDescription className="text-slate-500 text-sm">Establece la nueva contraseña de acceso administrativo</DialogDescription>
        </DialogHeader>
        <form method="POST" className="flex flex-col gap-4 mt-2">
          <input type="hidden" name="action" value="change_password" />
          <div className="flex flex-col gap-2">
            <Label htmlFor="newPassword">Nueva Contraseña</Label>
            <Input
              type="password"
              id="newPassword"
              name="newPassword"
              required
              minLength={4}
              placeholder="Mínimo 4 caracteres"
            />
          </div>
          {initialMessage && (
            <div className={`text-sm font-medium px-4 py-2.5 rounded-lg border ${
              initialMessage.includes("exitosamente")
                ? "bg-green-50 text-green-600 border-green-100"
                : "bg-red-50 text-red-600 border-red-100"
            }`}>
              {initialMessage}
            </div>
          )}
          <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-md cursor-pointer">
            Actualizar Contraseña
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
