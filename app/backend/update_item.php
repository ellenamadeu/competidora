<?php
// ATENÇÃO: As linhas abaixo (ini_set e error_reporting) são para DEBUG SOMENTE.
// REMOVA-AS IMEDIATAMENTE APÓS DIAGNOSTICAR O PROBLEMA EM AMBIENTE DE PRODUÇÃO!
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// FIM DAS LINHAS DE DEBUG

// backend/update_item.php
// Este script atualiza um item existente em um pedido.

header('Content-Type: application/json');
include 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    // LOG DE DEBUG: Exibe todos os dados recebidos do frontend
    error_log("DEBUG update_item.php: Dados brutos recebidos: " . print_r($data, true));

    $id_item = $data['id_item'] ?? null; // ID do item a ser atualizado
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

    // LOG DE DEBUG: Exibe os valores das variáveis chave após a extração
    error_log("DEBUG update_item.php: id_item: '{$id_item}', id_pedido: '{$id_pedido}', id_cliente: '{$id_cliente}', produto_sc: '{$produto_sc}', acabamento2: '{$acabamento2}', valor_total: '{$valor_total}'");


    // Validação para campos essenciais.
    // Usamos is_numeric e > 0 para IDs para garantir que são números válidos e não zero.
    if (!is_numeric($id_item) || $id_item <= 0 || 
        !is_numeric($id_pedido) || $id_pedido <= 0 || 
        !is_numeric($id_cliente) || $id_cliente <= 0 ||
        empty($altura) || empty($largura) || empty($quantidade)) 
    {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Campos obrigatórios (ID do Item, Pedido ID, Cliente ID, Altura, Largura, Quantidade) ausentes ou inválidos.']);
        exit();
    }

    try {
        // Converte strings vazias para NULL para campos que aceitam NULL no DB
        $produto_sc = ($produto_sc === '') ? null : $produto_sc;
        $categoria_id = ($categoria_id === '') ? null : $categoria_id;
        $produto_id = ($produto_id === '') ? null : $produto_id;
        $descricao_id = ($descricao_id === '') ? null : $descricao_id;
        $espessura_id = ($espessura_id === '') ? null : $espessura_id;
        $acabamento_id = ($acabamento_id === '') ? null : $acabamento_id;
        $acabamento2 = ($acabamento2 === '') ? null : $acabamento2;
        $valor_unitario = ($valor_unitario === '') ? null : $valor_unitario;
        $valor_total = ($valor_total === '') ? null : $valor_total;

        $sqlUpdate = "
            UPDATE itens SET
                id_cliente = ?,
                id_pedido = ?,
                produto_sc = ?,
                categoria = ?,
                produto = ?,
                descricao = ?,
                espessura = ?,
                acabamento = ?,
                acabamento2 = ?,
                altura = ?,
                largura = ?,
                quantidade = ?,
                valor_unitario = ?,
                valor_total = ?
            WHERE id_item = ?
        ";
        
        $stmtUpdate = $pdo->prepare($sqlUpdate);
        $stmtUpdate->execute([
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
            $valor_total,
            $id_item // ID do item na cláusula WHERE - DEVE SER O ÚLTIMO PARÂMETRO
        ]);

        if ($stmtUpdate->rowCount() > 0) {
            // --- Recalcular e atualizar totais do pedido ---
            // A lógica de recálculo é importante para manter a consistência dos totais do pedido
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

            echo json_encode(['success' => true, 'message' => 'Item atualizado e totais do pedido atualizados com sucesso!']);
        } else {
            // Mensagem mais informativa se nenhuma linha foi afetada
            echo json_encode(['success' => false, 'message' => 'Nenhum item foi atualizado. Verifique se o ID do item existe ou se os dados são diferentes dos atuais.']);
        }

    } catch (PDOException $e) {
        http_response_code(500);
        error_log("ERRO PDO update_item.php: " . $e->getMessage()); // Log do erro PDO
        echo json_encode(['success' => false, 'error' => 'Erro no servidor (PDOException): ' . $e->getMessage()]);
    } catch (Exception $e) {
        http_response_code(500);
        error_log("ERRO GERAL update_item.php: " . $e->getMessage()); // Log de outros erros
        echo json_encode(['success' => false, 'error' => 'Erro inesperado no servidor: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método de requisição não permitido. Use POST.']);
}
