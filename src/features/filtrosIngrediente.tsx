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

        <div className="flex flex-wrap items-center gap-3 mb-6">

            <div className="w-full md:w-64">
                <input
                    type="search"
                    placeholder="Buscar ingrediente..."
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                />
            </div>

            <select
                name="es_alergeno"
                value={es_alergeno}
                onChange={(e) => setEsAlergeno(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            >
                <option value="todos">Todos los Alérgenos</option>
                <option value="true">Sí (Alérgeno)</option>
                <option value="false">No (Sin Alérgeno)</option>
            </select>

            <select
                name="activo"
                value={activo}
                onChange={(e) => setActivo(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            >
                <option value="todos">Todos los Estados</option>
                <option value="true">Solo Activos</option>
                <option value="false">Inactivos</option>
            </select>

            <button
                className="text-sm font-medium text-gray-500 hover:text-gray-700 underline underline-offset-4 transition-colors px-2"
                onClick={() => { setEsAlergeno("todos"), setActivo("todos"), setNombre("") }}
            >
                Limpiar filtros
            </button>

        </div>

    )

}