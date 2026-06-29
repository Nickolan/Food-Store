import { useForm } from '@tanstack/react-form'
import { useAuth } from '../context/authContext'
import { useNavigate, Link } from 'react-router-dom'

function SignUpScreen() {
    const auth = useAuth()
    const navigate = useNavigate()

    const form = useForm({
        defaultValues: { nombre: "", apellido: "", email: "", celular: "", password: "" },
        onSubmit: async ({ value }) => {
            const success = await auth.signUp(value.nombre, value.apellido, value.email, value.celular, value.password);
            if (success) {
                navigate("/");
            }
        }
    })

  return (
    <div className="w-full flex font-sans">
      <div className="hidden lg:flex w-1/2 bg-orange-200 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-400 to-transparent opacity-30"></div>
        <img 
          src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1000&q=80" 
          alt="Food" 
          className="object-cover w-full opacity-80 max-h-screen"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 to-transparent flex items-end p-16">
            <h2 className="text-white text-4xl font-bold leading-tight">
                Empezá a disfrutar<br/> de los mejores sabores.
            </h2>
        </div>
      </div>
      <div className="w-full lg:w-1/2 bg-orange-50 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-lg border border-orange-100">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-extrabold text-stone-900 mb-2">Crear Cuenta</h1>
                <p className="text-stone-500">Completá tus datos para registrarte</p>
            </div>
            
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}
                className="space-y-4"
            >
                <div className="grid grid-cols-2 gap-4">
                    <form.Field
                        name="nombre"
                        validators={{
                            onChange: ({ value }) =>
                                !value ? "Campo requerido" : undefined,
                        }}
                    >
                        {(f) => (
                            <div>
                                <label className="text-sm font-bold text-stone-800 mb-1 block">Nombre</label>
                                <input
                                    type="text"
                                    className={`w-full h-12 bg-orange-50 rounded-xl text-stone-900 text-sm focus:outline-none px-4 transition-colors ${
                                        f.state.meta.errors.length
                                            ? "border-2 border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                            : "border border-orange-100 focus:border-orange-600 focus:ring-1 focus:ring-orange-600"
                                    }`}
                                    value={f.state.value}
                                    onChange={(e) => f.handleChange(e.target.value)}
                                    onBlur={f.handleBlur}
                                    placeholder="Juan"
                                />
                                {f.state.meta.errors.length > 0 && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {f.state.meta.errors.join(", ")}
                                    </p>
                                )}
                            </div>
                        )}
                    </form.Field>

                    <form.Field
                        name="apellido"
                        validators={{
                            onChange: ({ value }) =>
                                !value ? "Campo requerido" : undefined,
                        }}
                    >
                        {(f) => (
                            <div>
                                <label className="text-sm font-bold text-stone-800 mb-1 block">Apellido</label>
                                <input
                                    type="text"
                                    className={`w-full h-12 bg-orange-50 rounded-xl text-stone-900 text-sm focus:outline-none px-4 transition-colors ${
                                        f.state.meta.errors.length
                                            ? "border-2 border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                            : "border border-orange-100 focus:border-orange-600 focus:ring-1 focus:ring-orange-600"
                                    }`}
                                    value={f.state.value}
                                    onChange={(e) => f.handleChange(e.target.value)}
                                    onBlur={f.handleBlur}
                                    placeholder="Pérez"
                                />
                                {f.state.meta.errors.length > 0 && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {f.state.meta.errors.join(", ")}
                                    </p>
                                )}
                            </div>
                        )}
                    </form.Field>
                </div>

                <form.Field
                    name="email"
                    validators={{
                        onChange: ({ value }) =>
                            !value ? "Campo requerido" : undefined,
                    }}
                >
                    {(f) => (
                        <div>
                            <label className="text-sm font-bold text-stone-800 mb-1 block">Correo Electrónico</label>
                            <input
                                type="email"
                                className={`w-full h-12 bg-orange-50 rounded-xl text-stone-900 text-sm focus:outline-none px-4 transition-colors ${
                                    f.state.meta.errors.length
                                        ? "border-2 border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                        : "border border-orange-100 focus:border-orange-600 focus:ring-1 focus:ring-orange-600"
                                }`}
                                value={f.state.value}
                                onChange={(e) => f.handleChange(e.target.value)}
                                onBlur={f.handleBlur}
                                placeholder="juan@ejemplo.com"
                            />
                            {f.state.meta.errors.length > 0 && (
                                <p className="text-red-500 text-xs mt-1">
                                    {f.state.meta.errors.join(", ")}
                                </p>
                            )}
                        </div>
                    )}
                </form.Field>

                <form.Field name="celular">
                    {(f) => (
                        <div>
                            <label className="text-sm font-bold text-stone-800 mb-1 block">Celular</label>
                            <input
                                type="tel"
                                className="w-full h-12 bg-orange-50 border border-orange-100 rounded-xl text-stone-900 text-sm focus:border-orange-600 focus:ring-1 focus:ring-orange-600 outline-none px-4 transition-colors"
                                value={f.state.value}
                                onChange={(e) => f.handleChange(e.target.value)}
                                placeholder="+54 11 1234 5678"
                            />
                        </div>
                    )}
                </form.Field>

                <form.Field
                    name="password"
                    validators={{
                        onChange: ({ value }) =>
                            !value ? "Campo requerido" : undefined,
                    }}
                >
                    {(f) => (
                        <div>
                            <label className="text-sm font-bold text-stone-800 mb-1 block">Contraseña</label>
                            <input
                                type="password"
                                className={`w-full h-12 bg-orange-50 rounded-xl text-stone-900 text-sm focus:outline-none px-4 transition-colors ${
                                    f.state.meta.errors.length
                                        ? "border-2 border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                        : "border border-orange-100 focus:border-orange-600 focus:ring-1 focus:ring-orange-600"
                                }`}
                                value={f.state.value}
                                onChange={(e) => f.handleChange(e.target.value)}
                                onBlur={f.handleBlur}
                                placeholder="••••••••"
                            />
                            {f.state.meta.errors.length > 0 && (
                                <p className="text-red-500 text-xs mt-1">
                                    {f.state.meta.errors.join(", ")}
                                </p>
                            )}
                            {f.state.value.length > 0 && (
                                <p className="text-stone-500 text-xs mt-1">
                                    Usá mayúsculas, números y símbolos para mayor seguridad.
                                </p>
                            )}
                        </div>
                    )}
                </form.Field>

                {auth?.error && (
                    <p className="text-red-600 text-sm text-center mt-4">{auth.error}</p>
                )}

                <button 
                    type="submit"
                    disabled={auth?.loading}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg h-12 rounded-xl transition-colors mt-4 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {auth?.loading ? 'REGISTRANDO...' : 'Registrarme'}
                </button>
                
                <p className="text-center text-stone-500 text-sm mt-4">
                    ¿Ya tenés cuenta?{' '}
                    <Link to="/login" className="text-orange-600 font-bold hover:underline">
                        Iniciá sesión
                    </Link>
                </p>
            </form>
        </div>
      </div>
    </div>
  )
}

export default SignUpScreen
