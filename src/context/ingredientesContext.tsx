import { createContext } from "react";

import type { Ingrediente } from "../models/Ingrediente";

import { useEffect, useReducer, useState, type ReactNode } from "react";

import { ingredienteReducer } from "../reducer/ingredienteReducer";

import axios from "axios";



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

    const api_url = "/ingredientes"; //CAMBIAR A /ingredientes LUEGO

    const [ingredienteSeleccionado, setIngredienteSeleccionado] = useState<Ingrediente | null>(null);

    let contador = ingredientes.length;

    const getIngredientes = async () => {
        try {
            const respuesta = await axios.get(api_url);
            const lista = respuesta.data.items || respuesta.data;
            dispatch({ type: "GET_INGREDIENTES", payload: lista });
        } catch (error) {
            console.error("Error al obtener ingredientes:", error);
        }
    }


    useEffect(() => {

        getIngredientes();

    }, []);


    const agregar = async (ingrediente: Ingrediente) => {

        try {

            const respuesta = await axios.post(api_url, ingrediente);

            
            
            
            if (respuesta.status === 201) {
                
                const nuevoIngrediente = respuesta.data;

                dispatch({ type: "AGREGAR_INGREDIENTE", payload: nuevoIngrediente });

            }

        } catch (error) {

            console.error("Error al agregar ingrediente:", error);

        }

    };



    const eliminar = async (id: number) => {

        try {

            const respuesta = await axios.delete(`${api_url}/${id}`);

            if (respuesta.status === 200 || respuesta.status === 204) {

                dispatch({ type: "ACTUALIZAR_INGREDIENTE", payload: respuesta.data });

            }

        } catch (error) {

            console.error("Error al eliminar ingrediente:", error);

        }

    }

    const actualizar = async (ingrediente: Ingrediente) => {

        try {

            const respuesta = await axios.put(`${api_url}/${ingrediente.id}`, ingrediente);

            if (respuesta.status === 200) {

                const ingredienteActualizado = respuesta.data;

                dispatch({ type: "ACTUALIZAR_INGREDIENTE", payload: ingredienteActualizado });

                body: JSON.stringify(ingrediente)

            };


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