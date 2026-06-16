export default function Footer() {
    return (
        <footer className="bg-dark-900 border-t border-white/5 pt-20 pb-10">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">

                    {/* Coluna 1: Marca */}
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-6">Competidora</h3>
                        <p className="text-slate-400 mb-6 max-w-sm">
                            Tradição e liderança no segmento de vidros no Rio de Janeiro. Trazemos inovação e segurança para a sua casa.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            {/* Instagram Link */}
                            <a
                                href="https://www.instagram.com/competidora.vidros"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-300 hover:bg-primary-500 hover:text-white transition-all"
                                title="Acesse nosso Portfólio no Instagram"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                            </a>
                            {/* Facebook Link */}
                            <a
                                href="https://www.facebook.com/vidroscompetidora/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-300 hover:bg-primary-500 hover:text-white transition-all"
                                title="Acesse nosso Facebook"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                            </a>
                            {/* Youtube Link */}
                            <a
                                href="https://www.youtube.com/@competidora.vidros"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-300 hover:bg-primary-500 hover:text-white transition-all"
                                title="Acesse nosso canal no Youtube"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.14 1 12 1 12s0 3.86.42 5.58a2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.86 23 12 23 12s0-3.86-.42-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
                            </a>
                            {/* Google Link */}
                            <a
                                href="https://share.google/HB3nuMuisdzmHi1iU"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-300 hover:bg-primary-500 hover:text-white transition-all"
                                title="Avalie-nos no Google"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><line x1="2" x2="22" y1="12" y2="12"/></svg>
                            </a>
                            {/* Tiktok Link */}
                            <a
                                href="https://www.tiktok.com/@competidoravidros"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-300 hover:bg-primary-500 hover:text-white transition-all"
                                title="Acesse nosso Tiktok"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5v3a3 3 0 0 1-3-3v10a4 4 0 0 1-6-4.5"/></svg>
                            </a>
                            {/* Magalu Link */}
                            <a
                                href="https://www.magazineluiza.com.br/lojista/competidoravidrosrj/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-300 hover:bg-primary-500 hover:text-white transition-all"
                                title="Nossa Loja no Magalu"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                            </a>
                        </div>
                    </div>

                    {/* Coluna 2: Navegação Rápida */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6">Acesso Rápido</h4>
                        <ul className="space-y-4">
                            <li><a href="#servicos" className="text-slate-400 hover:text-primary-400 transition-colors">Produtos</a></li>
                            <li><a href="#orcamento" className="text-slate-400 hover:text-primary-400 transition-colors">Pedir Orçamento</a></li>
                            <li>
                                <a
                                    href="https://www.instagram.com/competidora.vidros"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-slate-400 hover:text-primary-400 transition-colors flex items-center gap-2"
                                >
                                    Nosso Portfólio <span className="text-xs bg-primary-600 text-white px-2 py-0.5 rounded-full">Novo</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Coluna 3: Endereço Penha */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6">Visite a nossa Loja</h4>
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                            <h5 className="font-bold text-slate-200 mb-2">Penha - RJ</h5>
                            <p className="text-slate-400 text-sm mb-4">Av. Nossa Senhora da Penha, 220 - Penha Cep: 21070-390</p>
                            <p className="text-slate-400 text-sm mb-6 font-semibold">(21) 4107-7451</p>

                            <a
                                href="https://maps.google.com/?q=Av.+Nossa+Senhora+da+Penha,+220+-+Penha,+Cep:+21070-390"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center gap-2 py-3 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-xl transition-colors border border-white/10"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                                Ir à loja
                            </a>
                        </div>
                    </div>

                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-sm text-center md:text-left">
                        &copy; {new Date().getFullYear()} Competidora Vidros. Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}
