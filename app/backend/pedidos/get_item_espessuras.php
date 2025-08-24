<?php
// backend/get_item_espessuras.php
// Este script busca a lista de espessuras de itens.

header('Content-Type: application/json');
include '../db_connection.php';

try {
    $sql = "SELECT id_espessura, espessura FROM item_espessura ORDER BY espessura ASC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $espessuras = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($espessuras);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao buscar espessuras: ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro inesperado no servidor: ' . $e->getMessage()]);
}
?>
