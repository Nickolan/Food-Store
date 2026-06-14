import { useState, useContext, type ChangeEvent, type FormEvent } from 'react';
import { CategoriasContext } from '../context/categoriasContext';
import type { Categoria } from '../models/Categoria';
import { extraerPublicId } from '../api/cloudinary';

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
    const [imagenFile, setImagenFile] = useState<File | null>(null);
    const [imagenEliminada, setImagenEliminada] = useState(false);
    const [imagenPreview, setImagenPreview] = useState<string | null>(
      categoriaAEditar?.imagen_url ?? null
    );
    const [imagenPublicId, setImagenPublicId] = useState<string | null>(
      categoriaAEditar?.imagen_url ? extraerPublicId(categoriaAEditar.imagen_url) : null
    );

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!nombre.trim()) {
            alert("El nombre es obligatorio");
            return;
        }
        if (!descripcion.trim()) {
            alert("La descripción es obligatoria");
            return;
        }
        if (imagenEliminada && imagenPublicId && categoriaAEditar?.id) {
           await fetch(`http://localhost:8000/api/v1/categorias/${categoriaAEditar.id}/imagen?public_id=${encodeURIComponent(imagenPublicId)}`, {
           method: "DELETE",
           credentials: "include",
           });
        }
        let imagenUrl = imagenEliminada ? '' : (categoriaAEditar?.imagen_url ?? '');
        if (imagenFile) {
            const formData = new FormData();
            formData.append("file", imagenFile);
            const res = await fetch("http://localhost:8000/api/v1/uploads/imagen?carpeta=foodstore/categorias", {
                method: "POST",
                credentials: "include",
                body: formData
            });
            const data = await res.json();
            imagenUrl = data.secure_url;
        }
        const categoriaData: Categoria = {
            id: categoriaAEditar ? categoriaAEditar.id : Date.now(),
            nombre,
            descripcion,
            imagen_url: imagenUrl, 
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
                        <div>
                           <label className="block text-sm font-bold text-[#1D3557] mb-1.5">
                             Imagen <span className="font-normal text-gray-400">(opcional)</span>
                           </label>
                           <input
                             type="file"
                             accept="image/*"
                             onChange={(e) => {
                               const file = e.target.files?.[0] ?? null;
                               setImagenFile(file);
                               if (file) setImagenPreview(URL.createObjectURL(file));
                             }}
                             className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                           />
                           {imagenPreview && (
                             <div className="relative mt-3 inline-block">
                               <img src={imagenPreview} className="h-24 w-24 object-cover rounded-lg border border-gray-200" />
                               <button
                                 type="button"
                                 onClick={() => {
                                  setImagenFile(null);
                                  setImagenPreview(null);
                                  setImagenEliminada(true);
                                }}
                                 className="absolute -top-1 -right-2 bg-red-600 text-white rounded-full p-1 px-2 hover:bg-red-700"
                            >x</button>                               
                             </div>
                           )}
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