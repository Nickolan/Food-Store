import { createContext, useEffect, useReducer, useState, type ReactNode } from "react";
import type { Categoria } from "../models/Categoria";
import { categoriaReducer } from "../reducer/categoriaReducer";

interface ContextType {
    categorias: Categoria[];
    categoriaSeleccionada: Categoria | null;
    setCategoriaSeleccionada: (categoria: Categoria | null) => void;
    actualizar: (categoria: Categoria) => void;
    agregar: (categoria: Categoria) => void;
    eliminar: (id: number) => void;
    contador: number;
}

export const CategoriasContext = createContext<ContextType | undefined>(undefined)

export const CategoriasProvider = ({ children }: { children: ReactNode }) => {
    const [categorias, dispatch] = useReducer(categoriaReducer, [])
    const api_url = "http://localhost:8000/categorias";
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(null);
    const contador = categorias.length;

    useEffect(() => {
        fetch(api_url)
            .then(respuesta => respuesta.json())
            .then(data => dispatch({ type: "GET_CATEGORIAS", payload: data }))
    }, []);

    const agregar = async (categoria: Categoria) => {
        try {
            const respuesta = await fetch(api_url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(categoria)
            });
            if (respuesta.ok) {
                const nuevaCategoria = await respuesta.json();
                dispatch({ type: "AGREGAR_CATEGORIA", payload: nuevaCategoria });
            }
        } catch (error) {
            console.error("Error al agregar categoria:", error);
        }
    }
    const eliminar = async (id: number) => {
        try {
            const respuesta = await fetch(`${api_url}/${id}`, {
                method: "DELETE"
            });
            if (respuesta.ok) {
                dispatch({ type: "ELIMINAR_CATEGORIA", payload: id });
            }
        } catch (error) {
            console.error("Error al eliminar categoria:", error);
        }
    }
    const actualizar = async (categoria: Categoria) => {
        try {
            const respuesta = await fetch(`${api_url}/${categoria.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(categoria)
            });
            if (respuesta.ok) {
                const categoriaActualizada = await respuesta.json();
                dispatch({ type: "ACTUALIZAR_CATEGORIA", payload: categoriaActualizada });
            }
        } catch (error) {
            console.error("Error al actualizar categoria:", error);
        }
    }

    return (
        <CategoriasContext.Provider value={{
            categorias: categorias,
            categoriaSeleccionada: categoriaSeleccionada,
            setCategoriaSeleccionada: setCategoriaSeleccionada,
            actualizar: actualizar,
            agregar: agregar,
            eliminar: eliminar,
            contador: contador
        }}>
            {children}
        </CategoriasContext.Provider>
    )
}