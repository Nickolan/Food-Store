import { useContext, useEffect, useState } from "react"
import { IngredientesContext } from "../context/ingredientesContext"
import type { Ingrediente } from "../models/Ingrediente"

export const FormularioIngrediente = ({onSuccess}:any)=> {
    const context=useContext(IngredientesContext)
    if (!context) return null 
    const [formData,setFormData]=useState<Omit<Ingrediente,"id">>({
        nombre:"",
        descripcion:"",
        activo:true,
        es_alergeno:false
    })
   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const finalValue = value === "true" ? true : value === "false" ? false : value;

    setFormData({
        ...formData,
        [name]: finalValue
    });
};
  const handleSubmit=(e:React.FormEvent)=>{
    e.preventDefault();
    if (!context.ingredienteSeleccionado){
        context.agregar(formData as Ingrediente)
    }else{
        const ingredienteActualizado={
            ...formData,
            id:context.ingredienteSeleccionado.id
        } as Ingrediente
        context.actualizar(ingredienteActualizado)
        }
    setFormData({
    nombre:"",
    descripcion:"",
    activo:true,
    es_alergeno:false
    })
    onSuccess()   
  }
  useEffect(()=>{
    if (context.ingredienteSeleccionado){
        setFormData({
            nombre:context.ingredienteSeleccionado.nombre,
            descripcion:context.ingredienteSeleccionado.descripcion,
            activo:context.ingredienteSeleccionado.activo,
            es_alergeno:context.ingredienteSeleccionado.es_alergeno
        })
    }else{
        setFormData({
            nombre:"",
            descripcion:"",
            activo:true,
            es_alergeno:false
        })
    }
  },[context.ingredienteSeleccionado])

   return(
     <div > 
         <h1 className=' bg-blue-500 p-4 text-3xl font-bold text-center mb-6'>Formulario de ingredientes</h1>
         <h3 className='font-bold text-xl my-5'>Ingredientes registrados: {context.contador}</h3>
         <form onSubmit={handleSubmit} className='shadow-md' >
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <input type="text" className="my-3 mx-2 border p-2 rounded" name='nombre' value={formData.nombre} placeholder='Nombre' onChange={handleChange} required /> 
          <input type="text" className="my-3 mx-2 border p-2 rounded" name='descripcion' value={formData.descripcion} placeholder='Descripción' onChange={handleChange} required /> 
          <select name="es_alergeno" className="border p-1 text-sm rounded" value={String(formData.es_alergeno)} onChange={handleChange}>
            <option value="true">Sí</option>
            <option value="false">No</option>
          </select> 
          </div>
          <div className='mt-4'>
         <button type='submit' className='bg-blue-600 rounded text-white md:col-span-3 py-2 px-4 hover:bg-blue-700'>{context.ingredienteSeleccionado ? "Guardar Cambios" : "Registrar"}</button>
         </div>
         </form>
      </div>
   )
}