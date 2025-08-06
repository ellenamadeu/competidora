<?php
// backend/db_connection.php
// Este arquivo contém a configuração da conexão com o banco de dados.

// Credenciais para o servidor local (XAMPP/WAMP/MAMP)
$servername = "10.132.36.4"; // Endereço do servidor local
$username = "competid4c3793e0_loja";          // Usuário do MySQL local
$password = "Eao@031626";              // Senha do MySQL local (vazia)
$dbname = "competid4c3793e0_competidor1_1"; // Nome do banco de dados local

try {
    // Cria uma nova conexão PDO.
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8", $username, $password);
    
    // Configura o PDO para lançar exceções em caso de erro.
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

} catch (PDOException $e) {
    // Em caso de erro na conexão, retorna uma mensagem em JSON e encerra o script.
    http_response_code(500); // Internal Server Error
    
    // Mensagem de erro para a conexão
    echo json_encode(['error' => 'Erro na conexão com o banco de dados: ' . $e->getMessage()]);
    
    exit(); // Encerra o script para evitar que o restante do código seja executado sem conexão.
}
?>
