<?php
// detalhes_cliente.php
// Página para exibir todas as informações do cliente.
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Detalhes do Cliente - Competidora Adm</title>
    
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
        /* Estilos específicos para a página de detalhes do cliente */
        .detail-section-title {
            font-size: 1.25rem; /* text-xl */
            font-weight: 600; /* font-semibold */
            color: #E5E7EB; /* text-gray-200 */
            margin-bottom: 1rem;
            border-bottom: 1px solid #4B5563; /* gray-600 */
            padding-bottom: 0.5rem;
            display: flex; /* Para alinhar título e botão */
            align-items: center;
            justify-content: space-between; /* Espaço entre título e botão */
        }
        .detail-item {
            display: flex;
            justify-content: flex-start; /* Alinha à esquerda */
            align-items: center; /* Centraliza verticalmente o ícone e o texto */
            padding: 8px 0;
            border-bottom: 1px solid #374151; /* gray-700 */
        }
        .detail-item:last-child {
            border-bottom: none;
        }
        .detail-label {
            color: #9CA3AF; /* gray-400 */
            flex-shrink: 0;
            display: flex;
            align-items: center;
        }
        .detail-label i {
            margin-right: 16px; /* Espaço entre o ícone e o valor/dado */
            font-size: 1.1em; /* Tamanho do ícone um pouco maior */
        }
        .detail-value {
            text-align: left; /* Alinha à esquerda */
            flex-grow: 1;
            word-wrap: break-word;
            display: flex; /* Para alinhar o texto e o botão do WhatsApp/Maps */
            align-items: center;
            justify-content: space-between; /* Para empurrar o ícone do mapa para a direita */
        }
        .detail-value .text-content {
            flex-grow: 1;
            word-wrap: break-word;
        }
        /* Estilos para o botão do WhatsApp */
        .whatsapp-btn {
            color: #25D366; /* Cor do WhatsApp */
            font-size: 1.2em; /* Tamanho do ícone */
            margin-left: 8px; /* Espaçamento à esquerda do número */
            transition: color 0.2s ease-in-out;
            flex-shrink: 0; /* Não permite que o botão encolha */
        }
        .whatsapp-btn:hover {
            color: #1DA851; /* Cor mais escura no hover */
        }
        /* Estilos para o botão do Google Maps */
        .map-btn {
            color: #4285F4; /* Cor do Google */
            font-size: 1.2em; /* Tamanho do ícone */
            margin-left: 16px; /* Espaçamento à esquerda do endereço */
            flex-shrink: 0; /* Não permite que o botão encolha */
        }
        .map-btn:hover {
            color: #3367D6; /* Cor mais escura no hover */
        }
        /* Estilos para a tabela de pedidos */
        .orders-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
        }
        .orders-table th, .orders-table td {
            padding: 0.75rem;
            border: 1px solid #4B5563; /* gray-600 */
            text-align: left;
        }
        .orders-table th {
            background-color: #374151; /* gray-700 */
            font-weight: 600;
            color: #E5E7EB;
        }
        .orders-table tbody tr:nth-child(odd) {
            background-color: #1F2937; /* gray-800 */
        }
        .orders-table tbody tr:nth-child(even) {
            background-color: #111827; /* gray-900 */
        }
        .orders-table tbody tr:hover {
            background-color: #4B5563; /* gray-600 */
            cursor: pointer; /* Indica que a linha é clicável */
        }
        /* Estilos para a navegação de paginação */
        .pagination-nav {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 1rem;
            margin-top: 1.5rem;
        }
        .pagination-nav button {
            background-color: #3B82F6;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 0.375rem;
            transition: background-color 0.2s;
        }
        .pagination-nav button:hover:not(:disabled) {
            background-color: #2563EB;
        }
        .pagination-nav button:disabled {
            background-color: #4B5563; /* gray-600 */
            cursor: not-allowed;
            opacity: 0.7;
        }
        .pagination-nav span {
            color: #9CA3AF;
            font-size: 0.9rem;
        }
    </style>
