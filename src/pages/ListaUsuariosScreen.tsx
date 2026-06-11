import { useEffect, useState, useCallback } from "react";
import { usuarioApi, type UsuariosPaginados } from "../api/usuarioApi";
import type { Usuario } from "../models/Usuario";

const LIMIT = 10;

// ─── Íconos inline (sin dependencias externas) ───────────────────────────────

function IconUser() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
  );
}

function IconBan() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
    </svg>
  );
}

// ─── Badge de rol ─────────────────────────────────────────────────────────────

const ROL_STYLES: Record<string, string> = {
  ADMIN:   "bg-purple-100 text-purple-700",
  CLIENT:  "bg-blue-100 text-blue-700",
  PEDIDOS: "bg-amber-100 text-amber-700",
  COCINA:  "bg-orange-100 text-orange-700",
};

function RolBadge({ codigo }: { codigo: string }) {
  const cls = ROL_STYLES[codigo.toUpperCase()] ?? "bg-gray-100 text-gray-600";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${cls}`}>
      {codigo}
    </span>
  );
}

// ─── Avatar de usuario ────────────────────────────────────────────────────────

function Avatar({ nombre, apellido }: { nombre: string; apellido: string }) {
  const initials = `${nombre[0] ?? ""}${apellido[0] ?? ""}`.toUpperCase();
  return (
    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
      {initials}
    </div>
  );
}

// ─── Modal de confirmación ────────────────────────────────────────────────────

interface ConfirmModalProps {
  usuario: Usuario;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

function ConfirmModal({ usuario, onConfirm, onCancel, loading }: ConfirmModalProps) {
  const esDesactivar = !usuario.disabled;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 animate-[fadeIn_0.15s_ease]">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
          esDesactivar ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"
        }`}>
          {esDesactivar ? <IconBan /> : <IconCheck />}
        </div>
        <h3 className="text-stone-900 font-bold text-lg text-center mb-1">
          {esDesactivar ? "¿Desactivar usuario?" : "¿Reactivar usuario?"}
        </h3>
        <p className="text-stone-500 text-sm text-center mb-6">
          {esDesactivar
            ? `${usuario.nombre} ${usuario.apellido} no podrá iniciar sesión hasta que sea reactivado.`
            : `${usuario.nombre} ${usuario.apellido} volverá a tener acceso al sistema.`
          }
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 border border-orange-200 text-stone-600 font-semibold py-2.5 rounded-xl text-sm hover:bg-orange-50 transition-colors disabled:opacity-40"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 font-semibold py-2.5 rounded-xl text-sm text-white transition-colors disabled:opacity-40 ${
              esDesactivar
                ? "bg-red-500 hover:bg-red-600"
                : "bg-emerald-500 hover:bg-emerald-600"
            }`}
          >
            {loading ? "Procesando..." : esDesactivar ? "Desactivar" : "Reactivar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Pantalla principal ───────────────────────────────────────────────────────

export default function ListaUsuariosScreen() {
  const [data, setData]           = useState<UsuariosPaginados | null>(null);
  const [pagina, setPagina]       = useState(0);
  const [filtro, setFiltro]       = useState("");
  const [filtroEstado, setFiltroEstado] = useState<"todos" | "activos" | "inactivos">("todos");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [modal, setModal]         = useState<Usuario | null>(null);
  const [accionLoading, setAccionLoading] = useState(false);
  const [toast, setToast]         = useState<{ msg: string; ok: boolean } | null>(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await usuarioApi.listarUsuarios(pagina * LIMIT, LIMIT);
      setData(result);
    } catch {
      setError("No se pudo cargar la lista de usuarios. Verificá tu conexión.");
    } finally {
      setLoading(false);
    }
  }, [pagina]);

  useEffect(() => { cargar(); }, [cargar]);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggle = async () => {
    if (!modal) return;
    setAccionLoading(true);
    try {
      if (modal.disabled) {
        await usuarioApi.reactivarUsuario(modal.id);
        showToast(`${modal.nombre} fue reactivado correctamente.`, true);
      } else {
        await usuarioApi.desactivarUsuario(modal.id);
        showToast(`${modal.nombre} fue desactivado correctamente.`, true);
      }
      setModal(null);
      cargar();
    } catch {
      showToast("No se pudo realizar la acción. Intentá de nuevo.", false);
    } finally {
      setAccionLoading(false);
    }
  };

  // Filtros locales
  const usuarios = (data?.items ?? []).filter((u) => {
    const nombre = `${u.nombre} ${u.apellido} ${u.email}`.toLowerCase();
    const coincideTexto = nombre.includes(filtro.toLowerCase());
    const coincideEstado =
      filtroEstado === "todos" ||
      (filtroEstado === "activos" && !u.disabled) ||
      (filtroEstado === "inactivos" && u.disabled);
    return coincideTexto && coincideEstado;
  });

  const totalPaginas = Math.max(1, Math.ceil((data?.total ?? 0) / LIMIT));

  return (
    <div className="w-full">
      {/* ── Toast ────────────────────────────────────────────────────────── */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl text-white text-sm font-semibold transition-all ${
          toast.ok ? "bg-emerald-500" : "bg-red-500"
        }`}>
          {toast.ok ? <IconCheck /> : <IconBan />}
          {toast.msg}
        </div>
      )}

      {/* ── Modal ────────────────────────────────────────────────────────── */}
      {modal && (
        <ConfirmModal
          usuario={modal}
          onConfirm={handleToggle}
          onCancel={() => setModal(null)}
          loading={accionLoading}
        />
      )}

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex justify-between items-center px-4 mb-6">
        <div>
          <h1 className="text-stone-900 text-2xl font-bold">Gestión de Usuarios</h1>
          <p className="text-gray-500 text-sm mt-1">
            Administrá el acceso al sistema — activá o desactivá cuentas.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-orange-100 rounded-xl px-4 py-2 shadow-sm">
          <IconUser />
          <span className="text-stone-700 font-semibold text-sm">
            {data?.total ?? "—"} usuarios totales
          </span>
        </div>
      </div>

      {/* ── Tabla card ───────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6 w-full">

        {/* Filtros */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div className="flex gap-3 items-center flex-wrap">
            {/* Búsqueda */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">
                <IconSearch />
              </span>
              <input
                type="search"
                placeholder="Buscar por nombre o email..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="h-10 pl-9 pr-3 rounded-lg border border-orange-200 text-sm text-stone-900 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none w-60"
              />
            </div>

            {/* Estado */}
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value as any)}
              className="h-10 rounded-lg border border-orange-200 px-3 text-sm text-stone-900 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
            >
              <option value="todos">Todos los estados</option>
              <option value="activos">Solo activos</option>
              <option value="inactivos">Solo inactivos</option>
            </select>
          </div>

          <span className="text-sm text-gray-400 font-medium">
            {usuarios.length} resultado{usuarios.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* Tabla */}
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-orange-50 text-stone-600 text-xs uppercase font-bold tracking-wide">
              <tr>
                <th className="py-3 px-4 text-left">Usuario</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-center">Roles</th>
                <th className="py-3 px-4 text-center">Estado</th>
                <th className="py-3 px-4 text-center">Alta</th>
                <th className="py-3 px-4 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
                      Cargando usuarios...
                    </div>
                  </td>
                </tr>
              ) : usuarios.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm text-gray-400">
                    No hay usuarios que coincidan con los filtros.
                  </td>
                </tr>
              ) : (
                usuarios.map((u) => (
                  <tr
                    key={u.id}
                    className={`transition-colors hover:bg-orange-50 ${u.disabled ? "opacity-60" : ""}`}
                  >
                    {/* Usuario */}
                    <td className="py-3.5 px-4 border-b border-orange-100">
                      <div className="flex items-center gap-3">
                        <Avatar nombre={u.nombre} apellido={u.apellido} />
                        <div>
                          <p className="text-stone-900 font-semibold text-sm leading-tight">
                            {u.nombre} {u.apellido}
                          </p>
                          <p className="text-gray-400 text-xs mt-0.5">#{u.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-3.5 px-4 border-b border-orange-100 text-stone-600 text-sm">
                      {u.email}
                    </td>

                    {/* Roles */}
                    <td className="py-3.5 px-4 border-b border-orange-100 text-center">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {u.roles.length > 0
                          ? u.roles.map((r) => <RolBadge key={r.codigo} codigo={r.codigo} />)
                          : <span className="text-gray-400 text-xs">Sin rol</span>
                        }
                      </div>
                    </td>

                    {/* Estado */}
                    <td className="py-3.5 px-4 border-b border-orange-100 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        u.disabled
                          ? "bg-red-100 text-red-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${u.disabled ? "bg-red-500" : "bg-emerald-500"}`} />
                        {u.disabled ? "Inactivo" : "Activo"}
                      </span>
                    </td>

                    {/* Fecha alta */}
                    <td className="py-3.5 px-4 border-b border-orange-100 text-center text-stone-500 text-xs">
                      {new Date(u.created_at).toLocaleDateString("es-AR", {
                        day: "2-digit", month: "short", year: "numeric"
                      })}
                    </td>

                    {/* Acción */}
                    <td className="py-3.5 px-4 border-b border-orange-100 text-center">
                      <button
                        onClick={() => setModal(u)}
                        title={u.disabled ? "Reactivar usuario" : "Desactivar usuario"}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          u.disabled
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                            : "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                        }`}
                      >
                        {u.disabled ? <><IconCheck /> Reactivar</> : <><IconBan /> Desactivar</>}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="flex justify-between items-center mt-6">
          <button
            disabled={pagina === 0 || loading}
            onClick={() => setPagina((p) => p - 1)}
            className="bg-white border border-orange-200 text-gray-700 px-4 py-2 rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-orange-50 transition"
          >
            ← Anterior
          </button>
          <span className="text-sm text-gray-500">
            Página {pagina + 1} de {totalPaginas}
          </span>
          <button
            disabled={(pagina + 1) * LIMIT >= (data?.total ?? 0) || loading}
            onClick={() => setPagina((p) => p + 1)}
            className="bg-white border border-orange-200 text-gray-700 px-4 py-2 rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-orange-50 transition"
          >
            Siguiente →
          </button>
        </div>
      </div>
    </div>
  );
}
