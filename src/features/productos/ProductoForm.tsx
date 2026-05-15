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

const inputCls =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition";
const labelCls = "block text-xs font-semibold text-gray-600 mb-1";

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
      // VALIDACIÓN: el producto debe tener al menos un ingrediente
      if (ingredientesSeleccionados.length === 0) {
        alert("El producto debe tener al menos un ingrediente.");
        return;
      }

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
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
    >
      <div className="sm:col-span-2">
        <form.Field name="nombre">
          {(f) => (
            <div>
              <label className={labelCls}>Nombre *</label>
              <input
                className={inputCls}
                placeholder="Ej: Hamburguesa Clásica"
                value={f.state.value}
                onChange={(e) => f.handleChange(e.target.value)}
                required
              />
            </div>
          )}
        </form.Field>
      </div>

      <div className="sm:col-span-2">
        <form.Field name="descripcion">
          {(f) => (
            <div>
              <label className={labelCls}>Descripción *</label>
              <textarea
                className={inputCls}
                rows={2}
                placeholder="Descripción del producto..."
                value={f.state.value}
                onChange={(e) => f.handleChange(e.target.value)}
                required
              />
            </div>
          )}
        </form.Field>
      </div>

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
            <label className={labelCls}>Stock mínimo *</label>
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

      <form.Field name="disponible">
        {(f) => (
          <div className="flex items-center gap-2 pt-5">
            <input
              id="disponible"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600"
              checked={f.state.value}
              onChange={(e) => f.handleChange(e.target.checked)}
            />
            <label htmlFor="disponible" className={labelCls + " mb-0"}>
              Disponible para venta
            </label>
          </div>
        )}
      </form.Field>

      <div className="sm:col-span-2">
        <form.Field name="imagenes_url">
          {(f) => (
            <div>
              <label className={labelCls}>
                URLs de imágenes{" "}
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
          Ingredientes del producto *
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Especificá los ingredientes y si pueden ser removidos por el cliente. El producto debe tener al menos un ingrediente.
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
                        disabled={ingredientesSeleccionados.length === 1}
                        className={`text-red-600 hover:text-red-800 text-sm ${
                          ingredientesSeleccionados.length === 1 ? "opacity-40 cursor-not-allowed" : ""
                        }`}
                        title={ingredientesSeleccionados.length === 1 ? "No se puede eliminar el único ingrediente" : "Quitar ingrediente"}
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
          <p className="text-sm text-red-500 text-center py-4 border border-red-300 border-dashed rounded-lg bg-red-50">
            ⚠️ Debes agregar al menos un ingrediente al producto.
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
          disabled={ingredientesSeleccionados.length === 0}
          className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${
            ingredientesSeleccionados.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {initial ? "Guardar cambios" : "Crear producto"}
        </button>
      </div>
    </form>
  );
};