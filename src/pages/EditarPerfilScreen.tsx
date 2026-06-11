import { useState } from 'react';
import { useAuth } from '../context/authContext';
import { useNavigate, Link, useParams, Navigate } from 'react-router-dom';
import { usuarioApi, type ActualizarUsuarioDTO } from '../api/usuarioApi';
import DireccionesManager from '../features/components/DireccionesManager';
import { toast } from 'react-hot-toast';
import Navbar from '../features/Navbar';
import CarritoDrawer from '../features/CarritoDrawer';

export default function EditarPerfilScreen() {
  const { usuario, getUsuarioFromToken } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: usuario?.nombre || '',
    apellido: usuario?.apellido || '',
    celular: usuario?.celular || '',
  });

  if (!usuario) {
    return <div className="text-center py-8">Cargando...</div>;
  }
  
  if (usuario && id && Number(id) !== usuario.id) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData: ActualizarUsuarioDTO = {};
      if (formData.nombre !== usuario.nombre) updateData.nombre = formData.nombre;
      if (formData.apellido !== usuario.apellido) updateData.apellido = formData.apellido;
      if (formData.celular !== usuario.celular) updateData.celular = formData.celular;

      if (Object.keys(updateData).length > 0) {
        await usuarioApi.actualizarPerfil(updateData);
        await getUsuarioFromToken(); 
        toast.success('Perfil actualizado correctamente');
        navigate(`/usuario/${usuario.id}`);
      } else {
        toast.error('No hay cambios para guardar');
      }
    } catch (error) {
      toast.error('Error al actualizar el perfil');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-orange-50 min-h-screen">
      <Navbar />
      <CarritoDrawer />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Botón volver */}
          <Link
            to={`/usuario/${usuario.id}`}
            className="inline-flex items-center text-orange-500 hover:text-orange-600 mb-4"
          >
            ← Volver al perfil
          </Link>

          
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-orange-500 pl-3">
            Editar Perfil
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Celular</label>
              <input
                type="text"
                name="celular"
                value={formData.celular || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="+54 11 1234-5678"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Link
                to={`/usuario/${usuario.id}`}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>

          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <DireccionesManager readonly={false} />
          </div>
        </div>
      </div>
    </div>
  );
}