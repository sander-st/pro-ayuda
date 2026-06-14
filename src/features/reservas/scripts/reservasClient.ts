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

  // Lógica de validación de cantidad de porciones
  const cantidadInput = document.getElementById('cantidad') as HTMLInputElement | null;
  const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement | null;
  const submitText = document.getElementById('submit-text');
  const submitIcon = document.getElementById('submit-icon');

  if (cantidadInput && submitText && submitBtn) {
    cantidadInput.addEventListener('input', () => {
      const val = parseInt(cantidadInput.value || '1', 10);
      if (val >= 3) {
        submitText.innerText = 'Contactar por WhatsApp';
        submitBtn.classList.remove('bg-ticket-accent', 'hover:bg-rose-700', 'shadow-rose-500/30');
        submitBtn.classList.add('bg-green-500', 'hover:bg-green-600', 'shadow-green-500/30');
        if (submitIcon) {
          submitIcon.innerHTML = '<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9" /><path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1" />';
        }
      } else {
        submitText.innerText = 'Generar Ticket';
        submitBtn.classList.add('bg-ticket-accent', 'hover:bg-rose-700', 'shadow-rose-500/30');
        submitBtn.classList.remove('bg-green-500', 'hover:bg-green-600', 'shadow-green-500/30');
        if (submitIcon) {
          submitIcon.innerHTML = '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>';
        }
      }
    });
  }

  // Manejo del formulario
  const form = document.getElementById('reserva-form') as HTMLFormElement | null;
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;
    if (!btn) return;
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const cantidad = parseInt((data.cantidad as string) || '1', 10);

    if (cantidad >= 3) {
      // Redirigir a WhatsApp directamente
      const nombre = data.nombre ? data.nombre.toString().trim() : '';
      const whatsappNumber = '51902083574'; // Mismo número usado en la API
      const mensaje = `¡Hola! Quisiera coordinar un pedido de ${cantidad} porciones de la pollada solidaria. Mi nombre es ${nombre}.`;
      const encodedMensaje = encodeURIComponent(mensaje);
      window.open(`https://wa.me/${whatsappNumber}?text=${encodedMensaje}`, '_blank');
      return;
    }

    const originalText = btn.innerHTML;
    
    btn.disabled = true;
    btn.innerHTML = 'Generando...';
    btn.classList.add('opacity-80', 'cursor-not-allowed');

    try {

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
