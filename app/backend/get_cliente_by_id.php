<?php
// backend/get_cliente_by_id.php
// Este script busca os detalhes de um único cliente e seus pedidos relacionados.

header('Content-Type: application/json');
include 'db_connection.php';

$clientId = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($clientId === 0) {
    http_response_code(400);
    echo json_encode(['error' => 'ID do cliente não fornecido ou inválido.']);
    exit();
}

try {
    $clientDetails = [];

    // --- 1. Dados Principais do Cliente ---
    $sqlClient = "
        SELECT 
            id_cliente, 
            nome, 
            contato,
            email, 
            ddd,             
            telefone,
            telefone2,
            telefone3, 
            endereco,
            bairro,
            referencias,     
            cep,
            documento,
            observacoes
        FROM 
            clientes 
        WHERE 
            id_cliente = ?
        LIMIT 1
    ";
    $stmtClient = $pdo->prepare($sqlClient);
    $stmtClient->execute([$clientId]);
    $clientDetails['client'] = $stmtClient->fetch(PDO::FETCH_ASSOC);

    if (!$clientDetails['client']) {
        http_response_code(404);
        echo json_encode(['error' => 'Cliente não encontrado.']);
        exit();
    }

    // --- 2. Pedidos Relacionados ao Cliente (limitado a 20 registros) ---
    $sqlOrders = "
        SELECT 
            p.id_pedido, 
            p.titulo, 
            s.status AS status_nome, 
            p.total
        FROM 
            pedidos p
        LEFT JOIN 
            orc_status s ON p.status = s.id_status
        WHERE 
            p.id_cliente = ?
        ORDER BY 
            p.id_pedido DESC
        LIMIT 20 -- Limite fixo de 20 registros
    ";
    $stmtOrders = $pdo->prepare($sqlOrders);
    $stmtOrders->execute([$clientId]); // Não precisa de limit/offset aqui
    $clientDetails['orders'] = $stmtOrders->fetchAll(PDO::FETCH_ASSOC);

    // Não precisamos mais de 'total_orders_count' se não há paginação no frontend
    // $clientDetails['total_orders_count'] = $totalOrdersCount; 

    echo json_encode($clientDetails);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro no servidor (PDOException): ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro inesperado no servidor: ' . $e->getMessage()]);
}
?>
