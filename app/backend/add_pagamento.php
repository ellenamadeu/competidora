<?php
// backend/add_pagamento.php
// Este script adiciona um novo registro de pagamento a um pedido e atualiza os totais.

header('Content-Type: application/json');
include 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    $id_pedido = $data['id_pedido'] ?? null;
    $forma_pagamento_id = $data['forma_pagamento'] ?? null;
    $valor = $data['valor'] ?? null;

    // Validação mínima
    if (empty($id_pedido) || empty($forma_pagamento_id) || empty($valor)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Campos obrigatórios (Pedido ID, Forma de Pagamento, Valor) ausentes ou vazios.']);
        exit();
    }

    try {
        // Obter a data atual para o registro do pagamento
        $data_pagamento = date('Y-m-d H:i:s');

        // Inserir o novo pagamento
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
            // Buscar subtotal e desconto atuais do pedido
            $stmtGetPedidoTotals = $pdo->prepare("SELECT subtotal, desconto FROM pedidos WHERE id_pedido = ? LIMIT 1");
            $stmtGetPedidoTotals->execute([$id_pedido]);
            $pedidoTotals = $stmtGetPedidoTotals->fetch(PDO::FETCH_ASSOC);

            $subtotalPedido = $pedidoTotals['subtotal'] ?? 0;
            $descontoPedido = $pedidoTotals['desconto'] ?? 0;

            // Recalcular o total pago somando todos os pagamentos para este pedido
            $stmtSumPagamentos = $pdo->prepare("SELECT SUM(valor) AS total_pago FROM caixa_entrada WHERE id_pedido = ?");
            $stmtSumPagamentos->execute([$id_pedido]);
            $totalPagoCaixa = $stmtSumPagamentos->fetchColumn() ?? 0;

            // Calcular novo total e saldo
            $novoTotal = $subtotalPedido - $descontoPedido;
            $novoSaldo = $novoTotal - $totalPagoCaixa;

            $sqlUpdatePedido = "
                UPDATE pedidos 
                SET valor_pago = ?, saldo = ? 
                WHERE id_pedido = ?
            ";
            $stmtUpdatePedido = $pdo->prepare($sqlUpdatePedido);
            $stmtUpdatePedido->execute([
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
