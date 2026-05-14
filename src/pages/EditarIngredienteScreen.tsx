import { useNavigate, useParams } from "react-router-dom"

import { IngredientesContext } from "../context/ingredientesContext"

import { useContext, useEffect } from "react"

import { FormularioIngrediente } from "../features/formularioIngrediente"



export default function EditarIngredienteScreen() {

  const { id } = useParams()

  const navigate = useNavigate()

  const context = useContext(IngredientesContext)

  if (!context) {

    return null

  }

  const { ingredientes, setIngredienteSeleccionado } = context

  useEffect(() => {

    const ingrediente = context.ingredientes.find((i) => i.id === Number(id))

    if (ingrediente) {

      setIngredienteSeleccionado(ingrediente)

    } else {

      alert("Ingrediente no encontrado")

      navigate("/ingredientes")

    }

    return () => {

      setIngredienteSeleccionado(null)

    }

  }, [id, ingredientes, setIngredienteSeleccionado])

  return (
    <FormularioIngrediente onSuccess={() => { navigate("/ingredientes") }} onCancel={() => { navigate("/ingredientes") }} />
  )

}