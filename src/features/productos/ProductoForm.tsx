import { useForm } from "@tanstack/react-form";
import { useState, useEffect } from "react";
import type { Producto, ProductoCreate, ProductoReadFull } from "../../models/Producto";
import type { Ingrediente } from "../../models/Ingrediente";
import { getIngredientes } from "../../api/ingredientesApi";

interface Props {
  initial?: Producto | ProductoReadFull;  
  onSubmit: (producto: ProductoCreate) => void;
  onCancel: () => void;
}

const labelCls = "block text-sm font-bold text-[#1D3557] mb-1.5";
const inputCls = "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#1D3557] focus:outline-none focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946] transition-all bg-gray-50/50 focus:bg-white";

interface IngredienteSeleccionado {
  id: number;
  nombre: string;
  es_alergeno: boolean;
  es_removible: boolean;
}

export const ProductoForm = ({ initial, onSubmit, onCancel }: Props) => {
  const [ingredientesDisponibles, setIngredientesDisponibles] = useState<Ingrediente[]>([]);
  const [ingredientesSeleccionados, setIngredientesSeleccionados] = useState<IngredienteSeleccionado[]>([]);
  const [selectedIngredienteId, setSelectedIngredienteId] = useState<number>(0);

  // Cargar ingredientes disponibles
  useEffect(() => {
    const cargarIngredientes = async () => {
      try {
        const response = await getIngredientes({ limit: 100 });
        setIngredientesDisponibles(response.items.filter(i => i.activo));
      } catch (error) {
        console.error("Error cargando ingredientes:", error);
      }
    };
    cargarIngredientes();
  }, []);

  // Cargar ingredientes existentes si estamos editando
  useEffect(() => {
    if (initial && (initial as ProductoReadFull).ingredientes) {
      const productoFull = initial as ProductoReadFull;
      // Acceder correctamente a la estructura anidada: ingrediente -> ingrediente
      const ingredientesConRemovible = productoFull.ingredientes.map((item: any) => ({
        id: item.ingrediente.id,
        nombre: item.ingrediente.nombre,
        es_alergeno: item.ingrediente.es_alergeno || false,
        es_removible: item.es_removible
      }));
      setIngredientesSeleccionados(ingredientesConRemovible);
    }
  }, [initial]);

  const form = useForm({
    defaultValues: {
      nombre: initial?.nombre ?? "",
      descripcion: initial?.descripcion ?? "",
      precio_base: initial?.precio_base ?? 0,
      stock: initial?.stock ?? 0,
      stock_minimo: initial?.stock_minimo ?? 0,
      disponible: initial?.disponible ?? true,
      imagenes_url: initial?.imagenes_url?.join(", ") ?? "",
    },
    onSubmit: async ({ value }) => {
      const productoData: ProductoCreate = {
        nombre: value.nombre,
        descripcion: value.descripcion,
        precio_base: value.precio_base,
        stock: value.stock,
        stock_minimo: value.stock_minimo,
        disponible: value.disponible,
        imagenes_url: value.imagenes_url
          ? value.imagenes_url
              .split(",")
              .map((s: string) => s.trim())
              .filter(Boolean)
          : [],
        ingredientes: ingredientesSeleccionados.map(ing => ({
          ingrediente_id: ing.id,
          es_removible: ing.es_removible
        }))
      };
      onSubmit(productoData);
    },
  });

  const agregarIngrediente = () => {
    if (selectedIngredienteId === 0) return;
    
    const ingrediente = ingredientesDisponibles.find(i => i.id === selectedIngredienteId);
    if (ingrediente && !ingredientesSeleccionados.some(i => i.id === ingrediente.id)) {
      setIngredientesSeleccionados([
        ...ingredientesSeleccionados,
        { 
          id: ingrediente.id!, 
          nombre: ingrediente.nombre, 
          es_alergeno: ingrediente.es_alergeno,
          es_removible: false 
        }
      ]);
      setSelectedIngredienteId(0);
    }
  };

  const removerIngrediente = (id: number) => {
    setIngredientesSeleccionados(ingredientesSeleccionados.filter(i => i.id !== id));
  };

  const toggleRemovible = (id: number) => {
    setIngredientesSeleccionados(ingredientesSeleccionados.map(ing =>
      ing.id === id ? { ...ing, es_removible: !ing.es_removible } : ing
    ));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative flex flex-col max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <button 
            onClick={onCancel}
            className="absolute top-6 right-6 text-gray-400 hover:text-[#E63946] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="flex flex-col gap-5"
          >
            <h2 className="text-2xl font-bold text-[#1D3557] mb-6">
              {initial ? "Editar Producto" : "Crear Producto"}
            </h2>

            <div>
              <form.Field name="nombre">
                {(f) => (
                  <div>
                    <label className={labelCls}>Nombre *</label>
                    <input
                      className={inputCls}
                      placeholder="Ej: Hamburguesa Clasica"
                      value={f.state.value}
                      onChange={(e) => f.handleChange(e.target.value)}
                      required
                    />
                  </div>
                )}
              </form.Field>
            </div>

            <div>
              <form.Field name="descripcion">
                {(f) => (
                  <div>
                    <label className={labelCls}>Descripcion *</label>
                    <textarea
                      className={inputCls}
                      rows={2}
                      placeholder="Descripcion del producto..."
                      value={f.state.value}
                      onChange={(e) => f.handleChange(e.target.value)}
                      required
                    />
                  </div>
                )}
              </form.Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <form.Field name="precio_base">
                {(f) => (
                  <div>
                    <label className={labelCls}>Precio base ($) *</label>
                    <input
                      className={inputCls}
                      type="number"
                      min={0.01}
                      step={0.01}
                      placeholder="0.00"
                      value={f.state.value}
                      onChange={(e) => f.handleChange(Number(e.target.value))}
                      required
                    />
                  </div>
                )}
              </form.Field>

              <form.Field name="stock">
                {(f) => (
                  <div>
                    <label className={labelCls}>Stock actual *</label>
                    <input
                      className={inputCls}
                      type="number"
                      min={0}
                      placeholder="0"
                      value={f.state.value}
                      onChange={(e) => f.handleChange(Number(e.target.value))}
                      required
                    />
                  </div>
                )}
              </form.Field>

              <form.Field name="stock_minimo">
                {(f) => (
                  <div>
                    <label className={labelCls}>Stock minimo *</label>
                    <input
                      className={inputCls}
                      type="number"
                      min={0}
                      placeholder="0"
                      value={f.state.value}
                      onChange={(e) => f.handleChange(Number(e.target.value))}
                      required
                    />
                  </div>
                )}
              </form.Field>
            </div>

            <form.Field name="disponible">
              {(f) => (
                <div className="flex justify-start items-center mb-4">
                  <input
                    id="disponible"
                    type="checkbox"
                    className="h-4 w-4 text-[#E63946] focus:ring-[#E63946] border-gray-300 rounded"
                    checked={f.state.value}
                    onChange={(e) => f.handleChange(e.target.checked)}
                  />
                  <label htmlFor="disponible" className="text-sm font-bold text-[#1D3557] ml-2">
                    Disponible para venta
                  </label>
                </div>
              )}
            </form.Field>

            <div>
              <form.Field name="imagenes_url">
                {(f) => (
                  <div>
                    <label className={labelCls}>
                      URLs de imagenes{" "}
                      <span className="font-normal text-gray-400">(separadas por coma)</span>
                    </label>
                    <input
                      className={inputCls}
                      placeholder="https://ejemplo.com/img1.jpg, https://ejemplo.com/img2.jpg"
                      value={f.state.value}
                      onChange={(e) => f.handleChange(e.target.value)}
                    />
                  </div>
                )}
              </form.Field>
            </div>

      {/* Sección de Ingredientes */}
      <div className="sm:col-span-2 border-t border-gray-200 pt-4 mt-2">
        <label className={labelCls + " text-base font-semibold"}>
          Ingredientes del producto
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Especificá los ingredientes y si pueden ser removidos por el cliente
        </p>

        {/* Selector para agregar ingredientes */}
        <div className="flex gap-2 mb-3">
          <select
            className={inputCls}
            value={selectedIngredienteId}
            onChange={(e) => setSelectedIngredienteId(Number(e.target.value))}
          >
            <option value={0}>Seleccionar ingrediente...</option>
            {ingredientesDisponibles
              .filter(ing => !ingredientesSeleccionados.some(sel => sel.id === ing.id))
              .map(ing => (
                <option key={ing.id} value={ing.id}>
                  {ing.nombre} {ing.es_alergeno ? "⚠️ Alérgeno" : ""}
                </option>
              ))}
          </select>
          <button
            type="button"
            onClick={agregarIngrediente}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
          >
            Agregar
          </button>
        </div>

        {/* Lista de ingredientes seleccionados */}
        {ingredientesSeleccionados.length > 0 ? (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Ingrediente</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">¿Removible?</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {ingredientesSeleccionados.map((ing) => (
                  <tr key={ing.id}>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {ing.nombre}
                      {ing.es_alergeno && (
                        <span className="ml-2 inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                          Alérgeno
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={ing.es_removible}
                          onChange={() => toggleRemovible(ing.id)}
                          className="rounded border-gray-300 text-blue-600"
                        />
                        <span className="text-xs text-gray-600">
                          {ing.es_removible ? "El cliente puede quitarlo" : "Ingrediente fijo"}
                        </span>
                      </label>
                    </td>
                    <td className="px-4 py-2 text-right">
                      <button
                        type="button"
                        onClick={() => removerIngrediente(ing.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Quitar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-4 border border-dashed border-gray-300 rounded-lg">
            No hay ingredientes agregados. Seleccioná ingredientes de la lista.
          </p>
        )}
      </div>

      <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
        >
          {initial ? "Guardar cambios" : "Crear producto"}
        </button>
      </div>
    </div>
  );
};