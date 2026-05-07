import { useContext } from 'react'
import { useForm } from '@tanstack/react-form'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/authContext'

const input = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200'

const LoginForm = () => {
    const auth = useContext(AuthContext)
    const navigate = useNavigate()

    const form = useForm({
        defaultValues: { email: "", password: "" },
        onSubmit: async ({ value }) => {
            const ok = await auth?.login(value.email, value.password)
            if (ok) navigate('/menu')
        }

    })

    return (
        <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }} className='flex flex-col gap-4'>
            <form.Field name='email'>
                {(f) => (
                    <input
                        id='login-email'
                        type='email'
                        placeholder='Email'
                        className={input}
                        value={f.state.value}
                        onChange={(e) => f.handleChange(e.target.value)}
                    />
                )}
            </form.Field>

            <form.Field name='password'>
                {(f) => (
                    <input
                        id='login-password'
                        type='password'
                        placeholder='Contraseña'
                        className={input}
                        value={f.state.value}
                        onChange={(e) => f.handleChange(e.target.value)}
                    />
                )}
            </form.Field>

            {auth?.error && (
                <p className='text-sm text-red-600 text-center'>{auth.error}</p>
            )}

            <button
                type='submit'
                disabled={auth?.loading}
                className='rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed'
            >
                {auth?.loading ? 'Ingresando...' : 'Ingresar'}
            </button>
        </form>
    )
}

export default LoginForm

