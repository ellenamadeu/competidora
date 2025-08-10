<?php
// backend/get_item_by_id.php
// Este script busca os detalhes de um único item pelo seu ID.

header('Content-Type: application/json');
include 'db_connection.php';

$itemId = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($itemId === 0) {
    http_response_code(400);
    echo json_encode(['error' => 'ID do item não fornecido ou inválido.']);
    exit();
}

try {
    $sql = "
        SELECT 
            i.*,
            pd.produto AS produto_nome,
            ds.descricao AS descricao_nome,
            es.espessura AS espessura_nome,
            ac.acabamento AS acabamento_nome
        FROM 
            itens i
        LEFT JOIN 
            item_produto pd ON i.produto = pd.id_produto
        LEFT JOIN
            item_descricao ds ON i.descricao = ds.id_descricao
        LEFT JOIN
            item_espessura es ON i.espessura = es.id_espessura
        LEFT JOIN
            item_acabamento ac ON i.acabamento = ac.id_acabamento
        WHERE 
            i.id_item = ?
        LIMIT 1
    ";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$itemId]);
    $item = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$item) {
        http_response_code(404);
        echo json_encode(['error' => 'Item não encontrado.']);
        exit();
    }

    echo json_encode($item);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro no servidor (PDOException): ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro inesperado no servidor: ' . $e->getMessage()]);
}
?>
