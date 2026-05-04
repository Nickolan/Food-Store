import type { Producto } from "../models/Producto";

export type Action =
    | { type: "GET_PRODUCTOS", payload: Producto[] }
    | { type: "AGREGAR_PRODUCTO", payload: Producto }
    | { type: "ELIMINAR_PRODUCTO", payload: number }
    | { type: "ACTUALIZAR_PRODUCTO", payload: Producto }

export const productoReducer = (state: Producto[], action: Action): Producto[] => {
    switch (action.type) {
        case "GET_PRODUCTOS":
            return action.payload;
        case "AGREGAR_PRODUCTO":
            return [...state, action.payload];
        case "ELIMINAR_PRODUCTO":
            return state.filter(p => p.id !== action.payload);
        case "ACTUALIZAR_PRODUCTO":
            return state.map(p => p.id === action.payload.id ? action.payload : p);
        default:
            return state;
    }
}