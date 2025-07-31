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

    <style>
        /* Estilos para o novo layout de cartão de pedido */
        .order-card-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1rem;
            background-color: #1F2937; /* gray-800 */
            border-radius: 0.5rem;
            margin-bottom: 0.75rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            cursor: pointer;
            transition: background-color 0.2s;
        }
        .order-card-item:hover {
            background-color: #374151; /* gray-700 */
        }
        .order-card-left-icon {
            flex-shrink: 0;
            width: 56px; /* Largura para o círculo do ícone */
            height: 56px; /* Altura para o círculo do ícone */
            border-radius: 50%;
            background-color: #3B82F6; /* blue-500 */
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.25rem; /* text-xl */
            font-weight: bold;
            margin-right: 1rem;
            text-transform: uppercase;
        }
        .order-card-left-icon span {
            font-size: 0.75rem; /* text-xs */
            font-weight: normal;
            text-align: center;
            line-height: 1; /* Garante que o texto não ocupe muito espaço vertical */
        }
        .order-card-content {
            flex-grow: 1;
            min-width: 0; /* Permite que o conteúdo encolha */
        }
        .order-card-line1 {
            font-weight: bold; /* Negrito para a primeira linha */
            color: #E5E7EB;
            white-space: nowrap; /* Impede quebras de linha */
            overflow: hidden;
            text-overflow: ellipsis; /* Adiciona "..." se o texto for muito longo */
        }
        .order-card-line2 {
            font-size: 0.875rem; /* text-sm */
            color: #9CA3AF;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    </style>
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
                    <p class="text-gray-400 mt-1">Busque, visualize e gerencie os pedidos.</p>
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
                        <a href="#" class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out flex items-center justify-center">
                            <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Novo Pedido
                        </a>
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
                </div>
            </div>
        </main>

    </div>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const searchInput = document.getElementById('orderSearch');
            const statusFilterSelect = document.getElementById('statusFilter');
            const orderList = document.getElementById('orderList');
            const noResults = document.getElementById('noResults');
            const loading = document.getElementById('loading');

            // Função para formatar datas (DD/MM/YYYY) - Não usada diretamente no novo layout de pedidos, mas mantida
            const formatDate = (dateString) => {
                if (!dateString || dateString === '0000-00-00') return 'N/A';
                const [year, month, day] = dateString.split('-');
                return `${day}/${month}/${year}`;
            };

            // Função para formatar valores monetários (sem R$) - Reutilizada
            const formatCurrency = (value) => {
                return parseFloat(value || 0).toLocaleString('pt-BR', { 
                    style: 'decimal', 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                });
            };

            // Função para carregar os status no dropdown de filtro
            const loadStatusFilterDropdown = async () => {
                try {
                    const response = await fetch('backend/get_orc_status.php');
                    if (!response.ok) {
                        throw new Error(`Erro ao carregar status: ${response.status}`);
                    }
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


            // Função para buscar pedidos no backend e renderizar
            const fetchOrders = async () => {
                orderList.innerHTML = '';
                noResults.style.display = 'none';
                loading.style.display = 'block';

                const query = searchInput.value.trim();
                const statusId = statusFilterSelect.value; 

                let url = `backend/get_pedidos.php?query=${encodeURIComponent(query)}`;
                if (statusId !== '0') {
                    url += `&status_id=${encodeURIComponent(statusId)}`;
                }

                try {
                    const response = await fetch(url);
                    if (!response.ok) {
                        // LOG DE DEBUG: Exibe o texto da resposta para ver o erro do servidor
                        const errorText = await response.text();
                        console.error('Erro HTTP na resposta de get_pedidos.php. Status:', response.status, 'Texto:', errorText);
                        throw new Error(`A resposta do servidor não foi bem-sucedida (${response.status}). Detalhes: ${errorText.substring(0, 200)}...`);
                    }
                    const orders = await response.json();
                    
                    loading.style.display = 'none';

                    if (orders.length === 0) {
                        noResults.style.display = 'block';
                    } else {
                        orders.forEach(order => {
                            const orderId = order.id_pedido || 'N/A';
                            const clientName = order.cliente_nome || 'Cliente Indisponível';
                            const title = order.titulo || 'Sem Título';
                            const statusName = order.status_nome || 'Desconhecido';
                            
                            // Obtém a primeira letra do status para o ícone
                            const statusFirstLetter = statusName.charAt(0).toUpperCase();

                            const orderElement = `
                                <div class="order-card-item" onclick="window.location.href='pedido_detalhes.php?id=${orderId}'">
                                    <div class="order-card-left-icon">
                                        ${statusFirstLetter}
                                        <span>${statusName}</span>
                                    </div>
                                    <div class="order-card-content">
                                        <div class="order-card-line1">
                                            #${orderId} - <strong>${clientName}</strong> - ${title}
                                        </div>
                                        <div class="order-card-line2">
                                            ${order.endereco || 'N/A'} - ${order.bairro || 'N/A'}
                                        </div>
                                    </div>
                                </div>
                            `;
                            orderList.insertAdjacentHTML('beforeend', orderElement);
                        });
                    }
                } catch (error) {
                    console.error('Erro ao buscar pedidos:', error);
                    loading.style.display = 'none';
                    orderList.innerHTML = '<p class="text-red-400 text-center">Ocorreu um erro ao carregar os dados. Verifique a conexão e o console para mais detalhes.</p>';
                }
            };

            // Debounce para o campo de busca
            let debounceTimer;
            searchInput.addEventListener('input', () => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    fetchOrders(); 
                }, 300);
            });

            // Event listener para o dropdown de status
            statusFilterSelect.addEventListener('change', () => {
                fetchOrders(); 
            });

            // Carrega os status e depois os pedidos ao carregar a página
            loadStatusFilterDropdown().then(() => {
                fetchOrders(); 
            });
        });
    </script>

</body>
</html>
