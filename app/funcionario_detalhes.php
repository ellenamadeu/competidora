<?php
// detalhes_funcionario.php
// Página para exibir todas as informações do funcionário.
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Detalhes do Funcionário - Competidora Adm</title>
    
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
                    <h1 id="funcionarioNameHeader" class="text-2xl sm:text-3xl font-bold text-white">Carregando Detalhes...</h1>
                    <p class="text-gray-400 mt-1">Informações completas do funcionário.</p>
                </div>

                <!-- Details -->
                <div id="detailsContainer" class="mt-6">
                    <div id="loading" class="text-center py-10">
                        <p class="text-gray-400">Carregando dados do funcionário...</p>
                    </div>
                    <div id="errorMessage" class="text-center py-10 hidden">
                        <p class="text-red-400">Não foi possível carregar os detalhes. Verifique o ID ou a conexão.</p>
                    </div>
                    
                    <!-- Os detalhes serão populados aqui pelo JavaScript -->
                </div>

                <div id="actionsContainer" class="hidden mt-8 flex justify-end gap-4">
                    <a id="editButton" href="#" class="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg transition">
                        Editar
                    </a>
                    <button id="deactivateButton" type="button" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition">
                        Desativar
                    </button>
                    <a href="funcionarios.php" class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition">
                        Voltar para a Lista
                    </a>
                </div>
            </div>
        </main>

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
        document.addEventListener('DOMContentLoaded', async () => {
            const headerTitle = document.getElementById('funcionarioNameHeader');
            const detailsContainer = document.getElementById('detailsContainer');
            const loadingDiv = document.getElementById('loading');
            const errorDiv = document.getElementById('errorMessage');
            const actionsContainer = document.getElementById('actionsContainer');
            const editButton = document.getElementById('editButton');
            const deactivateButton = document.getElementById('deactivateButton');

            // Modal de Confirmação
            const confirmationModal = document.getElementById('confirmationModal');
            const confirmationModalTitle = document.getElementById('confirmationModalTitle');
            const confirmationModalMessage = document.getElementById('confirmationModalMessage');
            const cancelConfirmationBtn = document.getElementById('cancelConfirmationBtn');
            const confirmActionBtn = document.getElementById('confirmActionBtn');
            let pendingAction = null;

            const getFuncionarioIdFromUrl = () => {
                const params = new URLSearchParams(window.location.search);
                return params.get('id');
            };

            const funcionarioId = getFuncionarioIdFromUrl();

            if (!funcionarioId) {
                headerTitle.textContent = 'ID do Funcionário Ausente';
                loadingDiv.style.display = 'none';
                errorDiv.classList.remove('hidden');
                return;
            }

            const loadDetails = async () => {
                try {
                    const response = await fetch(`backend/funcionarios/get_funcionario_by_id.php?id=${funcionarioId}`);
                    if (!response.ok) throw new Error('Falha ao buscar dados.');
                    
                    const data = await response.json();
                    const funcionario = data.funcionario;
                    const agendamentos = data.agendamentos;

                    if (!funcionario) {
                        headerTitle.textContent = 'Funcionário Não Encontrado';
                        loadingDiv.style.display = 'none';
                        errorDiv.classList.remove('hidden');
                        errorDiv.textContent = 'Nenhum funcionário encontrado com o ID fornecido.';
                        return;
                    }

                    loadingDiv.style.display = 'none';
                    headerTitle.textContent = `${funcionario.nome} ${funcionario.sobrenome || ''}`;
                    
                    const addDetailItem = (label, value, iconClass, formatter = null) => {
                        if (value !== null && value !== '' && value !== '0.00' && value !== '0000-00-00' && value !== 0) {
                            const formattedValue = formatter ? formatter(value) : value;
                            return `
                                <div class="detail-item">
                                    <span class="detail-label"><i class="fas ${iconClass} w-5 text-center"></i><span class="ml-4">${label}</span></span>
                                    <span class="detail-value">${formattedValue}</span>
                                </div>`;
                        }
                        return '';
                    };

                    const formatDate = (dateStr) => {
                        if (!dateStr) return '';
                        const [year, month, day] = dateStr.split('-');
                        return `${day}/${month}/${year}`;
                    };

                    const formatCurrency = (value) => {
                        return parseFloat(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                    };
                    
                    let dadosPessoaisHtml = '';
                    dadosPessoaisHtml += addDetailItem('Nome Completo', `${funcionario.nome} ${funcionario.sobrenome || ''}`, 'fa-user-tie');
                    dadosPessoaisHtml += addDetailItem('Data de Nascimento', funcionario.data_nascimento, 'fa-calendar-day', formatDate);
                    dadosPessoaisHtml += addDetailItem('Telefone 1', funcionario.telefone, 'fa-phone');
                    dadosPessoaisHtml += addDetailItem('Telefone 2', funcionario.telefone2, 'fa-phone');
                    dadosPessoaisHtml += addDetailItem('Telefone 3', funcionario.telefone3, 'fa-phone');
                    dadosPessoaisHtml += addDetailItem('Endereço', `${funcionario.endereco || ''} - ${funcionario.bairro || ''}`, 'fa-map-marker-alt');

                    let documentosHtml = '';
                    documentosHtml += addDetailItem('CPF', funcionario.cpf, 'fa-id-card');
                    documentosHtml += addDetailItem('RG', funcionario.rg, 'fa-id-badge');
                    documentosHtml += addDetailItem('CAT (CNH)', funcionario.cat, 'fa-address-card');
                    documentosHtml += addDetailItem('PIS', funcionario.pis, 'fa-id-card-alt');
                    documentosHtml += addDetailItem('Filhos', funcionario.filhos, 'fa-child');

                    let cargoHtml = '';
                    cargoHtml += addDetailItem('Cargo', funcionario.cargo, 'fa-briefcase');
                    cargoHtml += addDetailItem('Data de Admissão', funcionario.data_admissao, 'fa-calendar-check', formatDate);
                    cargoHtml += addDetailItem('Data de Saída', funcionario.data_saida, 'fa-calendar-times', formatDate);
                    cargoHtml += addDetailItem('Salário', funcionario.salario, 'fa-dollar-sign', formatCurrency);
                    cargoHtml += addDetailItem('Salário + Benefícios', funcionario.salario_beneficios, 'fa-plus-circle', formatCurrency);
                    cargoHtml += addDetailItem('Observações', funcionario.observacoes, 'fa-comment');
                    
                    const statusText = funcionario.status == 1 ? 'Ativo' : 'Inativo';
                    const statusColor = funcionario.status == 1 ? 'bg-green-500' : 'bg-red-500';
                    let loginHtml = '';
                    loginHtml += addDetailItem('Nível de Acesso', funcionario.acesso, 'fa-key');
                    loginHtml += `
                        <div class="detail-item">
                            <span class="detail-label"><i class="fas fa-toggle-on w-5 text-center"></i><span class="ml-4">Status</span></span>
                            <span class="detail-value">
                                <span class="px-2 py-1 text-xs font-semibold rounded-full ${statusColor} text-white">${statusText}</span>
                            </span>
                        </div>`;

                    let htmlContent = `
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <div class="bg-gray-700 p-4 rounded-lg shadow mb-6">
                                    <h3 class="detail-section-title">Dados Pessoais</h3>
                                    ${dadosPessoaisHtml}
                                </div>
                                <div class="bg-gray-700 p-4 rounded-lg shadow">
                                    <h3 class="detail-section-title">Documentos</h3>
                                    ${documentosHtml}
                                </div>
                            </div>
                            <div>
                                <div class="bg-gray-700 p-4 rounded-lg shadow mb-6">
                                    <h3 class="detail-section-title">Informações do Cargo</h3>
                                    ${cargoHtml}
                                </div>
                                <div class="bg-gray-700 p-4 rounded-lg shadow">
                                    <h3 class="detail-section-title">Login e Acesso</h3>
                                    ${loginHtml}
                                </div>
                            </div>
                        </div>
                        <div class="bg-gray-700 p-4 rounded-lg shadow mt-6">
                            <h3 class="detail-section-title">Próximos Agendamentos</h3>
                    `;

                    if (agendamentos && agendamentos.length > 0) {
                        htmlContent += `
                            <div class="overflow-x-auto">
                                <table class="items-table w-full">
                                    <thead>
                                        <tr><th>Data</th><th>Cliente</th><th>Pedido</th></tr>
                                    </thead>
                                    <tbody>
                                        ${agendamentos.map(ag => `
                                            <tr class="cursor-pointer hover:bg-gray-600" onclick="window.location.href='pedido_detalhes.php?id=${ag.id_pedido}'">
                                                <td>${formatDate(ag.data_agendamento)}</td>
                                                <td>${ag.cliente_nome}</td>
                                                <td>#${ag.id_pedido}</td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        `;
                    } else {
                        htmlContent += '<p class="text-gray-400">Nenhum agendamento futuro encontrado.</p>';
                    }

                    htmlContent += `</div>`;
                    detailsContainer.innerHTML = htmlContent;

                    editButton.href = `editar_funcionario.php?id=${funcionarioId}`;
                    if (funcionario.status == 0) {
                        deactivateButton.style.display = 'none';
                    }
                    actionsContainer.classList.remove('hidden');

                } catch (error) {
                    console.error("Erro ao carregar detalhes:", error);
                    loadingDiv.style.display = 'none';
                    errorDiv.classList.remove('hidden');
                }
            };

            const showConfirmationModal = (title, message, onConfirm) => {
                confirmationModalTitle.textContent = title;
                confirmationModalMessage.textContent = message;
                pendingAction = onConfirm;
                confirmationModal.classList.remove('hidden');
            };

            deactivateButton.addEventListener('click', () => {
                showConfirmationModal(
                    'Desativar Funcionário',
                    'Tem certeza que deseja desativar este funcionário?',
                    async () => {
                        try {
                            const response = await fetch('backend/funcionarios/delete_funcionario.php', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ id_funcionario: funcionarioId })
                            });
                            const result = await response.json();
                            if (result.success) {
                                window.location.reload();
                            } else {
                                alert(result.message || 'Erro ao desativar.');
                            }
                        } catch (error) {
                            alert('Erro de conexão ao tentar desativar o funcionário.');
                        }
                    }
                );
            });

            cancelConfirmationBtn.addEventListener('click', () => {
                confirmationModal.classList.add('hidden');
                pendingAction = null;
            });

            confirmActionBtn.addEventListener('click', () => {
                if (pendingAction) pendingAction();
                confirmationModal.classList.add('hidden');
                pendingAction = null;
            });

            loadDetails();
        });
    </script>

</body>
</html>
