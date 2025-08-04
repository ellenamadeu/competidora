<?php
// backend/get_pedidos.php
// Este script busca a lista de pedidos com filtros e ordenação.

header('Content-Type: application/json');

// Inclui o arquivo de conexão com o banco de dados.
include 'db_connection.php';

try {
    $results = [];
    $searchTerm = isset($_GET['query']) ? trim($_GET['query']) : '';
    $statusFilterId = isset($_GET['status_id']) ? (int)$_GET['status_id'] : 0; // Filtro por status
    $limit = 50; 

    // Base da consulta SQL
    $sql = "
        SELECT 
            p.id_pedido, 
            c.nome AS cliente_nome, 
            p.titulo, 
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
    ";

    $finalWhereParts = [];
    $params = [];

    // Adiciona filtros de termo de busca
    if (!empty($searchTerm)) {
        $searchTermConditions = [];
        $searchTermConditions[] = "p.id_pedido LIKE ?";
        $searchTermConditions[] = "p.titulo LIKE ?";
        $searchTermConditions[] = "p.medicao_dia LIKE ?";
        $searchTermConditions[] = "p.instalacao_dia LIKE ?";
        $searchTermConditions[] = "c.nome LIKE ?";
        $searchTermConditions[] = "c.telefone LIKE ?";
        $searchTermConditions[] = "c.telefone2 LIKE ?"; 
        $searchTermConditions[] = "c.endereco LIKE ?";
        $searchTermConditions[] = "c.bairro LIKE ?";
        
        $finalWhereParts[] = "(" . implode(" OR ", $searchTermConditions) . ")";
        for ($i = 0; $i < count($searchTermConditions); $i++) {
            $params[] = "%" . $searchTerm . "%"; 
        }
    }

    // Adiciona filtro por status, se um status_id válido for fornecido (não 0)
    if ($statusFilterId > 0) {
        $finalWhereParts[] = "p.status = ?";
        $params[] = $statusFilterId;
    }

    if (!empty($finalWhereParts)) {
        $sql .= " WHERE " . implode(" AND ", $finalWhereParts);
    }

    $sql .= " ORDER BY p.id_pedido DESC"; 

    $sql .= " LIMIT " . $limit;
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params); 
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($results);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro no servidor (PDOException): ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro inesperado no servidor: ' . $e->getMessage()]);
}
?>
