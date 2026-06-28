export const env = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v6',
  MARGEN_MINIMO: Number(import.meta.env.VITE_MARGEN_MINIMO) || 30,
}