<?php
// pedidos.php
// Página principal para listar e buscar pedidos.
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Competidora Adm - Pedidos</title>
    
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
                    <h1 class="text-2xl sm:text-3xl font-bold text-white">Pedidos</h1>
                    <p id="pageSubtitle" class="text-gray-400 mt-1">Busque, visualize e gerencie os pedidos.</p>
                </div>

                <!-- Block Content -->
                <div>
                    <!-- Search Bar and Filters -->
                    <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                        <div class="relative w-full sm:w-auto flex-grow">
                             <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                                <svg class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none"></svg>
                            </span>
                            <input 
                                type="search" 
                                id="orderSearch"
                                class="w-full pl-10 pr-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Buscar por ID, cliente, título, data..."
                            >
                        </div>
                        
                        <!-- Status Filter Dropdown -->
                        <div class="w-full sm:w-auto">
                            <select id="statusFilter" class="w-full py-2 px-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="0">Todos os Status</option>
                                <!-- Opções de status serão carregadas via JS -->
                            </select>
                        </div>

                        <!-- Botão Novo Pedido -->
                        <button id="newOrderBtn" type="button" class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out flex items-center justify-center" accesskey="n">
                            <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Novo Pedido
                        </button>
                    </div>

                    <!-- Order List / Search Results -->
                    <div id="orderList" class="divide-y divide-gray-700">
                        <!-- Os resultados da busca do PHP serão inseridos aqui dinamicamente. -->
                    </div>
                     <div id="noResults" class="text-center py-10 hidden">
                        <p class="text-gray-400">Nenhum pedido encontrado para esta busca.</p>
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

    <!-- Modal para Novo Pedido -->
    <div id="newOrderModal" class="modal hidden">
        <div class="modal-content">
            <span class="modal-close-btn" id="closeNewOrderModalBtn">×</span>
            <h3 class="text-xl font-bold text-white mb-4">Novo Pedido</h3>
            <div id="newOrderModalMessage" class="py-2 px-3 rounded-lg text-center hidden mb-4"></div>

            <form id="newOrderForm">
                <div class="form-group">
                    <label for="orderTitle">Título do Pedido:</label>
                    <input type="text" id="orderTitle" name="titulo" required>
                </div>
                <div class="form-group">
                    <label for="orderStatus">Status:</label>
                    <select id="orderStatus" name="status" required>
                        <option value="">Carregando...</option>
                    </select>
                </div>
                <div class="flex justify-end gap-4 mt-6">
                    <button type="button" id="cancelNewOrderBtn" class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg">
                        Cancelar
                    </button>
                    <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                        Criar Pedido
                    </button>
                </div>
            </form>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const searchInput = document.getElementById('orderSearch');
            const statusFilterSelect = document.getElementById('statusFilter');
            const orderList = document.getElementById('orderList');
            const noResults = document.getElementById('noResults');
            const loading = document.getElementById('loading');
            const pageSubtitle = document.getElementById('pageSubtitle');

            // Elementos do Modal de Novo Pedido
            const newOrderBtn = document.getElementById('newOrderBtn');
            const newOrderModal = document.getElementById('newOrderModal');
            const newOrderForm = document.getElementById('newOrderForm');
            const closeNewOrderModalBtn = document.getElementById('closeNewOrderModalBtn');
            const cancelNewOrderBtn = document.getElementById('cancelNewOrderBtn');
            const orderStatusSelect = document.getElementById('orderStatus');
            const newOrderModalMessage = document.getElementById('newOrderModalMessage');

            // Elementos de Paginação
            const paginationControls = document.getElementById('paginationControls');
            const prevPageBtn = document.getElementById('prevPageBtn');
            const nextPageBtn = document.getElementById('nextPageBtn');
            const pageInfo = document.getElementById('pageInfo');
            
            let currentPage = 1;
            let totalPages = 1;
            const recordsPerPage = 20;

            // Mapeamento de Status para Cores e Ícones
            const statusStyles = {
                1: { colorClass: 'status-gray', icon: '' }, // 1. Novo (Vazio)
                2: { colorClass: 'status-gray', icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>` }, // 2. Medição (Trena)
                3: { colorClass: 'status-yellow', icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>` }, // 3. Orçamento (Cifrão)
                4: { colorClass: 'status-blue', icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>` }, // 4. Produção (Ferramentas/Engrenagem)
                5: { colorClass: 'status-purple', icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>` }, // 5. Cobrança (Telefone)
                6: { colorClass: 'status-green', icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>` }, // 6. Concluído (Check)
                7: { colorClass: 'status-red', icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>` }, // 7. Baixado (X)
                default: { colorClass: 'status-gray', icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`}
            };

            const loadStatusFilterDropdown = async () => {
                try {
                    const response = await fetch('backend/get_orc_status.php');
                    if (!response.ok) throw new Error(`Erro ao carregar status: ${response.status}`);
                    const statusList = await response.json();
                    
                    statusFilterSelect.innerHTML = '<option value="0">Todos os Status</option>'; 
                    statusList.forEach(status => {
                        const option = document.createElement('option');
                        option.value = status.id_status;
                        option.textContent = status.status;
                        statusFilterSelect.appendChild(option);
                    });
                } catch (error) {
                    console.error('Erro ao carregar lista de status:', error);
                    statusFilterSelect.innerHTML = '<option value="0">Erro ao carregar status</option>';
                }
            };

            const fetchOrders = async () => {
                orderList.innerHTML = '';
                noResults.style.display = 'none';
                loading.style.display = 'block';
                paginationControls.classList.add('hidden');

                const query = searchInput.value.trim();
                const statusId = statusFilterSelect.value; 

                let url = `backend/get_pedidos.php?query=${encodeURIComponent(query)}&page=${currentPage}`;
                if (statusId !== '0') {
                    url += `&status_id=${encodeURIComponent(statusId)}`;
                }

                try {
                    const response = await fetch(url);
                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(`A resposta do servidor não foi bem-sucedida (${response.status}). Detalhes: ${errorText.substring(0, 200)}...`);
                    }
                    const result = await response.json();
                    const orders = result.orders;
                    const totalCount = result.total_count;

                    totalPages = Math.ceil(totalCount / recordsPerPage);
                    
                    loading.style.display = 'none';

                    if (totalCount === 1) {
                        pageSubtitle.textContent = "1 pedido encontrado.";
                    } else {
                        pageSubtitle.textContent = `${totalCount} pedidos encontrados.`;
                    }

                    if (orders.length === 0) {
                        noResults.style.display = 'block';
                    } else {
                        orders.forEach(order => {
                            const orderId = order.id_pedido || 'N/A';
                            const clientName = order.cliente_nome || 'Cliente Indisponível';
                            const title = order.titulo || 'Sem Título';
                            const statusId = order.id_status;
                            const address = [order.endereco, order.bairro].filter(Boolean).join(' - ') || 'Endereço não informado';

                            const style = statusStyles[statusId] || statusStyles.default;

                            const orderElement = `
                                <div class="order-card-item" onclick="window.location.href='pedido_detalhes.php?id=${orderId}'">
                                    <div class="order-card-left-icon ${style.colorClass}">
                                        ${style.icon}
                                    </div>
                                    <div class="order-card-content">
                                        <div class="order-card-line1">
                                            <strong>${clientName}</strong> - ${title}
                                        </div>
                                        <div class="order-card-line2">
                                            ${address}
                                        </div>
                                    </div>
                                </div>
                            `;
                            orderList.insertAdjacentHTML('beforeend', orderElement);
                        });
                        updatePaginationControls();
                    }
                } catch (error) {
                    console.error('Erro ao buscar pedidos:', error);
                    loading.style.display = 'none';
                    orderList.innerHTML = '<p class="text-red-400 text-center">Ocorreu um erro ao carregar os dados.</p>';
                }
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
                    fetchOrders(); 
                }, 300);
            });

            statusFilterSelect.addEventListener('change', () => {
                currentPage = 1;
                localStorage.setItem('pedidosStatusFilter', statusFilterSelect.value);
                fetchOrders(); 
            });

            prevPageBtn.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    fetchOrders();
                }
            });

            nextPageBtn.addEventListener('click', () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    fetchOrders();
                }
            });

            const loadStatusDropdownForModal = async () => {
                try {
                    const response = await fetch('backend/get_orc_status.php');
                    if (!response.ok) throw new Error('Erro ao carregar status');
                    const statusList = await response.json();
                    orderStatusSelect.innerHTML = '<option value="">Selecione um Status</option>';
                    statusList.forEach(status => {
                        const option = document.createElement('option');
                        option.value = status.id_status;
                        option.textContent = status.status;
                        orderStatusSelect.appendChild(option);
                    });
                } catch (error) {
                    console.error('Erro ao carregar status para o modal:', error);
                    orderStatusSelect.innerHTML = '<option value="">Erro ao carregar</option>';
                }
            };

            const openNewOrderModal = async () => {
                newOrderForm.reset();
                newOrderModalMessage.classList.add('hidden');
                await loadStatusDropdownForModal();
                newOrderModal.classList.remove('hidden');
            };

            newOrderBtn.addEventListener('click', openNewOrderModal);
            closeNewOrderModalBtn.addEventListener('click', () => newOrderModal.classList.add('hidden'));
            cancelNewOrderBtn.addEventListener('click', () => newOrderModal.classList.add('hidden'));

            newOrderForm.addEventListener('submit', async (event) => {
                event.preventDefault();
                newOrderModalMessage.classList.add('hidden');

                const formData = new FormData(newOrderForm);
                const orderData = {
                    id_cliente: 149,
                    titulo: formData.get('titulo'),
                    status: formData.get('status')
                };

                try {
                    const response = await fetch('backend/add_pedido.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(orderData)
                    });
                    const result = await response.json();

                    if (result.success && result.id_pedido) {
                        window.location.href = `pedido_detalhes.php?id=${result.id_pedido}`;
                    } else {
                        newOrderModalMessage.textContent = result.message || 'Erro ao criar pedido.';
                        newOrderModalMessage.className = 'py-2 px-3 rounded-lg text-center bg-red-800 text-white block mb-4';
                    }
                } catch (error) {
                    console.error('Erro ao criar pedido:', error);
                    newOrderModalMessage.textContent = 'Ocorreu um erro de conexão.';
                    newOrderModalMessage.className = 'py-2 px-3 rounded-lg text-center bg-red-800 text-white block mb-4';
                }
            });

            loadStatusFilterDropdown().then(() => {
                const savedStatusId = localStorage.getItem('pedidosStatusFilter');
                if (savedStatusId) {
                    statusFilterSelect.value = savedStatusId;
                }
                fetchOrders(); 
            });
        });
    </script>

</body>
</html>
