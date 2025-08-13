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

            const formatDateForDisplay = (dateString) => {
                if (!dateString) return 'N/A';
                const [year, month, day] = dateString.split('-');
                return `${day}/${month}/${year}`;
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
                        const errorText = await response.text();
                        throw new Error(`Erro ao carregar agendamentos: ${response.status}. Detalhes: ${errorText.substring(0, 200)}...`);
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
                                    <div class="appointment-card-left-icon ${completedClass}">
                                        ${osFirstLetter}
                                        <span>${ag.ordem_nome || 'OS'}</span>
                                    </div>
                                    <div class="appointment-card-content">
                                        <div class="appointment-card-line1">
                                            #${ag.id_pedido || 'N/A'} - <strong>${ag.cliente_nome_pedido || 'N/A'}</strong> - ${ag.pedido_titulo || 'Sem Título'}
                                        </div>
                                        <div class="appointment-card-line2">
                                            ${formatDateForDisplay(ag.data_agendamento)} - ${ag.hora_agendamento_nome || 'N/A'} - ${ag.responsavel_nome || 'N/A'}
                                        </div>
                                        <div class="appointment-card-line3">
                                            ${ag.instrucao || 'Sem instruções.'}
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
                        addEventListenersToCards(); // Adiciona os event listeners após renderizar
                    }

                } catch (error) {
                    console.error('Erro ao carregar agendamentos:', error);
                    loadingMessage.style.display = 'none';
                    errorLoadingAppointmentsMessage.style.display = 'block';
                }
            };

            // Função para adicionar os event listeners aos cards e checkboxes
            const addEventListenersToCards = () => {
                document.querySelectorAll('.appointment-card-item').forEach(card => {
                    card.addEventListener('click', () => {
                        const pedidoId = card.dataset.pedidoId;
                        if (pedidoId) {
                            window.location.href = `pedido_detalhes.php?id=${pedidoId}`;
                        }
                    });
                });

                document.querySelectorAll('.styled-checkbox-container').forEach(label => {
                    label.addEventListener('click', (event) => {
                        event.stopPropagation(); // Impede que o clique no checkbox navegue para a página do pedido

                        const checkbox = label.querySelector('.appointment-checkbox');
                        // O clique na label já inverte o estado do checkbox, então lemos o estado atual
                        const newStatus = checkbox.checked ? 1 : 0;
                        const agendamentoId = label.dataset.agendamentoId;
                        
                        updateAppointmentStatus(agendamentoId, newStatus, checkbox);
                    });
                });
            };

            // Função para atualizar o status via API
            const updateAppointmentStatus = async (id, status, checkboxElement) => {
                const iconDiv = checkboxElement.closest('.appointment-card-item').querySelector('.appointment-card-left-icon');
                
                // Atualização otimista da UI
                iconDiv.classList.toggle('appointment-completed', status === 1);

                try {
                    const response = await fetch('backend/update_agendamento_status.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id_agendamento: id, status: status })
                    });

                    const result = await response.json();
                    if (!result.success) {
                        // Reverte a UI em caso de falha
                        alert('Falha ao atualizar o status do agendamento.');
                        checkboxElement.checked = !checkboxElement.checked;
                        iconDiv.classList.toggle('appointment-completed', checkboxElement.checked);
                    }
                } catch (error) {
                    console.error('Erro ao atualizar status:', error);
                    alert('Erro de conexão ao tentar atualizar o status.');
                    // Reverte a UI em caso de falha
                    checkboxElement.checked = !checkboxElement.checked;
                    iconDiv.classList.toggle('appointment-completed', checkboxElement.checked);
                }
            };

            currentDateInput.addEventListener('change', (event) => {
                loadAppointments(event.target.value, false);
            });

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

            showAllAppointmentsBtn.addEventListener('click', () => {
                loadAppointments(null, true);
            });

            loadAppointments(currentDateInput.value, false);
        });
    </script>

</body>
</html>
