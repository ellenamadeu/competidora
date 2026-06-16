import Image from "next/image";

export default function HeroSection() {
    return (
        <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden">
            {/* Background Image / Overlay */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-dark-900/60 z-10" />
                <Image
                    src="/images/hero-bg-abstract.png"
                    alt="Fundo abstrato moderno escuro simulando reflexos em vidro premium"
                    fill
                    className="object-cover object-center"
                    priority
                />
            </div>

            <div className="relative z-20 container mx-auto px-6 lg:px-12 flex flex-col items-center text-center">
                <span className="inline-block py-1 px-3 rounded-full bg-primary-500/20 text-primary-500 border border-primary-500/30 text-sm font-semibold mb-6 animate-fade-in-up">
                    Bem-vindo à Competidora Vidros
                </span>
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-lg">
                    Refletindo seus <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-sky-300">
                        melhores momentos
                    </span>
                </h1>
                <p className="text-lg md:text-xl text-slate-200 max-w-2xl mb-10 font-light drop-shadow-md">
                    Especialistas em Cortina de Vidro, Portas, Janelas e Box Blindex. Qualidade premium, segurança e um design que valoriza o seu ambiente.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <a
                        href="#orcamento"
                        className="px-8 py-4 rounded-full bg-primary-600 hover:bg-primary-500 text-white font-semibold text-lg transition-all duration-300 shadow-[0_0_20px_rgba(14,165,233,0.4)] hover:shadow-[0_0_30px_rgba(14,165,233,0.6)] hover:-translate-y-1 inline-flex items-center justify-center"
                    >
                        Peça seu Orçamento
                    </a>
                    <a
                        href="https://www.instagram.com/competidora.vidros/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md font-semibold text-lg transition-all duration-300 hover:-translate-y-1 inline-flex items-center justify-center gap-2"
                    >
                        Portfólio
                    </a>
                </div>
            </div>

            {/* Decorative Bottom Gradient fade to connect with next section */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-50 dark:from-dark-900 to-transparent z-10" />
        </section>
    );
}
