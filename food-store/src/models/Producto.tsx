import type { Categoria } from "./Categoria";
import type { Ingrediente } from "./Ingrediente";

export interface Producto {
    id?: number;
    nombre: string;
    descripcion: string;
    precio_base: number;
    stock_cantidad: number;
    disponible: boolean;
    imagenes_url: string[];
    activo: boolean;

    categorias_ids: number[];
    ingredientes_ids: number[];

    categorias?: Categoria[];
    ingredientes?: Ingrediente[];

}