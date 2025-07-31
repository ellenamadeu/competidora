<?php
// orcamento_print.php
// Página de impressão de orçamento para o novo sistema.
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Orçamento - Competidora</title>

<!-- Tailwind CSS via CDN (apenas para facilitar a visualização no navegador, pode ser removido para impressão pura) -->
<script src="https://cdn.tailwindcss.com"></script>

<style>
    body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        color: #000; /* Cor do texto padrão para impressão */
        background-color: #fff; /* Fundo branco para impressão */
    }
    .container {
        width: 780px; /* Largura fixa conforme o layout antigo */
        margin: 20px auto;
        border: 1px solid #000;
        padding: 10px;
        box-sizing: border-box; /* Inclui padding e borda na largura total */
    }
    table {
        width: 100%;
        border-collapse: collapse;
    }
    table td, table th {
        border: 1px solid #000;
        padding: 5px;
        text-align: left;
        vertical-align: top;
    }
    .header-info td {
        border: none;
        padding: 2px 5px;
    }
    .client-info td {
        border: none;
        padding: 1px 5px;
    }
    .items-table th {
        text-align: center;
        background-color: #e0e0e0; /* Um cinza claro para cabeçalhos de tabela */
    }
    .items-table td {
        text-align: left;
    }
    .items-table td:nth-child(3), /* Altura */
    .items-table td:nth-child(4), /* Largura */
    .items-table td:nth-child(5), /* Quantidade */
    .items-table td:nth-child(6), /* Vl. Unit. */
    .items-table td:nth-child(7)  /* Vl. Total */
    {
        text-align: center; /* Centraliza colunas numéricas */
    }
    .items-table tfoot td {
        font-weight: bold;
        text-align: center;
    }
    .summary-table td {
        border: none;
        padding: 2px 5px;
    }
    .summary-table strong {
        font-weight: bold;
    }
    .notes-section textarea {
        width: 100%;
        border: 1px solid #000;
        padding: 5px;
        box-sizing: border-box;
        min-height: 80px;
        resize: vertical;
        font-family: Arial, sans-serif; /* Garante fonte legível */
    }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .font-bold { font-weight: bold; }
    .logo {
        width: 241px;
        height: 45px;
    }

    /* Estilos para impressão */
    @media print {
        body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        .container {
            border: 1px solid #000 !important;
        }
        table td, table th {
            border: 1px solid #000 !important;
        }
        .header-info td, .client-info td, .summary-table td {
            border: none !important;
        }
        .items-table th {
            background-color: #e0e0e0 !important;
        }
        /* Oculta elementos que não devem ser impressos */
        .no-print {
            display: none !important;
        }
    }
</style>
</head>
<body>

<div class="container">
    <div id="loading" class="text-center py-10">
        <p>Carregando orçamento...</p>
    </div>
    <div id="errorMessage" class="text-center py-10 hidden">
        <p style="color: red;">Não foi possível carregar o orçamento. Verifique o ID ou a conexão.</p>
    </div>
    <div id="orcamentoContent" class="hidden">
        <!-- Conteúdo do orçamento será carregado aqui via JavaScript -->
    </div>
</div>

