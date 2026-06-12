import LoginForm from '../features/LoginForm'
import { Link } from 'react-router-dom'

const LoginScreen = () => {
  return (
    <div className="min-h-screen w-full bg-orange-50 flex items-center justify-center px-4 py-12">

      {/* Decoración de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-orange-200 rounded-full opacity-30 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-orange-300 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-5xl flex rounded-3xl overflow-hidden shadow-2xl shadow-orange-200/60">

        {/* Panel izquierdo — imagen + branding */}
        <div className="hidden md:flex md:w-1/2 relative flex-col justify-between p-10 bg-stone-900">
          <img
            src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80"
            alt="Comida"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          {/* Gradiente encima de la imagen */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/60 to-transparent" />

          {/* Contenido sobre la imagen */}
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 bg-orange-600 text-white text-sm font-bold px-4 py-1.5 rounded-full">
              🍔 Sabor&Gestión
            </span>
          </div>

          <div className="relative z-10 space-y-4">
            <h2 className="text-white text-3xl font-extrabold leading-snug">
              Tus platos favoritos,{' '}
              <span className="text-orange-400">directo a tu puerta.</span>
            </h2>
            <p className="text-stone-400 text-sm leading-relaxed">
              Gestioná tu menú, pedidos y stock desde un solo lugar. Rápido, simple y en tiempo real.
            </p>
          </div>
        </div>

        {/* Panel derecho — formulario */}
        <div className="w-full md:w-1/2 bg-white flex flex-col justify-center px-8 py-12 sm:px-12">
          {/* Logo mobile */}
          <div className="md:hidden text-orange-600 font-extrabold text-xl mb-8 text-center">
            🍔 Sabor&Gestión
          </div>

          <LoginForm />

          <p className="mt-8 text-center text-sm text-stone-500">
            ¿No tenés cuenta?{' '}
            <Link to="/signup" className="text-orange-600 font-semibold hover:text-orange-700 transition-colors">
              Registrate
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}

export default LoginScreen
