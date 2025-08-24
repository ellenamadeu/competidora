<?php
// backend/update_agendamento_status.php
// Este script atualiza o status de um agendamento (concluído/pendente).

header('Content-Type: application/json');
include '../db_connection.php';

// Apenas o método POST é permitido para esta operação.
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['success' => false, 'message' => 'Método não permitido.']);
    exit();
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);

$id_agendamento = $data['id_agendamento'] ?? null;
$status = isset($data['status']) ? (int)$data['status'] : null; // Espera 0 ou 1

if (!is_numeric($id_agendamento) || $id_agendamento <= 0 || is_null($status)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'ID do agendamento ou status inválido.']);
    exit();
}

try {
    $sqlUpdate = "UPDATE agendamento SET status_agendamento = ? WHERE id_agendamento = ?";
    $stmtUpdate = $pdo->prepare($sqlUpdate);
    $stmtUpdate->execute([$status, $id_agendamento]);

    if ($stmtUpdate->rowCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'Status do agendamento atualizado com sucesso!']);
    } else {
        // Se nenhuma linha foi afetada, não é um erro (o status pode já ser o mesmo).
        echo json_encode(['success' => true, 'message' => 'Nenhuma alteração de status necessária.']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Erro no servidor: ' . $e->getMessage()]);
}
?>
