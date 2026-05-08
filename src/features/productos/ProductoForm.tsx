import { useForm } from "@tanstack/react-form";
import type { Producto } from "../../models/Producto";

interface Props {
  initial?: Producto;
  onSubmit: (producto: Omit<Producto, "id" | "activo">) => void;
  onCancel: () => void;
}

const inputCls =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition";
const labelCls = "block text-xs font-semibold text-gray-600 mb-1";

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
    </form>
  );
};
