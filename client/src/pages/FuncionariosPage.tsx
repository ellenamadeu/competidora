import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Briefcase, X, Phone, DollarSign, PlusCircle, MinusCircle, Shield } from 'lucide-react';
import { api } from '../lib/api';

interface Funcionario {
  id: number;
  status: number;
  acesso: number;
  login: string | null;
  nome: string;
  sobrenome: string | null;
  telefone1: string | null;
  telefone2: string | null;
  telefone3: string | null;
  endereco: string | null;
  bairro: string | null;
  data_nascimento: string | null;
  filhos: number;
  rg: string | null;
  cpf: string | null;
  cat: string | null;
  pis: string | null;
  data_entrada: string | null;
  data_saida: string | null;
  salario_beneficios: number;
  salario: number;
  funcao: string | null;
  observacoes: string | null;
}

interface FolhaSalarial {
  id: number;
  mes: string;
  ano: string;
  salario_base: number;
  salario_pago: number;
  itens: {
    id: number;
    data: string;
    tipo: number;
    descricao: string;
    desconto: number;
    adicional: number;
  }[];
}

export default function FuncionariosPage() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(() => localStorage.getItem('last_search_funcionarios') || '');
  const [statusFilter, setStatusFilter] = useState('1'); // Padrão: Ativos

  // Modais / Detalhes
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFuncionario, setEditingFuncionario] = useState<Funcionario | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'salario'>('info');
  const [viewingFunc, setViewingFunc] = useState<Funcionario | null>(null);
  
  // Salários
  const [salarios, setSalarios] = useState<FolhaSalarial[]>([]);
  const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [selectedFolha, setSelectedFolha] = useState<FolhaSalarial | null>(null);

  // Forms
  const [salaryForm, setSalaryForm] = useState({
    mes: String(new Date().getMonth() + 1).padStart(2, '0'),
    ano: String(new Date().getFullYear()),
    salario_base: ''
  });
  
  const [itemForm, setItemForm] = useState({
    data: new Date().toISOString().split('T')[0],
    tipo: '1', // 1: Adicional, 2: Desconto
    descricao: '',
    valor: ''
  });

  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    status: '1',
    acesso: '1',
    login: '',
    senha: '',
    telefone1: '',
    telefone2: '',
    telefone3: '',
    endereco: '',
    bairro: '',
    data_nascimento: '',
    filhos: '0',
    rg: '',
    cpf: '',
    cat: '',
    pis: '',
    data_entrada: '',
    data_saida: '',
    salario_beneficios: '',
    salario: '',
    funcao: '',
    observacoes: ''
  });

  useEffect(() => {
    localStorage.setItem('last_search_funcionarios', searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    fetchFuncionarios();
  }, [statusFilter]);

  const fetchFuncionarios = async () => {
    try {
      setLoading(true);
      const res = await api.get('/funcionarios', {
        params: { status: statusFilter }
      });
      setFuncionarios(res.data);
    } catch (err) {
      console.error(err);
      alert('Erro ao carregar funcionários.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSalarios = async (funcId: number) => {
    try {
      const res = await api.get(`/funcionarios/${funcId}/salarios`);
      setSalarios(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenModal = (f?: Funcionario) => {
    if (f) {
      setEditingFuncionario(f);
      setFormData({
        nome: f.nome || '',
        sobrenome: f.sobrenome || '',
        status: String(f.status ?? '1'),
        acesso: String(f.acesso ?? '1'),
        login: f.login || '',
        senha: '',
        telefone1: f.telefone1 || '',
        telefone2: f.telefone2 || '',
        telefone3: f.telefone3 || '',
        endereco: f.endereco || '',
        bairro: f.bairro || '',
        data_nascimento: f.data_nascimento || '',
        filhos: String(f.filhos ?? '0'),
        rg: f.rg || '',
        cpf: f.cpf || '',
        cat: f.cat || '',
        pis: f.pis || '',
        data_entrada: f.data_entrada || '',
        data_saida: f.data_saida || '',
        salario_beneficios: String(f.salario_beneficios ?? '0'),
        salario: String(f.salario ?? '0'),
        funcao: f.funcao || '',
        observacoes: f.observacoes || ''
      });
    } else {
      setEditingFuncionario(null);
      setFormData({
        nome: '',
        sobrenome: '',
        status: '1',
        acesso: '1',
        login: '',
        senha: '',
        telefone1: '',
        telefone2: '',
        telefone3: '',
        endereco: '',
        bairro: '',
        data_nascimento: '',
        filhos: '0',
        rg: '',
        cpf: '',
        cat: '',
        pis: '',
        data_entrada: new Date().toISOString().split('T')[0],
        data_saida: '',
        salario_beneficios: '0',
        salario: '',
        funcao: '',
        observacoes: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingFuncionario(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        status: Number(formData.status),
        acesso: Number(formData.acesso),
        filhos: Number(formData.filhos),
        salario: parseFloat(formData.salario || '0'),
        salario_beneficios: parseFloat(formData.salario_beneficios || '0')
      };

      if (editingFuncionario) {
        await api.put(`/funcionarios/${editingFuncionario.id}`, payload);
      } else {
        await api.post('/funcionarios', payload);
      }

      handleCloseModal();
      fetchFuncionarios();
    } catch (err: any) {
      console.error(err);
      alert('Erro ao salvar o funcionário.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja remover este funcionário?')) return;
    try {
      await api.delete(`/funcionarios/${id}`);
      fetchFuncionarios();
    } catch (err: any) {
      console.error(err);
      alert('Erro ao excluir o funcionário.');
    }
  };

  const handleAddSalaryRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewingFunc) return;
    try {
      await api.post(`/funcionarios/${viewingFunc.id}/salarios`, {
        mes: salaryForm.mes,
        ano: salaryForm.ano,
        salario_base: parseFloat(salaryForm.salario_base)
      });
      setIsSalaryModalOpen(false);
      fetchSalarios(viewingFunc.id);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || 'Erro ao gerar folha salarial.');
    }
  };

  const handleAddSalaryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFolha || !viewingFunc) return;
    try {
      const isDesconto = itemForm.tipo === '2';
      await api.post(`/funcionarios/salarios/${selectedFolha.id}/itens`, {
        data: itemForm.data,
        tipo: Number(itemForm.tipo),
        descricao: itemForm.descricao,
        desconto: isDesconto ? parseFloat(itemForm.valor) : 0,
        adicional: !isDesconto ? parseFloat(itemForm.valor) : 0
      });
      setItemForm({ ...itemForm, descricao: '', valor: '' });
      setIsItemModalOpen(false);
      fetchSalarios(viewingFunc.id);
    } catch (err: any) {
      console.error(err);
      alert('Erro ao adicionar lançamento.');
    }
  };

  const handleDeleteSalaryItem = async (itemId: number) => {
    if (!window.confirm('Excluir este lançamento?') || !viewingFunc) return;
    try {
      await api.delete(`/funcionarios/salarios-itens/${itemId}`);
      fetchSalarios(viewingFunc.id);
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir lançamento.');
    }
  };
  const formatCurrency = (val: number | null | undefined) => {
    const numericVal = typeof val === 'number' && !isNaN(val) ? val : 0;
    return numericVal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const filteredFuncionarios = funcionarios.filter(f => {
    const nome = f.nome || '';
    const sobrenome = f.sobrenome || '';
    const funcao = f.funcao || '';
    return (
      nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sobrenome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      funcao.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-800 pb-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
            <Briefcase className="text-violet-500" /> Staff e Equipe
            <span className="text-sm font-normal text-gray-500 ml-2">({funcionarios.length} listados)</span>
          </h1>
          <p className="text-gray-400 mt-1">Gerencie a equipe da vidraçaria, motoristas, instaladores e o financeiro mensal de salários.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-primary" onClick={() => handleOpenModal()}>
            <Plus size={18} /> Novo Funcionário
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#111827] p-4 rounded-xl border border-gray-800">
        <div className="relative w-full sm:w-auto flex-grow max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="w-5 h-5 text-gray-400" />
          </span>
          <input 
            type="search" 
            placeholder="Buscar por nome, sobrenome ou cargo..." 
            className="w-full pl-10 pr-4 py-2 text-white bg-transparent border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select 
          className="bg-gray-800 border-none rounded-lg text-sm px-3 py-2 text-white focus:outline-none cursor-pointer w-full sm:w-48"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="1">Funcionários Ativos</option>
          <option value="0">Funcionários Inativos</option>
          <option value="all">Ver Todos</option>
        </select>
      </div>

      {/* Lista de Equipe */}
      {loading ? (
        <div className="py-20 text-center text-gray-500">Carregando dados da equipe...</div>
      ) : filteredFuncionarios.length === 0 ? (
        <div className="card p-12 text-center text-gray-500">
          Nenhum funcionário encontrado.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFuncionarios.map((f) => (
            <div 
              key={f.id} 
              className="card p-5 flex flex-col justify-between hover:border-gray-650 transition-all duration-300 group hover:shadow-lg hover:shadow-violet-500/5 cursor-pointer"
              onClick={() => { setViewingFunc(f); fetchSalarios(f.id); setActiveTab('info'); }}
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-3">
                  <h3 className="text-lg font-black text-white group-hover:text-violet-400 transition-colors">
                    {f.nome} {f.sobrenome}
                  </h3>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${f.status === 1 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-gray-800 text-gray-500 border-gray-700'}`}>
                    {f.status === 1 ? 'Ativo' : 'Afastado'}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-400 mb-4">
                  <p className="font-bold text-white uppercase text-xs tracking-wider mb-2 text-violet-400">{f.funcao || 'Sem Cargo'}</p>
                  {f.telefone1 && (
                    <p className="flex items-center gap-2"><Phone size={14} className="text-gray-500" /> <span>({f.acesso === 2 ? 'Admin' : 'Equipe'}) {f.telefone1}</span></p>
                  )}
                  <p className="flex items-center gap-2"><DollarSign size={14} className="text-gray-500" /> <span>Base: {formatCurrency(f.salario)}</span></p>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-gray-800 pt-3 mt-2" onClick={e => e.stopPropagation()}>
                <button 
                  onClick={() => handleOpenModal(f)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-800 hover:bg-gray-700 text-blue-400 flex items-center gap-1 transition"
                >
                  <Edit2 size={12} /> Editar
                </button>
                <button 
                  onClick={() => handleDelete(f.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-800 hover:bg-red-500/10 text-red-400 flex items-center gap-1 transition"
                >
                  <Trash2 size={12} /> Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Visualização com Histórico Salarial */}
      {viewingFunc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
              <div className="flex items-center gap-2">
                <Briefcase className="text-violet-500" size={24} />
                <h3 className="text-xl font-bold text-white">
                  {viewingFunc.nome} {viewingFunc.sobrenome}
                </h3>
              </div>
              <button onClick={() => setViewingFunc(null)} className="text-gray-400 hover:text-white transition">
                <X size={22} />
              </button>
            </div>

            {/* Abas */}
            <div className="flex border-b border-gray-800 bg-gray-850 px-6 gap-6">
              <button 
                onClick={() => setActiveTab('info')}
                className={`py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition ${activeTab === 'info' ? 'border-violet-500 text-violet-400' : 'border-transparent text-gray-400 hover:text-white'}`}
              >
                Ficha do Funcionário
              </button>
              <button 
                onClick={() => setActiveTab('salario')}
                className={`py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition ${activeTab === 'salario' ? 'border-violet-500 text-violet-400' : 'border-transparent text-gray-400 hover:text-white'}`}
              >
                Controle de Salários (Histórico)
              </button>
            </div>
            
            <div className="p-6 max-h-[450px] overflow-y-auto custom-scrollbar text-sm text-gray-300">
              {activeTab === 'info' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-6 border-b border-gray-700/50">
                    <div>
                      <span className="text-xs text-gray-500 uppercase font-semibold">Cargo / Função</span>
                      <p className="text-base font-bold text-white">{viewingFunc.funcao || 'Não Informado'}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 uppercase font-semibold">Nível de Acesso</span>
                      <p className="text-base font-bold text-violet-400 flex items-center gap-1">
                        <Shield size={14} /> {viewingFunc.acesso === 2 ? 'Administrador' : 'Colaborador comum'}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 uppercase font-semibold">Salário Base</span>
                      <p className="text-base font-bold text-emerald-400">{formatCurrency(viewingFunc.salario)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-gray-700/50">
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Contato e Dados Pessoais</p>
                      <p><strong>Telefone 1:</strong> {viewingFunc.telefone1 || 'Não cadastrado'}</p>
                      <p><strong>Telefone 2:</strong> {viewingFunc.telefone2 || 'Não cadastrado'}</p>
                      <p><strong>Endereço:</strong> {viewingFunc.endereco || 'Não cadastrado'} {viewingFunc.bairro && `, ${viewingFunc.bairro}`}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Documentações e Admissão</p>
                      <p><strong>CPF:</strong> {viewingFunc.cpf || 'Não Informado'}</p>
                      <p><strong>RG:</strong> {viewingFunc.rg || 'Não Informado'}</p>
                      <p><strong>Data de Admissão:</strong> {viewingFunc.data_entrada || 'Não Informada'}</p>
                      <p><strong>Benefícios/Vales Fixos:</strong> {formatCurrency(viewingFunc.salario_beneficios)}</p>
                    </div>
                  </div>

                  {viewingFunc.observacoes && (
                    <div>
                      <span className="text-xs text-gray-500 uppercase font-semibold">Observações</span>
                      <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700 text-xs italic whitespace-pre-line leading-relaxed mt-1">
                        {viewingFunc.observacoes}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'salario' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-800">
                    <h4 className="text-base font-bold text-white uppercase tracking-wider">Histórico de Lançamentos Mensais</h4>
                    <button 
                      onClick={() => {
                        setSalaryForm({
                          mes: String(new Date().getMonth() + 1).padStart(2, '0'),
                          ano: String(new Date().getFullYear()),
                          salario_base: String(viewingFunc.salario)
                        });
                        setIsSalaryModalOpen(true);
                      }}
                      className="bg-violet-600 hover:bg-violet-750 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition"
                    >
                      Iniciar Novo Mês
                    </button>
                  </div>

                  {salarios.length === 0 ? (
                    <p className="text-center py-10 text-gray-500">Nenhuma folha salarial iniciada para este colaborador.</p>
                  ) : (
                    <div className="space-y-6">
                      {salarios.map(folha => (
                        <div key={folha.id} className="bg-gray-900/40 rounded-xl border border-gray-850 p-4">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-800 pb-2 mb-3 gap-2">
                            <div>
                              <span className="text-sm font-black text-white uppercase tracking-widest">Referência: {folha.mes}/{folha.ano}</span>
                              <span className="text-xs text-gray-500 ml-2 font-semibold">Base: {formatCurrency(folha.salario_base)}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-black text-emerald-400">Total Pago: {formatCurrency(folha.salario_pago)}</span>
                              <button 
                                onClick={() => { setSelectedFolha(folha); setIsItemModalOpen(true); }}
                                className="text-xs font-bold text-violet-400 hover:text-white transition flex items-center gap-1"
                              >
                                <Plus size={14} /> Lançar Item
                              </button>
                            </div>
                          </div>

                          {/* Listar Adicionais/Descontos */}
                          {folha.itens.length === 0 ? (
                            <p className="text-xs text-gray-500 italic">Sem adicionais ou descontos neste mês.</p>
                          ) : (
                            <div className="space-y-1.5 max-h-[150px] overflow-y-auto pr-1.5 custom-scrollbar">
                              {folha.itens.map(item => {
                                const isAdic = item.adicional > 0;
                                return (
                                  <div key={item.id} className="flex justify-between items-center text-xs py-1 hover:bg-gray-800/30 px-2 rounded transition">
                                    <div className="flex items-center gap-2">
                                      {isAdic ? <PlusCircle size={12} className="text-emerald-500" /> : <MinusCircle size={12} className="text-rose-500" />}
                                      <span className="text-gray-400 font-semibold">{item.data}</span>
                                      <span className="text-white font-bold">{item.descricao}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className={isAdic ? 'text-emerald-400 font-black' : 'text-rose-400 font-black'}>
                                        {isAdic ? '+' : '-'} {formatCurrency(isAdic ? item.adicional : item.desconto)}
                                      </span>
                                      <button 
                                        onClick={() => handleDeleteSalaryItem(item.id)}
                                        className="text-gray-500 hover:text-red-400 transition"
                                      >
                                        <X size={12} />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-700 bg-gray-800/30 flex justify-end">
              <button 
                onClick={() => setViewingFunc(null)}
                className="px-6 py-2 rounded-lg bg-gray-900 hover:bg-gray-950 text-white font-bold text-sm transition"
              >
                Fechar Ficha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Iniciar Novo Mês Salarial */}
      {isSalaryModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Novo Mês de Folha Salarial</h3>
              <button onClick={() => setIsSalaryModalOpen(false)} className="text-gray-400 hover:text-white transition">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddSalaryRecord} className="p-5 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Mês (MM)</label>
                  <input 
                    type="text" 
                    required
                    placeholder="06"
                    className="input-field bg-gray-900 text-white rounded-lg p-2.5 w-full border border-gray-700 focus:outline-none" 
                    value={salaryForm.mes}
                    onChange={e => setSalaryForm({...salaryForm, mes: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Ano (AAAA)</label>
                  <input 
                    type="text" 
                    required
                    placeholder="2026"
                    className="input-field bg-gray-900 text-white rounded-lg p-2.5 w-full border border-gray-700 focus:outline-none" 
                    value={salaryForm.ano}
                    onChange={e => setSalaryForm({...salaryForm, ano: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Salário Base (R$)</label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  placeholder="0,00"
                  className="input-field bg-gray-900 text-white rounded-lg p-2.5 w-full border border-gray-700 focus:outline-none" 
                  value={salaryForm.salario_base}
                  onChange={e => setSalaryForm({...salaryForm, salario_base: e.target.value})}
                />
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setIsSalaryModalOpen(false)} className="px-4 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-bold text-xs">
                  Cancelar
                </button>
                <button type="submit" className="btn-primary py-1.5 text-xs">
                  Iniciar Folha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Lançar Item Salarial (Adicional/Desconto) */}
      {isItemModalOpen && selectedFolha && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Lançar Item para {selectedFolha.mes}/{selectedFolha.ano}</h3>
              <button onClick={() => setIsItemModalOpen(false)} className="text-gray-400 hover:text-white transition">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddSalaryItem} className="p-5 space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Tipo de Lançamento</label>
                <select 
                  className="input-field cursor-pointer bg-gray-900 text-white rounded-lg p-2.5 w-full border border-gray-700 focus:outline-none"
                  value={itemForm.tipo}
                  onChange={e => setItemForm({...itemForm, tipo: e.target.value})}
                >
                  <option value="1" className="bg-gray-800">Adicional (+)</option>
                  <option value="2" className="bg-gray-800">Desconto (-)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Descrição</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Hora extra 50%, Vale combustível, Adiantamento..."
                  className="input-field bg-gray-900 text-white rounded-lg p-2.5 w-full border border-gray-700 focus:outline-none" 
                  value={itemForm.descricao}
                  onChange={e => setItemForm({...itemForm, descricao: e.target.value})}
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
                    value={itemForm.valor}
                    onChange={e => setItemForm({...itemForm, valor: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Data Lançamento</label>
                  <input 
                    type="date" 
                    required
                    className="input-field bg-gray-900 text-white rounded-lg p-2.5 w-full border border-gray-700 focus:outline-none" 
                    value={itemForm.data}
                    onChange={e => setItemForm({...itemForm, data: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setIsItemModalOpen(false)} className="px-4 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-bold text-xs">
                  Cancelar
                </button>
                <button type="submit" className="btn-primary py-1.5 text-xs">
                  Lançar Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Cadastro/Edição Funcionário */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="text-violet-500" size={20} />
                {editingFuncionario ? 'Editar Funcionário' : 'Novo Funcionário'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-white transition">
                <X size={22} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Nome</label>
                  <input 
                    type="text" 
                    required
                    className="input-field bg-gray-900 text-white rounded-lg p-2.5 w-full border border-gray-700 focus:outline-none" 
                    value={formData.nome}
                    onChange={e => setFormData({...formData, nome: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Sobrenome</label>
                  <input 
                    type="text" 
                    className="input-field bg-gray-900 text-white rounded-lg p-2.5 w-full border border-gray-700 focus:outline-none" 
                    value={formData.sobrenome}
                    onChange={e => setFormData({...formData, sobrenome: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Status</label>
                  <select 
                    className="input-field cursor-pointer bg-gray-900 text-white rounded-lg p-2.5 w-full border border-gray-700 focus:outline-none"
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="1">Ativo</option>
                    <option value="0">Inativo / Desligado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Cargo / Função</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Instalador, Motorista, Auxiliar..."
                    className="input-field bg-gray-900 text-white rounded-lg p-2.5 w-full border border-gray-700 focus:outline-none" 
                    value={formData.funcao}
                    onChange={e => setFormData({...formData, funcao: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Nível de Acesso</label>
                  <select 
                    className="input-field cursor-pointer bg-gray-900 text-white rounded-lg p-2.5 w-full border border-gray-700 focus:outline-none"
                    value={formData.acesso}
                    onChange={e => setFormData({...formData, acesso: e.target.value})}
                  >
                    <option value="1">Colaborador / Equipe</option>
                    <option value="2">Administrador</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Login de Usuário (Painel)</label>
                  <input 
                    type="text" 
                    className="input-field bg-gray-900 text-white rounded-lg p-2.5 w-full border border-gray-700 focus:outline-none" 
                    value={formData.login}
                    onChange={e => setFormData({...formData, login: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Senha (deixe em branco para não alterar)</label>
                  <input 
                    type="password" 
                    className="input-field bg-gray-900 text-white rounded-lg p-2.5 w-full border border-gray-700 focus:outline-none" 
                    value={formData.senha}
                    onChange={e => setFormData({...formData, senha: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Telefone Principal</label>
                  <input 
                    type="text" 
                    className="input-field bg-gray-900 text-white rounded-lg p-2.5 w-full border border-gray-700 focus:outline-none" 
                    value={formData.telefone1}
                    onChange={e => setFormData({...formData, telefone1: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Telefone 2</label>
                  <input 
                    type="text" 
                    className="input-field bg-gray-900 text-white rounded-lg p-2.5 w-full border border-gray-700 focus:outline-none" 
                    value={formData.telefone2}
                    onChange={e => setFormData({...formData, telefone2: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Data Nascimento</label>
                  <input 
                    type="date" 
                    className="input-field bg-gray-900 text-white rounded-lg p-2.5 w-full border border-gray-700 focus:outline-none" 
                    value={formData.data_nascimento}
                    onChange={e => setFormData({...formData, data_nascimento: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Endereço Residencial</label>
                  <input 
                    type="text" 
                    className="input-field bg-gray-900 text-white rounded-lg p-2.5 w-full border border-gray-700 focus:outline-none" 
                    value={formData.endereco}
                    onChange={e => setFormData({...formData, endereco: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Bairro</label>
                  <input 
                    type="text" 
                    className="input-field bg-gray-900 text-white rounded-lg p-2.5 w-full border border-gray-700 focus:outline-none" 
                    value={formData.bairro}
                    onChange={e => setFormData({...formData, bairro: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Filhos</label>
                  <input 
                    type="number" 
                    className="input-field bg-gray-900 text-white rounded-lg p-2.5 w-full border border-gray-700 focus:outline-none" 
                    value={formData.filhos}
                    onChange={e => setFormData({...formData, filhos: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">RG</label>
                  <input 
                    type="text" 
                    className="input-field bg-gray-900 text-white rounded-lg p-2.5 w-full border border-gray-700 focus:outline-none" 
                    value={formData.rg}
                    onChange={e => setFormData({...formData, rg: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">CPF</label>
                  <input 
                    type="text" 
                    placeholder="000.000.000-00"
                    className="input-field bg-gray-900 text-white rounded-lg p-2.5 w-full border border-gray-700 focus:outline-none" 
                    value={formData.cpf}
                    onChange={e => setFormData({...formData, cpf: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Categoria CNH (CAT)</label>
                  <input 
                    type="text" 
                    placeholder="Ex: AB, D..."
                    className="input-field bg-gray-900 text-white rounded-lg p-2.5 w-full border border-gray-700 focus:outline-none" 
                    value={formData.cat}
                    onChange={e => setFormData({...formData, cat: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Salário Base Mensal (R$)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    placeholder="0,00"
                    className="input-field bg-gray-900 text-white rounded-lg p-2.5 w-full border border-gray-700 focus:outline-none" 
                    value={formData.salario}
                    onChange={e => setFormData({...formData, salario: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Vales Fixos / Benefícios (R$)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    placeholder="0,00"
                    className="input-field bg-gray-900 text-white rounded-lg p-2.5 w-full border border-gray-700 focus:outline-none" 
                    value={formData.salario_beneficios}
                    onChange={e => setFormData({...formData, salario_beneficios: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Data Admissão</label>
                  <input 
                    type="date" 
                    className="input-field bg-gray-900 text-white rounded-lg p-2.5 w-full border border-gray-700 focus:outline-none" 
                    value={formData.data_entrada}
                    onChange={e => setFormData({...formData, data_entrada: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Data Demissão / Saída</label>
                  <input 
                    type="date" 
                    className="input-field bg-gray-900 text-white rounded-lg p-2.5 w-full border border-gray-700 focus:outline-none" 
                    value={formData.data_saida}
                    onChange={e => setFormData({...formData, data_saida: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Observações / Histórico de Equipe</label>
                <textarea 
                  rows={3}
                  className="input-field bg-gray-900 text-white rounded-lg p-2.5 w-full border border-gray-700 focus:outline-none" 
                  value={formData.observacoes}
                  onChange={e => setFormData({...formData, observacoes: e.target.value})}
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={handleCloseModal} className="px-5 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-bold text-sm transition">
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingFuncionario ? 'Salvar Alterações' : 'Cadastrar Funcionário'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
