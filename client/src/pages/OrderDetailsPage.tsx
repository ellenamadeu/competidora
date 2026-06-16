import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  User, MapPin, Phone, Calendar, 
  DollarSign, Package, Plus, ChevronLeft, 
  Clock, CheckCircle2, AlertCircle, FileText,
  Edit2, Trash2, Send, ExternalLink, Save,
  Ruler, FileInput, Factory, CreditCard, Archive, 
  Settings, Mail, Image
} from 'lucide-react';
import { api } from '../lib/api';
import { formatWhatsAppLink } from '../lib/wa';
import AddOrderItemModal from '../components/AddOrderItemModal';
import AddPaymentModal from '../components/AddPaymentModal';
import AgendamentoModal from '../components/AgendamentoModal';

// Mapeamento de Status para Ícones (Baseado no PHP)
const statusOptions = [
  { id: 3, name: 'Orçamento', icon: FileInput, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  { id: 4, name: 'Produção', icon: Factory, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { id: 6, name: 'Cobrança', icon: CreditCard, color: 'text-rose-400', bg: 'bg-rose-400/10' },
  { id: 5, name: 'Concluído', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { id: 7, name: 'Baixado', icon: Archive, color: 'text-gray-400', bg: 'bg-gray-400/10' },
];

const getStatusConfigById = (statusId: number | null | undefined) => {
  const option = statusOptions.find(o => o.id === statusId);
  if (option) return option;

  // Fallbacks para legado no banco de dados
  if (statusId === 1) return { id: 1, name: 'Aguardando Medição', icon: Plus, color: 'text-yellow-500/70', bg: 'bg-yellow-500/5' };
  if (statusId === 2) return { id: 2, name: 'Em Produção (legado)', icon: Ruler, color: 'text-indigo-500/70', bg: 'bg-indigo-500/5' };
  if (statusId === 0) return { id: 0, name: 'Cancelado', icon: AlertCircle, color: 'text-red-500/70', bg: 'bg-red-500/5' };

  return { id: 3, name: 'Orçamento', icon: FileInput, color: 'text-amber-400', bg: 'bg-amber-400/10' };
};

export default function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isReadOnly = Number(id) <= 50656;
  const [pedido, setPedido] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isEditingDiscount, setIsEditingDiscount] = useState(false);
  const [discountInput, setDiscountInput] = useState('0.00');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<any>(null);
  const [isAgendamentoModalOpen, setIsAgendamentoModalOpen] = useState(false);
  const [editingAgendamento, setEditingAgendamento] = useState<any>(null);
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [deliveryMethods, setDeliveryMethods] = useState<any[]>([]);
  const [isSavingDebounced, setIsSavingDebounced] = useState(false);

  // Estados dos campos de orçamento
  const [budgetFields, setBudgetFields] = useState({
    prazo: '',
    entrega: '',
    parcelamento: '',
    descontopix: '',
    observacoes: '',
    titulo: ''
  });

  // Estado para o modal de status
  const [statusUpdateFields, setStatusUpdateFields] = useState({
    status: 1,
    titulo: ''
  });

  const fetchPedido = async () => {
    try {
      const res = await api.get(`/pedidos/${id}`);
      console.log('PEDIDO DATA FETCHED:', res.data);
      setPedido(res.data);
      setDiscountInput(res.data.desconto?.toString() || '0.00');
      setBudgetFields({
        prazo: res.data.prazo?.toString() || '',
        entrega: res.data.entrega?.toString() || '',
        parcelamento: res.data.parcelamento?.toString() || '',
        descontopix: res.data.descontopix || '',
        observacoes: res.data.observacoes || '',
        titulo: res.data.titulo || ''
      });
      setStatusUpdateFields({
        status: [3, 4, 5, 6, 7].includes(res.data.status) ? res.data.status : 3,
        titulo: res.data.titulo || ''
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgendamentos = async () => {
    try {
      const res = await api.get(`/agendamentos/pedido/${id}`);
      setAgendamentos(res.data);
    } catch (err) {
      console.error('Erro ao buscar agendamentos:', err);
    }
  };
  
  const fetchDeliveryMethods = async () => {
    try {
      const res = await api.get('/pedidos/config/entregas');
      setDeliveryMethods(res.data);
    } catch (err) {
      console.error('Erro ao buscar formas de entrega:', err);
    }
  };

  const handleToggleAgendamentoStatus = async (e: React.MouseEvent, ag: any) => {
    e.stopPropagation();
    try {
      const newStatus = ag.status_agendamento === 1 ? 0 : 1;
      await api.post('/agendamentos/toggle-status', {
        id_agendamento: ag.id_agendamento,
        status: newStatus
      });
      fetchAgendamentos();
    } catch (err) {
      console.error('Erro ao alternar status do agendamento:', err);
      alert('Erro ao atualizar status.');
    }
  };

  useEffect(() => {
    fetchPedido();
    fetchAgendamentos();
    fetchDeliveryMethods();
  }, [id]);

  // Debounced auto-save for budget fields
  useEffect(() => {
    if (loading || !pedido || isReadOnly) return;

    // Comparar se houve mudança real (evita loop infinito com fetchPedido)
    const hasChanged = 
      budgetFields.prazo !== (pedido.prazo?.toString() || '') ||
      budgetFields.entrega !== (pedido.entrega?.toString() || '') ||
      budgetFields.parcelamento !== (pedido.parcelamento?.toString() || '') ||
      budgetFields.descontopix !== (pedido.descontopix || '') ||
      budgetFields.observacoes !== (pedido.observacoes || '');

    if (!hasChanged) return;

    const timeoutId = setTimeout(async () => {
      try {
        setIsSavingDebounced(true);
        await api.put(`/pedidos/${id}`, {
          prazo: budgetFields.prazo || null,
          entrega: budgetFields.entrega || null,
          parcelamento: budgetFields.parcelamento || null,
          descontopix: budgetFields.descontopix,
          observacoes: budgetFields.observacoes
        });
        // Atualiza o estado local do pedido para o hasChanged ser falso na próxima execução
        setPedido((prev: any) => ({
          ...prev,
          ...budgetFields
        }));
      } catch (err) {
        console.error('Erro ao salvar campos de orçamento:', err);
      } finally {
        setIsSavingDebounced(false);
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [budgetFields, loading, pedido, id]);

  const handleUpdateStatus = async () => {
    try {
      setIsSaving(true);
      const targetUrl = `http://localhost:3000/api/pedidos/${id}`;
      console.log(`[DEBUG] Calling update: PUT ${targetUrl}`, {
        status: statusUpdateFields.status,
        titulo: statusUpdateFields.titulo || null
      });
      await api.put(`/pedidos/${id}`, {
        status: statusUpdateFields.status,
        titulo: statusUpdateFields.titulo || null // Permitir vazio
      });
      setIsStatusModalOpen(false);
      fetchPedido();
    } catch (err: any) {
      console.error(err);
      const errorMsg = err.response?.data?.error || err.message || 'Erro desconhecido';
      alert('Erro ao atualizar status/título: ' + errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDiscount = async () => {
    try {
      setIsSaving(true);
      const val = parseFloat(discountInput.replace(',', '.'));
      await api.put(`/pedidos/${id}`, { desconto: val });
      setIsEditingDiscount(false);
      fetchPedido();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar desconto.');
    } finally {
      setIsSaving(false);
    }
  };


  const handleDeleteItem = async (itemId: number) => {
    if (!window.confirm('Deseja realmente excluir este item?')) return;
    try {
      await api.delete(`/pedidos/${id}/itens/${itemId}`);
      fetchPedido();
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir item.');
    }
  };

  const handleDeletePayment = async (paymentId: number) => {
    if (!window.confirm('Deseja realmente remover este pagamento?')) return;
    try {
      setLoading(true);
      await api.delete(`/pedidos/${id}/pagamentos/${paymentId}`);
      fetchPedido();
    } catch (err) {
      console.error(err);
      alert('Erro ao remover pagamento.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!pedido) {
    return (
      <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col items-center justify-center gap-4">
        <AlertCircle size={48} className="text-red-500" />
        <p>Pedido não encontrado.</p>
        <button onClick={() => navigate('/pedidos')} className="text-blue-500 hover:underline flex items-center gap-2">
          <ChevronLeft size={16} /> Voltar para lista
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-200 relative">

      <main className="max-w-7xl mx-auto px-0.5 sm:px-1 py-8 space-y-6">
        {isReadOnly && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-center gap-3 text-amber-400 shadow-lg animate-in fade-in duration-300">
            <AlertCircle size={20} className="flex-shrink-0" />
            <div className="text-sm font-semibold">
              Este é um pedido legado (ID ≤ 50656) e está em modo somente leitura (visualização).
            </div>
          </div>
        )}

        {/* Título e Botão Voltar */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <h1 className="text-2xl font-bold text-white">
            Pedido {pedido.id_pedido} {pedido.titulo ? `- ${pedido.titulo}` : ''}
          </h1>
          <button onClick={() => navigate('/pedidos')} className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg transition-colors">
            <ChevronLeft size={20} />
          </button>
        </div>

        {/* Bloco 1: Status Grande e Data (Clicável para editar se não for somente leitura) */}
        <button 
          onClick={() => {
            if (isReadOnly) return;
            setStatusUpdateFields({
              status: [3, 4, 5, 6, 7].includes(pedido.status) ? pedido.status : 3,
              titulo: pedido.titulo || ''
            });
            setIsStatusModalOpen(true);
          }}
          disabled={isReadOnly}
          className={`w-full bg-[#111827] border border-gray-800 p-4 rounded-xl flex items-center justify-between shadow-lg text-left group ${isReadOnly ? 'cursor-default' : 'hover:bg-white/5 transition-all'}`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-xl ${getStatusConfigById(pedido.status).bg} flex items-center justify-center transition-transform ${isReadOnly ? '' : 'group-hover:scale-110'}`}>
              {(() => {
                const Icon = getStatusConfigById(pedido.status).icon;
                const color = getStatusConfigById(pedido.status).color;
                return <Icon size={36} className={color} />;
              })()}
            </div>
            <div>
              <span className="text-xs text-gray-400 uppercase tracking-widest font-bold flex items-center gap-1">
                Status do Pedido {!isReadOnly && <Edit2 size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
              </span>
              <h2 translate="no" className="notranslate text-2xl font-bold text-white">{getStatusConfigById(pedido.status).name}</h2>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">Data do Pedido</span>
            <p className="text-lg font-semibold text-white">
              {new Date(pedido.data_pedido).toLocaleDateString()}
            </p>
          </div>
        </button>

        {/* Bloco 2: Dados do Cliente */}
        <div className="bg-[#111827] border border-gray-800 p-6 rounded-xl space-y-4 shadow-lg animate-in slide-in-from-left-4 duration-500">
          <div className="flex justify-between items-center border-b border-gray-800 pb-2">
            <h3 className="text-lg font-bold text-gray-200 flex items-center gap-2 uppercase tracking-widest text-[13px]">
              <User size={18} className="text-blue-500" /> Dados do Cliente
            </h3>
            {pedido.cliente?.id_cliente && (
              <Link 
                to={`/clientes/${pedido.cliente.id_cliente}`}
                className="text-xs font-bold text-blue-500 hover:text-blue-400 flex items-center gap-1 transition-colors bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20"
              >
                VER FICHA COMPLETA <ChevronLeft size={14} className="rotate-180" />
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="group">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-1">Nome / Razão Social</span>
                <Link 
                  to={`/clientes/${pedido.cliente?.id_cliente}`}
                  className="inline-block text-3xl font-black text-blue-400 hover:text-blue-300 transition-all leading-tight drop-shadow-[0_0_20px_rgba(96,165,250,0.3)] hover:scale-[1.02] active:scale-95"
                >
                  {pedido.cliente?.nome || 'NÃO INFORMADO'}
                </Link>
                {pedido.cliente?.contato && (
                  <p className="text-xs text-gray-400 font-medium italic mt-2 flex items-center gap-1">
                    <span className="opacity-50">Contato:</span> {pedido.cliente.contato}
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[pedido.cliente?.telefone, pedido.cliente?.telefone2, pedido.cliente?.telefone3]
                  .filter(Boolean)
                  .map((tel, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-gray-900/40 p-3 rounded-xl border border-gray-800/50 hover:border-emerald-500/30 transition-colors group">
                      <div className="flex items-center gap-3">
                        <Phone size={18} className="text-gray-500 group-hover:text-emerald-500 transition-colors" />
                        <span className="font-bold text-gray-200">{tel}</span>
                      </div>
                      <a 
                        href={formatWhatsAppLink(tel, pedido.cliente?.ddd) || '#'} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white p-2 rounded-lg transition-all shadow-lg shadow-emerald-500/5"
                        title="Enviar WhatsApp"
                      >
                        <Send size={16} />
                      </a>
                    </div>
                ))}
              </div>

              {pedido.cliente?.email && (
                <div className="flex items-center gap-3 bg-gray-900/40 p-3 rounded-xl border border-gray-800/50 hover:border-blue-500/30 transition-colors group">
                  <Mail size={18} className="text-gray-500 group-hover:text-blue-500 transition-colors" />
                  <a href={`mailto:${pedido.cliente.email}`} className="text-blue-400 font-bold hover:underline break-all">{pedido.cliente.email}</a>
                </div>
              )}
            </div>

            <div className="bg-gray-900/60 p-5 rounded-2xl border border-gray-800/50 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full"></div>
              <div className="relative space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-500">
                    <MapPin size={24} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter block mb-1">Localização Principal</span>
                    <p className="text-white text-base leading-snug font-bold">
                      {pedido.cliente?.endereco || 'Endereço não cadastrado'}
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
                      {pedido.cliente?.bairro && (
                        <p className="text-sm text-gray-400 flex items-center gap-1">
                          <span className="text-[10px] uppercase opacity-50 font-bold">Bairro:</span> 
                          <span className="font-semibold text-gray-300">{pedido.cliente.bairro}</span>
                        </p>
                      )}
                      {pedido.cliente?.cep && (
                        <p className="text-sm text-gray-400 flex items-center gap-1">
                          <span className="text-[10px] uppercase opacity-50 font-bold">CEP:</span>
                          <span className="font-semibold text-gray-300">{pedido.cliente.cep}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${pedido.cliente?.endereco || ''} ${pedido.cliente?.bairro || ''} ${pedido.cliente?.cep || ''}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-4 bg-gray-800 hover:bg-blue-600 text-white p-3 rounded-xl transition-all flex items-center justify-center gap-2 font-bold text-sm shadow-xl group/btn border border-gray-700 hover:border-blue-500"
                >
                  <ExternalLink size={18} className="group-hover/btn:scale-110 transition-transform" />
                  ABRIR NO GOOGLE MAPS
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bloco 3: Itens do Pedido */}
        <div className="bg-[#111827] border border-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center border-b border-gray-800 pb-2 mb-4">
            <h3 className="text-lg font-bold text-gray-200 flex items-center gap-2">
              <Package size={18} className="text-blue-500" /> Itens do Pedido
            </h3>
            {!isReadOnly && (
              <button 
                onClick={() => {
                  setEditingItem(null);
                  setIsModalOpen(true);
                }}
                className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-bold"
              >
                <Plus size={16} /> ADICIONAR
              </button>
            )}
          </div>

          <div className="overflow-x-auto hidden md:block">
            <table className="w-full text-left">
              <thead className="text-[10px] text-gray-500 uppercase bg-gray-800/30 border-b border-gray-800">
                <tr>
                  <th className="px-4 py-3 font-black tracking-widest text-left">PRODUTO</th>
                  <th className="px-4 py-3 font-black tracking-widest text-center">MEDIDAS</th>
                  <th className="px-4 py-3 font-black tracking-widest text-center">QT</th>
                  <th className="px-4 py-3 font-black tracking-widest text-right">V. UNIT</th>
                  <th className="px-4 py-3 font-black tracking-widest text-right">TOTAL</th>
                  {!isReadOnly && <th className="px-4 py-3"></th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                 {pedido.itens?.map((item: any) => (
                  <tr key={item.id_item} className={`border-b border-gray-800/50 last:border-0 ${isReadOnly ? '' : 'group hover:bg-white/5 transition-colors'}`}>
                    <td className="px-4 py-3">
                      {isReadOnly ? (
                        <div className="text-left w-full py-1 flex items-center gap-3">
                          {/* Imagem do Produto */}
                          <div className="w-10 h-10 rounded bg-gray-800 overflow-hidden flex-shrink-0 border border-gray-700/60 flex items-center justify-center text-gray-600">
                            {item.produto_imagem ? (
                              <img 
                                src={`${api.defaults.baseURL?.replace('/api', '')}${item.produto_imagem}`} 
                                alt={item.produto_nome} 
                                className="w-full h-full object-cover" 
                              />
                            ) : (
                              <Image size={16} className="opacity-40" />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-gray-100 uppercase text-[13px] leading-tight whitespace-pre-wrap">
                              {item.produto_nome || item.produto_sc || 'Produto Custom'}
                            </div>
                            
                            {/* Variações */}
                            {item.variacoes && (
                               <div className="text-[11px] text-gray-300 font-medium leading-none mt-1">
                                  {Object.entries(typeof item.variacoes === 'string' ? JSON.parse(item.variacoes) : item.variacoes).map(([group, v]: any, idx) => (
                                    <span key={idx}>{idx > 0 && ' | '}<span className="text-gray-500 font-bold">{group}:</span> {v.opcao}</span>
                                  ))}
                               </div>
                            )}

                            {item.observacoes && (
                              <div className="text-[10px] text-gray-400 italic mt-1.5 max-w-sm truncate border-l border-gray-700 pl-2">
                                {item.observacoes}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <button 
                          onClick={() => {
                            setEditingItem(item);
                            setIsModalOpen(true);
                          }}
                          className="text-left w-full group/desc py-1 flex items-center gap-3"
                        >
                          {/* Imagem do Produto */}
                          <div className="w-10 h-10 rounded bg-gray-800 overflow-hidden flex-shrink-0 border border-gray-700/60 flex items-center justify-center text-gray-600">
                            {item.produto_imagem ? (
                              <img 
                                src={`${api.defaults.baseURL?.replace('/api', '')}${item.produto_imagem}`} 
                                alt={item.produto_nome} 
                                className="w-full h-full object-cover" 
                              />
                            ) : (
                              <Image size={16} className="opacity-40" />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-gray-100 group-hover/desc:text-blue-400 transition-colors uppercase text-[13px] leading-tight whitespace-pre-wrap">
                              {item.produto_nome || item.produto_sc || 'Produto Custom'}
                            </div>
                            
                            {/* Variações */}
                            {item.variacoes && (
                               <div className="text-[11px] text-gray-300 font-medium leading-none mt-1">
                                  {Object.entries(typeof item.variacoes === 'string' ? JSON.parse(item.variacoes) : item.variacoes).map(([group, v]: any, idx) => (
                                    <span key={idx}>{idx > 0 && ' | '}<span className="text-gray-500 font-bold">{group}:</span> {v.opcao}</span>
                                  ))}
                               </div>
                            )}

                            {item.observacoes && (
                              <div className="text-[10px] text-gray-400 italic mt-1.5 max-w-sm truncate border-l border-gray-700 pl-2">
                                {item.observacoes}
                              </div>
                            )}
                          </div>
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="text-xs text-gray-400 font-bold leading-tight">
                        {isReadOnly ? (
                          <>
                            {item.altura} x {item.largura}
                            {item.comprimento && Number(item.comprimento) > 0 && (
                              <div className="text-blue-500/50 text-[10px]">
                                x {item.comprimento}
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            {Number(item.altura).toFixed(3)} x {Number(item.largura).toFixed(3)}
                            {item.comprimento && Number(item.comprimento) > 0 && (
                              <div className="text-blue-500/50 text-[10px]">
                                x {Number(item.comprimento).toFixed(3)}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-sm text-gray-200">
                      {Number(item.quantidade).toFixed(0)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-300">
                      {Number(item.valor_unitario || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-right font-black text-sm text-white">
                      {Number(item.valor_total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    {!isReadOnly && (
                      <td className="px-4 py-3">
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                          <button 
                            onClick={() => handleDeleteItem(item.id_item)}
                            className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Excluir"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Versão Mobile (Card-Based) */}
          <div className="md:hidden space-y-4">
            {pedido.itens?.map((item: any) => (
              <div key={item.id_item} className="bg-gray-900/40 border border-gray-800 rounded-2xl p-4 space-y-3 overflow-hidden">
                {/* Header: Produto e Ações */}
                <div className="flex justify-between items-start gap-3">
                  {isReadOnly ? (
                    <div className="flex-1 min-w-0 text-left flex items-start gap-3">
                      {/* Imagem do Produto */}
                      <div className="w-10 h-10 rounded bg-gray-800 overflow-hidden flex-shrink-0 border border-gray-700/60 flex items-center justify-center text-gray-600">
                        {item.produto_imagem ? (
                          <img 
                            src={`${api.defaults.baseURL?.replace('/api', '')}${item.produto_imagem}`} 
                            alt={item.produto_nome} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <Image size={16} className="opacity-40" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-gray-100 uppercase text-[12px] leading-tight flex items-start gap-1.5 mb-1 flex-wrap">
                          <span className="whitespace-pre-wrap">{item.produto_nome || item.produto_sc || 'Produto Custom'}</span>
                        </div>
                        {item.variacoes && (
                          <div className="text-[10px] text-gray-400 font-medium leading-tight flex flex-wrap gap-1">
                            {Object.entries(typeof item.variacoes === 'string' ? JSON.parse(item.variacoes) : item.variacoes).map(([_, v]: any, idx) => (
                              <span key={idx} className="bg-white/5 px-1.5 rounded">
                                {v.opcao}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingItem(item);
                        setIsModalOpen(true);
                      }}
                      className="flex-1 min-w-0 text-left flex items-start gap-3 group/item-mob"
                    >
                      {/* Imagem do Produto */}
                      <div className="w-10 h-10 rounded bg-gray-800 overflow-hidden flex-shrink-0 border border-gray-700/60 flex items-center justify-center text-gray-600">
                        {item.produto_imagem ? (
                          <img 
                            src={`${api.defaults.baseURL?.replace('/api', '')}${item.produto_imagem}`} 
                            alt={item.produto_nome} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <Image size={16} className="opacity-40" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-gray-100 group-hover/item-mob:text-blue-400 transition-colors uppercase text-[12px] leading-tight flex items-start gap-1.5 mb-1 flex-wrap">
                          <span className="whitespace-pre-wrap">{item.produto_nome || item.produto_sc || 'Produto Custom'}</span>
                        </div>
                        {item.variacoes && (
                          <div className="text-[10px] text-gray-400 font-medium leading-tight flex flex-wrap gap-1">
                            {Object.entries(typeof item.variacoes === 'string' ? JSON.parse(item.variacoes) : item.variacoes).map(([_, v]: any, idx) => (
                              <span key={idx} className="bg-white/5 px-1.5 rounded">
                                {v.opcao}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </button>
                  )}

                  {!isReadOnly && (
                    <div className="flex-shrink-0">
                      <button 
                        onClick={() => handleDeleteItem(item.id_item)}
                        className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors border border-rose-500/10"
                        title="Excluir"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Grid de Medidas, Qtd e Total */}
                <div className="flex items-center justify-between bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.05]">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-gray-600 font-black uppercase tracking-tight">Medidas</span>
                    <div className="text-[13px] font-black text-white leading-tight mt-0.5">
                      {isReadOnly ? (
                        <>
                          {item.altura} × {item.largura}
                          {item.comprimento && Number(item.comprimento) > 0 && (
                            <div className="text-[11px] text-blue-400 font-black mt-0.5">
                              × {item.comprimento}
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          {Number(item.altura).toFixed(3)} × {Number(item.largura).toFixed(3)}
                          {item.comprimento && Number(item.comprimento) > 0 && (
                            <div className="text-[11px] text-blue-400 font-black mt-0.5">
                              × {Number(item.comprimento).toFixed(3)}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-center px-4 border-x border-white/[0.05]">
                    <span className="text-[9px] text-gray-600 font-black uppercase tracking-tight">Qtd</span>
                    <span className="text-sm font-black text-white mt-0.5">{Number(item.quantidade).toFixed(0)}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] text-gray-600 font-black uppercase tracking-tight">Total</span>
                    <span className="text-sm font-black text-emerald-400 mt-0.5">
                      {Number(item.valor_total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Observações */}
                {item.observacoes && (
                  <div className="text-[10px] text-gray-500 italic px-2 border-l border-gray-800 bg-white/[0.01] py-1 rounded-r">
                    {item.observacoes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bloco 4: Valores e Pagamentos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#111827] border border-gray-800 p-6 rounded-xl shadow-lg h-fit">
            <h3 className="text-lg font-bold text-gray-200 border-b border-gray-800 pb-2 mb-4 flex items-center gap-2">
              <DollarSign size={18} className="text-blue-500" /> Valores
            </h3>
            <div className="space-y-4 font-semibold text-sm">
              <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg border border-white/5">
                <span className="text-gray-400">Subtotal:</span>
                <span className="text-white font-black">{pedido.subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>

              <div className="flex justify-between items-center text-rose-400 bg-rose-400/5 p-2 rounded-lg border border-rose-400/10">
                <div className="flex items-center gap-2">
                  <span>Desconto:</span>
                  {!isReadOnly && !isEditingDiscount && (
                    <button 
                      onClick={() => {
                        setDiscountInput(pedido.desconto.toString());
                        setIsEditingDiscount(true);
                      }} 
                      className="p-1 hover:bg-rose-400/20 rounded transition-colors"
                      title="Editar Desconto"
                    >
                      <Edit2 size={12}/>
                    </button>
                  )}
                </div>
                
                {isEditingDiscount ? (
                  <div className="flex items-center gap-2">
                    <input 
                      type="text"
                      autoFocus
                      className="w-24 bg-gray-900 border border-rose-400/30 rounded px-2 py-1 text-right text-white text-xs outline-none focus:ring-1 ring-rose-400"
                      value={discountInput}
                      onChange={(e) => setDiscountInput(e.target.value.replace(/[^\d.,]/g, ''))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveDiscount();
                        if (e.key === 'Escape') setIsEditingDiscount(false);
                      }}
                    />
                    <button onClick={handleSaveDiscount} className="text-emerald-400 hover:scale-110 transition-transform"><CheckCircle2 size={16}/></button>
                    <button onClick={() => setIsEditingDiscount(false)} className="text-gray-500 hover:scale-110 transition-transform"><Plus size={16} className="rotate-45"/></button>
                  </div>
                ) : (
                  <span className="font-black">-{pedido.desconto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                )}
              </div>

              <div className="flex justify-between items-center text-lg text-white pt-2 border-t border-gray-800">
                <span>Total Líquido:</span>
                <span className="font-black text-blue-400 tracking-tight">
                  {pedido.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between items-center text-emerald-400 bg-emerald-400/5 p-2 rounded-lg border border-emerald-400/10">
                <span>Valor Pago:</span>
                <span className="font-black">{pedido.valor_pago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>

              <div className="flex justify-between items-center text-xl text-blue-500 pt-3 border-t border-gray-800 font-black">
                <span>Saldo:</span>
                <span>{pedido.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#111827] border border-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center border-b border-gray-800 pb-2 mb-4">
              <h3 className="text-lg font-bold text-gray-200 flex items-center gap-2">
                <Clock size={18} className="text-blue-500" /> Pagamentos
              </h3>
              {!isReadOnly && (
                <button 
                  onClick={() => {
                    setEditingPayment(null);
                    setIsPaymentModalOpen(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-500 text-white p-1.5 rounded-lg transition-colors shadow-lg shadow-blue-500/10"
                >
                  <Plus size={16} />
                </button>
              )}
            </div>
            
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {pedido.pagamentos?.length > 0 ? (
                pedido.pagamentos.map((p: any) => (
                  <div key={p.id_caixa_entrada} className="group bg-gray-900/40 border border-gray-800/50 p-3 rounded-xl flex justify-between items-center hover:border-gray-700 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/5 p-2 rounded-lg text-gray-400 group-hover:text-blue-400 transition-colors">
                        <CreditCard size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-gray-200 uppercase">{p.forma_nome || 'A definir'}</p>
                        <p className="text-[10px] text-gray-500 font-bold">{new Date(p.data).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-sm font-black text-emerald-400">{Number(p.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      {!isReadOnly && (
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button 
                            onClick={() => {
                              setEditingPayment(p);
                              setIsPaymentModalOpen(true);
                            }}
                            className="p-1.5 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                            title="Editar Pagamento"
                           >
                             <Edit2 size={12} />
                           </button>
                           <button 
                            onClick={() => handleDeletePayment(p.id_caixa_entrada)}
                            className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Excluir Pagamento"
                           >
                             <Trash2 size={12} />
                           </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 italic text-sm">Nenhum pagamento registrado.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bloco 5: Agendamentos */}
        <div className="bg-[#111827] border border-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center border-b border-gray-800 pb-2 mb-4">
            <h3 className="text-lg font-bold text-gray-200 flex items-center gap-2">
              <Calendar size={18} className="text-blue-500" /> Agendamentos
            </h3>
            {!isReadOnly && (
              <button 
                onClick={() => {
                  setEditingAgendamento(null);
                  setIsAgendamentoModalOpen(true);
                }}
                className="bg-blue-600 hover:bg-blue-500 p-1.5 rounded-lg text-white transition-colors shadow-lg shadow-blue-500/10"
              >
                <Plus size={16} />
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {agendamentos.length > 0 ? (
              agendamentos.map((ag: any) => (
                <div 
                  key={ag.id_agendamento} 
                  onClick={isReadOnly ? undefined : () => {
                    setEditingAgendamento(ag);
                    setIsAgendamentoModalOpen(true);
                  }}
                  className={`group bg-gray-900/40 p-4 rounded-xl border border-gray-800 transition-all relative overflow-hidden ${isReadOnly ? 'cursor-default' : 'hover:border-blue-500/50 cursor-pointer'} ${ag.status_agendamento === 1 ? 'opacity-60' : ''}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                        <Clock size={16} />
                      </div>
                      <span className="font-bold text-blue-400">{new Date(ag.data_agendamento).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</span>
                    </div>
                    <button 
                      onClick={isReadOnly ? (e) => e.stopPropagation() : (e) => handleToggleAgendamentoStatus(e, ag)}
                      disabled={isReadOnly}
                      className={`rounded-full p-1 shadow-md border transition-all ${
                        ag.status_agendamento === 1 
                          ? 'bg-green-600 border-green-400/20 shadow-green-500/40' 
                          : 'bg-gray-800 border-gray-700' + (isReadOnly ? '' : ' hover:border-blue-500/50')
                      }`}
                      title={isReadOnly ? undefined : (ag.status_agendamento === 1 ? 'Marcar como pendente' : 'Marcar como concluído')}
                    >
                      <CheckCircle2 
                        size={12} 
                        className={ag.status_agendamento === 1 ? 'text-white' : 'text-gray-600' + (isReadOnly ? '' : ' group-hover:text-blue-400')} 
                        strokeWidth={3} 
                      />
                    </button>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs font-black text-gray-200 uppercase tracking-wider">
                      {ag.ordem_nome || 'ORDEM DE SERVIÇO'}
                    </p>
                    <p className="text-[11px] text-gray-400 flex items-center gap-1">
                      <User size={10} className="text-gray-500" /> {ag.responsavel_nome || 'NÃO DEFINIDO'}
                    </p>
                    <p className="text-[10px] text-gray-500 italic line-clamp-2 mt-2 pt-2 border-t border-gray-800/50">
                      {ag.instrucao || 'Sem observações.'}
                    </p>
                  </div>

                  {!isReadOnly && (
                    <div className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="p-1.5 bg-blue-500/20 rounded text-blue-400">
                        <Edit2 size={12} />
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full py-6 text-center bg-gray-900/20 rounded-xl border border-dashed border-gray-800">
                <p className="text-gray-500 text-sm italic">Nenhum agendamento ativo para este pedido.</p>
                {!isReadOnly && (
                  <button 
                    onClick={() => setIsAgendamentoModalOpen(true)}
                    className="mt-2 text-xs font-bold text-blue-500 hover:underline"
                  >
                    Criar primeiro agendamento
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bloco 6: Orçamento e Observações */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#111827] border border-gray-800 p-6 rounded-xl shadow-lg space-y-4">
            <div className="flex justify-between items-center border-b border-gray-800 pb-2 mb-2">
              <h3 className="text-lg font-bold text-gray-200 flex items-center gap-2">
                <FileText size={18} className="text-blue-500" /> Orçamento
              </h3>
              {isSavingDebounced && (
                <div className="flex items-center gap-2 text-blue-400 text-xs font-bold animate-pulse">
                  <Clock size={14} className="animate-spin" /> SALVANDO...
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Prazo Execução:</label>
                <input 
                  type="text" 
                  value={budgetFields.prazo}
                  onChange={(e) => setBudgetFields({...budgetFields, prazo: e.target.value})}
                  disabled={isReadOnly}
                  placeholder="Ex: 10 dias úteis"
                  className="w-full bg-gray-900 border border-gray-800 p-2 rounded-lg text-sm text-white focus:border-blue-500 outline-none disabled:opacity-60 disabled:cursor-not-allowed" 
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Forma de Entrega:</label>
                <select 
                  value={budgetFields.entrega}
                  onChange={(e) => setBudgetFields({...budgetFields, entrega: e.target.value})}
                  disabled={isReadOnly}
                  className="w-full bg-gray-900 border border-gray-800 p-2 rounded-lg text-sm text-white focus:border-blue-500 outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <option value="">Selecione a Entrega</option>
                  {deliveryMethods.map(m => (
                    <option key={m.id} value={m.id.toString()}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 uppercase font-bold mb-1 block tracking-tight">Parcelamento:</label>
                  <input 
                    type="text" 
                    value={budgetFields.parcelamento}
                    onChange={(e) => setBudgetFields({...budgetFields, parcelamento: e.target.value})}
                    disabled={isReadOnly}
                    placeholder="Ex: 3"
                    className="w-full bg-gray-900 border border-gray-800 p-2 rounded-lg text-sm text-white focus:border-blue-500 outline-none disabled:opacity-60 disabled:cursor-not-allowed" 
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase font-bold mb-1 block tracking-tight">Desconto PIX (%):</label>
                  <input 
                    type="text" 
                    value={budgetFields.descontopix}
                    onChange={(e) => setBudgetFields({...budgetFields, descontopix: e.target.value})}
                    disabled={isReadOnly}
                    placeholder="Ex: 5%"
                    className="w-full bg-gray-900 border border-gray-800 p-2 rounded-lg text-sm text-white focus:border-blue-500 outline-none disabled:opacity-60 disabled:cursor-not-allowed" 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#111827] border border-gray-800 p-6 rounded-xl shadow-lg flex flex-col">
            <div className="flex justify-between items-center border-b border-gray-800 pb-2 mb-4">
              <h3 className="text-lg font-bold text-gray-200 flex items-center gap-2">
                <Settings size={18} className="text-blue-500" /> Observações
              </h3>
              {isSavingDebounced && (
                <div className="flex items-center gap-2 text-blue-400 text-xs font-bold animate-pulse">
                  <Clock size={14} className="animate-spin" /> SALVANDO...
                </div>
              )}
            </div>
            <textarea 
              value={budgetFields.observacoes}
              onChange={(e) => setBudgetFields({...budgetFields, observacoes: e.target.value})}
              disabled={isReadOnly}
              placeholder="Digite observações importantes sobre o pedido..."
              className="flex-1 w-full bg-gray-900 border border-gray-800 p-4 rounded-xl text-sm text-white focus:border-blue-500 outline-none resize-none min-h-[160px] disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <button 
            onClick={() => {
              const phone = pedido.cliente?.telefone || pedido.cliente?.telefone2 || pedido.cliente?.telefone3;
              const waBase = formatWhatsAppLink(phone, pedido.cliente?.ddd);
              const trackUrl = `${window.location.origin}/acompanhamento/${pedido.id_pedido}`;
              const message = encodeURIComponent(`Olá! Segue o link para acompanhamento do seu pedido na Competidora: ${trackUrl}`);
              if (waBase) {
                window.open(`${waBase}?text=${message}`, '_blank');
              } else {
                alert('Telefone do cliente não encontrado para enviar WhatsApp.');
              }
            }}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 px-8 rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-emerald-500/20 shadow-lg"
          >
            <Send size={20} /> ENVIAR
          </button>
          <Link 
            to={`/acompanhamento/${pedido.id_pedido}`} 
            target="_blank"
            className="bg-blue-600 hover:bg-blue-500 text-white font-black py-3 px-8 rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-blue-500/20 shadow-lg"
          >
            <ExternalLink size={20} /> ACOMPANHAMENTO
          </Link>
        </div>
      </main>

      {isStatusModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-300 px-4">
          <div 
            className="bg-[#111827] border border-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-gray-800 pb-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Settings className="text-blue-500" size={20} /> Editar Pedido #{pedido.id_pedido}
              </h2>
              <button 
                onClick={() => setIsStatusModalOpen(false)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <Plus size={24} className="rotate-45" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Status do Pedido</label>
                <select 
                  className="w-full bg-gray-900 border border-gray-800 text-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-semibold"
                  value={statusUpdateFields.status}
                  onChange={(e) => setStatusUpdateFields({ ...statusUpdateFields, status: Number(e.target.value) })}
                >
                  {statusOptions.map(opt => (
                    <option translate="no" className="notranslate" key={opt.id} value={opt.id}>{opt.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Título do Pedido (Opcional)</label>
                <input 
                  type="text"
                  placeholder="Ex: Reforma Cozinha, Sala de Estar..."
                  className="w-full bg-gray-900 border border-gray-800 text-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={statusUpdateFields.titulo}
                  onChange={(e) => setStatusUpdateFields({ ...statusUpdateFields, titulo: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-800">
              <button 
                onClick={() => setIsStatusModalOpen(false)}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-700 text-gray-400 font-bold hover:bg-gray-800 transition-all"
              >
                CANCELAR
              </button>
              <button 
                onClick={handleUpdateStatus}
                disabled={isSaving}
                className="flex-1 px-4 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
              >
                {isSaving ? <Clock className="animate-spin" size={18} /> : <Save size={18} />} SALVAR
              </button>
            </div>
          </div>
          {/* Overlay click to close */}
          <div className="fixed inset-0 -z-10" onClick={() => setIsStatusModalOpen(false)}></div>
        </div>
      )}

      {isModalOpen && (
        <AddOrderItemModal 
          orderId={id!} 
          editingItem={editingItem}
          onClose={() => {
            setIsModalOpen(false);
            setEditingItem(null);
          }} 
          onSuccess={fetchPedido} 
        />
      )}

      {isPaymentModalOpen && (
        <AddPaymentModal
          orderId={id!}
          payment={editingPayment}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setEditingPayment(null);
          }}
          onSuccess={fetchPedido}
        />
      )}
      <AgendamentoModal 
        isOpen={isAgendamentoModalOpen}
        onClose={() => setIsAgendamentoModalOpen(false)}
        onSave={fetchAgendamentos}
        idPedido={Number(id)}
        agendamento={editingAgendamento}
      />
    </div>
  );
}
