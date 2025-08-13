<?php
// pedido_print.php
// Página formatada para impressão de um pedido.

// Inclui o arquivo de conexão com o banco de dados.
include 'backend/db_connection.php';

$pedidoId = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$pedidoData = null;

if ($pedidoId > 0) {
    try {
        $pedidoDetalhes = [];

        // --- 1. Dados Principais do Pedido e Cliente ---
        $sqlPedido = "
            SELECT 
                p.*, 
                c.nome AS cliente_nome, 
                c.contato AS cliente_contato, 
                c.email AS cliente_email,
                c.ddd AS cliente_ddd,             
                c.telefone AS cliente_telefone, 
                c.telefone2 AS cliente_telefone2, 
                c.telefone3 AS cliente_telefone3, 
                c.endereco AS cliente_endereco, 
                c.bairro AS cliente_bairro, 
                s.status AS status_nome
            FROM 
                pedidos p
            LEFT JOIN 
                clientes c ON p.id_cliente = c.id_cliente
            LEFT JOIN
                orc_status s ON p.status = s.id_status
            WHERE 
                p.id_pedido = ?
            LIMIT 1
        ";
        $stmtPedido = $pdo->prepare($sqlPedido);
        $stmtPedido->execute([$pedidoId]);
        $pedidoDetalhes['pedido'] = $stmtPedido->fetch(PDO::FETCH_ASSOC);

        if ($pedidoDetalhes['pedido']) {
            // --- 2. Itens do Pedido ---
            $sqlItens = "
                SELECT 
                    i.*,
                    pd.produto AS produto_nome,
                    ds.descricao AS descricao_nome,
                    es.espessura AS espessura_nome,
                    ac.acabamento AS acabamento_nome
                FROM 
                    itens i
                LEFT JOIN 
                    item_produto pd ON i.produto = pd.id_produto
                LEFT JOIN
                    item_descricao ds ON i.descricao = ds.id_descricao
                LEFT JOIN
                    item_espessura es ON i.espessura = es.id_espessura
                LEFT JOIN
                    item_acabamento ac ON i.acabamento = ac.id_acabamento
                WHERE 
                    i.id_pedido = ?
                ORDER BY i.id_item ASC
            ";
            $stmtItens = $pdo->prepare($sqlItens);
            $stmtItens->execute([$pedidoId]);
            $pedidoDetalhes['itens'] = $stmtItens->fetchAll(PDO::FETCH_ASSOC);

            // --- 3. Pagamentos do Pedido ---
            $sqlPagamentos = "
                SELECT 
                    ce.id_caixa_entrada,
                    ce.data,
                    op.pagamento AS forma_pagamento_nome,
                    ce.valor
                FROM 
                    caixa_entrada ce
                LEFT JOIN 
                    orc_pagamento op ON ce.forma_pagamento = op.id_pagamento
                WHERE 
                    ce.id_pedido = ?
                ORDER BY ce.data DESC
            ";
            $stmtPagamentos = $pdo->prepare($sqlPagamentos);
            $stmtPagamentos->execute([$pedidoId]);
            $pedidoDetalhes['pagamentos'] = $stmtPagamentos->fetchAll(PDO::FETCH_ASSOC);
            
            $pedidoData = $pedidoDetalhes;
        }

    } catch (PDOException $e) {
        // Em caso de erro, exibe a mensagem na página
        die("Erro ao buscar dados do pedido: " . $e->getMessage());
    }
}

// Funções de formatação para usar no HTML
function formatDate($dateString) {
    if (!$dateString || $dateString === '0000-00-00 00:00:00') return 'N/A';
    $date = new DateTime($dateString);
    return $date->format('d/m/Y');
}

function formatCurrency($value) {
    return number_format($value ?? 0, 2, ',', '.');
}
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pedido Nº <?php echo htmlspecialchars($pedidoId); ?></title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            background-color: #fff;
            color: #000;
            font-family: Arial, sans-serif;
            margin: 0; /* Remove margem padrão do body */
        }
        .print-container {
            width: 210mm;
            min-height: 297mm;
            margin: auto;
            padding: 10mm;
            padding-top: 0; /* Remove margem superior interna */
            padding-left: 0; /* Remove margem esquerda interna */
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            border: 1px solid #ccc;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        .section-title {
            font-size: 1.25rem;
            font-weight: bold;
            margin-top: 1.5rem;
            margin-bottom: 0.5rem;
            border-bottom: 2px solid #000;
            padding-bottom: 0.25rem;
        }
        @media print {
            body {
                margin: 0;
                padding: 0;
            }
            .print-container {
                margin: 0;
                padding: 0;
                width: 100%;
                min-height: 0;
                box-shadow: none;
            }
        }
    </style>
