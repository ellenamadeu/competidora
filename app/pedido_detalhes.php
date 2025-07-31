<?php
// pedido_detalhes.php
// Página para exibir detalhes de um pedido específico.
// Este arquivo deve conter apenas o HTML e JavaScript, e incluir o header.php.
// A lógica de banco de dados é feita via AJAX para scripts no diretório 'backend/'.
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Detalhes do Pedido - Competidora Adm</title>
    
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
        /* Estilos específicos para detalhes do pedido */
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
            display: flex; /* Para alinhar o texto do telefone e o botão do WhatsApp */
            align-items: center;
            justify-content: space-between; /* Para empurrar o ícone do mapa para a direita */
        }
        .detail-value .address-text {
            flex-grow: 1;
            word-wrap: break-word;
        }
        /* Estilos para a tabela de itens */
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
        }
        .items-table th, .items-table td {
            padding: 0.75rem;
            border: 1px solid #4B5563; /* gray-600 */
            text-align: left;
        }
        .items-table th {
            background-color: #374151; /* gray-700 */
            font-weight: 600;
            color: #E5E7EB;
        }
        .items-table tbody tr:nth-child(odd) {
            background-color: #1F2937; /* gray-800 */
        }
        .items-table tbody tr:nth-child(even) {
            background-color: #111827; /* gray-900 */
        }
        .items-table tbody tr:hover {
            background-color: #4B5563; /* gray-600 */
            cursor: pointer; /* Indica que a linha é clicável */
        }
        /* Ajuste de largura para a coluna Qt */
        .items-table .col-qt {
            width: 50px; /* Ajuste conforme necessário para 4 dígitos */
            text-align: center;
        }
        /* Estilos para o botão do WhatsApp */
        .whatsapp-btn {
            color: #25D366; /* Cor do WhatsApp */
            font-size: 1.2em; /* Tamanho do ícone */
            margin-left: 8px; /* Espaçamento à esquerda do número */
            transition: color 0.2s ease-in-out;
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
        /* Estilos para a tabela de pagamentos */
        .payments-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
        }
        .payments-table th, .payments-table td {
            padding: 0.75rem;
            border: 1px solid #4B5563; /* gray-600 */
            text-align: center; /* Alinha ao centro */
        }
        .payments-table th {
            background-color: #374151; /* gray-700 */
            font-weight: 600;
            color: #E5E7EB;
        }
        .payments-table tbody tr:nth-child(odd) {
            background-color: #1F2937; /* gray-800 */
        }
        .payments-table tbody tr:nth-child(even) {
            background-color: #111827; /* gray-900 */
        }
        .payments-table tbody tr:hover {
            background-color: #4B5563; /* gray-600 */
            cursor: pointer; /* Indica que a linha é clicável */
        }
        .values-list .detail-item {
            border-bottom: none; /* Remove borda inferior dos itens de valor */
            padding: 4px 0; /* Espaçamento menor */
        }
        /* Alinhamento à direita para os valores na lista de valores */
        .values-list .detail-item .detail-value {
            justify-content: flex-end; /* Alinha o conteúdo à direita */
            text-align: right; /* Garante que o texto dentro do span também esteja à direita */
        }
        .values-list .detail-item .detail-label {
            flex-grow: 1; /* Permite que a label ocupe o espaço restante à esquerda */
            justify-content: flex-start; /* Garante que a label permaneça à esquerda */
        }
        /* Estilo para negrito em valores */
        .value-bold {
            font-weight: 700; /* bold */
            color: #E5E7EB; /* text-gray-200 */
        }

        /* Estilos para o checkbox estilizado */
        .styled-checkbox-container {
            display: inline-flex;
            align-items: center;
            cursor: default; /* Não é clicável para edição aqui */
            user-select: none;
            margin-left: 10px; /* Espaço do texto */
        }

        .styled-checkbox-container input[type="checkbox"] {
            position: absolute;
            opacity: 0;
            cursor: default;
            height: 0;
            width: 0;
        }

        .styled-checkbox-checkmark {
            height: 24px; /* Tamanho maior */
            width: 24px; /* Tamanho maior */
            background-color: #4B5563; /* gray-600 */
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.2s;
            flex-shrink: 0; /* Garante que não encolha */
        }

        .styled-checkbox-checkmark:after {
            content: "";
            position: absolute;
            display: none;
        }

        .styled-checkbox-container input[type="checkbox"]:checked ~ .styled-checkbox-checkmark:after {
            display: block;
            left: 8px; /* Ajustado para tamanho maior */
            top: 3px; /* Ajustado para tamanho maior */
            width: 8px; /* Ajustado para tamanho maior */
            height: 14px; /* Ajustado para tamanho maior */
            border: solid white;
            border-width: 0 3px 3px 0;
            transform: rotate(45deg);
        }

        /* Estilos do Modal */
        .modal {
            position: fixed;
            z-index: 1000; /* Acima de tudo */
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0,0,0,0.7); /* Fundo escuro transparente */
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .modal-content {
            background-color: #1F2937; /* gray-800 */
            margin: auto;
            padding: 20px;
            border-radius: 8px;
            width: 90%;
            max-width: 500px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            position: relative;
        }

        .modal-close-btn {
            color: #aaa;
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
        }
        .modal-close-btn:hover,
        .modal-close-btn:focus {
            color: white;
            text-decoration: none;
            cursor: pointer;
        }

        .modal-form-group {
            margin-bottom: 1rem;
        }
        .modal-form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: #9CA3AF;
        }
        .modal-form-group input[type="date"],
        .modal-form-group input[type="time"],
        .modal-form-group input[type="text"],
        .modal-form-group select,
        .modal-form-group textarea {
            width: 100%;
            padding: 0.75rem;
            background-color: #374151;
            border: 1px solid #4B5563;
            border-radius: 0.5rem;
            color: #E5E7EB;
        }
        .modal-form-group textarea {
            min-height: 80px;
            resize: vertical;
        }
        .modal-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 1rem;
            margin-top: 1.5rem;
        }
        /* Estilo para o botão de exclusão no modal de atualização */
        .modal-buttons .delete-btn {
            background-color: #DC2626; /* red-600 */
            color: white;
            font-weight: bold;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            transition: background-color 0.2s ease-in-out;
        }
        .modal-buttons .delete-btn:hover {
            background-color: #B91C1C; /* red-700 */
        }
    </style>
