interface FiltrosIngredienteProps {
    activo: string;
    setActivo: (val: string) => void;
    nombre: string;
    setNombre: (val: string) => void;
    es_alergeno: string;
    setEsAlergeno: (val: string) => void;
}
export const FiltrosIngrediente = ({activo, setActivo, nombre, setNombre, es_alergeno, setEsAlergeno}: FiltrosIngredienteProps) => {
    return (
        <div className='my-5 flex flex-col w-full md:flex-row flex-wrap justify-center items-center gap-10'>
            <div>
            <input className="bg-blue-100  p-2" type="text" placeholder="Nombre del ingrediente" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </div>
            <div>
            <label className="bg-blue-300 mr-2 text-xl p-2 border rounded">Alergeno:</label>
            <select className="bg-blue-100 p-2" name="es_alergeno" value={es_alergeno} onChange={(e) => setEsAlergeno(e.target.value)}>
                <option value="todos">Todos</option>
                <option value="true">Sí</option>
                <option value="false">No</option>
            </select>
            </div>
            <div>
            <label className="bg-blue-300 mr-2 text-xl p-2 border rounded">Estado:</label>
             <select className="bg-blue-100  p-2" name="activo" value={activo} onChange={(e) => setActivo(e.target.value)}>
                <option value="todos">Todos</option>
                <option value="true">Activos</option>
                <option value="false">Dados de baja</option>
            </select>
            </div>
            <button className="bg-gray-400 font-bold rounded p-2" onClick={()=>{setEsAlergeno("Todos"), setActivo("Todos"),setNombre("")}}>Limpiar filtros</button>
        </div>
    )
}