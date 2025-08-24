<?php
// backend/update_pagamento.php
// Este script atualiza um pagamento existente e recalcula os totais do pedido.
// A lógica de recálculo foi uniformizada para maior consistência.

header('Content-Type: application/json');
include '../db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    $id_caixa_entrada = $data['id_caixa_entrada'] ?? null;
    $id_pedido = $data['id_pedido'] ?? null;
    $data_pagamento = $data['data'] ?? null;
    $forma_pagamento = $data['forma_pagamento'] ?? null;
    $valor = $data['valor'] ?? null;

    if (!is_numeric($id_caixa_entrada) || $id_caixa_entrada <= 0 ||
        !is_numeric($id_pedido) || $id_pedido <= 0 ||
        empty($data_pagamento) || empty($forma_pagamento) || !is_numeric($valor)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Campos obrigatórios (ID do Pagamento, ID do Pedido, Data, Forma de Pagamento, Valor) ausentes ou inválidos.']);
        exit();
    }

    try {
        $sqlUpdate = "
            UPDATE caixa_entrada SET
                data = ?,
                forma_pagamento = ?,
                valor = ?
            WHERE id_caixa_entrada = ? AND id_pedido = ?
        ";
        $stmtUpdate = $pdo->prepare($sqlUpdate);
        $stmtUpdate->execute([
            $data_pagamento,
            $forma_pagamento,
            $valor,
            $id_caixa_entrada,
            $id_pedido
        ]);

        if ($stmtUpdate->rowCount() > 0) {
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
            $stmtRecalc->execute([$id_pedido, $id_pedido, $id_pedido]);
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
                $id_pedido
            ]);
            // --- Fim do recálculo ---

            echo json_encode(['success' => true, 'message' => 'Pagamento atualizado e totais do pedido recalculados com sucesso!']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Nenhum pagamento foi atualizado. Verifique se o ID do pagamento existe ou se os dados são diferentes dos atuais.']);
        }

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Erro no servidor (PDOException): ' . $e->getMessage()]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Erro inesperado no servidor: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método de requisição não permitido. Use POST.']);
}
?>
