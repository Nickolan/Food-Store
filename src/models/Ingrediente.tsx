export interface Ingrediente{
    id?:number;
    nombre:string;
    descripcion:string;
    stock_cantidad: number;
    precio?: number | null;
    es_alergeno:boolean;
    activo: boolean;
}