</head>
<body class="text-gray-200">

    <!-- Main Application Container -->
    <div class="min-h-screen">

        <!-- Header/Navbar -->
        <?php include 'header.php'; ?>

        <!-- Main Content Area -->
        <main class="main-container main-container-small mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="bg-gray-800 p-6 sm:p-8 rounded-lg shadow-xl">
                
                <!-- Block Title -->
                <div class="border-b border-gray-700 pb-4 mb-6">
                    <h1 id="clientNameHeader" class="text-2xl sm:text-3xl font-bold text-white">Carregando Detalhes do Cliente...</h1>
                    <p class="text-gray-400 mt-1">Informações completas do cliente.</p>
                </div>

                <!-- Client Details -->
                <div id="clientDetails" class="mt-6">
                    <div id="loading" class="text-center py-10">
                        <p class="text-gray-400">Carregando dados do cliente...</p>
                    </div>
                    <div id="errorMessage" class="text-center py-10 hidden">
                        <p class="text-red-400">Não foi possível carregar os detalhes do cliente. Verifique o ID ou a conexão.</p>
                    </div>
                    <div id="noClientFound" class="text-center py-10 hidden">
                        <p class="text-yellow-400">Nenhum cliente encontrado com o ID fornecido.</p>
                    </div>
                    
                    <!-- Details will be populated here by JavaScript -->
                </div>

                <div class="mt-8 flex justify-end gap-4">
                    <a id="editButton" href="#" class="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out hidden">
                        Editar Cliente
                    </a>
                    <button id="deleteButton" type="button" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out hidden">
                        Excluir Cliente
                    </button>
                    <a href="clientes.php" class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
                        Voltar para a Lista de Clientes
                    </a>
                </div>
            </div>
        </main>

    </div>

    <script>
        document.addEventListener('DOMContentLoaded', async () => {
            const clientNameHeader = document.getElementById('clientNameHeader');
            const clientDetailsContainer = document.getElementById('clientDetails');
            const loadingMessage = document.getElementById('loading');
            const errorMessage = document.getElementById('errorMessage');
            const noClientFoundMessage = document.getElementById('noClientFound');
            const editButton = document.getElementById('editButton'); 
            const deleteButton = document.getElementById('deleteButton'); 

            // Variáveis de paginação
            const recordsPerPage = 20;
            let currentPage = 1;
            let totalRecords = 0;

            // Função para obter o parâmetro 'id' da URL
            const getClientIdFromUrl = () => {
                const params = new URLSearchParams(window.location.search);
                return params.get('id');
            };

            const clientId = getClientIdFromUrl();

            if (!clientId) {
                clientNameHeader.textContent = 'ID do Cliente Ausente';
                loadingMessage.style.display = 'none';
                errorMessage.style.display = 'block';
                return;
            }

            // Função auxiliar para gerar o link do WhatsApp
            const getWhatsAppLink = (ddd, phone) => {
                if (!phone) return '';
                const cleanPhone = phone.replace(/\D/g, ''); // Remove caracteres não numéricos
                const finalDdd = ddd || '21'; // Usa DDD do cliente ou 21 como fallback
                return `<a href="https://wa.me/55${finalDdd}${cleanPhone}" target="_blank" class="whatsapp-btn"><i class="fab fa-whatsapp"></i></a>`;
            };

            // Função auxiliar para gerar o link do Google Maps para navegação de carro
            const getGoogleMapsLink = (address, neighborhood) => {
                if (!address && !neighborhood) return '';
                const destination = encodeURIComponent(`${address || ''} ${neighborhood || ''}, Rio de Janeiro, Brasil`); // Assumindo Rio de Janeiro
                // Link para iniciar navegação de carro
                return `<a href="https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving" target="_blank" class="map-btn"><i class="fas fa-map-marked-alt"></i></a>`;
            };

            // Função para formatar valores monetários (sem R$)
            const formatCurrency = (value) => {
                return parseFloat(value || 0).toLocaleString('pt-BR', { 
                    style: 'decimal', 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                });
            };

            // Função para criar um novo pedido (chamada pelo botão "+")
            const createNewOrder = async () => {
                try {
                    const response = await fetch('backend/add_pedido.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id_cliente: clientId })
                    });
                    const result = await response.json();

                    if (result.success) {
                        alert(result.message);
                        // Recarregar a página para atualizar a lista de pedidos
                        loadClientDetails(); 
                    } else {
                        alert(result.message || 'Erro ao criar novo pedido.');
                    }
                } catch (error) {
                    console.error('Erro ao criar novo pedido:', error);
                    alert('Ocorreu um erro ao tentar criar o novo pedido.');
                }
            };

            // Função principal para carregar os detalhes do cliente e seus pedidos
            const loadClientDetails = async () => {
                errorMessage.style.display = 'none';
                noClientFoundMessage.style.display = 'none';
                loadingMessage.style.display = 'block';

                try {
                    const offset = (currentPage - 1) * recordsPerPage;
                    const response = await fetch(`backend/get_cliente_by_id.php?id=${encodeURIComponent(clientId)}&limit=${recordsPerPage}&offset=${offset}`);
                    if (!response.ok) {
                        throw new Error(`A resposta do servidor não foi bem-sucedida (${response.status})`);
                    }
                    const data = await response.json(); 
                    const client = data.client;
                    const orders = data.orders || []; 
                    totalRecords = data.total_orders_count || 0; // Atualiza o total de registros
                    
                    loadingMessage.style.display = 'none';

                    if (client && client.id_cliente) {
                        clientNameHeader.textContent = client.nome || 'Cliente sem Nome';
                        
                        let htmlContent = `
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="bg-gray-700 p-4 rounded-lg shadow">
                                    <h3 class="detail-section-title">Dados Pessoais</h3>
                                    <div class="detail-item"><span class="detail-label">ID Cliente:</span><span class="detail-value text-content">${client.id_cliente || 'N/A'}</span></div>
                        `;

                        // Condicionalmente adiciona itens se não estiverem vazios
                        const addDetailItem = (iconClass, value, whatsappLink = '', mapsLink = '') => {
                            if (value && value.trim() !== '' && value.trim() !== 'N/A' && value.trim() !== '0') {
                                htmlContent += `
                                    <div class="detail-item">
                                        <span class="detail-label"><i class="${iconClass}"></i></span>
                                        <span class="detail-value">
                                            <span class="text-content">${value}</span>
                                            ${whatsappLink}
                                            ${mapsLink}
                                        </span>
                                    </div>
                                `;
                            }
                        };

                        addDetailItem('fas fa-user', `${client.nome || 'N/A'} - ${client.contato || 'N/A'}`);
                        
                        // Telefones
                        if (client.telefone || client.telefone2 || client.telefone3) {
                            if (client.telefone) {
                                addDetailItem('fas fa-phone', `${client.telefone}`, getWhatsAppLink(client.ddd, client.telefone));
                            }
                            if (client.telefone2) {
                                addDetailItem('fas fa-phone', `${client.telefone2}`, getWhatsAppLink(client.ddd, client.telefone2));
                            }
                            if (client.telefone3) {
                                addDetailItem('fas fa-phone', `${client.telefone3}`, getWhatsAppLink(client.ddd, client.telefone3));
                            }
                        } else {
                            addDetailItem('fas fa-phone', 'N/A'); 
                        }

                        // Endereço e Bairro com link para Maps
                        if (client.endereco || client.bairro) {
                            addDetailItem('fas fa-map-marker-alt', `${client.endereco || 'N/A'} - ${client.bairro || 'N/A'}`, '', getGoogleMapsLink(client.endereco, client.bairro));
                        } else {
                            addDetailItem('fas fa-map-marker-alt', 'N/A'); 
                        }
                        
                        addDetailItem('fas fa-envelope', client.email);
                        addDetailItem('fas fa-id-card', client.documento);
                        addDetailItem('fas fa-map-pin', client.cep);
                        addDetailItem('fas fa-info-circle', client.observacoes);
                        addDetailItem('fas fa-address-book', client.referencias);


                        htmlContent += `
                                </div>
                                <!-- Novo Bloco: Pedidos -->
                                <div class="bg-gray-700 p-4 rounded-lg shadow">
                                    <h3 class="detail-section-title">
                                        <span>Pedidos</span>
                                        <button id="addOrderBtn" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-lg text-sm transition duration-300 ease-in-out" accesskey="n">
                                            <i class="fas fa-plus"></i>
                                        </button>
                                    </h3>
                                    ${orders.length > 0 ? `
                                        <div class="overflow-x-auto">
                                            <table class="orders-table">
                                                <thead>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Título</th>
                                                        <th>Status</th>
                                                        <th>Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    ${orders.map(order => `
                                                        <tr data-order-id="${order.id_pedido}" class="order-row-clickable">
                                                            <td>${order.id_pedido || 'N/A'}</td>
                                                            <td>${order.titulo || 'N/A'}</td>
                                                            <td>${order.status_nome || 'N/A'}</td>
                                                            <td>${formatCurrency(order.total)}</td>
                                                        </tr>
                                                    `).join('')}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div id="ordersPagination" class="pagination-nav mt-4">
                                            <button id="prevOrdersBtn" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-lg text-sm transition duration-300 ease-in-out">Anterior</button>
                                            <span id="ordersPageInfo">Página ${currentPage} de ${Math.ceil(totalRecords / recordsPerPage)}</span>
                                            <button id="nextOrdersBtn" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-lg text-sm transition duration-300 ease-in-out">Próximo</button>
                                        </div>
                                    ` : '<p class="text-gray-400">Nenhum pedido encontrado para este cliente.</p>'}
                                </div>
                            </div>
                        `;

                        clientDetailsContainer.innerHTML = htmlContent;

                        editButton.href = `editar_cliente.php?id=${client.id_cliente}`;
                        editButton.style.display = 'block';
                        deleteButton.style.display = 'block';

                        // Adiciona event listeners para as linhas da tabela de pedidos
                        document.querySelectorAll('.order-row-clickable').forEach(row => {
                            row.addEventListener('click', () => {
                                const orderId = row.dataset.orderId;
                                if (orderId) {
                                    window.location.href = `pedido_detalhes.php?id=${orderId}`;
                                }
                            });
                        });

                        // Adiciona event listener para o botão "Novo Pedido"
                        const addOrderBtn = document.getElementById('addOrderBtn');
                        if (addOrderBtn) {
                            addOrderBtn.addEventListener('click', createNewOrder);
                        }

                        // Lógica de paginação - Habilitar/Desabilitar botões
                        const prevOrdersBtn = document.getElementById('prevOrdersBtn');
                        const nextOrdersBtn = document.getElementById('nextOrdersBtn');
                        const ordersPageInfo = document.getElementById('ordersPageInfo');
                        const ordersPaginationDiv = document.getElementById('ordersPagination');

                        if (totalRecords <= recordsPerPage) { // Oculta se menos de 20 registros
                            if (ordersPaginationDiv) ordersPaginationDiv.classList.add('hidden');
                        } else {
                            if (ordersPaginationDiv) ordersPaginationDiv.classList.remove('hidden');
                        }

                        if (prevOrdersBtn) {
                            prevOrdersBtn.disabled = (currentPage === 1);
                            prevOrdersBtn.onclick = () => {
                                if (currentPage > 1) {
                                    currentPage--;
                                    loadClientDetails();
                                }
                            };
                        }
                        if (nextOrdersBtn) {
                            nextOrdersBtn.disabled = (currentPage * recordsPerPage >= totalRecords);
                            nextOrdersBtn.onclick = () => {
                                if (currentPage * recordsPerPage < totalRecords) {
                                    currentPage++;
                                    loadClientDetails();
                                }
                            };
                        }
                        if (ordersPageInfo) {
                            ordersPageInfo.textContent = `Página ${currentPage} de ${Math.ceil(totalRecords / recordsPerPage)}`;
                        }


                    } else {
                        noClientFoundMessage.style.display = 'block';
                        clientNameHeader.textContent = 'Cliente Não Encontrado';
                    }

                } catch (error) {
                    console.error('Erro ao buscar detalhes do cliente:', error);
                    loadingMessage.style.display = 'none';
                    errorMessage.style.display = 'block';
                    clientNameHeader.textContent = 'Erro ao Carregar';
                }
            };

            // Carrega os detalhes do cliente e seus pedidos ao carregar a página
            loadClientDetails();

            deleteButton.addEventListener('click', async () => {
                if (confirm('Tem certeza que deseja excluir este cliente? Esta ação é irreversível.')) {
                    try {
                        const response = await fetch(`backend/delete_cliente.php?id=${encodeURIComponent(clientId)}`);
                        const result = await response.json();

                        if (result.success) {
                            alert(result.message); 
                            window.location.href = 'clientes.php'; 
                        } else {
                            alert(result.message || 'Erro ao excluir o cliente.');
                        }
                    } catch (error) {
                        console.error('Erro ao excluir cliente:', error);
                        alert('Ocorreu um erro ao tentar excluir o cliente.');
                    }
                }
            });
        });
    </script>

</body>
</html>
