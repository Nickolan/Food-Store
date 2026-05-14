import type { Categoria } from "./Categoria";
import type { Ingrediente } from "./Ingrediente";

export interface ProductoIngrediente {
  ingrediente_id: number;
  es_removible: boolean;
}

export interface ProductoBase {
  nombre: string;
  descripcion: string;
  precio_base: number;
  stock: number;
  stock_minimo: number;
  disponible: boolean;
  imagenes_url: string[];
}

export interface Producto extends ProductoBase {
  id: number;
  activo: boolean;
  categorias?: Categoria[];
  ingredientes?: Ingrediente[];
}

export interface ProductoCreate extends ProductoBase {
  ingredientes?: ProductoIngrediente[];
}

export interface ProductoUpdate extends Partial<ProductoBase> {
  ingredientes?: ProductoIngrediente[];
}

// Para la respuesta completa con metadata de relaciones
export interface ProductoReadFull {
  id: number;
  nombre: string;
  descripcion: string;
  precio_base: number;
  stock: number;
  stock_minimo: number;
  disponible: boolean;
  imagenes_url: string[];
  activo: boolean;
  categorias: Array<{
    categoria: Categoria;
    es_principal: boolean;
  }>;
  ingredientes: Array<{
    ingrediente: Ingrediente;
    es_removible: boolean;
  }>;
}