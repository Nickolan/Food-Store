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
    
    const [parentId, setParentId] = useState<number | ''>(categoriaAEditar?.parent_id || '');

    if (!categoriasContext) return null;
    const categoriasDisponibles = categoriasContext.categorias.filter(c => c.id !== categoriaAEditar?.id);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        
        if (!nombre.trim()) {
            alert("El nombre es obligatorio");
            return;
        }

        if (!descripcion.trim()) {
            alert("La descripción es obligatoria");
            return;
        }

        const categoriaData: Categoria = {
            id: categoriaAEditar ? categoriaAEditar.id : Date.now(),
            nombre,
            descripcion,
            imagen_url: categoriaAEditar?.imagen_url || '',
            activo: categoriaAEditar?.activo ?? true,
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative flex flex-col">
                <div className="p-6">
                    <button 
                        onClick={cerrar}
                        className="absolute top-6 right-6 text-gray-400 hover:text-[#E63946] transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <h2 className="text-2xl font-bold text-[#1D3557] mb-6">
                            {categoriaAEditar ? 'Editar Categoria' : 'Crear Categoria'}
                        </h2>

                        <div>
                            <label className="block text-sm font-bold text-[#1D3557] mb-1.5">Nombre</label>
                            <input 
                                type="text" 
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#1D3557] focus:outline-none focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946] transition-all bg-gray-50/50 focus:bg-white"
                                placeholder="Ej. Bebidas"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-[#1D3557] mb-1.5">Descripcion</label>
                            <textarea 
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#1D3557] focus:outline-none focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946] transition-all bg-gray-50/50 focus:bg-white min-h-[100px]"
                                placeholder="Descripcion de la categoria"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-[#1D3557] mb-1.5">Categoria Padre</label>
                            <select 
                                value={parentId}
                                onChange={(e) => setParentId(e.target.value === '' ? '' : Number(e.target.value))}
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#1D3557] focus:outline-none focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946] transition-all bg-gray-50/50 focus:bg-white"
                            >
                                <option value="">Ninguna (Categoria Raiz)</option>
                                {categoriasDisponibles.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                ))}
                            </select>
                        </div>

                        

                        <div className="flex justify-end mt-8 pt-5 border-t border-gray-100">
                            <button 
                                type="submit"
                                className="px-5 py-2.5 rounded-lg font-bold bg-[#E63946] text-white hover:bg-[#d92c3a] transition-colors shadow-md"
                            >
                                {categoriaAEditar ? "Guardar Cambios" : "Crear Categoria"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}