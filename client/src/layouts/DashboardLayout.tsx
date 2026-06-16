import { Outlet, useLocation } from 'react-router-dom';
import TopNav from '../components/TopNav';

export default function DashboardLayout() {
  const location = useLocation();
  const isOrderDetails = location.pathname.startsWith('/pedidos/') && location.pathname.split('/').length === 3;

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-200 font-sans">
      
      {/* HEADER PADRÃO (TOPNAV) */}
      <TopNav />

      {/* Main Content Area */}
      <main className={`max-w-7xl mx-auto px-1 sm:px-2 py-4 sm:py-8 ${isOrderDetails ? '' : 'min-h-[calc(100vh-140px)]'}`}>
        <Outlet />
      </main>

    </div>
  );
}
