<?php
// backend/get_agendamentos_by_date.php
// Este script busca agendamentos para uma data específica ou todos os agendamentos.

header('Content-Type: application/json');

// Inclui o arquivo de conexão com o banco de dados.
include 'db_connection.php';

// Obtém a data da requisição. Se não fornecida, usa a data atual.
$date = isset($_GET['date']) ? $_GET['date'] : date('Y-m-d');
// Novo: Verifica se a requisição é para mostrar todos os agendamentos
$showAll = isset($_GET['show_all']) && $_GET['show_all'] === 'true';

if (!$showAll && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
    http_response_code(400);
    echo json_encode(['error' => 'Formato de data inválido. Use YYYY-MM-DD.']);
    exit();
}

try {
    $agendamentos = [];

    $sql = "
        SELECT 
            a.id_agendamento,
            a.data_agendamento,
            ah.hora AS hora_agendamento_nome,
            ao.ordem AS ordem_nome,
            f.nome AS responsavel_nome, 
            a.instrucao,
            a.status_agendamento,
            p.id_pedido,
            p.titulo AS pedido_titulo,
            c.nome AS cliente_nome_pedido
        FROM 
            agendamento a
        LEFT JOIN
            agendamento_hora ah ON a.hora_agendamento = ah.id_aghora
        LEFT JOIN
            agendamento_ordem ao ON a.ordem = ao.id_ordem
        LEFT JOIN
            orc_funcionarios AS f ON a.responsavel = f.id_funcionario 
        LEFT JOIN
            pedidos p ON a.id_pedido = p.id_pedido
        LEFT JOIN
            clientes c ON p.id_cliente = c.id_cliente
    ";
    
    $params = [];
    if (!$showAll) {
        $sql .= " WHERE a.data_agendamento = ?";
        $params[] = $date;
    }

    $sql .= " ORDER BY a.data_agendamento DESC, ah.hora ASC"; // Ordena por data decrescente e hora crescente
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $agendamentos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($agendamentos);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro no servidor (PDOException): ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro inesperado no servidor: ' . $e->getMessage()]);
}
