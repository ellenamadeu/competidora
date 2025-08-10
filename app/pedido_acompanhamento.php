<?php
// pedido_acompanhamento.php
// Página pública para visualização do status e detalhes de um pedido.
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Acompanhamento de Pedido - Competidora</title>
    
    <!-- Tailwind CSS via CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Google Fonts: Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Font Awesome para ícones -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">

    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #111827; /* bg-gray-900 */
            color: #E5E7EB; /* text-gray-200 */
            min-height: 100vh;
        }
        .main-container {
            max-width: 800px;
            margin: 0 auto;
        }
        .detail-section-title {
            font-size: 1.25rem; /* text-xl */
            font-weight: 600; /* font-semibold */
            color: #E5E7EB; /* text-gray-200 */
            margin-bottom: 1rem;
            border-bottom: 1px solid #4B5563; /* gray-600 */
            padding-bottom: 0.5rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .detail-item {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid #374151;
        }
        .detail-item:last-child {
            border-bottom: none;
        }
        .detail-label {
            color: #9CA3AF; /* gray-400 */
            flex-shrink: 0;
            display: flex;
            align-items: center;
            font-weight: 500;
            margin-right: 16px;
        }
        .detail-label i {
            margin-right: 8px;
            font-size: 1.1em;
        }
        .detail-value {
            text-align: left;
            flex-grow: 1;
            word-wrap: break-word;
        }
        .items-table, .payments-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
        }
        .items-table th, .items-table td, .payments-table th, .payments-table td {
            padding: 0.75rem;
            border: 1px solid #4B5563;
            text-align: left;
        }
        .items-table th, .payments-table th {
            background-color: #374151;
            font-weight: 600;
            color: #E5E7EB;
        }
        .items-table tbody tr:nth-child(odd), .payments-table tbody tr:nth-child(odd) {
            background-color: #1F2937;
        }
        .items-table tbody tr:nth-child(even), .payments-table tbody tr:nth-child(even) {
            background-color: #111827;
        }
        .value-bold {
            font-weight: 700;
            color: #E5E7EB;
        }
        /* Estilos para o checkbox estilizado */
        .styled-checkbox-container {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: default;
            user-select: none;
            width: 100%;
        }
        .styled-checkbox-container input[type="checkbox"] {
            position: absolute;
            opacity: 0;
            cursor: default;
            height: 0;
            width: 0;
        }
        .styled-checkbox-checkmark {
            height: 24px;
            width: 24px;
            background-color: #4B5563;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.2s;
            flex-shrink: 0;
        }
        .styled-checkbox-container input[type="checkbox"]:checked ~ .styled-checkbox-checkmark {
            background-color: #25D366;
        }
        .styled-checkbox-checkmark:after {
            content: "";
            position: absolute;
            display: none;
        }
        .styled-checkbox-container input[type="checkbox"]:checked ~ .styled-checkbox-checkmark:after {
            display: block;
            width: 8px;
            height: 14px;
            border: solid white;
            border-width: 0 3px 3px 0;
            transform: rotate(45deg);
        }
        /* Estilos para o Bloco de Valores */
        .values-list .detail-item {
            border-bottom: none;
            padding: 4px 0;
        }
        .values-list .detail-item .detail-value {
            justify-content: flex-end;
            text-align: right;
        }
        .values-list .detail-item .detail-label {
            flex-grow: 1;
            justify-content: flex-start;
        }
    </style>
