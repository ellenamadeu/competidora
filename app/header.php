<?php
// header.php
// Este arquivo contém o cabeçalho comum para todas as páginas da aplicação.
// Inicia a sessão se ainda não foi iniciada (necessário para verificar o status de login)
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
?>
<header class="bg-gray-800 shadow-md">
    <div class="main-container mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Linha 1: Nome da Empresa e Login -->
        <div class="flex items-center justify-between h-16 border-b border-gray-700">
            <div class="flex items-center">
                <a href="clientes.php" class="text-white font-bold text-2xl">Competidora</a>
            </div>
            <div class="hidden md:flex items-center">
                 <a href="login.php" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                    <i class="fas fa-sign-in-alt"></i>
                    <span>Login</span>
                </a> 
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

        <!-- Linha 2: Menu Principal -->
        <nav class="hidden md:flex items-center justify-center h-12">
            <div class="flex items-baseline space-x-4">
                <a href="clientes.php" class="menu-item"><i class="fas fa-users"></i><span>Clientes</span></a>
                <a href="pedidos.php" class="menu-item"><i class="fas fa-box-open"></i><span>Pedidos</span></a>
                <a href="agenda.php" class="menu-item"><i class="fas fa-calendar-alt"></i><span>Agenda</span></a>
                <a href="funcionarios.php" class="menu-item"><i class="fas fa-user-tie"></i><span>Funcionários</span></a>
                <a href="#" class="menu-item"><i class="fas fa-chart-bar"></i><span>Relatórios</span></a>
                <a href="#" class="menu-item"><i class="fas fa-cog"></i><span>Configurações</span></a>
            </div>
        </nav>
    </div>

    <!-- Menu mobile, oculto por padrão -->
    <div class="md:hidden hidden" id="mobile-menu">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="clientes.php" class="menu-item-mobile"><i class="fas fa-users"></i><span>Clientes</span></a>
            <a href="pedidos.php" class="menu-item-mobile"><i class="fas fa-box-open"></i><span>Pedidos</span></a>
            <a href="agenda.php" class="menu-item-mobile"><i class="fas fa-calendar-alt"></i><span>Agenda</span></a>
            <a href="funcionarios.php" class="menu-item-mobile"><i class="fas fa-user-tie"></i><span>Funcionários</span></a>
            <a href="#" class="menu-item-mobile"><i class="fas fa-chart-bar"></i><span>Relatórios</span></a>
            <a href="#" class="menu-item-mobile"><i class="fas fa-cog"></i><span>Configurações</span></a>
            <a href="login.php" class="menu-item-mobile text-green-300"><i class="fas fa-sign-in-alt"></i><span>Login</span></a>
        </div>
    </div>
</header>

<script>
    document.addEventListener('DOMContentLoaded', () => {
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        const menuOpenIcon = mobileMenuButton.querySelector('svg.block');
        const menuCloseIcon = mobileMenuButton.querySelector('svg.hidden');

        mobileMenuButton.addEventListener('click', () => {
            const isMenuOpen = mobileMenu.classList.contains('block');

            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('block');
            menuOpenIcon.classList.toggle('hidden');
            menuOpenIcon.classList.toggle('block');
            menuCloseIcon.classList.toggle('hidden');
            menuCloseIcon.classList.toggle('block');
            
            mobileMenuButton.setAttribute('aria-expanded', !isMenuOpen);
        });
    });
</script>
