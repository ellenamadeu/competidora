import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  User, MapPin, Calendar, 
  DollarSign, Package, Clock, CheckCircle2, 
  AlertCircle, Send, 
  Ruler, CreditCard,
  Info, Zap, Handshake, Image
} from 'lucide-react';
import { api } from '../lib/api';
import logoImg from '../assets/logo.png';

// Mapeamento de Status Simplificado (3 Etapas)
const getStage = (statusId: number | null | undefined) => {
  if (!statusId || statusId <= 3) return 'orçamento'; // 1: Novo, 2: Medição, 3: Orçamento
  if (statusId === 4) return 'produção'; // 4: Produção, (Status 2 for Instalação in internal view, but usually 4 or 5)
  return 'concluído'; // 5: Concluído, 6: Cobrança, 7: Baixado
};

const stages = [
  { id: 'orçamento', label: 'Orçamento', icon: Ruler },
  { id: 'produção', label: 'Produção', icon: Package },
  { id: 'concluído', label: 'Concluído', icon: CheckCircle2 },
];

export default function OrderTrackingPage() {
  const { id } = useParams();
  const [pedido, setPedido] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [agendamentos, setAgendamentos] = useState<any[]>([]);

  const fetchPedido = async () => {
    try {
      const res = await api.get(`/pedidos/tracking/${id}`);
      setPedido(res.data);
      setAgendamentos(res.data.agendamentos || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedido();
  }, [id]);

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
      </div>
    );
  }

  const currentStage = getStage(pedido.status);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-200 font-sans pb-12">
      {/* Header Simplificado */}
      <header className="bg-black sticky top-0 z-50 border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logoImg} className="h-9 w-auto object-contain" alt="Competidora" />
          </div>
          <div className="text-right">
            <span className="text-[10px] text-gray-500 font-bold uppercase block leading-none">Acompanhamento</span>
            <span className="text-sm font-black text-blue-400">Pedido #{pedido.id_pedido}</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        
        {/* Stepper Visual */}
        <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full"></div>
          <div className="relative flex justify-between items-center">
            {stages.map((stage, idx) => {
              const Icon = stage.icon;
              const isPast = stages.findIndex(s => s.id === currentStage) >= idx;
              const isCurrent = currentStage === stage.id;
              
              return (
                <div key={stage.id} className="flex flex-col items-center flex-1 relative">
                  {/* Linha Conectora */}
                  {idx < stages.length - 1 && (
                    <div className={`absolute top-5 left-1/2 w-full h-[2px] z-0 ${
                      stages.findIndex(s => s.id === currentStage) > idx ? 'bg-blue-600' : 'bg-gray-800'
                    }`} />
                  )}
                  
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-500 ${
                    isCurrent ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] scale-110' : 
                    isPast ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 
                    'bg-gray-800 text-gray-500 border border-gray-700'
                  }`}>
                    {isPast && !isCurrent ? <CheckCircle2 size={24} /> : <Icon size={20} />}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest mt-3 ${
                    isCurrent ? 'text-blue-400' : isPast ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {stage.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dados do Cliente */}
        <section className="bg-[#111827] border border-gray-800 p-6 rounded-2xl space-y-4 shadow-lg">
          <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
            <User size={14} className="text-blue-500" /> Dados do Cliente
          </h3>
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white leading-tight uppercase">{pedido.cliente?.nome}</h2>
            <p className="text-sm text-gray-400 flex items-center gap-2">
              <MapPin size={14} /> {pedido.cliente?.endereco}, {pedido.cliente?.bairro}
            </p>
          </div>
        </section>

        {/* Itens do Pedido */}
        <section className="bg-[#111827] border border-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <Package size={14} className="text-blue-500" /> Itens do Pedido
            </h3>
          </div>
          <div className="divide-y divide-gray-800/50">
            {pedido.itens?.map((item: any) => (
              <div key={item.id_item} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors">
                <div className="flex-1 min-w-0 flex items-start gap-4">
                  {/* Imagem do Produto */}
                  <div className="w-12 h-12 rounded-lg bg-gray-800 overflow-hidden flex-shrink-0 border border-gray-700/60 flex items-center justify-center text-gray-600">
                    {item.produto_imagem ? (
                      <img 
                        src={`${api.defaults.baseURL?.replace('/api', '')}${item.produto_imagem}`} 
                        alt={item.produto_nome} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <Image size={20} className="opacity-40" />
                    )}
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <h4 className="font-bold text-gray-100 uppercase text-sm leading-snug whitespace-pre-wrap">
                      {item.produto_nome || item.produto_sc || 'Produto Personalizado'}
                    </h4>
                    {item.variacoes && (
                       <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wide flex flex-wrap gap-x-2">
                          {Object.entries(typeof item.variacoes === 'string' ? JSON.parse(item.variacoes) : item.variacoes).map(([group, v]: any, idx) => (
                            <span key={idx}>{idx > 0 && ' | '}<span className="text-gray-600 font-black">{group}:</span> {v.opcao}</span>
                          ))}
                       </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-6 text-right">
                  <div className="text-center sm:text-right">
                    <span className="text-[9px] text-gray-600 font-black uppercase block">Medidas</span>
                    <div className="text-sm font-bold text-gray-300 leading-tight">
                      {Number(item.altura).toFixed(3)} x {Number(item.largura).toFixed(3)}
                      {item.comprimento && Number(item.comprimento) > 0 && (
                        <div className="text-[10px] text-blue-400 font-black mt-0.5">
                          x {Number(item.comprimento).toFixed(3)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-center sm:text-right">
                    <span className="text-[9px] text-gray-600 font-black uppercase block">Qtd</span>
                    <span className="text-sm font-black text-white">{Number(item.quantidade)}</span>
                  </div>
                  <div className="text-right min-w-[80px]">
                    <span className="text-[9px] text-gray-600 font-black uppercase block">Total</span>
                    <span className="text-sm font-black text-emerald-400">
                      {Number(item.valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Valores */}
        <section className="bg-[#111827] border border-gray-800 p-6 rounded-2xl shadow-lg">
          <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <DollarSign size={14} className="text-blue-500" /> Resumo de Valores
          </h3>
          <div className="space-y-3">
             <div className="flex justify-between items-center text-sm font-bold">
               <span className="text-gray-500 uppercase text-[10px]">Subtotal</span>
               <span className="text-gray-300">{pedido.subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
             </div>
             {pedido.desconto > 0 && (
               <div className="flex justify-between items-center text-sm font-bold text-rose-400">
                 <span className="uppercase text-[10px]">Desconto</span>
                 <span>-{pedido.desconto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
               </div>
             )}
             <div className="flex justify-between items-center pt-3 border-t border-gray-800">
               <span className="text-white font-black uppercase text-xs">Total do Pedido</span>
               <span className="text-xl font-black text-blue-400">{pedido.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
             </div>
             <div className="flex justify-between items-center pt-2">
               <span className="text-emerald-500/70 font-bold uppercase text-[10px]">Valor Pago</span>
               <span className="text-sm font-black text-emerald-500">{pedido.valor_pago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
             </div>
             {pedido.saldo > 0 && (
               <div className="flex justify-between items-center p-3 bg-blue-500/5 rounded-xl border border-blue-500/10 mt-4">
                 <span className="text-blue-400 font-black uppercase text-xs">Saldo a Pagar</span>
                 <span className="text-lg font-black text-white">{pedido.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
               </div>
             )}
          </div>
        </section>

        {/* Bloco Condicional: Orçamento vs Pagamentos */}
        {currentStage === 'orçamento' ? (
          <section className="bg-[#111827] border border-gray-800 p-6 rounded-2xl shadow-lg relative overflow-hidden">
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/5 blur-3xl rounded-full"></div>
             <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Info size={14} className="text-blue-500" /> Informações Adicionais
             </h3>
             <div className="space-y-6">
                <div>
                  <span className="text-[10px] text-gray-600 font-black uppercase block mb-1">Prazo de Entrega</span>
                  <p className="text-lg font-black text-white italic">{pedido.prazo || 0} dias úteis</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-600 font-black uppercase block mb-1">Forma de Entrega</span>
                  <p className="text-lg font-black text-white italic">{pedido.entrega_nome || 'A definir'}</p>
                </div>
                <div className="space-y-4">
                  <span className="text-[10px] text-gray-600 font-black uppercase block -mb-2">Formas de Pagamento</span>
                  
                  <div className="flex items-center gap-3 bg-white/[0.02] p-3 rounded-xl border border-white/[0.05]">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500 border border-blue-500/20">
                      <CreditCard size={20} />
                    </div>
                    <p className="text-sm font-bold text-gray-200">{pedido.parcelamento || 1}x sem juros no cartão</p>
                  </div>

                  <div className="flex items-center gap-3 bg-white/[0.02] p-3 rounded-xl border border-white/[0.05]">
                    <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                      <Zap size={20} />
                    </div>
                    <p className="text-sm font-bold text-gray-200">
                      <span className="text-emerald-400 font-black">{pedido.descontopix || '0%'}</span> de desconto para pagamento no Pix (no ato da confirmação)
                    </p>
                  </div>

                  <div className="flex items-center gap-3 bg-white/[0.02] p-3 rounded-xl border border-white/[0.05]">
                    <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-500 border border-amber-500/20">
                      <Handshake size={20} />
                    </div>
                    <p className="text-sm font-bold text-gray-200">50% de sinal + 50% no dia da entrega (sem desconto)</p>
                  </div>
                </div>
             </div>
          </section>
        ) : (
          <section className="bg-[#111827] border border-gray-800 p-6 rounded-2xl shadow-lg">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <Clock size={14} className="text-blue-500" /> Histórico de Pagamentos
            </h3>
            <div className="space-y-3">
              {pedido.pagamentos?.length > 0 ? (
                pedido.pagamentos.map((p: any) => (
                  <div key={p.id_caixa_entrada} className="bg-gray-900/40 border border-gray-800/50 p-4 rounded-xl flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-600/10 p-2 rounded-lg text-blue-400">
                        <CreditCard size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-gray-200 uppercase">{p.forma_nome || 'PAGAMENTO'}</p>
                        <p className="text-[10px] text-gray-500 font-bold">{new Date(p.data).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                    <span className="font-mono text-sm font-black text-emerald-400">{Number(p.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 bg-gray-900/20 rounded-xl border border-dashed border-gray-800">
                   <p className="text-gray-500 italic text-sm font-medium">Nenhum pagamento registrado até o momento.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Agendamentos */}
        <section className="bg-[#111827] border border-gray-800 p-6 rounded-2xl shadow-lg">
          <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <Calendar size={14} className="text-blue-500" /> Agendamentos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agendamentos.length > 0 ? (
              agendamentos.map((ag: any) => (
                <div key={ag.id_agendamento} className="bg-gray-900/40 p-4 rounded-xl border border-gray-800 flex items-start gap-4">
                  <div className="p-3 bg-blue-600/10 rounded-xl text-blue-400">
                    <Clock size={20} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-black text-white">{new Date(ag.data_agendamento).toLocaleDateString('pt-BR')}</p>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-wider">{ag.ordem_nome || 'Serviço'}</p>
                    {ag.status_agendamento === 1 && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full mt-1">
                        <CheckCircle2 size={10} /> Concluído
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-6 text-center bg-gray-900/20 rounded-xl border border-dashed border-gray-800">
                 <p className="text-gray-500 italic text-sm font-medium">Não há agendamentos para este pedido.</p>
              </div>
            )}
          </div>
        </section>

        {/* Observações */}
        {pedido.observacoes && (
          <section className="bg-[#111827] border border-gray-800 p-6 rounded-2xl shadow-lg">
             <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                <Info size={14} className="text-blue-500" /> Observações
             </h3>
             <div className="text-sm text-gray-400 leading-relaxed bg-white/[0.02] p-4 rounded-xl border border-white/[0.05] italic">
                {pedido.observacoes}
             </div>
          </section>
        )}

        {/* Footer / Contact */}
        <div className="flex flex-col items-center gap-6 pt-8 pb-4">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Dúvidas sobre o seu pedido?</p>
          <a 
            href={`https://wa.me/55${pedido.cliente?.telefone || ''}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-[0_10px_30px_rgba(16,185,129,0.3)] transition-all hover:scale-105 active:scale-95"
          >
            <Send size={20} />
            Falar com a Central
          </a>
        </div>

      </main>
    </div>
  );
}
