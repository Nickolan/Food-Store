import { createContext, useEffect, useReducer, useState, type ReactNode } from "react";
import type { Ingrediente } from "../models/Ingrediente";
import { ingredienteReducer } from "../reducer/ingredienteReducer";
import {
    getIngredientes as fetchIngredientes,
    createIngrediente,
    updateIngrediente,
    deleteIngrediente,
    type IngredienteFilter
} from "../api/ingredientesApi";

interface ContextType {
    ingredientes: Ingrediente[];
    total: number;
    ingredienteSeleccionado: Ingrediente | null;
    setIngredienteSeleccionado: (ingrediente: Ingrediente | null) => void;
    cargar: (filters?: IngredienteFilter) => Promise<void>;
    actualizar: (ingrediente: Ingrediente) => void;
    agregar: (ingrediente: Omit<Ingrediente, "id">) => void;
    eliminar: (id: number) => void;
    contador: number;
}

export const IngredientesContext = createContext<ContextType | undefined>(undefined);

export const IngredientesProvider = ({ children }: { children: ReactNode }) => {

    const [ingredientes, dispatch] = useReducer(ingredienteReducer, []);
    const [total, setTotal] = useState(0);
    const [ingredienteSeleccionado, setIngredienteSeleccionado] = useState<Ingrediente | null>(null);

    const contador = ingredientes.length;

    const cargar = async (filters?: IngredienteFilter) => {
        try {
            const datos = await fetchIngredientes(filters);
            setTotal(datos.total);
            dispatch({ type: "GET_INGREDIENTES", payload: datos.items });
        } catch (error) {
            console.error("Error al obtener ingredientes:", error);
        }
    };

    useEffect(() => {
        cargar();
    }, []);

    const agregar = async (ingrediente: Omit<Ingrediente, "id">) => {
        try {
            const nuevoIngrediente = await createIngrediente(ingrediente);
            dispatch({ type: "AGREGAR_INGREDIENTE", payload: nuevoIngrediente });
        } catch (error) {
            console.error("Error al agregar ingrediente:", error);
        }
    };

    const actualizar = async (ingrediente: Ingrediente) => {
        try {
            const ingredienteActualizado = await updateIngrediente(ingrediente.id, ingrediente);
            dispatch({ type: "ACTUALIZAR_INGREDIENTE", payload: ingredienteActualizado });
        } catch (error) {
            console.error("Error al actualizar ingrediente:", error);
        }
    };

    const eliminar = async (id: number) => {
    try {
        const ingrediente = ingredientes.find(i => i.id === id);
        if (!ingrediente) return;
        const ingredienteActualizado = await updateIngrediente(id, {
            ...ingrediente,
            activo: !ingrediente.activo  
        });
        dispatch({ type: "ACTUALIZAR_INGREDIENTE", payload: ingredienteActualizado });
    } catch (error) {
        console.error("Error al cambiar estado del ingrediente:", error);
    }
};

    return (
        <IngredientesContext.Provider value={{
            ingredientes,
            total,
            ingredienteSeleccionado,
            setIngredienteSeleccionado,
            cargar,
            actualizar,
            agregar,
            eliminar,
            contador,
        }}>
            {children}
        </IngredientesContext.Provider>
    );
};