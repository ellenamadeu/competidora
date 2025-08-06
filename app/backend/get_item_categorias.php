<?php
// backend/get_item_categorias.php
// Este script busca a lista de categorias de itens.

header('Content-Type: application/json');
include 'db_connection.php';

try {
    $sql = "SELECT id_categoria, categoria FROM item_categoria ORDER BY categoria ASC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $categorias = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($categorias);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao buscar categorias: ' . $e->getMessage()]);
}
?>
