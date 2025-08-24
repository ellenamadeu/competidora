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

            // Mapeamento de Status para Cores e Ícones (ATUALIZADO)
            const statusStyles = {
                '1': { colorClass: 'status-gray', icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>` }, // 1. Novo
                '2': { colorClass: 'status-gray', icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>` }, // 2. Medição
                '3': { colorClass: 'status-yellow', icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.75A.75.75 0 013 4.5h.75m0 0a.75.75 0 00.75-.75V3.75m0 0A.75.75 0 003.75 3h-.75m0 0a.75.75 0 00-.75.75v.75m0 0A.75.75 0 003 6h.75M7.5 12h9M7.5 15h9M12 4.5v.75A.75.75 0 0111.25 6h-1.5a.75.75 0 01-.75-.75V4.5m3 0A.75.75 0 0011.25 3h-1.5a.75.75 0 00-.75.75v.75m3 0a.75.75 0 00.75-.75V3.75m0 0A.75.75 0 0012.75 3h-1.5a.75.75 0 00-.75.75v.75" /></svg>` }, // 3. Orçamento
                '4': { colorClass: 'status-blue', icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.472-2.472a3.375 3.375 0 00-4.773-4.773L4.5 15.75l9.17 9.17 2.828-2.828-5.877-5.877z" /></svg>` }, // 4. Produção
                '5': { colorClass: 'status-purple', icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>` }, // 5. Cobrança
                '6': { colorClass: 'status-green', icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>` }, // 6. Concluído
                '7': { colorClass: 'status-red', icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>` }, // 7. Baixado
                'default': { colorClass: 'status-gray', icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`}
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
                    id_cliente: 149, // ID de cliente padrão
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
