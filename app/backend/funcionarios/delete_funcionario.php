<?php
// Define o cabeçalho da resposta como JSON.
header('Content-Type: application/json');

// CORREÇÃO: Ajustado o caminho para subir um nível de diretório.
include '../db_connection.php';

// Este script usa POST para desativar, em vez de deletar.
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    $id_funcionario = $data['id_funcionario'] ?? null;

    if (empty($id_funcionario)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'ID do funcionário não fornecido.']);
        exit();
    }

    try {
        // Altera o status para 0 (inativo) em vez de deletar.
        $sqlUpdate = "
            UPDATE orc_funcionarios 
            SET status = 0
            WHERE id_funcionario = ?
        ";
        
        $stmtUpdate = $pdo->prepare($sqlUpdate);
        $stmtUpdate->execute([$id_funcionario]);

        if ($stmtUpdate->rowCount() > 0) {
            echo json_encode(['success' => true, 'message' => 'Funcionário desativado com sucesso!']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Funcionário não encontrado ou já está inativo.']);
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
