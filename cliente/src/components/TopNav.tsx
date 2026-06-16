import { useState, useRef, useEffect } from 'react';
import { 
  Home, Users, ShoppingCart, Calendar, 
  Wallet, TrendingDown, Truck, Briefcase, 
  LogOut, MoreHorizontal, Package
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logoImg from '../assets/logo.png';

const navItems = [
  { name: 'INÍCIO', icon: Home, path: '/', color: 'text-emerald-500', bg: 'bg-emerald-500/10', hoverBg: 'hover:bg-emerald-500/20' },
  { name: 'CLIENTES', icon: Users, path: '/clientes', color: 'text-indigo-400', bg: 'bg-indigo-400/10', hoverBg: 'hover:bg-indigo-400/20' },
  { name: 'PEDIDOS', icon: ShoppingCart, path: '/pedidos', color: 'text-blue-500', bg: 'bg-blue-500/10', hoverBg: 'hover:bg-blue-500/20' },
  { name: 'AGENDA', icon: Calendar, path: '/agenda', color: 'text-amber-400', bg: 'bg-amber-400/10', hoverBg: 'hover:bg-amber-400/20' },
  { name: 'CAIXA', icon: Wallet, path: '/caixa', color: 'text-rose-400', bg: 'bg-rose-400/10', hoverBg: 'hover:bg-rose-400/20' },
  { name: 'DESP.', icon: TrendingDown, path: '/despesas', color: 'text-cyan-400', bg: 'bg-cyan-400/10', hoverBg: 'hover:bg-cyan-400/20' },
  { name: 'FORN.', icon: Truck, path: '/fornecedores', color: 'text-orange-400', bg: 'bg-orange-400/10', hoverBg: 'hover:bg-orange-400/20' },
  { name: 'STAFF', icon: Briefcase, path: '/funcionarios', color: 'text-violet-400', bg: 'bg-violet-400/10', hoverBg: 'hover:bg-violet-400/20' },
  { name: 'PRODUTOS', icon: Package, path: '/produtos', color: 'text-blue-400', bg: 'bg-blue-400/10', hoverBg: 'hover:bg-blue-400/20' },
];

export default function TopNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const [userName, setUserName] = useState('');
  const [userLevel, setUserLevel] = useState(0);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setShowMore(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Busca as informações do usuário logado
  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const u = JSON.parse(userJson);
        setUserName(u.nome || u.login || 'Usuário');
        setUserLevel(Number(u.acesso || 0));
      } catch (e) {
        setUserName('Usuário');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login', { replace: true });
  };

  // Filtra as abas restritas (Caixa e Staff) se o usuário não for Nível 2
  const filteredNavItems = navItems.filter(item => {
    if (item.path === '/caixa' || item.path === '/funcionarios') {
      return userLevel >= 2;
    }
    return true;
  });

  const visibleCount = 4; // Base mobile
  const visibleItems = filteredNavItems.slice(0, visibleCount);
  const moreItems = filteredNavItems.slice(visibleCount);
  
  // Para telas médias (md) mas não LG
  const mdVisibleItems = filteredNavItems.slice(0, 6);
  const mdMoreItems = filteredNavItems.slice(6);

  return (
    <nav className="z-50 shadow-lg mb-2">
      {/* Top bar with logo and user info */}
      <div className="bg-black border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-1 sm:px-2 flex justify-between items-center h-14">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 group">
              <img src={logoImg} className="h-9 w-auto object-contain" alt="Competidora" />
              <div className="bg-blue-500/10 text-blue-500 text-[10px] font-bold px-1.5 py-0.5 rounded border border-blue-500/20">V2.1</div>
            </Link>
          </div>
          <div className="flex items-center gap-5 text-sm text-gray-400">
            <span className="hidden sm:inline">Olá, <span className="text-white font-bold ml-1">{userName}</span></span>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 hover:text-red-400 transition-all px-2 py-1 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/20 group"
            >
              <LogOut size={16} className="text-red-500 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-xs">SAIR</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Icons */}
      <div className="bg-[#0b0f19] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-1 sm:px-2 flex justify-center py-3">
          {/* Desktop Only (LG+): Show all */}
          <div className="hidden lg:flex gap-4 xl:gap-8 overflow-x-auto no-scrollbar">
            {filteredNavItems.map((item) => {
              const isActive = location.pathname === item.path || 
                               (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <NavItem key={item.path} item={item} isActive={isActive} />
              )
            })}
          </div>

          {/* Medium Screens (MD only until LG): Show 6 + More */}
          <div className="hidden md:flex lg:hidden gap-6 justify-center items-center">
            {mdVisibleItems.map((item) => {
              const isActive = location.pathname === item.path || 
                               (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <NavItem key={item.path} item={item} isActive={isActive} />
              )
            })}
            <MoreMenu items={mdMoreItems} show={showMore} setShow={setShowMore} moreRef={moreRef} location={location} />
          </div>

          {/* Mobile Screens (up to MD): Show 4 + More */}
          <div className="flex md:hidden gap-1.5 sm:gap-4 justify-center items-center">
            {visibleItems.map((item) => {
              const isActive = location.pathname === item.path || 
                               (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <NavItem key={item.path} item={item} isActive={isActive} />
              )
            })}
            <MoreMenu items={moreItems} show={showMore} setShow={setShowMore} moreRef={moreRef} location={location} />
          </div>
        </div>
      </div>
    </nav>
  );
}

