import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Truck, X, Phone, Mail, MapPin, Building, FileText } from 'lucide-react';
import { api } from '../lib/api';

interface Fornecedor {
  id: number;
  categoria_id: number | null;
  nome: string;
  contato: string | null;
  ddd: number | null;
  telefone1: string | null;
  telefone2: string | null;
  telefone3: string | null;
  endereco: string | null;
  bairro: string | null;
  referencia: string | null;
  cep: string | null;
  email: string | null;
  cnpj: string | null;
  ie: string | null;
  observacoes: string | null;
  nome_categoria: string | null;
}

interface Categoria {
  id: number;
  name: string;
}

export default function FornecedoresPage() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [viewingFornecedor, setViewingFornecedor] = useState<Fornecedor | null>(null);
  const [editingFornecedor, setEditingFornecedor] = useState<Fornecedor | null>(null);
  
  // Forms
  const [newCatName, setNewCatName] = useState('');
  const [formData, setFormData] = useState({
    nome: '',
    categoria_id: '',
    contato: '',
    ddd: '',
    telefone1: '',
    telefone2: '',
    telefone3: '',
    endereco: '',
    bairro: '',
    referencia: '',
    cep: '',
    email: '',
    cnpj: '',
    ie: '',
    observacoes: ''
  });

  useEffect(() => {
    fetchFornecedores();
    fetchCategorias();
  }, []);

  const fetchFornecedores = async () => {
    try {
      setLoading(true);
      const res = await api.get('/fornecedores');
      setFornecedores(res.data);
    } catch (err) {
      console.error(err);
      alert('Erro ao carregar fornecedores.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategorias = async () => {
    try {
      const res = await api.get('/fornecedores/categorias');
      setCategorias(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenModal = (f?: Fornecedor) => {
    if (f) {
      setEditingFornecedor(f);
      setFormData({
        nome: f.nome,
        categoria_id: f.categoria_id ? String(f.categoria_id) : '',
        contato: f.contato || '',
        ddd: f.ddd ? String(f.ddd) : '',
        telefone1: f.telefone1 || '',
        telefone2: f.telefone2 || '',
        telefone3: f.telefone3 || '',
        endereco: f.endereco || '',
        bairro: f.bairro || '',
        referencia: f.referencia || '',
        cep: f.cep || '',
        email: f.email || '',
        cnpj: f.cnpj || '',
        ie: f.ie || '',
        observacoes: f.observacoes || ''
      });
    } else {
      setEditingFornecedor(null);
      setFormData({
        nome: '',
        categoria_id: categorias[0] ? String(categorias[0].id) : '',
        contato: '',
        ddd: '11',
        telefone1: '',
        telefone2: '',
        telefone3: '',
        endereco: '',
        bairro: '',
        referencia: '',
        cep: '',
        email: '',
        cnpj: '',
        ie: '',
        observacoes: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingFornecedor(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        categoria_id: formData.categoria_id ? Number(formData.categoria_id) : null,
        ddd: formData.ddd ? Number(formData.ddd) : null
      };

      if (editingFornecedor) {
        await api.put(`/fornecedores/${editingFornecedor.id}`, payload);
      } else {
        await api.post('/fornecedores', payload);
      }

      handleCloseModal();
      fetchFornecedores();
    } catch (err: any) {
      console.error(err);
      alert('Erro ao salvar o fornecedor.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este fornecedor?')) return;
    try {
      await api.delete(`/fornecedores/${id}`);
      fetchFornecedores();
    } catch (err: any) {
      console.error(err);
      alert('Erro ao excluir o fornecedor.');
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      await api.post('/fornecedores/categorias', { name: newCatName });
      setNewCatName('');
      setIsCatModalOpen(false);
      fetchCategorias();
    } catch (err) {
      console.error(err);
      alert('Erro ao adicionar categoria.');
    }
  };

  const formatPhone = (ddd: number | null, phone: string | null) => {
    if (!phone) return '';
    return ddd ? `(${ddd}) ${phone}` : phone;
  };

  const filteredFornecedores = fornecedores.filter(f => {
    const matchesSearch = 
      f.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.cnpj && f.cnpj.includes(searchTerm)) ||
      (f.contato && f.contato.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (f.email && f.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === '' || String(f.categoria_id) === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-800 pb-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
            <Truck className="text-orange-500" /> Fornecedores
            <span className="text-sm font-normal text-gray-500 ml-2">({fornecedores.length} total)</span>
          </h1>
          <p className="text-gray-400 mt-1">Gerencie os fornecedores de insumos, chapas de vidro, puxadores e ferragens.</p>
        </div>
        <div className="flex gap-2">
          <button 
            className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-bold transition border border-gray-700"
            onClick={() => setIsCatModalOpen(true)}
          >
            Nova Categoria
          </button>
          <button className="btn-primary" onClick={() => handleOpenModal()}>
            <Plus size={18} /> Novo Fornecedor
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
            placeholder="Buscar por nome, contato, email ou cnpj..." 
            className="w-full pl-10 pr-4 py-2 text-white bg-transparent border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select 
          className="bg-gray-800 border-none rounded-lg text-sm px-3 py-2 text-white focus:outline-none cursor-pointer w-full sm:w-48"
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
        >
          <option value="">Todas as Categorias</option>
          {categorias.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Grid de Fornecedores */}
      {loading ? (
        <div className="py-20 text-center text-gray-500">Carregando fornecedores...</div>
      ) : filteredFornecedores.length === 0 ? (
        <div className="card p-12 text-center text-gray-500">
          Nenhum fornecedor encontrado para os filtros selecionados.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFornecedores.map((f) => (
            <div 
              key={f.id} 
              className="card p-5 flex flex-col justify-between hover:border-gray-600 transition-all duration-300 group hover:shadow-lg hover:shadow-orange-500/5 cursor-pointer"
              onClick={() => setViewingFornecedor(f)}
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-3">
                  <h3 className="text-lg font-black text-white group-hover:text-orange-400 transition-colors truncate">
                    {f.nome}
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-full whitespace-nowrap">
                    {f.nome_categoria || 'Sem Categoria'}
                  </span>
                </div>
                
                <div className="space-y-2.5 text-sm text-gray-400 mb-4">
                  {f.contato && (
                    <p className="flex items-center gap-2">
                      <Phone size={14} className="text-gray-500 flex-shrink-0" />
                      <span>{f.contato} {f.telefone1 && `• ${formatPhone(f.ddd, f.telefone1)}`}</span>
                    </p>
                  )}
                  {!f.contato && f.telefone1 && (
                    <p className="flex items-center gap-2">
                      <Phone size={14} className="text-gray-500 flex-shrink-0" />
                      <span>{formatPhone(f.ddd, f.telefone1)}</span>
                    </p>
                  )}
                  {f.email && (
                    <p className="flex items-center gap-2 truncate">
                      <Mail size={14} className="text-gray-500 flex-shrink-0" />
                      <span className="truncate">{f.email}</span>
                    </p>
                  )}
                  {f.cnpj && (
                    <p className="flex items-center gap-2">
                      <Building size={14} className="text-gray-500 flex-shrink-0" />
                      <span>CNPJ: {f.cnpj}</span>
                    </p>
                  )}
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

      {/* Modal Visualização Detalhada */}
      {viewingFornecedor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
              <div className="flex items-center gap-2">
                <Truck className="text-orange-500" size={24} />
                <h3 className="text-xl font-bold text-white truncate max-w-[280px]">
                  {viewingFornecedor.nome}
                </h3>
              </div>
              <button onClick={() => setViewingFornecedor(null)} className="text-gray-400 hover:text-white transition">
                <X size={22} />
              </button>
            </div>
            
            <div className="p-6 space-y-6 max-h-[500px] overflow-y-auto custom-scrollbar text-sm text-gray-300">
              {/* Infos Gerais */}
              <div className="grid grid-cols-2 gap-4 border-b border-gray-700/50 pb-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Categoria</p>
                  <p className="font-bold text-orange-400">{viewingFornecedor.nome_categoria || 'Sem Categoria'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Contato Interno</p>
                  <p className="font-bold text-white">{viewingFornecedor.contato || 'Não Informado'}</p>
                </div>
              </div>

              {/* Contato Telefônico */}
              <div className="space-y-2 border-b border-gray-700/50 pb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Telefones e Comunicação</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {viewingFornecedor.telefone1 && (
                    <p className="flex items-center gap-2"><Phone size={14} className="text-gray-500" /> <span>Tel 1: {formatPhone(viewingFornecedor.ddd, viewingFornecedor.telefone1)}</span></p>
                  )}
                  {viewingFornecedor.telefone2 && (
                    <p className="flex items-center gap-2"><Phone size={14} className="text-gray-500" /> <span>Tel 2: {formatPhone(viewingFornecedor.ddd, viewingFornecedor.telefone2)}</span></p>
                  )}
                  {viewingFornecedor.telefone3 && (
                    <p className="flex items-center gap-2"><Phone size={14} className="text-gray-500" /> <span>Tel 3: {formatPhone(viewingFornecedor.ddd, viewingFornecedor.telefone3)}</span></p>
                  )}
                  {viewingFornecedor.email && (
                    <p className="flex items-center gap-2 col-span-1 sm:col-span-2"><Mail size={14} className="text-gray-500" /> <span>Email: {viewingFornecedor.email}</span></p>
                  )}
                </div>
              </div>

              {/* Endereço */}
              <div className="space-y-2 border-b border-gray-700/50 pb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Endereço e Localização</p>
                <div className="space-y-1.5">
                  <p className="flex items-start gap-2"><MapPin size={14} className="text-gray-500 mt-0.5" /> <span>{viewingFornecedor.endereco || 'Sem endereço cadastrado.'}</span></p>
                  {viewingFornecedor.bairro && <p className="pl-6 text-xs text-gray-400">Bairro: {viewingFornecedor.bairro} {viewingFornecedor.cep && `• CEP: ${viewingFornecedor.cep}`}</p>}
                  {viewingFornecedor.referencia && <p className="pl-6 text-xs text-gray-500 italic">Ref: {viewingFornecedor.referencia}</p>}
                </div>
              </div>

              {/* Dados Fiscais */}
              {(viewingFornecedor.cnpj || viewingFornecedor.ie) && (
                <div className="space-y-2 border-b border-gray-700/50 pb-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Dados Fiscais</p>
                  <div className="grid grid-cols-2 gap-4">
                    {viewingFornecedor.cnpj && (
                      <div>
                        <span className="text-xs text-gray-500 block">CNPJ</span>
                        <span className="font-mono text-xs">{viewingFornecedor.cnpj}</span>
                      </div>
                    )}
                    {viewingFornecedor.ie && (
                      <div>
                        <span className="text-xs text-gray-500 block">Inscrição Estadual (IE)</span>
                        <span className="font-mono text-xs">{viewingFornecedor.ie}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Observações */}
              {viewingFornecedor.observacoes && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1"><FileText size={13} /> Observações Internas</p>
                  <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700 text-xs italic leading-relaxed whitespace-pre-line">
                    {viewingFornecedor.observacoes}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-700 bg-gray-800/30 flex justify-end gap-2">
              <button 
                onClick={() => { handleOpenModal(viewingFornecedor); setViewingFornecedor(null); }}
                className="px-5 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-blue-400 font-bold text-sm transition"
              >
                Editar
              </button>
              <button 
                onClick={() => setViewingFornecedor(null)}
                className="px-5 py-2 rounded-lg bg-gray-900 hover:bg-gray-950 text-white font-bold text-sm transition"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Cadastro/Edição Fornecedor */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Truck className="text-orange-500" size={20} />
                {editingFornecedor ? 'Editar Fornecedor' : 'Novo Fornecedor'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-white transition">
                <X size={22} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Nome Fantasia / Razão Social</label>
                  <input 
                    type="text" 
                    required
                    className="input-field bg-gray-900 text-white rounded-lg p-2.5 w-full border border-gray-700 focus:outline-none" 
                    value={formData.nome}
                    onChange={e => setFormData({...formData, nome: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Categoria</label>
                  <select 
                    className="input-field cursor-pointer bg-gray-900 text-white rounded-lg p-2.5 w-full border border-gray-700 focus:outline-none"
                    value={formData.categoria_id}
                    onChange={e => setFormData({...formData, categoria_id: e.target.value})}
                  >
                    <option value="">Nenhuma Categoria</option>
                    {categorias.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Contato (Pessoa)</label>
                  <input 
                    type="text" 
                    className="input-field bg-gray-900 text-white rounded-lg p-2.5 w-full border border-gray-700 focus:outline-none" 
                    value={formData.contato}
                    onChange={e => setFormData({...formData, contato: e.target.value})}
                  />
                </div>
                <div className="col-span-2 grid grid-cols-4 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">DDD</label>
                    <input 
                      type="number" 
                      className="input-field bg-gray-900 text-white rounded-lg p-2.5 w-full border border-gray-700 focus:outline-none" 
                      value={formData.ddd}
                      onChange={e => setFormData({...formData, ddd: e.target.value})}
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Telefone Principal</label>
                    <input 
                      type="text" 
                      className="input-field bg-gray-900 text-white rounded-lg p-2.5 w-full border border-gray-700 focus:outline-none" 
                      value={formData.telefone1}
                      onChange={e => setFormData({...formData, telefone1: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Telefone Secundário</label>
                  <input 
                    type="text" 
                    className="input-field bg-gray-900 text-white rounded-lg p-2.5 w-full border border-gray-700 focus:outline-none" 
                    value={formData.telefone2}
                    onChange={e => setFormData({...formData, telefone2: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Email Corporativo</label>
                  <input 
                    type="email" 
                    className="input-field bg-gray-900 text-white rounded-lg p-2.5 w-full border border-gray-700 focus:outline-none" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Endereço (Rua, Nº)</label>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">CNPJ</label>
                  <input 
                    type="text" 
                    placeholder="00.000.000/0000-00"
                    className="input-field bg-gray-900 text-white rounded-lg p-2.5 w-full border border-gray-700 focus:outline-none" 
                    value={formData.cnpj}
                    onChange={e => setFormData({...formData, cnpj: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Inscrição Estadual (IE)</label>
                  <input 
                    type="text" 
                    className="input-field bg-gray-900 text-white rounded-lg p-2.5 w-full border border-gray-700 focus:outline-none" 
                    value={formData.ie}
                    onChange={e => setFormData({...formData, ie: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Observações / Notas Internas</label>
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
                  {editingFornecedor ? 'Salvar Alterações' : 'Cadastrar Fornecedor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Nova Categoria */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Nova Categoria de Fornecedor</h3>
              <button onClick={() => setIsCatModalOpen(false)} className="text-gray-400 hover:text-white transition">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddCategory} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Nome da Categoria</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Vidros, Alumínios, Ferragens..."
                  className="input-field bg-gray-900 text-white rounded-lg p-2.5 w-full border border-gray-700 focus:outline-none text-sm" 
                  value={newCatName}
                  onChange={e => setNewCatName(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button 
                  type="button" 
                  onClick={() => setIsCatModalOpen(false)} 
                  className="px-4 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-bold text-xs transition"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary py-1.5 text-xs">
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
