import React, { useState, useEffect, useCallback } from 'react';
import { 
  Calendar, ChevronLeft, ChevronRight, User, 
  ClipboardList, CheckCircle2, Clock, Search, 
  MapPin, Ruler, Truck, Wrench, Box, Footprints, 
  Factory, Hammer, Filter, Plus, UserCheck
} from 'lucide-react';
import { api } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import AgendamentoModal from '../components/AgendamentoModal';

const getLocalDateString = (date: Date = new Date()) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export default function AgendaPage() {
  const navigate = useNavigate();
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(getLocalDateString());
  const [showAll, setShowAll] = useState(false);
  
  // Filtros
  const [responsavelFilter, setResponsavelFilter] = useState('');
  const [osFilter, setOsFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Opções para os filtros
  const [opcoes, setOpcoes] = useState<any>({ horas: [], ordens: [], funcionarios: [] });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAgendamento, setSelectedAgendamento] = useState<any>(null);

  const fetchAgendamentos = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/agendamentos', {
        params: {
          date: currentDate,
          show_all: showAll,
          responsavel: responsavelFilter,
          os: osFilter,
          status: statusFilter
        }
      });
      setAgendamentos(res.data);
    } catch (err) {
      console.error('Erro ao buscar agendamentos:', err);
    } finally {
      setLoading(false);
    }
  }, [currentDate, showAll, responsavelFilter, osFilter, statusFilter]);

  const fetchOptions = async () => {
    try {
      const res = await api.get('/agendamentos/opcoes');
      setOpcoes(res.data);
    } catch (err) {
      console.error('Erro ao buscar opções:', err);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  useEffect(() => {
    fetchAgendamentos();
  }, [fetchAgendamentos]);

  const handleDateChange = (days: number) => {
    const [year, month, day] = currentDate.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    d.setDate(d.getDate() + days);
    setCurrentDate(getLocalDateString(d));
    setShowAll(false);
  };

  const handleToggleStatus = async (id: number, currentStatus: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.post('/agendamentos/toggle-status', {
        id_agendamento: id,
        status: currentStatus === 1 ? 0 : 1
      });
      fetchAgendamentos();
    } catch (err) {
      console.error('Erro ao alternar status:', err);
    }
  };

  const getOSIcon = (osName: string) => {
    const name = (osName || '').toLowerCase();
    if (name.includes('medição') || name.includes('medicao')) return { icon: Ruler, color: 'text-indigo-400', bg: 'bg-indigo-400/10' };
    if (name.includes('entrega')) return { icon: Truck, color: 'text-emerald-400', bg: 'bg-emerald-400/10' };
    if (name.includes('instalação') || name.includes('instalacao')) return { icon: Wrench, color: 'text-amber-400', bg: 'bg-amber-400/10' };
    if (name.includes('retirada')) return { icon: Box, color: 'text-sky-400', bg: 'bg-sky-400/10' };
    if (name.includes('visita')) return { icon: Footprints, color: 'text-rose-400', bg: 'bg-rose-400/10' };
    if (name.includes('produção') || name.includes('producao')) return { icon: Factory, color: 'text-slate-400', bg: 'bg-slate-400/10' };
    if (name.includes('concerto') || name.includes('reparo')) return { icon: Hammer, color: 'text-orange-400', bg: 'bg-orange-400/10' };
    return { icon: ClipboardList, color: 'text-blue-400', bg: 'bg-blue-400/10' };
  };

  // Agrupar agendamentos por responsável
  const groupedAgendamentos = agendamentos.reduce((groups: any, ag: any) => {
    const resp = ag.responsavel_nome || 'Sem Responsável';
    if (!groups[resp]) groups[resp] = [];
    groups[resp].push(ag);
    return groups;
  }, {});

  const formatDateShort = (dateString: string) => {
    if (!dateString) return 'N/A';
    const [, month, day] = dateString.split('T')[0].split('-');
    return `${day}/${month}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3 italic tracking-tighter">
            <Calendar className="text-amber-400" size={32} /> AGENDA
          </h1>
          <p className="text-gray-400 mt-1 uppercase text-xs font-bold tracking-widest opacity-70">
            CONTROLE DE ORDENS E VISITAS TÉCNICAS
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => {
              setCurrentDate(getLocalDateString());
              setShowAll(false);
            }}
            className="px-6 py-2 bg-emerald-600/20 text-emerald-500 border border-emerald-500/30 rounded-lg font-bold hover:bg-emerald-600 hover:text-white transition-all shadow-lg shadow-emerald-500/10"
          >
            HOJE
          </button>
          <button 
            onClick={() => {
              setSelectedAgendamento(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20"
          >
            <Plus size={20} /> NOVO
          </button>
        </div>
      </div>

      {/* Navigation and Filters */}
      <div className="bg-gray-900/40 p-5 rounded-2xl border border-gray-800 backdrop-blur-sm space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center bg-gray-800 rounded-xl p-1 border border-gray-700">
            <button onClick={() => handleDateChange(-1)} className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition">
              <ChevronLeft size={20} />
            </button>
            <input 
              type="date" 
              className={`bg-transparent border-none text-white font-bold p-2 focus:ring-0 ${showAll ? 'opacity-30' : ''}`}
              value={currentDate}
              disabled={showAll}
              onChange={(e) => {
                setCurrentDate(e.target.value);
                setShowAll(false);
              }}
            />
            <button onClick={() => handleDateChange(1)} className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition">
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 flex-grow">
            <div className="relative flex-grow max-w-xs">
              <UserCheck size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <select 
                className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:border-amber-500 focus:outline-none transition-all appearance-none"
                value={responsavelFilter}
                onChange={e => setResponsavelFilter(e.target.value)}
              >
                <option value="">TODOS RESPONSÁVEIS</option>
                {opcoes.funcionarios.map((f: any) => (
                  <option key={f.id_funcionario} value={f.id_funcionario}>{f.nome.toUpperCase()}</option>
                ))}
              </select>
            </div>

            <div className="relative flex-grow max-w-xs">
              <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <select 
                className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:border-amber-500 focus:outline-none transition-all appearance-none"
                value={osFilter}
                onChange={e => setOsFilter(e.target.value)}
              >
                <option value="">TODAS ORDENS (OS)</option>
                {opcoes.ordens.map((o: any) => (
                  <option key={o.id} value={o.id}>{o.ordem.toUpperCase()}</option>
                ))}
              </select>
            </div>

            <select 
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-sm text-white focus:border-amber-500 focus:outline-none transition-all"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="">TODOS STATUS</option>
              <option value="0">PENDENTES</option>
              <option value="1">CONCLUÍDOS</option>
            </select>

            <button 
              onClick={() => setShowAll(!showAll)}
              className={`px-6 py-2 rounded-xl text-sm font-black tracking-widest transition-all ${
                showAll 
                  ? 'bg-amber-500 text-gray-900 shadow-lg shadow-amber-500/20' 
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              EXIBIR TUDO
            </button>
          </div>
        </div>
      </div>

      {/* Main List Area */}
      {loading ? (
        <div className="py-20 text-center space-y-4">
          <div className="inline-block w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-bold tracking-widest uppercase text-xs">Sincronizando agendamentos...</p>
        </div>
      ) : agendamentos.length === 0 ? (
        <div className="py-32 text-center bg-gray-900/20 rounded-3xl border-2 border-dashed border-gray-800">
          <Calendar className="mx-auto text-gray-700 mb-4" size={64} />
          <h3 className="text-xl font-bold text-gray-500">NADA AGENDADO</h3>
          <p className="text-gray-600 mt-2">Use os filtros acima ou crie um novo agendamento.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(groupedAgendamentos).map(([respName, list]: [string, any]) => (
            <div key={respName} className="space-y-4 animate-in slide-in-from-bottom-5 duration-700">
              <div className="flex items-center gap-3 border-b border-gray-800 pb-2 ml-1">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <UserCheck className="text-blue-400" size={20} />
                </div>
                <h2 className="text-lg font-black text-gray-300 tracking-tighter uppercase">{respName}</h2>
                <div className="h-[2px] flex-grow bg-gradient-to-r from-gray-800 to-transparent"></div>
                <span className="text-[10px] font-bold text-gray-600 bg-gray-800/50 px-2 py-1 rounded">
                  {list.length} {list.length === 1 ? 'ORDEM' : 'ORDENS'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {list.map((ag: any) => {
                  const OsIcon = getOSIcon(ag.ordem_nome);
                  const isDone = ag.status_agendamento === 1;

                  return (
                    <div 
                      key={ag.id_agendamento}
                      onClick={() => {
                        setSelectedAgendamento(ag);
                        setIsModalOpen(true);
                      }}
                      className={`group relative bg-gray-900/50 border border-gray-800 rounded-2xl hover:border-blue-500/50 hover:bg-gray-800/50 transition-all duration-300 cursor-pointer overflow-hidden ${isDone ? 'opacity-60 grayscale-[0.5]' : ''}`}
                    >
                      {/* Side color accent based on OS */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${OsIcon.bg.replace('/10', '')}`}></div>

                      <div className="p-5 flex gap-4">
                        <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${OsIcon.bg} ${OsIcon.color} group-hover:scale-110 transition-transform`}>
                          <OsIcon.icon size={28} />
                        </div>

                        <div className="flex-grow min-w-0 space-y-2">
                          <div className="flex justify-between items-start">
                            <h3 className="font-bold text-white text-base group-hover:text-amber-400 transition-colors truncate pr-8">
                              {ag.cliente_nome_pedido || 'CLIENTE S/N'}
                            </h3>
                            <button 
                              onClick={(e) => handleToggleStatus(ag.id_agendamento, ag.status_agendamento, e)}
                              className={`absolute right-4 top-4 p-1.5 rounded-full transition-all transform hover:scale-110 active:scale-95 ${isDone ? 'bg-green-500 text-white shadow-lg shadow-green-500/40 ring-2 ring-white/20' : 'text-gray-600 hover:text-green-500 hover:bg-green-500/10'}`}
                            >
                              <CheckCircle2 size={20} strokeWidth={3} />
                            </button>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-gray-400">
                            <div className="flex items-center gap-1">
                              <Calendar size={12} className="text-gray-500" />
                              {formatDateShort(ag.data_agendamento)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock size={12} className="text-gray-500" />
                              {ag.hora_agendamento_nome || 'N/A'}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin size={12} className="text-gray-500" />
                              {ag.bairro || 'CENTRO'}
                            </div>
                          </div>

                          <p className="text-xs text-gray-500 italic line-clamp-2 pt-1 border-t border-gray-800/50">
                            {ag.instrucao || 'Sem instruções adicionais.'}
                          </p>

                          <div className="flex items-center justify-between text-[10px] pt-1">
                            <span className={`font-black tracking-widest uppercase ${OsIcon.color}`}>
                              {ag.ordem_nome || 'ORDEM SERVIÇO'}
                            </span>
                            <span 
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/pedidos/${ag.id_pedido}`);
                              }}
                              className="text-blue-500 hover:underline cursor-pointer font-bold"
                            >
                              VER PEDIDO #{ag.id_pedido}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Integration */}
      <AgendamentoModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={() => fetchAgendamentos()}
        agendamento={selectedAgendamento}
      />
    </div>
  );
}
