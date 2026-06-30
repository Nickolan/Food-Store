import { useForm } from '@tanstack/react-form'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'

const LoginForm = () => {
    const auth = useAuth()
    const navigate = useNavigate()

    const form = useForm({
        defaultValues: { email: "", password: "" },
        onSubmit: async ({ value }) => {
            const ok = await auth?.login(value.email, value.password)

            if (ok) {
                if (auth?.getUsuarioFromToken) {
                    try {
                        await auth.getUsuarioFromToken()
                        navigate('/')
                    } catch (error) {
                        console.error("Error cargando usuario:", error)
                    }
                }
            }
        }
    })

    return (
        <div className="w-full">
            {/* Encabezado */}
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-stone-900 mb-2">
                    ¡Bienvenido de nuevo!
                </h1>
                <p className="text-stone-500 text-sm">
                    Ingresá tus datos para continuar.
                </p>
            </div>

            <form
                onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}
                className="space-y-5"
            >
                {/* Email */}
                <form.Field name="email">
                    {(f) => (
                        <div>
                            <label
                                htmlFor="login-email"
                                className="block text-sm font-semibold text-stone-700 mb-1.5"
                            >
                                Correo electrónico
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5A2.25 2.25 0 002.25 6.75m19.5 0v.243a2.25 2.25 0 01-.9 1.8l-7.5 5.625a2.25 2.25 0 01-2.7 0L2.25 8.793V6.75" />
                                    </svg>
                                </span>
                                <input
                                    id="login-email"
                                    type="email"
                                    placeholder="ejemplo@correo.com"
                                    autoComplete="email"
                                    className="w-full h-12 pl-11 pr-4 bg-orange-50 border border-orange-200 rounded-xl text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                                    value={f.state.value}
                                    onChange={(e) => f.handleChange(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    )}
                </form.Field>

                {/* Password */}
                <form.Field name="password">
                    {(f) => (
                        <div>
                            <label
                                htmlFor="login-password"
                                className="block text-sm font-semibold text-stone-700 mb-1.5"
                            >
                                Contraseña
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                    </svg>
                                </span>
                                <input
                                    id="login-password"
                                    type="password"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    className="w-full h-12 pl-11 pr-4 bg-orange-50 border border-orange-200 rounded-xl text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                                    value={f.state.value}
                                    onChange={(e) => f.handleChange(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    )}
                </form.Field>

                {/* Error global */}
                {auth?.error && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                        {auth.error}
                    </div>
                )}

                {/* Submit */}
                <button
                    type="submit"
                    disabled={auth?.loading}
                    className="w-full h-12 bg-orange-600 hover:bg-orange-700 active:scale-[0.98] text-white font-bold rounded-xl transition-all shadow-md shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide mt-2"
                >
                    {auth?.loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Ingresando...
                        </span>
                    ) : 'Ingresar'}
                </button>
            </form>
        </div>
    )
}

export default LoginForm
