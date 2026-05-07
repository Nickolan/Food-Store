import { useContext, useEffect, useState } from "react"

import { IngredientesContext } from "../context/ingredientesContext"

import type { Ingrediente } from "../models/Ingrediente"



export const FormularioIngrediente = ({ onSuccess }: any) => {

    const context = useContext(IngredientesContext)

    if (!context) return null

    const [formData, setFormData] = useState<Omit<Ingrediente, "id">>({

        nombre: "",

        descripcion: "",

        activo: true,

        es_alergeno: false

    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

        const { name, value } = e.target;

        const finalValue = value === "true" ? true : value === "false" ? false : value;



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

        <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-xl border border-gray-100 mt-10">

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                <h2 className="text-2xl font-bold mb-4">

                    {context.ingredienteSeleccionado ? "Editar Ingrediente" : "Crear Ingrediente"}

                </h2>



                <div>

                    <label className="block text-gray-700 text-sm font-bold mb-2">Nombre</label>

                    <input

                        type="text"

                        name="nombre"

                        value={formData.nombre}

                        onChange={handleChange}

                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"

                        placeholder="Ej. Harina"

                        required

                    />

                </div>



                <div>

                    <label className="block text-gray-700 text-sm font-bold mb-2">Descripción</label>

                    <textarea

                        name="descripcion"

                        value={formData.descripcion}

                        onChange={(e: any) => handleChange(e)}

                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"

                        placeholder="Descripción del ingrediente"

                        required

                    />

                </div>



                <div>

                    <label className="block text-gray-700 text-sm font-bold mb-2">¿Es Alérgeno?</label>

                    <select

                        name="es_alergeno"

                        value={String(formData.es_alergeno)}

                        onChange={handleChange}

                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"

                    >

                        <option value="true">Sí</option>

                        <option value="false">No</option>

                    </select>

                </div>



                <div className="flex items-center mb-4 mt-2">

                    <input

                        type="checkbox"

                        id="activoCheck"

                        name="activo"

                        checked={formData.activo}

                        onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}

                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"

                    />

                    <label htmlFor="activoCheck" className="ml-2 block text-gray-900 font-bold">

                        Ingrediente Activo

                    </label>

                </div>



                <div className="flex justify-end gap-2 mt-4">

                    <button

                        type="button"

                        onClick={onSuccess}

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

        </div>

    )

}