import type { Categoria } from "./Categoria";
import type { Ingrediente } from "./Ingrediente";

export interface Producto {
  id?: number;
  nombre: string;
  descripcion: string;
  precio_base: number;
  stock: number;
  stock_minimo: number;
  disponible: boolean;
  imagenes_url: string[];
  activo: boolean;

  categorias?: Categoria[];
  ingredientes?: Ingrediente[];
}