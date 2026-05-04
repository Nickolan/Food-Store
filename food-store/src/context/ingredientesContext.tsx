import { createContext } from "react";
import type { Ingrediente } from "../models/Ingrediente";
import { useEffect, useReducer, useState, type ReactNode } from "react";
import { ingredienteReducer } from "../reducer/ingredienteReducer";

interface ContextType {
    ingredientes: Ingrediente[];
    ingredienteSeleccionado: Ingrediente | null;
    setIngredienteSeleccionado: (ingrediente: Ingrediente | null) => void;
    actualizar: (ingrediente: Ingrediente) => void;
    agregar: (ingrediente: Ingrediente) => void;
    eliminar: (id: number) => void;
    contador: number;
}
export const IngredientesContext = createContext<ContextType | undefined>(undefined)

export const IngredientesProvider = ({ children }: { children: ReactNode }) => {
    const [ingredientes, dispatch] = useReducer(ingredienteReducer, [])
    const api_url = "http://localhost:8000/ingrediente"; //CAMBIAR A /ingredientes LUEGO
    const [ingredienteSeleccionado, setIngredienteSeleccionado] = useState<Ingrediente | null>(null);
    let contador = ingredientes.length;

    useEffect(() => {
        fetch(api_url)
            .then(respuesta => respuesta.json())
            .then(data => dispatch({ type: "GET_INGREDIENTES", payload: data }))
    }, []);


    const agregar = async (ingrediente: Ingrediente) => {
        try {
            const respuesta = await fetch(api_url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(ingrediente)
            });
            if (respuesta.ok) {
                const nuevoIngrediente = await respuesta.json();
                dispatch({ type: "AGREGAR_INGREDIENTE", payload: nuevoIngrediente });
            }
        } catch (error) {
            console.error("Error al agregar ingrediente:", error);
        }
    };

    const eliminar = async (id: number) => {
        try {
            const respuesta = await fetch(`${api_url}/${id}`, {
                method: "DELETE"
            });
            if (respuesta.ok) {
                dispatch({ type: "ELIMINAR_INGREDIENTE", payload: id });
            }
        } catch (error) {
            console.error("Error al eliminar ingrediente:", error);
        }
    }
    const actualizar = async (ingrediente: Ingrediente) => {
        try {
            const respuesta = await fetch(`${api_url}/${ingrediente.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(ingrediente)
            });
            if (respuesta.ok) {
                const ingredienteActualizado = await respuesta.json();
                dispatch({ type: "ACTUALIZAR_INGREDIENTE", payload: ingredienteActualizado });
            }
        } catch (error) {
            console.error("Error al actualizar ingrediente:", error);
        }
    };
    return (
        <IngredientesContext.Provider value={{
            ingredientes: ingredientes,
            ingredienteSeleccionado: ingredienteSeleccionado,
            setIngredienteSeleccionado: setIngredienteSeleccionado,
            actualizar: actualizar,
            agregar: agregar,
            eliminar: eliminar,
            contador: contador
        }}>
            {children}
        </IngredientesContext.Provider>
    )
}