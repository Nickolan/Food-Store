import React, { useState, useEffect, useCallback } from 'react';
import { RiCheckboxLine, RiCheckboxIndeterminateLine } from "react-icons/ri";
import type { Producto } from '../../models/Producto';
import type { ProductoReadFull } from '../../models/Producto';
import { getProductoById } from '../../api/productosApi';

interface Props {
  producto: Producto | null;
  isOpen: boolean;
  onClose: () => void;
  onAgregar: (productoId: number, cantidad: number, ingredientesRemovidos: number[]) => void;
}

function DetalleProductoModal({ producto, isOpen, onClose, onAgregar }: Props) {
  const [productoCompleto, setProductoCompleto] = useState<ProductoReadFull | null>(null);
  const [loading, setLoading] = useState(false);
  const [cantidad, setCantidad] = useState(1);
  const [ingredientesRemovidos, setIngredientesRemovidos] = useState<Set<number>>(new Set());

  
  useEffect(() => {
    if (producto && isOpen) {
      setLoading(true);
      setCantidad(1);
      setIngredientesRemovidos(new Set());
      
      getProductoById(producto.id)
        .then(data => {
          setProductoCompleto(data);
        })
        .catch(err => {
          console.error('Error al cargar detalle del producto:', err);
        })
        .finally(() => setLoading(false));
    } else {
      setProductoCompleto(null);
    }
  }, [producto, isOpen]);

  // Manejar cierre con Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Manejar backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Toggle ingrediente removible
  const toggleIngrediente = (ingredienteId: number | undefined) => {
    if (!ingredienteId) return;
    
    setIngredientesRemovidos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(ingredienteId)) {
        newSet.delete(ingredienteId);
      } else {
        newSet.add(ingredienteId);
      }
      return newSet;
    });
  };

  // Calcular precio total
  const calcularPrecioTotal = useCallback(() => {
    if (!productoCompleto) return 0;
    return productoCompleto.precio_base * cantidad;
  }, [productoCompleto, cantidad]);

  // Manejar agregar al carrito
  const handleAgregar = () => {
    if (!producto) return;
    onAgregar(producto.id, cantidad, Array.from(ingredientesRemovidos));
    onClose();
  };

  
  const incrementarCantidad = () => setCantidad(prev => prev + 1);
  const decrementarCantidad = () => setCantidad(prev => Math.max(1, prev - 1));

  if (!isOpen) return null;

  
  const ingredientesConInfo = productoCompleto?.ingredientes || [];
  
  const ingredientesRemovibles = ingredientesConInfo.filter(
    item => item.es_removible === true && item.ingrediente.id
  );
  
  const ingredientesNoRemovibles = ingredientesConInfo.filter(
    item => item.es_removible === false && item.ingrediente.id
  );

  // Obtener la categoría principal
  console.log(productoCompleto);
  
  const categoriaPrincipal = productoCompleto?.categorias?.find(cat => cat.es_principal)?.categoria ||
    productoCompleto?.categorias?.[0]?.categoria;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      {/* Overlay negro con 50% opacidad */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Panel centrado */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        ) : productoCompleto ? (
          <div className="p-6">
            {/* Imagen */}
            <div className="w-full h-64 bg-orange-50 rounded-xl overflow-hidden mb-4">
              {productoCompleto.imagenes_url && productoCompleto.imagenes_url.length > 0 ? (
                <img
                  src={productoCompleto.imagenes_url[0]}
                  alt={productoCompleto.nombre}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-6xl">🍽️</span>
                </div>
              )}
            </div>

            {/* Nombre y precio */}
            <h2 className="text-2xl font-bold text-stone-900 mb-1">
              {productoCompleto.nombre}
            </h2>
            <p className="text-3xl font-bold text-orange-600 mb-4">
              ${productoCompleto.precio_base.toFixed(2)}
            </p>

            {/* Descripción */}
            {productoCompleto.descripcion && (
              <p className="text-stone-500 text-sm mb-4 leading-relaxed">
                {productoCompleto.descripcion}
              </p>
            )}

            {/* Categoría chip */}
            {categoriaPrincipal && (
              <div className="mb-6">
                <span className="inline-block bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full">
                  {categoriaPrincipal.nombre}
                </span>
              </div>
            )}

            {/* Ingredientes */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-stone-700 mb-3">
                Ingredientes:
              </h3>
              
              {/* Ingredientes removibles */}
              {ingredientesRemovibles.length > 0 && (
                <div className="space-y-2 mb-3">
                  {ingredientesRemovibles.map(item => {
                    const ingredienteId = item.ingrediente.id;
                    if (!ingredienteId) return null;
                    const isRemovido = ingredientesRemovidos.has(ingredienteId);
                    
                    return (
                      <div 
                        key={ingredienteId}
                        className="flex items-center justify-between p-3 bg-stone-50 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          {isRemovido ? (
                            <RiCheckboxIndeterminateLine className="text-red-500 text-xl" />
                          ) : (
                            <RiCheckboxLine className="text-orange-600 text-xl" />
                          )}
                          <span className={`text-stone-800 ${isRemovido ? 'line-through text-stone-400' : ''}`}>
                            {item.ingrediente.nombre}
                          </span>
                        </div>
                        <button
                          onClick={() => toggleIngrediente(ingredienteId)}
                          className={`text-xs font-medium px-2 py-1 rounded transition-colors ${
                            isRemovido 
                              ? 'text-orange-600 hover:text-orange-700' 
                              : 'text-red-600 hover:text-red-700'
                          }`}
                        >
                          {isRemovido ? 'Restaurar' : 'Quitar'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Ingredientes no removibles */}
              {ingredientesNoRemovibles.length > 0 && (
                <div className="space-y-1">
                  {ingredientesNoRemovibles.map(item => {
                    const ingredienteId = item.ingrediente.id;
                    if (!ingredienteId) return null;
                    
                    return (
                      <div key={ingredienteId} className="flex items-center gap-2 p-2">
                        <RiCheckboxIndeterminateLine className="text-stone-400 text-xl" />
                        <span className="text-stone-500 text-sm">{item.ingrediente.nombre}</span>
                        <span className="text-xs text-stone-400">(no removible)</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {ingredientesConInfo.length === 0 && (
                <p className="text-stone-400 text-sm">Sin ingredientes registrados</p>
              )}
            </div>

            {/* Cantidad y Total */}
            <div className="border-t border-stone-100 pt-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-stone-700 font-medium">Cantidad</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={decrementarCantidad}
                    className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold transition-colors"
                  >
                    −
                  </button>
                  <span className="text-stone-900 font-semibold w-8 text-center">
                    {cantidad}
                  </span>
                  <button
                    onClick={incrementarCantidad}
                    className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                <span className="text-stone-900 font-bold text-lg">Total:</span>
                <span className="text-orange-600 font-extrabold text-2xl">
                  ${calcularPrecioTotal().toFixed(2)}
                </span>
              </div>
            </div>

            {/* Botones */}
            <div className="space-y-3">
              <button
                onClick={handleAgregar}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-xl transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                Agregar al carrito
              </button>
              
              <button
                onClick={onClose}
                className="w-full text-stone-500 hover:text-stone-700 py-2 text-sm font-medium transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center text-stone-500">
            No se pudo cargar la información del producto
          </div>
        )}
      </div>
    </div>
  );
}

export default DetalleProductoModal;