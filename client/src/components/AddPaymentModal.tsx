import { useState, useEffect } from 'react';
import { X, DollarSign, Calendar, Save, CreditCard } from 'lucide-react';
import { api } from '../lib/api';

interface MetodoPagamento {
  id_pagamento: number;
  pagamento: string;
}

interface AddPaymentModalProps {
  orderId: string;
  payment?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddPaymentModal({ orderId, payment, onClose, onSuccess }: AddPaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [metodos, setMetodos] = useState<MetodoPagamento[]>([]);
  
  const [formData, setFormData] = useState({
    valor: '',
    forma_pagamento: '',
    data: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchMetodos();
    if (payment) {
      setFormData({
        valor: payment.valor.toString(),
        forma_pagamento: payment.forma_pagamento.toString(),
        data: new Date(payment.data).toISOString().split('T')[0]
      });
    }
  }, [payment]);

  const fetchMetodos = async () => {
    try {
      const res = await api.get('/pedidos/pagamentos/metodos');
      setMetodos(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.valor || !formData.forma_pagamento) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        valor: parseFloat(formData.valor.replace(',', '.')),
        forma_pagamento: parseInt(formData.forma_pagamento),
        data: formData.data
      };

      if (payment) {
        await api.put(`/pedidos/${orderId}/pagamentos/${payment.id_caixa_entrada}`, payload);
      } else {
        await api.post(`/pedidos/${orderId}/pagamentos`, payload);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar pagamento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div 
        className="bg-[#111827] border border-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-white/5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CreditCard className="text-blue-500" size={24} /> 
            {payment ? 'Editar Pagamento' : 'Novo Pagamento'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition p-2 hover:bg-white/5 rounded-lg">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2 block">
              Valor
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 font-bold">R$</span>
              <input 
                type="text"
                autoFocus
                required
                className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-12 pr-4 py-3 text-white font-black text-lg outline-none focus:ring-2 ring-emerald-500/50 transition-all"
                placeholder="0,00"
                value={formData.valor}
                onChange={(e) => setFormData({ ...formData, valor: e.target.value.replace(/[^\d.,]/g, '') })}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2 block">
              Forma de Pagamento
            </label>
            <select 
              required
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white appearance-none outline-none focus:ring-2 ring-blue-500/50 transition-all cursor-pointer"
              value={formData.forma_pagamento}
              onChange={(e) => setFormData({ ...formData, forma_pagamento: e.target.value })}
            >
              <option value="">Selecione...</option>
              {metodos.map(m => (
                <option key={m.id_pagamento} value={m.id_pagamento}>{m.pagamento}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2 block">
              Data do Pagamento
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="date"
                required
                className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-12 pr-4 py-3 text-white outline-none focus:ring-2 ring-blue-500/50 transition-all"
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-4 rounded-xl border border-gray-800 text-gray-400 font-bold hover:bg-white/5 transition-all active:scale-95"
            >
              CANCELAR
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Salvando...' : <><Save size={18} /> SALVAR</>}
            </button>
          </div>
        </form>
      </div>
      <div className="fixed inset-0 -z-10" onClick={onClose}></div>
    </div>
  );
}
