<?php
// backend/update_pedido_status_titulo.php
// Este script atualiza o status e o título de um pedido existente.

header('Content-Type: application/json');
include 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    $id_pedido = $data['id_pedido'] ?? null;
    $titulo = $data['titulo'] ?? null; // Título pode ser nulo ou vazio
    $status_id = $data['status'] ?? null;

    // Validação dos dados recebidos (título não é mais obrigatório)
    if (!is_numeric($id_pedido) || $id_pedido <= 0 || !is_numeric($status_id)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'ID do pedido ou status inválido.']);
        exit();
    }

    try {
        $sqlUpdate = "
            UPDATE pedidos 
            SET 
                titulo = ?, 
                status = ?
            WHERE 
                id_pedido = ?
        ";
        
        $stmtUpdate = $pdo->prepare($sqlUpdate);
        $stmtUpdate->execute([
            $titulo,
            $status_id,
            $id_pedido
        ]);

        if ($stmtUpdate->rowCount() > 0) {
            echo json_encode(['success' => true, 'message' => 'Pedido atualizado com sucesso!']);
        } else {
            // Isso pode acontecer se os dados enviados forem os mesmos que já estão no banco.
            echo json_encode(['success' => true, 'message' => 'Nenhuma alteração detectada, mas a operação foi concluída.']);
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
