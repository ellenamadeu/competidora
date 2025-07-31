<?php
// agenda.php
// Página para exibir a agenda de agendamentos.
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Agenda</title> <!-- Título alterado para "Agenda" -->
    
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
        /* Estilos específicos para a página de agenda */
        .calendar-nav {
            display: flex;
            flex-wrap: wrap; /* Permite que os itens quebrem para a próxima linha em telas pequenas */
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1.5rem;
            background-color: #1F2937; /* gray-800 */
            padding: 1rem;
            border-radius: 0.5rem;
            gap: 0.5rem; /* Espaçamento entre os botões/inputs */
        }
        .calendar-nav button {
            background-color: #3B82F6; /* blue-500 */
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 0.375rem; /* rounded-md */
            transition: background-color 0.2s;
            flex-shrink: 0; /* Impede que os botões encolham */
        }
        .calendar-nav button:hover {
            background-color: #2563EB; /* blue-600 */
        }
        .calendar-nav input[type="date"] {
            background-color: #374151; /* gray-700 */
            border: 1px solid #4B5563; /* gray-600 */
            color: #E5E7EB; /* text-gray-200 */
            padding: 0.5rem;
            border-radius: 0.375rem;
            text-align: center;
            flex-grow: 1; /* Permite que o input de data ocupe espaço */
            min-width: 150px; /* Largura mínima para o input de data */
        }
        /* Estilos para o novo layout de cartão de agendamento */
        .appointment-card-item {
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
        .appointment-card-item:hover {
            background-color: #374151; /* gray-700 */
        }
        .appointment-card-left-icon {
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
        .appointment-card-left-icon span {
            font-size: 0.75rem; /* text-xs */
            font-weight: normal;
            text-align: center;
            line-height: 1; /* Garante que o texto não ocupe muito espaço vertical */
        }
        .appointment-card-content {
            flex-grow: 1;
            min-width: 0; /* Permite que o conteúdo encolha */
        }
        .appointment-card-line1 {
            font-weight: bold; /* Negrito para a primeira linha */
            color: #E5E7EB;
            white-space: nowrap; /* Impede quebras de linha */
            overflow: hidden;
            text-overflow: ellipsis; /* Adiciona "..." se o texto for muito longo */
        }
        .appointment-card-line2 {
            font-size: 0.875rem; /* text-sm */
            color: #9CA3AF;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .appointment-card-line3 {
            font-size: 0.875rem; /* text-sm */
            color: #9CA3AF;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .appointment-card-right-status {
            flex-shrink: 0;
            margin-left: 1rem;
            display: flex;
            align-items: center;
        }
        /* Estilos para o checkbox estilizado (reutilizado de pedido_detalhes.php) */
        .styled-checkbox-container {
            display: inline-flex;
            align-items: center;
            cursor: default;
            user-select: none;
            margin-left: 0; /* Remover margin-left extra */
        }
        .styled-checkbox-container input[type="checkbox"] {
            position: absolute;
            opacity: 0;
            cursor: default;
            height: 0;
            width: 0;
        }
        .styled-checkbox-checkmark {
            height: 32px; /* Aumentado para ser "grande" */
            width: 32px; /* Aumentado para ser "grande" */
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
            left: 11px; /* Ajustado para novo tamanho */
            top: 7px; /* Ajustado para novo tamanho */
            width: 10px; /* Ajustado para novo tamanho */
            height: 18px; /* Ajustado para novo tamanho */
            border: solid white;
            border-width: 0 3px 3px 0;
            transform: rotate(45deg);
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
                    <h1 class="text-2xl sm:text-3xl font-bold text-white">Agendaa</h1>
                    <p class="text-gray-400 mt-1">Visualize e gerencie seus agendamentos.</p>
                </div>

                <!-- Calendar Navigation -->
                <div class="calendar-nav">
                    <button id="prevDayBtn"><i class="fas fa-chevron-left"></i> Anterior</button>
                    <input type="date" id="currentDateInput">
                    <button id="nextDayBtn">Próximo <i class="fas fa-chevron-right"></i></button>
                    <button id="showAllAppointmentsBtn" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-lg text-sm transition duration-300 ease-in-out">
                        Exibir Todos
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
            const showAllAppointmentsBtn = document.getElementById('showAllAppointmentsBtn'); // Novo botão
            const appointmentsListDiv = document.getElementById('appointmentsList');
            const loadingMessage = document.getElementById('loading');
            const noAppointmentsMessage = document.getElementById('noAppointments');
            const errorLoadingAppointmentsMessage = document.getElementById('errorLoadingAppointments');

            // Função para formatar datas (YYYY-MM-DD para o input, DD/MM/YYYY para exibição)
            const formatDateForDisplay = (dateString) => {
                if (!dateString) return 'N/A';
                const [year, month, day] = dateString.split('-');
                return `${day}/${month}/${year}`;
            };

            // Função para obter a data atual no formato YYYY-MM-DD
            const getTodayDate = () => {
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const day = String(today.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };

            // Define a data inicial como hoje
            currentDateInput.value = getTodayDate();

            // Função para carregar agendamentos para a data selecionada ou todos
            const loadAppointments = async (date = null, showAll = false) => {
                appointmentsListDiv.innerHTML = ''; // Limpa a lista
                loadingMessage.style.display = 'block';
                noAppointmentsMessage.style.display = 'none';
                errorLoadingAppointmentsMessage.style.display = 'none';

                let url = `backend/get_agendamentos_by_date.php`;
                if (showAll) {
                    url += `?show_all=true`;
                    // Desabilita/limpa o input de data quando "Exibir Todos" está ativo
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
                        console.error('Erro HTTP ao buscar agendamentos. Status:', response.status, 'Texto:', errorText);
                        throw new Error(`Erro ao carregar agendamentos: ${response.status}. Detalhes: ${errorText.substring(0, 200)}...`);
                    }
                    const agendamentos = await response.json();
                    console.log('Agendamentos recebidos:', agendamentos);

                    loadingMessage.style.display = 'none';

                    if (agendamentos.length === 0) {
                        noAppointmentsMessage.style.display = 'block';
                    } else {
                        agendamentos.forEach(ag => {
                            const osFirstLetter = (ag.ordem_nome || 'OS').charAt(0).toUpperCase();
                            
                            const appointmentElement = `
                                <div class="appointment-card-item" onclick="window.location.href='pedido_detalhes.php?id=${ag.id_pedido}'">
                                    <div class="appointment-card-left-icon">
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
                                        <label class="styled-checkbox-container">
                                            <input type="checkbox" ${ag.status_agendamento == 1 ? 'checked' : ''} disabled>
                                            <span class="styled-checkbox-checkmark"></span>
                                        </label>
                                    </div>
                                </div>
                            `;
                            appointmentsListDiv.insertAdjacentHTML('beforeend', appointmentElement);
                        });
                    }

                } catch (error) {
                    console.error('Erro ao carregar agendamentos:', error);
                    loadingMessage.style.display = 'none';
                    errorLoadingAppointmentsMessage.style.display = 'block';
                }
            };

            // Event Listeners para navegação de data
            currentDateInput.addEventListener('change', (event) => {
                loadAppointments(event.target.value, false); // Quando a data é alterada, não é "show all"
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

            // Event Listener para o botão "Exibir Todos"
            showAllAppointmentsBtn.addEventListener('click', () => {
                loadAppointments(null, true); // Chama com showAll = true
            });

            // Carrega agendamentos para a data atual ao carregar a página (padrão)
            loadAppointments(currentDateInput.value, false);
        });
    </script>

</body>
</html>
