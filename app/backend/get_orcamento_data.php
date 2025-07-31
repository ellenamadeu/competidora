<?php
// backend/get_orcamento_data.php
// Este script busca todos os dados necessários para a impressão de um orçamento.

header('Content-Type: application/json');
include '../db_connection.php';

$pedidoId = isset($_GET['id_pedido']) ? (int)$_GET['id_pedido'] : 0;

if ($pedidoId === 0) {
    http_response_code(400);
    echo json_encode(['error' => 'ID do pedido não fornecido ou inválido.']);
    exit();
}

try {
    $orcamentoData = [];

    // --- 1. Dados do Pedido ---
    $sqlPedido = "
        SELECT 
            p.id_pedido, 
            p.titulo, 
            p.data_pedido,
            p.desconto,
            p.subtotal,
            p.total,
            p.valor_pago,
            p.prazo,
            p.observacoes,
            p.parcelamento,
            op.pagamento AS forma_pagamento_nome, -- Obtém o nome da forma de pagamento
            p.newtemper -- Campo newtemper
        FROM 
            pedidos p
        LEFT JOIN
            orc_pagamento op ON p.forma_pagamento = op.id_pagamento
        WHERE 
            p.id_pedido = ?
        LIMIT 1
    ";
    $stmtPedido = $pdo->prepare($sqlPedido);
    $stmtPedido->execute([$pedidoId]);
    $orcamentoData['pedido'] = $stmtPedido->fetch(PDO::FETCH_ASSOC);

    if (!$orcamentoData['pedido']) {
        http_response_code(404);
        echo json_encode(['error' => 'Pedido não encontrado para o orçamento.']);
        exit();
    }

    // --- 2. Dados do Cliente ---
    // Precisamos do id_cliente do pedido para buscar os detalhes do cliente
    $clientId = $orcamentoData['pedido']['id_cliente'];
    $sqlCliente = "
        SELECT 
            id_cliente, 
            nome, 
            contato,
            telefone,
            telefone2,
            telefone3, 
            endereco,
            bairro,
            referencias,     
            cep,
            email,
            documento,
            observacoes
        FROM 
            clientes 
        WHERE 
            id_cliente = ?
        LIMIT 1
    ";
    $stmtCliente = $pdo->prepare($sqlCliente);
    $stmtCliente->execute([$clientId]);
    $orcamentoData['cliente'] = $stmtCliente->fetch(PDO::FETCH_ASSOC);

    // --- 3. Itens do Pedido ---
    $sqlItens = "
        SELECT 
            i.produto_sc,  
            id.descricao AS descricao_nome, 
            ip.produto AS produto_nome, 
            i.acabamento2, 
            ia.acabamento AS acabamento_nome, 
            ie.espessura AS espessura_nome,  
            i.altura, 
            i.largura, 
            i.quantidade, 
            i.valor_unitario, 
            i.valor_total
        FROM 
            itens i
        LEFT JOIN item_descricao id ON i.descricao = id.id_descricao
        LEFT JOIN item_espessura ie ON i.espessura = ie.id_espessura
        LEFT JOIN item_produto ip ON i.produto = ip.id_produto
        LEFT JOIN item_acabamento ia ON i.acabamento = ia.id_acabamento
        WHERE 
            i.id_pedido = ? 
        ORDER BY i.id_item ASC
    ";
    $stmtItens = $pdo->prepare($sqlItens);
    $stmtItens->execute([$pedidoId]);
    $orcamentoData['itens'] = $stmtItens->fetchAll(PDO::FETCH_ASSOC);

    // --- 4. Soma da Quantidade de Itens ---
    $sqlSomaQuant = "SELECT SUM(quantidade) AS quant_soma FROM itens WHERE id_pedido = ?";
    $stmtSomaQuant = $pdo->prepare($sqlSomaQuant);
    $stmtSomaQuant->execute([$pedidoId]);
    $somaQuant = $stmtSomaQuant->fetch(PDO::FETCH_ASSOC);
    $orcamentoData['soma_quant'] = $somaQuant['quant_soma'] ?? 0;

    echo json_encode($orcamentoData);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro no servidor (PDOException): ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro inesperado no servidor: ' . $e->getMessage()]);
}
