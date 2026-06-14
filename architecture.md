# Directrices de Arquitectura y Código Limpio

## 1. Principios de Arquitectura (Clean Architecture)
- **Separación de Responsabilidades:** El código de la interfaz (UI) debe estar estrictamente separado de la lógica de negocio y las consultas de datos.
- **Estructura de Carpetas Modular:** 
  - `features/`: Agrupar por dominio o funcionalidad (ej. `features/auth`, `features/projects`).
  - `components/ui/`: Solo componentes visuales puros y reutilizables.
  - `hooks/`: Lógica de estado y efectos aislada.

## 2. Reglas de Código Limpio (Clean Code)
- **Funciones Pequeñas:** Ninguna función o componente debe exceder las 60 líneas de código. Si crece, se debe refactorizar en submódulos o hooks personalizados.
- **Tipado Estricto:** Prohibido el uso de `any`. Todos los datos externos (APIs, formularios, ORMs) deben tener interfaces o tipos explícitos en TypeScript.
- **Inmutabilidad:** Priorizar siempre métodos declarativos (`map`, `filter`, `reduce`) sobre bucles imperativos (`for`, `while`).

## 3. Manejo de Errores y Resiliencia
- Todo flujo de datos asíncrono (llamadas a API, operaciones de base de datos) **debe** estar envuelto en bloques `try/catch` estructurados.
- Los errores deben ser capturados, registrados con contexto y retornar un estado seguro o fallback para el usuario, nunca romper la aplicación.