<script>
    document.addEventListener('DOMContentLoaded', async () => {
        const orcamentoContentDiv = document.getElementById('orcamentoContent');
        const loadingMessage = document.getElementById('loading');
        const errorMessage = document.getElementById('errorMessage');

        // Função para obter o parâmetro 'id_pedido' da URL
        const getOrderIdFromUrl = () => {
            const params = new URLSearchParams(window.location.search);
            return params.get('id_pedido');
        };

        const orderId = getOrderIdFromUrl();

        if (!orderId) {
            loadingMessage.style.display = 'none';
            errorMessage.style.display = 'block';
            errorMessage.querySelector('p').textContent = 'ID do Pedido ausente na URL.';
            return;
        }

        // Função para formatar valores monetários (com 2 casas decimais)
        const formatCurrency = (value) => {
            return parseFloat(value || 0).toLocaleString('pt-BR', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
            });
        };

        // Função para formatar datas (DD/MM/YYYY)
        const formatDateForDisplay = (dateString) => {
            if (!dateString || dateString === '0000-00-00 00:00:00' || dateString === '0000-00-00') return 'N/A';
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        };

        try {
            const response = await fetch(`backend/get_orcamento_data.php?id_pedido=${encodeURIComponent(orderId)}`);
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Erro HTTP ao buscar dados do orçamento. Status:', response.status, 'Texto:', errorText);
                throw new Error(`A resposta do servidor não foi bem-sucedida (${response.status}). Detalhes: ${errorText.substring(0, 200)}...`);
            }
            const data = await response.json();
            console.log('Dados do orçamento recebidos:', data);

            loadingMessage.style.display = 'none';

            if (data && data.pedido && data.pedido.id_pedido) {
                const pedido = data.pedido;
                const cliente = data.cliente;
                const itens = data.itens || [];
                const somaQuant = data.soma_quant || 0;

                let htmlContent = `
                    <table width="100%" border="1" cellpadding="3" cellspacing="0" bordercolor="#000000" class="container-table">
                        <tr>
                            <td colspan="3">
                                <table width="100%" cellspacing="0" cellpadding="0" class="header-info">
                                    <tr>
                                        <td width="28%" valign="middle">
                                            <img src="../imagens/logo competidora basico.png" class="logo" />
                                            <p>&nbsp;</p>
                                        </td>
                                        <td width="43%" align="center">
                                            Competidora Vidros Ltda - EPP<br/>
                                            R. Jornalista Geraldo Rocha, 570 Jd. América<br/>
                                            Rio de Janeiro/RJ - Cep: 21240-080<br/>
                                            CNPJ: 68.732.064/0001-10 IE: 84.812.404<br/>
                                            Tel/WhatsApp: (21) 3346-9818 
                                        </td>
                                        <td width="29%">
                                            <table width="100%" cellspacing="3">
                                                <tr>
                                                    <td width="40%" align="right">Orçament:</td>
                                                    <td width="60%" align="left"><strong>${pedido.id_pedido || 'N/A'}</strong></td>
                                                </tr>
                                                <tr>
                                                    <td align="right">Data:</td>
                                                    <td align="left"><strong>${formatDateForDisplay(pedido.data_pedido)}</strong></td>
                                                </tr>
                                                <tr>
                                                    <td align="right">Validade:</td>
                                                    <td align="left">30 dias</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3">
                                <table width="100%" cellspacing="0" cellpadding="1" class="client-info">
                                    <tr>
                                        <td width="9%">Cliente:</td>
                                        <td colspan="3"><strong>${cliente.nome || 'N/A'}</strong></td>
                                    </tr>
                                    <tr>
                                        <td>Telefones:</td>
                                        <td width="48%">
                                            ${cliente.telefone || 'N/A'} 
                                            ${cliente.telefone2 ? ' / ' + cliente.telefone2 : ''} 
                                            ${cliente.telefone3 ? ' / ' + cliente.telefone3 : ''}
                                        </td>
                                        <td>&nbsp;</td>
                                        <td>Contato: ${cliente.contato || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td>Endereço:</td>
                                        <td colspan="2">${cliente.endereco || 'N/A'}</td>
                                        <td>Bairro: ${cliente.bairro || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td>Referência:</td>
                                        <td colspan="2">${cliente.referencias || 'N/A'}</td>
                                        <td>Título: ${pedido.titulo || 'N/A'}</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td height="139" colspan="3" valign="top">
                                <table width="100%" cellspacing="0" cellpadding="1" class="items-table">
                                    <thead>
                                        <tr>
                                            <th align="center">Descrição</th>
                                            <th align="center">Acabamento</th>
                                            <th width="60" align="center">Altura</th>
                                            <th width="60" align="center">Largura</th>
                                            <th width="40" align="center">Qt.</th>
                                            <th width="80" align="center">Vl. Unit.</th>
                                            <th width="80" align="center">Vl. Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${itens.map(item => `
                                            <tr>
                                                <td width="210" height="21" align="left">
                                                    ${item.produto_sc || ''} ${item.produto_nome || ''} ${item.descricao_nome || ''} ${item.espessura_nome || ''}
                                                </td>
                                                <td width="180" align="left">${item.acabamento_nome || ''} ${item.acabamento2 || ''}</td>
                                                <td width="60" align="left">${item.altura || 'N/A'}</td>
                                                <td width="60" align="center">${item.largura || 'N/A'}</td>
                                                <td width="40" align="center">${item.quantidade || 'N/A'}</td>
                                                <td width="80" align="center">${formatCurrency(item.valor_unitario)}</td>
                                                <td width="80" align="center">${formatCurrency(item.valor_total)}</td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td height="21" align="center" colspan="4">&nbsp;</td>
                                            <td width="40" align="center"><strong>${somaQuant}</strong></td>
                                            <td width="80" align="center">&nbsp;</td>
                                            <td width="80" align="center">&nbsp;</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td width="280" height="105" valign="top">
                                <table width="100%" cellspacing="0" cellpadding="0" class="notes-section">
                                    <tr>
                                        <th align="center">Observações</th>
                                    </tr>
                                    <tr>
                                        <td>${pedido.observacoes || 'N/A'}</td>
                                    </tr>
                                </table>
                            </td>
                            <td width="300" valign="top">
                                <table width="100%" border="1" class="summary-table">
                                    <tr>
                                        <th>Prazo:</th>
                                    </tr>
                                    <tr>
                                        <td>${pedido.prazo || 'N/A'} dias</td>
                                    </tr>
                                    <tr>
                                        <th>Pagamento:</th>
                                    </tr>
                                    <tr>
                                        <td>${pedido.forma_pagamento_nome || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <th>Parcelamento:</th>
                                    </tr>
                                    <tr>
                                        <td>${pedido.parcelamento || 'N/A'}</td>
                                    </tr>
                                </table>
                            </td>
                            <td width="200" align="center" valign="top">
                                <table width="200" height="97" cellpadding="0" cellspacing="0" class="summary-table">
                                    <tr>
                                        <td width="100" align="right">Subtotal:</td>
                                        <td width="80" align="right">${formatCurrency(pedido.subtotal)}</td>
                                        <td width="20">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td width="100" align="right">Desconto:</td>
                                        <td width="80" align="right">${formatCurrency(pedido.desconto)}</td>
                                        <td width="20">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td width="100" align="right"><strong>Total:</strong></td>
                                        <td width="80" align="right"><strong>${formatCurrency(pedido.total)}</strong></td>
                                        <td width="20">&nbsp;</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    <div class="no-print" style="text-align: center; margin-top: 20px;">
                        <button onclick="window.print()" style="background-color: #3B82F6; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Imprimir Orçamento</button>
                    </div>
                `;
                orcamentoContentDiv.innerHTML = htmlContent;
                orcamentoContentDiv.classList.remove('hidden');

                // Chama a função de impressão automaticamente após carregar, se desejar
                // window.print();

            } else {
                errorMessage.style.display = 'block';
                errorMessage.querySelector('p').textContent = 'Nenhum orçamento encontrado com o ID fornecido.';
            }

        } catch (error) {
            console.error('Erro ao carregar orçamento:', error);
            loadingMessage.style.display = 'none';
            errorMessage.style.display = 'block';
            errorMessage.querySelector('p').textContent = 'Ocorreu um erro ao carregar os dados do orçamento. Verifique a conexão e o console.';
        }
    });
</script>

</body>
</html>
