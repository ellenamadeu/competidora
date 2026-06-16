"use client"
import { useState } from "react";

export default function ContactSection() {
    const [formData, setFormData] = useState({
        nome: "",
        bairro: "",
        motivo: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Rastreamento de Conversão (Google Analytics Event)
        if (typeof window !== "undefined" && (window as any).gtag) {
            (window as any).gtag('event', 'generate_lead', {
                'method': 'whatsapp',
                'reason': formData.motivo
            });
        }

        // Rastreamento de URL (Google Ads / AdWords) para conversão sem sair da página
        if (typeof window !== "undefined") {
            window.history.pushState(null, "", "?status=enviado");
        }

        // Formatação da mensagem para o WhatsApp
        const whatsappNumber = "552133469818";
        const message = `Olá! Meu nome é *${formData.nome}*, falo do bairro *${formData.bairro}*. \n\nMotivo do meu contato: ${formData.motivo}`;

        // Redirecionamento
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank");
    };

    return (
        <section id="orcamento" className="py-24 bg-white dark:bg-black relative overflow-hidden">
            {/* Elementos decorativos de fundo */}
            <div className="absolute top-0 right-0 -mr-48 -mt-48 w-96 h-96 rounded-full bg-primary-500/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 -ml-48 -mb-48 w-96 h-96 rounded-full bg-sky-300/10 blur-3xl" />

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 items-center">

                    <div className="lg:w-1/2">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
                            Solicite seu <span className="text-primary-600">Orçamento</span>
                        </h2>
                        <p className="text-lg text-slate-900 dark:text-slate-300 mb-8 max-w-xl font-medium">
                            Entre em contato conosco de forma rápida. Preencha os dados e fale diretamente no nosso WhatsApp. Entraremos em contato o mais breve possível com a melhor solução em vidros.
                        </p>

                        <div className="hidden lg:block">
                            <div className="bg-slate-50 dark:bg-dark-800 p-8 rounded-3xl border border-slate-100 dark:border-white/5">
                                <h3 className="font-bold text-xl mb-4 text-slate-900 dark:text-white">Por que escolher a Competidora?</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center font-bold">✓</span>
                                        <span className="text-slate-900 dark:text-slate-200 font-medium">Mais de 30 anos de experiência</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center font-bold">✓</span>
                                        <span className="text-slate-900 dark:text-slate-200 font-medium">Materiais de altíssimo padrão</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center font-bold">✓</span>
                                        <span className="text-slate-900 dark:text-slate-200 font-medium">Segurança em primeiro lugar</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-1/2 w-full">
                        <div className="bg-white dark:bg-dark-800 p-8 md:p-10 rounded-3xl shadow-2xl border border-slate-100 dark:border-white/5">
                            <form onSubmit={handleSubmit} className="space-y-6">

                                <div>
                                    <label htmlFor="nome" className="block text-sm font-bold text-slate-900 dark:text-slate-200 mb-2">Seu Nome</label>
                                    <input
                                        type="text"
                                        id="nome"
                                        name="nome"
                                        required
                                        value={formData.nome}
                                        onChange={handleChange}
                                        className="w-full px-5 py-4 rounded-xl border-2 border-slate-300 dark:border-white/20 bg-slate-100 dark:bg-dark-800 text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all font-sans"
                                        placeholder="Como podemos te chamar?"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="bairro" className="block text-sm font-bold text-slate-900 dark:text-slate-200 mb-2">Bairro (Rio de Janeiro)</label>
                                    <input
                                        type="text"
                                        id="bairro"
                                        name="bairro"
                                        required
                                        value={formData.bairro}
                                        onChange={handleChange}
                                        className="w-full px-5 py-4 rounded-xl border-2 border-slate-300 dark:border-white/20 bg-slate-100 dark:bg-dark-800 text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all font-sans"
                                        placeholder="Ex: Tijuca, Leblon, Penha..."
                                    />
                                </div>

                                <div>
                                    <label htmlFor="motivo" className="block text-sm font-bold text-slate-900 dark:text-slate-200 mb-2">Motivo do Contato</label>
                                    <select
                                        id="motivo"
                                        name="motivo"
                                        required
                                        value={formData.motivo}
                                        onChange={handleChange}
                                        className="w-full px-5 py-4 rounded-xl border-2 border-slate-300 dark:border-white/20 bg-slate-100 dark:bg-dark-800 text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all cursor-pointer font-sans"
                                    >
                                        <option value="" disabled>Selecione uma opção</option>
                                        <option value="Quero comprar">Quero comprar</option>
                                        <option value="Pedir orçamento">Pedir orçamento</option>
                                        <option value="Solicitar visita">Solicitar visita</option>
                                        <option value="Dúvidas sobre produtos">Dúvidas sobre produtos</option>
                                        <option value="Informações sobre pedido">Informações sobre pedido</option>
                                        <option value="Outros">Outros</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 px-6 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-lg transition-all duration-300 shadow-[0_4px_14px_0_rgba(14,165,233,0.39)] hover:shadow-[0_6px_20px_rgba(14,165,233,0.23)] flex items-center justify-center gap-2 mt-4"
                                >
                                    Enviar para o WhatsApp
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
