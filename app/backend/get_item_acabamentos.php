<?php
// backend/get_item_acabamentos.php
// Este script busca a lista de acabamentos de itens, filtrada por categoria.

header('Content-Type: application/json');
include 'db_connection.php';

$categoriaId = isset($_GET['categoria_id']) ? (int)$_GET['categoria_id'] : 0;

if ($categoriaId === 0) {
    echo json_encode([]); // Retorna array vazio se nenhuma categoria for fornecida
    exit();
}

try {
    $sql = "SELECT id_acabamento, acabamento FROM item_acabamento WHERE id_categoria = ? ORDER BY acabamento ASC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$categoriaId]);
    $acabamentos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($acabamentos);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao buscar acabamentos: ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro inesperado no servidor: ' . $e->getMessage()]);
}
?>
