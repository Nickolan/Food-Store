interface FiltrosIngredienteProps {

    activo: string;

    setActivo: (val: string) => void;

    nombre: string;

    setNombre: (val: string) => void;

    es_alergeno: string;

    setEsAlergeno: (val: string) => void;

}

export const FiltrosIngrediente = ({ activo, setActivo, nombre, setNombre, es_alergeno, setEsAlergeno }: FiltrosIngredienteProps) => {

    return (

        <div className="flex flex-col md:flex-row gap-4 w-full my-6">

            <div className="flex-1">

                <input

                    type="text"

                    placeholder="Nombre del ingrediente..."

                    value={nombre}

                    onChange={(e) => setNombre(e.target.value)}

                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"

                />

            </div>



            <div className="w-full md:w-48">

                <select

                    name="es_alergeno"

                    value={es_alergeno}

                    onChange={(e) => setEsAlergeno(e.target.value)}

                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"

                >

                    <option value="todos">Todos los Alérgenos</option>

                    <option value="true">Sí (Alérgeno)</option>

                    <option value="false">No (Sin Alérgeno)</option>

                </select>

            </div>



            <div className="w-full md:w-48">

                <select

                    name="activo"

                    value={activo}

                    onChange={(e) => setActivo(e.target.value)}

                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"

                >

                    <option value="todos">Todos los Estados</option>

                    <option value="true">Activos</option>

                    <option value="false">Inactivos</option>

                </select>

            </div>



            <button

                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition-colors"

                onClick={() => { setEsAlergeno("todos"), setActivo("todos"), setNombre("") }}

            >

                Limpiar

            </button>

        </div>

    )

}