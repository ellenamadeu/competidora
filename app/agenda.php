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
                    <p class="text-gray-400 mt-1">Visualize e gerencie seus agendamentos.</p>
                </div>

                <!-- Calendar Navigation -->
                <div class="calendar-nav">
                    <button id="prevDayBtn"><i class="fas fa-chevron-left"></i></button>
                    <input type="date" id="currentDateInput">
                    <button id="nextDayBtn"><i class="fas fa-chevron-right"></i></button>
                    <button id="showAllAppointmentsBtn" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-lg text-sm transition duration-300 ease-in-out">
                        Todos
                    </button>
                </div>

                <!-- Appointments List -->
                <div id="appointmentsList">
                    <div id="loading" class="text-center py-10">
                        <p class="text-gray-400">Carregando agendamentos...</p>
                    </div>
                    <div id="noAppointments" class="text-center py-10 hidden">
                        <p class="text-gray-400">Nenhum agendamento para esta data.</p>
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
            const currentDateInput = document.getElementById('currentDateInput');
            const prevDayBtn = document.getElementById('prevDayBtn');
            const nextDayBtn = document.getElementById('nextDayBtn');
            const showAllAppointmentsBtn = document.getElementById('showAllAppointmentsBtn');
            const appointmentsListDiv = document.getElementById('appointmentsList');
            const loadingMessage = document.getElementById('loading');
            const noAppointmentsMessage = document.getElementById('noAppointments');
            const errorLoadingAppointmentsMessage = document.getElementById('errorLoadingAppointments');

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

            const loadAppointments = async (date = null, showAll = false) => {
                appointmentsListDiv.innerHTML = '';
                loadingMessage.style.display = 'block';
                noAppointmentsMessage.style.display = 'none';
                errorLoadingAppointmentsMessage.style.display = 'none';

                let url = `backend/get_agendamentos_by_date.php`;
                if (showAll) {
                    url += `?show_all=true`;
                    currentDateInput.value = ''; 
                    currentDateInput.disabled = true;
                } else {
                    url += `?date=${encodeURIComponent(date)}`;
                    currentDateInput.disabled = false;
                }

                try {
                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error(`Erro ao carregar agendamentos`);
                    }
                    const agendamentos = await response.json();
                    
                    loadingMessage.style.display = 'none';

                    if (agendamentos.length === 0) {
                        noAppointmentsMessage.style.display = 'block';
                    } else {
                        agendamentos.forEach(ag => {
                            const osFirstLetter = (ag.ordem_nome || 'OS').charAt(0).toUpperCase();
                            const isCompleted = ag.status_agendamento == 1;
                            const completedClass = isCompleted ? 'appointment-completed' : '';

                            const appointmentElement = `
                                <div class="appointment-card-item" data-pedido-id="${ag.id_pedido}">
                                    <div class="appointment-card-left-icon ${completedClass}" data-agendamento-id="${ag.id_agendamento}">
                                        ${osFirstLetter}
                                        <span>${ag.ordem_nome || 'OS'}</span>
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
                            appointmentsListDiv.insertAdjacentHTML('beforeend', appointmentElement);
                        });
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
                        // Apenas navega se o clique não foi no ícone de OS ou no checkbox
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
                        loadAppointments(currentDateInput.value, !currentDateInput.value);
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
                                loadAppointments(currentDateInput.value, !currentDateInput.value);
                            } else {
                                alert(result.message || 'Erro ao excluir.');
                            }
                        } catch (error) {
                            alert('Erro de conexão.');
                        }
                    }
                );
            });

            // Event listeners para fechar modais
            closeUpdateAppointmentModalBtn.addEventListener('click', () => updateAppointmentModal.classList.add('hidden'));
            cancelUpdateAppointmentBtn.addEventListener('click', () => updateAppointmentModal.classList.add('hidden'));
            cancelConfirmationBtn.addEventListener('click', () => confirmationModal.classList.add('hidden'));
            confirmActionBtn.addEventListener('click', () => {
                if (pendingAction) pendingAction();
                confirmationModal.classList.add('hidden');
            });

            // --- Início da Execução ---
            currentDateInput.addEventListener('change', (event) => loadAppointments(event.target.value, false));
            prevDayBtn.addEventListener('click', () => {
                const currentDate = new Date(currentDateInput.value + 'T00:00:00'); 
                currentDate.setDate(currentDate.getDate() - 1);
                currentDateInput.value = currentDate.toISOString().split('T')[0];
                loadAppointments(currentDateInput.value, false);
            });
            nextDayBtn.addEventListener('click', () => {
                const currentDate = new Date(currentDateInput.value + 'T00:00:00'); 
                currentDate.setDate(currentDate.getDate() + 1);
                currentDateInput.value = currentDate.toISOString().split('T')[0];
                loadAppointments(currentDateInput.value, false);
            });
            showAllAppointmentsBtn.addEventListener('click', () => loadAppointments(null, true));

            loadAppointments(currentDateInput.value, false);
        });
    </script>

</body>
</html>
