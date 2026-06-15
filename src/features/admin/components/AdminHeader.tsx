import * as React from "react"
import { Button } from "@/components/ui/button"
import { Settings, LogOut, Trash2 } from "lucide-react"

interface AdminHeaderProps {
  onSettingsClick: () => void;
  onDeleteAllClick: () => void;
}

export function AdminHeader({ onSettingsClick, onDeleteAllClick }: AdminHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Panel de Control</h1>
        <p className="text-slate-500 font-medium mt-1">Gestión logística y financiera</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          onClick={onSettingsClick}
          className="bg-white border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm cursor-pointer"
        >
          <Settings data-icon="inline-start" />
          Ajustes
        </Button>
        <Button
          variant="destructive"
          onClick={onDeleteAllClick}
          className="font-bold rounded-xl shadow-sm cursor-pointer bg-red-600 hover:bg-red-700 text-white"
        >
          <Trash2 data-icon="inline-start" />
          Eliminar Todo
        </Button>
        <form method="POST" className="m-0 p-0">
          <input type="hidden" name="action" value="logout" />
          <Button
            type="submit"
            variant="destructive"
            className="bg-rose-50 border-rose-100 text-rose-600 font-bold rounded-xl shadow-sm cursor-pointer"
          >
            <LogOut data-icon="inline-start" />
            Salir
          </Button>
        </form>
      </div>
    </header>
  )
}
