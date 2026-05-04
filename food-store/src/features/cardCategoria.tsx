import { useContext } from 'react';
import type { Categoria } from '../models/Categoria';
import { CategoriasContext } from '../context/categoriaContext';

export default function CardCategoria({ categoria }: { categoria: Categoria }) {
    const categoriasContext = useContext(CategoriasContext);

    const handleClick = () => {
        if (categoriasContext) {
            categoriasContext.setCategoriaSeleccionada(categoria);
        }
    };

    const borderColor = categoria.activo ? 'border-green-500' : 'border-red-500';

    return (
        <div 
            onClick={handleClick}
            className={`border-2 ${borderColor} rounded-lg shadow-md p-4 flex flex-col bg-white hover:shadow-lg transition-shadow cursor-pointer`}
        >
            <div className="w-full h-32 mb-4 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
                {categoria.imagen_url ? (
                    <img 
                        src={categoria.imagen_url} 
                        alt={categoria.nombre} 
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-gray-400">Sin Imagen</span>
                )}
            </div>

            <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-bold truncate pr-2">{categoria.nombre}</h2>
                    <span className={`text-xs px-2 py-1 rounded font-semibold ${categoria.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {categoria.activo ? 'Activo' : 'Inactivo'}
                    </span>
                </div>
                
                <p className="text-gray-600 text-sm line-clamp-2">
                    {categoria.descripcion || "Sin descripción"}
                </p>
            </div>
        </div>
    );
}
