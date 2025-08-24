<?php
// backend/get_pagamento_by_id.php
// Este script busca os detalhes de um único pagamento.
// Foi revisado para remover o trecho de código HTML.

header('Content-Type: application/json');
include '../db_connection.php';

$paymentId = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($paymentId === 0) {
    http_response_code(400);
    echo json_encode(['error' => 'ID do pagamento não fornecido ou inválido.']);
    exit();
}

try {
    $sqlPayment = "
        SELECT 
            ce.id_caixa_entrada,
            ce.id_pedido,
            ce.data,
            ce.forma_pagamento,
            op.pagamento AS forma_pagamento_nome,
            ce.valor
        FROM 
            caixa_entrada ce
        LEFT JOIN 
            orc_pagamento op ON ce.forma_pagamento = op.id_pagamento
        WHERE 
            ce.id_caixa_entrada = ?
        LIMIT 1
    ";
    $stmtPayment = $pdo->prepare($sqlPayment);
    $stmtPayment->execute([$paymentId]);
    $paymentData = $stmtPayment->fetch(PDO::FETCH_ASSOC);

    if (!$paymentData) {
        http_response_code(404);
        echo json_encode(['error' => 'Pagamento não encontrado.']);
        exit();
    }

    echo json_encode($paymentData);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro no servidor (PDOException): ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro inesperado no servidor: ' . $e->getMessage()]);
}
