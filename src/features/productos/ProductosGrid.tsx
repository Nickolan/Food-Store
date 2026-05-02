import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useState } from "react";
import type { Producto } from "../../models/Producto";

interface Props {
  data: Producto[];
  onEdit: (producto: Producto) => void;
  onToggleActive: (producto: Producto) => void;
  onDelete: (id: number) => void;
}

export const ProductosGrid = ({ data, onEdit, onToggleActive, onDelete }: Props) => {
  const [filterNombre, setFilterNombre] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("");
  const [filterEstado, setFilterEstado] = useState<"todos" | "activos" | "inactivos">("todos");

  const columns = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "nombre", header: "Nombre" },
    { accessorKey: "precio_base", header: "Precio" },
    { accessorKey: "stock_cantidad", header: "Stock" },
    {
      accessorKey: "activo",
      header: "Estado",
      cell: (info: any) => (
        <span className={`rounded px-2 py-1 text-xs font-semibold ${info.getValue() ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {info.getValue() ? "Activo" : "Inactivo"}
        </span>
      ),
    },
    {
      id: "acciones",
      cell: ({ row }: any) => (
        <div className="flex gap-2">
          <button onClick={() => onEdit(row.original)} className="text-sm text-blue-600 hover:underline">Editar</button>
          <button onClick={() => onToggleActive(row.original)} className="text-sm text-yellow-600 hover:underline">
            {row.original.activo ? "Desactivar" : "Reactivar"}
          </button>
          <button onClick={() => onDelete(row.original.id!)} className="text-sm text-red-600 hover:underline">Eliminar</button>
        </div>
      ),
    },
  ];

  // Filtros personalizados (3 mínimo)
  const filteredData = data.filter((p) => {
    if (filterNombre && !p.nombre.toLowerCase().includes(filterNombre.toLowerCase())) return false;
    if (filterCategoria) {
      const catId = parseInt(filterCategoria);
      if (!isNaN(catId) && !p.categorias_ids?.includes(catId)) return false;
    }
    if (filterEstado === "activos" && !p.activo) return false;
    if (filterEstado === "inactivos" && p.activo) return false;
    return true;
  });

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4">
      {/* 3 filtros mínimo */}
      <div className="flex flex-wrap gap-2">
        <input
          placeholder="Filtrar por nombre..."
          className="rounded border px-3 py-1 text-sm"
          value={filterNombre}
          onChange={(e) => setFilterNombre(e.target.value)}
        />
        <select
          className="rounded border px-3 py-1 text-sm"
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value as any)}
        >
          <option value="todos">Todos</option>
          <option value="activos">Activos</option>
          <option value="inactivos">Dados de baja</option>
        </select>
        <input
          placeholder="ID categoría..."
          className="rounded border px-3 py-1 text-sm w-24"
          value={filterCategoria}
          onChange={(e) => setFilterCategoria(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded border">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((hg: any) => (
              <tr key={hg.id}>
                {hg.headers.map((h: any) => (
                  <th key={h.id} className="px-4 py-2 text-left font-semibold">
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row: any) => (
              <tr key={row.id} className="border-t hover:bg-gray-50">
                {row.getVisibleCells().map((cell: any) => (
                  <td key={cell.id} className="px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="rounded border px-3 py-1 text-sm disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="text-sm">
          Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="rounded border px-3 py-1 text-sm disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};
