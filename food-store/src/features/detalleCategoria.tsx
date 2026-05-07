import { useState, useContext } from 'react';
import { CategoriasContext } from '../context/categoriasContext';
import FormCategoria from './formCategoria';
import { FaTrash, FaEdit, FaTimes } from 'react-icons/fa';

interface DetalleCategoriaProps {
    cerrar: () => void;
}

export default function DetalleCategoria({ cerrar }: DetalleCategoriaProps) {
    const categoriasContext = useContext(CategoriasContext);
    const [modoEdicion, setModoEdicion] = useState(false);

    if (!categoriasContext) return null;

    const categoria = categoriasContext.categoriaSeleccionada;

    if (!categoria) {
        cerrar();
        return null;
    }

    const handleEliminar = () => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
            categoriasContext.eliminar(categoria.id);
            cerrar();
        }
    };

    if (modoEdicion) {
        return (
            <div className="relative">
                <button
                    onClick={() => setModoEdicion(false)}
                    className="absolute -top-2 -right-2 text-gray-500 hover:text-gray-700 p-2"
                >
                    <FaTimes size={20} />
                </button>
                <FormCategoria
                    cerrar={() => setModoEdicion(false)}
                    categoriaAEditar={categoria}
                />
            </div>
        );
    }

    const categoriaPadre = categoria.parent_id
        ? categoriasContext.categorias.find(c => c.id === categoria.parent_id)
        : null;

    const subcategorias = categoriasContext.categorias.filter(c => c.parent_id === categoria.id);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-start border-b pb-4">
                <h2 className="text-2xl font-bold pr-4">{categoria.nombre}</h2>
                <button
                    onClick={cerrar}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <FaTimes size={24} />
                </button>
            </div>

            <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border">
                {categoria.imagen_url ? (
                    <img
                        src={categoria.imagen_url}
                        alt={categoria.nombre}
                        className="w-full h-full object-contain"
                    />
                ) : (
                    <span className="text-gray-400">Sin Imagen Disponible</span>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <p><strong>Descripción:</strong> {categoria.descripcion || 'Sin descripción.'}</p>

                <p>
                    <strong>Estado: </strong>
                    <span className={`inline-block px-2 py-1 rounded text-sm font-bold ${categoria.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {categoria.activo ? 'Activa' : 'Inactiva'}
                    </span>
                </p>

                <p>
                    <strong>Categoría Padre: </strong>
                    {categoriaPadre ? categoriaPadre.nombre : 'Ninguna'}
                </p>

                <p>
                    <strong>Subcategorías: </strong>
                    {subcategorias.length > 0
                        ? subcategorias.map(c => c.nombre).join(', ')
                        : 'Ninguna'}
                </p>
            </div>

            <div className="flex justify-end gap-3 mt-6 border-t pt-4">
                <button
                    onClick={handleEliminar}
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                    <FaTrash /> ELIMINAR
                </button>
                <button
                    onClick={() => setModoEdicion(true)}
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                    <FaEdit /> EDITAR
                </button>
            </div>
        </div>
    );
}
