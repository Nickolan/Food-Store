import type { ReactNode } from "react"
import { CategoriasProvider } from "./categoriaContext"
import { IngredientesProvider } from "./ingredientesContext"
import { ProductosProvider } from "./productosContext"

export const MainProvider = ({ children }: { children: ReactNode }) => {
    return (
        <IngredientesProvider>
            <CategoriasProvider>
                <ProductosProvider>
                    {children}
                </ProductosProvider>
            </CategoriasProvider>
        </IngredientesProvider>
    )
}