<?php
// backend/add_pagamento.php
// Este script adiciona um novo registro de pagamento a um pedido e atualiza os totais.
// A lógica de recálculo foi uniformizada para maior consistência.

header('Content-Type: application/json');
include 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    $id_pedido = $data['id_pedido'] ?? null;
    $forma_pagamento_id = $data['forma_pagamento'] ?? null;
    $valor = $data['valor'] ?? null;

    if (empty($id_pedido) || empty($forma_pagamento_id) || empty($valor)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Campos obrigatórios (Pedido ID, Forma de Pagamento, Valor) ausentes ou vazios.']);
        exit();
    }

    try {
        $data_pagamento = date('Y-m-d H:i:s');

        $sqlInsert = "
            INSERT INTO caixa_entrada (
                id_pedido, 
                data, 
                forma_pagamento, 
                valor
            ) VALUES (
                ?, ?, ?, ?
            )
        ";
        
        $stmtInsert = $pdo->prepare($sqlInsert);
        $stmtInsert->execute([
            $id_pedido,
            $data_pagamento,
            $forma_pagamento_id,
            $valor
        ]);

        if ($stmtInsert->rowCount() > 0) {
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

            echo json_encode(['success' => true, 'message' => 'Pagamento adicionado e totais do pedido atualizados com sucesso!']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Falha ao adicionar o pagamento.']);
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
