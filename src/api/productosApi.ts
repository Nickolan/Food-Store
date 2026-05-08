import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8000" });

export interface ProductoFilter {
  nombre?: string;
  categoria_id?: number;
  estado?: "todos" | "activos" | "dados_de_baja";
  page?: number;
  limit?: number;
}

export const getProductos = async (filters?: ProductoFilter) => {
  const params = new URLSearchParams();
  if (filters?.nombre) params.append("nombre", filters.nombre);
  if (filters?.categoria_id) params.append("categoria_id", String(filters.categoria_id));
  if (filters?.estado && filters.estado !== "todos") params.append("activo", filters.estado === "activos" ? "true" : "false");
  if (filters?.page) params.append("page", String(filters.page));
  if (filters?.limit) params.append("limit", String(filters.limit));

  const response = await api.get("/productos/", { params });
  return response.data.items || response.data;
};

export const getProductoById = async (id: number) => {
  const response = await api.get(`/productos/${id}`);
  return response.data;
};

export const createProducto = async (producto: any) => {
  const response = await api.post("/productos/", producto);
  return response.data;
};

export const updateProducto = async (id: number, producto: any) => {
  const response = await api.put(`/productos/${id}`, producto);
  return response.data;
};

export const deleteProducto = async (id: number) => {
  // Soft delete: cambiar activo a false
  const response = await api.patch(`/productos/${id}/disponibilidad`, { activo: false });
  return response.data;
};

export const reactivarProducto = async (id: number) => {
  const response = await api.patch(`/productos/${id}/disponibilidad`, { activo: true });
  return response.data;
};
