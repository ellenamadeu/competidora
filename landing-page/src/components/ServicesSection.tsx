import Image from "next/image";

const services = [
    {
        title: "Box Blindex",
        description: "A maior variedade de cores e modelos para o luxo e segurança do seu banheiro.",
        image: "/images/box_blindex_fume.png",
    },
    {
        title: "Portas e Janelas",
        description: "Construindo ou reformando, temos a solução sob medida para o seu ambiente com acabamento impecável.",
        image: "/images/porta_blindex_4_folhas.png",
    },
    {
        title: "Cortina de Vidro",
        description: "Dê um upgrade na sua varanda! Garanta conforto, isolamento acústico e privacidade com segurança.",
        image: "/images/cortina_de_vidro.png",
    }
];

export default function ServicesSection() {
    return (
        <section id="servicos" className="py-24 bg-slate-50 dark:bg-dark-900">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">Nossos Produtos</h2>
                    <div className="w-24 h-1 bg-primary-500 mx-auto rounded-full mb-6"></div>
                    <p className="text-slate-900 dark:text-slate-300 max-w-2xl mx-auto text-lg font-medium">
                        Trabalhamos com os melhores materiais do mercado para transformar o seu espaço em um lugar moderno e sofisticado.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="group bg-white dark:bg-dark-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 dark:border-white/5 relative"
                        >
                            <div className="relative h-64 w-full overflow-hidden">
                                <div className="absolute inset-0 bg-dark-900/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                                <Image
                                    src={service.image}
                                    alt={service.title}
                                    fill
                                    className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>
                            <div className="p-8 relative z-20 bg-white dark:bg-dark-800 transform group-hover:-translate-y-4 transition-transform duration-500 rounded-t-3xl -mt-4">
                                <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-primary-500 transition-colors">
                                    {service.title}
                                </h3>
                                <p className="text-slate-900 dark:text-slate-300 leading-relaxed font-medium">
                                    {service.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
