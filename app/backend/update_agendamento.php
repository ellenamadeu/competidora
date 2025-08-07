<?php
// backend/update_agendamento.php
// Este script atualiza um agendamento existente.

header('Content-Type: application/json');
include 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    $id_agendamento = $data['id_agendamento'] ?? null;
    $id_pedido = $data['id_pedido'] ?? null;
    $data_agendamento = $data['data_agendamento'] ?? null;
    $hora_agendamento_id = $data['hora_agendamento'] ?? null;
    $ordem_id = $data['ordem'] ?? null;
    $responsavel_id = $data['responsavel'] ?? null;
    $instrucao = $data['instrucao'] ?? null;
    $status_agendamento = $data['status_agendamento'] ?? 0;

    // Validação mínima
    if (!is_numeric($id_agendamento) || $id_agendamento <= 0 ||
        !is_numeric($id_pedido) || $id_pedido <= 0 ||
        empty($data_agendamento) || empty($hora_agendamento_id) || empty($ordem_id) || empty($responsavel_id)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Campos obrigatórios do agendamento ausentes ou inválidos.']);
        exit();
    }

    try {
        $sqlUpdate = "
            UPDATE agendamento SET
                data_agendamento = ?,
                hora_agendamento = ?,
                ordem = ?,
                responsavel = ?,
                instrucao = ?,
                status_agendamento = ?
            WHERE id_agendamento = ?
        ";
        $stmtUpdate = $pdo->prepare($sqlUpdate);
        $stmtUpdate->execute([
            $data_agendamento,
            $hora_agendamento_id,
            $ordem_id,
            $responsavel_id,
            $instrucao,
            $status_agendamento,
            $id_agendamento
        ]);

        if ($stmtUpdate->rowCount() > 0) {
            echo json_encode(['success' => true, 'message' => 'Agendamento atualizado com sucesso!']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Nenhum agendamento foi atualizado. Verifique se o ID existe ou se os dados são diferentes dos atuais.']);
        }

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Erro no servidor (PDOException): ' . $e->getMessage()]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Erro inesperado no servidor: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método de requisição não permitido. Use POST.']);
}
?>
