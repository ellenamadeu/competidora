<?php
// Define o cabeçalho da resposta como JSON.
header('Content-Type: application/json');

// Inclui o arquivo de conexão com o banco de dados.
include '../db_connection.php';

try {
    // Parâmetros da requisição
    $searchTerm = isset($_GET['query']) ? trim($_GET['query']) : '';
    $statusFilter = isset($_GET['status']) ? $_GET['status'] : 'all'; // 'all', '1' (ativos), '0' (inativos)
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $limit = 20; // Limite de 20 funcionários por página
    $offset = ($page - 1) * $limit;

    // --- Construção da Cláusula WHERE ---
    $whereClause = "";
    $params = [];
    $conditions = [];

    // Adiciona filtro por termo de busca (nome, sobrenome ou cargo)
    if (!empty($searchTerm)) {
        $conditions[] = "(nome LIKE ? OR sobrenome LIKE ? OR funcao LIKE ?)";
        $likeTerm = "%" . $searchTerm . "%";
        array_push($params, $likeTerm, $likeTerm, $likeTerm);
    }

    // Adiciona filtro por status
    if ($statusFilter === '1' || $statusFilter === '0') {
        $conditions[] = "status = ?";
        $params[] = $statusFilter;
    }

    if (!empty($conditions)) {
        $whereClause = " WHERE " . implode(" AND ", $conditions);
    }

    // --- Query para Contagem Total de Registros ---
    $sqlCount = "SELECT COUNT(*) FROM orc_funcionarios" . $whereClause;
    $stmtCount = $pdo->prepare($sqlCount);
    $stmtCount->execute($params);
    $totalCount = $stmtCount->fetchColumn();

    // --- Query para buscar os dados da página atual ---
    $sqlData = "
        SELECT 
            id_funcionario, 
            nome,
            sobrenome,
            funcao AS cargo,
            status
        FROM 
            orc_funcionarios 
        " . $whereClause . "
        -- CORREÇÃO: Alterada a ordenação para priorizar status ativo (DESC) e depois nome (ASC).
        ORDER BY 
            status DESC, nome ASC 
        LIMIT " . $limit . " OFFSET " . $offset;
    
    $stmtData = $pdo->prepare($sqlData);
    $stmtData->execute($params); 
    $results = $stmtData->fetchAll(PDO::FETCH_ASSOC);

    // --- Monta a resposta final ---
    $response = [
        'total_count' => (int)$totalCount,
        'funcionarios' => $results
    ];

    echo json_encode($response);

} catch (PDOException $e) {
    http_response_code(500); 
    echo json_encode(['error' => 'Erro no servidor: ' . $e->getMessage()]);
}
?>
