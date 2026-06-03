export interface Ingrediente{
    id?:number;
    nombre:string;
    descripcion:string;
    stock_cantidad: number;
    es_alergeno:boolean;
    activo: boolean;
}