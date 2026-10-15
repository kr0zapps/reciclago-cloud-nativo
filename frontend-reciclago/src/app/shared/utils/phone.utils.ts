/**
 * Utilidades para formateo, limpieza y validación de números telefónicos en Chile (+56 9 XXXX XXXX).
 */

/**
 * Limpia cualquier caracter no numérico.
 */
export function cleanPhone(phone: string | null | undefined): string {
  if (!phone) return '';
  return String(phone).replace(/\D/g, '');
}

/**
 * Formatea un número al estándar chileno móvil: +56 9 XXXX XXXX
 * Si el usuario escribe "987654321", produce "+56 9 8765 4321".
 */
export function formatChileanPhone(value: string | null | undefined): string {
  if (!value) return '';
  let digits = cleanPhone(value);

  // Si empieza con 56, remover prefijo país para normalizar
  if (digits.startsWith('56')) {
    digits = digits.substring(2);
  }

  if (digits.length === 0) return '';

  // Asegurar que el primer dígito sea 9 para móvil chileno si ya tiene longitud
  let rest = digits;
  if (rest.startsWith('9')) {
    rest = rest.substring(1);
  }

  // Máximo 8 dígitos después del 9
  rest = rest.substring(0, 8);

  let formatted = '+56 9';
  if (rest.length > 0) {
    formatted += ' ' + rest.substring(0, 4);
  }
  if (rest.length > 4) {
    formatted += ' ' + rest.substring(4, 8);
  }

  return formatted;
}

/**
 * Valida si un string corresponde a un teléfono móvil chileno válido.
 * Requiere 9 dígitos (9 + 8 dígitos) opcionalmente precedido por +56.
 */
export function validateChileanPhone(value: string | null | undefined): boolean {
  if (!value) return false;
  let digits = cleanPhone(value);
  if (digits.startsWith('56')) {
    digits = digits.substring(2);
  }
  return digits.length === 9 && digits.startsWith('9');
}
