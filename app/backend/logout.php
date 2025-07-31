<?php
session_start(); // Inicia a sessão

// Destrói todas as variáveis de sessão
$_SESSION = array();

// Se a sessão for usada em cookies, também destrói o cookie de sessão.
// Nota: Isso irá invalidar a sessão, não apenas os dados da sessão!
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// Finalmente, destrói a sessão.
session_destroy();

// Define uma mensagem para ser exibida na página de login
$_SESSION['login_message'] = 'Você foi desconectado com sucesso.';
$_SESSION['message_type'] = 'success'; // Adiciona um tipo para a mensagem

// Redireciona para a página de login. O caminho `../login.php` significa:
// sair da pasta 'backend' (..) e ir para 'login.php' na pasta 'app'.
header('Location: ../login.php'); 
exit();
?>
