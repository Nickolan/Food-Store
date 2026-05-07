import { Link } from "react-router-dom";

export default function MenuScreen() {
  return (
    <>
    <div className="flex flex-col items-center mt-10 justify-center">
        <h1 className="font-bold text-7xl mb-10">Bienvenido</h1>
        <div>
        <Link to="/ingredientes" className="border rounded-full bg-blue-600 text-white font-bold p-3 m-2">Ver todos los ingredientes</Link>
        <Link to="/productos" className="border rounded-full bg-blue-600 text-white font-bold p-3 m-2">Ver todos los productos</Link>
        <Link to="/categorias" className="border rounded-full bg-blue-600 text-white font-bold p-3 m-2">Ver todas las categorías</Link>
        </div>
    </div>
    </>
  )
}
