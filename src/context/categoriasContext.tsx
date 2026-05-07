import { createContext, useEffect, useReducer, useState, type ReactNode } from "react";
import axios from "axios";
import type { Categoria } from "../models/Categoria";
import { categoriaReducer } from "../reducer/categoriaReducer";

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
    const api_url="/categorias";
    const [categoriaSeleccionada, setCategoriaSeleccionada]=useState<Categoria | null>(null);
    let contador=categorias.length;

    useEffect(()=>{
        const getCategorias = async () => {
            try {
                const respuesta = await axios.get(api_url);
                dispatch({ type: "GET_CATEGORIAS", payload: respuesta.data });
            } catch (error) {
                console.error("Error al obtener categorias:", error);
            }
        };
        getCategorias();
    }, []);
    
    const agregar=async(categoria:Categoria)=>{
        try{
            const respuesta = await axios.post(api_url, categoria);
            if (respuesta.status === 201 || respuesta.status === 200){
                const nuevaCategoria = respuesta.data;
                dispatch({type:"AGREGAR_CATEGORIA", payload:nuevaCategoria});
            }
        }catch(error){
            console.error("Error al agregar categoria:", error);
        }
    }
    const eliminar=async(id:number)=>{
        try{
            const respuesta = await axios.delete(`${api_url}/${id}`);
            if (respuesta.status === 200 || respuesta.status === 204){
                dispatch({type:"ELIMINAR_CATEGORIA", payload:id});
            }
        }catch(error){
            console.error("Error al eliminar categoria:", error);
        }
    }
    const actualizar=async(categoria:Categoria)=>{
        try{
            const respuesta = await axios.put(`${api_url}/${categoria.id}`, categoria);
            if (respuesta.status === 200){
                const categoriaActualizada = respuesta.data;
                dispatch({type:"ACTUALIZAR_CATEGORIA", payload:categoriaActualizada});
            }
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
