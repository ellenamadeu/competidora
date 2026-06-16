"use client"
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="w-full bg-black border-b border-white/10 sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="relative h-12 w-48 sm:w-56">
                        <Image
                            src="/images/logo.png"
                            alt="Logo Competidora Vidros"
                            fill
                            className="object-contain object-left"
                            priority
                        />
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    <a href="#servicos" className="text-slate-300 hover:text-white text-sm font-medium transition-colors">Produtos</a>
                    <a href="#orcamento" className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-full text-sm font-semibold transition-all">
                        Solicitar Orçamento
                    </a>
                </nav>

                {/* Mobile Menu Button */}
                <button 
                    onClick={toggleMenu}
                    className="md:hidden text-white p-2 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg" 
                    aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Navigation Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden w-full bg-black/95 border-b border-white/10 backdrop-blur-md animate-fade-in-up">
                    <nav className="flex flex-col px-6 py-6 gap-4">
                        <a 
                            href="#servicos" 
                            onClick={() => setIsMenuOpen(false)}
                            className="text-slate-300 hover:text-white text-base font-medium py-2 border-b border-white/5"
                        >
                            Produtos
                        </a>
                        <a 
                            href="#orcamento" 
                            onClick={() => setIsMenuOpen(false)}
                            className="w-full text-center py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-full text-base font-semibold transition-all shadow-[0_0_15px_rgba(14,165,233,0.3)] mt-2"
                        >
                            Solicitar Orçamento
                        </a>
                    </nav>
                </div>
            )}
        </header>
    );
}
