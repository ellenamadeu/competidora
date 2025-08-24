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
                    Confirmar Exclusão
                </button>
            </div>
        </div>
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

            // Elementos do Modal de Novo Pedido
            const newOrderModal = document.getElementById('newOrderModal');
            const newOrderForm = document.getElementById('newOrderForm');
            const closeNewOrderModalBtn = document.getElementById('closeNewOrderModalBtn');
            const cancelNewOrderBtn = document.getElementById('cancelNewOrderBtn');
            const orderStatusSelect = document.getElementById('orderStatus');
            const newOrderModalMessage = document.getElementById('newOrderModalMessage');

            // Elementos do Modal de Confirmação
            const confirmationModal = document.getElementById('confirmationModal');
            const confirmationModalTitle = document.getElementById('confirmationModalTitle');
            const confirmationModalMessage = document.getElementById('confirmationModalMessage');
            const cancelConfirmationBtn = document.getElementById('cancelConfirmationBtn');
            const confirmActionBtn = document.getElementById('confirmActionBtn');
            let pendingAction = null;

            // Variáveis de paginação
            const recordsPerPage = 20;
            let currentPage = 1;
            let totalRecords = 0;

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
            
            const loadStatusDropdown = async () => {
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
                    console.error('Erro ao carregar status:', error);
                    orderStatusSelect.innerHTML = '<option value="">Erro ao carregar</option>';
                }
            };

            const getWhatsAppLink = (ddd, phone) => {
                if (!phone) return '';
                const cleanPhone = phone.replace(/\D/g, '');
                const finalDdd = ddd || '21';
                return `<a href="https://wa.me/55${finalDdd}${cleanPhone}" target="_blank" class="whatsapp-btn"><i class="fab fa-whatsapp"></i></a>`;
            };

            const getGoogleMapsLink = (address, neighborhood) => {
                if (!address && !neighborhood) return '';
                const destination = encodeURIComponent(`${address || ''} ${neighborhood || ''}, Rio de Janeiro, Brasil`);
                return `<a href="https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving" target="_blank" class="map-btn"><i class="fas fa-map-marked-alt"></i></a>`;
            };

            const formatCurrency = (value) => {
                return parseFloat(value || 0).toLocaleString('pt-BR', { 
                    style: 'decimal', 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                });
            };

            const openNewOrderModal = async () => {
                newOrderForm.reset();
                newOrderModalMessage.classList.add('hidden');
                await loadStatusDropdown();
                newOrderModal.classList.remove('hidden');
            };

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
                    totalRecords = data.total_orders_count || 0;
                    
                    loadingMessage.style.display = 'none';

                    if (client && client.id_cliente) {
                        clientNameHeader.textContent = client.nome || 'Cliente sem Nome';
                        
                        let htmlContent = `
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="bg-gray-700 p-4 rounded-lg shadow">
                                    <h3 class="detail-section-title">Dados Pessoais</h3>
                                    <div class="detail-item"><span class="detail-label">ID Cliente:</span><span class="detail-value text-content">${client.id_cliente || 'N/A'}</span></div>
                        `;

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
                        
                        if (client.telefone || client.telefone2 || client.telefone3) {
                            if (client.telefone) addDetailItem('fas fa-phone', `${client.telefone}`, getWhatsAppLink(client.ddd, client.telefone));
                            if (client.telefone2) addDetailItem('fas fa-phone', `${client.telefone2}`, getWhatsAppLink(client.ddd, client.telefone2));
                            if (client.telefone3) addDetailItem('fas fa-phone', `${client.telefone3}`, getWhatsAppLink(client.ddd, client.telefone3));
                        } else {
                            addDetailItem('fas fa-phone', 'N/A'); 
                        }

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
                                <div class="bg-gray-700 p-4 rounded-lg shadow">
                                    <h3 class="detail-section-title">
                                        <span>Pedidos <span class="bg-gray-900 text-gray-300 text-xs font-semibold px-2 py-1 rounded-full">${totalRecords}</span></span>
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
                                            <button id="prevOrdersBtn">Anterior</button>
                                            <span id="ordersPageInfo"></span>
                                            <button id="nextOrdersBtn">Próximo</button>
                                        </div>
                                    ` : '<p class="text-gray-400">Nenhum pedido encontrado para este cliente.</p>'}
                                </div>
                            </div>
                        `;

                        clientDetailsContainer.innerHTML = htmlContent;

                        editButton.href = `editar_cliente.php?id=${client.id_cliente}`;
                        editButton.style.display = 'block';
                        deleteButton.style.display = 'block';

                        document.querySelectorAll('.order-row-clickable').forEach(row => {
                            row.addEventListener('click', () => {
                                const orderId = row.dataset.orderId;
                                if (orderId) {
                                    window.location.href = `pedido_detalhes.php?id=${orderId}`;
                                }
                            });
                        });

                        const addOrderBtn = document.getElementById('addOrderBtn');
                        if (addOrderBtn) {
                            addOrderBtn.addEventListener('click', openNewOrderModal);
                        }

                        const prevOrdersBtn = document.getElementById('prevOrdersBtn');
                        const nextOrdersBtn = document.getElementById('nextOrdersBtn');
                        const ordersPageInfo = document.getElementById('ordersPageInfo');
                        const ordersPaginationDiv = document.getElementById('ordersPagination');
                        const totalPages = Math.ceil(totalRecords / recordsPerPage);

                        if (totalRecords <= recordsPerPage) {
                            if (ordersPaginationDiv) ordersPaginationDiv.style.display = 'none';
                        } else {
                            if (ordersPaginationDiv) ordersPaginationDiv.style.display = 'flex';
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
                            nextOrdersBtn.disabled = (currentPage >= totalPages);
                            nextOrdersBtn.onclick = () => {
                                if (currentPage < totalPages) {
                                    currentPage++;
                                    loadClientDetails();
                                }
                            };
                        }
                        if (ordersPageInfo) {
                            ordersPageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
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

            loadClientDetails();

            closeNewOrderModalBtn.addEventListener('click', () => newOrderModal.classList.add('hidden'));
            cancelNewOrderBtn.addEventListener('click', () => newOrderModal.classList.add('hidden'));

            newOrderForm.addEventListener('submit', async (event) => {
                event.preventDefault();
                newOrderModalMessage.classList.add('hidden');

                const formData = new FormData(newOrderForm);
                const orderData = {
                    id_cliente: clientId,
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

                    if (result.success) {
                        newOrderModalMessage.textContent = result.message;
                        newOrderModalMessage.className = 'py-2 px-3 rounded-lg text-center bg-green-800 text-white block mb-4';
                        
                        setTimeout(() => {
                            newOrderModal.classList.add('hidden');
                            loadClientDetails();
                        }, 1000);
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

            const showConfirmationModal = (title, message, onConfirm) => {
                confirmationModalTitle.textContent = title;
                confirmationModalMessage.textContent = message;
                pendingAction = onConfirm;
                confirmationModal.classList.remove('hidden');
            };

            cancelConfirmationBtn.addEventListener('click', () => {
                confirmationModal.classList.add('hidden');
                pendingAction = null;
            });

            confirmActionBtn.addEventListener('click', () => {
                if (pendingAction) {
                    pendingAction();
                }
                confirmationModal.classList.add('hidden');
                pendingAction = null;
            });

            deleteButton.addEventListener('click', () => {
                showConfirmationModal(
                    'Excluir Cliente',
                    'Tem certeza que deseja excluir este cliente? Esta ação é irreversível.',
                    async () => {
                        try {
                            const response = await fetch(`backend/delete_cliente.php?id=${encodeURIComponent(clientId)}`, {
                                method: 'DELETE'
                            });
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
                );
            });
        });
    </script>

</body>
</html>
