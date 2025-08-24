<?php
// backend/get_pedido_detalhes.php
// Este script busca todos os detalhes de um pedido específico.
// Foi revisado para incluir o ID do agendamento na busca.

header('Content-Type: application/json');

// Inclui o arquivo de conexão com o banco de dados.
include '../db_connection.php';

$pedidoId = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($pedidoId === 0) {
    http_response_code(400);
    echo json_encode(['error' => 'ID do pedido não fornecido ou inválido.']);
    exit();
}

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

    if (!$pedidoDetalhes['pedido']) {
        http_response_code(404);
        echo json_encode(['error' => 'Pedido não encontrado.']);
        exit();
    }

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

    // --- 4. Agendamentos do Pedido ---
    $sqlAgendamentos = "
        SELECT 
            a.id_agendamento, /* Adicionado o ID do agendamento para o frontend */
            a.data_agendamento,
            ah.hora AS hora_agendamento_nome,
            ao.ordem AS ordem_nome,
            f.nome AS responsavel_nome, 
            a.instrucao,
            a.status_agendamento
        FROM 
            agendamento a
        LEFT JOIN
            agendamento_hora ah ON a.hora_agendamento = ah.id_aghora
        LEFT JOIN
            agendamento_ordem ao ON a.ordem = ao.id_ordem
        LEFT JOIN
            orc_funcionarios AS f ON a.responsavel = f.id_funcionario 
        WHERE 
            a.id_pedido = ? 
        ORDER BY a.data_agendamento DESC, ah.hora ASC
    ";
    $stmtAgendamentos = $pdo->prepare($sqlAgendamentos);
    $stmtAgendamentos->execute([$pedidoId]); 
    $pedidoDetalhes['agendamentos'] = $stmtAgendamentos->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($pedidoDetalhes);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro no servidor (PDOException): ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro inesperado no servidor: ' . $e->getMessage()]);
}
?>
