import { useState, useEffect } from 'react';
import { Wallet, ArrowUpRight, ArrowDownRight, Calendar, RefreshCw, AlertCircle } from 'lucide-react';
import { api } from '../lib/api';

interface Transaction {
  id: string;
  tipo: 'entrada' | 'saida';
  data: string;
  valor: number;
  descricao: string;
}

interface CategoryTotal {
  categoria: string;
  total: number;
}

interface DashboardStats {
  summary: {
    entradas: number;
    saidas: number;
    saldo: number;
  };
  chart: {
    entradas: { dia: string; total: number }[];
    saidas: { dia: string; total: number }[];
  };
  recent_transactions: Transaction[];
  by_category: CategoryTotal[];
  yearly_evolution: { mes: string; receita: number; despesa: number }[];
}

export default function CaixaPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Datas de filtro
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
  
  const [startDate, setStartDate] = useState(firstDay);
  const [endDate, setEndDate] = useState(lastDay);
  const [quickFilter, setQuickFilter] = useState('this-month');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async (start = startDate, end = endDate) => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/caixa/stats', {
        params: { start_date: start, end_date: end }
      });
      setStats(res.data);
    } catch (err: any) {
      console.error(err);
      setError('Erro ao buscar dados do fluxo de caixa.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFilterChange = (val: string) => {
    setQuickFilter(val);
    const today = new Date();
    let start = startDate;
    let end = endDate;

    switch(val) {
      case 'this-month':
        start = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
        break;
      case 'last-month':
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1).toISOString().split('T')[0];
        end = new Date(today.getFullYear(), today.getMonth(), 0).toISOString().split('T')[0];
        break;
      case 'this-year':
        start = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
        end = new Date(today.getFullYear(), 11, 31).toISOString().split('T')[0];
        break;
      case 'all':
        start = '2020-01-01';
        end = new Date(today.getFullYear(), 11, 31).toISOString().split('T')[0];
        break;
    }

    setStartDate(start);
    setEndDate(end);
    fetchStats(start, end);
  };

  const handleUpdate = () => {
    fetchStats(startDate, endDate);
  };

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      // Evitar distorções de fuso horário na renderização local de data YYYY-MM-DD
      const utcDate = new Date(d.getTime() + d.getTimezoneOffset() * 60000);
      return utcDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    } catch {
      return dateStr;
    }
  };

  // Encontrar o maior valor na evolução mensal para escalas
  const maxMonthlyVal = stats?.yearly_evolution.reduce((max, curr) => {
    const val = Math.max(curr.receita, curr.despesa);
    return val > max ? val : max;
  }, 1000) || 1000;

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800 pb-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
            <Wallet className="text-blue-500" /> Fluxo de Caixa
          </h1>
          <p className="text-gray-400 mt-1">Resumo financeiro detalhado e acompanhamento de fluxo.</p>
        </div>
        
        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-2 bg-[#111827] p-2 rounded-xl border border-gray-800 w-full md:w-auto">
          <input 
            type="date" 
            className="input-field py-1 px-2 text-xs max-w-[130px] border border-gray-700 bg-transparent text-white rounded-lg focus:outline-none"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
          <span className="text-gray-500 text-xs">até</span>
          <input 
            type="date" 
            className="input-field py-1 px-2 text-xs max-w-[130px] border border-gray-700 bg-transparent text-white rounded-lg focus:outline-none"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
          <button 
            onClick={handleUpdate} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition"
          >
            <RefreshCw size={12} /> Atualizar
          </button>
          <div className="h-4 w-px bg-gray-800 mx-1 hidden sm:block"></div>
          <select 
            className="bg-gray-800 border-none rounded-lg text-xs px-2 py-1.5 text-white focus:outline-none cursor-pointer"
            value={quickFilter}
            onChange={e => handleQuickFilterChange(e.target.value)}
          >
            <option value="this-month">Este Mês</option>
            <option value="last-month">Mês Passado</option>
            <option value="this-year">Este Ano</option>
            <option value="all">Todo Período</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center gap-2">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-gray-400 flex flex-col items-center gap-2">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Buscando estatísticas e transações...</span>
        </div>
      ) : stats ? (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card p-6 border-l-4 border-emerald-500 hover:scale-[1.02] transition-transform duration-300">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Entradas</span>
                <div className="bg-emerald-500/10 p-2.5 rounded-xl text-emerald-500">
                  <ArrowUpRight size={20} />
                </div>
              </div>
              <h2 className="text-3xl font-black text-white">{formatCurrency(stats.summary.entradas)}</h2>
              <p className="text-xs text-gray-500 mt-2">Total recebido de pedidos</p>
            </div>

            <div className="card p-6 border-l-4 border-rose-500 hover:scale-[1.02] transition-transform duration-300">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Saídas</span>
                <div className="bg-rose-500/10 p-2.5 rounded-xl text-rose-500">
                  <ArrowDownRight size={20} />
                </div>
              </div>
              <h2 className="text-3xl font-black text-white">{formatCurrency(stats.summary.saidas)}</h2>
              <p className="text-xs text-gray-500 mt-2">Total pago em despesas</p>
            </div>

            <div className="card p-6 border-l-4 border-blue-500 hover:scale-[1.02] transition-transform duration-300">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Resultado Líquido</span>
                <div className="bg-blue-500/10 p-2.5 rounded-xl text-blue-500">
                  <Wallet size={20} />
                </div>
              </div>
              <h2 className={`text-3xl font-black ${stats.summary.saldo >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {formatCurrency(stats.summary.saldo)}
              </h2>
              <p className="text-xs text-gray-500 mt-2">Saldo acumulado do período</p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Gastos por Categoria */}
            <div className="card p-6 flex flex-col">
              <div className="pb-4 border-b border-gray-800 mb-4">
                <h3 className="text-base font-bold text-white uppercase tracking-wider">Saídas por Categoria</h3>
              </div>
              <div className="flex-grow space-y-4 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
                {stats.by_category.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-10">Nenhum gasto registrado.</p>
                ) : (
                  stats.by_category.map((c, idx) => {
                    const totalGeral = stats.by_category.reduce((a, b) => a + b.total, 0);
                    const perc = totalGeral > 0 ? ((c.total / totalGeral) * 100).toFixed(1) : '0';
                    return (
                      <div key={idx} className="group">
                        <div className="flex justify-between text-sm font-semibold mb-1">
                          <span className="text-gray-300 group-hover:text-blue-400 transition-colors">{c.categoria}</span>
                          <span className="text-white">{formatCurrency(c.total)}</span>
                        </div>
                        <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-blue-500 h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                            style={{ width: `${perc}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-end text-[10px] text-gray-500 font-bold mt-0.5">{perc}%</div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Evolução Gráfica 12 Meses (SVG Rendered) */}
            <div className="xl:col-span-2 card p-6">
              <div className="pb-4 border-b border-gray-800 mb-4 flex justify-between items-center">
                <h3 className="text-base font-bold text-white uppercase tracking-wider">Histórico Anual</h3>
                <div className="flex gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-emerald-500 rounded-sm"></div>
                    <span className="text-gray-400">Receitas</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-rose-500 rounded-sm"></div>
                    <span className="text-gray-400">Despesas</span>
                  </div>
                </div>
              </div>
              
              <div className="h-[300px] flex items-end justify-between pt-6 px-2 sm:px-6">
                {stats.yearly_evolution.map((item, idx) => {
                  const recHeight = (item.receita / maxMonthlyVal) * 200;
                  const despHeight = (item.despesa / maxMonthlyVal) * 200;

                  return (
                    <div key={idx} className="flex flex-col items-center flex-grow max-w-[50px] group">
                      <div className="w-full flex items-end justify-center gap-1 h-[220px] pb-2 border-b border-gray-800">
                        {/* Barra Receitas */}
                        <div 
                          className="w-3 sm:w-4 bg-emerald-500/80 hover:bg-emerald-500 rounded-t transition-all duration-300 relative group/bar"
                          style={{ height: `${Math.max(recHeight, 4)}px` }}
                        >
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-gray-900 border border-gray-700 text-white text-[9px] font-black py-1 px-1.5 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity z-10 pointer-events-none whitespace-nowrap">
                            Rec: {formatCurrency(item.receita)}
                          </div>
                        </div>
                        {/* Barra Despesas */}
                        <div 
                          className="w-3 sm:w-4 bg-rose-500/80 hover:bg-rose-500 rounded-t transition-all duration-300 relative group/bar2"
                          style={{ height: `${Math.max(despHeight, 4)}px` }}
                        >
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-gray-900 border border-gray-700 text-white text-[9px] font-black py-1 px-1.5 rounded opacity-0 group-hover/bar2:opacity-100 transition-opacity z-10 pointer-events-none whitespace-nowrap">
                            Desp: {formatCurrency(item.despesa)}
                          </div>
                        </div>
                      </div>
                      <span className="text-[9px] sm:text-xs text-gray-500 font-bold uppercase mt-2">{item.mes}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Extrato Recente */}
          <div className="card p-6">
            <div className="pb-4 border-b border-gray-800 mb-4 flex justify-between items-center">
              <h3 className="text-base font-bold text-white uppercase tracking-wider">Extrato Consolidado</h3>
              <span className="text-xs text-gray-500 font-semibold uppercase">Últimas 100 movimentações</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-800 text-xs text-gray-400 uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Data</th>
                    <th className="py-3 px-4">Tipo</th>
                    <th className="py-3 px-4">Descrição</th>
                    <th className="py-3 px-4 text-right">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {stats.recent_transactions.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-500 text-sm">
                        Nenhuma movimentação no período selecionado.
                      </td>
                    </tr>
                  ) : (
                    stats.recent_transactions.map((t, idx) => {
                      const isInput = t.tipo === 'entrada';
                      return (
                        <tr key={idx} className="hover:bg-white/5 transition-colors">
                          <td className="py-3 px-4 text-sm text-gray-300 font-semibold">
                            {formatDate(t.data)}
                          </td>
                          <td className="py-3 px-4 text-xs font-bold uppercase">
                            <span className={`px-2 py-0.5 rounded-full ${isInput ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                              {isInput ? 'Receita' : 'Saída'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-white font-bold">
                            {t.descricao}
                          </td>
                          <td className={`py-3 px-4 text-sm font-black text-right ${isInput ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {isInput ? '+' : '-'} {formatCurrency(t.valor)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
