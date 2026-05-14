import { useForm } from "@tanstack/react-form";
import type { Producto } from "../../models/Producto";

interface Props {
  initial?: Producto;
  onSubmit: (producto: Omit<Producto, "id" | "activo">) => void;
  onCancel: () => void;
}

const labelCls = "block text-sm font-bold text-[#1D3557] mb-1.5";
const inputCls = "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#1D3557] focus:outline-none focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946] transition-all bg-gray-50/50 focus:bg-white";

export const ProductoForm = ({ initial, onSubmit, onCancel }: Props) => {
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
      onSubmit({
        ...value,
        imagenes_url: value.imagenes_url
          ? value.imagenes_url
              .split(",")
              .map((s: string) => s.trim())
              .filter(Boolean)
          : [],
      });
    },
  });

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

            <div className="flex justify-end mt-8 pt-5 border-t border-gray-100">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg font-bold bg-[#E63946] text-white hover:bg-[#d92c3a] transition-colors shadow-md"
              >
                {initial ? "Guardar Cambios" : "Crear Producto"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};