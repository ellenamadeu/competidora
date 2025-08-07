<?php
// Define o cabeçalho da resposta como JSON.
header('Content-Type: application/json');

// Inclui o arquivo de conexão com o banco de dados.
include 'db_connection.php';

// --- 2. TENTATIVA DE BUSCA ---
try {
    $results = [];

    // Verifica se o parâmetro 'query' foi enviado e se não está vazio após remover espaços em branco.
    if (isset($_GET['query']) && trim($_GET['query']) !== '') {
        $searchTerm = trim($_GET['query']);

        // Se houver um termo de busca, busca nos campos especificados.
        $sql = "
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
            WHERE 
                nome LIKE ? OR 
                telefone LIKE ? OR 
                telefone2 LIKE ? OR 
                endereco LIKE ? OR 
                bairro LIKE ? 
            ORDER BY 
                id_cliente DESC 
        ";
        
        $stmt = $pdo->prepare($sql);

        // O termo de busca é inserido nos placeholders para todos os campos.
        $likeTerm = "%" . $searchTerm . "%";
        $stmt->execute([$likeTerm, $likeTerm, $likeTerm, $likeTerm, $likeTerm]);

        // Busca todos os resultados.
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    } else {
        // Se não houver termo de busca ou se o termo for vazio, mostra os últimos 30 registros.
        $sql = "
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
            ORDER BY 
                id_cliente DESC 
            LIMIT 30 
        ";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute(); 
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Retorna os resultados em formato JSON.
    echo json_encode($results);

} catch (PDOException $e) {
    http_response_code(500); 
    echo json_encode(['error' => 'Erro no servidor: ' . $e->getMessage()]);
}
?>
