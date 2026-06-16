import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Package, X, FolderTree, Paintbrush, Upload, Image as ImageIcon, Star, StarOff, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

interface Categoria {
  id: number;
  nome: string;
}

interface ProdutoImagem {
  id?: number;
  url: string;
  principal: boolean;
}

interface ProdutoVariacao {
  id?: number;
  nome: string;
  opcao: string;
  tipo_acrescimo: 'VALOR' | 'PERCENTUAL';
  valor_acrescimo: number | string;
}

interface Produto {
  id: number;
  nome: string;
  sku: string;
  descricao?: string | null;
  ncm?: string | null;
  preco_venda: string | number;
  unidade_medida: string;
  status: boolean;
  largura_maxima?: string | number | null;
  altura_maxima?: string | number | null;
  comprimento_maximo?: string | number | null;
  categoria_id?: number | null;
  categoria?: Categoria | null;
  imagens?: ProdutoImagem[];
  variacoes?: ProdutoVariacao[];
}

export default function ProductsPage() {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(() => localStorage.getItem('last_search_products') || '');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduto, setEditingProduto] = useState<Produto | null>(null);
  const [formData, setFormData] = useState({ 
    nome: '', 
    sku: '', 
    descricao: '',
    ncm: '',
    preco_venda: '', 
    unidade_medida: 'UN', 
    status: true, 
    categoria_id: '',
    largura_maxima: '',
    altura_maxima: '',
    comprimento_maximo: '',
  });

  const [imagens, setImagens] = useState<ProdutoImagem[]>([]);
  const [variacoes, setVariacoes] = useState<ProdutoVariacao[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    localStorage.setItem('last_search_products', searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        api.get('/produtos'),
        api.get('/categorias')
      ]);
      setProdutos(prodRes.data);
      setCategorias(catRes.data);
    } catch (err) {
      console.error(err);
      // alert('Erro ao carregar dados.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (prod?: Produto) => {
    if (prod) {
      setEditingProduto(prod);
      setFormData({
        nome: prod.nome,
        sku: prod.sku || '',
        descricao: prod.descricao || '',
        ncm: prod.ncm || '',
        preco_venda: String(prod.preco_venda),
        unidade_medida: prod.unidade_medida,
        status: prod.status,
        categoria_id: prod.categoria_id ? String(prod.categoria_id) : '',
        largura_maxima: prod.largura_maxima ? String(prod.largura_maxima) : '',
        altura_maxima: prod.altura_maxima ? String(prod.altura_maxima) : '',
        comprimento_maximo: prod.comprimento_maximo ? String(prod.comprimento_maximo) : '',
      });
      setImagens(prod.imagens || []);
      setVariacoes(prod.variacoes || []);
    } else {
      setEditingProduto(null);
      setFormData({ 
        nome: '', 
        sku: '', 
        descricao: '',
        ncm: '',
        preco_venda: '', 
        unidade_medida: 'UN', 
        status: true, 
        categoria_id: '',
        largura_maxima: '',
        altura_maxima: '',
        comprimento_maximo: '',
      });
      setImagens([]);
      setVariacoes([]);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduto(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    const file = e.target.files[0];
    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      setUploading(true);
      const res = await api.post('/produtos/upload', uploadData);
      const newImg: ProdutoImagem = {
        url: res.data.url,
        principal: imagens.length === 0
      };
      setImagens([...imagens, newImg]);
    } catch (err) {
      console.error(err);
      alert('Erro ao fazer upload da imagem.');
    } finally {
      setUploading(false);
    }
  };

  const togglePrincipal = (index: number) => {
    const newImagens = imagens.map((img, i) => ({
      ...img,
      principal: i === index
    }));
    setImagens(newImagens);
  };

  const removeImage = (index: number) => {
    const newImagens = imagens.filter((_, i) => i !== index);
    // Garantir que resta uma principal se houver imagens
    if (newImagens.length > 0 && !newImagens.some(img => img.principal)) {
      newImagens[0].principal = true;
    }
    setImagens(newImagens);
  };

  const addVariacao = () => {
    setVariacoes([...variacoes, { nome: '', opcao: '', tipo_acrescimo: 'VALOR', valor_acrescimo: 0 }]);
  };

  const updateVariacao = (index: number, field: keyof ProdutoVariacao, value: string) => {
    const newVariacoes = [...variacoes];
    (newVariacoes[index] as any)[field] = value;
    setVariacoes(newVariacoes);
  };

  const removeVariacao = (index: number) => {
    setVariacoes(variacoes.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        preco_venda: parseFloat(formData.preco_venda),
        categoria_id: formData.categoria_id ? Number(formData.categoria_id) : null,
        largura_maxima: formData.largura_maxima ? parseFloat(formData.largura_maxima) : null,
        altura_maxima: formData.altura_maxima ? parseFloat(formData.altura_maxima) : null,
        comprimento_maximo: formData.comprimento_maximo ? parseFloat(formData.comprimento_maximo) : null,
        imagens: imagens.map(img => ({ url: img.url, principal: img.principal })),
        variacoes: variacoes.map(v => ({ 
          nome: v.nome, 
          opcao: v.opcao, 
          valor_acrescimo: parseFloat(String(v.valor_acrescimo)) || 0 
        }))
      };

      if (editingProduto) {
        await api.put(`/produtos/${editingProduto.id}`, payload);
      } else {
        await api.post('/produtos', payload);
      }
      
      handleCloseModal();
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar o produto.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) return;
    try {
      await api.delete(`/produtos/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir o produto.');
    }
  };

  const filteredProdutos = produtos.filter(p => 
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-700 pb-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
            <Package className="text-blue-500" /> Produtos
          </h1>
          <p className="text-gray-400 mt-1">Gerencie seu catálogo de produtos, preços e estoques.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold transition flex items-center gap-2 border border-gray-700" onClick={() => navigate('/categorias')}>
            <FolderTree size={18} className="text-blue-400" /> Categorias
          </button>
          <button className="btn-primary" onClick={() => handleOpenModal()}>
            <Plus size={18} /> Novo Produto
          </button>
        </div>
      </div>

      <div className="card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-auto flex-grow">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="w-5 h-5 text-gray-400" />
            </span>
            <input 
              type="search" 
              placeholder="Buscar por nome ou SKU..." 
              className="w-full pl-10 pr-4 py-2 text-white bg-transparent border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Produto</th>
                <th className="py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Categoria</th>
                <th className="py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Preço Base</th>
                <th className="py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">Carregando...</td>
                </tr>
              ) : filteredProdutos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">Nenhum produto encontrado.</td>
                </tr>
              ) : (
                filteredProdutos.map((prod) => {
                  const imgPrincipal = prod.imagens?.find(img => img.principal) || prod.imagens?.[0];
                  return (
                    <tr key={prod.id} className="hover:bg-white/5 transition-colors duration-200">
                      <td className="py-4 px-4 text-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-gray-700 overflow-hidden flex-shrink-0 border border-gray-600">
                            {imgPrincipal ? (
                              <img src={`${api.defaults.baseURL?.replace('/api', '')}${imgPrincipal.url}`} alt={prod.nome} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-500">
                                <ImageIcon size={20} />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-white text-base leading-tight">{prod.nome}</div>
                            <div className="text-xs text-gray-400 mt-1 inline-flex items-center gap-1 bg-gray-800/80 px-1.5 py-0.5 rounded border border-gray-700">
                              <span className="opacity-60 text-[10px] uppercase font-bold tracking-wider">SKU</span> {prod.sku || '-'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-400">
                        {prod.categoria?.nome || <span className="text-gray-500 italic text-xs">Sem categoria</span>}
                      </td>
                      <td className="py-4 px-4 text-sm font-semibold text-white">
                        <span className="text-xs text-blue-400 mr-1">R$</span>
                        {Number(prod.preco_venda).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          prod.status ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-gray-700 text-gray-400 border border-gray-600'
                        }`}>
                          {prod.status ? 'Ativo' : 'Pausado'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex justify-end gap-1">
                          <button 
                            onClick={() => handleOpenModal(prod)}
                            className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                            title="Editar"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(prod.id)}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                            title="Excluir"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto pt-10 pb-10">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden transform transition-all animate-in zoom-in-95 duration-200 text-left">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  {editingProduto ? <Edit2 size={20} className="text-blue-400" /> : <Plus size={20} className="text-emerald-400" />}
                  {editingProduto ? 'Editar Produto' : 'Cadastrar Novo Produto'}
                </h3>
                <p className="text-xs text-gray-500 mt-1">Preencha os dados técnicos e visuais do produto.</p>
              </div>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-red-400 transition p-2 bg-gray-800 rounded-full">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              {/* Seção 1: Visual e Galeria */}
              <div>
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <ImageIcon size={16} className="text-blue-500" /> Galeria de Imagens
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                  {imagens.map((img, idx) => (
                    <div key={idx} className={`relative aspect-square rounded-xl overflow-hidden group border-2 ${img.principal ? 'border-blue-500' : 'border-gray-700'}`}>
                      <img src={`${api.defaults.baseURL?.replace('/api', '')}${img.url}`} className="w-full h-full object-cover" alt="" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button 
                          type="button"
                          onClick={() => togglePrincipal(idx)}
                          className={`p-2 rounded-full transition ${img.principal ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                        >
                          {img.principal ? <Star size={16} /> : <StarOff size={16} />}
                        </button>
                        <button 
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="p-2 bg-red-500/80 text-white rounded-full hover:bg-red-500 transition"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                      {img.principal && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-blue-500 text-[8px] font-bold text-white rounded-full uppercase">Principal</div>
                      )}
                    </div>
                  ))}
                  <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-700 rounded-xl hover:border-blue-500 hover:bg-blue-500/5 cursor-pointer transition group">
                    <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" disabled={uploading} />
                    {uploading ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    ) : (
                      <>
                        <Upload size={24} className="text-gray-500 group-hover:text-blue-500 mb-2" />
                        <span className="text-[10px] text-gray-500 font-bold uppercase group-hover:text-blue-500">Adicionar Foto</span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Seção 2: Dados Gerais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-400 mb-2">Nome do Produto <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ex: Espelho Adnet Couro Preto"
                    className="input-field" 
                    value={formData.nome}
                    onChange={e => setFormData({...formData, nome: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">Código SKU / Referência</label>
                  <input 
                    type="text" 
                    placeholder="EXP-123-PRE"
                    className="input-field" 
                    value={formData.sku}
                    onChange={e => setFormData({...formData, sku: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">NCM (Fiscal)</label>
                  <input 
                    type="text" 
                    placeholder="0000.00.00"
                    className="input-field" 
                    value={formData.ncm}
                    onChange={e => setFormData({...formData, ncm: e.target.value})}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-400 mb-2">Categoria</label>
                  <select 
                    className="input-field"
                    value={formData.categoria_id}
                    onChange={e => setFormData({...formData, categoria_id: e.target.value})}
                  >
                    <option value="">Selecione uma categoria...</option>
                    {categorias.map(c => (
                      <option key={c.id} value={c.id} className="bg-gray-800">{c.nome}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">Preço Base (R$) <span className="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    step="0.01" 
                    required
                    placeholder="0,00"
                    className="input-field font-semibold text-emerald-400" 
                    value={formData.preco_venda}
                    onChange={e => setFormData({...formData, preco_venda: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">Unidade de Venda <span className="text-red-500">*</span></label>
                  <select 
                    className="input-field"
                    value={formData.unidade_medida}
                    onChange={e => setFormData({...formData, unidade_medida: e.target.value})}
                  >
                    <option value="UN" className="bg-gray-800">Unidade (UN)</option>
                    <option value="ML" className="bg-gray-800">Metro linear (ML)</option>
                    <option value="M2" className="bg-gray-800">Metro quadrado (M2)</option>
                    <option value="M3" className="bg-gray-800">Metro cúbico (M3)</option>
                    <option value="KG" className="bg-gray-800">Quilograma (KG)</option>
                  </select>
                </div>
              </div>

              {/* Seção 3: Variações */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Paintbrush size={16} className="text-emerald-500" /> Variantes do Produto (Cores, Tamanhos, Opções)
                  </h4>
                  <button 
                    type="button" 
                    onClick={addVariacao}
                    className="flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition"
                  >
                    <Plus size={14} /> Adicionar Variante
                  </button>
                </div>
                <div className="space-y-3">
                  {variacoes.length === 0 && (
                    <div className="p-4 border border-dashed border-gray-700 rounded-lg text-center text-gray-500 text-sm">
                      Nenhuma variação adicionada. Use isso para opções como "Cor: Azul" ou "Puxador: Sim (+R$10)".
                    </div>
                  )}
                  {variacoes.map((v, idx) => (
                    <div key={idx} className="flex flex-wrap sm:flex-nowrap items-center gap-3 p-3 bg-gray-800/40 border border-gray-700 rounded-xl animate-in slide-in-from-right-2">
                      <div className="flex-1 min-w-[120px]">
                        <input 
                          type="text" 
                          placeholder="Tipo (Ex: Cor)" 
                          className="bg-transparent border-0 border-b border-gray-600 focus:border-blue-500 focus:ring-0 text-sm w-full py-1 text-white"
                          value={v.nome}
                          onChange={(e) => updateVariacao(idx, 'nome', e.target.value)}
                        />
                      </div>
                      <div className="flex-[2] min-w-[150px]">
                        <input 
                          type="text" 
                          placeholder="Opção (Ex: Azul Marinho)" 
                          className="bg-transparent border-0 border-b border-gray-600 focus:border-blue-500 focus:ring-0 text-sm w-full py-1 text-white"
                          value={v.opcao}
                          onChange={(e) => updateVariacao(idx, 'opcao', e.target.value)}
                        />
                      </div>
                      <div className="flex items-center gap-2 bg-gray-700/50 p-1 rounded-lg border border-gray-600">
                        <button
                          type="button"
                          onClick={() => updateVariacao(idx, 'tipo_acrescimo', 'VALOR')}
                          className={`px-2 py-1 rounded text-[10px] font-bold transition ${v.tipo_acrescimo === 'VALOR' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}
                        >
                          R$
                        </button>
                        <button
                          type="button"
                          onClick={() => updateVariacao(idx, 'tipo_acrescimo', 'PERCENTUAL')}
                          className={`px-2 py-1 rounded text-[10px] font-bold transition ${v.tipo_acrescimo === 'PERCENTUAL' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}
                        >
                          %
                        </button>
                      </div>
                      <div className="w-24">
                        <input 
                          type="number" 
                          placeholder={v.tipo_acrescimo === 'VALOR' ? "+ R$ 0,00" : "+ 0 %"} 
                          className="bg-transparent border-0 border-b border-gray-600 focus:border-blue-500 focus:ring-0 text-sm w-full py-1 text-emerald-400 font-semibold text-right"
                          value={v.valor_acrescimo}
                          onChange={(e) => updateVariacao(idx, 'valor_acrescimo', e.target.value)}
                        />
                      </div>
                      <button 
                        type="button"
                        onClick={() => removeVariacao(idx)}
                        className="p-1.5 text-gray-500 hover:text-red-400 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seção 4: Descrição e Dimensões */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                   <label className="block text-sm font-semibold text-gray-400 mb-2">Descrição Detalhada</label>
                    <textarea 
                      placeholder="Conte mais sobre o produto, materiais, cuidados..."
                      className="input-field min-h-[120px] text-sm py-3" 
                      value={formData.descricao}
                      onChange={e => setFormData({...formData, descricao: e.target.value})}
                    />
                </div>
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-1">Dimensões Máximas (cm)</h4>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs text-gray-400 font-medium">Altura</span>
                      <input 
                        type="number" step="0.01" className="bg-gray-800 border-gray-700 rounded-lg text-xs w-20 py-1.5 text-right px-2"
                        value={formData.altura_maxima}
                        onChange={e => setFormData({...formData, altura_maxima: e.target.value})}
                      />
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs text-gray-400 font-medium">Largura</span>
                      <input 
                        type="number" step="0.01" className="bg-gray-800 border-gray-700 rounded-lg text-xs w-20 py-1.5 text-right px-2"
                        value={formData.largura_maxima}
                        onChange={e => setFormData({...formData, largura_maxima: e.target.value})}
                      />
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs text-gray-400 font-medium">Profundidade</span>
                      <input 
                        type="number" step="0.01" className="bg-gray-800 border-gray-700 rounded-lg text-xs w-20 py-1.5 text-right px-2"
                        value={formData.comprimento_maximo}
                        onChange={e => setFormData({...formData, comprimento_maximo: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center p-5 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                <div className="flex items-center gap-3 flex-grow">
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={formData.status}
                      onChange={e => setFormData({...formData, status: e.target.checked})}
                      id="status-toggle"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </div>
                  <label htmlFor="status-toggle" className="text-sm font-bold text-gray-200 cursor-pointer">
                    Produto Ativo e Visível no Catálogo
                  </label>
                </div>
                <div className="text-[10px] text-gray-500 max-w-[200px] leading-tight text-right italic">
                  Produtos inativos não podem ser selecionados em novos orçamentos.
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-800">
                <button type="button" onClick={handleCloseModal} className="px-8 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-bold transition">
                  Descartar
                </button>
                <button type="submit" className="btn-primary px-10 py-3 shadow-lg shadow-blue-500/20">
                  {editingProduto ? 'Salvar Alterações' : 'Finalizar Cadastro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
