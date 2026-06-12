import { useAuth } from "../context/authContext";

// ─── Íconos ──────────────────────────────────────────────────────────────────

function IconUsers() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function IconBox() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}

function IconTag() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
    </svg>
  );
}

function IconIngredient() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  );
}

function IconOrders() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );
}

// ─── Tarjeta de acceso rápido ─────────────────────────────────────────────────

interface QuickLinkProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  href: string;
  color: string;
}

function QuickLink({ icon, label, description, href, color }: QuickLinkProps) {
  return (
    <a
      href={href}
      className="group bg-white rounded-2xl border border-orange-100 shadow-sm p-5 flex items-start gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
    >
      <div className={`${color} rounded-xl p-3 shrink-0 transition-transform group-hover:scale-110 duration-200`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-stone-900 font-bold text-sm leading-snug">{label}</p>
        <p className="text-gray-500 text-xs mt-1 leading-snug">{description}</p>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 text-gray-300 group-hover:text-orange-500 shrink-0 mt-0.5 transition-colors"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
      </svg>
    </a>
  );
}

// ─── Pantalla principal ───────────────────────────────────────────────────────

export default function DashboardWelcome() {
  const { usuario } = useAuth();

  const now = new Date();
  const hora = now.getHours();
  const saludo =
    hora < 12 ? "Buenos días" :
    hora < 18 ? "Buenas tardes" :
    "Buenas noches";

  const fechaFormateada = now.toLocaleDateString("es-AR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const initials = usuario
    ? `${usuario.nombre[0] ?? ""}${usuario.apellido[0] ?? ""}`.toUpperCase()
    : "A";

  return (
    <div className="w-full max-w-5xl mx-auto">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="relative bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 rounded-3xl p-8 mb-8 overflow-hidden shadow-lg">
        {/* Decoración de fondo */}
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-white/5 rounded-full blur-xl" />

        <div className="relative flex items-center justify-between gap-6 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-sm">
                <IconShield />
                Panel de Administración
              </span>
            </div>
            <h1 className="text-white font-extrabold text-3xl leading-tight mb-2">
              {saludo},{" "}
              <span className="text-orange-100">
                {usuario?.nombre ?? "Administrador"}
              </span>{" "}
              👋
            </h1>
            <p className="text-orange-100 text-sm capitalize">{fechaFormateada}</p>
          </div>

          {/* Avatar grande */}
          <div className="shrink-0 w-16 h-16 rounded-2xl bg-white/20 text-white flex items-center justify-center font-extrabold text-2xl backdrop-blur-sm border border-white/30 shadow-inner">
            {initials}
          </div>
        </div>
      </div>

      {/* ── Accesos rápidos ───────────────────────────────────────────────── */}
      <div className="mb-6">
        <h2 className="text-stone-800 font-bold text-base mb-4 px-1">Accesos rápidos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickLink
            href="/admin/usuarios"
            icon={<IconUsers />}
            label="Usuarios"
            description="Gestioná cuentas, activá y desactivá accesos."
            color="bg-blue-50 text-blue-600"
          />
          <QuickLink
            href="/admin/productos"
            icon={<IconBox />}
            label="Productos"
            description="Creá y editá el catálogo de productos."
            color="bg-orange-50 text-orange-600"
          />
          <QuickLink
            href="/admin/categorias"
            icon={<IconTag />}
            label="Categorías"
            description="Organizá el menú por categorías."
            color="bg-amber-50 text-amber-600"
          />
          <QuickLink
            href="/admin/ingredientes"
            icon={<IconIngredient />}
            label="Ingredientes"
            description="Controlá el stock y los alérgenos."
            color="bg-emerald-50 text-emerald-600"
          />
        </div>
      </div>

      {/* ── Info de sesión ────────────────────────────────────────────────── */}
      {usuario && (
        <div className="bg-white border border-orange-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-stone-900 font-bold text-sm truncate">
              {usuario.nombre} {usuario.apellido}
            </p>
            <p className="text-gray-500 text-xs truncate">{usuario.email}</p>
          </div>
          <div className="flex gap-1.5 flex-wrap justify-end">
            {usuario.roles.map((r) => (
              <span
                key={r.codigo}
                className="bg-orange-100 text-orange-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full"
              >
                {r.codigo}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
