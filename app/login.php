<?php
// Inicia a sessão para poder verificar mensagens de erro ou sucesso de redirecionamento
session_start();

// Verifica se há alguma mensagem de erro ou sucesso para exibir
$message = '';
if (isset($_SESSION['login_message'])) {
    $message = $_SESSION['login_message'];
    unset($_SESSION['login_message']); // Limpa a mensagem após exibir
}
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Competidora Adm</title>
    
    <!-- Tailwind CSS via CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Google Fonts: Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Custom Styles -->
    <link rel="stylesheet" href="backend/style.css">

    <style>
        /* Estilos específicos para a página de login */
        .login-container {
            max-width: 400px;
            margin: 80px auto;
        }
        input[type="text"],
        input[type="password"] {
            background-color: #374151; /* gray-700 */
            border: 1px solid #4B5563; /* gray-600 */
            color: #E5E7EB; /* text-gray-200 */
            padding: 0.75rem;
            border-radius: 0.5rem;
            width: 100%;
        }
        input[type="text"]:focus,
        input[type="password"]:focus {
            outline: none;
            border-color: #3B82F6; /* blue-500 */
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
        }
    </style>
</head>
<body class="text-gray-200 bg-gray-900 flex items-center justify-center min-h-screen">

    <div class="login-container bg-gray-800 p-8 rounded-lg shadow-xl">
        <h2 class="text-2xl font-bold text-white text-center mb-6">Login - Competidora Adm</h2>

        <?php if ($message): ?>
            <div class="py-3 px-4 rounded-lg text-center mb-4 
            <?php echo strpos($message, 'sucesso') !== false ? 'bg-green-800 text-white' : 'bg-red-800 text-white'; ?>">
                <?php echo $message; ?>
            </div>
        <?php endif; ?>

        <form id="loginForm">
            <div class="mb-4">
                <label for="username" class="block text-gray-400 text-sm font-bold mb-2">Usuário:</label>
                <input type="text" id="username" name="username" required>
            </div>
            <div class="mb-6">
                <label for="password" class="block text-gray-400 text-sm font-bold mb-2">Senha:</label>
                <input type="password" id="password" name="password" required>
            </div>
            <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
                Entrar
            </button>
        </form>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const loginForm = document.getElementById('loginForm');
            const messageDiv = document.querySelector('.login-container > div:first-of-type'); // Div de mensagem

            loginForm.addEventListener('submit', async (event) => {
                event.preventDefault();

                // Limpa mensagens anteriores
                if (messageDiv) {
                    messageDiv.style.display = 'none';
                }

                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;

                try {
                    const response = await fetch('backend/autenticar_login.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ username, password })
                    });

                    const result = await response.json();

                    if (result.success) {
                        // Redireciona para a página principal (clientes.php) após o login
                        window.location.href = 'clientes.php';
                    } else {
                        // Exibe mensagem de erro
                        const msgClass = 'py-3 px-4 rounded-lg text-center bg-red-800 text-white block mb-4';
                        if (messageDiv) {
                            messageDiv.textContent = result.message;
                            messageDiv.className = msgClass;
                            messageDiv.style.display = 'block';
                        } else {
                            // Se a div de mensagem não existir, cria uma (para fallback)
                            const newDiv = document.createElement('div');
                            newDiv.textContent = result.message;
                            newDiv.className = msgClass;
                            loginForm.insertBefore(newDiv, loginForm.firstChild);
                        }
                    }
                } catch (error) {
                    console.error('Erro ao tentar login:', error);
                    const msgClass = 'py-3 px-4 rounded-lg text-center bg-red-800 text-white block mb-4';
                    if (messageDiv) {
                        messageDiv.textContent = 'Erro de conexão ou servidor.';
                        messageDiv.className = msgClass;
                        messageDiv.style.display = 'block';
                    } else {
                        const newDiv = document.createElement('div');
                        newDiv.textContent = 'Erro de conexão ou servidor.';
                        newDiv.className = msgClass;
                        loginForm.insertBefore(newDiv, loginForm.firstChild);
                    }
                }
            });
        });
    </script>

</body>
</html>
