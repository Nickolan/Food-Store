export interface Ingrediente{
    id?:number;
    nombre:string;
    descripcion:string;
    stock_cantidad: number;
    precio?: number | null;
    es_alergeno:boolean;
    activo: boolean;
    unidad_medida_id?: number | null;
    unidad_medida?: { id: number; nombre: string; simbolo: string } | null;
}