</head>
<body class="text-gray-200 text-sm md:text-base"> 

    <!-- Main Content Area -->
    <main class="main-container mx-auto px-1 sm:px-2 lg:px-4 py-8">
        <div class="bg-gray-800 p-3 sm:p-4 rounded-lg shadow-xl">
            
            <!-- Block Title -->
            <div class="border-b border-gray-700 pb-4 mb-6">
                <h1 id="orderTitleHeader" class="text-2xl sm:text-3xl font-bold text-white">Carregando Detalhes do Pedido...</h1>
                <p class="text-gray-400 mt-1">Acompanhamento de pedido.</p>
            </div>

            <!-- Order Details Content -->
            <div id="orderDetailsContent" class="mt-6">
                <div id="loading" class="text-center py-10">
                    <p class="text-gray-400">Carregando dados do pedido...</p>
                </div>
                <div id="errorMessage" class="text-center py-10 hidden">
                    <p class="text-red-400">Não foi possível carregar os detalhes do pedido. Verifique o ID ou a conexão.</p>
                </div>
                <div id="noOrderFound" class="text-center py-10 hidden">
                    <p class="text-yellow-400">Nenhum pedido encontrado com o ID fornecido.</p>
                </div>
                
                <!-- Details will be populated here by JavaScript -->
            </div>

            <div class="mt-8 flex justify-end gap-4">
                <a href="#" onclick="window.history.back()" class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
                    Voltar
                </a>
            </div>
        </div>
    </main>

    <script>
        document.addEventListener('DOMContentLoaded', async () => {
            const orderTitleHeader = document.getElementById('orderTitleHeader');
            const orderDetailsContent = document.getElementById('orderDetailsContent');
            const loadingMessage = document.getElementById('loading');
            const errorMessage = document.getElementById('errorMessage');
            const noOrderFoundMessage = document.getElementById('noOrderFound');

            // Função para obter o parâmetro 'id' da URL
            const getOrderIdFromUrl = () => {
                const params = new URLSearchParams(window.location.search);
                return params.get('id');
            };

            const orderId = getOrderIdFromUrl();

            if (!orderId) {
                orderTitleHeader.textContent = 'ID do Pedido Ausente';
                loadingMessage.style.display = 'none';
                errorMessage.style.display = 'block';
                return;
            }

            // Função para formatar datas (DD/MM/YYYY)
            const formatDate = (dateString) => {
                if (!dateString || dateString === '0000-00-00' || dateString === '00/00/0000') return 'N/A';
                const dateOnly = dateString.split(' ')[0]; 
                if (dateOnly.includes('-')) {
                    const [year, month, day] = dateOnly.split('-');
                    return `${day}/${month}/${year}`;
                }
                return dateOnly;
            };

            // Função para formatar valores monetários (sem R$)
            const formatCurrency = (value) => {
                return parseFloat(value || 0).toLocaleString('pt-BR', { 
                    style: 'decimal', 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                });
            };

            // Função para carregar os detalhes do pedido
            const loadOrderDetails = async () => {
                errorMessage.style.display = 'none';
                noOrderFoundMessage.style.display = 'none';
                loadingMessage.style.display = 'block';

                try {
                    const response = await fetch(`backend/get_pedido_acompanhamento.php?id=${encodeURIComponent(orderId)}`);
                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error('Erro HTTP na resposta de get_pedido_acompanhamento.php. Status:', response.status, 'Texto:', errorText);
                        throw new Error(`A resposta do servidor não foi bem-sucedida (${response.status}). Detalhes: ${errorText.substring(0, 200)}...`);
                    }
                    const data = await response.json();
                    console.log('Dados do pedido recebidos:', data); 

                    loadingMessage.style.display = 'none';

                    if (data && data.pedido && data.pedido.id_pedido) {
                        const pedido = data.pedido;
                        const itens = data.itens || [];
                        const pagamentos = data.pagamentos || []; 
                        const agendamentos = data.agendamentos || []; 

                        orderTitleHeader.textContent = `Acompanhamento do Pedido #${pedido.id_pedido} - ${pedido.titulo || 'Sem Título'}`;

                        let htmlContent = '';

                        // --- Bloco 1: ID do Pedido e Status ---
                        htmlContent += `
                            <div class="bg-gray-700 p-3 rounded-lg shadow mb-6">
                                <div class="detail-item"><span class="detail-label">ID do Pedido:</span><span class="detail-value">${pedido.id_pedido || 'N/A'}</span></div>
                                <div class="detail-item"><span class="detail-label">Status:</span><span class="detail-value">${pedido.status_nome || 'N/A'}</span></div>
                            </div>
                        `;

                        // --- Bloco 2: Dados do Cliente (Visão Limitada e Condicional) ---
                        let clienteHtml = '';
                        if (pedido.cliente_nome) {
                            clienteHtml += `
                                <div class="detail-item">
                                    <span class="detail-label"><i class="fas fa-user"></i></span>
                                    <span class="detail-value">${pedido.cliente_nome}</span>
                                </div>
                            `;
                        }
                        if (pedido.cliente_email) {
                            clienteHtml += `
                                <div class="detail-item">
                                    <span class="detail-label"><i class="fas fa-envelope"></i></span>
                                    <span class="detail-value">${pedido.cliente_email}</span>
                                </div>
                            `;
                        }
                        if (pedido.cliente_telefone) {
                            clienteHtml += `
                                <div class="detail-item">
                                    <span class="detail-label"><i class="fas fa-phone"></i></span>
                                    <span class="detail-value">${pedido.cliente_telefone}</span>
                                </div>
                            `;
                        }
                        if (pedido.cliente_telefone2) {
                            clienteHtml += `
                                <div class="detail-item">
                                    <span class="detail-label"><i class="fas fa-phone"></i></span>
                                    <span class="detail-value">${pedido.cliente_telefone2}</span>
                                </div>
                            `;
                        }
                        if (pedido.cliente_telefone3) {
                            clienteHtml += `
                                <div class="detail-item">
                                    <span class="detail-label"><i class="fas fa-phone"></i></span>
                                    <span class="detail-value">${pedido.cliente_telefone3}</span>
                                </div>
                            `;
                        }

                        const enderecoCompleto = [pedido.cliente_endereco, pedido.cliente_bairro].filter(Boolean).join(' - ');
                        if (enderecoCompleto) {
                            clienteHtml += `
                                <div class="detail-item">
                                    <span class="detail-label"><i class="fas fa-map-marker-alt"></i></span>
                                    <span class="detail-value">${enderecoCompleto}</span>
                                </div>
                            `;
                        }

                        if (clienteHtml) {
                            htmlContent += `
                                <div class="bg-gray-700 p-3 rounded-lg shadow mb-6">
                                    <h3 class="detail-section-title">Dados do Cliente</h3>
                                    ${clienteHtml}
                                </div>
                            `;
                        }

                        // --- Seção Itens do Pedido (Tabela com ajustes) ---
                        htmlContent += `
                            <div class="bg-gray-700 p-3 rounded-lg shadow mb-6">
                                <h3 class="detail-section-title">
                                    <span>Itens do Pedido</span>
                                </h3>
                                ${itens.length > 0 ? `
                                    <div class="overflow-x-auto">
                                        <table class="items-table">
                                            <thead>
                                                <tr>
                                                    <th>Produto</th> 
                                                    <th>Altura</th>
                                                    <th>Largura</th>
                                                    <th class="col-qt">Qt</th> 
                                                    <th>Valor Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                ${itens.map(item => `
                                                    <tr>
                                                        <td>
                                                            ${[
                                                                item.produto_sc,
                                                                item.produto_nome,
                                                                item.descricao_nome,
                                                                item.espessura_nome,
                                                                item.acabamento_nome, 
                                                                item.acabamento2
                                                            ].filter(Boolean).join(' ')} 
                                                        </td>
                                                        <td>${item.altura || 'N/A'}</td>
                                                        <td>${item.largura || 'N/A'}</td>
                                                        <td class="col-qt">${item.quantidade || 'N/A'}</td>
                                                        <td>${formatCurrency(item.valor_total)}</td> 
                                                    </tr>
                                                `).join('')}
                                            </tbody>
                                        </table>
                                    </div>
                                ` : '<p class="text-gray-400">Nenhum item neste pedido.</p>'}
                            </div>
                        `;

                        // --- Bloco 4: Valores e Pagamentos (Somente valores para o cliente) ---
                        htmlContent += `
                            <div class="bg-gray-700 p-3 rounded-lg shadow mb-6">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div class="values-list">
                                        <h4 class="detail-section-title mt-0">Valores</h4>
                                        <div class="detail-item"><span class="detail-label">Subtotal:</span><span class="detail-value">${formatCurrency(pedido.subtotal)}</span></div>
                                        <div class="detail-item"><span class="detail-label">Desconto:</span><span class="detail-value">${formatCurrency(pedido.desconto)}</span></div>
                                        <div class="detail-item"><span class="detail-label">Total:</span><span class="detail-value value-bold">${formatCurrency(pedido.total)}</span></div>
                                        <div class="detail-item"><span class="detail-label">Valor Pago:</span><span class="detail-value">${formatCurrency(pedido.valor_pago)}</span></div>
                                        <div class="detail-item"><span class="detail-label">Saldo:</span><span class="detail-value value-bold">${formatCurrency(pedido.saldo)}</span></div>
                                    </div>

                                    <div>
                                        <h4 class="detail-section-title mt-0">
                                            <span>Pagamentos</span>
                                        </h4>
                                        ${pagamentos.length > 0 ? `
                                            <div class="overflow-x-auto">
                                                <table class="payments-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Data</th>
                                                            <th>Forma de Pagamento</th>
                                                            <th>Valor</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        ${pagamentos.map(pag => `
                                                            <tr>
                                                                <td>${formatDate(pag.data)}</td>
                                                                <td>${pag.forma_pagamento_nome || 'N/A'}</td>
                                                                <td>${formatCurrency(pag.valor)}</td>
                                                            </tr>
                                                        `).join('')}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ` : '<p class="text-gray-400">Nenhum pagamento registrado.</p>'}
                                    </div>
                                </div>
                            </div>
                        `;
                        
                        // --- Bloco 5: Agendamentos ---
                        htmlContent += `
                            <div class="bg-gray-700 p-3 rounded-lg shadow mb-6">
                                <h3 class="detail-section-title">
                                    <span>Agendamentos</span>
                                </h3>
                                ${agendamentos.length > 0 ? `
                                    <div class="overflow-x-auto">
                                        <table class="items-table">
                                            <thead>
                                                <tr>
                                                    <th>Data/Hora</th>
                                                    <th>OS</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                ${agendamentos.map(ag => `
                                                    <tr>
                                                        <td>${formatDate(ag.data_agendamento)} - ${ag.hora_agendamento_nome || 'N/A'}</td>
                                                        <td>${ag.ordem_nome || 'N/A'}</td>
                                                        <td class="text-center">
                                                            <label class="styled-checkbox-container">
                                                                <input type="checkbox" ${ag.status_agendamento == 1 ? 'checked' : ''} disabled>
                                                                <span class="styled-checkbox-checkmark"></span>
                                                            </label>
                                                        </td>
                                                    </tr>
                                                `).join('')}
                                            </tbody>
                                        </table>
                                    </div>
                                ` : '<p class="text-gray-400">Nenhum agendamento registrado para este pedido.</p>'}
                            </div>
                        `;

                        orderDetailsContent.innerHTML = htmlContent;

                    } else {
                        noOrderFoundMessage.style.display = 'block';
                        orderTitleHeader.textContent = 'Pedido Não Encontrado';
                    }

                } catch (error) {
                    console.error('Erro ao buscar detalhes do pedido:', error);
                    loadingMessage.style.display = 'none';
                    errorMessage.style.display = 'block';
                    orderTitleHeader.textContent = 'Erro ao Carregar';
                }
            };
            
            // Carrega os detalhes do pedido ao carregar a página
            loadOrderDetails();
        });
    </script>

</body>
</html>
