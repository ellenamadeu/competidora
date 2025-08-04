<?php
// backend/get_formas_pagamento.php
// Este script busca a lista de formas de pagamento para preencher o dropdown.

header('Content-Type: application/json');
include 'db_connection.php';

try {
    $sql = "SELECT id_pagamento, pagamento FROM orc_pagamento ORDER BY pagamento ASC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $formasPagamento = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($formasPagamento);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao buscar formas de pagamento: ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro inesperado no servidor: ' . $e->getMessage()]);
}
?>
