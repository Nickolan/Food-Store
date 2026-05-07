import { createContext, useEffect, useReducer, useState, type ReactNode } from "react";
import axios from "axios";
import type { Producto } from "../models/Producto";
import { productoReducer } from "../reducer/productoReducer";

interface ContextType{
    productos: Producto[];
    productoSeleccionado: Producto | null;
    setProductoSeleccionado: (producto: Producto | null) => void;
    actualizar: (producto: Producto) => void;
    agregar: (producto: Producto) => void;
    eliminar: (id: number) => void;
    contador: number;
}
export const ProductosContext= createContext<ContextType |undefined> (undefined)

export const ProductosProvider=({children}:{children:ReactNode})=>{
    const [productos,dispatch]=useReducer(productoReducer,[])
    const api_url="/productos";
    const [productoSeleccionado,setProductoSeleccionado]=useState<Producto | null>(null);
    let contador=productos.length;
     
    useEffect(()=>{
        const getProductos = async () => {
            try {
                const respuesta = await axios.get(api_url);
                dispatch({ type: "GET_PRODUCTOS", payload: respuesta.data });
            } catch (error) {
                console.error("Error al obtener productos:", error);
            }
        };
        getProductos();
      },[])

    const agregar=async(producto:Producto)=>{
             try{
             const respuesta = await axios.post(api_url, producto);
             if (respuesta.status === 201 || respuesta.status === 200){
             const nuevoProducto = respuesta.data;
             dispatch({type:"AGREGAR_PRODUCTO", payload:nuevoProducto});
             }
             }catch(error){
                 console.error("Error al agregar producto:", error);
             }
         };
        const eliminar=async(id:number)=>{
                try{
                    const respuesta = await axios.delete(`${api_url}/${id}`);
                    if (respuesta.status === 200 || respuesta.status === 204){
                        dispatch({type:"ELIMINAR_PRODUCTO",payload:id})
                    }
                }catch(error){
                        console.error("Error al eliminar producto:", error);
                }
        }
    const actualizar=async(producto:Producto)=>{
        try{
            const respuesta = await axios.put(`${api_url}/${producto.id}`, producto);
            if (respuesta.status === 200){
                const productoActualizado = respuesta.data
                dispatch({type:"ACTUALIZAR_PRODUCTO",payload:productoActualizado})
            }
        }catch(error){
            console.error("Error al actualizar producto:", error);
        }
    }

        

return(
      <ProductosContext.Provider value={{
            productos:productos,
            productoSeleccionado:productoSeleccionado,
            setProductoSeleccionado:setProductoSeleccionado,
            actualizar:actualizar,
            agregar:agregar,
            eliminar:eliminar,
            contador:contador
        }}>
            {children}
        </ProductosContext.Provider>
)
}