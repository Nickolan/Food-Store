import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductosGrid } from "../features/productos/ProductosGrid";
import { ProductoForm } from "../features/productos/ProductoForm";
import type { Producto } from "../models/Producto";
import { getProductos, createProducto, deleteProducto, reactivarProducto, updateProducto } from "../api/productosApi";

export const ProductosPage = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Producto | undefined>();

  // TanStack Query: obtener datos reales
  const { data: productos = [], isLoading } = useQuery({
    queryKey: ["productos"],
    queryFn: () => getProductos(),
  });

  // Mutaciones
  const mutationCreate = useMutation({
    mutationFn: createProducto,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["productos"] }),
  });

  const mutationUpdate = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateProducto(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["productos"] }),
  });

  const mutationToggleActive = useMutation({
    mutationFn: (p: Producto) => (p.activo ? deleteProducto(p.id!) : reactivarProducto(p.id!)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["productos"] }),
  });

  const mutationDelete = useMutation({
    mutationFn: deleteProducto,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["productos"] }),
  });

  const handleSubmit = async (data: Omit<Producto, "id">) => {
    if (editing?.id) {
      await mutationUpdate.mutateAsync({ id: editing.id, data: { ...data, id: editing.id } });
    } else {
      await mutationCreate.mutateAsync(data as any);
    }
    setShowForm(false);
    setEditing(undefined);
  };

  const handleToggleActive = async (p: Producto) => {
    await mutationToggleActive.mutateAsync(p);
  };

  const handleDelete = async (id: number) => {
    await mutationDelete.mutateAsync(id);
  };

  if (isLoading) return <p className="p-6">Cargando productos...</p>;

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestión de Productos</h1>
        <button onClick={() => { setEditing(undefined); setShowForm(true); }} className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          Nuevo Producto
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-lg border bg-white p-6 shadow">
          <ProductoForm
            initial={editing}
            onSubmit={handleSubmit}
            categorias={[
              { id: 1, nombre: "Comidas" },
              { id: 2, nombre: "Bebidas" },
            ]}
          />
        </div>
      )}

      <ProductosGrid
        data={productos}
        onEdit={(p) => { setEditing(p); setShowForm(true); }}
        onToggleActive={handleToggleActive}
        onDelete={handleDelete}
      />
    </div>
  );
};
