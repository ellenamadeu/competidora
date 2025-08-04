<?php
// Define o cabeçalho da resposta como JSON.
header('Content-Type: application/json');

// Inclui o arquivo de conexão com o banco de dados.
include 'db_connection.php';

// --- 2. TENTATIVA DE EXCLUSÃO ---
try {
    // Verifica se o ID do cliente foi enviado via GET.
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
            echo json_encode(['success' => false, 'message' => 'Cliente não encontrado ou já excluído.']);
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
