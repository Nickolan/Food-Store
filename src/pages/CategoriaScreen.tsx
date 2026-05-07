import { useState, useContext } from 'react';
import { CategoriasContext } from '../context/categoriasContext';
import FiltrosCategoria from '../features/filtrosCategoria';
import CardCategoria from '../features/cardCategoria';
import FormCategoria from '../features/formCategoria';
import DetalleCategoria from '../features/detalleCategoria';

export default function CategoriaScreen() {
    const categoriasContext = useContext(CategoriasContext);
    
    const [filtroNombre, setFiltroNombre] = useState('');
    const [filtroActivo, setFiltroActivo] = useState('todos');
    
    const [mostrarModalCrear, setMostrarModalCrear] = useState(false);

    if (!categoriasContext) {
        return <div>Cargando...</div>;
    }

    const { categorias, categoriaSeleccionada } = categoriasContext;

    const categoriasFiltradas = categorias.filter(categoria => {
        const coincideNombre = categoria.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
        
        let coincideActivo = true;
        if (filtroActivo === 'activos') {
            coincideActivo = categoria.activo === true;
        } else if (filtroActivo === 'inactivos') {
            coincideActivo = categoria.activo === false;
        }

        return coincideNombre && coincideActivo;
    });

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-2">Categorías</h1>
            <p className="text-gray-600 mb-6">Administra las categorías de tus productos</p>

            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="w-full md:w-3/4">
                    <FiltrosCategoria 
                        filtroNombre={filtroNombre} 
                        setFiltroNombre={setFiltroNombre}
                        filtroActivo={filtroActivo}
                        setFiltroActivo={setFiltroActivo}
                    />
                </div>
                
                <div className="w-full md:w-1/4 flex md:justify-end">
                    <button 
                        onClick={() => setMostrarModalCrear(true)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full md:w-auto transition-colors"
                    >
                        Crear Categoría
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {categoriasFiltradas.length > 0 ? (
                    categoriasFiltradas.map((categoria) => (
                        <CardCategoria key={categoria.id} categoria={categoria} />
                    ))
                ) : (
                    <p className="text-gray-500 col-span-full text-center py-8">No se encontraron categorías.</p>
                )}
            </div>

            {mostrarModalCrear && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
                        <FormCategoria cerrar={() => setMostrarModalCrear(false)} />
                    </div>
                </div>
            )}

            {categoriaSeleccionada && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
                        <DetalleCategoria cerrar={() => categoriasContext.setCategoriaSeleccionada(null)} />
                    </div>
                </div>
            )}
        </div>
    );
}
