<?php
// backend/update_cliente.php
// Este script atualiza um cliente existente.

header('Content-Type: application/json');

// Inclui o arquivo de conexão com o banco de dados.
include 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    // Obtenção dos dados. Usando o operador ?? para definir null se o campo não estiver presente.
    $clientId = $data['id_cliente'] ?? null;
    $nome = $data['nome'] ?? null; // Nome é obrigatório para atualização
    $contato = $data['contato'] ?? null;
    $email = $data['email'] ?? null;
    $ddd = $data['ddd'] ?? null;
    $telefone = $data['telefone'] ?? null;
    $telefone2 = $data['telefone2'] ?? null;
    $telefone3 = $data['telefone3'] ?? null; // Incluído telefone3
    $endereco = $data['endereco'] ?? null;
    $bairro = $data['bairro'] ?? null;
    $referencias = $data['referencias'] ?? null;
    $cep = $data['cep'] ?? null;
    $documento = $data['documento'] ?? null;
    $observacoes = $data['observacoes'] ?? null;

    // Validação: id_cliente é sempre obrigatório para UPDATE, e nome também.
    if (empty($clientId) || empty($nome)) {
        http_response_code(400); // Bad Request
        echo json_encode(['success' => false, 'message' => 'ID do cliente e Nome são obrigatórios para atualização.']);
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

        $sqlUpdate = "
            UPDATE clientes 
            SET 
                nome = ?, 
                contato = ?, 
                email = ?, 
                ddd = ?, 
                telefone = ?, 
                telefone2 = ?, 
                telefone3 = ?,
                endereco = ?, 
                bairro = ?, 
                referencias = ?, 
                cep = ?, 
                documento = ?, 
                observacoes = ?
            WHERE 
                id_cliente = ?
        ";
        
        $stmtUpdate = $pdo->prepare($sqlUpdate);
        $stmtUpdate->execute([
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
            $observacoes,
            $clientId
        ]);

        if ($stmtUpdate->rowCount() > 0) {
            echo json_encode(['success' => true, 'message' => 'Cliente atualizado com sucesso!']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Nenhum cliente encontrado ou nenhum dado alterado.']);
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
