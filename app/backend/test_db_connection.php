<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// ... restante do código


// backend/test_db_connection.php
// Script para testar a conexão com o banco de dados.

header('Content-Type: text/html; charset=utf-8'); // Define o cabeçalho para HTML com UTF-8

echo "<!DOCTYPE html>
<html lang='pt-br'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Teste de Conexão com o Banco de Dados</title>
    <script src='https://cdn.tailwindcss.com'></script>
    <link rel='stylesheet' href='style.css'>
</head>
<body class='text-gray-200 bg-gray-900 flex items-center justify-center min-h-screen'>
    <div class='main-container main-container-small bg-gray-800 p-8 rounded-lg shadow-xl text-center'>
        <h2 class='text-2xl font-bold text-white mb-4'>Status da Conexão com o Banco de Dados</h2>";

// Inclui o arquivo de conexão com o banco de dados.
// NOTA: O db_connection.php irá automaticamente exibir um erro JSON e sair
// se a conexão falhar. Para este teste, vamos tentar capturar isso de forma mais amigável.
ob_start(); // Inicia o buffer de saída
include 'db_connection.php'; // Tenta incluir e conectar
$output = ob_get_clean(); // Captura a saída (se houver)

if (strpos($output, '"error":') !== false) {
    // Se db_connection.php retornou um erro JSON, exibe-o de forma amigável.
    $error_data = json_decode($output, true);
    echo "<p class='text-red-400'>❌ ERRO DE CONEXÃO:</p>";
    echo "<p class='text-red-400 font-mono'>Detalhes: " . htmlspecialchars($error_data['error']) . "</p>";
} else {
    // Se chegou até aqui sem um erro de saída de db_connection.php, assume sucesso.
    // A variável $pdo estará disponível se a conexão foi bem-sucedida.
    if (isset($pdo) && $pdo instanceof PDO) {
        echo "<p class='text-green-400'>✅ Conexão com o banco de dados estabelecida com sucesso!</p>";
        echo "<p class='text-gray-400 mt-2'>Isso significa que suas credenciais e host estão corretos.</p>";
    } else {
        // Caso inesperado onde não houve erro na saída, mas $pdo não está definido
        echo "<p class='text-yellow-400'>⚠️ Status de conexão indefinido. Pode haver um erro silencioso ou configuração incorreta.</p>";
    }
}

echo "<p class='mt-6'><a href='../login.php' class='bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out'>Voltar para o Login</a></p>
    </div>
</body>
</html>";
?>
