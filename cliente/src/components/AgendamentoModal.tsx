import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, ClipboardList, User, Info, CheckCircle2, Trash2 } from 'lucide-react';
import { api } from '../lib/api';

interface AgendamentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  idPedido?: number;
  agendamento?: any;
}

export default function AgendamentoModal({ isOpen, onClose, onSave, idPedido, agendamento }: AgendamentoModalProps) {
  const [horas, setHoras] = useState<any[]>([]);
  const [ordens, setOrdens] = useState<any[]>([]);
  const [funcionarios, setFuncionarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    data_agendamento: new Date().toISOString().split('T')[0],
    hora_agendamento: '',
    ordem: '',
    responsavel: '',
    instrucao: '',
    status_agendamento: 0
  });

  useEffect(() => {
    if (isOpen) {
      fetchOptions();
    }
  }, [isOpen]);

  useEffect(() => {
    if (agendamento) {
      setFormData({
        data_agendamento: agendamento.data_agendamento ? agendamento.data_agendamento.split('T')[0] : '',
        hora_agendamento: String(agendamento.hora_id || ''),
        ordem: String(agendamento.ordem_id || ''),
        responsavel: String(agendamento.id_responsavel || ''),
        instrucao: agendamento.instrucao || '',
        status_agendamento: agendamento.status_agendamento || 0
      });
    } else {
      setFormData({
        data_agendamento: new Date().toISOString().split('T')[0],
        hora_agendamento: '',
        ordem: '',
        responsavel: '',
        instrucao: '',
        status_agendamento: 0
      });
    }
  }, [agendamento, isOpen]);

  const fetchOptions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/agendamentos/opcoes');
      setHoras(res.data.horas);
      setOrdens(res.data.ordens);
      setFuncionarios(res.data.funcionarios);
    } catch (err) {
      console.error('Erro ao buscar opções:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        id_pedido: idPedido || agendamento?.id_pedido
      };

      if (agendamento) {
        await api.put(`/agendamentos/${agendamento.id_agendamento}`, payload);
      } else {
        await api.post('/agendamentos', payload);
      }
      onSave();
      onClose();
    } catch (err) {
      console.error('Erro ao salvar agendamento:', err);
      alert('Erro ao salvar agendamento.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!agendamento) return;
    if (!window.confirm('Tem certeza que deseja excluir este agendamento?')) return;

    try {
      setSubmitting(true);
      await api.delete(`/agendamentos/${agendamento.id_agendamento}`);
      onSave();
      onClose();
    } catch (err) {
      console.error('Erro ao excluir agendamento:', err);
      alert('Erro ao excluir agendamento.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#111827] border border-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="text-blue-500" size={24} />
            {agendamento ? 'Editar Agendamento' : 'Novo Agendamento'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition p-2 hover:bg-gray-800 rounded-lg">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 ml-1">
                <Calendar size={14} /> Data
              </label>
              <input 
                type="date" 
                required
                className="w-full bg-gray-800 border-2 border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-all"
                value={formData.data_agendamento}
                onChange={e => setFormData({ ...formData, data_agendamento: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 ml-1">
                <Clock size={14} /> Horário
              </label>
              <select 
                required
                className="w-full bg-gray-800 border-2 border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-all appearance-none"
                value={formData.hora_agendamento}
                onChange={e => setFormData({ ...formData, hora_agendamento: e.target.value })}
              >
                <option value="">Selecione...</option>
                {horas.map(h => (
                  <option key={h.id} value={h.id}>{h.hora}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 ml-1">
                <ClipboardList size={14} /> Tipo de Ordem (OS)
              </label>
              <select 
                required
                className="w-full bg-gray-800 border-2 border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-all appearance-none"
                value={formData.ordem}
                onChange={e => setFormData({ ...formData, ordem: e.target.value })}
              >
                <option value="">Selecione...</option>
                {ordens.map(o => (
                  <option key={o.id} value={o.id}>{o.ordem}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 ml-1">
                <User size={14} /> Responsável
              </label>
              <select 
                required
                className="w-full bg-gray-800 border-2 border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-all appearance-none"
                value={formData.responsavel}
                onChange={e => setFormData({ ...formData, responsavel: e.target.value })}
              >
                <option value="">Selecione...</option>
                {funcionarios.map(f => (
                  <option key={f.id_funcionario} value={f.id_funcionario}>{f.nome}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 ml-1">
              <Info size={14} /> Instruções / Observações
            </label>
            <textarea 
              className="w-full bg-gray-800 border-2 border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-all h-24 resize-none"
              placeholder="Ex: Medição da sacada, levar trena laser..."
              value={formData.instrucao}
              onChange={e => setFormData({ ...formData, instrucao: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-between bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${formData.status_agendamento === 1 ? 'bg-green-500/20 text-green-500' : 'bg-gray-700 text-gray-400'}`}>
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Status da OS</p>
                <p className="text-xs text-gray-400">{formData.status_agendamento === 1 ? 'Concluída' : 'Pendente'}</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={formData.status_agendamento === 1}
                onChange={e => setFormData({ ...formData, status_agendamento: e.target.checked ? 1 : 0 })}
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            {agendamento && (
              <button 
                type="button" 
                onClick={handleDelete}
                disabled={submitting}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-950/30 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/30 transition-all font-bold text-sm"
              >
                <Trash2 size={18} />
                Excluir
              </button>
            )}
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all font-bold text-sm"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={submitting || loading}
              className="flex-grow sm:flex-grow-0 px-8 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-all font-bold text-sm shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Salvando...' : 'Salvar Agendamento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
