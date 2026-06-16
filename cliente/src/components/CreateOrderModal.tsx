import React, { useState, useEffect } from 'react';
import { X, Search, User, Save } from 'lucide-react';
import { api } from '../lib/api';
import { useNavigate } from 'react-router-dom';

interface Cliente {
  id: number;
  nome: string;
}

interface CreateOrderModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateOrderModal({ onClose, onSuccess }: CreateOrderModalProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [formData, setFormData] = useState({
    titulo: '',
    status: 3,
    observacoes: ''
  });

  useEffect(() => {
    if (search.length > 2) {
      const delayDebounceFn = setTimeout(() => {
        fetchClients();
      }, 300);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [search]);

  const fetchClients = async () => {
    try {
      const res = await api.get('/clientes', { params: { q: search } });
      setClientes(res.data.data || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCliente) return alert('Selecione um cliente.');
    
    try {
      setLoading(true);
      const res = await api.post('/pedidos', {
        ...formData,
        id_cliente: selectedCliente.id
      });
      onSuccess();
      onClose();
      // Navigate to the newly created order
      navigate(`/pedidos/${res.data.id_pedido}`);
    } catch (err) {
      console.error(err);
      alert('Erro ao criar pedido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-800/30">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <PlusIcon size={24} className="text-blue-500" /> Abrir Novo Pedido
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition p-2 hover:bg-gray-700 rounded-lg">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Cliente Selection */}
          <div className="space-y-4">
            <label className="label">1. Selecionar Cliente *</label>
            {!selectedCliente ? (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Pesquisar por nome do cliente..." 
                  className="input-field pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {clientes.length > 0 && search.length > 2 && (
                  <div className="absolute z-10 w-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-40 overflow-y-auto">
                    {clientes.map(c => (
                      <button 
                        key={c.id} 
                        type="button"
                        onClick={() => setSelectedCliente(c)}
                        className="w-full text-left p-3 hover:bg-gray-700 text-white flex items-center gap-2 transition"
                      >
                        <User size={14} className="text-blue-400" /> {c.nome}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                    {selectedCliente.nome[0].toUpperCase()}
                  </div>
                  <span className="text-white font-bold">{selectedCliente.nome}</span>
                </div>
                <button 
                  type="button" 
                  onClick={() => setSelectedCliente(null)} 
                  className="text-xs text-blue-400 hover:underline"
                >
                  Alterar
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <label className="label">2. Informações do Pedido</label>
            <input 
              required
              type="text" 
              placeholder="Ex: Reforma de fachadas - Lote 02" 
              className="input-field"
              value={formData.titulo}
              onChange={e => setFormData({...formData, titulo: e.target.value})}
            />
            <textarea 
              className="input-field h-24 resize-none" 
              placeholder="Observações iniciais (opcional)..."
              value={formData.observacoes}
              onChange={e => setFormData({...formData, observacoes: e.target.value})}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancelar</button>
            <button 
              type="submit" 
              disabled={loading || !selectedCliente}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <Save size={18} /> {loading ? 'Criando...' : 'Criar Pedido'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const PlusIcon = ({ size, className }: { size: number, className: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
