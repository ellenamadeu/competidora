<?php
// Define o cabeçalho da resposta como JSON.
header('Content-Type: application/json');

// Inclui o arquivo de conexão com o banco de dados.
include '../db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    // Obtenção de todos os dados do formulário
    $id_funcionario = $data['id_funcionario'] ?? null;
    $nome = $data['nome'] ?? null;
    $sobrenome = $data['sobrenome'] ?? null;
    $data_nascimento = !empty($data['data_nascimento']) ? $data['data_nascimento'] : null;
    $telefone = $data['telefone'] ?? null;
    $telefone2 = $data['telefone2'] ?? null;
    $telefone3 = $data['telefone3'] ?? null;
    $endereco = $data['endereco'] ?? null;
    $bairro = $data['bairro'] ?? null;
    $cpf = $data['cpf'] ?? null;
    $rg = $data['rg'] ?? null;
    $cat = $data['cat'] ?? null;
    $pis = $data['pis'] ?? null;
    $cargo = $data['cargo'] ?? null;
    $data_admissao = !empty($data['data_admissao']) ? $data['data_admissao'] : null;
    $data_saida = !empty($data['data_saida']) ? $data['data_saida'] : null;
    $observacoes = $data['observacoes'] ?? null;
    $login = $data['login'] ?? null; // Adicionado campo login
    $senha = $data['senha'] ?? '';
    $status = isset($data['status']) ? (int)$data['status'] : null;

    // Trata campos numéricos que podem vir vazios ou com valor '0'
    $filhos = isset($data['filhos']) && $data['filhos'] !== '' ? (int)$data['filhos'] : null;
    $salario = isset($data['salario']) && $data['salario'] !== '' ? (float)$data['salario'] : null;
    $salario_beneficios = isset($data['salario_beneficios']) && $data['salario_beneficios'] !== '' ? (float)$data['salario_beneficios'] : null;
    $acesso = isset($data['acesso']) && $data['acesso'] !== '' ? (int)$data['acesso'] : null;


    if (empty($id_funcionario) || empty($nome) || is_null($status)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'ID, Nome e Status do funcionário são obrigatórios.']);
        exit();
    }

    try {
        $sql = "
            UPDATE orc_funcionarios 
            SET 
                nome = ?, sobrenome = ?, data_nascimento = ?, telefone1 = ?, telefone2 = ?, telefone3 = ?,
                endereco = ?, bairro = ?, cpf = ?, rg = ?, cat = ?, pis = ?, filhos = ?,
                funcao = ?, data_entrada = ?, data_saida = ?, salario = ?, salario_beneficios = ?,
                observacoes = ?, login = ?, acesso = ?, status = ?
        ";
        
        $params = [
            $nome, $sobrenome, $data_nascimento, $telefone, $telefone2, $telefone3,
            $endereco, $bairro, $cpf, $rg, $cat, $pis, $filhos,
            $cargo, $data_admissao, $data_saida, $salario, $salario_beneficios,
            $observacoes, $login, $acesso, $status
        ];

        if (!empty($senha)) {
            $sql .= ", senha = ?";
            $params[] = md5($senha); 
        }

        $sql .= " WHERE id_funcionario = ?";
        $params[] = $id_funcionario;
        
        $stmtUpdate = $pdo->prepare($sql);
        $stmtUpdate->execute($params);

        echo json_encode(['success' => true, 'message' => 'Funcionário atualizado com sucesso!']);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Erro no servidor (PDOException): ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método de requisição não permitido. Use POST.']);
}
?>
