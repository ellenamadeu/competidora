<?php
// backend/get_agendamento_horas.php
// Este script busca a lista de horas de agendamento para preencher o dropdown.

header('Content-Type: application/json');

// Inclui o arquivo de conexão com o banco de dados.
include 'db_connection.php';

try {
    // Consulta para obter todas as horas de agendamento, ordenadas por id_aghora
    $sql = "SELECT id_aghora, hora FROM agendamento_hora ORDER BY id_aghora ASC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $horas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($horas);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro no servidor (PDOException): ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro inesperado no servidor: ' . $e->getMessage()]);
}
?>
