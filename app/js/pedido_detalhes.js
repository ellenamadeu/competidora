document.addEventListener('DOMContentLoaded', async () => {
    // --- 1. Seletores de Elementos ---
    // Elementos da Página
    const orderTitleHeader = document.getElementById('orderTitleHeader');
    const orderDetailsContent = document.getElementById('orderDetailsContent');
    const loadingMessage = document.getElementById('loading');
    const errorMessage = document.getElementById('errorMessage');
    const noOrderFoundMessage = document.getElementById('noOrderFound');

    // Modais
    const newItemModal = document.getElementById('newItemModal');
    const updateItemModal = document.getElementById('updateItemModal');
    const newPaymentModal = document.getElementById('newPaymentModal');
    const updatePaymentModal = document.getElementById('updatePaymentModal');
    const newAppointmentModal = document.getElementById('newAppointmentModal');
    const updateAppointmentModal = document.getElementById('updateAppointmentModal');
    const confirmationModal = document.getElementById('confirmationModal');
    const updateStatusTituloModal = document.getElementById('updateStatusTituloModal');
    const updateDiscountModal = document.getElementById('updateDiscountModal');

    // Formulários
    const newItemForm = document.getElementById('newItemForm');
    const updateItemForm = document.getElementById('updateItemForm');
    const newPaymentForm = document.getElementById('newPaymentForm');
    const updatePaymentForm = document.getElementById('updatePaymentForm');
    const newAppointmentForm = document.getElementById('newAppointmentForm');
    const updateAppointmentForm = document.getElementById('updateAppointmentForm');
    const updateStatusTituloForm = document.getElementById('updateStatusTituloForm');
    const updateDiscountForm = document.getElementById('updateDiscountForm');

    // Campos e Botões dos Modais (agrupados para clareza)
    // Novo Item
    const closeNewItemModalBtn = document.getElementById('closeNewItemModalBtn');
    const cancelNewItemBtn = document.getElementById('cancelNewItemBtn');
    const newItemModalOrderIdInput = document.getElementById('newItemModalOrderId');
    const newItemModalClientIdInput = document.getElementById('newItemModalClientId');
    const newItemModalMessageDiv = document.getElementById('newItemModalMessage');
    const itemValorUnitarioInput = document.getElementById('itemValorUnitario');
    const itemValorTotalInput = document.getElementById('itemValorTotal');
    const itemQuantidadeInput = document.getElementById('itemQuantidade');
    const itemCategoriaSelect = document.getElementById('itemCategoria');
    const itemProdutoSelect = document.getElementById('itemProduto');
    const itemDescricaoSelect = document.getElementById('itemDescricao');
    const itemAcabamentoSelect = document.getElementById('itemAcabamento');
    const itemEspessuraSelect = document.getElementById('itemEspessura');

    // Atualizar Item
    const closeUpdateItemModalBtn = document.getElementById('closeUpdateItemModalBtn');
    const cancelUpdateItemBtn = document.getElementById('cancelUpdateItemBtn');
    const updateItemModalItemIdInput = document.getElementById('updateItemModalItemId');
    const updateItemModalOrderIdInput = document.getElementById('updateItemModalOrderId');
    const updateItemModalClientIdInput = document.getElementById('updateItemModalClientId');
    const updateItemModalMessageDiv = document.getElementById('updateItemModalMessage');
    const deleteItemBtn = document.getElementById('deleteItemBtn');
    const updateItemValorUnitarioInput = document.getElementById('updateItemValorUnitario');
    const updateItemValorTotalInput = document.getElementById('updateItemValorTotal');
    const updateItemQuantidadeInput = document.getElementById('updateItemQuantidade');
    const updateItemCategoriaSelect = document.getElementById('updateItemCategoria');
    const updateItemProdutoSelect = document.getElementById('updateItemProduto');
    const updateItemDescricaoSelect = document.getElementById('updateItemDescricao');
    const updateItemAcabamentoSelect = document.getElementById('updateItemAcabamento');
    const updateItemEspessuraSelect = document.getElementById('updateItemEspessura');

    // Novo Pagamento
    const closeNewPaymentModalBtn = document.getElementById('closeNewPaymentModalBtn');
    const cancelNewPaymentBtn = document.getElementById('cancelNewPaymentBtn');
    const paymentModalOrderIdInput = document.getElementById('paymentModalOrderId');
    const paymentModalMessageDiv = document.getElementById('paymentModalMessage');
    const paymentFormaPagamentoSelect = document.getElementById('paymentFormaPagamento');
    const paymentValueInput = document.getElementById('paymentValue');

    // Atualizar Pagamento
    const closeUpdatePaymentModalBtn = document.getElementById('closeUpdatePaymentModalBtn');
    const cancelUpdatePaymentBtn = document.getElementById('cancelUpdatePaymentBtn');
    const updatePaymentModalPaymentIdInput = document.getElementById('updatePaymentModalPaymentId');
    const updatePaymentModalOrderIdForUpdateInput = document.getElementById('updatePaymentModalOrderId');
    const updatePaymentModalMessageDiv = document.getElementById('updatePaymentModalMessage');
    const deletePaymentBtn = document.getElementById('deletePaymentBtn');
    const updatePaymentValueInput = document.getElementById('updatePaymentValue');

    // Novo Agendamento
    const closeNewAppointmentModalBtn = document.getElementById('closeNewAppointmentModalBtn');
    const cancelAppointmentBtn = document.getElementById('cancelAppointmentBtn');
    const newAppointmentModalOrderIdInput = document.getElementById('modalOrderId');
    const newAppointmentModalMessageDiv = document.getElementById('newAppointmentModalMessage');
    const appointmentTimeSelect = document.getElementById('appointmentTime');
    const appointmentOrderSelect = document.getElementById('appointmentOrder');
    const appointmentResponsibleSelect = document.getElementById('appointmentResponsible');
    const appointmentStatusCheckbox = document.getElementById('appointmentStatus');

    // Atualizar Agendamento
    const closeUpdateAppointmentModalBtn = document.getElementById('closeUpdateAppointmentModalBtn');
    const cancelUpdateAppointmentBtn = document.getElementById('cancelUpdateAppointmentBtn');
    const updateAppointmentModalAppointmentIdInput = document.getElementById('updateAppointmentModalAppointmentId');
    const updateAppointmentModalOrderIdInput = document.getElementById('updateAppointmentModalOrderId');
    const updateAppointmentModalMessageDiv = document.getElementById('updateAppointmentModalMessage');
    const updateAppointmentTimeSelect = document.getElementById('updateAppointmentTime');
    const updateAppointmentOrderSelect = document.getElementById('updateAppointmentOrder');
    const updateAppointmentResponsibleSelect = document.getElementById('updateAppointmentResponsible');
    const updateAppointmentStatusCheckbox = document.getElementById('updateAppointmentStatus');
    const deleteAppointmentBtn = document.getElementById('deleteAppointmentBtn');

    // Atualizar Status/Título
    const closeUpdateStatusTituloModalBtn = document.getElementById('closeUpdateStatusTituloModalBtn');
    const cancelUpdateStatusTituloBtn = document.getElementById('cancelUpdateStatusTituloBtn');
    const updateStatusTituloModalOrderIdInput = document.getElementById('updateStatusTituloModalOrderId');
    const updateTituloInput = document.getElementById('updateTitulo');
    const updateStatusSelect = document.getElementById('updateStatus');
    const updateStatusTituloModalMessageDiv = document.getElementById('updateStatusTituloModalMessage');

    // Desconto
    const closeUpdateDiscountModalBtn = document.getElementById('closeUpdateDiscountModalBtn');
    const cancelUpdateDiscountBtn = document.getElementById('cancelUpdateDiscountBtn');
    const updateDiscountModalOrderIdInput = document.getElementById('updateDiscountModalOrderId');
    const updateDiscountValueInput = document.getElementById('updateDiscountValue');
    const updateDiscountModalMessage = document.getElementById('updateDiscountModalMessage');

    // Confirmação
    const confirmationModalTitle = document.getElementById('confirmationModalTitle');
    const confirmationModalMessage = document.getElementById('confirmationModalMessage');
    const cancelConfirmationBtn = document.getElementById('cancelConfirmationBtn');
    const confirmActionBtn = document.getElementById('confirmActionBtn');
    let pendingAction = null;

    // --- 2. Estado e Variáveis Globais ---
    const getOrderIdFromUrl = () => new URLSearchParams(window.location.search).get('id');
    const orderId = getOrderIdFromUrl();

    // Mapa de ícones e cores para cada status do pedido
    const statusStyles = {
        '1': { colorClass: 'status-gray', icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>` },
        '2': { colorClass: 'status-gray', icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>` },
        '3': { colorClass: 'status-yellow', icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.75A.75.75 0 013 4.5h.75m0 0a.75.75 0 00.75-.75V3.75m0 0A.75.75 0 003.75 3h-.75m0 0a.75.75 0 00-.75.75v.75m0 0A.75.75 0 003 6h.75M7.5 12h9M7.5 15h9M12 4.5v.75A.75.75 0 0111.25 6h-1.5a.75.75 0 01-.75-.75V4.5m3 0A.75.75 0 0011.25 3h-1.5a.75.75 0 00-.75.75v.75m3 0a.75.75 0 00.75-.75V3.75m0 0A.75.75 0 0012.75 3h-1.5a.75.75 0 00-.75.75v.75" /></svg>` },
        '4': { colorClass: 'status-blue', icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.472-2.472a3.375 3.375 0 00-4.773-4.773L4.5 15.75l9.17 9.17 2.828-2.828-5.877-5.877z" /></svg>` },
        '5': { colorClass: 'status-purple', icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>` },
        '6': { colorClass: 'status-green', icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>` },
        '7': { colorClass: 'status-red', icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>` },
        'default': { colorClass: 'status-gray', icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`}
    };

    // --- 3. Funções Utilitárias ---
    const formatCurrencyInputHandler = (event) => {
        const input = event.target;
        let value = input.value.replace(/\D/g, '');
        if (value === '') { input.value = ''; return; }
        value = parseInt(value, 10).toString();
        if (value.length < 3) value = value.padStart(3, '0');
        let integerPart = value.slice(0, -2);
        const decimalPart = value.slice(-2);
        integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        input.value = `${integerPart},${decimalPart}`;
    };

    const showConfirmationModal = (title, message, onConfirm) => {
        confirmationModalTitle.textContent = title;
        confirmationModalMessage.textContent = message;
        pendingAction = onConfirm;
        confirmationModal.classList.remove('hidden');
    };

    const formatDate = (dateString) => {
        if (!dateString || dateString.startsWith('0000')) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    };

    const formatCurrency = (value) => parseFloat(value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const cleanAndParse = (value) => {
        if (typeof value !== 'string') value = String(value || '');
        return parseFloat(value.replace(/\./g, '').replace(',', '.')) || 0;
    };

    // --- 4. Função Principal de Renderização ---
    const loadOrderDetails = async () => {
        if (!orderId) {
            orderTitleHeader.textContent = 'ID do Pedido Ausente';
            loadingMessage.style.display = 'none';
            errorMessage.style.display = 'block';
            return;
        }

        errorMessage.style.display = 'none';
        noOrderFoundMessage.style.display = 'none';
        loadingMessage.style.display = 'block';

        try {
            const response = await fetch(`backend/get_pedido_detalhes.php?id=${encodeURIComponent(orderId)}`);
            if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
            
            const data = await response.json();
            loadingMessage.style.display = 'none';

            if (data && data.pedido && data.pedido.id_pedido) {
                const { pedido, itens = [], pagamentos = [], agendamentos = [] } = data;
                
                orderTitleHeader.textContent = `Pedido #${pedido.id_pedido} - ${pedido.titulo || 'Sem Título'}`;
                
                const style = statusStyles[pedido.status] || statusStyles.default;
                let htmlContent = `
                    <div class="bg-gray-700 p-4 rounded-lg shadow mb-6 flex justify-between items-center">
                        <div id="status-line-clickable" class="flex items-center gap-4 cursor-pointer group">
                            <div class="w-14 h-14 rounded-full flex items-center justify-center ${style.colorClass} transition-transform group-hover:scale-110">${style.icon}</div>
                            <div><span class="text-sm text-gray-400">Status</span><p class="text-lg font-bold text-white">${pedido.status_nome || 'N/A'}</p></div>
                        </div>
                        <div class="text-right"><span class="text-sm text-gray-400">Data do Pedido</span><p class="text-lg font-semibold text-white">${formatDate(pedido.data_pedido)}</p></div>
                    </div>`;
                
                let clienteHtml = '';
                if (pedido.cliente_nome) {
                    const nomeContato = [pedido.cliente_nome, pedido.cliente_contato].filter(Boolean).join(' - ');
                    clienteHtml += `<div class="detail-item"><span class="detail-label"><i class="fas fa-user"></i></span><span class="detail-value"><a href="detalhes_cliente.php?id=${pedido.id_cliente}" class="text-blue-400 hover:underline">${nomeContato}</a></span></div>`;
                }

                const createWhatsAppLink = (ddd, phone) => {
                    if (!phone) return '';
                    const cleanPhone = phone.replace(/\D/g, '');
                    const finalDdd = ddd || '21';
                    return `<a href="https://wa.me/55${finalDdd}${cleanPhone}" target="_blank" class="text-green-400 hover:underline">${phone}</a>`;
                };

                if (pedido.cliente_telefone) clienteHtml += `<div class="detail-item"><span class="detail-label"><i class="fas fa-phone"></i></span><span class="detail-value">${createWhatsAppLink(pedido.cliente_ddd, pedido.cliente_telefone)}</span></div>`;
                if (pedido.cliente_telefone2) clienteHtml += `<div class="detail-item"><span class="detail-label"><i class="fas fa-phone"></i></span><span class="detail-value">${createWhatsAppLink(pedido.cliente_ddd, pedido.cliente_telefone2)}</span></div>`;
                if (pedido.cliente_telefone3) clienteHtml += `<div class="detail-item"><span class="detail-label"><i class="fas fa-phone"></i></span><span class="detail-value">${createWhatsAppLink(pedido.cliente_ddd, pedido.cliente_telefone3)}</span></div>`;

                const fullAddress = [pedido.cliente_endereco, pedido.cliente_bairro].filter(Boolean).join(' - ');
                if (fullAddress) {
                    const destination = encodeURIComponent(`${fullAddress}, Rio de Janeiro, Brasil`);
                    clienteHtml += `<div class="detail-item"><span class="detail-label"><i class="fas fa-map-marker-alt"></i></span><span class="detail-value"><a href="https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving" target="_blank" class="text-blue-400 hover:underline">${fullAddress}</a></span></div>`;
                }

                if (clienteHtml) {
                    htmlContent += `<div class="bg-gray-700 p-3 rounded-lg shadow mb-6"><h3 class="detail-section-title">Dados do Cliente</h3>${clienteHtml}</div>`;
                }

                htmlContent += `
                    <div class="bg-gray-700 p-3 rounded-lg shadow mb-6">
                        <h3 class="detail-section-title">
                            <span>Itens do Pedido</span>
                            <button id="addItemBtn" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-lg text-sm transition duration-300 ease-in-out" accesskey="n"><i class="fas fa-plus"></i></button>
                        </h3>
                        ${itens.length > 0 ? `
                            <div class="overflow-x-auto">
                                <table class="items-table">
                                    <thead><tr><th>Produto</th><th>Altura</th><th>Largura</th><th class="col-qt">Qt</th><th>Valor Unitário</th><th>Valor Total</th></tr></thead>
                                    <tbody>${itens.map(item => `<tr data-item-id="${item.id_item}" class="item-row-clickable"><td data-label="Produto">${[item.produto_sc, item.produto_nome, item.descricao_nome, item.espessura_nome, item.acabamento_nome, item.acabamento2].filter(Boolean).join(' ')}</td><td data-label="Altura">${item.altura || 'N/A'}</td><td data-label="Largura">${item.largura || 'N/A'}</td><td data-label="Qt." class="col-qt">${item.quantidade || 'N/A'}</td><td data-label="Vl. Unit.">${formatCurrency(item.valor_unitario)}</td><td data-label="Vl. Total">${formatCurrency(item.valor_total)}</td></tr>`).join('')}</tbody>
                                </table>
                            </div>
                        ` : '<p class="text-gray-400">Nenhum item neste pedido.</p>'}
                    </div>`;

                htmlContent += `
                    <div class="bg-gray-700 p-3 rounded-lg shadow mb-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="values-list">
                                <h4 class="detail-section-title mt-0">
                                    <span>Valores</span>
                                    <button id="editDiscountBtn" class="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded-lg text-sm"><i class="fas fa-pencil-alt"></i></button>
                                </h4>
                                <div class="detail-item"><span class="detail-label">Subtotal:</span><span class="detail-value">${formatCurrency(pedido.subtotal)}</span></div>
                                <div class="detail-item"><span class="detail-label">Desconto:</span><span class="detail-value">${formatCurrency(pedido.desconto)}</span></div>
                                <div class="detail-item"><span class="detail-label">Total:</span><span class="detail-value value-bold">${formatCurrency(pedido.total)}</span></div>
                                <div class="detail-item"><span class="detail-label">Valor Pago:</span><span class="detail-value">${formatCurrency(pedido.valor_pago)}</span></div>
                                <div class="detail-item"><span class="detail-label">Saldo:</span><span class="detail-value value-bold">${formatCurrency(pedido.saldo)}</span></div>
                            </div>
                            <div>
                                <h4 class="detail-section-title mt-0">
                                    <span>Pagamentos</span>
                                    <button id="addPaymentBtn" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-lg text-sm"><i class="fas fa-plus"></i></button>
                                </h4>
                                ${pagamentos.length > 0 ? `
                                    <div class="overflow-x-auto">
                                        <table class="payments-table">
                                            <thead><tr><th>Data</th><th>Forma</th><th>Valor</th></tr></thead>
                                            <tbody>${pagamentos.map(p => `<tr data-payment-id="${p.id_caixa_entrada}" class="payment-row-clickable"><td>${formatDate(p.data)}</td><td>${p.forma_pagamento_nome || 'N/A'}</td><td>${formatCurrency(p.valor)}</td></tr>`).join('')}</tbody>
                                        </table>
                                    </div>
                                ` : '<p class="text-gray-400">Nenhum pagamento registrado.</p>'}
                            </div>
                        </div>
                    </div>`;

                htmlContent += `
                    <div class="bg-gray-700 p-3 rounded-lg shadow mb-6">
                        <h3 class="detail-section-title">
                            <span>Agendamentos</span>
                            <button id="addAppointmentBtn" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-lg text-sm"><i class="fas fa-plus"></i></button>
                        </h3>
                        ${agendamentos.length > 0 ? `
                            <div class="overflow-x-auto">
                                <table class="items-table">
                                    <thead><tr><th>Data/Hora</th><th>OS</th><th>Responsável</th><th>Status</th></tr></thead>
                                    <tbody>
                                        ${agendamentos.map(ag => `
                                            <tr data-appointment-id-row="${ag.id_agendamento}" class="appointment-row-clickable">
                                                <td data-label="Data/Hora">${formatDate(ag.data_agendamento)} - ${ag.hora_agendamento_nome || 'N/A'}</td>
                                                <td data-label="OS">${ag.ordem_nome || 'N/A'}</td>
                                                <td data-label="Responsável">${ag.responsavel_nome || 'N/A'}</td>
                                                <td data-label="Status" class="text-center">
                                                    <label class="styled-checkbox-container appointment-status-toggle" data-agendamento-id="${ag.id_agendamento}" style="cursor: pointer; display: inline-flex; justify-content: center; width: 100%;">
                                                        <input type="checkbox" class="appointment-checkbox" ${ag.status_agendamento == 1 ? 'checked' : ''}>
                                                        <span class="styled-checkbox-checkmark"></span>
                                                    </label>
                                                </td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        ` : '<p class="text-gray-400">Nenhum agendamento registrado para este pedido.</p>'}
                    </div>`;

                orderDetailsContent.innerHTML = htmlContent;

                document.getElementById('editDiscountBtn')?.addEventListener('click', () => {
                    updateDiscountModalOrderIdInput.value = orderId;
                    updateDiscountValueInput.value = formatCurrency(pedido.desconto);
                    updateDiscountModalMessage.classList.add('hidden');
                    updateDiscountModal.classList.remove('hidden');
                });
                
                document.getElementById('acompanhamentoBtn').href = `pedido_acompanhamento.php?id=${orderId}`;
                document.getElementById('printBtn').href = `pedido_print.php?id=${orderId}`;
                document.getElementById('status-line-clickable')?.addEventListener('click', async () => {
                    updateStatusTituloModalOrderIdInput.value = orderId;
                    updateTituloInput.value = pedido.titulo || '';
                    await loadStatusDropdown(updateStatusSelect, pedido.status);
                    updateStatusTituloModal.classList.remove('hidden');
                });
                document.getElementById('addAppointmentBtn')?.addEventListener('click', async () => {
                    newAppointmentModalOrderIdInput.value = orderId; 
                    newAppointmentModalMessageDiv.textContent = ''; 
                    newAppointmentModalMessageDiv.classList.add('hidden');
                    newAppointmentForm.reset(); 
                    await loadAppointmentTimeDropdown(appointmentTimeSelect); 
                    await loadAppointmentOrderDropdown(appointmentOrderSelect); 
                    await loadFuncionariosDropdown(appointmentResponsibleSelect);
                    newAppointmentModal.classList.remove('hidden');
                });
                document.getElementById('addItemBtn')?.addEventListener('click', async () => {
                    newItemModalOrderIdInput.value = orderId;
                    newItemModalClientIdInput.value = pedido.id_cliente;
                    newItemModalMessageDiv.textContent = '';
                    newItemModalMessageDiv.classList.add('hidden');
                    newItemForm.reset();
                    await loadItemCategoriesDropdown(itemCategoriaSelect); 
                    await loadItemEspessurasDropdown(itemEspessuraSelect); 
                    newItemModal.classList.remove('hidden');
                });
                document.getElementById('addPaymentBtn')?.addEventListener('click', async () => {
                    paymentModalOrderIdInput.value = orderId;
                    paymentModalMessageDiv.textContent = '';
                    paymentModalMessageDiv.classList.add('hidden');
                    newPaymentForm.reset();
                    await loadFormasPagamentoDropdown(paymentFormaPagamentoSelect);
                    newPaymentModal.classList.remove('hidden');
                });
                
                document.querySelectorAll('.item-row-clickable').forEach(row => row.addEventListener('click', (event) => { 
                    if (event.target.closest('button')) return;
                    if (row.dataset.itemId) loadItemForUpdate(row.dataset.itemId); 
                }));
                document.querySelectorAll('.payment-row-clickable').forEach(row => row.addEventListener('click', (event) => { 
                    if (event.target.closest('button')) return;
                    if (row.dataset.paymentId) loadPaymentForUpdate(row.dataset.paymentId); 
                }));
                document.querySelectorAll('.appointment-row-clickable').forEach(row => row.addEventListener('click', (event) => {
                    if (event.target.closest('.appointment-status-toggle')) return;
                    if (row.dataset.appointmentIdRow) loadAppointmentForUpdate(row.dataset.appointmentIdRow);
                }));

                addAppointmentStatusListeners();

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
    
    const updateAppointmentStatus = async (id, status, checkboxElement) => {
        try {
            const response = await fetch('backend/update_agendamento_status.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_agendamento: id, status: status })
            });
            const result = await response.json();
            if (!result.success) {
                checkboxElement.checked = !checkboxElement.checked;
                alert('Falha ao atualizar o status do agendamento.');
            }
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            checkboxElement.checked = !checkboxElement.checked;
            alert('Erro de conexão ao tentar atualizar o status.');
        }
    };

    const addAppointmentStatusListeners = () => {
        document.querySelectorAll('.appointment-status-toggle').forEach(label => {
            label.addEventListener('click', (event) => {
                event.stopPropagation();
                
                const checkbox = label.querySelector('.appointment-checkbox');
                const appointmentId = label.dataset.agendamentoId;
                const newStatus = checkbox.checked ? 1 : 0;

                updateAppointmentStatus(appointmentId, newStatus, checkbox);
            });
        });
    };
    
    const loadStatusDropdown = async (targetSelect, selectedValue = null) => {
        try {
            const response = await fetch('backend/get_orc_status.php');
            if (!response.ok) throw new Error('Erro ao carregar status');
            const statusList = await response.json();
            targetSelect.innerHTML = '<option value="">Selecione o Status</option>';
            statusList.forEach(status => {
                const option = document.createElement('option');
                option.value = status.id_status;
                option.textContent = status.status;
                if (selectedValue && selectedValue == status.id_status) {
                    option.selected = true;
                }
                targetSelect.appendChild(option);
            });
        } catch (error) {
            console.error(error);
            targetSelect.innerHTML = '<option value="">Erro ao carregar</option>';
        }
    };

    const loadAppointmentTimeDropdown = async (targetSelect, selectedValue = null) => {
        try {
            const response = await fetch('backend/get_agendamento_horas.php'); 
            if (!response.ok) throw new Error(`Erro ao carregar horas: ${response.status}`);
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
            console.error('Erro ao carregar horas:', error);
            targetSelect.innerHTML = '<option value="">Erro ao carregar</option>';
        }
    };

    const loadAppointmentOrderDropdown = async (targetSelect, selectedValue = null) => {
        try {
            const response = await fetch('backend/get_agendamento_ordens.php'); 
            if (!response.ok) throw new Error(`Erro ao carregar ordens: ${response.status}`);
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
            console.error('Erro ao carregar ordens:', error);
            targetSelect.innerHTML = '<option value="">Erro ao carregar</option>';
        }
    };

    const loadFuncionariosDropdown = async (targetSelect, selectedValue = null) => {
        try {
            const response = await fetch('backend/get_funcionarios.php');
            if (!response.ok) throw new Error(`Erro ao carregar funcionários: ${response.status}`);
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
            console.error('Erro ao carregar funcionários:', error);
            targetSelect.innerHTML = '<option value="">Erro ao carregar</option>';
        }
    };

    const loadItemCategoriesDropdown = async (targetSelect, selectedValue = null) => {
        try {
            const response = await fetch('backend/get_item_categorias.php');
            if (!response.ok) throw new Error(`Erro ao carregar categorias: ${response.status}`);
            const categorias = await response.json();
            targetSelect.innerHTML = '<option value="">Selecione a Categoria</option>';
            categorias.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id_categoria;
                option.textContent = cat.categoria;
                if (selectedValue && selectedValue == cat.id_categoria) option.selected = true;
                targetSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
            targetSelect.innerHTML = '<option value="">Erro ao carregar</option>';
        }
    };

    const loadItemProductsDropdown = async (targetSelect, categoryId, selectedValue = null) => {
        targetSelect.innerHTML = '<option value="">Selecione o Produto</option>';
        if (!categoryId) return;
        try {
            const response = await fetch(`backend/get_item_produtos.php?categoria_id=${categoryId}`);
            if (!response.ok) throw new Error(`Erro ao carregar produtos: ${response.status}`);
            const produtos = await response.json();
            produtos.forEach(prod => {
                const option = document.createElement('option');
                option.value = prod.id_produto;
                option.textContent = prod.produto;
                if (selectedValue && selectedValue == prod.id_produto) option.selected = true;
                targetSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            targetSelect.innerHTML = '<option value="">Erro ao carregar</option>';
        }
    };

    const loadItemDescriptionsDropdown = async (targetSelect, categoryId, selectedValue = null) => {
        targetSelect.innerHTML = '<option value="">Selecione a Descrição</option>';
        if (!categoryId) return;
        try {
            const response = await fetch(`backend/get_item_descricoes.php?categoria_id=${categoryId}`);
            if (!response.ok) throw new Error(`Erro ao carregar descrições: ${response.status}`);
            const descricoes = await response.json();
            descricoes.forEach(desc => {
                const option = document.createElement('option');
                option.value = desc.id_descricao;
                option.textContent = desc.descricao;
                if (selectedValue && selectedValue == desc.id_descricao) option.selected = true;
                targetSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Erro ao carregar descrições:', error);
            targetSelect.innerHTML = '<option value="">Erro ao carregar</option>';
        }
    };

    const loadItemEspessurasDropdown = async (targetSelect, selectedValue = null) => {
        try {
            const response = await fetch('backend/get_item_espessuras.php');
            if (!response.ok) throw new Error(`Erro ao carregar espessuras: ${response.status}`);
            const espessuras = await response.json();
            targetSelect.innerHTML = '<option value="">Selecione a Espessura</option>';
            espessuras.forEach(esp => {
                const option = document.createElement('option');
                option.value = esp.id_espessura;
                option.textContent = esp.espessura;
                if (selectedValue && selectedValue == esp.id_espessura) option.selected = true;
                targetSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Erro ao carregar espessuras:', error);
            targetSelect.innerHTML = '<option value="">Erro ao carregar</option>';
        }
    };

    const loadItemAcabamentosDropdown = async (targetSelect, categoryId, selectedValue = null) => {
        targetSelect.innerHTML = '<option value="">Selecione o Acabamento</option>';
        if (!categoryId) return;
        try {
            const response = await fetch(`backend/get_item_acabamentos.php?categoria_id=${categoryId}`);
            if (!response.ok) throw new Error(`Erro ao carregar acabamentos: ${response.status}`);
            const acabamentos = await response.json();
            acabamentos.forEach(acab => {
                const option = document.createElement('option');
                option.value = acab.id_acabamento;
                option.textContent = acab.acabamento;
                if (selectedValue && selectedValue == acab.id_acabamento) option.selected = true;
                targetSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Erro ao carregar acabamentos:', error);
            targetSelect.innerHTML = '<option value="">Erro ao carregar</option>';
        }
    };

    const loadFormasPagamentoDropdown = async (targetSelect, selectedValue = null) => {
        try {
            const response = await fetch('backend/get_formas_pagamento.php');
            if (!response.ok) throw new Error(`Erro ao carregar formas de pagamento: ${response.status}`);
            const formasPagamento = await response.json();
            targetSelect.innerHTML = '<option value="">Selecione a Forma</option>';
            formasPagamento.forEach(fp => {
                const option = document.createElement('option');
                option.value = fp.id_pagamento;
                option.textContent = fp.pagamento;
                if (selectedValue && selectedValue == fp.id_pagamento) option.selected = true;
                targetSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Erro ao carregar formas de pagamento:', error);
            targetSelect.innerHTML = '<option value="">Erro ao carregar</option>';
        }
    };

    const calculateItemValorTotal = (quantidadeInput, valorUnitarioInput, valorTotalInput) => {
        const quantidade = cleanAndParse(quantidadeInput.value);
        const valorUnitario = cleanAndParse(valorUnitarioInput.value);
        const valorTotal = quantidade * valorUnitario;
        valorTotalInput.value = formatCurrency(valorTotal);
    };

    itemQuantidadeInput.addEventListener('input', () => calculateItemValorTotal(itemQuantidadeInput, itemValorUnitarioInput, itemValorTotalInput));
    itemValorUnitarioInput.addEventListener('input', () => calculateItemValorTotal(itemQuantidadeInput, itemValorUnitarioInput, itemValorTotalInput));
    updateItemQuantidadeInput.addEventListener('input', () => calculateItemValorTotal(updateItemQuantidadeInput, updateItemValorUnitarioInput, updateItemValorTotalInput));
    updateItemValorUnitarioInput.addEventListener('input', () => calculateItemValorTotal(updateItemQuantidadeInput, updateItemValorUnitarioInput, updateItemValorTotalInput));

    itemCategoriaSelect.addEventListener('change', () => {
        const categoryId = itemCategoriaSelect.value;
        loadItemProductsDropdown(itemProdutoSelect, categoryId);
        loadItemDescriptionsDropdown(itemDescricaoSelect, categoryId);
        loadItemAcabamentosDropdown(itemAcabamentoSelect, categoryId);
    });

    updateItemCategoriaSelect.addEventListener('change', async () => { 
        const categoryId = updateItemCategoriaSelect.value;
        await loadItemProductsDropdown(updateItemProdutoSelect, categoryId); 
        await loadItemDescriptionsDropdown(updateItemDescricaoSelect, categoryId); 
        await loadItemAcabamentosDropdown(updateItemAcabamentoSelect, categoryId); 
    });

    const loadItemForUpdate = async (itemId) => {
        try {
            const response = await fetch(`backend/get_item_by_id.php?id=${encodeURIComponent(itemId)}`);
            if (!response.ok) throw new Error(`Erro ao carregar item: ${response.status}`);
            const itemData = await response.json();

            if (itemData) {
                updateItemModalItemIdInput.value = itemData.id_item;
                updateItemModalOrderIdInput.value = itemData.id_pedido || ''; 
                updateItemModalClientIdInput.value = itemData.id_cliente || ''; 
                updateItemProdutoSCInput.value = itemData.produto_sc || '';
                updateItemAcabamento2Input.value = itemData.acabamento2 || '';
                updateItemAlturaInput.value = itemData.altura || '';
                updateItemLarguraInput.value = itemData.largura || '';
                updateItemQuantidadeInput.value = itemData.quantidade || '';
                updateItemValorUnitarioInput.value = formatCurrency(itemData.valor_unitario);
                updateItemValorTotalInput.value = formatCurrency(itemData.valor_total);

                await loadItemCategoriesDropdown(updateItemCategoriaSelect, itemData.categoria);
                if (itemData.categoria) {
                    await loadItemProductsDropdown(updateItemProdutoSelect, itemData.categoria, itemData.produto);
                    await loadItemDescriptionsDropdown(updateItemDescricaoSelect, itemData.categoria, itemData.descricao);
                    await loadItemAcabamentosDropdown(updateItemAcabamentoSelect, itemData.categoria, itemData.acabamento);
                }
                await loadItemEspessurasDropdown(updateItemEspessuraSelect, itemData.espessura);

                updateItemModalMessageDiv.textContent = '';
                updateItemModalMessageDiv.classList.add('hidden');
                updateItemModal.classList.remove('hidden');
            } else {
                alert('Item não encontrado para atualização.');
            }
        } catch (error) {
            console.error('Erro ao carregar item para atualização:', error);
            alert('Ocorreu um erro ao carregar os dados do item.');
        }
    };

    const loadPaymentForUpdate = async (paymentId) => {
        try {
            const response = await fetch(`backend/get_pagamento_by_id.php?id=${encodeURIComponent(paymentId)}`);
            if (!response.ok) throw new Error(`Erro ao carregar pagamento: ${response.status}`);
            const paymentData = await response.json();

            if (paymentData) {
                updatePaymentModalPaymentIdInput.value = paymentData.id_caixa_entrada;
                updatePaymentModalOrderIdForUpdateInput.value = paymentData.id_pedido;
                updatePaymentDateInput.value = new Date(paymentData.data).toISOString().split('T')[0];
                updatePaymentValueInput.value = formatCurrency(paymentData.valor);
                await loadFormasPagamentoDropdown(updatePaymentFormaPagamentoSelect, paymentData.forma_pagamento);
                updatePaymentModalMessageDiv.textContent = '';
                updatePaymentModalMessageDiv.classList.add('hidden');
                updatePaymentModal.classList.remove('hidden');
            } else {
                alert('Pagamento não encontrado para atualização.');
            }
        } catch (error) {
            console.error('Erro ao carregar pagamento:', error);
            alert('Ocorreu um erro ao carregar os dados do pagamento.');
        }
    };

    const loadAppointmentForUpdate = async (appointmentId) => {
        try {
            const response = await fetch(`backend/get_agendamento_by_id.php?id=${encodeURIComponent(appointmentId)}`);
            if (!response.ok) throw new Error(`Erro ao carregar agendamento: ${response.status}`);
            const appointmentData = await response.json();

            if (appointmentData) {
                updateAppointmentModalAppointmentIdInput.value = appointmentData.id_agendamento;
                updateAppointmentModalOrderIdInput.value = appointmentData.id_pedido;
                updateAppointmentDateInput.value = appointmentData.data_agendamento;
                updateAppointmentInstructionTextarea.value = appointmentData.instrucao || '';
                updateAppointmentStatusCheckbox.checked = appointmentData.status_agendamento == 1;
                await loadAppointmentTimeDropdown(updateAppointmentTimeSelect, appointmentData.hora_agendamento);
                await loadAppointmentOrderDropdown(updateAppointmentOrderSelect, appointmentData.ordem);
                await loadFuncionariosDropdown(updateAppointmentResponsibleSelect, appointmentData.responsavel);
                updateAppointmentModalMessageDiv.textContent = '';
                updateAppointmentModalMessageDiv.classList.add('hidden');
                updateAppointmentModal.classList.remove('hidden');
            } else {
                alert('Agendamento não encontrado para atualização.');
            }
        } catch (error) {
            console.error('Erro ao carregar agendamento:', error);
            alert('Ocorreu um erro ao carregar os dados do agendamento.');
        }
    };

    newAppointmentForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        newAppointmentModalMessageDiv.classList.add('hidden'); 
        const formData = new FormData(newAppointmentForm);
        const agendamentoData = {
            id_pedido: formData.get('id_pedido'),
            data_agendamento: formData.get('data_agendamento'),
            hora_agendamento: formData.get('hora_agendamento'), 
            ordem: formData.get('ordem'), 
            responsavel: formData.get('responsavel'), 
            instrucao: formData.get('instrucao'),
            status_agendamento: appointmentStatusCheckbox.checked ? 1 : 0
        };
        try {
            const response = await fetch('backend/add_agendamento.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(agendamentoData)
            });
            const result = await response.json();
            if (result.success) {
                newAppointmentModalMessageDiv.textContent = result.message;
                newAppointmentModalMessageDiv.className = 'py-2 px-3 rounded-lg text-center bg-green-800 text-white block mb-4';
                newAppointmentForm.reset();
                setTimeout(() => {
                    newAppointmentModal.classList.add('hidden');
                    loadOrderDetails();
                }, 1500); 
            } else {
                newAppointmentModalMessageDiv.textContent = result.message || result.error || 'Erro ao salvar agendamento.';
                newAppointmentModalMessageDiv.className = 'py-2 px-3 rounded-lg text-center bg-red-800 text-white block mb-4';
            }
        } catch (error) {
            console.error('Erro ao enviar agendamento:', error);
            newAppointmentModalMessageDiv.textContent = 'Ocorreu um erro ao tentar salvar o agendamento.';
            newAppointmentModalMessageDiv.className = 'py-2 px-3 rounded-lg text-center bg-red-800 text-white block mb-4';
        }
    });

    updateAppointmentForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        updateAppointmentModalMessageDiv.classList.add('hidden');
        const formData = new FormData(updateAppointmentForm);
        const agendamentoData = {
            id_agendamento: formData.get('id_agendamento'),
            id_pedido: formData.get('id_pedido'),
            data_agendamento: formData.get('data_agendamento'),
            hora_agendamento: formData.get('hora_agendamento'),
            ordem: formData.get('ordem'),
            responsavel: formData.get('responsavel'),
            instrucao: formData.get('instrucao'),
            status_agendamento: updateAppointmentStatusCheckbox.checked ? 1 : 0
        };
        try {
            const response = await fetch('backend/update_agendamento.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(agendamentoData)
            });
            const result = await response.json();
            if (result.success) {
                updateAppointmentModalMessageDiv.textContent = result.message;
                updateAppointmentModalMessageDiv.className = 'py-2 px-3 rounded-lg text-center bg-green-800 text-white block mb-4';
                updateAppointmentForm.reset();
                setTimeout(() => {
                    updateAppointmentModal.classList.add('hidden');
                    loadOrderDetails();
                }, 1500);
            } else {
                updateAppointmentModalMessageDiv.textContent = result.message || result.error || 'Erro ao atualizar agendamento.';
                updateAppointmentModalMessageDiv.className = 'py-2 px-3 rounded-lg text-center bg-red-800 text-white block mb-4';
            }
        } catch (error) {
            console.error('Erro ao enviar atualização de agendamento:', error);
            updateAppointmentModalMessageDiv.textContent = 'Ocorreu um erro ao tentar atualizar o agendamento.';
            updateAppointmentModalMessageDiv.className = 'py-2 px-3 rounded-lg text-center bg-red-800 text-white block mb-4';
        }
    });
    
    loadOrderDetails();

    // Event Listeners dos Modais
    closeNewItemModalBtn.addEventListener('click', () => { newItemModal.classList.add('hidden'); newItemForm.reset(); });
    cancelNewItemBtn.addEventListener('click', () => { newItemModal.classList.add('hidden'); newItemForm.reset(); });
    closeUpdateItemModalBtn.addEventListener('click', () => { updateItemModal.classList.add('hidden'); updateItemForm.reset(); });
    cancelUpdateItemBtn.addEventListener('click', () => { updateItemModal.classList.add('hidden'); updateItemForm.reset(); });
    closeNewPaymentModalBtn.addEventListener('click', () => { newPaymentModal.classList.add('hidden'); newPaymentForm.reset(); });
    cancelNewPaymentBtn.addEventListener('click', () => { newPaymentModal.classList.add('hidden'); newPaymentForm.reset(); });
    closeUpdatePaymentModalBtn.addEventListener('click', () => { updatePaymentModal.classList.add('hidden'); updatePaymentForm.reset(); });
    cancelUpdatePaymentBtn.addEventListener('click', () => { updatePaymentModal.classList.add('hidden'); updatePaymentForm.reset(); });
    closeNewAppointmentModalBtn.addEventListener('click', () => { newAppointmentModal.classList.add('hidden'); newAppointmentForm.reset(); });
    cancelAppointmentBtn.addEventListener('click', () => { newAppointmentModal.classList.add('hidden'); newAppointmentForm.reset(); });
    closeUpdateAppointmentModalBtn.addEventListener('click', () => { updateAppointmentModal.classList.add('hidden'); updateAppointmentForm.reset(); });
    cancelUpdateAppointmentBtn.addEventListener('click', () => { updateAppointmentModal.classList.add('hidden'); updateAppointmentForm.reset(); });
    closeUpdateStatusTituloModalBtn.addEventListener('click', () => { updateStatusTituloModal.classList.add('hidden'); });
    cancelUpdateStatusTituloBtn.addEventListener('click', () => { updateStatusTituloModal.classList.add('hidden'); });

    window.addEventListener('click', (event) => {
        if (event.target === newItemModal) { newItemModal.classList.add('hidden'); newItemForm.reset(); }
        if (event.target === updateItemModal) { updateItemModal.classList.add('hidden'); updateItemForm.reset(); }
        if (event.target === newPaymentModal) { newPaymentModal.classList.add('hidden'); newPaymentForm.reset(); }
        if (event.target === updatePaymentModal) { updatePaymentModal.classList.add('hidden'); updatePaymentForm.reset(); }
        if (event.target === newAppointmentModal) { newAppointmentModal.classList.add('hidden'); newAppointmentForm.reset(); }
        if (event.target === updateAppointmentModal) { updateAppointmentModal.classList.add('hidden'); updateAppointmentForm.reset(); }
        if (event.target === confirmationModal) { confirmationModal.classList.add('hidden'); pendingAction = null; }
        if (event.target === updateStatusTituloModal) { updateStatusTituloModal.classList.add('hidden'); }
    });

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
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(paymentData)
            });
            const result = await response.json();
            if (result.success) {
                paymentModalMessageDiv.textContent = result.message;
                paymentModalMessageDiv.className = 'py-2 px-3 rounded-lg text-center bg-green-800 text-white block mb-4';
                newPaymentForm.reset();
                setTimeout(() => {
                    newPaymentModal.classList.add('hidden');
                    loadOrderDetails();
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
        try {
            const response = await fetch('backend/update_pagamento.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(paymentData)
            });
            const result = await response.json();
            if (result.success) {
                updatePaymentModalMessageDiv.textContent = result.message;
                updatePaymentModalMessageDiv.className = 'py-2 px-3 rounded-lg text-center bg-green-800 text-white block mb-4';
                updatePaymentForm.reset();
                setTimeout(() => {
                    updatePaymentModal.classList.add('hidden');
                    loadOrderDetails();
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
            altura: formData.get('altura'), 
            largura: formData.get('largura'), 
            quantidade: cleanAndParse(formData.get('quantidade')), 
            valor_unitario: cleanAndParse(formData.get('valor_unitario')), 
            valor_total: cleanAndParse(itemValorTotalInput.value) 
        };
        try {
            const response = await fetch('backend/add_item.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(itemData)
            });
            const result = await response.json();
            if (result.success) {
                newItemModalMessageDiv.textContent = result.message;
                newItemModalMessageDiv.className = 'py-2 px-3 rounded-lg text-center bg-green-800 text-white block mb-4';
                newItemForm.reset();
                setTimeout(() => {
                    newItemModal.classList.add('hidden');
                    loadOrderDetails();
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

    updateItemForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        updateItemModalMessageDiv.classList.add('hidden'); 
        const formData = new FormData(updateItemForm);
        const itemData = {
            id_item: formData.get('id_item'),
            id_pedido: formData.get('id_pedido'),
            id_cliente: formData.get('id_cliente'),
            produto_sc: formData.get('produto_sc'),
            categoria: formData.get('categoria'),
            produto: formData.get('produto'),
            descricao: formData.get('descricao'),
            espessura: formData.get('espessura'),
            acabamento: formData.get('acabamento'),
            acabamento2: formData.get('acabamento2'),
            altura: formData.get('altura'),
            largura: formData.get('largura'),
            quantidade: cleanAndParse(formData.get('quantidade')),
            valor_unitario: cleanAndParse(formData.get('valor_unitario')),
            valor_total: cleanAndParse(updateItemValorTotalInput.value)
        };
        try {
            const response = await fetch('backend/update_item.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(itemData)
            });
            const result = await response.json();
            if (result.success) {
                updateItemModalMessageDiv.textContent = result.message;
                updateItemModalMessageDiv.className = 'py-2 px-3 rounded-lg text-center bg-green-800 text-white block mb-4';
                updateItemForm.reset();
                setTimeout(() => {
                    updateItemModal.classList.add('hidden');
                    loadOrderDetails();
                }, 1500); 
            } else {
                updateItemModalMessageDiv.textContent = result.message || result.error || 'Erro ao atualizar item.';
                updateItemModalMessageDiv.className = 'py-2 px-3 rounded-lg text-center bg-red-800 text-white block mb-4';
            }
        } catch (error) {
            console.error('Erro ao enviar atualização de item:', error);
            updateItemModalMessageDiv.textContent = 'Ocorreu um erro ao tentar atualizar o item.';
            updateItemModalMessageDiv.className = 'py-2 px-3 rounded-lg text-center bg-red-800 text-white block mb-4';
        }
    });
    
    updateStatusTituloForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        updateStatusTituloModalMessageDiv.classList.add('hidden');
        const formData = new FormData(updateStatusTituloForm);
        const pedidoData = {
            id_pedido: formData.get('id_pedido'),
            titulo: formData.get('titulo'),
            status: formData.get('status')
        };
        try {
            const response = await fetch('backend/update_pedido_status_titulo.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pedidoData)
            });
            const result = await response.json();
            if (result.success) {
                updateStatusTituloModalMessageDiv.textContent = result.message;
                updateStatusTituloModalMessageDiv.className = 'py-2 px-3 rounded-lg text-center bg-green-800 text-white block mb-4';
                setTimeout(() => {
                    updateStatusTituloModal.classList.add('hidden');
                    loadOrderDetails();
                }, 1500);
            } else {
                updateStatusTituloModalMessageDiv.textContent = result.message || 'Erro ao atualizar.';
                updateStatusTituloModalMessageDiv.className = 'py-2 px-3 rounded-lg text-center bg-red-800 text-white block mb-4';
            }
        } catch (error) {
            console.error('Erro ao atualizar pedido:', error);
            updateStatusTituloModalMessageDiv.textContent = 'Erro de conexão.';
            updateStatusTituloModalMessageDiv.className = 'py-2 px-3 rounded-lg text-center bg-red-800 text-white block mb-4';
        }
    });

    deleteItemBtn.addEventListener('click', () => {
        showConfirmationModal('Excluir Item', 'Tem certeza que deseja excluir este item? Esta ação é irreversível.',
            async () => {
                const itemIdToDelete = updateItemModalItemIdInput.value;
                if (!itemIdToDelete) {
                    alert('ID do item para exclusão não encontrado.');
                    return;
                }
                try {
                    const response = await fetch(`backend/delete_item.php?id=${encodeURIComponent(itemIdToDelete)}`, {method: 'DELETE'});
                    const result = await response.json();
                    if (result.success) {
                        alert(result.message);
                        updateItemModal.classList.add('hidden');
                        loadOrderDetails();
                    } else {
                        alert(result.message || 'Erro ao excluir item.');
                    }
                } catch (error) {
                    console.error('Erro ao enviar exclusão de item:', error);
                    alert('Ocorreu um erro ao tentar excluir o item.');
                }
            }
        );
    });
    
    deletePaymentBtn.addEventListener('click', () => {
        showConfirmationModal('Excluir Pagamento', 'Tem certeza que deseja excluir este pagamento? Esta ação é irreversível.',
            async () => {
                const paymentIdToDelete = updatePaymentModalPaymentIdInput.value;
                const orderIdForRecalc = updatePaymentModalOrderIdForUpdateInput.value;
                if (!paymentIdToDelete || !orderIdForRecalc) {
                    alert('ID do pagamento ou do pedido para exclusão não encontrado.');
                    return;
                }
                try {
                    const response = await fetch(`backend/delete_pagamento.php?id=${encodeURIComponent(paymentIdToDelete)}&id_pedido=${encodeURIComponent(orderIdForRecalc)}`, {method: 'DELETE'});
                    const result = await response.json();
                    if (result.success) {
                        alert(result.message);
                        updatePaymentModal.classList.add('hidden');
                        loadOrderDetails();
                    } else {
                        alert(result.message || 'Erro ao excluir pagamento.');
                    }
                } catch (error) {
                    console.error('Erro ao enviar exclusão de pagamento:', error);
                    alert('Ocorreu um erro ao tentar excluir o pagamento.');
                }
            }
        );
    });

    deleteAppointmentBtn.addEventListener('click', () => {
        showConfirmationModal('Excluir Agendamento', 'Tem certeza que deseja excluir este agendamento? Esta ação é irreversível.',
            async () => {
                const appointmentIdToDelete = updateAppointmentModalAppointmentIdInput.value;
                if (!appointmentIdToDelete) {
                    alert('ID do agendamento para exclusão não encontrado.');
                    return;
                }
                try {
                    const response = await fetch(`backend/delete_agendamento.php?id=${encodeURIComponent(appointmentIdToDelete)}`, {method: 'DELETE'});
                    const result = await response.json();
                    if (result.success) {
                        alert(result.message);
                        updateAppointmentModal.classList.add('hidden');
                        loadOrderDetails();
                    } else {
                        alert(result.message || 'Erro ao excluir agendamento.');
                    }
                } catch (error) {
                    console.error('Erro ao enviar exclusão de agendamento:', error);
                    alert('Ocorreu um erro ao tentar excluir o agendamento.');
                }
            }
        );
    });
});
