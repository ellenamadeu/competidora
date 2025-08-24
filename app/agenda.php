<?php
// agenda.php
// Página para exibir a agenda de agendamentos.
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Agenda</title>
    
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
                    <h1 class="text-2xl sm:text-3xl font-bold text-white">Agenda</h1>
                    <!-- O P a seguir terá seu texto atualizado dinamicamente -->
                    <p id="pageSubtitle" class="text-gray-400 mt-1">Visualize e gerencie seus agendamentos.</p>
                </div>

                <!-- Painel de Controlo da Agenda -->
                <div class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
                    
                    <!-- Navegação de Data -->
                    <div class="flex items-center justify-between bg-gray-700 p-2 rounded-lg md:col-span-4 lg:col-span-2">
                        <button id="prevDayBtn" class="px-3 py-2 rounded-md hover:bg-gray-600 transition-colors" title="Dia Anterior">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <input type="date" id="currentDateInput" class="bg-transparent text-center text-lg font-semibold focus:outline-none w-full mx-2">
                        <button id="nextDayBtn" class="px-3 py-2 rounded-md hover:bg-gray-600 transition-colors" title="Próximo Dia">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>

                    <!-- Botões de Ação -->
                    <div class="grid grid-cols-2 gap-4 md:col-span-2 lg:col-span-1">
                        <button id="todayBtn" class="w-full bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors">Hoje</button>
                        <button id="showAllAppointmentsBtn" class="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors">Todos</button>
                    </div>

                    <!-- Filtros -->
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 md:col-span-2 lg:col-span-2">
                        <select id="responsibleFilter" class="w-full bg-gray-700 border-transparent rounded-lg py-2 px-3 focus:ring-blue-500 focus:border-blue-500">
                            <option value="0">Responsável</option>
                        </select>
                        <select id="osFilter" class="w-full bg-gray-700 border-transparent rounded-lg py-2 px-3 focus:ring-blue-500 focus:border-blue-500">
                            <option value="0">OS</option>
                        </select>
                        <select id="statusFilter" class="w-full bg-gray-700 border-transparent rounded-lg py-2 px-3 focus:ring-blue-500 focus:border-blue-500">
                            <option value="all">Status</option>
                            <option value="completed">Concluídos</option>
                            <option value="pending">Pendentes</option>
                        </select>
                    </div>
                </div>


                <!-- Appointments List -->
                <div id="appointmentsList">
                    <div id="loading" class="text-center py-10">
                        <p class="text-gray-400">Carregando agendamentos...</p>
                    </div>
                    <div id="noAppointments" class="text-center py-10 hidden">
                        <p class="text-gray-400">Nenhum agendamento encontrado para os filtros selecionados.</p>
                    </div>
                    <div id="errorLoadingAppointments" class="text-center py-10 hidden">
                        <p class="text-red-400">Ocorreu um erro ao carregar os agendamentos. Verifique a conexão e o console.</p>
                    </div>
                    <!-- Agendamentos serão inseridos aqui -->
                </div>

            </div>
        </main>

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

                <div class="form-group">
                    <label for="updateAppointmentDate">Data:</label>
                    <input type="date" id="updateAppointmentDate" name="data_agendamento" required>
                </div>
                <div class="form-group">
                    <label for="updateAppointmentTime">Hora:</label>
                    <select id="updateAppointmentTime" name="hora_agendamento" required>
                        <option value="">Selecione a Hora</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="updateAppointmentOrder">OS:</label>
                    <select id="updateAppointmentOrder" name="ordem" required>
                        <option value="">Selecione a Ordem</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="updateAppointmentResponsible">Responsável:</label>
                    <select id="updateAppointmentResponsible" name="responsavel" required>
                        <option value="">Carregando Responsáveis...</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="updateAppointmentInstruction">Instruções:</label>
                    <textarea id="updateAppointmentInstruction" name="instrucao" rows="3"></textarea>
                </div>
                <div class="form-group flex items-center">
                    <label for="updateAppointmentStatus" class="mr-3">Concluído:</label>
                    <label class="styled-checkbox-container">
                        <input type="checkbox" id="updateAppointmentStatus" name="status_agendamento" value="1">
                        <span class="styled-checkbox-checkmark"></span>
                    </label>
                </div>

                <div class="modal-buttons">
                    <button type="button" id="deleteAppointmentBtn" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">
                        Excluir
                    </button>
                    <button type="button" id="cancelUpdateAppointmentBtn" class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg">
                        Cancelar
                    </button>
                    <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                        Atualizar
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
                    Confirmar
                </button>
            </div>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const pageSubtitle = document.getElementById('pageSubtitle'); // Pega a referência do subtítulo
            const currentDateInput = document.getElementById('currentDateInput');
            const prevDayBtn = document.getElementById('prevDayBtn');
            const nextDayBtn = document.getElementById('nextDayBtn');
            const todayBtn = document.getElementById('todayBtn');
            const showAllAppointmentsBtn = document.getElementById('showAllAppointmentsBtn');
            const appointmentsListDiv = document.getElementById('appointmentsList');
            const loadingMessage = document.getElementById('loading');
            const noAppointmentsMessage = document.getElementById('noAppointments');
            const errorLoadingAppointmentsMessage = document.getElementById('errorLoadingAppointments');

            // --- Elementos dos Filtros ---
            const responsibleFilter = document.getElementById('responsibleFilter');
            const osFilter = document.getElementById('osFilter');
            const statusFilter = document.getElementById('statusFilter');

            // --- Elementos do Modal de Edição ---
            const updateAppointmentModal = document.getElementById('updateAppointmentModal');
            const closeUpdateAppointmentModalBtn = document.getElementById('closeUpdateAppointmentModalBtn');
            const cancelUpdateAppointmentBtn = document.getElementById('cancelUpdateAppointmentBtn');
            const updateAppointmentForm = document.getElementById('updateAppointmentForm');
            const updateAppointmentModalAppointmentIdInput = document.getElementById('updateAppointmentModalAppointmentId');
            const updateAppointmentModalOrderIdInput = document.getElementById('updateAppointmentModalOrderId');
            const updateAppointmentModalMessageDiv = document.getElementById('updateAppointmentModalMessage');
            const updateAppointmentDateInput = document.getElementById('updateAppointmentDate');
            const updateAppointmentTimeSelect = document.getElementById('updateAppointmentTime');
            const updateAppointmentOrderSelect = document.getElementById('updateAppointmentOrder');
            const updateAppointmentResponsibleSelect = document.getElementById('updateAppointmentResponsible');
            const updateAppointmentInstructionTextarea = document.getElementById('updateAppointmentInstruction');
            const updateAppointmentStatusCheckbox = document.getElementById('updateAppointmentStatus');
            const deleteAppointmentBtn = document.getElementById('deleteAppointmentBtn');

            // --- Elementos do Modal de Confirmação ---
            const confirmationModal = document.getElementById('confirmationModal');
            const confirmationModalTitle = document.getElementById('confirmationModalTitle');
            const confirmationModalMessage = document.getElementById('confirmationModalMessage');
            const cancelConfirmationBtn = document.getElementById('cancelConfirmationBtn');
            const confirmActionBtn = document.getElementById('confirmActionBtn');
            let pendingAction = null;

            // --- MAPA DE ÍCONES E CORES PARA OS ---
            const osIconMap = {
                '1': { class: 'os-icon-medicao', svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>` }, // Medição
                '2': { class: 'os-icon-instalacao', svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.472-2.472a3.375 3.375 0 00-4.773-4.773L4.5 15.75l9.17 9.17 2.828-2.828-5.877-5.877z" /></svg>` }, // Instalação
                '3': { class: 'os-icon-revisao', svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>` }, // Revisão
                '4': { class: 'os-icon-reparo', svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>` }, // Reparo
                '5': { class: 'os-icon-cobranca', svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.75A.75.75 0 013 4.5h.75m0 0a.75.75 0 00.75-.75V3.75m0 0A.75.75 0 003.75 3h-.75m0 0a.75.75 0 00-.75.75v.75m0 0A.75.75 0 003 6h.75M7.5 12h9M7.5 15h9M12 4.5v.75A.75.75 0 0111.25 6h-1.5a.75.75 0 01-.75-.75V4.5m3 0A.75.75 0 0011.25 3h-1.5a.75.75 0 00-.75.75v.75m3 0a.75.75 0 00.75-.75V3.75m0 0A.75.75 0 0012.75 3h-1.5a.75.75 0 00-.75.75v.75" /></svg>` }, // Cobrança
                '6': { class: 'os-icon-entrega', svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5v-1.875a3.375 3.375 0 003.375-3.375h1.5a1.125 1.125 0 011.125 1.125v-1.5a3.375 3.375 0 00-3.375-3.375H3.375m15.75 9V14.25M3.375 14.25v-1.875a3.375 3.375 0 003.375-3.375h1.5a1.125 1.125 0 011.125 1.125v-1.5a3.375 3.375 0 00-3.375-3.375H3.375m15.75 9V14.25" /></svg>` }, // Entrega
                '7': { class: 'os-icon-encomenda', svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>` }, // Encomenda
                'default': { class: 'os-icon-default', svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>` }
            };

            const formatDateForDisplay = (dateString) => {
                if (!dateString) return 'N/A';
                const [year, month, day] = dateString.split('-');
                return `${day}/${month}`;
            };

            const getTodayDate = () => {
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const day = String(today.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };

            currentDateInput.value = getTodayDate();

            const loadAppointments = async () => {
                appointmentsListDiv.innerHTML = '';
                loadingMessage.style.display = 'block';
                noAppointmentsMessage.style.display = 'none';
                errorLoadingAppointmentsMessage.style.display = 'none';

                const date = currentDateInput.value;
                const showAll = !date;
                const responsibleId = responsibleFilter.value;
                const osId = osFilter.value;
                const status = statusFilter.value;

                let url = `backend/get_agendamentos_by_date.php?show_all=${showAll}`;
                if (!showAll) {
                    url += `&date=${encodeURIComponent(date)}`;
                }
                if (responsibleId !== '0') {
                    url += `&responsavel_id=${encodeURIComponent(responsibleId)}`;
                }
                if (osId !== '0') {
                    url += `&os_id=${encodeURIComponent(osId)}`;
                }
                if (status !== 'all') {
                    url += `&status=${encodeURIComponent(status)}`;
                }

                try {
                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error(`Erro ao carregar agendamentos`);
                    }
                    const agendamentos = await response.json();
                    
                    loadingMessage.style.display = 'none';

                    // ATUALIZA O SUBTÍTULO COM A CONTAGEM
                    if (agendamentos.length === 1) {
                        pageSubtitle.textContent = "1 agendamento encontrado.";
                    } else {
                        pageSubtitle.textContent = `${agendamentos.length} agendamentos encontrados.`;
                    }

                    if (agendamentos.length === 0) {
                        noAppointmentsMessage.style.display = 'block';
                    } else {
                        const groupedAppointments = agendamentos.reduce((acc, ag) => {
                            const responsible = ag.responsavel_nome || 'Não Atribuído';
                            if (!acc[responsible]) {
                                acc[responsible] = [];
                            }
                            acc[responsible].push(ag);
                            return acc;
                        }, {});

                        let htmlContent = '';
                        for (const responsible in groupedAppointments) {
                            htmlContent += `<h3 class="responsible-group-title">${responsible}</h3>`;
                            
                            groupedAppointments[responsible].forEach(ag => {
                                const osInfo = osIconMap[ag.id_ordem] || osIconMap.default;
                                const isCompleted = ag.status_agendamento == 1;
                                const completedClass = isCompleted ? 'appointment-completed' : '';

                                htmlContent += `
                                    <div class="appointment-card-item" data-pedido-id="${ag.id_pedido}">
                                        <div class="appointment-card-left-icon ${osInfo.class} ${completedClass}" data-agendamento-id="${ag.id_agendamento}">
                                            ${osInfo.svg}
                                        </div>
                                        <div class="appointment-card-content">
                                            <div class="appointment-card-line1">
                                                <strong>${ag.cliente_nome_pedido || 'N/A'}</strong> - ${ag.cliente_bairro || 'Sem bairro'}
                                            </div>
                                            <div class="appointment-card-line2">
                                                ${formatDateForDisplay(ag.data_agendamento)} - ${ag.hora_agendamento_nome || 'N/A'} - ${ag.responsavel_nome || 'N/A'}
                                            </div>
                                            <div class="appointment-card-line3">
                                                <strong>${ag.ordem_nome || 'OS'}:</strong> ${ag.instrucao || 'Sem instruções.'}
                                            </div>
                                        </div>
                                        <div class="appointment-card-right-status">
                                            <label class="styled-checkbox-container" data-agendamento-id="${ag.id_agendamento}">
                                                <input type="checkbox" class="appointment-checkbox" ${isCompleted ? 'checked' : ''}>
                                                <span class="styled-checkbox-checkmark"></span>
                                            </label>
                                        </div>
                                    </div>
                                `;
                            });
                        }
                        appointmentsListDiv.innerHTML = htmlContent;
                        addEventListenersToCards();
                    }

                } catch (error) {
                    console.error('Erro ao carregar agendamentos:', error);
                    loadingMessage.style.display = 'none';
                    errorLoadingAppointmentsMessage.style.display = 'block';
                }
            };

            const addEventListenersToCards = () => {
                document.querySelectorAll('.appointment-card-item').forEach(card => {
                    card.addEventListener('click', (event) => {
                        if (!event.target.closest('.appointment-card-left-icon') && !event.target.closest('.styled-checkbox-container')) {
                            const pedidoId = card.dataset.pedidoId;
                            if (pedidoId) {
                                window.location.href = `pedido_detalhes.php?id=${pedidoId}`;
                            }
                        }
                    });
                });

                document.querySelectorAll('.appointment-card-left-icon').forEach(icon => {
                    icon.addEventListener('click', (event) => {
                        event.stopPropagation();
                        const agendamentoId = icon.dataset.agendamentoId;
                        loadAppointmentForUpdate(agendamentoId);
                    });
                });

                document.querySelectorAll('.styled-checkbox-container').forEach(label => {
                    label.addEventListener('click', (event) => {
                        event.stopPropagation();
                        const checkbox = label.querySelector('.appointment-checkbox');
                        const newStatus = checkbox.checked ? 1 : 0;
                        const agendamentoId = label.dataset.agendamentoId;
                        updateAppointmentStatus(agendamentoId, newStatus, checkbox);
                    });
                });
            };
            
            const updateAppointmentStatus = async (id, status, checkboxElement) => {
                const iconDiv = checkboxElement.closest('.appointment-card-item').querySelector('.appointment-card-left-icon');
                iconDiv.classList.toggle('appointment-completed', status === 1);

                try {
                    const response = await fetch('backend/update_agendamento_status.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id_agendamento: id, status: status })
                    });
                    const result = await response.json();
                    if (!result.success) {
                        alert('Falha ao atualizar o status do agendamento.');
                        checkboxElement.checked = !checkboxElement.checked;
                        iconDiv.classList.toggle('appointment-completed', checkboxElement.checked);
                    }
                } catch (error) {
                    console.error('Erro ao atualizar status:', error);
                    alert('Erro de conexão ao tentar atualizar o status.');
                    checkboxElement.checked = !checkboxElement.checked;
                    iconDiv.classList.toggle('appointment-completed', checkboxElement.checked);
                }
            };

            // --- Funções do Modal de Edição ---
            const loadAppointmentTimeDropdown = async (targetSelect, selectedValue = null) => {
                try {
                    const response = await fetch('backend/get_agendamento_horas.php');
                    const horas = await response.json();
                    targetSelect.innerHTML = '<option value="">Selecione a Hora</option>';
                    horas.forEach(h => {
                        const option = document.createElement('option');
                        option.value = h.id_aghora;
                        option.textContent = h.hora;
                        if (selectedValue && selectedValue == h.id_aghora) option.selected = true;
                        targetSelect.appendChild(option);
                    });
                } catch (error) {
                    targetSelect.innerHTML = '<option value="">Erro ao carregar</option>';
                }
            };

            const loadAppointmentOrderDropdown = async (targetSelect, selectedValue = null) => {
                try {
                    const response = await fetch('backend/get_agendamento_ordens.php');
                    const ordens = await response.json();
                    targetSelect.innerHTML = '<option value="">Selecione a Ordem</option>';
                    ordens.forEach(o => {
                        const option = document.createElement('option');
                        option.value = o.id_ordem;
                        option.textContent = o.ordem;
                        if (selectedValue && selectedValue == o.id_ordem) option.selected = true;
                        targetSelect.appendChild(option);
                    });
                } catch (error) {
                    targetSelect.innerHTML = '<option value="">Erro ao carregar</option>';
                }
            };

            const loadFuncionariosDropdown = async (targetSelect, selectedValue = null) => {
                try {
                    const response = await fetch('backend/get_funcionarios.php');
                    const funcionarios = await response.json();
                    targetSelect.innerHTML = '<option value="">Selecione o Responsável</option>';
                    funcionarios.forEach(func => {
                        const option = document.createElement('option');
                        option.value = func.id_funcionario;
                        option.textContent = func.nome;
                        if (selectedValue && selectedValue == func.id_funcionario) option.selected = true;
                        targetSelect.appendChild(option);
                    });
                } catch (error) {
                    targetSelect.innerHTML = '<option value="">Erro ao carregar</option>';
                }
            };

            const loadAppointmentForUpdate = async (appointmentId) => {
                try {
                    const response = await fetch(`backend/get_agendamento_by_id.php?id=${encodeURIComponent(appointmentId)}`);
                    if (!response.ok) throw new Error('Erro ao carregar dados do agendamento');
                    const data = await response.json();

                    updateAppointmentModalAppointmentIdInput.value = data.id_agendamento;
                    updateAppointmentModalOrderIdInput.value = data.id_pedido;
                    updateAppointmentDateInput.value = data.data_agendamento;
                    updateAppointmentInstructionTextarea.value = data.instrucao || '';
                    updateAppointmentStatusCheckbox.checked = data.status_agendamento == 1;

                    await loadAppointmentTimeDropdown(updateAppointmentTimeSelect, data.hora_agendamento);
                    await loadAppointmentOrderDropdown(updateAppointmentOrderSelect, data.ordem);
                    await loadFuncionariosDropdown(updateAppointmentResponsibleSelect, data.responsavel);

                    updateAppointmentModalMessageDiv.classList.add('hidden');
                    updateAppointmentModal.classList.remove('hidden');
                } catch (error) {
                    console.error(error);
                    alert('Não foi possível carregar os dados do agendamento para edição.');
                }
            };

            updateAppointmentForm.addEventListener('submit', async (event) => {
                event.preventDefault();
                const formData = new FormData(updateAppointmentForm);
                const agendamentoData = Object.fromEntries(formData.entries());
                agendamentoData.status_agendamento = updateAppointmentStatusCheckbox.checked ? 1 : 0;

                try {
                    const response = await fetch('backend/update_agendamento.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(agendamentoData)
                    });
                    const result = await response.json();

                    if (result.success) {
                        updateAppointmentModal.classList.add('hidden');
                        loadAppointments();
                    } else {
                        updateAppointmentModalMessageDiv.textContent = result.message || 'Erro ao atualizar.';
                        updateAppointmentModalMessageDiv.classList.remove('hidden');
                    }
                } catch (error) {
                    updateAppointmentModalMessageDiv.textContent = 'Erro de conexão.';
                    updateAppointmentModalMessageDiv.classList.remove('hidden');
                }
            });
            
            const showConfirmationModal = (title, message, onConfirm) => {
                confirmationModalTitle.textContent = title;
                confirmationModalMessage.textContent = message;
                pendingAction = onConfirm;
                confirmationModal.classList.remove('hidden');
            };

            deleteAppointmentBtn.addEventListener('click', () => {
                showConfirmationModal(
                    'Excluir Agendamento',
                    'Tem certeza que deseja excluir este agendamento?',
                    async () => {
                        const id = updateAppointmentModalAppointmentIdInput.value;
                        try {
                            const response = await fetch(`backend/delete_agendamento.php?id=${id}`, { method: 'DELETE' });
                            const result = await response.json();
                            if (result.success) {
                                updateAppointmentModal.classList.add('hidden');
                                loadAppointments();
                            } else {
                                alert(result.message || 'Erro ao excluir.');
                            }
                        } catch (error) {
                            alert('Erro de conexão.');
                        }
                    }
                );
            });

            // --- Funções para popular os filtros ---
            const populateResponsibleFilter = async () => {
                try {
                    const response = await fetch('backend/get_funcionarios.php');
                    const funcionarios = await response.json();
                    responsibleFilter.innerHTML = '<option value="0">Todos os Responsáveis</option>';
                    funcionarios.forEach(func => {
                        const option = document.createElement('option');
                        option.value = func.id_funcionario;
                        option.textContent = func.nome;
                        responsibleFilter.appendChild(option);
                    });
                } catch (error) {
                    responsibleFilter.innerHTML = '<option value="0">Erro ao carregar</option>';
                }
            };

            const populateOsFilter = async () => {
                try {
                    const response = await fetch('backend/get_agendamento_ordens.php');
                    const ordens = await response.json();
                    osFilter.innerHTML = '<option value="0">Todas as OS</option>';
                    ordens.forEach(o => {
                        const option = document.createElement('option');
                        option.value = o.id_ordem;
                        option.textContent = o.ordem;
                        osFilter.appendChild(option);
                    });
                } catch (error) {
                    osFilter.innerHTML = '<option value="0">Erro ao carregar</option>';
                }
            };


            // Event listeners para fechar modais
            closeUpdateAppointmentModalBtn.addEventListener('click', () => updateAppointmentModal.classList.add('hidden'));
            cancelUpdateAppointmentBtn.addEventListener('click', () => updateAppointmentModal.classList.add('hidden'));
            cancelConfirmationBtn.addEventListener('click', () => confirmationModal.classList.add('hidden'));
            confirmActionBtn.addEventListener('click', () => {
                if (pendingAction) pendingAction();
                confirmationModal.classList.add('hidden');
            });

            // --- Início da Execução ---
            currentDateInput.addEventListener('change', loadAppointments);
            todayBtn.addEventListener('click', () => {
                currentDateInput.value = getTodayDate();
                loadAppointments();
            });
            prevDayBtn.addEventListener('click', () => {
                const currentDate = new Date(currentDateInput.value + 'T00:00:00'); 
                currentDate.setDate(currentDate.getDate() - 1);
                currentDateInput.value = currentDate.toISOString().split('T')[0];
                loadAppointments();
            });
            nextDayBtn.addEventListener('click', () => {
                const currentDate = new Date(currentDateInput.value + 'T00:00:00'); 
                currentDate.setDate(currentDate.getDate() + 1);
                currentDateInput.value = currentDate.toISOString().split('T')[0];
                loadAppointments();
            });
            showAllAppointmentsBtn.addEventListener('click', () => {
                currentDateInput.value = '';
                loadAppointments();
            });

            // Event listeners para os novos filtros
            responsibleFilter.addEventListener('change', loadAppointments);
            osFilter.addEventListener('change', loadAppointments);
            statusFilter.addEventListener('change', loadAppointments);

            // Popula os filtros e carrega os agendamentos iniciais
            populateResponsibleFilter();
            populateOsFilter();
            loadAppointments();
        });
    </script>

</body>
</html>
