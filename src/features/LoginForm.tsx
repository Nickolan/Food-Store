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
            if (ok) navigate('/')
        }
    })

    return (
        <form 
            onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }} 
            className="bg-white rounded-[24px] w-full max-w-[520px] p-12 shadow-[0_10px_30px_rgba(0,0,0,0.05)]"
        >
            <div className="text-[#E63946] font-bold text-xl text-center mb-8">
                FOOD-STORE
            </div>
            
            <h2 className="text-[#1D3557] text-3xl font-bold text-center mb-3">
                ¡Bienvenido de Nuevo!
            </h2>
            
            <p className="text-[#1D3557]/50 text-base text-center mb-10">
                Ingresa al panel de gestión
            </p>

            <div className="mb-6">
                <form.Field name="email">
                    {(f) => (
                        <>
                            <label htmlFor="login-email" className="text-sm font-bold text-[#1D3557] mb-3 block">
                                Correo Electrónico
                            </label>
                            <input
                                id="login-email"
                                type="email"
                                className="w-full h-14 bg-white border border-gray-200 rounded-xl text-[#1D3557] text-lg focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946] outline-none px-5"
                                value={f.state.value}
                                onChange={(e) => f.handleChange(e.target.value)}
                            />
                        </>
                    )}
                </form.Field>
            </div>

            <div>
                <form.Field name="password">
                    {(f) => (
                        <>
                            <label htmlFor="login-password" className="text-sm font-bold text-[#1D3557] mb-3 block">
                                Contraseña
                            </label>
                            <input
                                id="login-password"
                                type="password"
                                className="w-full h-14 bg-white border border-gray-200 rounded-xl text-[#1D3557] text-lg focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946] outline-none px-5"
                                value={f.state.value}
                                onChange={(e) => f.handleChange(e.target.value)}
                            />
                        </>
                    )}
                </form.Field>
                <a href="#" className="text-sm text-[#1D3557]/50 underline block mt-3 mb-10 text-left">
                    Recuperar Contraseña
                </a>
            </div>

            {auth?.error && (
                <p className="text-base text-red-600 text-center mb-6">{auth.error}</p>
            )}

            <button
                type="submit"
                disabled={auth?.loading}
                className="w-full h-14 text-lg bg-[#E63946] text-white font-bold rounded-xl hover:bg-[#d92c3a] transition-colors tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {auth?.loading ? 'INGRESANDO...' : 'INGRESAR'}
            </button>
        </form>
    )
}

export default LoginForm
