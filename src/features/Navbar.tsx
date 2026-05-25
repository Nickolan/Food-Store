import React from 'react'

function Navbar() {
    return (
        <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
            <div className="text-2xl font-bold text-orange-600 tracking-tight">
                Sabor&Gestión
            </div>
            <div className="space-x-4">
                <button className="text-stone-600 hover:text-orange-600 transition-colors font-medium">
                    Iniciar Sesión
                </button>
                <button className="bg-red-400 hover:bg-red-500 text-white px-5 py-2 rounded-full font-medium transition-colors shadow-sm">
                    Registrarse
                </button>
            </div>
        </nav>
    )
}

export default Navbar
