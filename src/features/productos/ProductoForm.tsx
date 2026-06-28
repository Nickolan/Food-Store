import { useForm } from "@tanstack/react-form";
import { useState, useEffect, useMemo } from "react";
import type { Producto, ProductoCreate, ProductoReadFull } from "../../models/Producto";
import type { Ingrediente } from "../../models/Ingrediente";
import { getIngredientes } from "../../api/ingredientesApi";
import { getUnidadesMedida } from "../../api/unidadesMedidaApi";
import type { UnidadMedida } from "../../models/Unidad_medida";
import { getCategorias } from "../../api/categoriasApi";
import type { Categoria } from "../../models/Categoria";
import { extraerPublicId } from "../../api/cloudinary";
import { env } from "../../config/env";


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
  cantidad: number;
  unidad_medida_nombre:string           
  unidad_medida_simbolo: string; 
}

export const ProductoForm = ({ initial, onSubmit, onCancel }: Props) => {
  const [ingredientesDisponibles, setIngredientesDisponibles] = useState<Ingrediente[]>([]);
  const [ingredientesSeleccionados, setIngredientesSeleccionados] = useState<IngredienteSeleccionado[]>([]);
  const [selectedIngredienteId, setSelectedIngredienteId] = useState<number>(0);
  const [unidadesDisponibles, setUnidadesDisponibles] = useState<UnidadMedida[]>([]);
  const [categoriasDisponibles, setCategoriasDisponibles] = useState<Categoria[]>([]);
  const [selectedCategoriasIds, setSelectedCategoriasIds] = useState<number[]>([]);
  const [imagenesFiles,setImagenesFiles] = useState<File[]>([]);
  const [imagenesExistentes, setImagenesExistentes] = useState<{ url: string; public_id?: string }[]>(
    initial?.imagenes_url?.map(url => ({ 
      url, 
      public_id: extraerPublicId(url) ?? undefined 
    })) ?? []
  );
  const [precioBaseLocal, setPrecioBaseLocal] = useState(initial?.precio_base ?? 0);

  // ─── Cálculos de margen en vivo ─────────────────────────────────────
  const costoTotal = useMemo(() => {
    return ingredientesSeleccionados.reduce((total, ing) => {
      const ingrediente = ingredientesDisponibles.find(i => i.id === ing.id);
      const precio = ingrediente?.precio ?? 0;
      return total + precio * ing.cantidad;
    }, 0);
  }, [ingredientesSeleccionados, ingredientesDisponibles]);

  const margenAbsoluto = precioBaseLocal - costoTotal;
  const margenPorcentual = precioBaseLocal > 0 ? (margenAbsoluto / precioBaseLocal) * 100 : 0;
  const precioSugerido = costoTotal / (1 - env.MARGEN_MINIMO / 100);

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
    const cargarUnidades = async () => {
      try {
        const response = await getUnidadesMedida();
        setUnidadesDisponibles(response.items);
      } catch (error) {
        console.error("Error cargando unidades de medida:", error);
      }
    };
    cargarUnidades();


    const cargarCategorias = async () => {
      try {
        const cats = await getCategorias({});
        console.log(cats);
        
        setCategoriasDisponibles(cats.filter(c => c.activo));
      } catch (error) {
        console.error("Error cargando categorías:", error);
      }
    };
    cargarCategorias();
  }, []);
  useEffect(() => {
    if (initial && (initial as ProductoReadFull).ingredientes) {
      const productoFull = initial as ProductoReadFull;
      const ingredientesConRemovible = productoFull.ingredientes.map((item) => {
        const ingCompleto = ingredientesDisponibles.find(i => i.id === item.ingrediente.id);
        return {
          id: item.ingrediente.id as number,
          nombre: item.ingrediente.nombre,
          es_alergeno: item.ingrediente.es_alergeno || false,
          es_removible: item.es_removible,
          cantidad: item.cantidad ?? 1,
          unidad_medida_nombre:ingCompleto?.unidad_medida?.nombre ?? "unidad",
          unidad_medida_simbolo: ingCompleto?.unidad_medida?.simbolo ?? "unidad",
        };
      });
      setIngredientesSeleccionados(ingredientesConRemovible);
    }

    if (initial && (initial as ProductoReadFull).categorias) {
      const productoFull = initial as ProductoReadFull;
      const ids = productoFull.categorias.map((item: any) => item.categoria.id);
      setSelectedCategoriasIds(ids);
    }
  }, [initial, ingredientesDisponibles]);

  const form = useForm({
    defaultValues: {
      nombre: initial?.nombre ?? "",
      descripcion: initial?.descripcion ?? "",
      precio_base: initial?.precio_base ?? 0,
      stock_minimo: initial?.stock_minimo ?? 0,
      disponible: initial?.disponible ?? true,
      unidad_venta_id: (initial as ProductoReadFull | undefined)?.unidad_medida?.id ?? 0,
    },
    onSubmit: async ({ value }) => {
      let imagenesUrls: string[] = [...imagenesExistentes.map(i => i.url)];
      if (imagenesFiles.length > 0) {
        const res = await Promise.all(imagenesFiles.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        const r = await fetch(`${env.API_BASE_URL}/uploads/imagen?carpeta=foodstore/productos`, {
          method: "POST",
          credentials: "include",
          body: formData
        });
        return r.json();
      }));
      const nuevasUrls = res.map((d: any) => d.secure_url as string);
      imagenesUrls = [...imagenesExistentes.map(i => i.url), ...nuevasUrls];
      }
      if (ingredientesSeleccionados.length === 0) {
        alert("El producto debe tener al menos un ingrediente.");
        return;
      }
      
      if (selectedCategoriasIds.length === 0) {
        alert("El producto debe tener al menos una categoría.");
        return;
      }
      const productoData: ProductoCreate = {
        nombre: value.nombre,
        descripcion: value.descripcion,
        precio_base: value.precio_base,
        stock_minimo: value.stock_minimo,
        disponible: value.disponible,
        imagenes_url: imagenesUrls,
        categorias_ids: selectedCategoriasIds,
        unidad_venta_id: value.unidad_venta_id !== 0 ? value.unidad_venta_id : null,
        ingredientes: ingredientesSeleccionados.map(ing => ({
          ingrediente_id: ing.id,
          es_removible: ing.es_removible,
          cantidad: ing.cantidad,
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
          es_removible: false,
          cantidad: 1,
          unidad_medida_nombre:ingrediente.unidad_medida?.nombre ?? "unidad",
          unidad_medida_simbolo: ingrediente.unidad_medida?.simbolo ?? "unidad",
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl relative flex flex-col max-h-[90vh] overflow-y-auto overflow-x-auto">
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
                      min={1}
                      placeholder="0.00"
                      value={f.state.value}
                      onChange={(e) => {
                        f.handleChange(Number(e.target.value));
                        setPrecioBaseLocal(Number(e.target.value));
                      }}
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

            <form.Field name="unidad_venta_id">
              {(f) => (
                <div>
                  <label className={labelCls}>
                    Unidad de venta{" "}
                    <span className="font-normal text-gray-400">(opcional)</span>
                  </label>
                  <select
                    id="unidad-venta"
                    className={inputCls}
                    value={f.state.value}
                    onChange={(e) => f.handleChange(Number(e.target.value))}
                  >
                    <option value={0}>Sin unidad de venta</option>
                    {unidadesDisponibles.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.nombre} ({u.simbolo})
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-400">
                    Ej: unidad, porción, kg — cómo se vende este producto al cliente.
                  </p>
                </div>
              )}
            </form.Field>
                  <div>
                    <label className={labelCls}>
                      Imágenes del producto{" "}
                      <span className="font-normal text-gray-400">(opcional)</span>
                    </label>
                    <input
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      type="file"
                      accept="image/*"
                      placeholder="https://ejemplo.com/img1.jpg, https://ejemplo.com/img2.jpg"
                      multiple
                      onChange={(e) => setImagenesFiles((prev)=>[...prev,...Array.from(e.target.files ?? [])])}
                    />
                    <div className="flex flex-wrap gap-4">
                    {imagenesExistentes.map((img, index) => (
                    <div key={`existente-${index}`} className="relative">
                      <img src={img.url} alt={`Imagen ${index + 1}`} className="h-24 w-24 object-cover rounded-lg border border-gray-200" />
                      <button
                        type="button"
                        onClick={async () => {
                          if (img.public_id) {
                            await fetch(`${env.API_BASE_URL}/uploads/imagen/${encodeURIComponent(img.public_id)}`, {
                              method: "DELETE",
                              credentials: "include",
                            });
                          }
                          setImagenesExistentes(prev => prev.filter((_, i) => i !== index));
                        }}
                        className="absolute -top-1 -right-2 bg-red-600 text-white rounded-full p-1 px-2 hover:bg-red-700"
                      >x</button>
                    </div>
                  ))}
                    {imagenesFiles.map((file, index) => (
                      <div key={`nueva-${index}`} className="relative">
                      <img src={URL.createObjectURL(file)} alt={`Nueva ${index + 1}`} className="mt-4 max-w-xs max-h-xs border border-gray-200 rounded-lg object-cover" />
                      <button type="button" onClick={() => setImagenesFiles(prev => prev.filter((_, i) => i !== index))}
                      className="absolute -top-1 -right-2 bg-red-600 text-white rounded-full p-1 px-2 mt-2 hover:bg-red-700 transition"
                      >x
                      </button>
                      </div>
                    ))}
                  </div>
                  </div>
              
            {/* Sección de Categorías */}
            <div className="border-t border-gray-200 pt-4 mt-2">
              <label className={labelCls + " text-base font-semibold"}>
                Categorías *
              </label>
              {selectedCategoriasIds.length === 0 && (
                <p className="text-xs text-red-500 mb-2">Seleccioná al menos una categoría.</p>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                {categoriasDisponibles.map(cat => (
                  <label key={cat.id} className="flex items-center gap-2 text-sm text-[#1D3557] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategoriasIds.includes(cat.id!)}
                      onChange={(e) => {
                        setSelectedCategoriasIds(prev =>
                          e.target.checked
                            ? [...prev, cat.id!]
                            : prev.filter(id => id !== cat.id)
                        );
                      }}
                      className="rounded border-gray-300 text-[#E63946] focus:ring-[#E63946]"
                    />
                    {cat.nombre}
                  </label>
                ))}
              </div>
            </div>

            {/* Sección de Ingredientes */}
            <div className="sm:col-span-2 border-t border-gray-200 pt-4 mt-2">
              <label className={labelCls + " text-base font-semibold"}>
                Ingredientes del producto *
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Especificá los ingredientes y si pueden ser removidos por el cliente. El producto debe tener al menos un ingrediente.
              </p>

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

              {ingredientesSeleccionados.length > 0 ? (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Ingrediente</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Cantidad</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Unidad</th>
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
                            <input
                              type="number"
                              min={0}
                              step={1}
                              value={ing.cantidad}
                              onChange={(e) => setIngredientesSeleccionados(prev =>
                                prev.map(i => i.id === ing.id ? { ...i, cantidad: Number(e.target.value) } : i)
                              )}
                              className="w-20 border border-gray-200 rounded px-2 py-1 text-sm text-center"
                            />
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500">
                             {ing.unidad_medida_nombre} ({ing.unidad_medida_simbolo})
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => toggleRemovible(ing.id)}
                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                                  ing.es_removible ? "bg-green-500" : "bg-gray-300"
                                }`}
                              >
                                <span
                                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                                    ing.es_removible ? "translate-x-[1.125rem]" : "translate-x-0.5"
                                  }`}
                                />
                              </button>
                              <span className={`text-xs font-medium ${ing.es_removible ? "text-green-600" : "text-gray-400"}`}>
                                {ing.es_removible ? "Removible" : "Fijo"}
                              </span>
                            </div>
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

            {/* ─── Card de Margen ───────────────────────────────────────── */}
            <div className="border-t-2 border-blue-100 rounded-xl bg-blue-50/50 p-5 space-y-3">
              <h3 className="text-sm font-bold text-[#1D3557] flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Análisis de margen
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Costo total */}
                <div className="bg-white rounded-lg p-3 border border-blue-100">
                  <p className="text-xs text-gray-500 font-medium">Costo total</p>
                  <p className="text-lg font-bold text-[#1D3557]">${costoTotal.toFixed(2)}</p>
                </div>

                {/* Margen absoluto */}
                <div className="bg-white rounded-lg p-3 border border-blue-100">
                  <p className="text-xs text-gray-500 font-medium">Margen bruto</p>
                  <p className={`text-lg font-bold ${margenAbsoluto >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    ${margenAbsoluto.toFixed(2)}
                  </p>
                </div>

                {/* Margen porcentual */}
                <div className="bg-white rounded-lg p-3 border border-blue-100">
                  <p className="text-xs text-gray-500 font-medium">Margen %</p>
                  <p className={`text-lg font-bold ${margenPorcentual >= env.MARGEN_MINIMO ? 'text-emerald-600' : 'text-red-600'}`}>
                    {margenPorcentual.toFixed(1)}%
                  </p>
                </div>

                {/* Precio sugerido */}
                <div className="bg-white rounded-lg p-3 border border-blue-100">
                  <p className="text-xs text-gray-500 font-medium">Precio sugerido</p>
                  <p className="text-lg font-bold text-blue-600">${precioSugerido.toFixed(2)}</p>
                </div>
              </div>

              {/* Texto informativo fijo */}
              {precioBaseLocal > 0 && (
                <div className={`flex items-center gap-2 text-xs font-medium rounded-lg px-3 py-2 ${
                  margenPorcentual >= env.MARGEN_MINIMO
                    ? 'bg-emerald-100 text-emerald-700'
                    : margenPorcentual >= 0
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {margenPorcentual >= env.MARGEN_MINIMO ? (
                    <>✅ Margen saludable ({margenPorcentual.toFixed(1)}%)</>
                  ) : margenPorcentual >= 0 ? (
                    <>⚠️ Margen bajo ({margenPorcentual.toFixed(1)}%). Mínimo requerido: {env.MARGEN_MINIMO}%.</>
                  ) : (
                    <>❌ Vendiendo por debajo del costo.</>
                  )}
                </div>
              )}
              {precioBaseLocal === 0 && (
                <p className="text-xs text-gray-400 italic">Establecé un precio base para ver el análisis de margen.</p>
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
                disabled={ingredientesSeleccionados.length === 0 || selectedCategoriasIds.length === 0}
                className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${
                  ingredientesSeleccionados.length === 0 || selectedCategoriasIds.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {initial ? "Guardar cambios" : "Crear producto"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};