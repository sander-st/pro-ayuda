// Manejo de botones de Pago
export function setupAdminClient() {
  document.querySelectorAll('.toggle-pago').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const target = e.currentTarget as HTMLButtonElement;
      const id = target.getAttribute('data-id');
      const currentState = target.getAttribute('data-current') === 'true';
      const newState = !currentState;
      
      target.disabled = true;
      target.classList.add('opacity-50');

      try {
        const res = await fetch('/api/toggle-pago', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, estadoPago: newState })
        });
        
        if (res.ok) {
          target.setAttribute('data-current', newState.toString());
          target.innerText = newState ? 'PAGADO' : 'PENDIENTE';
          if (newState) {
            target.className = 'toggle-pago w-24 h-8 rounded text-xs font-bold transition-colors shadow-sm focus:ring-2 focus:ring-offset-1 focus:outline-none bg-emerald-100 text-emerald-700 hover:bg-emerald-200 focus:ring-emerald-500';
          } else {
            target.className = 'toggle-pago w-24 h-8 rounded text-xs font-bold transition-colors shadow-sm focus:ring-2 focus:ring-offset-1 focus:outline-none bg-rose-100 text-rose-700 hover:bg-rose-200 focus:ring-rose-500';
          }
        } else {
          console.error('Error al actualizar el pago', await res.text());
          alert('Error al actualizar el pago');
        }
      } catch (error) {
        console.error(error);
        alert('Error de red');
      } finally {
        target.disabled = false;
        target.classList.remove('opacity-50');
      }
    });
  });

  // Manejo de botones de Entrega
  document.querySelectorAll('.toggle-entrega').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const target = e.currentTarget as HTMLButtonElement;
      const id = target.getAttribute('data-id');
      const currentState = target.getAttribute('data-current') === 'true';
      const newState = !currentState;
      
      target.disabled = true;
      target.classList.add('opacity-50');

      try {
        const res = await fetch('/api/toggle-entrega', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, entregado: newState })
        });
        
        if (res.ok) {
          target.setAttribute('data-current', newState.toString());
          target.innerText = newState ? 'ENTREGADO' : 'POR DESPACHAR';
          if (newState) {
            target.className = 'toggle-entrega w-28 h-8 rounded text-xs font-bold transition-colors shadow-sm focus:ring-2 focus:ring-offset-1 focus:outline-none bg-slate-800 text-white hover:bg-slate-700 focus:ring-slate-900';
          } else {
            target.className = 'toggle-entrega w-28 h-8 rounded text-xs font-bold transition-colors shadow-sm focus:ring-2 focus:ring-offset-1 focus:outline-none bg-slate-100 text-slate-600 hover:bg-slate-200 focus:ring-slate-400 border border-slate-200';
          }
        } else {
          console.error('Error al actualizar entrega', await res.text());
          alert('Error al actualizar entrega');
        }
      } catch (error) {
        console.error(error);
        alert('Error de red');
      } finally {
        target.disabled = false;
        target.classList.remove('opacity-50');
      }
    });
  });
}

// Inicializar cuando el DOM esté listo
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', setupAdminClient);
}
