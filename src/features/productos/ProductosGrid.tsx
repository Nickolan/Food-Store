import { useState } from "react";
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from "@tanstack/react-table";
import type { Producto } from "../../models/Producto";
import { getProductoMargen } from "../../api/productosApi";
import type { ProductoMargenResponse } from "../../api/productosApi";

const helper = createColumnHelper<Producto>();

interface MargenPopup {
  productoId: number;
  data: ProductoMargenResponse;
}

interface Props {
  data: Producto[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  filterNombre: string;
  filterDisponible: "" | "true" | "false";
  filterActivo: "" | "true" | "false";
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
  const [margenPopup, setMargenPopup] = useState<MargenPopup | null>(null);
  const [loadingMargen, setLoadingMargen] = useState<number | null>(null);

  const handleVerMargen = async (producto: Producto) => {
    setLoadingMargen(producto.id);
    try {
      const data = await getProductoMargen(producto.id);
      setMargenPopup({ productoId: producto.id, data });
    } catch {
      alert("Error al calcular margen del producto.");
    } finally {
      setLoadingMargen(null);
    }
  };

  const columns = [
    helper.accessor("id", {
      header: "ID",
      size: 60,
      cell: (info) => (
        <div className="flex items-center justify-center gap-1.5">
          {info.getValue()}
          {info.row.original.tiene_alerta_precio && (
            <span
              title="Precio de ingrediente actualizado — revisá el margen"
              className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-400 text-white text-[10px] font-bold"
            >
              !
            </span>
          )}
        </div>
      ),
    }),
    helper.accessor("nombre", { header: "Nombre" }),
    helper.accessor("precio_base", {
      header: "Precio venta",
      cell: (info) => `$${info.getValue().toFixed(2)}`,
    }),
    helper.display({
      id: "margen",
      header: "Margen",
      size: 80,
      cell: ({ row }) => {
        const prod = row.original;
        const isActive = margenPopup?.productoId === prod.id;
        const isLoading = loadingMargen === prod.id;

        return (
          <div className="flex justify-center">
            <button
              onClick={() => handleVerMargen(prod)}
              disabled={isLoading}
              className="text-xs font-medium text-blue-600 hover:text-blue-800 underline underline-offset-2 disabled:opacity-40"
            >
              {isLoading ? "..." : "Ver margen"}
            </button>

            {isActive && margenPopup && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setMargenPopup(null)}
                />
                {/* Modal centrado en pantalla — evita cortes por overflow de la tabla */}
                <div className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-xl shadow-2xl p-5 w-72">
                  <div className="flex justify-between items-start mb-3">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Margen de ganancia</p>
                    <button
                      onClick={() => setMargenPopup(null)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="space-y-2.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Precio venta:</span>
                      <span className="font-semibold text-[#1D3557]">${margenPopup.data.precio_venta.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Costo total:</span>
                      <span className="font-semibold text-[#1D3557]">${margenPopup.data.costo_total.toFixed(2)}</span>
                    </div>
                    <hr className="border-gray-100" />
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Margen bruto:</span>
                      <span className={`font-bold ${margenPopup.data.margen_absoluto >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        ${margenPopup.data.margen_absoluto.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Margen %:</span>
                      <span className={`font-bold ${(margenPopup.data.margen_porcentual ?? 0) >= 10 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {margenPopup.data.margen_porcentual?.toFixed(1) ?? "—"}%
                      </span>
                    </div>
                    {(margenPopup.data.margen_porcentual ?? 0) < 10 && (
                      <p className="text-xs text-amber-600 text-center mt-2 bg-amber-50 rounded-lg px-2 py-1.5">
                        ⚠️ Margen por debajo del 10% recomendado
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        );
      },
    }),
    helper.accessor("disponible", {
      header: "Disponible",
      cell: (info) => (
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
            info.getValue()
              ? "bg-emerald-100 text-emerald-700"
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
          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
            info.getValue()
              ? "bg-emerald-100 text-emerald-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {info.getValue() ? "Activo" : "Inactivo"}
        </span>
      ),
    }),
    helper.display({
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex justify-center items-center gap-4">
          <button
            id={`btn-editar-${row.original.id}`}
            onClick={() => onEdit(row.original)}
            className="text-gray-400 hover:text-[#1D3557] transition-colors"
            title="Editar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button
            id={`btn-toggle-${row.original.id}`}
            onClick={() => onToggleActivo(row.original)}
            className={`transition-colors ${
              row.original.activo
                ? "text-gray-400 hover:text-[#E63946]"
                : "text-gray-400 hover:text-emerald-600"
            }`}
            title={row.original.activo ? "Dar de baja" : "Activar"}
          >
            {row.original.activo ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      ),
    })
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <input
            id="filtro-nombre"
            type="search"
            placeholder="Buscar por nombre..."
            value={filterNombre}
            onChange={(e) => onFilterNombre(e.target.value)}
            className="h-10 rounded-lg border border-gray-200 px-3 text-sm text-[#1D3557] focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946] outline-none w-52"
          />

          <select
            id="filtro-activo"
            value={filterActivo}
            onChange={(e) => onFilterActivo(e.target.value as "" | "true" | "false")}
            className="h-10 rounded-lg border border-gray-200 px-3 text-sm text-[#1D3557] focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946] outline-none"
          >
            <option value="">Todos los estados</option>
            <option value="true">Solo activos</option>
            <option value="false">Dados de baja</option>
          </select>
        </div>

        <span className="text-sm text-gray-500 font-medium">
          {total} producto{total !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-[#1D3557] text-xs uppercase font-bold">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th
                    key={h.id}
                    className="py-3 px-4 text-center"
                  >
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-8 px-4 text-center text-sm text-gray-400 border-b border-gray-100"
                >
                  No hay productos que coincidan con los filtros.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="transition hover:bg-gray-50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="py-4 px-4 border-b border-gray-100 text-[#1D3557] text-sm text-center">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          id="btn-pagina-anterior"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          Anterior
        </button>

        <span className="text-sm text-gray-500">
          Página {page + 1} de {totalPages}
        </span>

        <button
          id="btn-pagina-siguiente"
          onClick={() => onPageChange(page + 1)}
          disabled={page + 1 >= totalPages}
          className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};
