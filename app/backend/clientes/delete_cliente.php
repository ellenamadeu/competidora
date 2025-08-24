<?php
// Define o cabeçalho da resposta como JSON.
header('Content-Type: application/json');

// Inclui o arquivo de conexão com o banco de dados.
include '../db_connection.php';

// --- 1. VERIFICAÇÃO DO MÉTODO HTTP ---
// Apenas o método DELETE é permitido para esta operação.
if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['success' => false, 'message' => 'Método não permitido. Utilize DELETE para esta operação.']);
    exit();
}

// --- 2. TENTATIVA DE EXCLUSÃO ---
try {
    // Verifica se o ID do cliente foi enviado via GET (na URL).
    if (isset($_GET['id']) && is_numeric($_GET['id'])) {
        $clientId = $_GET['id'];

        // Query SQL para excluir o cliente.
        $sql = "DELETE FROM clientes WHERE id_cliente = ?";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$clientId]);

        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => true, 'message' => 'Cliente excluído com sucesso!']);
        } else {
            http_response_code(404); 
            echo json_encode(['success' => false, 'message' => 'Cliente não encontrado ou já foi excluído.']);
        }

    } else {
        http_response_code(400); 
        echo json_encode(['success' => false, 'message' => 'ID do cliente não fornecido ou inválido.']);
    }

} catch (PDOException $e) {
    http_response_code(500); 
    echo json_encode(['success' => false, 'error' => 'Erro no servidor: ' . $e->getMessage()]);
}
?>
