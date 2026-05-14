import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductosGrid } from "../features/productos/ProductosGrid";
import { ProductoForm } from "../features/productos/ProductoForm";
import type { Producto } from "../models/Producto";
import {
  getProductos,
  createProducto,
  desactivarProducto,
  updateProducto,
} from "../api/productosApi";

const PAGE_SIZE = 10;

export const ProductosPage = () => {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(0);

  const [filterNombre, setFilterNombre] = useState("");
  const [filterActivo, setFilterActivo] = useState<"" | "true" | "false">("");
  const [filterDisponible, setFilterDisponible] = useState<"" | "true" | "false">("");

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Producto | undefined>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["productos", { page, filterNombre, filterActivo, filterDisponible }],
    queryFn: () =>
      getProductos({
        offset: page * PAGE_SIZE,
        limit: PAGE_SIZE,
        nombre: filterNombre || undefined,
        activo: filterActivo !== "" ? filterActivo === "true" : undefined,
      }),
    placeholderData: (prev) => prev,
  });

  const invalidar = () =>
    queryClient.invalidateQueries({ queryKey: ["productos"] });

  const mutCreate = useMutation({
    mutationFn: createProducto,
    onSuccess: invalidar,
  });

  const mutUpdate = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Omit<Producto, "id" | "activo">> }) =>
      updateProducto(id, data),
    onSuccess: invalidar,
  });

  const mutDesactivar = useMutation({
    mutationFn: desactivarProducto,
    onSuccess: invalidar,
  });

  const handleSubmit = async (formData: Omit<Producto, "id" | "activo">) => {
    if (editing?.id) {
      await mutUpdate.mutateAsync({ id: editing.id, data: formData });
    } else {
      await mutCreate.mutateAsync(formData);
    }
    setShowForm(false);
    setEditing(undefined);
  };

  const handleToggleActivo = async (p: Producto) => {
    if (p.activo) {
      await mutDesactivar.mutateAsync(p.id!);
    } else {
      alert(
        "Reactivación no implementada aún en el backend. Usá el panel de administración."
      );
    }
  };

  const handleFilterChange = (
    setter: React.Dispatch<React.SetStateAction<any>>
  ) => (value: any) => {
    setter(value);
    setPage(0);
  };

  const productos = data?.items ?? [];
  const total = data?.total ?? 0;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center px-4 mb-6">
        <div>
          <h1 className="text-[#1D3557] text-2xl font-bold">Gestión de Productos</h1>
          <p className="text-gray-500 text-sm mt-1">
            Administrá el catálogo de productos del local.
          </p>
        </div>
        <button
          id="btn-nuevo-producto"
          onClick={() => {
            setEditing(undefined);
            setShowForm(true);
          }}
          className="bg-[#E63946] text-white font-bold px-4 py-2 rounded-lg hover:bg-[#d92c3a] transition"
        >
          + Nuevo producto
        </button>
      </div>

      {showForm && (
        <ProductoForm
          initial={editing}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditing(undefined);
          }}
        />
      )}

      {isLoading && (
        <p className="py-8 text-center text-sm text-gray-400">Cargando productos...</p>
      )}
      {isError && (
        <p className="py-8 text-center text-sm text-red-500">
          Error al cargar productos. Verificá que el server esté corriendo.
        </p>
      )}

      {!isLoading && !isError && (
        <ProductosGrid
          data={productos}
          total={total}
          page={page}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
          filterNombre={filterNombre}
          filterActivo={filterActivo}
          filterDisponible={filterDisponible}
          onFilterNombre={handleFilterChange(setFilterNombre)}
          onFilterActivo={handleFilterChange(setFilterActivo)}
          onFilterDisponible={handleFilterChange(setFilterDisponible)}
          onEdit={(p) => {
            setEditing(p);
            setShowForm(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onToggleActivo={handleToggleActivo}
        />
      )}
    </div>
  );
};
