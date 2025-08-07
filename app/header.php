<?php
// header.php
// Este arquivo contém o cabeçalho comum para todas as páginas da aplicação.
// Inicia a sessão se ainda não foi iniciada (necessário para verificar o status de login)
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
?>
<header class="bg-gray-800 shadow-md">
    <nav class="main-container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
            <div class="flex items-center">
                <a href="clientes.php" class="text-white font-bold text-xl">Competidora</a>
            </div>
            <div class="hidden md:block">
                <div class="ml-10 flex items-baseline space-x-4">
                    <a href="clientes.php" class="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium">Clientes</a>
                    <a href="pedidos.php" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Pedidos</a>
                    <a href="agenda.php" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Agenda</a>
                    <a href="#" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Relatórios</a>
                    <a href="#" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Configurações</a>
                    
                    <!-- Link de Login sempre visível, sem lógica de sessão -->
                    <a href="login.php" class="text-green-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Login</a> 
                </div>
            </div>
            <!-- Botão do menu mobile (hambúrguer) -->
            <div class="-mr-2 flex md:hidden">
                <button type="button" id="mobile-menu-button" class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
                    <span class="sr-only">Abrir menu principal</span>
                    <!-- Ícone quando o menu está fechado -->
                    <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <!-- Ícone quando o menu está aberto (oculto por padrão) -->
                    <svg class="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    </nav>

    <!-- Menu mobile, oculto por padrão -->
    <div class="md:hidden hidden" id="mobile-menu">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="clientes.php" class="bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium">Clientes</a>
            <a href="pedidos.php" class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Pedidos</a>
            <a href="agenda.php" class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Agenda</a>
            <a href="#" class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Relatórios</a>
            <a href="#" class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Configurações</a>
            <a href="login.php" class="text-green-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Login</a>
        </div>
    </div>
</header>

<script>
    document.addEventListener('DOMContentLoaded', () => {
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        const menuOpenIcon = mobileMenuButton.querySelector('.block'); // Ícone de hambúrguer
        const menuCloseIcon = mobileMenuButton.querySelector('.hidden'); // Ícone de "X"

        mobileMenuButton.addEventListener('click', () => {
            const isMenuOpen = mobileMenu.classList.contains('block');

            if (isMenuOpen) {
                mobileMenu.classList.remove('block');
                mobileMenu.classList.add('hidden');
                menuOpenIcon.classList.remove('hidden');
                menuOpenIcon.classList.add('block');
                menuCloseIcon.classList.remove('block');
                menuCloseIcon.classList.add('hidden');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
            } else {
                mobileMenu.classList.remove('hidden');
                mobileMenu.classList.add('block');
                menuOpenIcon.classList.remove('block');
                menuOpenIcon.classList.add('hidden');
                menuCloseIcon.classList.remove('hidden');
                menuCloseIcon.classList.add('block');
                mobileMenuButton.setAttribute('aria-expanded', 'true');
            }
        });
    });
</script>
