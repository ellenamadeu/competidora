import { Wrench, UserCheck, Truck } from "lucide-react";

const features = [
    {
        icon: <Wrench className="w-10 h-10 text-primary-500" />,
        title: "Instalação Especializada",
        description: "Instalação rápida e cuidadosa com técnicos experientes e treinamento constante.",
    },
    {
        icon: <UserCheck className="w-10 h-10 text-primary-500" />,
        title: "Atendimento Personalizado",
        description: "Vendedores que entendem sua necessidade e buscam a melhor solução para o seu projeto.",
    },
    {
        icon: <Truck className="w-10 h-10 text-primary-500" />,
        title: "Entrega Rápida no RJ",
        description: "Compre sem sair de casa. Atendemos em todo o Rio com agilidade e o melhor preço.",
    }
];

export default function FeaturesSection() {
    return (
        <section className="py-20 bg-white dark:bg-dark-950 border-b border-slate-100 dark:border-white/5">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    {features.map((feature, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <div className="w-20 h-20 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mb-6 shadow-sm border border-primary-100 dark:border-primary-900/30 transform transition-transform hover:-translate-y-2 duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-slate-700 dark:text-slate-400 font-medium leading-relaxed max-w-sm">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
