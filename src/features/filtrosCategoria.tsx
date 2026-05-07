export default function FiltrosCategoria({ 
    filtroNombre, 
    setFiltroNombre, 
    filtroActivo, 
    setFiltroActivo 
}: { 
    filtroNombre: string, 
    setFiltroNombre: (val: string) => void,
    filtroActivo: string,
    setFiltroActivo: (val: string) => void
}) {
    return (
        <div className="flex flex-col md:flex-row gap-4 w-full">
            <div className="flex-1">
                <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={filtroNombre}
                    onChange={(e) => setFiltroNombre(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="w-full md:w-48">
                <select
                    value={filtroActivo}
                    onChange={(e) => setFiltroActivo(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                    <option value="todos">Todos</option>
                    <option value="activos">Activos</option>
                    <option value="inactivos">Inactivos</option>
                </select>
            </div>
        </div>
    );
}
