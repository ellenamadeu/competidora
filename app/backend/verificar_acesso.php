<?php
// backend/verificar_acesso.php
// Este script deve ser incluído no início de cada página protegida.

session_start(); // Inicia a sessão em cada página

// A variável $required_level deve ser definida ANTES de incluir este arquivo.
// Ex: define('REQUIRED_ACCESS_LEVEL', 1);

if (!defined('REQUIRED_ACCESS_LEVEL')) {
    // Caso o nível de acesso requerido não seja definido, impede o acesso por segurança
    $_SESSION['login_message'] = 'Erro de configuração de acesso para esta página.';
    // Redireciona para login.php (assumindo que login.php está no diretório raiz acima de backend/)
    header('Location: ../app/login.php'); // Caminho ajustado
    exit();
}

// Verifica se o usuário está logado
if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    $_SESSION['login_message'] = 'Você precisa estar logado para acessar esta página.';
    // Redireciona para login.php
    header('Location: ../app/login.php'); // Caminho ajustado
    exit();
}

// Verifica o nível de acesso do usuário
// Correção: Substituindo o operador ?? por isset() e operador ternário para compatibilidade com PHP mais antigo.
$user_level = isset($_SESSION['nivel']) ? $_SESSION['nivel'] : 0; 

// Compara o nível do usuário com o nível requerido
// Nível 2 tem acesso ao nível 1 e 2
// Nível 1 tem acesso ao nível 1
if ($user_level < REQUIRED_ACCESS_LEVEL) {
    $_SESSION['login_message'] = 'Você não tem permissão para acessar esta página (Nível de Acesso Requerido: ' . REQUIRED_ACCESS_LEVEL . ').';
    // Redireciona para login.php
    header('Location: ../app/login.php'); // Caminho ajustado
    exit();
}

// Se o script chegar até aqui, o usuário está logado e tem o nível de acesso adequado.
?>
