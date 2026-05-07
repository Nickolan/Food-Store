import { useState, useContext, type ChangeEvent, type FormEvent } from 'react';
import { CategoriasContext } from '../context/categoriasContext';
import type { Categoria } from '../models/Categoria';

interface FormCategoriaProps {
    cerrar: () => void;
    categoriaAEditar?: Categoria;
}

export default function FormCategoria({ cerrar, categoriaAEditar }: FormCategoriaProps) {
    const categoriasContext = useContext(CategoriasContext);

    const [nombre, setNombre] = useState(categoriaAEditar?.nombre || '');
    const [descripcion, setDescripcion] = useState(categoriaAEditar?.descripcion || '');
    const [imagenUrl, setImagenUrl] = useState(categoriaAEditar?.imagen_url || '');
    const [activo, setActivo] = useState(categoriaAEditar !== undefined ? categoriaAEditar.activo : true);
    const [parentId, setParentId] = useState<number | ''>(categoriaAEditar?.parent_id || '');

    if (!categoriasContext) return null;
    const categoriasDisponibles = categoriasContext.categorias.filter(c => c.id !== categoriaAEditar?.id);

    const handleImagenChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagenUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        
        if (!nombre.trim()) {
            alert("El nombre es obligatorio");
            return;
        }

        const categoriaData: Categoria = {
            id: categoriaAEditar ? categoriaAEditar.id : Date.now(),
            nombre,
            descripcion,
            imagen_url: imagenUrl,
            activo,
            parent_id: parentId === '' ? undefined : Number(parentId),
            hijos: categoriaAEditar?.hijos || []
        };

        if (categoriaAEditar) {
            categoriasContext.actualizar(categoriaData);
            categoriasContext.setCategoriaSeleccionada(categoriaData);
        } else {
            categoriasContext.agregar(categoriaData);
        }
        
        cerrar();
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold mb-4">
                {categoriaAEditar ? 'Editar Categoría' : 'Crear Categoría'}
            </h2>

            <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Nombre</label>
                <input 
                    type="text" 
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej. Bebidas"
                    required
                />
            </div>

            <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Descripción</label>
                <textarea 
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                    placeholder="Descripción de la categoría"
                />
            </div>

            <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Imagen Local</label>
                <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImagenChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {imagenUrl && (
                    <div className="mt-2 h-24 overflow-hidden rounded border bg-gray-100 flex items-center justify-center">
                        <img src={imagenUrl} alt="Preview" className="h-full object-contain" />
                    </div>
                )}
            </div>

            <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Categoría Padre</label>
                <select 
                    value={parentId}
                    onChange={(e) => setParentId(e.target.value === '' ? '' : Number(e.target.value))}
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                    <option value="">Ninguna (Categoría Raíz)</option>
                    {categoriasDisponibles.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                </select>
            </div>

            <div className="flex items-center mb-4 mt-2">
                <input 
                    type="checkbox" 
                    id="activoCheck"
                    checked={activo}
                    onChange={(e) => setActivo(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="activoCheck" className="ml-2 block text-gray-900 font-bold">
                    Categoría Activa
                </label>
            </div>

            <div className="flex justify-end gap-2 mt-4">
                <button 
                    type="button" 
                    onClick={cerrar}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                >
                    Cancelar
                </button>
                <button 
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                    Guardar
                </button>
            </div>
        </form>
    );
}
