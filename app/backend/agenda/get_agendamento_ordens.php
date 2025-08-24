<?php
// backend/get_agendamento_ordens.php
// Este script busca a lista de ordens de agendamento para preencher o dropdown.

header('Content-Type: application/json');

// Inclui o arquivo de conexão com o banco de dados.
include '../db_connection.php';

try {
    // Consulta para obter todas as ordens de agendamento, ordenadas por id_ordem
    $sql = "SELECT id_ordem, ordem FROM agendamento_ordem ORDER BY id_ordem ASC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $ordens = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($ordens);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro no servidor (PDOException): ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro inesperado no servidor: ' . $e->getMessage()]);
}
?>
