import { createContext, useEffect, useReducer, useState, type ReactNode } from "react";
import type { Categoria } from "../models/Categoria";
import { categoriaReducer } from "../reducer/categoriaReducer";
import { getCategorias, createCategoria, updateCategoria, deleteCategoria } from "../api/categoriasApi";

interface ContextType{
    categorias: Categoria[];
    categoriaSeleccionada: Categoria | null;
    setCategoriaSeleccionada: (categoria: Categoria | null) => void;
    actualizar: (categoria: Categoria) => void;
    agregar: (categoria: Categoria) => void;
    eliminar: (id: number) => void;
    contador: number;
}

export const CategoriasContext = createContext<ContextType |undefined> (undefined)

export const CategoriasProvider=({children}:{children:ReactNode})=>{
    const [categorias, dispatch]=useReducer(categoriaReducer,[])
    const [categoriaSeleccionada, setCategoriaSeleccionada]=useState<Categoria | null>(null);
    let contador=categorias.length;

    useEffect(()=>{
        const cargarCategorias = async () => {
            try {
                const datos = await getCategorias();
                dispatch({ type: "GET_CATEGORIAS", payload: datos });
            } catch (error) {
                console.error("Error al obtener categorias:", error);
            }
        };
        cargarCategorias();
    }, []);
    
    const agregar=async(categoria:Categoria)=>{
        try{
            const nuevaCategoria = await createCategoria(categoria);
            dispatch({type:"AGREGAR_CATEGORIA", payload:nuevaCategoria});
        }catch(error){
            console.error("Error al agregar categoria:", error);
        }
    }
    const eliminar=async(id:number)=>{
        try{
            await deleteCategoria(id);
            dispatch({type:"ELIMINAR_CATEGORIA", payload:id});
        }catch(error){
            console.error("Error al eliminar categoria:", error);
        }
    }
    const actualizar=async(categoria:Categoria)=>{
        try{
            const categoriaActualizada = await updateCategoria(categoria.id, categoria);
            dispatch({type:"ACTUALIZAR_CATEGORIA", payload:categoriaActualizada});
        }catch(error){
            console.error("Error al actualizar categoria:", error);
        }
    }

return(
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
