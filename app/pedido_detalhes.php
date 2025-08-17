<?php
// pedido_detalhes.php
// Página para exibir detalhes de um pedido específico.
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8"
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
            position: relative; /* Garante que o pseudo-elemento ::after seja posicionado em relação a este span */
            height: 24px;
            width: 24px;
            background-color: #4B5563; /* gray-600 */
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.2s;
            flex-shrink: 0;
        }

        /* Adiciona uma cor de fundo quando o checkbox está marcado */
        .styled-checkbox-container input[type="checkbox"]:checked ~ .styled-checkbox-checkmark {
            background-color: #3B82F6; /* blue-500 */
        }

        .styled-checkbox-checkmark:after {
            content: "";
            position: absolute;
            display: none;
        }

        .styled-checkbox-container input[type="checkbox"]:checked ~ .styled-checkbox-checkmark:after {
            display: block;
            /* Ajustes para centralizar melhor o 'check' */
            left: 9px; 
            top: 5px; 
            width: 7px;
            height: 12px;
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
        /* Estilos para o modal de confirmação */
        #confirmationModal .modal-content {
            max-width: 400px;
        }
        #confirmationModal .modal-buttons {
            justify-content: center;
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
                    <a href="pedidos.php" class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
                        Voltar
                    </a>
                    <!-- Botão de Acompanhamento -->
                    <a id="acompanhamentoBtn" href="#" target="_blank" class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
                        Acompanhamento
                    </a>
                    <!-- Botão de Impressão -->
                    <a id="printBtn" href="#" target="_blank" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
                        Imprimir
                    </a>
                </div>
            </div>
        </main>

    </div>

    <!-- Modal para Editar Status e Título -->
    <div id="updateStatusTituloModal" class="modal hidden">
        <div class="modal-content">
            <span class="modal-close-btn" id="closeUpdateStatusTituloModalBtn">×</span>
            <h3 class="text-xl font-bold text-white mb-4">Alterar Pedido</h3>
            <div id="updateStatusTituloModalMessage" class="py-2 px-3 rounded-lg text-center hidden mb-4"></div>

            <form id="updateStatusTituloForm">
                <input type="hidden" id="updateStatusTituloModalOrderId" name="id_pedido">

                <div class="modal-form-group">
                    <label for="updateTitulo">Título:</label>
                    <input type="text" id="updateTitulo" name="titulo">
                </div>
                <div class="modal-form-group">
                    <label for="updateStatus">Status:</label>
                    <select id="updateStatus" name="status" required>
                        <option value="">Carregando...</option>
                    </select>
                </div>

                <div class="modal-buttons">
                    <button type="button" id="cancelUpdateStatusTituloBtn" class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
                        Cancelar
                    </button>
                    <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
                        Salvar Alterações
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Modal para Novo Agendamento -->
    <div id="newAppointmentModal" class="modal hidden">
        <div class="modal-content">
            <span class="modal-close-btn" id="closeNewAppointmentModalBtn">×</span>
            <h3 class="text-xl font-bold text-white mb-4">Novo Agendamento</h3>
            <div id="newAppointmentModalMessage" class="py-2 px-3 rounded-lg text-center hidden mb-4"></div>

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
                    </select>
                </div>
                <div class="modal-form-group">
                    <label for="appointmentOrder">OS:</label>
                    <select id="appointmentOrder" name="ordem" required>
                        <option value="">Selecione a Ordem</option>
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
    
    <!-- Modal para Atualizar Agendamento -->
    <div id="updateAppointmentModal" class="modal hidden">
        <div class="modal-content">
            <span class="modal-close-btn" id="closeUpdateAppointmentModalBtn">×</span>
            <h3 class="text-xl font-bold text-white mb-4">Atualizar Agendamento</h3>
            <div id="updateAppointmentModalMessage" class="py-2 px-3 rounded-lg text-center hidden mb-4"></div>

            <form id="updateAppointmentForm">
                <input type="hidden" id="updateAppointmentModalAppointmentId" name="id_agendamento">
                <input type="hidden" id="updateAppointmentModalOrderId" name="id_pedido">

                <div class="modal-form-group">
                    <label for="updateAppointmentDate">Data:</label>
                    <input type="date" id="updateAppointmentDate" name="data_agendamento" required>
                </div>
                <div class="modal-form-group">
                    <label for="updateAppointmentTime">Hora:</label>
                    <select id="updateAppointmentTime" name="hora_agendamento" required>
                        <option value="">Selecione a Hora</option>
                    </select>
                </div>
                <div class="modal-form-group">
                    <label for="updateAppointmentOrder">OS:</label>
                    <select id="updateAppointmentOrder" name="ordem" required>
                        <option value="">Selecione a Ordem</option>
                    </select>
                </div>
                <div class="modal-form-group">
                    <label for="updateAppointmentResponsible">Responsável:</label>
                    <select id="updateAppointmentResponsible" name="responsavel" required>
                        <option value="">Carregando Responsáveis...</option>
                    </select>

                </div>
                <div class="modal-form-group">
                    <label for="updateAppointmentInstruction">Instruções:</label>
                    <textarea id="updateAppointmentInstruction" name="instrucao" rows="3"></textarea>
                </div>
                <div class="modal-form-group flex items-center">
                    <label for="updateAppointmentStatus" class="mr-3">Concluído:</label>
                    <label class="styled-checkbox-container">
                        <input type="checkbox" id="updateAppointmentStatus" name="status_agendamento" value="1">
                        <span class="styled-checkbox-checkmark"></span>
                    </label>
                </div>

                <div class="modal-buttons">
                    <button type="button" id="deleteAppointmentBtn" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
                        Excluir Agendamento
                    </button>
                    <button type="button" id="cancelUpdateAppointmentBtn" class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
                        Cancelar
                    </button>
                    <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
                        Atualizar Agendamento
                    </button>
                </div>
            </form>
        </div>
    </div>
    
    <!-- Modal para Novo Item -->
    <div id="newItemModal" class="modal hidden">
        <div class="modal-content">
            <span class="modal-close-btn" id="closeNewItemModalBtn">×</span>
            <h3 class="text-xl font-bold text-white mb-4">Novo Item do Pedido</h3>
            <div id="newItemModalMessage" class="py-2 px-3 rounded-lg text-center hidden mb-4"></div>

            <form id="newItemForm">
                <input type="hidden" id="newItemModalOrderId" name="id_pedido">
                <input type="hidden" id="newItemModalClientId" name="id_cliente">

                <div class="flex flex-wrap gap-4 mb-4">
                    <div class="flex-1 min-w-[calc(33%-1rem)]">
                        <label for="itemAltura" class="block text-sm font-medium text-gray-400">Altura:</label>
                        <input type="text" id="itemAltura" name="altura" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
                    </div>
                    <div class="flex-1 min-w-[calc(33%-1rem)]">
                        <label for="itemLargura" class="block text-sm font-medium text-gray-400">Largura:</label>
                        <input type="text" id="itemLargura" name="largura" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
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
                
                <div class="flex flex-wrap gap-4 mb-4">
                    <div class="flex-1 min-w-[calc(50%-0.5rem)]">
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
            <span class="modal-close-btn" id="closeUpdateItemModalBtn">×</span>
            <h3 class="text-xl font-bold text-white mb-4">Atualizar Item do Pedido</h3>
            <div id="updateItemModalMessage" class="py-2 px-3 rounded-lg text-center hidden mb-4"></div>

            <form id="updateItemForm">
                <input type="hidden" id="updateItemModalItemId" name="id_item">
                <input type="hidden" id="updateItemModalOrderId" name="id_pedido">
                <input type="hidden" id="updateItemModalClientId" name="id_cliente">

                <div class="flex flex-wrap gap-4 mb-4">
                    <div class="flex-1 min-w-[calc(33%-1rem)]">
                        <label for="updateItemAltura" class="block text-sm font-medium text-gray-400">Altura:</label>
                        <input type="text" id="updateItemAltura" name="altura" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
                    </div>
                    <div class="flex-1 min-w-[calc(33%-1rem)]">
                        <label for="updateItemLargura" class="block text-sm font-medium text-gray-400">Largura:</label>
                        <input type="text" id="updateItemLargura" name="largura" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
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
            <span class="modal-close-btn" id="closeNewPaymentModalBtn">×</span>
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

    <!-- Modal para Atualizar Pagamento -->
    <div id="updatePaymentModal" class="modal hidden">
        <div class="modal-content">
            <span class="modal-close-btn" id="closeUpdatePaymentModalBtn">×</span>
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

    <!-- Modal de Confirmação customizado -->
    <div id="confirmationModal" class="modal hidden">
        <div class="modal-content">
            <h3 id="confirmationModalTitle" class="text-xl font-bold text-white mb-4">Confirmação</h3>
            <p id="confirmationModalMessage" class="text-gray-300 mb-6">Você tem certeza?</p>
            <div class="modal-buttons">
                <button type="button" id="cancelConfirmationBtn" class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
                    Cancelar
                </button>
                <button type="button" id="confirmActionBtn" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
                    Confirmar
                </button>
            </div>
        </div>
    </div>

    <!-- NOVO: Modal para Editar Desconto -->
    <div id="updateDiscountModal" class="modal hidden">
        <div class="modal-content">
            <span class="modal-close-btn" id="closeUpdateDiscountModalBtn">×</span>
            <h3 class="text-xl font-bold text-white mb-4">Editar Desconto</h3>
            <div id="updateDiscountModalMessage" class="py-2 px-3 rounded-lg text-center hidden mb-4"></div>

            <form id="updateDiscountForm">
                <input type="hidden" id="updateDiscountModalOrderId" name="id_pedido">
                <div class="modal-form-group">
                    <label for="updateDiscountValue">Valor do Desconto:</label>
                    <input type="text" id="updateDiscountValue" name="desconto" required>
                </div>
                <div class="modal-buttons">
                    <button type="button" id="cancelUpdateDiscountBtn" class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg">
                        Cancelar
                    </button>
                    <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                        Salvar Desconto
                    </button>
                </div>
            </form>
        </div>
    </div>

    <script src="js/pedido_detalhes.js"></script>
</body>
</html>
