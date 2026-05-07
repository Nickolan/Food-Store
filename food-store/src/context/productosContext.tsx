import { createContext, useEffect, useReducer, useState, type ReactNode } from "react";
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
    const api_url="http://localhost:8000/productos";
    const [productoSeleccionado,setProductoSeleccionado]=useState<Producto | null>(null);
    let contador=productos.length;
     
    useEffect(()=>{
        fetch(api_url)
        .then(res=>res.json())
        .then(data=>{dispatch({type:"GET_PRODUCTOS",payload:data})})
      },[])

    const agregar=async(producto:Producto)=>{
             try{
             const respuesta=await fetch(api_url,{
                 method:"POST",
                 headers:{"Content-Type":"application/json"},
                 body:JSON.stringify(producto)
             });
             if (respuesta.ok){
             const nuevoProducto=await respuesta.json();
             dispatch({type:"AGREGAR_PRODUCTO", payload:nuevoProducto});
             }
             }catch(error){
                 console.error("Error al agregar producto:", error);
             }
         };
    const eliminar=async(id:number)=>{
        try{
          const respuesta=await fetch(`${api_url}/${id}`,{
            method:"DELETE",
          })
          if (respuesta.ok){
            dispatch({type:"ELIMINAR_PRODUCTO",payload:id})
          }
        }catch(error){
            console.error("Error al eliminar producto:", error);
        }
    }
    const actualizar=async(producto:Producto)=>{
        try{
            const respuesta= await fetch(`${api_url}/${producto.id}`,{
                method:"PUT",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(producto)
            })
            if (respuesta.ok){
                const productoActualizado=await respuesta.json()
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