<?php
// backend/get_agendamentos_by_date.php
// Este script busca agendamentos com filtros de data, responsável, OS e status.
// ATUALIZADO: Adicionado o id_ordem para o frontend poder mapear os ícones.

header('Content-Type: application/json');
include 'db_connection.php';

// --- Obtenção dos Parâmetros de Filtro ---
$date = isset($_GET['date']) ? $_GET['date'] : date('Y-m-d');
$showAll = isset($_GET['show_all']) && $_GET['show_all'] === 'true';
$responsibleId = isset($_GET['responsavel_id']) ? (int)$_GET['responsavel_id'] : 0;
$osId = isset($_GET['os_id']) ? (int)$_GET['os_id'] : 0;
$statusFilter = isset($_GET['status']) ? $_GET['status'] : 'all'; // 'all', 'completed', 'pending'

if (!$showAll && !empty($date) && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
    http_response_code(400);
    echo json_encode(['error' => 'Formato de data inválido. Use YYYY-MM-DD.']);
    exit();
}

try {
    // --- Construção da Query Dinâmica ---
    $sql = "
        SELECT 
            a.id_agendamento, a.data_agendamento, ah.hora AS hora_agendamento_nome,
            ao.id_ordem, ao.ordem AS ordem_nome, f.nome AS responsavel_nome, a.instrucao,
            a.status_agendamento, p.id_pedido, p.titulo AS pedido_titulo,
            c.nome AS cliente_nome_pedido, c.bairro AS cliente_bairro
        FROM agendamento a
        LEFT JOIN agendamento_hora ah ON a.hora_agendamento = ah.id_aghora
        LEFT JOIN agendamento_ordem ao ON a.ordem = ao.id_ordem
        LEFT JOIN orc_funcionarios AS f ON a.responsavel = f.id_funcionario 
        LEFT JOIN pedidos p ON a.id_pedido = p.id_pedido
        LEFT JOIN clientes c ON p.id_cliente = c.id_cliente
    ";

    $whereConditions = [];
    $params = [];

    // Adiciona filtro de data se não for para mostrar todos
    if (!$showAll && !empty($date)) {
        $whereConditions[] = "a.data_agendamento = ?";
        $params[] = $date;
    }
    
    // Adiciona filtro de responsável
    if ($responsibleId > 0) {
        $whereConditions[] = "a.responsavel = ?";
        $params[] = $responsibleId;
    }

    // Adiciona filtro de OS
    if ($osId > 0) {
        $whereConditions[] = "a.ordem = ?";
        $params[] = $osId;
    }

    // Adiciona filtro de status
    if ($statusFilter === 'completed') {
        $whereConditions[] = "a.status_agendamento = 1";
    } elseif ($statusFilter === 'pending') {
        $whereConditions[] = "a.status_agendamento = 0";
    }

    // Monta a cláusula WHERE se houver condições
    if (!empty($whereConditions)) {
        $sql .= " WHERE " . implode(" AND ", $whereConditions);
    }

    // Adiciona a ordenação
    $sql .= " ORDER BY a.data_agendamento DESC, f.nome ASC, ah.id_aghora ASC"; 
    
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
