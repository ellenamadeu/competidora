<?php
// backend/delete_agendamento.php
// Este script exclui um agendamento.

header('Content-Type: application/json');
include 'db_connection.php';

$appointmentId = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($appointmentId === 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'ID do agendamento não fornecido ou inválido.']);
    exit();
}

try {
    $sqlDelete = "DELETE FROM agendamento WHERE id_agendamento = ?";
    $stmtDelete = $pdo->prepare($sqlDelete);
    $stmtDelete->execute([$appointmentId]);

    if ($stmtDelete->rowCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'Agendamento excluído com sucesso!']);
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Agendamento não encontrado ou já excluído.']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Erro no servidor (PDOException): ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Erro inesperado no servidor: ' . $e->getMessage()]);
}
?>
