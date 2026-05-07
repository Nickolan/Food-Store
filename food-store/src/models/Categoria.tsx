export interface Categoria {
    id: number;
    nombre: string;
    descripcion: string;
    parent_id?: number
    imagen_url: string;
    activo: boolean;
    hijos?: number[]
}