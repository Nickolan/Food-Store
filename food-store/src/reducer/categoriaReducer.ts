import type { Categoria } from "../models/Categoria";

export type Action =
    | { type: "GET_CATEGORIAS", payload: Categoria[] }
    | { type: "AGREGAR_CATEGORIA", payload: Categoria }
    | { type: "ELIMINAR_CATEGORIA", payload: number }
    | { type: "ACTUALIZAR_CATEGORIA", payload: Categoria }

export const categoriaReducer = (state: Categoria[], action: Action): Categoria[] => {
    switch (action.type) {
        case "GET_CATEGORIAS":
            return action.payload;
        case "AGREGAR_CATEGORIA":
            return [...state, action.payload];
        case "ELIMINAR_CATEGORIA":
            return state.filter(p => p.id !== action.payload);
        case "ACTUALIZAR_CATEGORIA":
            return state.map(p => p.id === action.payload.id ? action.payload : p);
        default:
            return state;
    }
}