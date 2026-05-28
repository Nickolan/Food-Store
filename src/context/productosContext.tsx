import { createContext, useEffect, useReducer, useState, type ReactNode } from "react"; 
import type { Producto, ProductoCreate, ProductoUpdate } from "../models/Producto"; 
import { productoReducer } from "../reducer/productoReducer";
import {                                    
    getProductos as fetchProductos,
    createProducto,
    updateProducto,
    desactivarProducto,
    reactivarProducto,
    type ProductoFilter
} from "../api/productosApi";
interface ContextType {
    productos: Producto[];
    total: number;
    productoSeleccionado: Producto | null;
    setProductoSeleccionado: (producto: Producto | null) => void;
    cargar: (filters?: ProductoFilter) => Promise<void>;          
    actualizar: (id: number, producto: ProductoUpdate) => void;   
    agregar: (producto: ProductoCreate) => void;     
    eliminar: (id: number) => void;
    contador: number;
    reactivar: (id: number) => void;
}
export const ProductosContext = createContext<ContextType | undefined>(undefined)

export const ProductosProvider = ({ children }: { children: ReactNode }) => {
    const [productos, dispatch] = useReducer(productoReducer, [])
    const api_url = "/productos/";
    const [total, setTotal] = useState(0);
    const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
    const contador = productos.length;
    
    const cargar = async (filters?: ProductoFilter) => {              
     try {
        const datos = await fetchProductos(filters);
         setTotal(datos.total);
         dispatch({ type: "GET_PRODUCTOS", payload: datos.items });
       } catch (error) {
          console.error("Error al obtener productos:", error);
        }
    };

     useEffect(() => {                                                  
        cargar();
    }, []);

    const agregar = async (producto: ProductoCreate) => {             
        try {
            const nuevoProducto = await createProducto(producto);
            dispatch({ type: "AGREGAR_PRODUCTO", payload: nuevoProducto });
        } catch (error) {
            console.error("Error al agregar producto:", error);
        }
    };
    const eliminar = async (id: number) => {                          
        try {
            const productoDesactivado = await desactivarProducto(id);
            dispatch({ type: "ACTUALIZAR_PRODUCTO", payload: productoDesactivado });
        } catch (error) {
            console.error("Error al desactivar producto:", error);
        }
    };
    const actualizar = async (id: number, producto: ProductoUpdate) => { 
        try {
            const productoActualizado = await updateProducto(id, producto);
            dispatch({ type: "ACTUALIZAR_PRODUCTO", payload: productoActualizado });
        } catch (error) {
            console.error("Error al actualizar producto:", error);
        }
    };
    const reactivar = async (id: number) => {                         
        try {
            const productoReactivado = await reactivarProducto(id);
            dispatch({ type: "ACTUALIZAR_PRODUCTO", payload: productoReactivado });
        } catch (error) {
            console.error("Error al reactivar producto:", error);
        }
    };

    return (
        <ProductosContext.Provider value={{
            productos: productos,
            productoSeleccionado: productoSeleccionado,
            setProductoSeleccionado: setProductoSeleccionado,
            actualizar: actualizar,
            total: total,
            cargar: cargar,
            agregar: agregar,
            eliminar: eliminar,
            contador: contador,
            reactivar: reactivar
        }}>
            {children}
        </ProductosContext.Provider>
    )
}