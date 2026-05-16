import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductosGrid } from "../features/productos/ProductosGrid";
import { ProductoForm } from "../features/productos/ProductoForm";
import type { Producto, ProductoReadFull } from "../models/Producto";
import {
  getProductos,
  createProducto,
  desactivarProducto,
  updateProducto,
  getProductoById,
  reactivarProducto,
} from "../api/productosApi";

const PAGE_SIZE = 10;

export const ProductosPage = () => {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(0);

  const [filterNombre, setFilterNombre] = useState("");
  const [filterActivo, setFilterActivo] = useState<"" | "true" | "false">("");
  const [filterDisponible, setFilterDisponible] = useState<"" | "true" | "false">("");

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Producto | ProductoReadFull | undefined>();
  const [isLoadingProducto, setIsLoadingProducto] = useState(false);

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
    onSuccess: () => {
      invalidar();
      setShowForm(false);
      setEditing(undefined);
    },
    onError: (error: any) => {
      const mensaje = error.response?.data?.detail || "Error al crear producto. Verifique que tenga al menos un ingrediente.";
      alert(mensaje);
    }
  });

  const mutUpdate = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Omit<Producto, "id" | "activo">> }) =>
      updateProducto(id, data),
    onSuccess: () => {
      invalidar();
      setShowForm(false);
      setEditing(undefined);
    },
    onError: (error: any) => {
      const mensaje = error.response?.data?.detail || "Error al actualizar producto. Verifique que tenga al menos un ingrediente.";
      alert(mensaje);
    }
  });

  const mutDesactivar = useMutation({
    mutationFn: desactivarProducto,
    onSuccess: invalidar,
    onError: (error: any) => {
      alert(error.response?.data?.detail || "Error al desactivar producto");
    }
  });

  const mutReactivar = useMutation({
    mutationFn: reactivarProducto,
    onSuccess: invalidar,
    onError: (error: any) => {
      alert(error.response?.data?.detail || "Error al reactivar producto");
    }
  });

  const handleSubmit = async (formData: Omit<Producto, "id" | "activo">) => {
    if (editing?.id) {
      await mutUpdate.mutateAsync({ id: editing.id, data: formData });
    } else {
      await mutCreate.mutateAsync(formData);
    }
  };

  const handleToggleActivo = async (p: Producto) => {
    if (p.activo) {
      if (confirm(`¿Estás seguro de que querés desactivar "${p.nombre}"?`)) {
        await mutDesactivar.mutateAsync(p.id!);
      }
    } else {
      if (confirm(`¿Estás seguro de que querés reactivar "${p.nombre}"?`)) {
        await mutReactivar.mutateAsync(p.id!);
      }
    }
  };

  const handleFilterChange = (
    setter: React.Dispatch<React.SetStateAction<any>>
  ) => (value: any) => {
    setter(value);
    setPage(0);
  };

  const handleEdit = async (producto: Producto) => {
    setIsLoadingProducto(true);
    try {
      const productoCompleto = await getProductoById(producto.id!);
      setEditing(productoCompleto);
      setShowForm(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Error al cargar producto para editar:", error);
      alert("Error al cargar los detalles del producto");
    } finally {
      setIsLoadingProducto(false);
    }
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
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-800">
            {editing ? "Editar producto" : "Nuevo producto"}
          </h2>
          {isLoadingProducto ? (
            <p className="text-center py-8 text-gray-500">Cargando ingredientes del producto...</p>
          ) : (
            <ProductoForm
              initial={editing}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditing(undefined);
              }}
            />
          )}
        </div>
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
          onEdit={handleEdit}
          onToggleActivo={handleToggleActivo}
        />
      )}
    </div>
  );
};