<?php
// backend/add_item.php
// Este script adiciona um novo item a um pedido.

header('Content-Type: application/json');
include 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    $id_pedido = $data['id_pedido'] ?? null;
    $id_cliente = $data['id_cliente'] ?? null; 
    $produto_sc = $data['produto_sc'] ?? null;
    $categoria_id = $data['categoria'] ?? null;
    $produto_id = $data['produto'] ?? null;
    $descricao_id = $data['descricao'] ?? null;
    $espessura_id = $data['espessura'] ?? null;
    $acabamento_id = $data['acabamento'] ?? null;
    $acabamento2 = $data['acabamento2'] ?? null;
    $altura = $data['altura'] ?? null;
    $largura = $data['largura'] ?? null;
    $quantidade = $data['quantidade'] ?? null;
    $valor_unitario = $data['valor_unitario'] ?? null;
    $valor_total = $data['valor_total'] ?? null;

    if (empty($id_pedido) || empty($id_cliente) || empty($altura) || empty($largura) || empty($quantidade)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Campos obrigatórios (Pedido ID, Cliente ID, Altura, Largura, Quantidade) ausentes ou vazios.']);
        exit();
    }

    try {
        $produto_sc = empty($produto_sc) ? null : $produto_sc;
        $categoria_id = empty($categoria_id) ? null : $categoria_id;
        $produto_id = empty($produto_id) ? null : $produto_id;
        $descricao_id = empty($descricao_id) ? null : $descricao_id;
        $espessura_id = empty($espessura_id) ? null : $espessura_id;
        $acabamento_id = empty($acabamento_id) ? null : $acabamento_id;
        $acabamento2 = empty($acabamento2) ? null : $acabamento2;
        $valor_unitario = empty($valor_unitario) ? null : $valor_unitario;
        $valor_total = empty($valor_total) ? null : $valor_total;


        $sqlInsert = "
            INSERT INTO itens (
                id_cliente, id_pedido, produto_sc, categoria, produto, descricao, 
                espessura, acabamento, acabamento2, altura, largura, quantidade, 
                valor_unitario, valor_total
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
        ";
        
        $stmtInsert = $pdo->prepare($sqlInsert);
        $stmtInsert->execute([
            $id_cliente,
            $id_pedido,
            $produto_sc,
            $categoria_id,
            $produto_id,
            $descricao_id,
            $espessura_id,
            $acabamento_id,
            $acabamento2,
            $altura,
            $largura,
            $quantidade,
            $valor_unitario,
            $valor_total
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
                $totalPagoCaixa, // Atualiza valor_pago com a soma real
                $novoSaldo, 
                $id_pedido
            ]);
            // --- Fim do recálculo ---

            echo json_encode(['success' => true, 'message' => 'Item adicionado e totais do pedido atualizados com sucesso!', 'id_item' => $pdo->lastInsertId()]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Falha ao adicionar o item.']);
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
