<?php
// backend/delete_item.php
// Este script exclui um item de um pedido e recalcula os totais do pedido.
// A lógica de recálculo foi uniformizada para maior consistência.

header('Content-Type: application/json');
include '../db_connection.php';

$itemId = isset($_GET['id']) ? (int)$_GET['id'] : 0; 
$id_pedido_from_item = null;

if ($itemId === 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'ID do item não fornecido ou inválido para exclusão.']);
    exit();
}

try {
    $stmtGetPedidoId = $pdo->prepare("SELECT id_pedido FROM itens WHERE id_item = ? LIMIT 1");
    $stmtGetPedidoId->execute([$itemId]);
    $id_pedido_from_item = $stmtGetPedidoId->fetchColumn();

    if (!$id_pedido_from_item) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Item não encontrado para obter o ID do pedido.']);
        exit();
    }

    $sqlDelete = "DELETE FROM itens WHERE id_item = ?";
    $stmtDelete = $pdo->prepare($sqlDelete);
    $stmtDelete->execute([$itemId]);

    if ($stmtDelete->rowCount() > 0) {
        // --- Recalcular e atualizar totais do pedido após exclusão ---
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
        $stmtRecalc->execute([$id_pedido_from_item, $id_pedido_from_item, $id_pedido_from_item]);
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
            $id_pedido_from_item
        ]);
        // --- Fim do recálculo ---

        echo json_encode(['success' => true, 'message' => 'Item excluído e totais do pedido atualizados com sucesso!']);
    } else {
        http_response_code(404); 
        echo json_encode(['success' => false, 'message' => 'Item não encontrado ou já excluído.']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Erro no servidor (PDOException): ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Erro inesperado no servidor: ' . $e->getMessage()]);
}
?>
