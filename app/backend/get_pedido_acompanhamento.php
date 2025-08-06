<?php
// backend/get_pedido_acompanhamento.php
// Este script busca os dados de um pedido específico para a página de acompanhamento do cliente.
// Ele retorna apenas informações relevantes para o cliente, sem dados sensíveis de contato interno.

header('Content-Type: application/json');

// Inclui o arquivo de conexão com o banco de dados.
include 'db_connection.php';

$pedidoId = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($pedidoId === 0) {
    http_response_code(400);
    echo json_encode(['error' => 'ID do pedido não fornecido ou inválido.']);
    exit();
}

try {
    $pedidoDetalhes = [];

    // --- 1. Dados Principais do Pedido e Cliente (com dados limitados) ---
    $sqlPedido = "
        SELECT 
            p.id_pedido, 
            p.titulo, 
            p.subtotal,
            p.total,
            p.status,
            p.desconto,
            p.valor_pago,
            p.saldo,
            p.data_pedido,
            c.nome AS cliente_nome, 
            c.email AS cliente_email,
            c.telefone AS cliente_telefone, 
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

    if (!$pedidoDetalhes['pedido']) {
        http_response_code(404);
        echo json_encode(['error' => 'Pedido não encontrado.']);
        exit();
    }

    // --- 2. Itens do Pedido ---
    $sqlItens = "
        SELECT 
            i.produto_sc,
            pd.produto AS produto_nome,
            ds.descricao AS descricao_nome,
            es.espessura AS espessura_nome,
            ac.acabamento AS acabamento_nome,
            i.acabamento2,
            i.altura,
            i.largura,
            i.quantidade,
            i.valor_total
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

    echo json_encode($pedidoDetalhes);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro no servidor (PDOException): ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro inesperado no servidor: ' . $e->getMessage()]);
}
?>
