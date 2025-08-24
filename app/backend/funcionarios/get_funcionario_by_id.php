<?php
// Define o cabeçalho da resposta como JSON.
header('Content-Type: application/json');

// Inclui o arquivo de conexão com o banco de dados.
include '../db_connection.php';

// Obtenção do ID do funcionário da URL.
$funcionarioId = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($funcionarioId === 0) {
    http_response_code(400);
    echo json_encode(['error' => 'ID do funcionário não fornecido ou inválido.']);
    exit();
}

try {
    $response = [];

    // --- 1. Dados Principais do Funcionário ---
    $sqlFuncionario = "
        SELECT 
            id_funcionario, 
            nome, 
            sobrenome,
            data_nascimento,
            telefone1 AS telefone,
            telefone2,
            telefone3,
            endereco,
            bairro,
            cpf,
            rg,
            cat,
            pis,
            filhos,
            funcao AS cargo,
            data_entrada AS data_admissao,
            data_saida,
            salario,
            salario_beneficios,
            observacoes,
            login, -- Adicionado campo login
            acesso,
            status
        FROM 
            orc_funcionarios 
        WHERE 
            id_funcionario = ?
        LIMIT 1
    ";
    $stmtFuncionario = $pdo->prepare($sqlFuncionario);
    $stmtFuncionario->execute([$funcionarioId]);
    $response['funcionario'] = $stmtFuncionario->fetch(PDO::FETCH_ASSOC);

    if (!$response['funcionario']) {
        http_response_code(404);
        echo json_encode(['error' => 'Funcionário não encontrado.']);
        exit();
    }

    // --- 2. Agendamentos Relacionados (Extra) ---
    $sqlAgendamentos = "
        SELECT 
            a.id_agendamento,
            a.data_agendamento,
            p.id_pedido,
            p.titulo AS pedido_titulo,
            c.nome AS cliente_nome
        FROM 
            agendamento a
        LEFT JOIN
            pedidos p ON a.id_pedido = p.id_pedido
        LEFT JOIN
            clientes c ON p.id_cliente = c.id_cliente
        WHERE 
            a.responsavel = ? AND a.data_agendamento >= CURDATE()
        ORDER BY 
            a.data_agendamento ASC
    ";
    $stmtAgendamentos = $pdo->prepare($sqlAgendamentos);
    $stmtAgendamentos->execute([$funcionarioId]);
    $response['agendamentos'] = $stmtAgendamentos->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($response);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro no servidor ao consultar o banco de dados.', 'details' => $e->getMessage()]);
}
?>
