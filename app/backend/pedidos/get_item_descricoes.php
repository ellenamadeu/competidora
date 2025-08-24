<?php
// backend/get_item_descricoes.php
// Este script busca a lista de descrições de itens, filtrada por categoria.

header('Content-Type: application/json');
include '../db_connection.php';

$categoriaId = isset($_GET['categoria_id']) ? (int)$_GET['categoria_id'] : 0;

if ($categoriaId === 0) {
    echo json_encode([]); // Retorna array vazio se nenhuma categoria for fornecida
    exit();
}

try {
    $sql = "SELECT id_descricao, descricao FROM item_descricao WHERE id_categoria = ? ORDER BY descricao ASC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$categoriaId]);
    $descricoes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($descricoes);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao buscar descrições: ' . $e->getMessage()]);
}
?>
