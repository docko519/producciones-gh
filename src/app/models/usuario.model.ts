export interface Usuario {
  id: number;
  nombre: string;  // ✅ Usa 'nombre' (no 'userName')
  telefono?: string;
  isAdmin: boolean;
  // Campos adicionales para admin (opcional):
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
}