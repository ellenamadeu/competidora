<?php
// funcionarios.php
// Página principal para listar e buscar funcionários.
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Competidora Adm - Funcionários</title>
    
    <!-- Tailwind CSS via CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Google Fonts: Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Font Awesome para ícones -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">

    <!-- Custom Styles -->
    <link rel="stylesheet" href="backend/style.css">

</head>
<body class="text-gray-200">

    <!-- Main Application Container -->
    <div class="min-h-screen">

        <!-- Header/Navbar -->
        <?php include 'header.php'; ?>

        <!-- Main Content Area -->
        <main class="main-container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="bg-gray-800 p-6 sm:p-8 rounded-lg shadow-xl">
                
                <!-- Block Title -->
                <div class="border-b border-gray-700 pb-4 mb-6">
                    <h1 class="text-2xl sm:text-3xl font-bold text-white">Funcionários</h1>
                    <p id="pageSubtitle" class="text-gray-400 mt-1">Busque, visualize e gerencie os funcionários.</p>
                </div>

                <!-- Block Content -->
                <div>
                    <!-- Search and Actions Bar -->
                    <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                        <!-- Search Form -->
                        <div class="relative w-full sm:w-auto flex-grow">
                             <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                                <svg class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none"></svg>
                            </span>
                            <input 
                                type="search" 
                                id="funcionarioSearch"
                                class="w-full pl-10 pr-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Buscar por nome ou cargo..."
                            >
                        </div>

                        <!-- Status Filter Dropdown -->
                        <div class="w-full sm:w-auto">
                            <select id="statusFilter" class="w-full py-2 px-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="all">Todos os Status</option>
                                <option value="1">Ativos</option>
                                <option value="0">Inativos</option>
                            </select>
                        </div>
                        
                        <!-- Novo Funcionário Button -->
                        <a href="funcionario_novo.php" class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out flex items-center justify-center" accesskey="n">
                            <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Novo Funcionário
                        </a>
                    </div>

                    <!-- Employee List / Search Results -->
                    <div id="employeeList" class="divide-y divide-gray-700">
                        <!-- Os resultados da busca serão inseridos aqui dinamicamente. -->
                    </div>
                     <div id="noResults" class="text-center py-10 hidden">
                        <p class="text-gray-400">Nenhum funcionário encontrado para esta busca.</p>
                    </div>
                    <div id="loading" class="text-center py-10 hidden">
                        <p class="text-gray-400">Buscando...</p>
                    </div>

                    <!-- Controles de Paginação -->
                    <div id="paginationControls" class="pagination-nav mt-6 hidden">
                        <button id="prevPageBtn">Anterior</button>
                        <span id="pageInfo"></span>
                        <button id="nextPageBtn">Próximo</button>
                    </div>
                </div>
            </div>
        </main>
    </div>
    
    <!-- Modal de Confirmação -->
    <div id="confirmationModal" class="modal hidden">
        <div class="modal-content">
            <h3 id="confirmationModalTitle" class="text-xl font-bold text-white mb-4">Confirmação</h3>
            <p id="confirmationModalMessage" class="text-gray-300 mb-6">Você tem certeza?</p>
            <div class="modal-buttons">
                <button type="button" id="cancelConfirmationBtn" class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg">
                    Cancelar
                </button>
                <button type="button" id="confirmActionBtn" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">
                    Confirmar
                </button>
            </div>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const searchInput = document.getElementById('funcionarioSearch');
            const statusFilter = document.getElementById('statusFilter');
            const employeeList = document.getElementById('employeeList');
            const noResults = document.getElementById('noResults');
            const loading = document.getElementById('loading');
            const pageSubtitle = document.getElementById('pageSubtitle');

            // Modal de Confirmação
            const confirmationModal = document.getElementById('confirmationModal');
            const confirmationModalTitle = document.getElementById('confirmationModalTitle');
            const confirmationModalMessage = document.getElementById('confirmationModalMessage');
            const cancelConfirmationBtn = document.getElementById('cancelConfirmationBtn');
            const confirmActionBtn = document.getElementById('confirmActionBtn');
            let pendingAction = null;

            // Elementos de Paginação
            const paginationControls = document.getElementById('paginationControls');
            const prevPageBtn = document.getElementById('prevPageBtn');
            const nextPageBtn = document.getElementById('nextPageBtn');
            const pageInfo = document.getElementById('pageInfo');
            
            let currentPage = 1;
            let totalPages = 1;
            const recordsPerPage = 20;

            const fetchFuncionarios = async () => {
                employeeList.innerHTML = '';
                noResults.style.display = 'none';
                loading.style.display = 'block';
                paginationControls.classList.add('hidden');

                const query = searchInput.value.trim();
                const status = statusFilter.value;

                try {
                    const response = await fetch(`backend/funcionarios/buscar_funcionarios.php?query=${encodeURIComponent(query)}&status=${status}&page=${currentPage}`);
                    if (!response.ok) {
                        throw new Error(`A resposta do servidor não foi bem-sucedida (${response.status})`);
                    }
                    const result = await response.json();
                    const funcionarios = result.funcionarios;
                    const totalCount = result.total_count;

                    totalPages = Math.ceil(totalCount / recordsPerPage);

                    if (totalCount === 1) {
                        pageSubtitle.textContent = "1 funcionário encontrado.";
                    } else {
                        pageSubtitle.textContent = `${totalCount} funcionários encontrados.`;
                    }
                    
                    loading.style.display = 'none';

                    if (funcionarios.length === 0) {
                        noResults.style.display = 'block';
                    } else {
                        noResults.style.display = 'none';
                        funcionarios.forEach(func => {
                            const fullName = `${func.nome || ''} ${func.sobrenome || ''}`.trim();
                            const cargoText = func.cargo || 'Cargo não informado';
                            const statusText = func.status == 1 ? 'Ativo' : 'Inativo';
                            const statusColor = func.status == 1 ? 'text-green-400' : 'text-red-400';
                            const detailsPageLink = `detalhes_funcionario.php?id=${func.id_funcionario}`;

                            const funcionarioElement = `
                                <div class="flex items-center justify-between p-4 rounded-lg transition-colors duration-200 hover:bg-gray-700/50">
                                    <div class="flex items-center min-w-0 flex-grow cursor-pointer" onclick="window.location.href='${detailsPageLink}'">
                                        <div class="h-12 w-12 rounded-full bg-gray-600 flex-shrink-0 flex items-center justify-center">
                                            <svg class="w-7 h-7 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div class="ml-4 min-w-0 flex-grow">
                                            <div class="text-base font-medium text-white truncate">${fullName}</div>
                                            <div class="text-sm text-gray-400 truncate">${cargoText}</div>
                                        </div>
                                    </div>
                                    <div class="flex items-center flex-shrink-0 ml-4">
                                        <div class="text-sm font-semibold ${statusColor} mr-4 hidden sm:block">${statusText}</div>
                                        <button class="delete-btn text-gray-400 hover:text-red-500 transition-colors" data-id="${func.id_funcionario}" data-name="${fullName}">
                                            <i class="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </div>`;
                            employeeList.insertAdjacentHTML('beforeend', funcionarioElement);
                        });
                        addDeleteListeners();
                        updatePaginationControls();
                    }
                } catch (error) {
                    console.error('Erro ao buscar funcionários:', error);
                    loading.style.display = 'none';
                    employeeList.innerHTML = '<p class="text-red-400 text-center">Ocorreu um erro ao carregar os dados.</p>';
                }
            };

            const showConfirmationModal = (title, message, onConfirm) => {
                confirmationModalTitle.textContent = title;
                confirmationModalMessage.textContent = message;
                pendingAction = onConfirm;
                confirmationModal.classList.remove('hidden');
            };

            const addDeleteListeners = () => {
                document.querySelectorAll('.delete-btn').forEach(button => {
                    button.addEventListener('click', (event) => {
                        event.stopPropagation(); // Impede que o clique propague para o card
                        const funcId = button.dataset.id;
                        const funcName = button.dataset.name;
                        
                        showConfirmationModal(
                            'Desativar Funcionário',
                            `Tem certeza que deseja desativar "${funcName}"?`,
                            async () => {
                                try {
                                    const response = await fetch('backend/funcionarios/delete_funcionario.php', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ id_funcionario: funcId })
                                    });
                                    const result = await response.json();
                                    if (result.success) {
                                        fetchFuncionarios(); // Recarrega a lista
                                    } else {
                                        alert(result.message || 'Erro ao desativar.');
                                    }
                                } catch (error) {
                                    alert('Erro de conexão ao tentar desativar.');
                                }
                            }
                        );
                    });
                });
            };

            const updatePaginationControls = () => {
                if (totalPages > 1) {
                    paginationControls.classList.remove('hidden');
                    pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
                    prevPageBtn.disabled = currentPage === 1;
                    nextPageBtn.disabled = currentPage === totalPages;
                } else {
                    paginationControls.classList.add('hidden');
                }
            };

            let debounceTimer;
            searchInput.addEventListener('input', () => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    currentPage = 1;
                    fetchFuncionarios();
                }, 300);
            });

            statusFilter.addEventListener('change', () => {
                currentPage = 1;
                fetchFuncionarios();
            });

            prevPageBtn.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    fetchFuncionarios();
                }
            });

            nextPageBtn.addEventListener('click', () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    fetchFuncionarios();
                }
            });
            
            cancelConfirmationBtn.addEventListener('click', () => {
                confirmationModal.classList.add('hidden');
                pendingAction = null;
            });

            confirmActionBtn.addEventListener('click', () => {
                if (pendingAction) pendingAction();
                confirmationModal.classList.add('hidden');
                pendingAction = null;
            });

            fetchFuncionarios(); 
        });
    </script>

</body>
</html>