</head>
<body>
    <div class="print-container p-4"> <!-- Adicionado padding para compensar a remoção das margens -->
        <?php if ($pedidoData && isset($pedidoData['pedido'])): $pedido = $pedidoData['pedido']; ?>
            <!-- Bloco 1: Cabeçalho -->
            <header class="grid grid-cols-3 gap-4 items-center border-b-2 border-black pb-4">
                <div class="col-span-1">
                    <h1 class="text-4xl font-bold">Competidora</h1>
                </div>
                <div class="col-span-1 text-center text-sm">
                    <p>Rua Jorn. Geraldo Rocha, 570</p>
                    <p>Jardim América - RJ 21240-080</p>
                    <p>Tel/WhatsApp: (21) 3346-9818</p>
                </div>
                <div class="col-span-1 text-right">
                    <p class="text-lg font-semibold">Pedido Nº: <?php echo htmlspecialchars($pedido['id_pedido']); ?></p>
                    <p>Data: <?php echo formatDate($pedido['data_pedido']); ?></p>
                    <p class="text-sm italic"><?php echo htmlspecialchars($pedido['titulo']); ?></p>
                </div>
            </header>

            <!-- Bloco 2: Dados do Cliente -->
            <section class="mt-6">
                <div class="text-sm">
                    <?php if (!empty($pedido['cliente_nome'])): ?>
                        <p><strong>Nome:</strong> <span class="font-bold"><?php echo htmlspecialchars($pedido['cliente_nome']); ?></span></p>
                    <?php endif; ?>
                    <?php 
                        $telefones = array_filter([$pedido['cliente_telefone'], $pedido['cliente_telefone2'], $pedido['cliente_telefone3']]);
                        if (!empty($telefones)): 
                    ?>
                        <p><strong>Telefone:</strong> <?php echo htmlspecialchars(implode(' / ', $telefones)); ?></p>
                    <?php endif; ?>
                    <?php 
                        $enderecoCompleto = trim(implode(' - ', array_filter([$pedido['cliente_endereco'], $pedido['cliente_bairro']])));
                        if (!empty($enderecoCompleto)): 
                    ?>
                        <p><strong>Endereço:</strong> <?php echo htmlspecialchars($enderecoCompleto); ?></p>
                    <?php endif; ?>
                    <?php if (!empty($pedido['cliente_email'])): ?>
                        <p><strong>Email:</strong> <?php echo htmlspecialchars($pedido['cliente_email']); ?></p>
                    <?php endif; ?>
                </div>
            </section>

            <!-- Bloco 3: Itens do Pedido -->
            <section class="mt-6">
                <h2 class="section-title">Itens do Pedido</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Produto</th>
                            <th class="text-center">Altura</th>
                            <th class="text-center">Largura</th>
                            <th class="text-center">Qt.</th>
                            <th class="text-right">Vl. Unit</th>
                            <th class="text-right">Vl. Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($pedidoData['itens'] as $item): ?>
                            <tr>
                                <td>
                                    <?php echo htmlspecialchars(implode(' ', array_filter([
                                        $item['produto_sc'],
                                        $item['produto_nome'],
                                        $item['descricao_nome'],
                                        $item['espessura_nome'],
                                        $item['acabamento_nome'],
                                        $item['acabamento2']
                                    ]))); ?>
                                </td>
                                <td class="text-center"><?php echo htmlspecialchars($item['altura']); ?></td>
                                <td class="text-center"><?php echo htmlspecialchars($item['largura']); ?></td>
                                <td class="text-center"><?php echo htmlspecialchars($item['quantidade']); ?></td>
                                <td class="text-right"><?php echo formatCurrency($item['valor_unitario']); ?></td>
                                <td class="text-right"><?php echo formatCurrency($item['valor_total']); ?></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </section>

            <!-- Bloco 4: Pagamentos e Valores -->
            <section class="mt-4 grid grid-cols-2 gap-8"> <!-- Margem superior reduzida de mt-6 para mt-4 -->
                <div>
                    <h2 class="section-title">Pagamentos</h2>
                    <?php if (!empty($pedidoData['pagamentos'])): ?>
                        <table>
                            <thead>
                                <tr>
                                    <th>Data</th>
                                    <th>Forma</th>
                                    <th class="text-right">Valor</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($pedidoData['pagamentos'] as $pagamento): ?>
                                <tr>
                                    <td><?php echo formatDate($pagamento['data']); ?></td>
                                    <td><?php echo htmlspecialchars($pagamento['forma_pagamento_nome']); ?></td>
                                    <td class="text-right"><?php echo formatCurrency($pagamento['valor']); ?></td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    <?php else: ?>
                        <p>Nenhum pagamento registrado.</p>
                    <?php endif; ?>
                </div>
                <div>
                    <h2 class="section-title">Valores</h2>
                    <div class="space-y-2">
                        <div class="flex justify-between"><span class="font-semibold">Subtotal:</span> <span>R$ <?php echo formatCurrency($pedido['subtotal']); ?></span></div>
                        <div class="flex justify-between"><span class="font-semibold">Desconto:</span> <span>R$ <?php echo formatCurrency($pedido['desconto']); ?></span></div>
                        <div class="flex justify-between text-lg font-bold"><span class="">Total:</span> <span>R$ <?php echo formatCurrency($pedido['total']); ?></span></div>
                        <div class="flex justify-between"><span class="font-semibold">Valor Pago:</span> <span>R$ <?php echo formatCurrency($pedido['valor_pago']); ?></span></div>
                        <div class="flex justify-between text-lg font-bold"><span class="">Saldo:</span> <span>R$ <?php echo formatCurrency($pedido['saldo']); ?></span></div>
                    </div>
                </div>
            </section>

        <?php else: ?>
            <p class="text-center text-red-500 font-bold">Pedido não encontrado ou ID inválido.</p>
        <?php endif; ?>
    </div>

    <script>
        window.onload = function() {
            window.print();
        };
    </script>
</body>
</html>
