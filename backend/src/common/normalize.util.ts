export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return digits.slice(-9);
}

export function normalizeName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

export function normalizePatente(patente: string): string {
  return patente.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

export function maskName(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts
    .map((p) => (p.length > 1 ? p[0] + '*'.repeat(p.length - 1) : p))
    .join(' ');
}

export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return '****';
  return '*'.repeat(digits.length - 4) + digits.slice(-4);
}
