import { useContext, useEffect, useState } from "react"

import { IngredientesContext } from "../context/ingredientesContext"

import type { Ingrediente } from "../models/Ingrediente"



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

        activo: true,

        es_alergeno: false

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

            activo: true,

            es_alergeno: false

        })

        onSuccess()

    }

    useEffect(() => {

        if (context.ingredienteSeleccionado) {

            setFormData({

                nombre: context.ingredienteSeleccionado.nombre,

                descripcion: context.ingredienteSeleccionado.descripcion,

                activo: context.ingredienteSeleccionado.activo,

                es_alergeno: context.ingredienteSeleccionado.es_alergeno

            })

        } else {

            setFormData({

                nombre: "",

                descripcion: "",

                activo: true,

                es_alergeno: false

            })

        }

    }, [context.ingredienteSeleccionado])



    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative flex flex-col">
                <div className="p-6">
                    <button 
                        onClick={onCancel}
                        className="absolute top-6 right-6 text-gray-400 hover:text-[#E63946] transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

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
                                required
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