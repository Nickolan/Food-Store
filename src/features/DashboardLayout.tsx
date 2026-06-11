import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function DashboardLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <div className="w-[85%] flex flex-col flex-1">
        
        <main className="flex-1 overflow-y-auto bg-orange-50 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
