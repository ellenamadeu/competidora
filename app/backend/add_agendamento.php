<?php
// backend/add_agendamento.php
// Este script adiciona um novo agendamento a um pedido.

header('Content-Type: application/json');

// Inclui o arquivo de conexão com o banco de dados.
include 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    // Validação básica e obtenção dos dados
    $id_pedido = $data['id_pedido'] ?? null;
    $data_agendamento = $data['data_agendamento'] ?? null; // Formato YYYY-MM-DD
    $hora_agendamento_id = $data['hora_agendamento'] ?? null; // Agora é o ID da hora
    $ordem_id = $data['ordem'] ?? null; // Agora é o ID da ordem
    $responsavel_id = $data['responsavel'] ?? null; // Agora é o ID do funcionário
    $instrucao = $data['instrucao'] ?? null;
    $status_agendamento = $data['status_agendamento'] ?? 0; // 0 ou 1 para checkbox

    // Validação mínima
    if (!$id_pedido || !$data_agendamento || !$hora_agendamento_id || !$ordem_id || !$responsavel_id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Dados obrigatórios do agendamento ausentes.']);
        exit();
    }

    try {
        // Inserir o novo agendamento
        $sqlInsert = "
            INSERT INTO agendamento (
                id_pedido, 
                data_agendamento, 
                hora_agendamento, 
                ordem, 
                responsavel, 
                instrucao, 
                status_agendamento
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?
            )
        ";
        
        $stmtInsert = $pdo->prepare($sqlInsert);
        $stmtInsert->execute([
            $id_pedido,
            $data_agendamento,
            $hora_agendamento_id, // Usando o ID da hora diretamente
            $ordem_id, // Usando o ID da ordem diretamente
            $responsavel_id, // Usando o ID do responsável diretamente
            $instrucao,
            $status_agendamento
        ]);

        if ($stmtInsert->rowCount() > 0) {
            echo json_encode(['success' => true, 'message' => 'Agendamento adicionado com sucesso!']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Falha ao adicionar o agendamento.']);
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
