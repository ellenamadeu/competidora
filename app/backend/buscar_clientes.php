<?php
// Define o cabeçalho da resposta como JSON.
header('Content-Type: application/json');

// Inclui o arquivo de conexão com o banco de dados.
include 'db_connection.php';

try {
    // Parâmetros da requisição
    $searchTerm = isset($_GET['query']) ? trim($_GET['query']) : '';
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $limit = 20; // Limite de 20 clientes por página
    $offset = ($page - 1) * $limit;

    // --- Construção da Cláusula WHERE ---
    $whereClause = "";
    $params = [];
    if (!empty($searchTerm)) {
        $whereClause = "
            WHERE 
                nome LIKE ? OR 
                telefone LIKE ? OR 
                telefone2 LIKE ? OR 
                endereco LIKE ? OR 
                bairro LIKE ? 
        ";
        $likeTerm = "%" . $searchTerm . "%";
        $params = [$likeTerm, $likeTerm, $likeTerm, $likeTerm, $likeTerm];
    }

    // --- Query para Contagem Total de Registros ---
    $sqlCount = "SELECT COUNT(*) FROM clientes" . $whereClause;
    $stmtCount = $pdo->prepare($sqlCount);
    $stmtCount->execute($params);
    $totalCount = $stmtCount->fetchColumn();

    // --- Query para buscar os dados da página atual ---
    $sqlData = "
        SELECT 
            id_cliente, 
            nome, 
            contato,
            email, 
            ddd,             
            telefone,
            telefone2,
            endereco,
            bairro,
            referencias,     
            cep,
            documento,
            observacoes
        FROM 
            clientes 
        " . $whereClause . "
        ORDER BY 
            id_cliente DESC 
        LIMIT " . $limit . " OFFSET " . $offset;
    
    $stmtData = $pdo->prepare($sqlData);
    $stmtData->execute($params); 
    $results = $stmtData->fetchAll(PDO::FETCH_ASSOC);

    // --- Monta a resposta final ---
    $response = [
        'total_count' => (int)$totalCount,
        'clients' => $results
    ];

    echo json_encode($response);

} catch (PDOException $e) {
    http_response_code(500); 
    echo json_encode(['error' => 'Erro no servidor: ' . $e->getMessage()]);
}
?>
