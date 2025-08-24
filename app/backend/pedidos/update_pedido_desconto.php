<?php
// backend/update_pedido_desconto.php
// Este script atualiza o valor do desconto de um pedido e recalcula os totais.

header('Content-Type: application/json');

// Inclui o arquivo de conexão com o banco de dados.
// Use try/catch para capturar erros de inclusão
try {
    include '../db_connection.php';
    if (!isset($pdo)) {
        throw new Exception("Falha ao carregar a conexao com o banco de dados.");
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Erro de configuracao do servidor: ' . $e->getMessage()]);
    exit();
}


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    $id_pedido = $data['id_pedido'] ?? null;
    $desconto = $data['desconto'] ?? 0;

    // Validação mínima
    if (!is_numeric($id_pedido) || $id_pedido <= 0 || !is_numeric($desconto)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Campos obrigatorios (ID do Pedido, Desconto) ausentes ou invalidos.']);
        exit();
    }

    try {
        // Inicia uma transação para garantir que o desconto e os totais sejam atualizados juntos
        $pdo->beginTransaction();

        // 1. Atualiza o valor do desconto na tabela de pedidos
        $sqlUpdateDesconto = "
            UPDATE pedidos
            SET desconto = ?
            WHERE id_pedido = ?
        ";
        $stmtUpdateDesconto = $pdo->prepare($sqlUpdateDesconto);
        $stmtUpdateDesconto->execute([$desconto, $id_pedido]);

        // 2. Recalcular e atualizar os totais do pedido com base no novo desconto
        $stmtRecalc = $pdo->prepare("
            SELECT 
                COALESCE(SUM(i.valor_total), 0) AS novo_subtotal_itens,
                COALESCE((SELECT SUM(ce.valor) FROM caixa_entrada ce WHERE ce.id_pedido = ?), 0) AS total_pago_caixa
            FROM 
                itens i
            WHERE 
                i.id_pedido = ?
        ");
        $stmtRecalc->execute([$id_pedido, $id_pedido]);
        $recalcData = $stmtRecalc->fetch(PDO::FETCH_ASSOC);

        $novoSubtotalItens = $recalcData['novo_subtotal_itens'];
        $totalPagoCaixa = $recalcData['total_pago_caixa'];
        
        $novoTotal = $novoSubtotalItens - $desconto;
        $novoSaldo = $novoTotal - $totalPagoCaixa;

        $sqlUpdatePedido = "
            UPDATE pedidos 
            SET subtotal = ?, total = ?, valor_pago = ?, saldo = ? 
            WHERE id_pedido = ?
        ";
        $stmtUpdatePedido = $pdo->prepare($sqlUpdatePedido);
        $stmtUpdatePedido->execute([
            $novoSubtotalItens, 
            $novoTotal, 
            $totalPagoCaixa,
            $novoSaldo, 
            $id_pedido
        ]);

        $pdo->commit();

        echo json_encode(['success' => true, 'message' => 'Desconto do pedido atualizado e totais recalculados com sucesso!']);

    } catch (PDOException $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Erro no servidor (PDOException): ' . $e->getMessage()]);
    } catch (Exception $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Erro inesperado no servidor: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Metodo de requisicao nao permitido. Use POST.']);
}
?>
