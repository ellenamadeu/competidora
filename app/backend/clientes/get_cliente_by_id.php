<?php
// backend/get_cliente_by_id.php
// Este script busca os detalhes de um único cliente e seus pedidos relacionados com paginação.

header('Content-Type: application/json');
include '../db_connection.php';

// Obtenção dos parâmetros da URL
$clientId = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20; // Padrão de 20 por página
$offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0; // Padrão de 0 (início)

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

    // --- 2. Contagem Total de Pedidos do Cliente ---
    $sqlCount = "SELECT COUNT(*) FROM pedidos WHERE id_cliente = ?";
    $stmtCount = $pdo->prepare($sqlCount);
    $stmtCount->execute([$clientId]);
    $totalOrdersCount = $stmtCount->fetchColumn();
    $clientDetails['total_orders_count'] = (int)$totalOrdersCount;

    // --- 3. Pedidos Relacionados ao Cliente (com paginação) ---
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
        LIMIT ? OFFSET ?
    ";
    $stmtOrders = $pdo->prepare($sqlOrders);
    // Bind dos parâmetros como inteiros para segurança
    $stmtOrders->bindParam(1, $clientId, PDO::PARAM_INT);
    $stmtOrders->bindParam(2, $limit, PDO::PARAM_INT);
    $stmtOrders->bindParam(3, $offset, PDO::PARAM_INT);
    $stmtOrders->execute();
    $clientDetails['orders'] = $stmtOrders->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($clientDetails);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro no servidor (PDOException): ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro inesperado no servidor: ' . $e->getMessage()]);
}
?>
