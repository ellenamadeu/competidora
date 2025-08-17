<?php
// backend/get_funcionarios.php
// Este script busca a lista de funcionários ativos para preencher o dropdown.

header('Content-Type: application/json');

// Inclui o arquivo de conexão com o banco de dados.
include 'db_connection.php';

try {
    // Consulta para obter funcionários com status = 1 (ativos)
    $sql = "SELECT id_funcionario, nome FROM orc_funcionarios WHERE status = 1 ORDER BY nome ASC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $funcionarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($funcionarios);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro no servidor (PDOException): ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro inesperado no servidor: ' . $e->getMessage()]);
}
?>
