import type { Categoria } from "./Categoria";
import type { Ingrediente } from "./Ingrediente";
import type { UnidadMedida } from "./Unidad_medida";
export interface ProductoIngrediente {
  ingrediente_id: number;
  es_removible: boolean;
  cantidad: number;           
}

export interface ProductoBase {
  nombre: string;
  descripcion: string;
  precio_base: number;
  stock_minimo: number;
  disponible: boolean;
  imagenes_url: string[];
}

export interface Producto extends ProductoBase {
  id: number;
  activo: boolean;
  alerta_ingrediente_modificado?: boolean;
  categorias?: Categoria[];
  ingredientes?: Ingrediente[];
  unidad_medida?: UnidadMedida | null;
  tiene_alerta_precio?: boolean;
}

export interface ProductoCreate extends ProductoBase {
  ingredientes?: ProductoIngrediente[];
  unidad_venta_id?: number | null; 
  categorias_ids: number[];
}

export interface ProductoUpdate extends Partial<ProductoBase> {
  ingredientes?: ProductoIngrediente[];
  unidad_venta_id?: number | null; 
  categorias_ids: number[];
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
  unidad_medida?: UnidadMedida | null;
  activo: boolean;
  alerta_ingrediente_modificado: boolean;
  tiene_alerta_precio: boolean;
  categorias: Array<{
    categoria: Categoria;
    es_principal: boolean;
  }>;
  ingredientes: Array<{
    ingrediente: Ingrediente;
    es_removible: boolean;
    cantidad: number;
  }>;
}