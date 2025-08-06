<?php
// backend/get_orc_status.php
// Este script busca a lista de status de pedidos para preencher o dropdown.

header('Content-Type: application/json');
include 'db_connection.php';

try {
    // Consulta para obter todos os status, ordenados por id_status ASC
    $sql = "SELECT id_status, status FROM orc_status ORDER BY id_status ASC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $statusList = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($statusList);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao buscar status: ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro inesperado no servidor: ' . $e->getMessage()]);
}
?>
