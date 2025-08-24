<?php
// backend/delete_pagamento.php
// Este script exclui um pagamento e recalcula os totais do pedido.
// A lógica de recálculo foi uniformizada para maior consistência.

header('Content-Type: application/json');
include '../db_connection.php';

$paymentId = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$pedidoId = isset($_GET['id_pedido']) ? (int)$_GET['id_pedido'] : 0;

if ($paymentId === 0 || $pedidoId === 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'ID do pagamento ou ID do pedido não fornecido ou inválido.']);
    exit();
}

try {
    $sqlDelete = "DELETE FROM caixa_entrada WHERE id_caixa_entrada = ? AND id_pedido = ?";
    $stmtDelete = $pdo->prepare($sqlDelete);
    $stmtDelete->execute([$paymentId, $pedidoId]);

    if ($stmtDelete->rowCount() > 0) {
        // --- Recalcular e atualizar totais do pedido ---
        $stmtRecalc = $pdo->prepare("
            SELECT 
                SUM(i.valor_total) AS novo_subtotal_itens,
                (SELECT p.desconto FROM pedidos p WHERE p.id_pedido = ?) AS desconto_pedido,
                (SELECT SUM(ce.valor) FROM caixa_entrada ce WHERE ce.id_pedido = ?) AS total_pago_caixa
            FROM 
                itens i
            WHERE 
                i.id_pedido = ?
        ");
        $stmtRecalc->execute([$pedidoId, $pedidoId, $pedidoId]);
        $recalcData = $stmtRecalc->fetch(PDO::FETCH_ASSOC);

        $novoSubtotalItens = $recalcData['novo_subtotal_itens'] ?? 0;
        $descontoPedido = $recalcData['desconto_pedido'] ?? 0;
        $totalPagoCaixa = $recalcData['total_pago_caixa'] ?? 0;

        $novoTotal = $novoSubtotalItens - $descontoPedido;
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
            $pedidoId
        ]);
        // --- Fim do recálculo ---

        echo json_encode(['success' => true, 'message' => 'Pagamento excluído e totais do pedido recalculados com sucesso!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Nenhum pagamento foi excluído. Verifique se o ID do pagamento existe para este pedido.']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Erro no servidor (PDOException): ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Erro inesperado no servidor: ' . $e->getMessage()]);
}
?>
