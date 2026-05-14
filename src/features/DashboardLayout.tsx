import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function DashboardLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <div className="w-[85%] flex flex-col flex-1">
        <div className="w-full h-16 bg-white border-b border-gray-200 flex justify-end items-center px-8 shrink-0 shadow-sm z-40 relative">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-[#1D3557] text-white flex items-center justify-center font-bold text-sm">L</div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[#1D3557] font-bold text-sm leading-none mb-1">Lautaro</span>
              <span className="text-gray-400 text-[10px] font-bold tracking-wider uppercase">Administrador</span>
            </div>
          </div>
        </div>
        <main className="flex-1 overflow-y-auto bg-[#F1FAEE] p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
