<?php
// ATENÇÃO: As linhas abaixo (ini_set e error_reporting) são para DEBUG SOMENTE.
// REMOVA-AS IMEDIATAMENTE APÓS DIAGNOSTICAR O PROBLEMA EM AMBIENTE DE PRODUÇÃO!
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// FIM DAS LINHAS DE DEBUG

session_start(); // Inicia a sessão

header('Content-Type: application/json');

// Inclui o arquivo de conexão com o banco de dados.
include 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    $username = isset($data['username']) ? $data['username'] : '';
    $password = isset($data['password']) ? $data['password'] : '';

    if (empty($username) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Por favor, preencha todos os campos.']);
        exit();
    }

    try {
        // Consulta para buscar o usuário pelo nome de usuário
        $sql = "SELECT id, usuario, senha, nivel FROM login WHERE usuario = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        // Verifica a senha se o usuário foi encontrado
        // A função password_verify() requer PHP >= 5.5
        if ($user) {
            if (function_exists('password_verify')) { // Verifica se a função existe
                if (password_verify($password, $user['senha'])) {
                    // Senha correta, define as variáveis de sessão
                    $_SESSION['loggedin'] = true;
                    $_SESSION['user_id'] = $user['id'];
                    $_SESSION['username'] = $user['usuario'];
                    $_SESSION['nivel'] = $user['nivel'];

                    echo json_encode(['success' => true, 'message' => 'Login realizado com sucesso!']);
                } else {
                    // Senha inválida
                    echo json_encode(['success' => false, 'message' => 'Usuário ou senha inválidos.']);
                }
            } else {
                // Fallback para versões mais antigas do PHP sem password_verify
                // ATENÇÃO: Esta é uma solução MENOS SEGURA para compatibilidade.
                // Idealmente, atualize o PHP do servidor.
                if (md5($password) === $user['senha']) { // Exemplo: se suas senhas estão armazenadas como MD5
                    $_SESSION['loggedin'] = true;
                    $_SESSION['user_id'] = $user['id'];
                    $_SESSION['username'] = $user['usuario'];
                    $_SESSION['nivel'] = $user['nivel'];
                    echo json_encode(['success' => true, 'message' => 'Login realizado com sucesso (via MD5 fallback)!']);
                } else {
                    echo json_encode(['success' => false, 'message' => 'Usuário ou senha inválidos (PHP antigo).']);
                }
            }
        } else {
            // Usuário não encontrado
            echo json_encode(['success' => false, 'message' => 'Usuário ou senha inválidos.']);
        }

    } catch (Exception $e) { // Captura qualquer tipo de exceção
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Erro no servidor: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método de requisição não permitido.']);
}
?>
