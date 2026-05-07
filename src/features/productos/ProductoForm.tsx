import { useForm } from "@tanstack/react-form";
import type { Producto } from "../../models/Producto";

interface Props {
  initial?: Producto;
  onSubmit: (producto: Omit<Producto, "id">) => void;
  categorias: { id: number; nombre: string }[];
}

const input = "w-full rounded border border-gray-300 px-3 py-2 text-sm";
const btn = "rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700";

export const ProductoForm = ({ initial, onSubmit, categorias }: Props) => {
  const form = useForm({
    defaultValues: {
      nombre: initial?.nombre ?? "",
      descripcion: initial?.descripcion ?? "",
      precio_base: initial?.precio_base ?? 0,
      stock_cantidad: initial?.stock_cantidad ?? 0,
      disponible: initial?.disponible ?? true,
      imagenes_url: initial?.imagenes_url?.join(",") ?? "",
      categorias_ids: initial?.categorias_ids ?? [] as number[],
      ingredientes_ids: initial?.ingredientes_ids ?? [] as number[],
    },
    onSubmit: async ({ value }) => {
      onSubmit({
        ...value,
        imagenes_url: value.imagenes_url ? value.imagenes_url.split(",").map((s: string) => s.trim()) : [],
      });
    },
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }} className="flex flex-col gap-4">
      <form.Field name="nombre">
        {(f) => <input className={input} placeholder="Nombre" value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} />}
      </form.Field>
      <form.Field name="descripcion">
        {(f) => <textarea className={input} placeholder="Descripción" value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} />}
      </form.Field>
      <form.Field name="precio_base">
        {(f) => <input className={input} type="number" placeholder="Precio base" value={f.state.value} onChange={(e) => f.handleChange(Number(e.target.value))} />}
      </form.Field>
      <form.Field name="stock_cantidad">
        {(f) => <input className={input} type="number" placeholder="Stock" value={f.state.value} onChange={(e) => f.handleChange(Number(e.target.value))} />}
      </form.Field>
      <form.Field name="categorias_ids">
        {(f) => (
          <select
            multiple
            className={input}
            value={f.state.value.map(String)}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions, (o) => Number(o.value));
              f.handleChange(selected);
            }}
          >
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        )}
      </form.Field>
      <button type="submit" className={btn}>Guardar</button>
    </form>
  );
};
