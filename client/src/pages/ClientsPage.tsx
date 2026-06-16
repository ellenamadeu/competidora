import React, { useState, useEffect } from 'react';
import { Users, Search, Plus, Phone, MapPin, Edit2, Trash2, Smartphone, MessageCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatWhatsAppLink } from '../lib/wa';
import { api } from '../lib/api';

interface Cliente {
  id: number;
  nome: string;
  email: string | null;
  contato: string | null;
  ddd: number | null;
  telefone: string | null;
  telefone2: string | null;
  telefone3: string | null;
  endereco: string | null;
  bairro: string | null;
  cep: string | null;
  documento: string | null;
  observacoes: string | null;
}

export default function ClientsPage() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(() => localStorage.getItem('last_search_clients') || '');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    endereco: '',
    bairro: '',
    cep: '',
    documento: '',
    observacoes: '',
    phones: ['']
  });

  useEffect(() => {
    localStorage.setItem('last_search_clients', search);
  }, [search]);

  useEffect(() => {
    fetchClients();
  }, [page, search]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await api.get('/clientes', {
        params: { q: search, page, limit: 12 }
      });
      setClientes(res.data.data);
      setTotalPages(res.data.meta.last_page);
      setTotalItems(res.data.meta.total);
    } catch (err) {
      console.error(err);
      // alert('Erro ao carregar clientes.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on search
  };

  const handleOpenModal = (cliente?: Cliente) => {
    if (cliente) {
      setEditingCliente(cliente);
      const phones = [cliente.telefone, cliente.telefone2, cliente.telefone3].filter(Boolean) as string[];
      setFormData({
        nome: cliente.nome,
        email: cliente.email || '',
        endereco: cliente.endereco || '',
        bairro: cliente.bairro || '',
        cep: cliente.cep || '',
        documento: cliente.documento || '',
        observacoes: cliente.observacoes || '',
        phones: phones.length > 0 ? phones : ['']
      });
    } else {
      setEditingCliente(null);
      setFormData({
        nome: '',
        email: '',
        endereco: '',
        bairro: '',
        cep: '',
        documento: '',
        observacoes: '',
        phones: ['']
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCliente(null);
  };

  const handlePhoneChange = (index: number, value: string) => {
    const newPhones = [...formData.phones];
    newPhones[index] = maskPhone(value);
    setFormData({ ...formData, phones: newPhones });
  };

  const addPhoneField = () => {
    if (formData.phones.length < 3) {
      setFormData({ ...formData, phones: [...formData.phones, ''] });
    }
  };

  const removePhoneField = (index: number) => {
    const newPhones = formData.phones.filter((_, i) => i !== index);
    setFormData({ ...formData, phones: newPhones.length > 0 ? newPhones : [''] });
  };

  const maskPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/g, '($1) $2')
      .replace(/(\d)(\d{4})$/, '$1-$2')
      .substring(0, 15);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCliente) {
        await api.put(`/clientes/${editingCliente.id}`, formData);
      } else {
        await api.post('/clientes', formData);
      }
      handleCloseModal();
      fetchClients();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar cliente.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este cliente?')) return;
    try {
      await api.delete(`/clientes/${id}`);
      fetchClients();
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir cliente.');
    }
  };

  const [isGoogleConnected, setIsGoogleConnected] = useState(false);

  useEffect(() => {
    checkGoogleStatus();
    
    const params = new URLSearchParams(window.location.search);
    if (params.get('google') === 'success') {
      alert('Conectado com sucesso ao Google Contacts!');
      navigate('/clientes', { replace: true });
    } else if (params.get('google') === 'error') {
      alert('Erro ao conectar com o Google Contacts.');
      navigate('/clientes', { replace: true });
    }
  }, []);

  const checkGoogleStatus = async () => {
    try {
      const res = await api.get('/google/status');
      setIsGoogleConnected(res.data.connected);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGoogleAction = async () => {
    if (isGoogleConnected) {
      if (window.confirm('Deseja desconectar sua conta do Google?')) {
        try {
          await api.post('/google/disconnect');
          setIsGoogleConnected(false);
          alert('Desconectado com sucesso.');
        } catch (err) {
          console.error(err);
          alert('Erro ao desconectar.');
        }
      }
    } else {
      window.location.href = 'http://localhost:3000/api/google/auth';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Users className="text-blue-500" size={32} /> Gestão de Clientes
          </h1>
          <p className="text-gray-400 mt-1">Total de {totalItems.toLocaleString()} clientes cadastrados.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button 
            className={`flex items-center justify-center gap-2 px-6 py-2 rounded-lg transition-all font-medium shadow-md ${
              isGoogleConnected 
                ? 'bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/50' 
                : 'bg-[#1a73e8] hover:bg-[#1557b0] text-white'
            }`}
            onClick={handleGoogleAction}
          >
            <Smartphone size={20} /> 
            {isGoogleConnected ? 'Google Conectado (Desconectar)' : 'Conectar Google'}
          </button>
          <button className="btn-primary" onClick={() => handleOpenModal()}>
            <Plus size={20} /> Novo Cliente
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nome, telefone, endereço ou bairro..." 
            className="input-field pl-10"
            value={search}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center text-gray-500">Carregando dados...</div>
        ) : clientes.length === 0 ? (
          <div className="col-span-full py-20 text-center text-gray-500">Nenhum cliente encontrado.</div>
        ) : (
          clientes.map((cliente) => (
            <div 
              key={cliente.id} 
              onClick={() => navigate(`/clientes/${cliente.id}`)}
              className="card group hover:border-blue-500/50 transition-all duration-300 cursor-pointer"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-grow">
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                      {cliente.nome}
                    </h3>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenModal(cliente);
                      }} 
                      className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded-lg"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(cliente.id);
                      }} 
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-700/50">
                  <div className="flex items-start gap-3 text-sm">
                    <Phone className="text-blue-500 mt-1 shrink-0" size={16} />
                    <div className="flex flex-col gap-2 text-gray-300">
                      {[cliente.telefone, cliente.telefone2, cliente.telefone3].filter(Boolean).map((tel, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="bg-gray-800/50 px-2.5 py-1 rounded border border-gray-700 text-xs font-medium text-gray-300">
                            {tel}
                          </span>
                          {formatWhatsAppLink(tel, cliente.ddd) && (
                            <a 
                              href={formatWhatsAppLink(tel, cliente.ddd)!}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-1.5 bg-green-950/20 hover:bg-green-600/30 text-green-500 hover:text-green-400 rounded-lg transition-all border border-green-900/10"
                              title="Abrir no WhatsApp"
                            >
                              <MessageCircle size={14} />
                            </a>
                          )}
                        </div>
                      ))}
                      {!cliente.telefone && <span className="text-gray-500 italic">Não informado</span>}
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin className="text-blue-500 mt-0.5 shrink-0" size={16} />
                    <div className="text-gray-300">
                      <p className="line-clamp-2">
                        {cliente.endereco || 'Endereço não informado'}
                        {cliente.bairro && <span className="text-gray-400 font-medium"> - {cliente.bairro}</span>}
                      </p>
                      {cliente.cep && <p className="text-gray-500 text-xs">{cliente.cep}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-6">
          <button 
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="btn-secondary px-3 py-2 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} /> Ant.
          </button>
          <span className="text-gray-400 font-medium">Página <span className="text-white">{page}</span> de {totalPages}</span>
          <button 
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="btn-secondary px-3 py-2 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Próx. <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">{editingCliente ? 'Editar Cliente' : 'Novo Cliente'}</h2>
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
                  <label className="label">CPF / CNPJ</label>
                  <input 
                    type="text" className="input-field" 
                    value={formData.documento}
                    onChange={e => setFormData({ ...formData, documento: e.target.value })}
                  />
                </div>

                <div className="md:col-span-2 space-y-3">
                  <label className="label flex justify-between">
                    Telefones de Contato
                    {formData.phones.length < 3 && (
                      <button type="button" onClick={addPhoneField} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                        <Plus size={12} /> Adicionar outro
                      </button>
                    )}
                  </label>
                  {formData.phones.map((phone, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="relative flex-grow">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input 
                          type="text" className="input-field pl-10" 
                          placeholder="(00) 00000-0000"
                          value={phone}
                          onChange={e => handlePhoneChange(index, e.target.value)}
                        />
                      </div>
                      {formData.phones.length > 1 && (
                        <button type="button" onClick={() => removePhoneField(index)} className="p-2.5 text-red-400 hover:bg-red-500/10 rounded-lg transition">
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
                    className="input-field h-24 resize-none" 
                    value={formData.observacoes}
                    onChange={e => setFormData({ ...formData, observacoes: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-6 border-t border-gray-700">
                <button type="button" onClick={handleCloseModal} className="btn-secondary">Cancelar</button>
                <button type="submit" className="btn-primary min-w-[120px]">
                  {editingCliente ? 'Salvar' : 'Criar Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
