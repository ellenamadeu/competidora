<?php
// backend/get_agendamento_by_id.php
// Este script busca os detalhes de um único agendamento pelo seu ID.

header('Content-Type: application/json');
include 'db_connection.php';

$appointmentId = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($appointmentId === 0) {
    http_response_code(400);
    echo json_encode(['error' => 'ID do agendamento não fornecido ou inválido.']);
    exit();
}

try {
    $sql = "
        SELECT 
            id_agendamento,
            id_pedido,
            data_agendamento,
            hora_agendamento,
            ordem,
            responsavel,
            instrucao,
            status_agendamento
        FROM 
            agendamento
        WHERE 
            id_agendamento = ?
        LIMIT 1
    ";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$appointmentId]);
    $appointment = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$appointment) {
        http_response_code(404);
        echo json_encode(['error' => 'Agendamento não encontrado.']);
        exit();
    }

    echo json_encode($appointment);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro no servidor (PDOException): ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro inesperado no servidor: ' . $e->getMessage()]);
}
?>
