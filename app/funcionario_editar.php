<?php
// editar_funcionario.php
// Página para edição de um funcionário existente.
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editar Funcionário - Competidora Adm</title>
    
    <!-- Tailwind CSS via CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Google Fonts: Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Custom Styles -->
    <link rel="stylesheet" href="backend/style.css">
    <style>
        .form-section-title {
            font-size: 1.125rem; /* text-lg */
            font-weight: 600; /* font-semibold */
            color: #E5E7EB; /* text-gray-200 */
            margin-top: 1.5rem;
            margin-bottom: 1rem;
            border-bottom: 1px solid #4B5563; /* gray-600 */
            padding-bottom: 0.5rem;
        }
        .form-section-title:first-of-type {
            margin-top: 0;
        }
    </style>

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
                    <h1 id="editFuncionarioNameHeader" class="text-2xl sm:text-3xl font-bold text-white">Editar Funcionário</h1>
                    <p class="text-gray-400 mt-1">Atualize as informações do funcionário.</p>
                </div>

                <!-- Employee Edit Form -->
                <form id="editFuncionarioForm" class="mt-6">
                    <input type="hidden" id="id_funcionario" name="id_funcionario">

                    <div id="loading" class="text-center py-10">
                        <p class="text-gray-400">Carregando dados para edição...</p>
                    </div>
                    <div id="message" class="py-3 px-4 rounded-lg text-center hidden mb-4"></div>

                    <div id="formContent" class="hidden">
                        
                        <!-- Dados Pessoais -->
                        <h2 class="form-section-title">Dados Pessoais</h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="form-group">
                                <label for="nome">Nome:</label>
                                <input type="text" id="nome" name="nome">
                            </div>
                            <div class="form-group">
                                <label for="sobrenome">Sobrenome:</label>
                                <input type="text" id="sobrenome" name="sobrenome">
                            </div>
                            <div class="form-group">
                                <label for="data_nascimento">Data de Nascimento:</label>
                                <input type="date" id="data_nascimento" name="data_nascimento">
                            </div>
                            <div class="form-group">
                                <label for="telefone">Telefone:</label>
                                <input type="text" id="telefone" name="telefone">
                            </div>
                            <div class="form-group">
                                <label for="endereco">Endereço:</label>
                                <input type="text" id="endereco" name="endereco">
                            </div>
                            <div class="form-group">
                                <label for="bairro">Bairro:</label>
                                <input type="text" id="bairro" name="bairro">
                            </div>
                        </div>

                        <!-- Documentos -->
                        <h2 class="form-section-title">Documentos</h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="form-group">
                                <label for="cpf">CPF:</label>
                                <input type="text" id="cpf" name="cpf">
                            </div>
                            <div class="form-group">
                                <label for="rg">RG:</label>
                                <input type="text" id="rg" name="rg">
                            </div>
                            <div class="form-group">
                                <label for="cat">CAT (CNH):</label>
                                <input type="text" id="cat" name="cat">
                            </div>
                            <div class="form-group">
                                <label for="pis">PIS:</label>
                                <input type="text" id="pis" name="pis">
                            </div>
                        </div>

                        <!-- Informações do Cargo -->
                        <h2 class="form-section-title">Informações do Cargo</h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="form-group">
                                <label for="cargo">Cargo:</label>
                                <input type="text" id="cargo" name="cargo">
                            </div>
                            <div class="form-group">
                                <label for="salario">Salário (R$):</label>
                                <input type="text" id="salario" name="salario" placeholder="Ex: 1500.50">
                            </div>
                            <div class="form-group">
                                <label for="data_admissao">Data de Admissão:</label>
                                <input type="date" id="data_admissao" name="data_admissao">
                            </div>
                            <div class="form-group">
                                <label for="data_saida">Data de Saída:</label>
                                <input type="date" id="data_saida" name="data_saida">
                            </div>
                            <div class="form-group md:col-span-2">
                                <label for="observacoes">Observações:</label>
                                <textarea id="observacoes" name="observacoes" rows="3"></textarea>
                            </div>
                        </div>

                        <!-- Login e Acesso -->
                        <h2 class="form-section-title">Login e Acesso</h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="form-group">
                                <label for="login">Login:</label>
                                <input type="text" id="login" name="login">
                            </div>
                            <div class="form-group">
                                <label for="senha">Nova Senha:</label>
                                <input type="password" id="senha" name="senha" placeholder="Preencha apenas para alterar">
                            </div>
                             <div class="form-group">
                                <label for="acesso">Nível de Acesso:</label>
                                <input type="number" id="acesso" name="acesso" placeholder="Ex: 1, 2, etc.">
                            </div>
                            <div class="form-group">
                                <label for="status">Status:</label>
                                <select id="status" name="status" required>
                                    <option value="1">Ativo</option>
                                    <option value="0">Inativo</option>
                                </select>
                            </div>
                        </div>

                    </div>

                    <div id="formActions" class="hidden flex justify-end gap-4 mt-6">
                        <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
                            Salvar Alterações
                        </button>
                        <a id="cancelButton" href="funcionarios.php" class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
                            Cancelar
                        </a>
                    </div>
                </form>

            </div>
        </main>

    </div>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const form = document.getElementById('editFuncionarioForm');
            const messageDiv = document.getElementById('message');
            const loadingDiv = document.getElementById('loading');
            const formContentDiv = document.getElementById('formContent');
            const formActionsDiv = document.getElementById('formActions');
            const headerTitle = document.getElementById('editFuncionarioNameHeader');
            const cancelButton = document.getElementById('cancelButton');
            
            const populateForm = (funcionario) => {
                if (funcionario) {
                    // Preenche todos os campos do formulário
                    document.getElementById('id_funcionario').value = funcionario.id_funcionario || '';
                    document.getElementById('nome').value = funcionario.nome || '';
                    document.getElementById('sobrenome').value = funcionario.sobrenome || '';
                    document.getElementById('data_nascimento').value = funcionario.data_nascimento || '';
                    document.getElementById('telefone').value = funcionario.telefone || '';
                    document.getElementById('endereco').value = funcionario.endereco || '';
                    document.getElementById('bairro').value = funcionario.bairro || '';
                    document.getElementById('cpf').value = funcionario.cpf || '';
                    document.getElementById('rg').value = funcionario.rg || '';
                    document.getElementById('cat').value = funcionario.cat || '';
                    document.getElementById('pis').value = funcionario.pis || '';
                    document.getElementById('cargo').value = funcionario.cargo || '';
                    document.getElementById('data_admissao').value = funcionario.data_admissao || '';
                    document.getElementById('data_saida').value = funcionario.data_saida || '';
                    document.getElementById('salario').value = funcionario.salario || '';
                    document.getElementById('observacoes').value = funcionario.observacoes || '';
                    document.getElementById('login').value = funcionario.login || ''; // Adicionado campo login
                    document.getElementById('acesso').value = funcionario.acesso || '';
                    document.getElementById('status').value = funcionario.status;
                    
                    headerTitle.textContent = `Editar: ${funcionario.nome || 'Funcionário'}`;
                    cancelButton.href = `detalhes_funcionario.php?id=${funcionario.id_funcionario}`;

                    loadingDiv.style.display = 'none';
                    formContentDiv.classList.remove('hidden');
                    formActionsDiv.classList.remove('hidden');
                } else {
                    headerTitle.textContent = 'Funcionário Não Encontrado';
                    messageDiv.textContent = 'Nenhum funcionário encontrado com o ID fornecido.';
                    messageDiv.className = 'py-3 px-4 rounded-lg text-center bg-yellow-800 text-white block mb-4';
                    loadingDiv.style.display = 'none';
                }
            };

            const getFuncionarioIdFromUrl = () => {
                const params = new URLSearchParams(window.location.search);
                return params.get('id');
            };
            
            const funcionarioId = getFuncionarioIdFromUrl();

            if (!funcionarioId) {
                headerTitle.textContent = 'Erro: ID do Funcionário Ausente';
                loadingDiv.style.display = 'none';
                messageDiv.textContent = 'Por favor, forneça um ID de funcionário válido na URL.';
                messageDiv.className = 'py-3 px-4 rounded-lg text-center bg-red-800 text-white block mb-4';
            } else {
                fetch(`backend/funcionarios/get_funcionario_by_id.php?id=${encodeURIComponent(funcionarioId)}`)
                    .then(response => {
                        if (!response.ok) throw new Error('Falha ao carregar dados do funcionário.');
                        return response.json();
                    })
                    .then(data => {
                        populateForm(data.funcionario); 
                    })
                    .catch(error => {
                        console.error('Erro ao carregar dados do funcionário:', error);
                        loadingDiv.style.display = 'none';
                        messageDiv.textContent = 'Erro ao carregar os dados do funcionário.';
                        messageDiv.className = 'py-3 px-4 rounded-lg text-center bg-red-800 text-white block mb-4';
                    });
            }

            form.addEventListener('submit', async (event) => {
                event.preventDefault(); 
                messageDiv.style.display = 'none'; 

                const formData = new FormData(form);
                const funcionarioData = Object.fromEntries(formData.entries());

                try {
                    const response = await fetch('backend/funcionarios/update_funcionario.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(funcionarioData)
                    });

                    const result = await response.json();

                    if (result.success) {
                        messageDiv.textContent = result.message;
                        messageDiv.className = 'py-3 px-4 rounded-lg text-center bg-green-800 text-white block mb-4';
                        setTimeout(() => { 
                            window.location.href = `detalhes_funcionario.php?id=${funcionarioData.id_funcionario}`; 
                        }, 1000); 
                    } else {
                        messageDiv.textContent = result.message || 'Erro ao salvar alterações.';
                        messageDiv.className = 'py-3 px-4 rounded-lg text-center bg-red-800 text-white block mb-4';
                    }
                } catch (error) {
                    console.error('Erro ao enviar formulário:', error);
                    messageDiv.textContent = 'Ocorreu um erro ao tentar salvar as alterações.';
                    messageDiv.className = 'py-3 px-4 rounded-lg text-center bg-red-800 text-white block mb-4';
                }
            });
        });
    </script>

</body>
</html>