</head>
<body class="text-gray-200 text-sm md:text-base"> 

    <!-- Main Application Container -->
    <div class="min-h-screen">

        <!-- Header/Navbar -->
        <?php include 'header.php'; ?>

        <!-- Main Content Area -->
        <main class="main-container main-container-small mx-auto px-1 sm:px-2 lg:px-4 py-8">
            <div class="bg-gray-800 p-3 sm:p-4 rounded-lg shadow-xl">
                
                <!-- Block Title -->
                <div class="border-b border-gray-700 pb-4 mb-6">
                    <h1 id="orderTitleHeader" class="text-2xl sm:text-3xl font-bold text-white">Carregando Detalhes do Pedido...</h1>
                    <p class="text-gray-400 mt-1">Informações completas do pedido.</p>
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
                    <!-- Botões de ação (Editar/Excluir podem ser adicionados futuramente) -->
                    <a href="pedidos.php" class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
                        Voltar para a Lista de Pedidos
                    </a>
                </div>
            </div>
        </main>

    </div>

    <!-- Modal para Novo Agendamento -->
    <div id="newAppointmentModal" class="modal hidden">
        <div class="modal-content">
            <span class="modal-close-btn">&times;</span>
            <h3 class="text-xl font-bold text-white mb-4">Novo Agendamento</h3>
            <div id="modalMessage" class="py-2 px-3 rounded-lg text-center hidden mb-4"></div>

            <form id="newAppointmentForm">
                <input type="hidden" id="modalOrderId" name="id_pedido">

                <div class="modal-form-group">
                    <label for="appointmentDate">Data:</label>
                    <input type="date" id="appointmentDate" name="data_agendamento" required>
                </div>
                <div class="modal-form-group">
                    <label for="appointmentTime">Hora:</label>
                    <select id="appointmentTime" name="hora_agendamento" required>
                        <option value="">Selecione a Hora</option>
                        <!-- Opções serão carregadas dinamicamente via JS -->
                    </select>
                </div>
                <div class="modal-form-group">
                    <label for="appointmentOrder">OS:</label>
                    <select id="appointmentOrder" name="ordem" required>
                        <option value="">Selecione a Ordem</option>
                        <!-- Opções serão carregadas dinamicamente via JS -->
                    </select>
                </div>
                <div class="modal-form-group">
                    <label for="appointmentResponsible">Responsável:</label>
                    <select id="appointmentResponsible" name="responsavel" required>
                        <option value="">Carregando Responsáveis...</option>
                    </select>
                </div>
                <div class="modal-form-group">
                    <label for="appointmentInstruction">Instruções:</label>
                    <textarea id="appointmentInstruction" name="instrucao" rows="3"></textarea>
                </div>
                <div class="modal-form-group flex items-center">
                    <label for="appointmentStatus" class="mr-3">Concluído:</label>
                    <label class="styled-checkbox-container">
                        <input type="checkbox" id="appointmentStatus" name="status_agendamento" value="1">
                        <span class="styled-checkbox-checkmark"></span>
                    </label>
                </div>

                <div class="modal-buttons">
                    <button type="button" id="cancelAppointmentBtn" class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
                        Cancelar
                    </button>
                    <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
                        Salvar Agendamento
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Modal para Novo Item -->
    <div id="newItemModal" class="modal hidden">
        <div class="modal-content">
            <span class="modal-close-btn" id="closeNewItemModalBtn">&times;</span>
            <h3 class="text-xl font-bold text-white mb-4">Novo Item do Pedido</h3>
            <div id="newItemModalMessage" class="py-2 px-3 rounded-lg text-center hidden mb-4"></div>

            <form id="newItemForm">
                <input type="hidden" id="newItemModalOrderId" name="id_pedido">
                <input type="hidden" id="newItemModalClientId" name="id_cliente">

                <!-- Campos Altura, Largura, Quantidade lado a lado -->
                <div class="flex flex-wrap gap-4 mb-4">
                    <div class="flex-1 min-w-[calc(33%-1rem)]"> <!-- Aproximadamente 1/3 da largura, ajusta para telas menores -->
                        <label for="itemAltura" class="block text-sm font-medium text-gray-400">Altura:</label>
                        <input type="text" id="itemAltura" name="altura" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white" required maxlength="10">
                    </div>
                    <div class="flex-1 min-w-[calc(33%-1rem)]">
                        <label for="itemLargura" class="block text-sm font-medium text-gray-400">Largura:</label>
                        <input type="text" id="itemLargura" name="largura" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white" required maxlength="10">
                    </div>
                    <div class="flex-1 min-w-[calc(33%-1rem)]">
                        <label for="itemQuantidade" class="block text-sm font-medium text-gray-400">Quantidade:</label>
                        <input type="text" id="itemQuantidade" name="quantidade" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white" required maxlength="5">
                    </div>
                </div>

                <div class="modal-form-group">
                    <label for="itemProdutoSC">Produto S/C:</label>
                    <input type="text" id="itemProdutoSC" name="produto_sc">
                </div>
                <div class="modal-form-group">
                    <label for="itemCategoria">Categoria:</label>
                    <select id="itemCategoria" name="categoria">
                        <option value="">Selecione a Categoria</option>
                    </select>
                </div>
                <div class="modal-form-group">
                    <label for="itemProduto">Produto:</label>
                    <select id="itemProduto" name="produto">
                        <option value="">Selecione o Produto</option>
                    </select>
                </div>
                <div class="modal-form-group">
                    <label for="itemDescricao">Descrição:</label>
                    <select id="itemDescricao" name="descricao">
                        <option value="">Selecione a Descrição</option>
                    </select>
                </div>
                <div class="modal-form-group">
                    <label for="itemEspessura">Espessura:</label>
                    <select id="itemEspessura" name="espessura">
                        <option value="">Selecione a Espessura</option>
                    </select>
                </div>
                <div class="modal-form-group">
                    <label for="itemAcabamento">Acabamento:</label>
                    <select id="itemAcabamento" name="acabamento">
                        <option value="">Selecione o Acabamento</option>
                    </select>
                </div>
                <div class="modal-form-group">
                    <label for="itemAcabamento2">Acabamento 2:</label>
                    <input type="text" id="itemAcabamento2" name="acabamento2">
                </div>
                
                <!-- Campos Valor Unitário e Valor Total lado a lado -->
                <div class="flex flex-wrap gap-4 mb-4">
                    <div class="flex-1 min-w-[calc(50%-0.5rem)]"> <!-- Aproximadamente 1/2 da largura -->
                        <label for="itemValorUnitario" class="block text-sm font-medium text-gray-400">Valor Unitário:</label>
                        <input type="text" id="itemValorUnitario" name="valor_unitario" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
                    </div>
                    <div class="flex-1 min-w-[calc(50%-0.5rem)]">
                        <label for="itemValorTotal" class="block text-sm font-medium text-gray-400">Valor Total:</label>
                        <input type="text" id="itemValorTotal" name="valor_total" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white" readonly>
                    </div>
                </div>

                <div class="modal-buttons">
                    <button type="button" id="cancelNewItemBtn" class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
                        Cancelar
                    </button>
                    <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
                        Salvar Item
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Modal para Atualizar Item -->
    <div id="updateItemModal" class="modal hidden">
        <div class="modal-content">
            <span class="modal-close-btn" id="closeUpdateItemModalBtn">&times;</span>
            <h3 class="text-xl font-bold text-white mb-4">Atualizar Item do Pedido</h3>
            <div id="updateItemModalMessage" class="py-2 px-3 rounded-lg text-center hidden mb-4"></div>

            <form id="updateItemForm">
                <input type="hidden" id="updateItemModalItemId" name="id_item"> <!-- ID do item a ser atualizado -->
                <input type="hidden" id="updateItemModalOrderId" name="id_pedido">
                <input type="hidden" id="updateItemModalClientId" name="id_cliente">

                <!-- Campos Altura, Largura, Quantidade lado a lado para atualização -->
                <div class="flex flex-wrap gap-4 mb-4">
                    <div class="flex-1 min-w-[calc(33%-1rem)]">
                        <label for="updateItemAltura" class="block text-sm font-medium text-gray-400">Altura:</label>
                        <input type="text" id="updateItemAltura" name="altura" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white" required maxlength="10">
                    </div>
                    <div class="flex-1 min-w-[calc(33%-1rem)]">
                        <label for="updateItemLargura" class="block text-sm font-medium text-gray-400">Largura:</label>
                        <input type="text" id="updateItemLargura" name="largura" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white" required maxlength="10">
                    </div>
                    <div class="flex-1 min-w-[calc(33%-1rem)]">
                        <label for="updateItemQuantidade" class="block text-sm font-medium text-gray-400">Quantidade:</label>
                        <input type="text" id="updateItemQuantidade" name="quantidade" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white" required maxlength="5">
                    </div>
                </div>

                <div class="modal-form-group">
                    <label for="updateItemProdutoSC">Produto S/C:</label>
                    <input type="text" id="updateItemProdutoSC" name="produto_sc">
                </div>
                <div class="modal-form-group">
                    <label for="updateItemCategoria">Categoria:</label>
                    <select id="updateItemCategoria" name="categoria">
                        <option value="">Selecione a Categoria</option>
                    </select>
                </div>
                <div class="modal-form-group">
                    <label for="updateItemProduto">Produto:</label>
                    <select id="updateItemProduto" name="produto">
                        <option value="">Selecione o Produto</option>
                    </select>
                </div>
                <div class="modal-form-group">
                    <label for="updateItemDescricao">Descrição:</label>
                    <select id="updateItemDescricao" name="descricao">
                        <option value="">Selecione a Descrição</option>
                    </select>
                </div>
                <div class="modal-form-group">
                    <label for="updateItemEspessura">Espessura:</label>
                    <select id="updateItemEspessura" name="espessura">
                        <option value="">Selecione a Espessura</option>
                    </select>
                </div>
                <div class="modal-form-group">
                    <label for="updateItemAcabamento">Acabamento:</label>
                    <select id="updateItemAcabamento" name="acabamento">
                        <option value="">Selecione o Acabamento</option>
                    </select>
                </div>
                <div class="modal-form-group">
                    <label for="updateItemAcabamento2">Acabamento 2:</label>
                    <input type="text" id="updateItemAcabamento2" name="acabamento2">
                </div>
                
                <!-- Campos Valor Unitário e Valor Total lado a lado para atualização -->
                <div class="flex flex-wrap gap-4 mb-4">
                    <div class="flex-1 min-w-[calc(50%-0.5rem)]">
                        <label for="updateItemValorUnitario" class="block text-sm font-medium text-gray-400">Valor Unitário:</label>
                        <input type="text" id="updateItemValorUnitario" name="valor_unitario" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
                    </div>
                    <div class="flex-1 min-w-[calc(50%-0.5rem)]">
                        <label for="updateItemValorTotal" class="block text-sm font-medium text-gray-400">Valor Total:</label>
                        <input type="text" id="updateItemValorTotal" name="valor_total" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white" readonly>
                    </div>
                </div>

                <div class="modal-buttons">
                    <!-- Botão Excluir Item adicionado aqui -->
                    <button type="button" id="deleteItemBtn" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
                        Excluir Item
                    </button>
                    <button type="button" id="cancelUpdateItemBtn" class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
                        Cancelar
                    </button>
                    <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
                        Atualizar Item
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Modal para Novo Pagamento -->
    <div id="newPaymentModal" class="modal hidden">
        <div class="modal-content">
            <span class="modal-close-btn" id="closeNewPaymentModalBtn">&times;</span>
            <h3 class="text-xl font-bold text-white mb-4">Novo Pagamento</h3>
            <div id="paymentModalMessage" class="py-2 px-3 rounded-lg text-center hidden mb-4"></div>

            <form id="newPaymentForm">
                <input type="hidden" id="paymentModalOrderId" name="id_pedido">

                <div class="modal-form-group">
                    <label for="paymentFormaPagamento">Forma de Pagamento:</label>
                    <select id="paymentFormaPagamento" name="forma_pagamento" required>
                        <option value="">Selecione a Forma</option>
                    </select>
                </div>
                <div class="modal-form-group">
                    <label for="paymentValue">Valor:</label>
                    <input type="text" id="paymentValue" name="valor" required>
                </div>

                <div class="modal-buttons">
                    <button type="button" id="cancelNewPaymentBtn" class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
                        Cancelar
                    </button>
                    <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
                        Registrar Pagamento
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Modal para Atualizar Pagamento (NOVO) -->
    <div id="updatePaymentModal" class="modal hidden">
        <div class="modal-content">
            <span class="modal-close-btn" id="closeUpdatePaymentModalBtn">&times;</span>
            <h3 class="text-xl font-bold text-white mb-4">Atualizar Pagamento</h3>
            <div id="updatePaymentModalMessage" class="py-2 px-3 rounded-lg text-center hidden mb-4"></div>

            <form id="updatePaymentForm">
                <input type="hidden" id="updatePaymentModalPaymentId" name="id_caixa_entrada">
                <input type="hidden" id="updatePaymentModalOrderId" name="id_pedido">

                <div class="modal-form-group">
                    <label for="updatePaymentDate">Data:</label>
                    <input type="date" id="updatePaymentDate" name="data" required>
                </div>
                <div class="modal-form-group">
                    <label for="updatePaymentFormaPagamento">Forma de Pagamento:</label>
                    <select id="updatePaymentFormaPagamento" name="forma_pagamento" required>
                        <option value="">Selecione a Forma</option>
                    </select>
                </div>
                <div class="modal-form-group">
                    <label for="updatePaymentValue">Valor:</label>
                    <input type="text" id="updatePaymentValue" name="valor" required>
                </div>

                <div class="modal-buttons">
                    <button type="button" id="deletePaymentBtn" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
                        Excluir Pagamento
                    </button>
                    <button type="button" id="cancelUpdatePaymentBtn" class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
                        Cancelar
                    </button>
                    <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
                        Atualizar Pagamento
                    </button>
                </div>
            </form>
        </div>
    </div>


    <script>
        document.addEventListener('DOMContentLoaded', async () => {
            // Garante que todos os modais estejam ocultos no carregamento inicial
            document.getElementById('newItemModal').classList.add('hidden');
            document.getElementById('updateItemModal').classList.add('hidden');
            document.getElementById('newPaymentModal').classList.add('hidden'); 
            document.getElementById('updatePaymentModal').classList.add('hidden'); // Ocultar o novo modal também

            const orderTitleHeader = document.getElementById('orderTitleHeader');
            const orderDetailsContent = document.getElementById('orderDetailsContent');
            const loadingMessage = document.getElementById('loading');
            const errorMessage = document.getElementById('errorMessage');
            const noOrderFoundMessage = document.getElementById('noOrderFound');

            // Elementos do Modal de Novo Item
            const newItemModal = document.getElementById('newItemModal');
            const closeNewItemModalBtn = document.getElementById('closeNewItemModalBtn');
            const cancelNewItemBtn = document.getElementById('cancelNewItemBtn');
            const newItemForm = document.getElementById('newItemForm');
            const newItemModalOrderIdInput = document.getElementById('newItemModalOrderId');
            const newItemModalClientIdInput = document.getElementById('newItemModalClientId'); 
            const newItemModalMessageDiv = document.getElementById('newItemModalMessage');
            const addItemBtn = document.getElementById('addItemBtn'); // Botão "+" para itens

            // Campos do formulário de Novo Item
            const itemProdutoSCInput = document.getElementById('itemProdutoSC');
            const itemCategoriaSelect = document.getElementById('itemCategoria');
            const itemProdutoSelect = document.getElementById('itemProduto');
            const itemDescricaoSelect = document.getElementById('itemDescricao');
            const itemEspessuraSelect = document.getElementById('itemEspessura');
            const itemAcabamentoSelect = document.getElementById('itemAcabamento');
            const itemAcabamento2Input = document.getElementById('itemAcabamento2');
            const itemAlturaInput = document.getElementById('itemAltura'); 
            const itemLarguraInput = document.getElementById('itemLargura'); 
            const itemQuantidadeInput = document.getElementById('itemQuantidade'); 
            const itemValorUnitarioInput = document.getElementById('itemValorUnitario');
            const itemValorTotalInput = document.getElementById('itemValorTotal');

            // Elementos do Modal de Atualizar Item
            const updateItemModal = document.getElementById('updateItemModal');
            const closeUpdateItemModalBtn = document.getElementById('closeUpdateItemModalBtn');
            const cancelUpdateItemBtn = document.getElementById('cancelUpdateItemBtn');
            const updateItemForm = document.getElementById('updateItemForm');
            const updateItemModalItemIdInput = document.getElementById('updateItemModalItemId'); // Hidden ID do item
            const updateItemModalOrderIdInput = document.getElementById('updateItemModalOrderId'); // Hidden ID do pedido para atualização
            const updateItemModalClientIdInput = document.getElementById('updateItemModalClientId'); // Hidden ID do cliente para atualização
            const updateItemModalMessageDiv = document.getElementById('updateItemModalMessage');
            const deleteItemBtn = document.getElementById('deleteItemBtn'); // Botão Excluir Item

            // Campos do formulário de Atualizar Item (com prefixo 'updateItem')
            const updateItemProdutoSCInput = document.getElementById('updateItemProdutoSC');
            const updateItemCategoriaSelect = document.getElementById('updateItemCategoria');
            const updateItemProdutoSelect = document.getElementById('updateItemProduto');
            const updateItemDescricaoSelect = document.getElementById('updateItemDescricao');
            const updateItemEspessuraSelect = document.getElementById('updateItemEspessura');
            const updateItemAcabamentoSelect = document.getElementById('updateItemAcabamento');
            const updateItemAcabamento2Input = document.getElementById('updateItemAcabamento2');
            const updateItemAlturaInput = document.getElementById('updateItemAltura');
            const updateItemLarguraInput = document.getElementById('updateItemLargura');
            const updateItemQuantidadeInput = document.getElementById('updateItemQuantidade');
            const updateItemValorUnitarioInput = document.getElementById('updateItemValorUnitario');
            const updateItemValorTotalInput = document.getElementById('updateItemValorTotal');

            // Elementos do Modal de Novo Pagamento
            const newPaymentModal = document.getElementById('newPaymentModal');
            const closeNewPaymentModalBtn = document.getElementById('closeNewPaymentModalBtn');
            const cancelNewPaymentBtn = document.getElementById('cancelNewPaymentBtn');
            const newPaymentForm = document.getElementById('newPaymentForm');
            const paymentModalOrderIdInput = document.getElementById('paymentModalOrderId');
            const paymentModalMessageDiv = document.getElementById('paymentModalMessage');
            const paymentFormaPagamentoSelect = document.getElementById('paymentFormaPagamento');
            const paymentValueInput = document.getElementById('paymentValue');
            const addPaymentBtnElement = document.getElementById('addPaymentBtn'); // OBTENDO A REFERÊNCIA AQUI

            // Elementos do Modal de Atualizar Pagamento (NOVO)
            const updatePaymentModal = document.getElementById('updatePaymentModal');
            const closeUpdatePaymentModalBtn = document.getElementById('closeUpdatePaymentModalBtn');
            const cancelUpdatePaymentBtn = document.getElementById('cancelUpdatePaymentBtn');
            const updatePaymentForm = document.getElementById('updatePaymentForm');
            const updatePaymentModalPaymentIdInput = document.getElementById('updatePaymentModalPaymentId'); // Hidden ID do pagamento
            const updatePaymentModalOrderIdForUpdateInput = document.getElementById('updatePaymentModalOrderId'); // Hidden ID do pedido para atualização de pagamento
            const updatePaymentModalMessageDiv = document.getElementById('updatePaymentModalMessage');
            const deletePaymentBtn = document.getElementById('deletePaymentBtn'); // Botão Excluir Pagamento

            // Campos do formulário de Atualizar Pagamento
            const updatePaymentDateInput = document.getElementById('updatePaymentDate');
            const updatePaymentFormaPagamentoSelect = document.getElementById('updatePaymentFormaPagamento');
            const updatePaymentValueInput = document.getElementById('updatePaymentValue');


            // Variável global para armazenar o ID do cliente do pedido atual
            let currentClientId = null;


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

            // Função para limpar e converter o valor para float (para envio ao backend)
            const cleanAndParse = (value) => {
                // Remove todos os pontos (separadores de milhar) e depois substitui a vírgula por ponto
                return parseFloat(value.replace(/\./g, '').replace(',', '.')) || 0;
            };

            // Função para carregar os detalhes do pedido
            const loadOrderDetails = async () => {
                errorMessage.style.display = 'none';
                noOrderFoundMessage.style.display = 'none';
                loadingMessage.style.display = 'block';

                try {
                    const response = await fetch(`backend/get_pedido_detalhes.php?id=${encodeURIComponent(orderId)}`);
                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error('Erro HTTP na resposta de get_pedido_detalhes.php. Status:', response.status, 'Texto:', errorText);
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
                        console.log('Agendamentos recebidos:', agendamentos); 

                        orderTitleHeader.textContent = `Pedido #${pedido.id_pedido} - ${pedido.titulo || 'Sem Título'}`;
                        currentClientId = pedido.id_cliente; // Armazena o ID do cliente

                        let htmlContent = '';

                        // --- Bloco 1: ID do Pedido e Status ---
                        htmlContent += `
                            <div class="bg-gray-700 p-3 rounded-lg shadow mb-6">
                                <div class="detail-item"><span class="detail-label">ID do Pedido:</span><span class="detail-value">${pedido.id_pedido || 'N/A'}</span></div>
                                <div class="detail-item"><span class="detail-label">Status:</span><span class="detail-value">${pedido.status_nome || 'N/A'}</span></div>
                            </div>
                        `;

                        // --- Bloco 2: Dados do Cliente ---
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

                        htmlContent += `
                            <div class="bg-gray-700 p-3 rounded-lg shadow mb-6">
                                <h3 class="detail-section-title">Dados do Cliente</h3>
                                <div class="detail-item">
                                    <span class="detail-label"><i class="fas fa-user"></i></span>
                                    <span class="detail-value">${pedido.cliente_nome || 'N/A'} - ${pedido.cliente_contato || 'N/A'}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label"><i class="fas fa-phone"></i></span>
                                    <span class="detail-value">
                                        ${pedido.cliente_telefone || 'N/A'} ${getWhatsAppLink(pedido.cliente_ddd, pedido.cliente_telefone)}
                                    </span>
                                </div>
                                ${pedido.cliente_telefone2 ? `
                                <div class="detail-item">
                                    <span class="detail-label"><i class="fas fa-phone"></i></span>
                                    <span class="detail-value">
                                        ${pedido.cliente_telefone2} ${getWhatsAppLink(pedido.cliente_ddd, pedido.cliente_telefone2)}
                                    </span>
                                </div>
                                ` : ''}
                                ${pedido.cliente_telefone3 ? `
                                <div class="detail-item">
                                    <span class="detail-label"><i class="fas fa-phone"></i></span>
                                    <span class="detail-value">
                                        ${pedido.cliente_telefone3} ${getWhatsAppLink(pedido.cliente_ddd, pedido.cliente_telefone3)}
                                    </span>
                                </div>
                                ` : ''}
                                <div class="detail-item">
                                    <span class="detail-label"><i class="fas fa-map-marker-alt"></i></span>
                                    <span class="detail-value">
                                        <span class="address-text">${pedido.cliente_endereco || 'N/A'} - ${pedido.cliente_bairro || 'N/A'}</span>
                                        ${getGoogleMapsLink(pedido.cliente_endereco, pedido.cliente_bairro)}
                                    </span>
                                </div>
                            </div>
                        `;

                        // --- Seção Itens do Pedido (Tabela com ajustes) ---
                        htmlContent += `
                            <div class="bg-gray-700 p-3 rounded-lg shadow mb-6">
                                <h3 class="detail-section-title">
                                    <span>Itens do Pedido</span>
                                    <button id="addItemBtn" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-lg text-sm transition duration-300 ease-in-out" accesskey="n">
                                        <i class="fas fa-plus"></i>
                                    </button>
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
                                                    <th>Valor Unitário</th>
                                                    <th>Valor Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                ${itens.map(item => `
                                                    <tr data-item-id="${item.id_item}" class="item-row-clickable">
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
                                                        <td>${formatCurrency(item.valor_unitario)}</td> 
                                                        <td>${formatCurrency(item.valor_total)}</td> 
                                                    </tr>
                                                `).join('')}
                                            </tbody>
                                        </table>
                                    </div>
                                ` : '<p class="text-gray-400">Nenhum item neste pedido.</p>'}
                            </div>
                        `;

                        // --- Bloco 4: Valores e Pagamentos ---
                        htmlContent += `
                            <div class="bg-gray-700 p-3 rounded-lg shadow mb-6">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div class="values-list">
                                        <h4 class="detail-section-title mt-0">Valores</h4>
                                        <div class="detail-item"><span class="detail-label">Subtotal:</span><span class="detail-value">${formatCurrency(data.soma_itens_total)}</span></div>
                                        <div class="detail-item"><span class="detail-label">Desconto:</span><span class="detail-value">${formatCurrency(pedido.desconto)}</span></div>
                                        <div class="detail-item"><span class="detail-label">Total:</span><span class="detail-value value-bold">${formatCurrency(pedido.pedido_total)}</span></div>
                                        <div class="detail-item"><span class="detail-label">Valor Pago:</span><span class="detail-value">${formatCurrency(data.soma_valor_pago)}</span></div>
                                        <div class="detail-item"><span class="detail-label">Saldo:</span><span class="detail-value value-bold">${formatCurrency(pedido.pedido_saldo)}</span></div>
                                    </div>

                                    <div>
                                        <h4 class="detail-section-title mt-0">
                                            <span>Pagamentos</span>
                                            <button id="addPaymentBtn" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-lg text-sm transition duration-300 ease-in-out">
                                                <i class="fas fa-plus"></i>
                                            </button>
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
                                                            <tr data-payment-id="${pag.id_caixa_entrada}" class="payment-row-clickable">
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

                        // --- Bloco 5: Agendamentos (Removido o conteúdo da tabela) ---
                        htmlContent += `
                            <div class="bg-gray-700 p-3 rounded-lg shadow mb-6">
                                <h3 class="detail-section-title">
                                    <span>Agendamentos</span>
                                    <button id="addAppointmentBtn" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-lg text-sm transition duration-300 ease-in-out">
                                        <i class="fas fa-plus"></i>
                                    </button>
                                </h3>
                                <p class="text-gray-400">Nenhum agendamento registrado para este pedido.</p>
                            </div>
                        `;


                        orderDetailsContent.innerHTML = htmlContent;

                        // --- ADICIONANDO EVENT LISTENERS APÓS O HTML SER INSERIDO ---
                        // Event listener para o botão "+" de Item
                        const currentAddItemBtn = document.getElementById('addItemBtn');
                        if (currentAddItemBtn) {
                            currentAddItemBtn.addEventListener('click', async () => {
                                newItemModalOrderIdInput.value = orderId;
                                newItemModalClientIdInput.value = currentClientId; // Define o ID do cliente
                                newItemModalMessageDiv.textContent = '';
                                newItemModalMessageDiv.classList.add('hidden');
                                newItemForm.reset();

                                // Carregar dropdowns do formulário de item
                                await loadItemCategoriesDropdown(itemCategoriaSelect); 
                                await loadItemEspessurasDropdown(itemEspessuraSelect); 
                                
                                newItemModal.classList.remove('hidden');
                            });
                        }

                        // Event listener para o botão "+" de Pagamento
                        const addPaymentBtnElement = document.getElementById('addPaymentBtn');
                        if (addPaymentBtnElement) { // Garante que o elemento existe antes de adicionar o listener
                            addPaymentBtnElement.addEventListener('click', async () => {
                                paymentModalOrderIdInput.value = orderId;
                                paymentModalMessageDiv.textContent = '';
                                paymentModalMessageDiv.classList.add('hidden');
                                newPaymentForm.reset();

                                await loadFormasPagamentoDropdown(paymentFormaPagamentoSelect);
                                
                                newPaymentModal.classList.remove('hidden');
                            });
                        }


                        // Adiciona event listeners para as linhas da tabela de itens (para abrir o modal de atualização)
                        document.querySelectorAll('.item-row-clickable').forEach(row => {
                            row.addEventListener('click', () => {
                                const itemId = row.dataset.itemId;
                                if (itemId) {
                                    loadItemForUpdate(itemId);
                                }
                            });
                        });

                        // Adiciona event listeners para as linhas da tabela de pagamentos (para abrir o modal de atualização)
                        document.querySelectorAll('.payment-row-clickable').forEach(row => {
                            row.addEventListener('click', () => {
                                const paymentId = row.dataset.paymentId; // CORREÇÃO: Usar dataset.paymentId
                                if (paymentId) {
                                    loadPaymentForUpdate(paymentId);
                                }
                            });
                        });


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

            // Funções de carregamento de dropdowns para Item (Novo Item e Atualizar Item)
            const loadItemCategoriesDropdown = async (targetSelect, selectedValue = null) => {
                try {
                    const response = await fetch('backend/get_item_categorias.php');
                    if (!response.ok) {
                        throw new Error(`Erro ao carregar categorias de item: ${response.status}`);
                    }
                    const categorias = await response.json();
                    targetSelect.innerHTML = '<option value="">Selecione a Categoria</option>';
                    categorias.forEach(cat => {
                        const option = document.createElement('option');
                        option.value = cat.id_categoria;
                        option.textContent = cat.categoria;
                        if (selectedValue !== null && selectedValue == cat.id_categoria) { 
                            option.selected = true;
                        }
                        targetSelect.appendChild(option);
                    });
                } catch (error) {
                    console.error('Erro ao carregar lista de categorias de item:', error);
                    targetSelect.innerHTML = '<option value="">Erro ao carregar categorias</option>';
                }
            };

            const loadItemProductsDropdown = async (targetSelect, categoryId, selectedValue = null) => {
                targetSelect.innerHTML = '<option value="">Selecione o Produto</option>';
                if (!categoryId) return;
                try {
                    const response = await fetch(`backend/get_item_produtos.php?categoria_id=${categoryId}`);
                    if (!response.ok) {
                        throw new Error(`Erro ao carregar produtos de item: ${response.status}`);
                    }
                    const produtos = await response.json();
                    produtos.forEach(prod => {
                        const option = document.createElement('option');
                        option.value = prod.id_produto;
                        option.textContent = prod.produto;
                        if (selectedValue !== null && selectedValue == prod.id_produto) {
                            option.selected = true;
                        }
                        targetSelect.appendChild(option);
                    });
                } catch (error) {
                    console.error('Erro ao carregar lista de produtos de item:', error);
                    targetSelect.innerHTML = '<option value="">Erro ao carregar produtos</option>';
                }
            };

            const loadItemDescriptionsDropdown = async (targetSelect, categoryId, selectedValue = null) => {
                targetSelect.innerHTML = '<option value="">Selecione a Descrição</option>';
                if (!categoryId) return;
                try {
                    const response = await fetch(`backend/get_item_descricoes.php?categoria_id=${categoryId}`);
                    if (!response.ok) {
                        throw new Error(`Erro ao carregar descrições de item: ${response.status}`);
                    }
                    const descricoes = await response.json();
                    descricoes.forEach(desc => {
                        const option = document.createElement('option');
                        option.value = desc.id_descricao;
                        option.textContent = desc.descricao;
                        if (selectedValue !== null && selectedValue == desc.id_descricao) {
                            option.selected = true;
                        }
                        targetSelect.appendChild(option);
                    });
                } catch (error) {
                    console.error('Erro ao carregar lista de descrições de item:', error);
                    targetSelect.innerHTML = '<option value="">Erro ao carregar descrições</option>';
                }
            };

            const loadItemEspessurasDropdown = async (targetSelect, selectedValue = null) => {
                try {
                    const response = await fetch('backend/get_item_espessuras.php');
                    if (!response.ok) {
                        throw new Error(`Erro ao carregar espessuras de item: ${response.status}`);
                    }
                    const espessuras = await response.json();
                    targetSelect.innerHTML = '<option value="">Selecione a Espessura</option>';
                    espessuras.forEach(esp => {
                        const option = document.createElement('option');
                        option.value = esp.id_espessura;
                        option.textContent = esp.espessura;
                        if (selectedValue !== null && selectedValue == esp.id_espessura) {
                            option.selected = true;
                        }
                        targetSelect.appendChild(option);
                    });
                } catch (error) {
                    console.error('Erro ao carregar lista de espessuras de item:', error);
                    targetSelect.innerHTML = '<option value="">Erro ao carregar espessuras</option>';
                }
            };

            const loadItemAcabamentosDropdown = async (targetSelect, categoryId, selectedValue = null) => {
                targetSelect.innerHTML = '<option value="">Selecione o Acabamento</option>';
                if (!categoryId) return;
                try {
                    const response = await fetch(`backend/get_item_acabamentos.php?categoria_id=${categoryId}`);
                    if (!response.ok) {
                        throw new Error(`Erro ao carregar acabamentos de item: ${response.status}`);
                    }
                    const acabamentos = await response.json();
                    acabamentos.forEach(acab => {
                        const option = document.createElement('option');
                        option.value = acab.id_acabamento;
                        option.textContent = acab.acabamento;
                        if (selectedValue !== null && selectedValue == acab.id_acabamento) {
                            option.selected = true;
                        }
                        targetSelect.appendChild(option);
                    });
                } catch (error) {
                    console.error('Erro ao carregar lista de acabamentos de item:', error);
                    targetSelect.innerHTML = '<option value="">Erro ao carregar acabamentos</option>';
                }
            };

            // Funções de carregamento de dropdowns para Pagamento
            const loadFormasPagamentoDropdown = async (targetSelect, selectedValue = null) => {
                try {
                    const response = await fetch('backend/get_formas_pagamento.php');
                    if (!response.ok) {
                        throw new Error(`Erro ao carregar formas de pagamento: ${response.status}`);
                    }
                    const formasPagamento = await response.json();
                    targetSelect.innerHTML = '<option value="">Selecione a Forma</option>';
                    formasPagamento.forEach(fp => {
                        const option = document.createElement('option');
                        option.value = fp.id_pagamento;
                        option.textContent = fp.pagamento;
                        if (selectedValue !== null && selectedValue == fp.id_pagamento) {
                            option.selected = true;
                        }
                        targetSelect.appendChild(option);
                    });
                } catch (error) {
                    console.error('Erro ao carregar formas de pagamento:', error);
                    targetSelect.innerHTML = '<option value="">Erro ao carregar formas</option>';
                }
            };


            // Lógica de cálculo do Valor Total do Item (para ambos os formulários)
            const calculateItemValorTotal = (alturaInput, larguraInput, quantidadeInput, valorUnitarioInput, valorTotalInput) => {
                const cleanAndParse = (value) => {
                    // Remove todos os pontos (separadores de milhar) e depois substitui a vírgula por ponto
                    return parseFloat(value.replace(/\./g, '').replace(',', '.')) || 0;
                };

                const quantidade = cleanAndParse(quantidadeInput.value);
                const valorUnitario = cleanAndParse(valorUnitarioInput.value);
                const valorTotal = quantidade * valorUnitario;
                
                valorTotalInput.value = formatCurrency(valorTotal);
            };

            // Event listeners para cálculo no formulário de Novo Item
            itemQuantidadeInput.addEventListener('input', () => calculateItemValorTotal(itemAlturaInput, itemLarguraInput, itemQuantidadeInput, itemValorUnitarioInput, itemValorTotalInput));
            itemValorUnitarioInput.addEventListener('input', () => calculateItemValorTotal(itemAlturaInput, itemLarguraInput, itemQuantidadeInput, itemValorUnitarioInput, itemValorTotalInput));

            // Event listeners para cálculo no formulário de Atualizar Item
            updateItemQuantidadeInput.addEventListener('input', () => calculateItemValorTotal(updateItemAlturaInput, updateItemLarguraInput, updateItemQuantidadeInput, updateItemValorUnitarioInput, updateItemValorTotalInput));
            updateItemValorUnitarioInput.addEventListener('input', () => calculateItemValorTotal(updateItemAlturaInput, updateItemLarguraInput, updateItemQuantidadeInput, updateItemValorUnitarioInput, updateItemValorTotalInput));


            // Lógica de dropdowns encadeados para Novo Item
            itemCategoriaSelect.addEventListener('change', () => {
                const categoryId = itemCategoriaSelect.value;
                loadItemProductsDropdown(itemProdutoSelect, categoryId);
                loadItemDescriptionsDropdown(itemDescricaoSelect, categoryId);
                loadItemAcabamentosDropdown(itemAcabamentoSelect, categoryId);
            });

            // Lógica de dropdowns encadeados para Atualizar Item
            updateItemCategoriaSelect.addEventListener('change', async () => { 
                const categoryId = updateItemCategoriaSelect.value;
                await loadItemProductsDropdown(updateItemProdutoSelect, categoryId); 
                await loadItemDescriptionsDropdown(updateItemDescricaoSelect, categoryId); 
                await loadItemAcabamentosDropdown(updateItemAcabamentoSelect, categoryId); 
            });


            // Função para carregar os dados de um item para atualização
            const loadItemForUpdate = async (itemId) => {
                try {
                    const response = await fetch(`backend/get_item_by_id.php?id=${encodeURIComponent(itemId)}`);
                    if (!response.ok) {
                        throw new Error(`Erro ao carregar item para atualização: ${response.status}`);
                    }
                    const itemData = await response.json();

                    if (itemData) {
                        // Preenche os campos do formulário de atualização
                        updateItemModalItemIdInput.value = itemData.id_item;
                        updateItemModalOrderIdInput.value = itemData.id_pedido || ''; 
                        updateItemModalClientIdInput.value = itemData.id_cliente || ''; 
                        updateItemProdutoSCInput.value = itemData.produto_sc || '';
                        updateItemAcabamento2Input.value = itemData.acabamento2 || '';
                        updateItemAlturaInput.value = itemData.altura || '';
                        updateItemLarguraInput.value = itemData.largura || '';
                        updateItemQuantidadeInput.value = itemData.quantidade || '';
                        updateItemValorUnitarioInput.value = itemData.valor_unitario || '';
                        updateItemValorTotalInput.value = itemData.valor_total || '';

                        // Carrega e seleciona os dropdowns dinâmicos
                        // Categoria (espera carregar para depois carregar os dependentes)
                        await loadItemCategoriesDropdown(updateItemCategoriaSelect, itemData.categoria);
                        // Dependentes da categoria
                        if (itemData.categoria) {
                            // Carrega e seleciona, aguardando a conclusão de cada um
                            await loadItemProductsDropdown(updateItemProdutoSelect, itemData.categoria, itemData.produto);
                            await loadItemDescriptionsDropdown(updateItemDescricaoSelect, itemData.categoria, itemData.descricao);
                            await loadItemAcabamentosDropdown(updateItemAcabamentoSelect, itemData.categoria, itemData.acabamento);
                        }
                        // Espessura
                        await loadItemEspessurasDropdown(updateItemEspessuraSelect, itemData.espessura);

                        updateItemModalMessageDiv.textContent = '';
                        updateItemModalMessageDiv.classList.add('hidden');
                        updateItemModal.classList.remove('hidden'); // Exibe o modal
                    } else {
                        alert('Item não encontrado para atualização.');
                    }
                } catch (error) {
                    console.error('Erro ao carregar item para atualização:', error);
                    alert('Ocorreu um erro ao carregar os dados do item para atualização.');
                }
            };

            // Função para carregar os dados de um pagamento para atualização (NOVO)
            const loadPaymentForUpdate = async (paymentId) => {
                try {
                    const response = await fetch(`backend/get_pagamento_by_id.php?id=${encodeURIComponent(paymentId)}`);
                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error('Erro HTTP ao carregar pagamento para atualização. Status:', response.status, 'Texto:', errorText);
                        throw new Error(`Erro ao carregar pagamento para atualização: ${response.status}. Detalhes: ${errorText.substring(0, 200)}...`);
                    }
                    const paymentData = await response.json();

                    if (paymentData) {
                        updatePaymentModalPaymentIdInput.value = paymentData.id_caixa_entrada;
                        updatePaymentModalOrderIdForUpdateInput.value = paymentData.id_pedido; // Preenche o ID do pedido
                        updatePaymentDateInput.value = paymentData.data;
                        updatePaymentValueInput.value = formatCurrency(paymentData.valor);

                        await loadFormasPagamentoDropdown(updatePaymentFormaPagamentoSelect, paymentData.forma_pagamento);

                        updatePaymentModalMessageDiv.textContent = '';
                        updatePaymentModalMessageDiv.classList.add('hidden');
                        updatePaymentModal.classList.remove('hidden'); // Exibe o modal
                    } else {
                        alert('Pagamento não encontrado para atualização.');
                    }
                } catch (error) {
                    console.error('Erro ao carregar pagamento para atualização:', error);
                    alert('Ocorreu um erro ao carregar os dados do pagamento para atualização.');
                }
            };


            // Carrega os detalhes do pedido ao carregar a página
            loadOrderDetails();

            // Event Listeners do Modal de Novo Item
            closeNewItemModalBtn.addEventListener('click', () => {
                newItemModal.classList.add('hidden');
                newItemForm.reset();
            });

            cancelNewItemBtn.addEventListener('click', () => {
                newItemModal.classList.add('hidden');
                newItemForm.reset();
            });

            // Event Listeners do Modal de Atualizar Item
            closeUpdateItemModalBtn.addEventListener('click', () => {
                updateItemModal.classList.add('hidden');
                updateItemForm.reset();
            });

            cancelUpdateItemBtn.addEventListener('click', () => {
                updateItemModal.classList.add('hidden');
                updateItemForm.reset();
            });

            // Event listener para o botão Excluir Item no modal de atualização
            deleteItemBtn.addEventListener('click', async () => {
                const itemIdToDelete = updateItemModalItemIdInput.value;
                if (!itemIdToDelete) {
                    alert('ID do item para exclusão não encontrado.');
                    return;
                }

                if (confirm('Tem certeza que deseja excluir este item? Esta ação é irreversível.')) {
                    try {
                        const response = await fetch(`backend/delete_item.php?id=${encodeURIComponent(itemIdToDelete)}`);
                        const result = response.json();

                        if (result.success) {
                            updateItemModalMessageDiv.textContent = result.message;
                            updateItemModalMessageDiv.className = 'py-2 px-3 rounded-lg text-center bg-green-800 text-white block mb-4';
                            updateItemForm.reset();
                            setTimeout(() => {
                                updateItemModal.classList.add('hidden');
                                loadOrderDetails(); // Recarrega os detalhes para refletir a exclusão
                            }, 1500);
                        } else {
                            alert(result.message || 'Erro ao excluir item.');
                            updateItemModalMessageDiv.className = 'py-2 px-3 rounded-lg text-center bg-red-800 text-white block mb-4';
                        }
                    } catch (error) {
                        console.error('Erro ao enviar exclusão de item:', error);
                        updateItemModalMessageDiv.textContent = 'Ocorreu um erro ao tentar excluir o item.';
                        updateItemModalMessageDiv.className = 'py-2 px-3 rounded-lg text-center bg-red-800 text-white block mb-4';
                    }
                }
            });


            // Fechar modais ao clicar fora
            window.addEventListener('click', (event) => {
                if (event.target == newItemModal) {
                    newItemModal.classList.add('hidden');
                    newItemForm.reset();
                }
                if (event.target == updateItemModal) {
                    updateItemModal.classList.add('hidden');
                    updateItemForm.reset();
                }
                if (event.target == newPaymentModal) { 
                    newPaymentModal.classList.add('hidden');
                    newPaymentForm.reset();
                }
                if (event.target == updatePaymentModal) { // NOVO: Fechar modal de atualização de pagamento
                    updatePaymentModal.classList.add('hidden');
                    updatePaymentForm.reset();
                }
            });

            // Lidar com o envio do formulário de Novo Pagamento
            newPaymentForm.addEventListener('submit', async (event) => {
                event.preventDefault();

                paymentModalMessageDiv.classList.add('hidden');

                const formData = new FormData(newPaymentForm);
                const paymentData = {
                    id_pedido: formData.get('id_pedido'),
                    forma_pagamento: formData.get('forma_pagamento'),
                    valor: cleanAndParse(formData.get('valor')) 
                };

                try {
                    const response = await fetch('backend/add_pagamento.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(paymentData)
                    });

                    const result = await response.json();

                    if (result.success) {
                        paymentModalMessageDiv.textContent = result.message;
                        paymentModalMessageDiv.className = 'py-2 px-3 rounded-lg text-center bg-green-800 text-white block mb-4';
                        newPaymentForm.reset();
                        setTimeout(() => {
                            newPaymentModal.classList.add('hidden');
                            loadOrderDetails(); // Recarrega os detalhes para mostrar o novo pagamento e totais atualizados
                        }, 1500);
                    } else {
                        paymentModalMessageDiv.textContent = result.message || result.error || 'Erro ao registrar pagamento.';
                        paymentModalMessageDiv.className = 'py-2 px-3 rounded-lg text-center bg-red-800 text-white block mb-4';
                    }
                } catch (error) {
                    console.error('Erro ao enviar pagamento:', error);
                    paymentModalMessageDiv.textContent = 'Ocorreu um erro ao tentar registrar o pagamento.';
                    paymentModalMessageDiv.className = 'py-2 px-3 rounded-lg text-center bg-red-800 text-white block mb-4';
                }
            });

            // Lidar com o envio do formulário de Atualizar Pagamento (NOVO)
            updatePaymentForm.addEventListener('submit', async (event) => {
                event.preventDefault();

                updatePaymentModalMessageDiv.classList.add('hidden');

                const formData = new FormData(updatePaymentForm);
                const paymentData = {
                    id_caixa_entrada: formData.get('id_caixa_entrada'),
                    id_pedido: formData.get('id_pedido'),
                    data: formData.get('data'),
                    forma_pagamento: formData.get('forma_pagamento'),
                    valor: cleanAndParse(formData.get('valor'))
                };

                console.log("DEBUG: Dados do pagamento sendo enviados para atualização:", paymentData);

                try {
                    const response = await fetch('backend/update_pagamento.php', {
                        method: 'POST', // Ou 'PUT' se seu servidor suportar e você configurar
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(paymentData)
                    });

                    const result = await response.json();
                    console.log("DEBUG: Resposta do backend update_pagamento.php:", result);

                    if (result.success) {
                        updatePaymentModalMessageDiv.textContent = result.message;
                        updatePaymentModalMessageDiv.className = 'py-2 px-3 rounded-lg text-center bg-green-800 text-white block mb-4';
                        updatePaymentForm.reset();
                        setTimeout(() => {
                            updatePaymentModal.classList.add('hidden');
                            loadOrderDetails(); // Recarrega os detalhes para mostrar o pagamento atualizado
                        }, 1500);
                    } else {
                        updatePaymentModalMessageDiv.textContent = result.message || result.error || 'Erro ao atualizar pagamento.';
                        updatePaymentModalMessageDiv.className = 'py-2 px-3 rounded-lg text-center bg-red-800 text-white block mb-4';
                    }
                } catch (error) {
                    console.error('Erro ao enviar atualização de pagamento:', error);
                    updatePaymentModalMessageDiv.textContent = 'Ocorreu um erro ao tentar atualizar o pagamento.';
                    updatePaymentModalMessageDiv.className = 'py-2 px-3 rounded-lg text-center bg-red-800 text-white block mb-4';
                }
            });

            // Lidar com o envio do formulário de Novo Item
            newItemForm.addEventListener('submit', async (event) => {
                event.preventDefault();

                newItemModalMessageDiv.classList.add('hidden'); 

                const formData = new FormData(newItemForm);
                const itemData = {
                    id_pedido: formData.get('id_pedido'),
                    id_cliente: formData.get('id_cliente'), 
                    produto_sc: formData.get('produto_sc'), 
                    categoria: formData.get('categoria'),
                    produto: formData.get('produto'),
                    descricao: formData.get('descricao'),
                    espessura: formData.get('espessura'),
                    acabamento: formData.get('acabamento'),
                    acabamento2: formData.get('acabamento2'), 
                    altura: cleanAndParse(formData.get('altura')), 
                    largura: cleanAndParse(formData.get('largura')), 
                    quantidade: cleanAndParse(formData.get('quantidade')), 
                    valor_unitario: cleanAndParse(formData.get('valor_unitario')), 
                    valor_total: cleanAndParse(formData.get('valor_total')) 
                };

                console.log("DEBUG: Dados do item sendo enviados:", itemData); // Log para inspecionar os dados

                try {
                    const response = await fetch('backend/add_item.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(itemData)
                    });

                    const result = await response.json();
                    console.log("DEBUG: Resposta do backend add_item.php:", result); // Log da resposta

                    if (result.success) {
                        newItemModalMessageDiv.textContent = result.message;
                        newItemModalMessageDiv.className = 'py-2 px-3 rounded-lg text-center bg-green-800 text-white block mb-4';
                        newItemForm.reset();
                        setTimeout(() => {
                            newItemModal.classList.add('hidden');
                            loadOrderDetails(); // Recarrega os detalhes para mostrar o novo item
                        }, 1500); 
                    } else {
                        newItemModalMessageDiv.textContent = result.message || result.error || 'Erro ao salvar item.';
                        newItemModalMessageDiv.className = 'py-2 px-3 rounded-lg text-center bg-red-800 text-white block mb-4';
                    }
                } catch (error) {
                    console.error('Erro ao enviar item:', error);
                    newItemModalMessageDiv.textContent = 'Ocorreu um erro ao tentar salvar o item.';
                    newItemModalMessageDiv.className = 'py-2 px-3 rounded-lg text-center bg-red-800 text-white block mb-4';
                }
            });
        });
    </script>

</body>
</html>
