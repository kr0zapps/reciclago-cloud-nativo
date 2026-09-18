/**
 * Utilidades para formateo, limpieza y validación de RUT/RUN chileno (Módulo 11).
 */

/**
 * Limpia el RUT eliminando puntos, guiones, espacios y convirtiendo a mayúsculas.
 * Ejemplo: " 19.876.543-k " -> "19876543K"
 */
export function cleanRut(rut: string | null | undefined): string {
  if (!rut) return '';
  return String(rut).replace(/[^0-9kK]/g, '').toUpperCase();
}

/**
 * Formatea un RUT con puntos y guion en tiempo real.
 * Ejemplo: "19876543k" -> "19.876.543-K"
 */
export function formatRut(rut: string | null | undefined): string {
  const cleaned = cleanRut(rut);
  if (!cleaned) return '';

  if (cleaned.length <= 1) return cleaned;

  const dv = cleaned.slice(-1);
  const cuerpo = cleaned.slice(0, -1);

  // Formatear cuerpo con separadores de miles
  let formattedCuerpo = '';
  let count = 0;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    formattedCuerpo = cuerpo.charAt(i) + formattedCuerpo;
    count++;
    if (count % 3 === 0 && i !== 0) {
      formattedCuerpo = '.' + formattedCuerpo;
    }
  }

  return `${formattedCuerpo}-${dv}`;
}

/**
 * Valida un RUT chileno usando el algoritmo oficial de Módulo 11.
 */
export function validateRut(rut: string | null | undefined): boolean {
  const cleaned = cleanRut(rut);
  if (!cleaned || cleaned.length < 8 || cleaned.length > 9) {
    return false;
  }

  const cuerpo = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1);

  if (!/^\d+$/.test(cuerpo)) {
    return false;
  }

  let suma = 0;
  let multiplo = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo.charAt(i), 10) * multiplo;
    multiplo = multiplo < 7 ? multiplo + 1 : 2;
  }

  const dvEsperado = 11 - (suma % 11);
  let dvStr = '';

  if (dvEsperado === 11) {
    dvStr = '0';
  } else if (dvEsperado === 10) {
    dvStr = 'K';
  } else {
    dvStr = String(dvEsperado);
  }

  return dv === dvStr;
}
