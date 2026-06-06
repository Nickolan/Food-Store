import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Producto } from '../models/Producto';

/** Clave única que diferencia variantes del mismo producto según ingredientes quitados */
export function generarClaveItem(productoId: number, ingredientesRemovidos: number[]): string {
  const sorted = [...ingredientesRemovidos].sort((a, b) => a - b).join(',');
  return `${productoId}_${sorted}`;
}

export interface CarritoItemUI {
  /** Clave compuesta producto_id + ingredientes_removidos — usarla para identificar el item */
  key: string;
  producto_id: number;
  nombre: string;
  precio_base: number;
  imagen_url?: string;
  cantidad: number;
  ingredientes_removidos: number[];
}

interface CarritoContextType {
  items: CarritoItemUI[];
  carritoAbierto: boolean;
  abrirCarrito: () => void;
  cerrarCarrito: () => void;
  toggleCarrito: () => void;
  agregarProducto: (producto: Producto, cantidad?: number, ingredientesRemovidos?: number[]) => void;
  quitarProducto: (key: string) => void;
  actualizarCantidad: (key: string, cantidad: number) => void;
  vaciarCarrito: () => void;
  totalItems: number;
  totalPrecio: number;
}

const CarritoContext = createContext<CarritoContextType | null>(null);

export const CarritoProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CarritoItemUI[]>([]);
  const [carritoAbierto, setCarritoAbierto] = useState(false);

  const agregarProducto = (
    producto: Producto,
    cantidad: number = 1,
    ingredientesRemovidos: number[] = []
  ) => {
    const key = generarClaveItem(producto.id, ingredientesRemovidos);

    setItems((prev) => {
      const existente = prev.find((i) => i.key === key);
      if (existente) {
        // Misma variante → solo suma cantidad
        return prev.map((i) =>
          i.key === key ? { ...i, cantidad: i.cantidad + cantidad } : i
        );
      }
      // Nueva variante (mismo o distinto producto con diferente personalización)
      return [
        ...prev,
        {
          key,
          producto_id: producto.id,
          nombre: producto.nombre,
          precio_base: producto.precio_base,
          imagen_url: producto.imagenes_url?.[0],
          cantidad,
          ingredientes_removidos: [...ingredientesRemovidos].sort((a, b) => a - b),
        },
      ];
    });
    setCarritoAbierto(true);
  };

  const quitarProducto = (key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  };

  const actualizarCantidad = (key: string, cantidad: number) => {
    if (cantidad <= 0) {
      quitarProducto(key);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.key === key ? { ...i, cantidad } : i))
    );
  };

  const vaciarCarrito = () => setItems([]);

  const totalItems = items.reduce((acc, i) => acc + i.cantidad, 0);
  const totalPrecio = items.reduce((acc, i) => acc + i.precio_base * i.cantidad, 0);

  return (
    <CarritoContext.Provider
      value={{
        items,
        carritoAbierto,
        abrirCarrito: () => setCarritoAbierto(true),
        cerrarCarrito: () => setCarritoAbierto(false),
        toggleCarrito: () => setCarritoAbierto((v) => !v),
        agregarProducto,
        quitarProducto,
        actualizarCantidad,
        vaciarCarrito,
        totalItems,
        totalPrecio,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => {
  const ctx = useContext(CarritoContext);
  if (!ctx) throw new Error('useCarrito debe usarse dentro de CarritoProvider');
  return ctx;
};
