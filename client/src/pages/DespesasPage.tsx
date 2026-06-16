import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, TrendingDown, X, Calendar, RefreshCw, AlertCircle } from 'lucide-react';
import { api } from '../lib/api';

interface Despesa {
  id: number;
  id_fornecedor: number;
  descricao: string;
  valor: number;
  data_pagamento: string;
  nome_fornecedor: string;
  nome_categoria: string;
}

interface Fornecedor {
  id: number;
  nome: string;
}

export default function DespesasPage() {
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  // Busca de Fornecedor no Modal
  const [providerSearch, setProviderSearch] = useState('');
  const [isProviderDropdownOpen, setIsProviderDropdownOpen] = useState(false);

  // Filtros de Data
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(firstDay);
  const [endDate, setEndDate] = useState(lastDay);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDespesa, setEditingDespesa] = useState<Despesa | null>(null);
  const [formData, setFormData] = useState({
    id_fornecedor: '',
    descricao: '',
    valor: '',
    data_pagamento: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchDespesas();
    fetchFornecedores();
  }, []);

  const fetchDespesas = async (start = startDate, end = endDate) => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/despesas', {
        params: { start_date: start, end_date: end }
      });
      setDespesas(res.data);
    } catch (err: any) {
      console.error(err);
      setError('Erro ao carregar despesas.');
    } finally {
      setLoading(false);
    }
  };

  const fetchFornecedores = async () => {
    try {
      const res = await api.get('/fornecedores');
      setFornecedores(res.data);
    } catch (err) {
      console.error('Erro ao buscar fornecedores:', err);
    }
  };

  const handleOpenModal = (desp?: Despesa) => {
    if (desp) {
      setEditingDespesa(desp);
      setFormData({
        id_fornecedor: String(desp.id_fornecedor),
        descricao: desp.descricao,
        valor: String(desp.valor),
        data_pagamento: desp.data_pagamento
      });
      const selectedProv = fornecedores.find(f => f.id === desp.id_fornecedor);
      setProviderSearch(selectedProv ? selectedProv.nome : '');
    } else {
      setEditingDespesa(null);
      setFormData({
        id_fornecedor: '',
        descricao: '',
        valor: '',
        data_pagamento: new Date().toISOString().split('T')[0]
      });
      setProviderSearch('');
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDespesa(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id_fornecedor) {
      alert('Por favor, selecione um fornecedor válido da lista de busca.');
      return;
    }
    try {
      const payload = {
        id_fornecedor: Number(formData.id_fornecedor),
        descricao: formData.descricao,
        valor: parseFloat(formData.valor),
        data_pagamento: formData.data_pagamento
      };

      if (editingDespesa) {
        await api.put(`/despesas/${editingDespesa.id}`, payload);
      } else {
        await api.post('/despesas', payload);
      }

      handleCloseModal();
      fetchDespesas();
    } catch (err: any) {
      console.error(err);
      alert('Erro ao salvar a despesa.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja remover esta despesa?')) return;
    try {
      await api.delete(`/despesas/${id}`);
      fetchDespesas();
    } catch (err: any) {
      console.error(err);
      alert('Erro ao excluir a despesa.');
    }
  };

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const utcDate = new Date(d.getTime() + d.getTimezoneOffset() * 60000);
      return utcDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const filteredDespesas = despesas.filter(d => 
    d.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.nome_fornecedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.nome_categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalFiltered = filteredDespesas.reduce((acc, curr) => acc + curr.valor, 0);

  const filteredFornecedores = fornecedores.filter(f => 
    f.nome.toLowerCase().includes(providerSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-800 pb-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
            <TrendingDown className="text-rose-500" /> Gestão de Despesas
            <span className="text-sm font-normal text-gray-500 ml-2">({despesas.length} no período)</span>
          </h1>
          <p className="text-gray-400 mt-1">Controle de pagamentos de contas, custos operacionais e fornecedores.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-primary" onClick={() => handleOpenModal()}>
            <Plus size={18} /> Nova Despesa
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center gap-2">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Barra de Filtros */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#111827] p-4 rounded-xl border border-gray-800">
        {/* Busca textual */}
        <div className="relative w-full md:w-auto flex-grow max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="w-5 h-5 text-gray-400" />
          </span>
          <input 
            type="search" 
            placeholder="Buscar por descrição, fornecedor ou categoria..." 
            className="w-full pl-10 pr-4 py-2 text-white bg-transparent border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Datas */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <div className="flex items-center gap-1 bg-gray-800/40 p-1.5 rounded-lg border border-gray-700">
            <input 
              type="date" 
              className="bg-transparent border-none text-xs text-white focus:outline-none cursor-pointer"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
            <span className="text-gray-500 text-xs px-1">até</span>
            <input 
              type="date" 
              className="bg-transparent border-none text-xs text-white focus:outline-none cursor-pointer"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </div>
          <button 
            onClick={() => fetchDespesas(startDate, endDate)} 
            className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs flex items-center gap-1.5 border border-gray-750 transition"
          >
            <RefreshCw size={13} /> Filtrar
          </button>
        </div>
      </div>

      {/* Estatísticas Simples */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="card p-4 flex justify-between items-center bg-gray-850">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Selecionado</p>
            <h3 className="text-2xl font-black text-rose-400 mt-1">{formatCurrency(totalFiltered)}</h3>
          </div>
          <div className="bg-rose-500/10 text-rose-500 p-2 rounded-xl">
            <TrendingDown size={24} />
          </div>
        </div>
      </div>

      {/* Tabela de Despesas */}
      <div className="card p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 text-xs text-gray-400 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Vencimento</th>
                <th className="py-3 px-4">Fornecedor</th>
                <th className="py-3 px-4">Categoria</th>
                <th className="py-3 px-4">Descrição</th>
                <th className="py-3 px-4 text-right">Valor</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">Carregando despesas...</td>
                </tr>
              ) : filteredDespesas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500 text-sm">
                    Nenhuma despesa encontrada para o filtro selecionado.
                  </td>
                </tr>
              ) : (
                filteredDespesas.map((d) => (
                  <tr key={d.id} className="hover:bg-white/5 transition-colors duration-150">
                    <td className="py-3.5 px-4 text-sm text-gray-300 font-semibold flex items-center gap-1.5">
                      <Calendar size={14} className="text-gray-500" />
                      {formatDate(d.data_pagamento)}
                    </td>
                    <td className="py-3.5 px-4 text-sm text-white font-bold">
                      {d.nome_fornecedor}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-bold uppercase">
                      <span className="bg-gray-800/50 text-gray-400 border border-gray-700/50 px-2 py-0.5 rounded-full">
                        {d.nome_categoria}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-sm text-gray-300">
                      {d.descricao}
                    </td>
                    <td className="py-3.5 px-4 text-sm text-right font-black text-rose-400">
                      {formatCurrency(d.valor)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button 
                          onClick={() => handleOpenModal(d)}
                          className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-full transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(d.id)}
                          className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Cadastro/Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <TrendingDown className="text-rose-500" size={20} />
                {editingDespesa ? 'Editar Despesa' : 'Nova Despesa'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-white transition">
                <X size={22} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="relative">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Fornecedor</label>
                <div className="relative">
                  <input 
                    type="text" 
                    required
                    placeholder="Digite para buscar fornecedor..."
                    className="input-field bg-gray-900 text-white rounded-lg p-2.5 w-full border border-gray-700 focus:outline-none text-sm pr-8"
                    value={providerSearch}
                    onChange={e => {
                      setProviderSearch(e.target.value);
                      setIsProviderDropdownOpen(true);
                      const match = fornecedores.find(f => f.nome.toLowerCase() === e.target.value.toLowerCase());
                      setFormData({...formData, id_fornecedor: match ? String(match.id) : ''});
                    }}
                    onFocus={() => setIsProviderDropdownOpen(true)}
                  />
                  <span className="absolute right-3 top-3.5 flex h-2 w-2">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${formData.id_fornecedor ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${formData.id_fornecedor ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                  </span>
                </div>

                {isProviderDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsProviderDropdownOpen(false)} />
                    <div className="absolute z-20 w-full mt-1 bg-gray-900 border border-gray-700 rounded-lg max-h-48 overflow-y-auto shadow-2xl custom-scrollbar animate-in fade-in slide-in-from-top-1 duration-150">
                      {filteredFornecedores.length === 0 ? (
                        <div className="p-3 text-xs text-gray-500 italic text-center">Nenhum fornecedor encontrado</div>
                      ) : (
                        filteredFornecedores.map(f => (
                          <button
                            key={f.id}
                            type="button"
                            className={`w-full text-left px-4 py-2 text-xs hover:bg-violet-600 hover:text-white transition-colors flex items-center justify-between ${String(f.id) === formData.id_fornecedor ? 'bg-violet-500/20 text-violet-400 font-bold border-l-2 border-violet-500' : 'text-gray-300'}`}
                            onClick={() => {
                              setFormData({...formData, id_fornecedor: String(f.id)});
                              setProviderSearch(f.nome);
                              setIsProviderDropdownOpen(false);
                            }}
                          >
                            <span>{f.nome}</span>
                            {String(f.id) === formData.id_fornecedor && (
                              <span className="text-[10px] bg-violet-500/20 text-violet-400 px-1.5 py-0.5 rounded">Selecionado</span>
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Descrição da Despesa</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Compra de chapas de vidro temperado, energia elétrica..."
                  className="input-field bg-gray-900 text-white rounded-lg p-2.5 w-full border border-gray-700 focus:outline-none" 
                  value={formData.descricao}
                  onChange={e => setFormData({...formData, descricao: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Valor (R$)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    placeholder="0,00"
                    className="input-field bg-gray-900 text-white rounded-lg p-2.5 w-full border border-gray-700 focus:outline-none" 
                    value={formData.valor}
                    onChange={e => setFormData({...formData, valor: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Data Pagamento</label>
                  <input 
                    type="date" 
                    required
                    className="input-field bg-gray-900 text-white rounded-lg p-2.5 w-full border border-gray-700 focus:outline-none" 
                    value={formData.data_pagamento}
                    onChange={e => setFormData({...formData, data_pagamento: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={handleCloseModal} className="px-5 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-bold text-sm transition">
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingDespesa ? 'Salvar Alterações' : 'Registrar Despesa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
