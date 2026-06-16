/**
 * Formata um número de telefone para o link do WhatsApp (wa.me)
 * Regras:
 * 1. Remove caracteres não numéricos.
 * 2. Se tiver 8 ou 9 dígitos, assume o DDD 21.
 * 3. Se tiver 10 ou 11 dígitos, verifica se começa com 55.
 * 4. Retorna a URL final.
 */
export const formatWhatsAppLink = (phone: string | null | undefined, ddd?: number | null) => {
  if (!phone) return null;

  // Remove tudo que não é número
  let cleaned = phone.replace(/\D/g, '');

  if (!cleaned) return null;

  // Se o número for muito curto (apenas o número local sem DDD)
  if (cleaned.length === 8 || cleaned.length === 9) {
    const defaultDDD = ddd ? String(ddd) : '21';
    cleaned = defaultDDD + cleaned;
  }

  // Se o número já tem DDD mas falta o código do país (55)
  if (cleaned.length >= 10 && !cleaned.startsWith('55')) {
    cleaned = '55' + cleaned;
  }

  // Caso especial: se o número já veio com 55 mas tem menos de 12 dígitos (falta o DDD ou número curto)
  // Mas o padrão wa.me/55219... costuma funcionar bem.

  return `https://wa.me/${cleaned}`;
};
