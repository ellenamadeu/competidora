import { useState, useEffect } from 'react';
import { ShoppingCart, Search, Plus, Calendar, User, DollarSign, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import CreateOrderModal from '../components/CreateOrderModal';

interface Pedido {
  id_pedido: number;
  id_cliente: number;
  cliente_nome: string;
  cliente_bairro?: string;
  cliente_telefone?: string;
  cliente_telefone2?: string;
  cliente_telefone3?: string;
  cliente_endereco?: string;
  data_pedido: string;
  titulo: string;
  total: string;
  status: number;
}

const statusMap: Record<number, { label: string, color: string }> = {
  3: { label: 'Orçamento', color: 'bg-amber-500 text-gray-950 border-amber-500 shadow-sm' },
  4: { label: 'Produção', color: 'bg-blue-500 text-white border-blue-500 shadow-sm' },
  6: { label: 'Cobrança', color: 'bg-rose-500 text-white border-rose-500 shadow-sm' },
  5: { label: 'Concluído', color: 'bg-emerald-500 text-white border-emerald-500 shadow-sm' },
  7: { label: 'Baixado', color: 'bg-gray-600 text-white border-gray-600 shadow-sm' },
  // Fallbacks para legado
  1: { label: 'Aguardando Medição', color: 'bg-yellow-600 text-white border-yellow-600 shadow-sm' },
  2: { label: 'Em Produção', color: 'bg-blue-600 text-white border-blue-600 shadow-sm' },
  0: { label: 'Cancelado', color: 'bg-red-600 text-white border-red-600 shadow-sm' }
};

const statusBtnStyles: Record<number, { active: string, inactive: string }> = {
  3: { active: 'bg-amber-500 text-gray-950 border-amber-500 shadow-lg shadow-amber-500/20', inactive: 'bg-amber-500/10 text-amber-500 border-amber-500/30 hover:bg-amber-500/20' },
  4: { active: 'bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/20', inactive: 'bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20' },
  6: { active: 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/20', inactive: 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20' },
  5: { active: 'bg-green-500 text-white border-green-500 shadow-lg shadow-green-500/20', inactive: 'bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20' },
  7: { active: 'bg-gray-500 text-white border-gray-500 shadow-lg shadow-gray-500/20', inactive: 'bg-gray-500/10 text-gray-400 border-gray-500/30 hover:bg-gray-500/20' }
};

export default function OrdersPage() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(() => localStorage.getItem('last_search_orders') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(() => localStorage.getItem('last_search_orders') || '');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const ITEMS_PER_PAGE = 30;

  useEffect(() => {
    localStorage.setItem('last_search_orders', search);
  }, [search]);

  // Handle search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1); // Reset page to 1 when search changes
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset page to 1 when date or status changes
  useEffect(() => {
    setCurrentPage(1);
  }, [dateFilter, selectedStatus]);

  // Fetch orders when page or filters change
  useEffect(() => {
    fetchOrders();
  }, [currentPage, debouncedSearch, dateFilter, selectedStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/pedidos', {
        params: {
          q: debouncedSearch,
          status: selectedStatus !== null ? selectedStatus : undefined,
          date: dateFilter || undefined,
          page: currentPage,
          limit: ITEMS_PER_PAGE
        }
      });
      setPedidos(res.data.data);
      setTotalPages(res.data.meta.last_page);
      setTotalItems(res.data.meta.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (value: string | number) => {
    return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(value));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <ShoppingCart className="text-blue-500" size={32} /> Gestão de Pedidos
          </h1>
          <p className="text-gray-400 mt-1">Total de {totalItems.toLocaleString()} pedidos. Visualize e gerencie todos os pedidos da Competidora.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} /> Novo Pedido
        </button>
      </div>

      <div className="space-y-4">
        {/* Row 1: Search + Date */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input 
              type="text" 
              placeholder="Buscar por número, cliente, telefone, endereço ou bairro..." 
              className="input-field pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Calendar className="text-gray-500" size={20} />
            <input 
              type="date" 
              className="input-field w-full md:w-[200px]"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
            {dateFilter && (
              <button 
                onClick={() => setDateFilter('')}
                className="text-sm text-red-400 hover:text-red-300 font-semibold px-2"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Status buttons in a row */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-400 font-medium mr-2">Status:</span>
          <button
            onClick={() => setSelectedStatus(null)}
            translate="no"
            className={`notranslate px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all border ${
              selectedStatus === null 
                ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20' 
                : 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700'
            }`}
          >
            Todos
          </button>
          {Object.entries(statusBtnStyles).map(([statusKey, value]) => {
            const statusId = Number(statusKey);
            const isSelected = selectedStatus === statusId;
            const label = statusMap[statusId]?.label || 'Desconhecido';
            return (
              <button
                key={statusId}
                onClick={() => setSelectedStatus(statusId)}
                translate="no"
                className={`notranslate px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all border ${
                  isSelected ? value.active : value.inactive
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full card p-10 text-center text-gray-500 animate-pulse">Carregando pedidos...</div>
        ) : pedidos.length === 0 ? (
          <div className="col-span-full card p-10 text-center text-gray-500">Nenhum pedido encontrado.</div>
        ) : (
          pedidos.map((pedido: Pedido) => (
            <div 
              key={pedido.id_pedido} 
              onClick={() => navigate(`/pedidos/${pedido.id_pedido}`)}
              className="card p-5 space-y-4 cursor-pointer border border-gray-800 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 group"
            >
              <div className="flex justify-between items-center">
                <span className="font-mono text-blue-400 font-bold text-lg">{pedido.id_pedido}</span>
                <span 
                  translate="no"
                  className={`notranslate px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${statusMap[pedido.status]?.color || 'bg-gray-500 text-white border-gray-500'}`}
                >
                  {statusMap[pedido.status]?.label || 'Desconhecido'}
                </span>
              </div>
              
              <div className="text-center">
                <h3 className="text-white font-normal text-lg group-hover:text-blue-400 transition-colors line-clamp-1">{pedido.titulo || 'Sem Título'}</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <User size={18} className="text-gray-500 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-white font-bold text-base leading-tight truncate">
                      {pedido.cliente_nome || 'Consumidor'}
                    </p>
                    {pedido.cliente_bairro && (
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1 font-normal">
                        <MapPin size={12} className="flex-shrink-0" />
                        <span className="truncate">{pedido.cliente_bairro}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-800/80">
                <div className="flex items-center gap-1 font-bold text-white text-lg">
                  <DollarSign size={16} className="text-green-500" />
                  {formatNumber(pedido.total)}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Calendar size={12} />
                  <span>{formatDate(pedido.data_pedido)}</span>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="col-span-full flex items-center justify-center gap-4 mt-6 pt-6 border-t border-gray-800">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="btn-secondary px-4 py-2 disabled:opacity-40 disabled:hover:bg-gray-700 transition"
            >
              Anterior
            </button>
            <span className="text-sm font-semibold text-gray-400">
              Página <span className="text-white font-bold">{currentPage}</span> de <span className="text-white font-bold">{totalPages}</span>
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="btn-secondary px-4 py-2 disabled:opacity-40 disabled:hover:bg-gray-700 transition"
            >
              Próxima
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <CreateOrderModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={fetchOrders} 
        />
      )}
    </div>
  );
}
