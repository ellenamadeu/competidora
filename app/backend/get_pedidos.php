<?php
// backend/get_pedidos.php
// Este script busca a lista de pedidos com filtros, ordenação e paginação.

header('Content-Type: application/json');

// Inclui o arquivo de conexão com o banco de dados.
include 'db_connection.php';

try {
    // Parâmetros da requisição
    $searchTerm = isset($_GET['query']) ? trim($_GET['query']) : '';
    $statusFilterId = isset($_GET['status_id']) ? (int)$_GET['status_id'] : 0;
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $limit = 20; // Limite de 20 pedidos por página
    $offset = ($page - 1) * $limit;

    // --- Construção da Cláusula WHERE ---
    $whereClause = "";
    $params = [];
    $finalWhereParts = [];

    // Adiciona filtros de termo de busca
    if (!empty($searchTerm)) {
        $searchTermConditions = [
            "p.id_pedido LIKE ?",
            "p.titulo LIKE ?",
            "p.medicao_dia LIKE ?",
            "p.instalacao_dia LIKE ?",
            "c.nome LIKE ?",
            "c.telefone LIKE ?",
            "c.telefone2 LIKE ?", 
            "c.endereco LIKE ?",
            "c.bairro LIKE ?"
        ];
        
        $finalWhereParts[] = "(" . implode(" OR ", $searchTermConditions) . ")";
        for ($i = 0; $i < count($searchTermConditions); $i++) {
            $params[] = "%" . $searchTerm . "%"; 
        }
    }

    // Adiciona filtro por status
    if ($statusFilterId > 0) {
        $finalWhereParts[] = "p.status = ?";
        $params[] = $statusFilterId;
    }

    if (!empty($finalWhereParts)) {
        $whereClause = " WHERE " . implode(" AND ", $finalWhereParts);
    }

    // --- Query para Contagem Total de Registros ---
    $sqlCount = "
        SELECT COUNT(p.id_pedido)
        FROM pedidos p
        LEFT JOIN clientes c ON p.id_cliente = c.id_cliente
        " . $whereClause;
    
    $stmtCount = $pdo->prepare($sqlCount);
    $stmtCount->execute($params);
    $totalCount = $stmtCount->fetchColumn();

    // --- Query para buscar os dados da página atual ---
    $sqlData = "
        SELECT 
            p.id_pedido, 
            c.nome AS cliente_nome, 
            p.titulo, 
            s.id_status, -- Adicionado o ID do status
            s.status AS status_nome, 
            p.medicao_dia, 
            p.instalacao_dia,
            p.total,
            p.valor_pago,
            c.endereco,  
            c.bairro     
        FROM 
            pedidos p
        LEFT JOIN 
            clientes c ON p.id_cliente = c.id_cliente
        LEFT JOIN 
            orc_status s ON p.status = s.id_status
        " . $whereClause . "
        ORDER BY p.id_pedido DESC
        LIMIT " . $limit . " OFFSET " . $offset;
    
    $stmtData = $pdo->prepare($sqlData);
    $stmtData->execute($params); 
    $results = $stmtData->fetchAll(PDO::FETCH_ASSOC);

    // --- Monta a resposta final ---
    $response = [
        'total_count' => (int)$totalCount,
        'orders' => $results
    ];

    echo json_encode($response);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro no servidor (PDOException): ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro inesperado no servidor: ' . $e->getMessage()]);
}
?>
