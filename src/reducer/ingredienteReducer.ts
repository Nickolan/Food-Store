import type { Ingrediente } from "../models/Ingrediente";

export type Action=
|{type:"GET_INGREDIENTES",payload:Ingrediente[]}
|{type:"AGREGAR_INGREDIENTE",payload:Ingrediente}
|{type:"ELIMINAR_INGREDIENTE",payload:number}
|{type:"ACTUALIZAR_INGREDIENTE",payload:Ingrediente}

export const ingredienteReducer=(state:Ingrediente[],action:Action):Ingrediente[]=>{
        switch(action.type){
            case "GET_INGREDIENTES":
                return action.payload;
            case "AGREGAR_INGREDIENTE":
                return [...state, action.payload];
            case "ELIMINAR_INGREDIENTE":
                return state.filter(p => p.id !== action.payload);
            case "ACTUALIZAR_INGREDIENTE":
                return state.map(p => p.id === action.payload.id ? action.payload : p);
            default:
                return state;
        }
    }