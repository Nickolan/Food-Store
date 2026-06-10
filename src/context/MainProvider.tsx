import type { ReactNode } from "react"
import { AuthProvider } from "./authContext"
import { CategoriasProvider } from "./categoriasContext"
import { IngredientesProvider } from "./ingredientesContext"
import { ProductosProvider } from "./productosContext"
import { CarritoProvider } from "./carritoContext"

export const MainProvider = ({children}:{children:ReactNode})=>{
return(
    <AuthProvider>
        <CarritoProvider>
            <IngredientesProvider>
                <CategoriasProvider>
                    <ProductosProvider>
                        {children}
                    </ProductosProvider>
                </CategoriasProvider>
            </IngredientesProvider>
        </CarritoProvider>
    </AuthProvider>
)
}