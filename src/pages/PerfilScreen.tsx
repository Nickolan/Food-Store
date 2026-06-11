import { useAuth } from '../context/authContext';
import { Link } from 'react-router-dom';
import { FaRegEdit } from 'react-icons/fa';
import DireccionesManager from '../features/components/DireccionesManager';
import Navbar from '../features/Navbar';
import CarritoDrawer from '../features/CarritoDrawer';

export default function PerfilScreen() {
  const { usuario } = useAuth();

  if (!usuario) {
    return <div className="text-center py-8">Cargando...</div>;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR');
  };

  const rolesTexto = usuario.roles.map(r => r.nombre || r.codigo).join(', ');

  return (
    <div className="bg-orange-50 min-h-screen">
      <Navbar />
      <CarritoDrawer />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 relative">
          
          <Link
            to={`/usuario/${usuario.id}/editar`}
            className="absolute top-4 right-4 inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
            title="Editar perfil"
          >
            <FaRegEdit />
            Editar
          </Link>

          {/* Título con borde naranja */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-orange-500 pl-3">
            Mi Perfil
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Nombre</label>
                <p className="mt-1 text-lg text-gray-900">{usuario.nombre}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Apellido</label>
                <p className="mt-1 text-lg text-gray-900">{usuario.apellido}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">Email</label>
              <p className="mt-1 text-lg text-gray-900">{usuario.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">Celular</label>
              <p className="mt-1 text-lg text-gray-900">{usuario.celular || 'No especificado'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">Roles</label>
              <p className="mt-1 text-lg text-gray-900">{rolesTexto}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">Miembro desde</label>
              <p className="mt-1 text-lg text-gray-900">{formatDate(usuario.created_at)}</p>
            </div>
          </div>

          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <DireccionesManager readonly={true} />
          </div>
        </div>
      </div>
    </div>
  );
}