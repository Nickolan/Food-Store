import { useContext, useEffect, useState } from "react"

import { IngredientesContext } from "../context/ingredientesContext"

import type { Ingrediente } from "../models/Ingrediente"
import type { UnidadMedida } from "../models/Unidad_medida";
import { getUnidadesMedida } from "../api/unidadesMedidaApi";



interface FormularioIngredienteProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export const FormularioIngrediente = ({ onSuccess, onCancel }: FormularioIngredienteProps) => {

    const context = useContext(IngredientesContext)
 
    if (!context) return null

    const [formData, setFormData] = useState<Omit<Ingrediente, "id">>({

        nombre: "",

        descripcion: "",

        stock_cantidad: 0,

        precio: null,

        activo: true,

        es_alergeno: false,

        unidad_medida_id: null

    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {

        const { name, value, type } = e.target;
        let finalValue: string | boolean = value;

        if (type === "checkbox") {
            finalValue = (e.target as HTMLInputElement).checked;
        } else if (value === "true") {
            finalValue = true;
        } else if (value === "false") {
            finalValue = false;
        }

        setFormData({
            ...formData,
            [name]: finalValue
        });

    };

    const handleSubmit = (e: React.FormEvent) => {

        e.preventDefault();

        if (!context.ingredienteSeleccionado) {

            context.agregar(formData as Ingrediente)

        } else {

            const ingredienteActualizado = {

                ...formData,

                id: context.ingredienteSeleccionado.id

            } as Ingrediente

            context.actualizar(ingredienteActualizado)

        }

        setFormData({

            nombre: "",

            descripcion: "",

            stock_cantidad: 0,

            precio: null,

            activo: true,

            es_alergeno: false,

            unidad_medida_id: null

        })

        onSuccess()

    }

    useEffect(() => {

        if (context.ingredienteSeleccionado) {

            setFormData({

                nombre: context.ingredienteSeleccionado.nombre,

                descripcion: context.ingredienteSeleccionado.descripcion,

                stock_cantidad: context.ingredienteSeleccionado.stock_cantidad,

                precio: context.ingredienteSeleccionado.precio ?? null,

                activo: context.ingredienteSeleccionado.activo,

                es_alergeno: context.ingredienteSeleccionado.es_alergeno,

                unidad_medida_id: context.ingredienteSeleccionado.unidad_medida_id ?? null

            })

        } else {

            setFormData({

                nombre: "",

                descripcion: "",

                stock_cantidad: 0,

                precio: null,

                activo: true,

                es_alergeno: false,

                unidad_medida_id: null

            })

        }

    }, [context.ingredienteSeleccionado])

    const [unidades, setUnidades] = useState<UnidadMedida[]>([]);
    useEffect(() => {
        getUnidadesMedida().then(res => setUnidades(res.items));
    }, []);

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[5vh] bg-gray-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative flex flex-col max-h-[85vh]">
                <button 
                    onClick={onCancel}
                    className="absolute top-6 right-6 z-10 text-gray-400 hover:text-[#E63946] transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="overflow-y-auto p-6">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <h2 className="text-2xl font-bold text-[#1D3557] mb-6">
                            {context.ingredienteSeleccionado ? "Editar Ingrediente" : "Crear Ingrediente"}
                        </h2>

                        <div>
                            <label className="block text-sm font-bold text-[#1D3557] mb-1.5">Nombre</label>
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#1D3557] focus:outline-none focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946] transition-all bg-gray-50/50 focus:bg-white"
                                placeholder="Ej. Harina"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-[#1D3557] mb-1.5">Descripcion</label>
                            <textarea
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#1D3557] focus:outline-none focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946] transition-all bg-gray-50/50 focus:bg-white min-h-[100px]"
                                placeholder="Descripcion del ingrediente"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-[#1D3557] mb-1.5">Stock disponible</label>
                            <input
                                type="number"
                                name="stock_cantidad"
                                value={formData.stock_cantidad}
                                min={0}
                                onChange={(e) => setFormData({ ...formData, stock_cantidad: Math.max(0, Number(e.target.value)) })}
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#1D3557] focus:outline-none focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946] transition-all bg-gray-50/50 focus:bg-white"
                                placeholder="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-[#1D3557] mb-1.5">Es Alergeno?</label>
                            <select
                                name="es_alergeno"
                                value={String(formData.es_alergeno)}
                                onChange={handleChange}
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#1D3557] focus:outline-none focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946] transition-all bg-gray-50/50 focus:bg-white"
                            >
                                <option value="true">Si</option>
                                <option value="false">No</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-[#1D3557] mb-1.5">Precio</label>
                            <input
                                type="number"
                                name="precio"
                                value={formData.precio ?? ''}
                                min={0}
                                step={0.01}
                                onChange={(e) => setFormData({ ...formData, precio: e.target.value ? Number(e.target.value) : null })}
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#1D3557] focus:outline-none focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946] transition-all bg-gray-50/50 focus:bg-white"
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-[#1D3557] mb-1.5">
                                Unidad de medida <span className="font-normal text-gray-400">(del stock)</span>
                            </label>
                            <select
                                name="unidad_medida_id"
                                value={formData.unidad_medida_id ?? 0}
                                onChange={(e) => setFormData({ ...formData, unidad_medida_id: Number(e.target.value) || null })}
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#1D3557] focus:outline-none focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946] transition-all bg-gray-50/50 focus:bg-white"
                            >
                                <option value={0}>Sin unidad</option>
                                {unidades.map(u => (
                                    <option key={u.id} value={u.id}>{u.nombre} ({u.simbolo})</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-end mt-8 pt-5 border-t border-gray-100">
                            <button
                                type="submit"
                                className="px-5 py-2.5 rounded-lg font-bold bg-[#E63946] text-white hover:bg-[#d92c3a] transition-colors shadow-md"
                            >
                                {context.ingredienteSeleccionado ? "Guardar Cambios" : "Crear Ingrediente"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}