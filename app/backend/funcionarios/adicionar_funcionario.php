<?php
// Define o cabeçalho da resposta como JSON.
header('Content-Type: application/json');

// CORREÇÃO: Ajustado o caminho para subir um nível de diretório.
include '../db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    // Obtenção dos dados.
    $nome = $data['nome'] ?? null;
    $status = isset($data['status']) ? (int)$data['status'] : 1; // Padrão é 1 (Ativo)

    // Validação: 'nome' é obrigatório
    if (empty($nome)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'O campo Nome é obrigatório.']);
        exit();
    }

    try {
        $sqlInsert = "
            INSERT INTO orc_funcionarios (nome, status) VALUES (?, ?)
        ";
        
        $stmtInsert = $pdo->prepare($sqlInsert);
        $stmtInsert->execute([$nome, $status]);

        if ($stmtInsert->rowCount() > 0) {
            $newFuncionarioId = $pdo->lastInsertId();
            echo json_encode(['success' => true, 'message' => 'Funcionário adicionado com sucesso!', 'id_funcionario' => $newFuncionarioId]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Falha ao adicionar o funcionário.']);
        }

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Erro no servidor (PDOException): ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método de requisição não permitido. Use POST.']);
}
?>
