import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Phone, MapPin, ChevronLeft, Package, CreditCard, AlertCircle, Edit2, X, Plus, Trash2, MessageCircle } from 'lucide-react';
import { api } from '../lib/api';
import { formatWhatsAppLink } from '../lib/wa';

interface Pedido {
  id: number;
  data_pedido: string | null;
  titulo: string | null;
  total: number | null;
  status: number | null;
  saldo: number | null;
}

interface Cliente {
  id: number;
  nome: string;
  email: string | null;
  ddd: number | null;
  telefone: string | null;
  telefone2: string | null;
  telefone3: string | null;
  endereco: string | null;
  bairro: string | null;
  cep: string | null;
  documento: string | null;
  observacoes: string | null;
  pedidos: Pedido[];
}

export default function ClientDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal State for Editing
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phones, setPhones] = useState<string[]>(['']);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    endereco: '',
    bairro: '',
    cep: '',
    documento: '',
    observacoes: ''
  });

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/clientes/${id}`);
      setCliente(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    if (!cliente) return;
    setFormData({
      nome: cliente.nome,
      email: cliente.email || '',
      endereco: cliente.endereco || '',
      bairro: cliente.bairro || '',
      cep: cliente.cep || '',
      documento: cliente.documento || '',
      observacoes: cliente.observacoes || ''
    });
    const clientPhones = [cliente.telefone, cliente.telefone2, cliente.telefone3].filter(Boolean) as string[];
    setPhones(clientPhones.length > 0 ? clientPhones : ['']);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handlePhoneChange = (index: number, value: string) => {
    const newPhones = [...phones];
    newPhones[index] = value;
    setPhones(newPhones);
  };

  const addPhoneField = () => {
    if (phones.length < 3) setPhones([...phones, '']);
  };

  const removePhoneField = (index: number) => {
    setPhones(phones.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        phones: phones.filter(p => p.trim() !== '')
      };
      await api.put(`/clientes/${id}`, payload);
      setIsModalOpen(false);
      fetchDetails(); // Refresh data
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar cliente..');
    }
  };

  if (loading) return <div className="py-20 text-center text-gray-500">Carregando detalhes...</div>;
  if (!cliente) return <div className="py-20 text-center text-red-400">Cliente não encontrado.</div>;

  const getStatusLabel = (status: number | null) => {
    switch (status) {
      case 3: return { label: 'Orçamento', colors: 'bg-amber-500/10 text-amber-500 border-amber-500/20' };
      case 4: return { label: 'Produção', colors: 'bg-blue-500/10 text-blue-500 border-blue-500/20' };
      case 6: return { label: 'Cobrança', colors: 'bg-rose-500/10 text-rose-500 border-rose-500/20' };
      case 5: return { label: 'Concluído', colors: 'bg-green-500/10 text-green-500 border-green-500/20' };
      case 7: return { label: 'Baixado', colors: 'bg-gray-500/10 text-gray-500 border-gray-500/20' };
      // legado
      case 1: return { label: 'Aguardando Medição', colors: 'bg-yellow-500/10 text-yellow-500/70 border-yellow-500/20' };
      case 2: return { label: 'Em Produção', colors: 'bg-blue-500/10 text-blue-500/70 border-blue-500/20' };
      case 0: return { label: 'Cancelado', colors: 'bg-red-500/10 text-red-500/70 border-red-500/20' };
      default: return { label: 'Desconhecido', colors: 'bg-gray-500/10 text-gray-500 border-gray-500/20' };
    }
  };

  const formatCurrency = (value: number | null) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value || 0));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex justify-between items-center gap-4 border-b border-gray-800 pb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/clientes')}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              {cliente.nome}
            </h1>
            <p className="text-gray-400 flex items-center gap-2 mt-1">
              <Users size={16} className="text-blue-500" /> ID #{cliente.id}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Client Info Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card p-6">
            <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-2">
              <h2 className="text-xl font-bold text-white">Informações</h2>
              <button 
                onClick={handleOpenModal}
                className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-800 rounded-lg transition-all"
                title="Editar Cliente"
              >
                <Edit2 size={20} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-500/10 p-2 rounded-lg">
                  <Phone className="text-blue-500" size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Telefones</p>
                  <div className="flex flex-col gap-2 mt-2">
                    {[cliente.telefone, cliente.telefone2, cliente.telefone3].filter(Boolean).map((tel, i) => (
                      <div key={i} className="flex items-center justify-between bg-gray-900/60 p-2.5 rounded-xl border border-gray-800 hover:border-green-600/30 transition-all group/wa">
                        <span className="text-gray-200 font-medium text-sm">{tel}</span>
                        {formatWhatsAppLink(tel, cliente.ddd) && (
                          <a 
                            href={formatWhatsAppLink(tel, cliente.ddd)!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-green-600/10 hover:bg-green-600 text-green-500 hover:text-white rounded-lg transition-all"
                            title="Chamar no WhatsApp"
                          >
                            <MessageCircle size={14} />
                          </a>
                        )}
                      </div>
                    ))}
                    {!cliente.telefone && <p className="text-gray-500 italic">Não informado</p>}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-blue-500/10 p-2 rounded-lg">
                  <MapPin className="text-blue-500" size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Endereço</p>
                  <p className="text-gray-200 mt-1">{cliente.endereco || 'Não informado'}</p>
                  <p className="text-gray-400 text-sm">{cliente.bairro} {cliente.cep && ` - ${cliente.cep}`}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-blue-500/10 p-2 rounded-lg">
                  <CreditCard className="text-blue-500" size={20} />
                </div>
                <div>
                   <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Documento</p>
                   <p className="text-gray-200 mt-1">{cliente.documento || 'Vazio'}</p>
                </div>
              </div>

              {cliente.observacoes && (
                <div className="mt-6 p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Observações</p>
                  <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{cliente.observacoes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Orders List Card */}
        <div className="lg:col-span-3">
          <div className="card p-6 min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <Package className="text-blue-500" size={24} /> Histórico de Pedidos
              </h2>
              <span className="bg-gray-800 text-gray-400 text-xs px-3 py-1 rounded-full border border-gray-700">
                {(cliente.pedidos || []).length} pedidos
              </span>
            </div>

            {(!cliente.pedidos || cliente.pedidos.length === 0) ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500 border-2 border-dashed border-gray-800 rounded-3xl">
                <AlertCircle size={48} className="mb-4 opacity-20" />
                <p>Nenhum pedido vinculado a este cliente.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-2">
                  <thead>
                    <tr className="text-gray-500 text-xs uppercase tracking-widest font-bold">
                      <th className="px-4 py-2">ID</th>
                      <th className="px-4 py-2">Data</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2">Título</th>
                      <th className="px-4 py-2 text-right">Total</th>
                      <th className="px-4 py-2 text-right">Saldo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cliente.pedidos.map((pedido) => {
                      const status = getStatusLabel(pedido.status);
                      return (
                        <tr 
                          key={pedido.id}
                          className="bg-gray-900/40 border border-gray-800 rounded-xl hover:border-blue-500/40 transition-all cursor-not-allowed group"
                        >
                          <td className="px-4 py-4 text-blue-400 font-mono font-bold">#{pedido.id}</td>
                          <td className="px-4 py-4 text-gray-300 text-sm">
                            {pedido.data_pedido ? new Date(pedido.data_pedido).toLocaleDateString('pt-BR') : '---'}
                          </td>
                          <td className="px-4 py-4">
                             <span translate="no" className={`notranslate text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded border ${status.colors}`}>
                               {status.label}
                             </span>
                          </td>
                          <td className="px-4 py-4 text-white font-medium min-w-[200px]">
                            {pedido.titulo || 'Sem título'}
                          </td>
                          <td className="px-4 py-4 text-right text-white font-bold">
                            {formatCurrency(pedido.total)}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <span className={`font-bold ${Number(pedido.saldo) > 0 ? 'text-red-400' : 'text-green-400'}`}>
                              {formatCurrency(pedido.saldo)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal (Copied from ClientsPage for functionality) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Editar Cliente</h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-white transition">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="label">Nome Completo *</label>
                  <input 
                    required type="text" className="input-field" 
                    value={formData.nome}
                    onChange={e => setFormData({ ...formData, nome: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="label">E-mail</label>
                  <input 
                    type="email" className="input-field" 
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="label">Documento (CPF/CNPJ)</label>
                  <input 
                    type="text" className="input-field" 
                    value={formData.documento}
                    onChange={e => setFormData({ ...formData, documento: e.target.value })}
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="label flex justify-between items-center">
                    Telefones (máx. 3)
                    {phones.length < 3 && (
                      <button type="button" onClick={addPhoneField} className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1 font-bold">
                        <Plus size={14} /> Adicionar
                      </button>
                    )}
                  </label>
                  {phones.map((phone, index) => (
                    <div key={index} className="flex gap-2">
                      <input 
                        type="text" className="input-field" placeholder="(00) 00000-0000"
                        value={phone}
                        onChange={e => handlePhoneChange(index, e.target.value)}
                      />
                      {phones.length > 1 && (
                        <button type="button" onClick={() => removePhoneField(index)} className="p-2 text-gray-500 hover:text-red-400">
                          <Trash2 size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="md:col-span-2">
                  <label className="label">Endereço Completo</label>
                  <input 
                    type="text" className="input-field" 
                    value={formData.endereco}
                    onChange={e => setFormData({ ...formData, endereco: e.target.value })}
                  />
                </div>

                <div>
                  <label className="label">Bairro</label>
                  <input 
                    type="text" className="input-field" 
                    value={formData.bairro}
                    onChange={e => setFormData({ ...formData, bairro: e.target.value })}
                  />
                </div>

                <div>
                  <label className="label">CEP</label>
                  <input 
                    type="text" className="input-field" 
                    value={formData.cep}
                    onChange={e => setFormData({ ...formData, cep: e.target.value })}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="label">Observações Internas</label>
                  <textarea 
                    className="input-field min-h-[100px]"
                    value={formData.observacoes}
                    onChange={e => setFormData({ ...formData, observacoes: e.target.value })}
                  ></textarea>
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-gray-700">
                <button type="button" onClick={handleCloseModal} className="btn-secondary flex-1">Cancelar</button>
                <button type="submit" className="btn-primary flex-1">Salvar Alterações</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