function MoreMenu({ items, show, setShow, moreRef, location }: any) {
  return (
    <div className="relative" ref={moreRef}>
      <button 
        onClick={() => setShow(!show)}
        className={`flex flex-col items-center gap-1 min-w-[50px] transition-all group ${
          show ? 'text-blue-400' : 'text-gray-400 hover:text-white'
        }`}
      >
        <div className={`p-2.5 rounded-xl transition-all border-2 ${show ? 'bg-blue-400/20 scale-110 shadow-lg shadow-blue-400/20 border-blue-500/60' : 'border-transparent group-hover:bg-gray-800'}`}>
          <MoreHorizontal size={26} />
        </div>
        <span className="text-[10px] font-black tracking-widest uppercase opacity-80 group-hover:opacity-100">MAIS</span>
      </button>

      {show && (
        <div className="absolute right-0 mt-3 w-56 bg-[#111827] border border-gray-800 rounded-2xl shadow-2xl z-50 py-3 animate-in fade-in zoom-in-95 duration-200 backdrop-blur-xl">
          <div className="px-4 py-2 border-b border-gray-800 mb-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Outros Atalhos</span>
          </div>
          {items.map((item: any) => {
            const isActive = location.pathname === item.path || 
                             (item.path !== '/' && location.pathname.startsWith(item.path));
            const cName = item.color.split('-')[1];
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setShow(false)}
                className={`flex items-center gap-4 px-4 py-3.5 transition-all mx-2 rounded-xl mb-1 border-2 ${
                  isActive 
                    ? `${item.bg} ${item.color} font-bold shadow-lg shadow-${cName}-500/10 border-${cName}-500/40` 
                    : `text-gray-400 border-transparent hover:bg-white/5 hover:text-white`
                }`}
              >
                <div className={`${isActive ? '' : 'p-1'}`}>
                  <item.icon size={20} />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-widest">{item.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function NavItem({ item, isActive }: { item: any, isActive: boolean }) {
  const colorName = item.color.split('-')[1]; // e.g. blue, emerald, indigo
  
  return (
    <Link 
      to={item.path}
      className={`flex flex-col items-center gap-1.5 group transition-all min-w-[55px] sm:min-w-[75px] ${
        isActive ? item.color : 'text-gray-400 hover:text-white'
      }`}
    >
      <div className={`p-2.5 rounded-xl transition-all duration-300 border-2 ${
        isActive 
          ? `${item.bg} scale-110 shadow-lg shadow-${colorName}-500/20 border-${colorName}-500/60` 
          : `border-transparent ${item.hoverBg} group-hover:scale-105 active:scale-95 group-hover:border-gray-700/50`
      }`}>
        <item.icon size={26} className={isActive ? item.color : 'text-gray-400 group-hover:text-white transition-colors'} />
      </div>
      <span className={`text-[10px] sm:text-[11px] font-black tracking-widest uppercase transition-colors ${isActive ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`}>
        {item.name}
      </span>
      <div className={`h-1 w-full max-w-[30px] rounded-full transition-all duration-300 ${
        isActive ? `${item.color.replace('text-', 'bg-')} scale-x-100 opacity-100 shadow-[0_0_10px_rgba(59,130,246,0.5)]` : 'bg-transparent scale-x-0 opacity-0'
      }`} />
    </Link>
  );
}
