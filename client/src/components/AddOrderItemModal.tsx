import { useState, useEffect } from 'react';
import { X, Search, ChevronRight, ChevronLeft, Save, Info, Calculator, Package, Plus, Image, Trash2 } from 'lucide-react';
import { api } from '../lib/api';

interface ProdutoImagem {
  id?: number;
  url: string;
  principal: boolean;
}

interface Produto {
  id: number;
  nome: string;
  sku: string;
  descricao?: string;
  unidade_medida: string;
  preco_venda: string;
  categoria_id: number;
  variacoes?: any[];
  imagens?: ProdutoImagem[];
}

interface Categoria {
  id: number;
  nome: string;
  categoria_pai_id?: number | null;
}

interface AddOrderItemModalProps {
  orderId: string;
  onClose: () => void;
  onSuccess: () => void;
  editingItem?: any;
}

export default function AddOrderItemModal({ orderId, onClose, onSuccess, editingItem }: AddOrderItemModalProps) {
  const [step, setStep] = useState(editingItem ? 2 : 1);
  const [loading, setLoading] = useState(false);
  
  // Categories
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  // Step 1: Search
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<Produto[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null);

  // Step 2: Variations
  const [selectedVariations, setSelectedVariations] = useState<Record<string, any>>({});

  // Step 3: Measures & Calculations
  const [measures, setMeasures] = useState({
    h: '0.000',
    w: '0.000',
    l: '0.000',
    qty: '1.000',
    obs: ''
  });
  
  const [calcResult, setCalcResult] = useState({
    valor_unitario: '0.00',
    valor_total: '0.00',
    unidade_medida: ''
  });

  // Step 4: Editing
  const [finalUnitValue, setFinalUnitValue] = useState('0.00');

  // Quick Create Product State
  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);
  
  interface QuickVariation {
    nome: string;
    opcao: string;
    tipo_acrescimo: 'VALOR' | 'PERCENTUAL';
    valor_acrescimo: string;
  }

  const [newProductData, setNewProductData] = useState<{
    nome: string;
    preco_venda: string;
    unidade_medida: string;
    categoria_id: string;
    variacoes: QuickVariation[];
  }>({
    nome: '',
    preco_venda: '',
    unidade_medida: 'UN',
    categoria_id: '',
    variacoes: []
  });

  const addQuickVariation = () => {
    setNewProductData(prev => ({
      ...prev,
      variacoes: [...prev.variacoes, { nome: '', opcao: '', tipo_acrescimo: 'VALOR', valor_acrescimo: '0' }]
    }));
  };

  const updateQuickVariation = (index: number, field: keyof QuickVariation, value: any) => {
    setNewProductData(prev => {
      const nextVariations = [...prev.variacoes];
      nextVariations[index] = { ...nextVariations[index], [field]: value };
      return { ...prev, variacoes: nextVariations };
    });
  };

  const removeQuickVariation = (index: number) => {
    setNewProductData(prev => ({
      ...prev,
      variacoes: prev.variacoes.filter((_, i) => i !== index)
    }));
  };

  const handleQuickCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductData.nome || !newProductData.preco_venda) {
      alert('Nome e Preço de Venda são obrigatórios.');
      return;
    }
    try {
      setLoading(true);
      const payload = {
        nome: newProductData.nome,
        preco_venda: parseFloat(newProductData.preco_venda),
        unidade_medida: newProductData.unidade_medida,
        categoria_id: newProductData.categoria_id ? Number(newProductData.categoria_id) : (selectedCategoryId || null),
        status: true,
        imagens: [],
        variacoes: newProductData.variacoes.map(v => ({
          nome: v.nome,
          opcao: v.opcao,
          tipo_acrescimo: v.tipo_acrescimo,
          valor_acrescimo: parseFloat(v.valor_acrescimo) || 0
        }))
      };

      const res = await api.post('/produtos', payload);
      const novoProduto = res.data;
      
      setIsCreateProductOpen(false);
      setNewProductData({
        nome: '',
        preco_venda: '',
        unidade_medida: 'UN',
        categoria_id: '',
        variacoes: []
      });
      
      await fetchProducts();
      handleSelectProduct(novoProduto);
    } catch (err: any) {
      console.error(err);
      alert('Erro ao criar produto: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    if (!editingItem) {
      fetchProducts();
    } else {
      initializeEditing();
    }
  }, [editingItem]);

  const initializeEditing = async () => {
    try {
      setLoading(true);
      // Foca no produto do item sendo editado
      const res = await api.get(`/produtos/${editingItem.produto_id}`);
      const p = res.data;
      setSelectedProduct(p);
      
      const parsedVars = typeof editingItem.variacoes === 'string' 
        ? JSON.parse(editingItem.variacoes) 
        : (editingItem.variacoes || {});
        
      setMeasures({
        h: Number(editingItem.altura).toFixed(3),
        w: Number(editingItem.largura).toFixed(3),
        l: Number(editingItem.comprimento).toFixed(3),
        qty: Number(editingItem.quantidade).toFixed(3),
        obs: editingItem.observacoes || ''
      });
      setSelectedVariations(parsedVars);
      
      // Se não houver variações possíveis no produto, pula pro passo 3
      if (!p.variacoes || p.variacoes.length === 0) {
        setStep(3);
      } else {
        setStep(2);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (step === 1) {
      const delayDebounceFn = setTimeout(() => {
        fetchProducts();
      }, 300);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [search, selectedCategoryId]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categorias');
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    try {
      const params: any = {};
      if (search.length > 0) params.q = search;
      if (selectedCategoryId) params.categoria_id = selectedCategoryId;
      
      const res = await api.get('/produtos', { params });
      setProducts(res.data.data || res.data); 
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectProduct = (p: Produto) => {
    setSelectedProduct(p);
    setSelectedVariations({});
    if (p.variacoes && p.variacoes.length > 0) {
      setStep(2);
    } else {
      setStep(3);
    }
  };

  const toggleVariation = (groupName: string, variation: any) => {
    setSelectedVariations(prev => {
      const next = { ...prev };
      if (next[groupName]?.id === variation.id) {
        delete next[groupName];
      } else {
        next[groupName] = variation;
      }
      return next;
    });
  };

  const maskMeasure = (val: string) => {
    const numeric = val.replace(/\D/g, '');
    const number = parseFloat(numeric) / 1000;
    return number.toFixed(3);
  };

  const handleCalculate = async () => {
    if (!selectedProduct) return;
    try {
      setLoading(true);
      const res = await api.post('/pedidos/calcular', {
        produto_id: selectedProduct.id,
        altura: measures.h,
        largura: measures.w,
        comprimento: measures.l,
        quantidade: measures.qty,
        variacao_ids: Object.values(selectedVariations).map(v => v.id)
      });
      setCalcResult(res.data);
      setFinalUnitValue(res.data.valor_unitario);
      setStep(4);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const total = (parseFloat(finalUnitValue) * parseFloat(measures.qty)).toFixed(2);
      
      const payload = {
        produto_id: selectedProduct?.id,
        formato: 'NODE',
        altura: measures.h,
        largura: measures.w,
        comprimento: measures.l,
        quantidade: measures.qty,
        valor_unitario: finalUnitValue,
        valor_total: total,
        observacoes: measures.obs,
        variacoes: selectedVariations
      };

      if (editingItem) {
        await api.put(`/pedidos/${orderId}/itens/${editingItem.id_item}`, payload);
      } else {
        await api.post(`/pedidos/${orderId}/itens`, payload);
      }
      
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar item.');
    } finally {
      setLoading(false);
    }
  };

  // Group variations by name
  const groupedVariations = selectedProduct?.variacoes?.reduce((acc: any, cur: any) => {
    if (!acc[cur.nome]) acc[cur.nome] = [];
    acc[cur.nome].push(cur);
    return acc;
  }, {}) || {};

  const renderCategoryList = () => {
    return (
      <div className="flex flex-col gap-1 pr-2">
        <button 
          onClick={() => setSelectedCategoryId(null)}
          className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all border ${!selectedCategoryId ? 'bg-blue-600 border-blue-500 text-white shadow-[0_4px_12px_rgba(37,99,235,0.3)]' : 'bg-gray-800/40 border-gray-700/50 text-gray-500 hover:text-gray-300 hover:bg-gray-800'}`}
        >
          Todos os Produtos
        </button>
        {categories.map(c => (
           <button 
              key={c.id}
              onClick={() => setSelectedCategoryId(c.id)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all border ${selectedCategoryId === c.id ? 'bg-blue-600 border-blue-500 text-white shadow-[0_4px_12px_rgba(37,99,235,0.3)]' : 'bg-gray-800/40 border-gray-700/50 text-gray-400 hover:text-gray-300 hover:bg-gray-800'} ${c.categoria_pai_id ? 'ml-4 opacity-80' : ''}`}
           >
              {c.nome}
           </button>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl w-full max-w-5xl my-auto flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-800/30">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Package className="text-blue-500" size={24} /> Adicionar Item ao Pedido
            </h2>
            <div className="flex gap-2 mt-2">
              {[1, 2, 3, 4].map(s => (
                <div key={s} className={`h-1.5 w-8 rounded-full transition-all ${step >= s ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-gray-700'}`} />
              ))}
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition p-2 hover:bg-gray-700 rounded-lg">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row">
          
          {/* Step 1: Busca de Produto */}
          {step === 1 && (
            <>
              {/* Sidebar Categorias (Desktop) */}
              <div className="hidden lg:flex flex-col w-72 border-r border-gray-800/50 p-6 bg-gray-900/40">
                <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-4">Escolha uma Categoria</h3>
                {renderCategoryList()}
              </div>

              {/* Conteúdo Principal (Busca e Resultados) */}
              <div className="flex-1 p-6 flex flex-col animate-in slide-in-from-right-4">
                
                {/* Cabeçalho de Busca e Filtro Mobile */}
                <div className="space-y-4 mb-6 shrink-0">
                  {/* Select Categorias (Mobile) */}
                  <div className="lg:hidden">
                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest block mb-2">Filtrar Categoria</label>
                    <div className="relative">
                      <select 
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white appearance-none focus:ring-2 ring-blue-500/50 transition-all cursor-pointer"
                        value={selectedCategoryId || ''}
                        onChange={(e) => setSelectedCategoryId(e.target.value ? Number(e.target.value) : null)}
                      >
                        <option value="">Todas as Categorias</option>
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.categoria_pai_id ? '↳ ' : ''}{c.nome}</option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                        <ChevronRight className="rotate-90" size={16} />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <div className="relative flex-grow">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                      <input 
                        type="text" 
                        autoFocus
                        placeholder="Buscar por nome ou SKU..." 
                        className="input-field pl-10 h-12 text-base bg-gray-800/50"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setNewProductData(prev => ({
                          ...prev,
                          categoria_id: selectedCategoryId ? String(selectedCategoryId) : '',
                          variacoes: []
                        }));
                        setIsCreateProductOpen(true);
                      }}
                      className="px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition flex items-center gap-1.5 h-12 shrink-0 shadow-lg shadow-blue-500/20"
                    >
                      <Plus size={18} />
                      <span>Novo</span>
                    </button>
                  </div>
                </div>

                {/* Lista de Produtos */}
                <div className="flex-1 space-y-3">
                  {products.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3">
                      {products.map(p => {
                        const imgPrincipal = p.imagens?.find(img => img.principal) || p.imagens?.[0];
                        return (
                          <button 
                            key={p.id}
                            onClick={() => handleSelectProduct(p)}
                            className="w-full text-left p-3.5 rounded-xl bg-gray-800/30 border border-gray-800 hover:border-blue-500/50 hover:bg-gray-800/80 transition-all flex items-center gap-3.5 group relative overflow-hidden min-w-0"
                          >
                            <div className="absolute inset-y-0 left-0 w-1 bg-transparent group-hover:bg-blue-500 transition-all" />
                            
                            {/* Imagem do Produto */}
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-gray-800 overflow-hidden flex-shrink-0 border border-gray-700/60 flex items-center justify-center text-gray-600">
                              {imgPrincipal ? (
                                <img 
                                  src={`${api.defaults.baseURL?.replace('/api', '')}${imgPrincipal.url}`} 
                                  alt={p.nome} 
                                  className="w-full h-full object-cover" 
                                />
                              ) : (
                                <Image size={20} className="opacity-40" />
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-gray-100 group-hover:text-blue-400 transition-colors line-clamp-2 text-sm sm:text-base leading-snug" title={p.nome}>
                                {p.nome}
                              </p>
                              <p className="text-[10px] text-gray-500 mt-1 uppercase font-black tracking-widest truncate">
                                <span>SKU: {p.sku || '-'} | </span>{p.unidade_medida}
                              </p>
                            </div>
                            
                            <div className="text-right shrink-0 pr-1">
                              <span className="text-blue-500 font-extrabold text-sm sm:text-base block">R$ {p.preco_venda}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
                      <div className="bg-gray-800/30 p-4 rounded-2xl mb-4">
                        <Package size={48} className="text-gray-700" />
                      </div>
                      <p className="text-gray-600 italic">Nenhum produto encontrado.</p>
                      <p className="text-[10px] uppercase font-black tracking-widest mt-1">Tente ajustar sua busca ou categoria</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Step 2, 3, 4 content area */}
          {step > 1 && (
            <div className="flex-1 p-6">

          {/* Step 2: Variações */}
          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg flex items-center gap-3">
                <Info className="text-blue-400" size={20} />
                <span className="text-sm text-blue-100 font-medium">{selectedProduct?.nome} - Opções</span>
              </div>

              {Object.keys(groupedVariations).map(group => (
                <div key={group} className="space-y-3">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest">{group}</label>
                  <div className="flex flex-wrap gap-2">
                    {groupedVariations[group].map((v: any) => (
                      <button
                        key={v.id}
                        onClick={() => toggleVariation(group, v)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                          selectedVariations[group]?.id === v.id
                            ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                            : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
                        }`}
                      >
                        {v.opcao}
                        {parseFloat(v.valor_acrescimo) > 0 && (
                          <span className="ml-1 opacity-70">
                            (+{v.tipo_acrescimo === 'PERCENTUAL' ? `${v.valor_acrescimo}%` : `R$ ${v.valor_acrescimo}`})
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex gap-3 pt-4">
                <button onClick={() => setStep(1)} className="btn-secondary flex-1">Voltar</button>
                <button onClick={() => setStep(3)} className="btn-primary flex-1">Continuar Medidas</button>
              </div>
            </div>
          )}

          {/* Step 3: Medidas e Observações */}
          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg flex items-center gap-3">
                <Package className="text-blue-400" size={20} />
                <span className="text-sm text-blue-100 font-medium">{selectedProduct?.nome}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label text-xs">Altura (H)</label>
                  <input 
                    type="text" className="input-field text-center" 
                    value={measures.h}
                    onChange={e => setMeasures({...measures, h: maskMeasure(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="label text-xs">Largura (W)</label>
                  <input 
                    type="text" className="input-field text-center" 
                    value={measures.w}
                    onChange={e => setMeasures({...measures, w: maskMeasure(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="label text-xs">Comprimento (L)</label>
                  <input 
                    type="text" className="input-field text-center" 
                    value={measures.l}
                    onChange={e => setMeasures({...measures, l: maskMeasure(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="label text-xs">Quantidade</label>
                  <input 
                    type="text" className="input-field text-center" 
                    value={measures.qty}
                    onChange={e => setMeasures({...measures, qty: maskMeasure(e.target.value)})}
                  />
                </div>
              </div>

              <div>
                <label className="label text-xs">Observações do Item</label>
                <textarea 
                  className="input-field h-24 resize-none" 
                  placeholder="Ex: Refazer acabamento nas bordas..."
                  value={measures.obs}
                  onChange={e => setMeasures({...measures, obs: e.target.value})}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={() => setStep(selectedProduct?.variacoes?.length ? 2 : 1)} className="btn-secondary flex-1">Voltar</button>
                <button onClick={handleCalculate} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  Calcular Valores <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Revisão e Edição */}
          {step === 4 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="p-6 bg-gray-800/50 rounded-2xl border border-gray-700">
                <Calculator className="mx-auto text-blue-500 mb-4" size={32} />
                
                <div className="space-y-4 text-left overflow-hidden">
                  {/* Produto */}
                  <div>
                    <h3 className="text-lg font-bold text-white">{selectedProduct?.nome}</h3>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">SKU: {selectedProduct?.sku}</p>
                    {selectedProduct?.descricao && (
                      <p className="text-xs text-gray-400 mt-2 bg-black/20 p-2 rounded border border-white/5">{selectedProduct.descricao}</p>
                    )}
                  </div>

                  {/* Detalhes do Cálculo */}
                  <div className="grid grid-cols-2 gap-4 border-y border-gray-700 py-4">
                    <div>
                      <p className="text-[10px] font-black text-gray-500 uppercase">Medidas (H x W x L)</p>
                      <p className="text-sm text-white">{measures.h} x {measures.w} x {measures.l}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-500 uppercase">Quantidade</p>
                      <p className="text-sm text-white">{Number(measures.qty).toFixed(0)} unidades</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-500 uppercase">Unidade Medida</p>
                      <p className="text-sm text-white">{calcResult.unidade_medida}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-500 uppercase">Preço Base (M²)</p>
                      <p className="text-sm text-white">R$ {selectedProduct?.preco_venda}</p>
                    </div>
                  </div>
                  
                  {/* Variáveis e Acréscimos */}
                  {Object.keys(selectedVariations).length > 0 && (
                    <div className="py-2">
                      <p className="text-[10px] font-black text-gray-500 uppercase mb-3 text-center">Detalhamento das Variações</p>
                      <div className="space-y-2">
                        {Object.entries(selectedVariations).map(([group, v]) => (
                          <div key={group} className="flex justify-between items-center text-xs bg-gray-900/50 p-2 rounded-lg border border-gray-800">
                             <div className="flex flex-col">
                                <span className="text-gray-500 uppercase text-[9px] font-black">{group}:</span>
                                <span className="text-white font-bold">{v.opcao}</span>
                             </div>
                             <span className="text-blue-400">
                               +{v.tipo_acrescimo === 'PERCENTUAL' ? `${v.valor_acrescimo}%` : `R$ ${v.valor_acrescimo}`}
                             </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                    <span className="text-xs font-black text-gray-500 uppercase">Valor Unitário Gerado</span>
                    <div className="text-right">
                       <p className="text-[10px] text-gray-600 line-through">Sugerido: R$ {calcResult.valor_unitario}</p>
                       <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500 font-bold">R$</span>
                        <input 
                          type="text" className="input-field pl-10 h-10 w-36 text-right font-bold text-green-400 border-green-500/30 text-lg"
                          value={finalUnitValue}
                          onChange={e => setFinalUnitValue(e.target.value.replace(/[^\d.]/g, ''))}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 p-6 bg-gradient-to-br from-green-600/20 to-green-500/5 rounded-2xl border border-green-500/20">
                  <p className="text-xs text-green-500 uppercase font-black tracking-widest">Valor Total deste Item</p>
                  <p className="text-4xl font-black text-white mt-1">
                    R$ {(parseFloat(finalUnitValue) * parseFloat(measures.qty)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(3)} className="btn-secondary flex-1 flex items-center justify-center gap-2">
                   <ChevronLeft size={18} /> Ajustar Medidas
                </button>
                <button onClick={handleSave} disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 border-none shadow-xl shadow-green-500/20">
                  {loading ? 'Salvando...' : <><Save size={18} /> Salvar e Finalizar</>}
                </button>
              </div>
            </div>
          )}

              </div>
            )
          }

        </div>
      </div>

      {isCreateProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto transform transition-all animate-in zoom-in-95 duration-200 text-left">
            <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Package size={20} className="text-emerald-400" /> Criar Novo Produto
                </h3>
                <p className="text-xs text-gray-500 mt-1">Cadastro rápido para inserção imediata.</p>
              </div>
              <button 
                type="button"
                onClick={() => setIsCreateProductOpen(false)} 
                className="text-gray-400 hover:text-red-400 transition p-1.5 bg-gray-800 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleQuickCreateProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Nome do Produto *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Box Blindex Frontal"
                  className="input-field h-10 text-sm" 
                  value={newProductData.nome}
                  onChange={e => setNewProductData({...newProductData, nome: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Preço Base (R$) *</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    required
                    placeholder="0,00"
                    className="input-field h-10 text-sm font-semibold text-emerald-400" 
                    value={newProductData.preco_venda}
                    onChange={e => setNewProductData({...newProductData, preco_venda: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Unidade *</label>
                  <select 
                    className="input-field h-10 text-sm py-0 px-3"
                    value={newProductData.unidade_medida}
                    onChange={e => setNewProductData({...newProductData, unidade_medida: e.target.value})}
                  >
                    <option value="UN" className="bg-gray-800">Unidade (UN)</option>
                    <option value="ML" className="bg-gray-800">Metro linear (ML)</option>
                    <option value="M2" className="bg-gray-800">Metro quadrado (M2)</option>
                    <option value="M3" className="bg-gray-800">Metro cúbico (M3)</option>
                    <option value="KG" className="bg-gray-800">Quilograma (KG)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Categoria</label>
                <select 
                  className="input-field h-10 text-sm py-0 px-3"
                  value={newProductData.categoria_id}
                  onChange={e => setNewProductData({...newProductData, categoria_id: e.target.value})}
                >
                  <option value="">Selecione uma categoria...</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id} className="bg-gray-800">{c.categoria_pai_id ? '↳ ' : ''}{c.nome}</option>
                  ))}
                </select>
              </div>

              {/* Seção de Variantes */}
              <div className="border-t border-gray-800 pt-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    Variantes do Produto
                  </h4>
                  <button 
                    type="button" 
                    onClick={addQuickVariation}
                    className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition"
                  >
                    <Plus size={12} /> Add Variante
                  </button>
                </div>
                
                <div className="space-y-2">
                  {newProductData.variacoes.length === 0 && (
                    <div className="p-3 border border-dashed border-gray-800 rounded-xl text-center text-gray-600 text-xs">
                      Nenhuma variação adicionada.
                    </div>
                  )}
                  {newProductData.variacoes.map((v, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-gray-800/40 border border-gray-805 rounded-xl animate-in slide-in-from-right-1">
                      <div className="flex-grow min-w-[70px]">
                        <input 
                          type="text" 
                          placeholder="Tipo (Ex: Cor)" 
                          className="bg-transparent border-0 border-b border-gray-700 focus:border-blue-500 focus:ring-0 text-xs w-full py-1 text-white"
                          value={v.nome}
                          onChange={(e) => updateQuickVariation(idx, 'nome', e.target.value)}
                        />
                      </div>
                      <div className="flex-grow min-w-[70px]">
                        <input 
                          type="text" 
                          placeholder="Opção (Ex: Azul)" 
                          className="bg-transparent border-0 border-b border-gray-700 focus:border-blue-500 focus:ring-0 text-xs w-full py-1 text-white"
                          value={v.opcao}
                          onChange={(e) => updateQuickVariation(idx, 'opcao', e.target.value)}
                        />
                      </div>
                      <div className="flex items-center gap-1 bg-gray-750 p-0.5 rounded border border-gray-700 text-[10px] shrink-0">
                        <button
                          type="button"
                          onClick={() => updateQuickVariation(idx, 'tipo_acrescimo', 'VALOR')}
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold transition ${v.tipo_acrescimo === 'VALOR' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
                        >
                          R$
                        </button>
                        <button
                          type="button"
                          onClick={() => updateQuickVariation(idx, 'tipo_acrescimo', 'PERCENTUAL')}
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold transition ${v.tipo_acrescimo === 'PERCENTUAL' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
                        >
                          %
                        </button>
                      </div>
                      <div className="w-16 shrink-0">
                        <input 
                          type="number" 
                          placeholder="0.00" 
                          className="bg-transparent border-0 border-b border-gray-700 focus:border-blue-500 focus:ring-0 text-xs w-full py-1 text-emerald-400 font-semibold text-right"
                          value={v.valor_acrescimo}
                          onChange={(e) => updateQuickVariation(idx, 'valor_acrescimo', e.target.value)}
                        />
                      </div>
                      <button 
                        type="button"
                        onClick={() => removeQuickVariation(idx)}
                        className="p-1 text-gray-500 hover:text-red-400 transition shrink-0"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-gray-800">
                <button 
                  type="button" 
                  onClick={() => setIsCreateProductOpen(false)} 
                  className="px-5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold transition"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-500/20"
                >
                  {loading ? 'Salvando...' : 'Criar Produto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
