import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from "@tanstack/react-table";
import type { Producto } from "../../models/Producto";

const helper = createColumnHelper<Producto>();

interface Props {
  data: Producto[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  filterNombre: string;
  filterDisponible: "" | "true" | "false";
  filterActivo: "" | "true" "false";
  onFilterNombre: (v: string) => void;
  onFilterDisponible: (v: "" | "true" | "false") => void;
  onFilterActivo: (v: "" | "true" | "false") => void;
  onEdit: (producto: Producto) => void;
  onToggleActivo: (producto: Producto) => void;
}

export const ProductosGrid = ({
  data,
  total,
  page,
  pageSize,
  onPageChange,
  filterNombre,
  filterDisponible,
  filterActivo,
  onFilterNombre,
  onFilterDisponible,
  onFilterActivo,
  onEdit,
  onToggleActivo,
}: Props) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const columns = [
    helper.accessor("id", { header: "ID", size: 60 }),
    helper.accessor("nombre", { header: "Nombre" }),
    helper.accessor("precio_base", {
      header: "Precio",
      cell: (info) => `$${info.getValue().toFixed(2)}`,
    }),
    helper.accessor("stock", {
      header: "Stock",
      cell: (info) => {
        const row = info.row.original;
        const bajo = row.stock < row.stock_minimo;
        return (
          <span
            className={`font-semibold ${bajo ? "text-red-600" : "text-gray-800"}`}
            title={bajo ? "Por debajo del mínimo" : undefined}
          >
            {info.getValue()}
            {bajo && " ⚠️"}
          </span>
        );
      },
    }),
    helper.accessor("disponible", {
      header: "Disponible",
      cell: (info) => (
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
            info.getValue()
              ? "bg-emerald-100 text-emerald-800"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {info.getValue() ? "Sí" : "No"}
        </span>
      ),
    }),
    helper.accessor("activo", {
      header: "Estado",
      cell: (info) => (
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
            info.getValue()
              ? "bg-blue-100 text-blue-800"
              : "bg-red-100 text-red-700"
          }`}
        >
          {info.getValue() ? "Activo" : "Dado de baja"}
        </span>
      ),
    }),
    helper.display({
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            id={`btn-editar-${row.original.id}`}
            onClick={() => onEdit(row.original)}
            className="rounded px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 transition"
          >
            Editar
          </button>
          <button
            id={`btn-toggle-${row.original.id}`}
            onClick={() => onToggleActivo(row.original)}
            className={`rounded px-2 py-1 text-xs font-medium transition ${
              row.original.activo
                ? "text-amber-600 hover:bg-amber-50"
                : "text-green-600 hover:bg-green-50"
            }`}
          >
            {row.original.activo ? "Dar de baja" : "Reactivar"}
          </button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          id="filtro-nombre"
          type="search"
          placeholder="Buscar por nombre..."
          value={filterNombre}
          onChange={(e) => onFilterNombre(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 w-52"
        />

        <select
          id="filtro-activo"
          value={filterActivo}
          onChange={(e) => onFilterActivo(e.target.value as "" | "true" | "false")}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Todos los estados</option>
          <option value="true">Solo activos</option>
          <option value="false">Dados de baja</option>
        </select>

        <span className="ml-auto text-sm text-gray-500">
          {total} producto{total !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th
                    key={h.id}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                  >
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-sm text-gray-400"
                >
                  No hay productos que coincidan con los filtros.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={`transition hover:bg-gray-50 ${
                    !row.original.activo ? "opacity-50" : ""
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between gap-2">
        <button
          id="btn-pagina-anterior"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40 hover:bg-gray-50 transition"
        >
          ← Anterior
        </button>

        <span className="text-sm text-gray-600">
          Página <strong>{page + 1}</strong> de <strong>{totalPages}</strong>
        </span>

        <button
          id="btn-pagina-siguiente"
          onClick={() => onPageChange(page + 1)}
          disabled={page + 1 >= totalPages}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40 hover:bg-gray-50 transition"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
};
