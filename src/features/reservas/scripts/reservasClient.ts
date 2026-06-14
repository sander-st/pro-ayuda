declare global {
  interface Window {
    generarTicket?: (id: string, nombre: string, cantidad: string) => Promise<void>;
    mostrarTicketModal?: (id: string, nombre: string, cantidad: string, whatsappUrl: string) => Promise<void>;
  }
}

export function setupReservasClient() {
  // Manejo de copiado al portapapeles
  const copyBtns = document.querySelectorAll('.copy-btn');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const target = e.currentTarget as HTMLButtonElement;
      const text = target.dataset.copy;
      if (text) {
        try {
          await navigator.clipboard.writeText(text);
          const originalText = target.innerText;
          target.innerText = 'Copiado!';
          target.classList.add('text-ticket-success');
          setTimeout(() => {
            target.innerText = originalText;
            target.classList.remove('text-ticket-success');
          }, 2000);
        } catch (err) {
          console.error('Error al copiar: ', err);
        }
      }
    });
  });

  // Lógica de formulario dinámico (Recojo / Delivery)
  const radios = document.querySelectorAll('input[name="tipoEntrega"]');
  const infoRecojo = document.getElementById('info-recojo');
  const infoDelivery = document.getElementById('info-delivery');
  const direccionInput = document.getElementById('direccion') as HTMLTextAreaElement | null;
  const deliveryLabels = document.querySelectorAll('.delivery-label');

  function updateFormState() {
    const selected = document.querySelector('input[name="tipoEntrega"]:checked') as HTMLInputElement | null;
    if (!selected) return;
    
    // Actualizar estilos de los labels
    deliveryLabels.forEach(label => {
      const input = label.querySelector('input');
      if (input?.checked) {
        label.classList.add('border-ticket-accent', 'bg-rose-50');
        label.classList.remove('border-slate-200', 'bg-slate-50');
      } else {
        label.classList.remove('border-ticket-accent', 'bg-rose-50');
        label.classList.add('border-slate-200', 'bg-slate-50');
      }
    });

    if (selected.value === 'RECOJO') {
      infoRecojo?.classList.remove('hidden');
      infoDelivery?.classList.add('hidden');
      if (direccionInput) {
        direccionInput.removeAttribute('required');
        direccionInput.value = '';
      }
    } else {
      infoRecojo?.classList.add('hidden');
      infoDelivery?.classList.remove('hidden');
      if (direccionInput) direccionInput.setAttribute('required', 'true');
    }
  }

  radios.forEach(radio => {
    radio.addEventListener('change', updateFormState);
  });

  // Estado inicial
  updateFormState();

  // Manejo del formulario
  const form = document.getElementById('reserva-form') as HTMLFormElement | null;
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;
    if (!btn) return;
    
    const originalText = btn.innerHTML;
    
    btn.disabled = true;
    btn.innerHTML = 'Generando...';
    btn.classList.add('opacity-80', 'cursor-not-allowed');

    try {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      const response = await fetch('/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Mostrar modal interactivo con el ticket
        if (window.mostrarTicketModal) {
          await window.mostrarTicketModal(result.id, data.nombre as string, data.cantidad as string, result.whatsappUrl);
        } else if (window.generarTicket) {
          // Fallback legacy
          await window.generarTicket(result.id, data.nombre as string, data.cantidad as string);
          window.location.href = result.whatsappUrl;
        }
      } else {
        console.error("Error from API:", result);
        alert(result.error || 'Ocurrió un error al procesar tu reserva.');
      }
    } catch (error) {
      console.error("Connection Error:", error);
      alert('Ocurrió un error de conexión al procesar la reserva.');
    } finally {
      // Restauramos el botón ya que la UI se mantiene (pero el modal está abierto encima)
      btn.innerHTML = originalText;
      btn.disabled = false;
      btn.classList.remove('opacity-80', 'cursor-not-allowed');
      form.reset(); // Opcional: limpiar el formulario
      updateFormState(); // reset UI dependencias
    }
  });
}
