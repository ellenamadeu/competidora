<?php
// backend/adicionar_cliente.php
// Este script adiciona um novo cliente.

header('Content-Type: application/json');

// Inclui o arquivo de conexão com o banco de dados.
include '../db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    // Obtenção dos dados. Usando o operador ?? para definir null se o campo não estiver presente.
    $nome = $data['nome'] ?? null; // Apenas nome é obrigatório
    $contato = $data['contato'] ?? null;
    $email = $data['email'] ?? null;
    $ddd = $data['ddd'] ?? null;
    $telefone = $data['telefone'] ?? null;
    $telefone2 = $data['telefone2'] ?? null;
    $telefone3 = $data['telefone3'] ?? null; // Adicionado telefone3
    $endereco = $data['endereco'] ?? null;
    $bairro = $data['bairro'] ?? null;
    $referencias = $data['referencias'] ?? null;
    $cep = $data['cep'] ?? null;
    $documento = $data['documento'] ?? null;
    $observacoes = $data['observacoes'] ?? null;

    // Validação: Apenas 'nome' é obrigatório
    if (empty($nome)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'O campo Nome é obrigatório.']);
        exit();
    }

    try {
        // Converte strings vazias para NULL para campos que aceitam NULL no DB
        $contato = empty($contato) ? null : $contato;
        $email = empty($email) ? null : $email;
        $ddd = empty($ddd) ? null : $ddd;
        $telefone = empty($telefone) ? null : $telefone;
        $telefone2 = empty($telefone2) ? null : $telefone2;
        $telefone3 = empty($telefone3) ? null : $telefone3;
        $endereco = empty($endereco) ? null : $endereco;
        $bairro = empty($bairro) ? null : $bairro;
        $referencias = empty($referencias) ? null : $referencias;
        $cep = empty($cep) ? null : $cep;
        $documento = empty($documento) ? null : $documento;
        $observacoes = empty($observacoes) ? null : $observacoes;


        $sqlInsert = "
            INSERT INTO clientes (
                nome, contato, email, ddd, telefone, telefone2, telefone3, 
                endereco, bairro, referencias, cep, documento, observacoes
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
        ";
        
        $stmtInsert = $pdo->prepare($sqlInsert);
        $stmtInsert->execute([
            $nome, 
            $contato, 
            $email, 
            $ddd, 
            $telefone, 
            $telefone2, 
            $telefone3,
            $endereco, 
            $bairro, 
            $referencias, 
            $cep, 
            $documento, 
            $observacoes
        ]);

        if ($stmtInsert->rowCount() > 0) {
            echo json_encode(['success' => true, 'message' => 'Cliente adicionado com sucesso!', 'id_cliente' => $pdo->lastInsertId()]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Falha ao adicionar o cliente.']);
        }

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Erro no servidor (PDOException): ' . $e->getMessage()]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Erro inesperado no servidor: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método de requisição não permitido. Use POST.']);
}
?>
