import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Package, 
  Tags, 
  ShoppingCart, 
  CalendarDays, 
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2
} from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  const stats = [
    { label: 'Vendas Hoje', value: 'R$ 1.240,00', icon: TrendingUp, color: 'text-green-400' },
    { label: 'Pedidos Pendentes', value: '8', icon: Clock, color: 'text-amber-400' },
    { label: 'Concluídos', value: '24', icon: CheckCircle2, color: 'text-blue-400' },
  ];

  const modules = [
    { 
      title: 'Clientes', 
      description: 'Gerencie sua base de clientes e contatos do Google.', 
      icon: Users, 
      path: '/clientes',
      color: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    },
    { 
      title: 'Produtos', 
      description: 'Catálogo de produtos, preços e controle de estoque.', 
      icon: Package, 
      path: '/produtos',
      color: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    },
    { 
      title: 'Categorias', 
      description: 'Organize seus produtos em uma árvore hierárquica.', 
      icon: Tags, 
      path: '/categorias',
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    },
    { 
      title: 'Pedidos', 
      description: 'Acompanhe as vendas e orçamentos em tempo real.', 
      icon: ShoppingCart, 
      path: '/pedidos',
      color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      isStub: true
    },
    { 
      title: 'Agenda', 
      description: 'Calendário de instalações e compromissos.', 
      icon: CalendarDays, 
      path: '/agenda',
      color: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      isStub: true
    }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 p-8 sm:p-12 shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Bem-vindo ao <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">Novo Painel</span>
          </h1>
          <p className="text-lg text-gray-400 mb-8 leading-relaxed">
            Estamos migrando para uma nova arquitetura mais veloz e moderna. 
            Suas principais ferramentas de gestão já estão prontas para serem usadas.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => navigate('/clientes')}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 transform hover:scale-105 active:scale-95"
            >
              Começar agora <ArrowRight size={20} />
            </button>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-600/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-emerald-600/10 blur-[80px] rounded-full"></div>
      </section>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="card p-6 flex items-center gap-4 hover:border-gray-600 transition-colors">
            <div className={`p-4 rounded-xl bg-gray-800 border border-gray-700 ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modules Grid */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Módulos do Sistema
          </h2>
          <span className="h-px flex-grow bg-gray-800 ml-6 hidden sm:block"></span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod, i) => (
            <div 
              key={i} 
              onClick={() => navigate(mod.path)}
              className="card group cursor-pointer hover:border-blue-500/40 transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-3 rounded-xl border ${mod.color}`}>
                    <mod.icon size={24} />
                  </div>
                  {mod.isStub && (
                    <span className="px-2 py-1 rounded-md bg-gray-800 border border-gray-700 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                      Em Breve
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {mod.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {mod.description}
                </p>
                <div className="flex items-center text-sm font-bold text-blue-400 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all">
                  Acessar módulo <ArrowRight size={16} className="ml-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
