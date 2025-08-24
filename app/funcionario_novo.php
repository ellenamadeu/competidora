<?php
// novo_funcionario.php
// Página para adicionar um novo funcionário.
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Novo Funcionário - Competidora Adm</title>
    
    <!-- Tailwind CSS via CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Google Fonts: Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Custom Styles -->
    <link rel="stylesheet" href="backend/style.css">

</head>
<body class="text-gray-200">

    <!-- Main Application Container -->
    <div class="min-h-screen">

        <!-- Header/Navbar -->
        <?php include 'header.php'; ?>

        <!-- Main Content Area -->
        <main class="main-container main-container-small mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="bg-gray-800 p-6 sm:p-8 rounded-lg shadow-xl">
                
                <!-- Block Title -->
                <div class="border-b border-gray-700 pb-4 mb-6">
                    <h1 class="text-2xl sm:text-3xl font-bold text-white">Novo Funcionário</h1>
                    <p class="text-gray-400 mt-1">Preencha os dados para adicionar um novo funcionário.</p>
                </div>

                <!-- New Employee Form -->
                <form id="newFuncionarioForm" class="mt-6">
                    <div id="message" class="py-3 px-4 rounded-lg text-center hidden mb-4"></div>

                    <div class="grid grid-cols-1 gap-4">
                        <div class="form-group">
                            <label for="nome">Nome:</label>
                            <input type="text" id="nome" name="nome" required>
                        </div>
                        <div class="form-group">
                            <label for="status">Status:</label>
                            <select id="status" name="status" required>
                                <option value="1" selected>Ativo</option>
                                <option value="0">Inativo</option>
                            </select>
                        </div>
                    </div>

                    <div class="flex justify-end gap-4 mt-6">
                        <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
                            Adicionar Funcionário
                        </button>
                        <a href="funcionarios.php" class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
                            Cancelar
                        </a>
                    </div>
                </form>

            </div>
        </main>

    </div>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const form = document.getElementById('newFuncionarioForm');
            const messageDiv = document.getElementById('message');

            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                messageDiv.style.display = 'none';

                const formData = new FormData(form);
                const funcionarioData = {
                    nome: formData.get('nome'),
                    status: formData.get('status')
                };

                try {
                    const response = await fetch('backend/funcionarios/adicionar_funcionario.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(funcionarioData)
                    });

                    const result = await response.json();

                    if (result.success) {
                        messageDiv.textContent = result.message;
                        messageDiv.className = 'py-3 px-4 rounded-lg text-center bg-green-800 text-white block mb-4';
                        form.reset();
                        
                        // Redireciona para a página de detalhes do novo funcionário
                        if (result.id_funcionario) {
                            setTimeout(() => { 
                                window.location.href = `detalhes_funcionario.php?id=${result.id_funcionario}`; 
                            }, 1000);
                        } else {
                            setTimeout(() => { window.location.href = `funcionarios.php`; }, 1000);
                        }
                    } else {
                        messageDiv.textContent = result.message || result.error || 'Erro ao adicionar funcionário.';
                        messageDiv.className = 'py-3 px-4 rounded-lg text-center bg-red-800 text-white block mb-4';
                    }
                } catch (error) {
                    console.error('Erro ao enviar formulário:', error);
                    messageDiv.textContent = 'Ocorreu um erro ao tentar adicionar o funcionário.';
                    messageDiv.className = 'py-3 px-4 rounded-lg text-center bg-red-800 text-white block mb-4';
                }
            });
        });
    </script>

</body>
</html>
