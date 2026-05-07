import type { ReactNode } from "react"
import { AuthProvider } from "./authContext"
import { CategoriasProvider } from "./categoriasContext"
import { IngredientesProvider } from "./ingredientesContext"
import { ProductosProvider } from "./productosContext"

export const MainProvider = ({children}:{children:ReactNode})=>{
return(
    <AuthProvider>
        <IngredientesProvider>
            <CategoriasProvider>
                <ProductosProvider>
                    {children}
                </ProductosProvider>
            </CategoriasProvider>
        </IngredientesProvider>
    </AuthProvider>
)
}