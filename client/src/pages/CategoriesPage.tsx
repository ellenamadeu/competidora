import { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, FolderTree, X, ChevronRight, ChevronDown, Folder } from 'lucide-react';
import { api } from '../lib/api';

interface Categoria {
  id: number;
  nome: string;
  slug: string;
  _count?: { produtos: number };
  categoria_pai_id?: number | null;
}



export default function CategoriesPage() {
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Categoria | null>(null);
  const [formData, setFormData] = useState({ nome: '', slug: '', categoria_pai_id: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/categorias');
      setCategories(res.data);
      
      // Auto-expand all if first load or small list
      if (expandedIds.size === 0) {
        setExpandedIds(new Set(res.data.map((c: Categoria) => c.id)));
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao carregar categorias.');
    } finally {
      setLoading(false);
    }
  };



  const treeData = useMemo(() => {
    // 1. Criar o mapa de filhos para busca rápida O(1)
    const childrenMap: Record<string, Categoria[]> = {};
    categories.forEach(cat => {
      const parentId = cat.categoria_pai_id ? String(cat.categoria_pai_id) : 'root';
      if (!childrenMap[parentId]) childrenMap[parentId] = [];
      childrenMap[parentId].push(cat);
    });

    // 2. Função recursiva para montar a árvore plana
    const buildFlatTree = (parentId: string, depth: number, result: any[]) => {
      const children = childrenMap[parentId] || [];
      children.forEach(cat => {
        const item = { ...cat, depth, hasChildren: !!childrenMap[String(cat.id)] };
        result.push(item);
        if (expandedIds.has(cat.id)) {
          buildFlatTree(String(cat.id), depth + 1, result);
        }
      });
    };

    const result: any[] = [];
    buildFlatTree('root', 0, result);
    return result;
  }, [categories, expandedIds]);



  const toggleExpand = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const handleOpenModal = (cat?: Categoria) => {
    if (cat) {
      setEditingCategory(cat);
      setFormData({
        nome: cat.nome,
        slug: cat.slug,
        categoria_pai_id: cat.categoria_pai_id ? String(cat.categoria_pai_id) : ''
      });
    } else {
      setEditingCategory(null);
      setFormData({ nome: '', slug: '', categoria_pai_id: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ nome: '', slug: '', categoria_pai_id: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        nome: formData.nome,
        slug: formData.slug || formData.nome.toLowerCase().replace(/ /g, '-'),
        categoria_pai_id: formData.categoria_pai_id ? Number(formData.categoria_pai_id) : null
      };

      if (editingCategory) {
        await api.put(`/categorias/${editingCategory.id}`, payload);
      } else {
        await api.post('/categorias', payload);
      }
      
      handleCloseModal();
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar a categoria.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir esta categoria? Todas as subcategorias continuarão existindo, mas sem pai.')) return;
    try {
      await api.delete(`/categorias/${id}`);
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir. Pode haver produtos vinculados.');
    }
  };

  // Basic filtering (tree-aware filtering is complex, so we stick to simple search or display all)
  const displayItems = searchTerm 
    ? categories.filter(c => c.nome.toLowerCase().includes(searchTerm.toLowerCase()))
    : treeData;

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-700 pb-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
            <FolderTree className="text-blue-500" /> Categorias
            <span className="text-sm font-normal text-gray-500 ml-2">({categories.length} total)</span>
          </h1>
          <p className="text-gray-400 mt-1">Gerencie a árvore de departamentos e categorias dos produtos.</p>
        </div>
        <div className="flex gap-2">
          <button 
            className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm transition"
            onClick={() => setExpandedIds(new Set(categories.map(c => c.id)))}
          >
            Expandir Tudo
          </button>
          <button className="btn-primary" onClick={() => handleOpenModal()}>
            <Plus size={18} /> Nova Categoria
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
              placeholder="Buscar categorias..." 
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
                <th className="py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Estrutura Hierárquica</th>
                <th className="py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Produtos</th>
                <th className="py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-gray-500">Carregando...</td>
                </tr>
              ) : displayItems.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-gray-500">
                    Nenhuma categoria encontrada.
                  </td>
                </tr>
              ) : (
                displayItems.map((cat: any) => (
                  <tr key={cat.id} className="hover:bg-white/5 transition-colors duration-200 group">
                    <td className="py-3 px-4 text-sm font-medium text-white flex items-center gap-2">
                      {/* Indentação baseada na profundidade */}
                      {!searchTerm && [...Array(cat.depth || 0)].map((_, i) => (
                        <div key={i} className="w-6 h-full flex-shrink-0" />
                      ))}
                      
                      <div className="flex items-center gap-2">
                        {!searchTerm && cat.hasChildren ? (
                          <button 
                            onClick={(e) => toggleExpand(cat.id, e)}
                            className="p-1 hover:bg-gray-700 rounded transition text-gray-400 hover:text-white"
                          >
                            {expandedIds.has(cat.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          </button>
                        ) : (
                          <div className="w-6" />
                        )}
                        
                        {cat.categoria_pai_id ? (
                          <Folder size={16} className="text-gray-500" />
                        ) : (
                          <FolderTree size={16} className="text-blue-500/70" />
                        )}
                        
                        <span 
                          className="cursor-pointer group-hover:text-blue-400 transition-colors text-base"
                          onClick={() => handleOpenModal(cat)}
                        >
                          {cat.nome}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-400">
                      {cat._count?.produtos || 0} itens
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(cat)}
                          className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-full transition-all"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(cat.id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-all"
                        >
                          <Trash2 size={18} />
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
              <h3 className="text-xl font-bold text-white">
                {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-white transition">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Nome</label>
                <input 
                  type="text" 
                  required
                  className="input-field" 
                  value={formData.nome}
                  onChange={e => setFormData({...formData, nome: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Slug (opcional)</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="ex: vidros-temperados"
                  value={formData.slug}
                  onChange={e => setFormData({...formData, slug: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Categoria Pai (opcional)</label>
                <select 
                  className="input-field"
                  value={formData.categoria_pai_id}
                  onChange={e => setFormData({...formData, categoria_pai_id: e.target.value})}
                >
                  <option value="">Nenhuma (Categoria Principal)</option>
                  {categories.filter(c => c.id !== editingCategory?.id).map(c => (
                    <option key={c.id} value={c.id} className="bg-gray-800">{c.nome}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={handleCloseModal} className="px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-semibold transition">
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingCategory ? 'Salvar Alterações' : 'Criar Categoria'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
