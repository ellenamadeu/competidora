<?php
// novo_cliente.php
// Página para adicionar um novo cliente.
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Novo Cliente - Competidora Adm</title>
    
    <!-- Tailwind CSS via CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Google Fonts: Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Custom Styles -->
    <link rel="stylesheet" href="backend/style.css">

    <style>
        /* Estilos específicos para o formulário de novo cliente */
        .modal-form-group {
            margin-bottom: 1rem;
        }
        .modal-form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: #9CA3AF;
        }
        .modal-form-group input[type="text"],
        .modal-form-group input[type="email"],
        .modal-form-group textarea {
            width: 100%;
            padding: 0.75rem;
            background-color: #374151;
            border: 1px solid #4B5563;
            border-radius: 0.5rem;
            color: #E5E7EB;
        }
        .modal-form-group textarea {
            min-height: 80px;
            resize: vertical;
        }
        .modal-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 1rem;
            margin-top: 1.5rem;
        }
        /* Estilos para o campo DDD */
        .phone-group {
            display: flex;
            gap: 0.5rem; /* Espaço entre DDD e Telefone */
            align-items: flex-end; /* Alinha a parte de baixo dos campos */
        }
        .phone-group input[name="ddd"] {
            width: 60px; /* Largura para 2 dígitos */
            flex-shrink: 0;
        }
        .phone-group input[name="telefone"] {
            flex-grow: 1;
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
                    <h1 class="text-2xl sm:text-3xl font-bold text-white">Novo Cliente</h1>
                    <p class="text-gray-400 mt-1">Preencha os dados para adicionar um novo cliente.</p>
                </div>

                <!-- New Client Form -->
                <form id="newClientForm" class="mt-6">
                    <div id="message" class="py-3 px-4 rounded-lg text-center hidden mb-4"></div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Coluna 1 -->
                        <div>
                            <div class="modal-form-group">
                                <label for="nome">Nome:</label>
                                <input type="text" id="nome" name="nome" class="w-full" required> <!-- Apenas Nome é obrigatório -->
                            </div>
                            <div class="modal-form-group">
                                <label for="contato">Contato:</label>
                                <input type="text" id="contato" name="contato" class="w-full">
                            </div>
                            <div class="modal-form-group">
                                <label for="telefone">Telefone 1:</label>
                                <div class="phone-group">
                                    <input type="text" id="ddd" name="ddd" placeholder="DDD" maxlength="2"> <!-- DDD sem label, menor -->
                                    <input type="text" id="telefone" name="telefone">
                                </div>
                            </div>
                            <div class="modal-form-group">
                                <label for="telefone2">Telefone 2:</label>
                                <input type="text" id="telefone2" name="telefone2" class="w-full">
                            </div>
                            <div class="modal-form-group">
                                <label for="telefone3">Telefone 3:</label>
                                <input type="text" id="telefone3" name="telefone3" class="w-full">
                            </div>
                        </div>

                        <!-- Coluna 2 -->
                        <div>
                            <div class="modal-form-group">
                                <label for="endereco">Endereço:</label>
                                <textarea id="endereco" name="endereco" class="w-full"></textarea>
                            </div>
                            <div class="modal-form-group">
                                <label for="bairro">Bairro:</label>
                                <input type="text" id="bairro" name="bairro" class="w-full">
                            </div>
                            <div class="modal-form-group">
                                <label for="cep">CEP:</label>
                                <input type="text" id="cep" name="cep" class="w-full">
                            </div>
                            <div class="modal-form-group">
                                <label for="email">Email:</label> <!-- Email movido para cá, após o CEP -->
                                <input type="email" id="email" name="email" class="w-full">
                            </div>
                            <div class="modal-form-group">
                                <label for="documento">Documento:</label>
                                <input type="text" id="documento" name="documento" class="w-full">
                            </div>
                            <div class="modal-form-group">
                                <label for="observacoes">Observações:</label>
                                <textarea id="observacoes" name="observacoes" class="w-full"></textarea>
                            </div>
                        </div>
                    </div>

                    <div class="modal-buttons">
                        <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
                            Adicionar Cliente
                        </button>
                        <a href="clientes.php" class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
                            Cancelar
                        </a>
                    </div>
                </form>

            </div>
        </main>

    </div>

    <!-- jQuery CDN (necessário para jquery.maskedinput) -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <!-- jQuery Masked Input Plugin CDN -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.maskedinput/1.4.1/jquery.maskedinput.min.js"></script>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const form = document.getElementById('newClientForm');
            const messageDiv = document.getElementById('message');
            const cepInput = document.getElementById('cep');
            const enderecoInput = document.getElementById('endereco');
            const bairroInput = document.getElementById('bairro');

            // Aplica a máscara ao campo CEP
            jQuery(function($){
               $("#cep").mask("99999-999");
            });

            // Função para buscar o CEP na ViaCEP
            const buscarCep = async (cep) => {
                // Limpa o CEP para garantir apenas números (a máscara já ajuda, mas é bom garantir)
                const cleanCep = cep.replace(/\D/g, '');

                if (cleanCep.length !== 8) {
                    return; // CEP inválido (não tem 8 dígitos)
                }

                try {
                    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
                    const data = await response.json();

                    if (!data.erro) { // Se não houver erro na resposta da ViaCEP
                        enderecoInput.value = data.logradouro || '';
                        bairroInput.value = data.bairro || '';
                    } else {
                        // CEP não encontrado
                        enderecoInput.value = '';
                        bairroInput.value = '';
                    }
                } catch (error) {
                    console.error('Erro ao buscar CEP:', error);
                    enderecoInput.value = '';
                    bairroInput.value = '';
                }
            };

            // Adiciona o event listener para o campo CEP
            cepInput.addEventListener('blur', (event) => { // 'blur' é quando o campo perde o foco
                buscarCep(event.target.value);
            });


            form.addEventListener('submit', async (event) => {
                event.preventDefault(); // Impede o recarregamento da página

                messageDiv.style.display = 'none'; // Esconde mensagens anteriores

                const formData = new FormData(form);
                const clientData = {};
                for (let [key, value] of formData.entries()) {
                    clientData[key] = value;
                }

                try {
                    const response = await fetch('backend/adicionar_cliente.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(clientData)
                    });

                    const result = await response.json();

                    if (result.success) {
                        messageDiv.textContent = result.message;
                        messageDiv.className = 'py-3 px-4 rounded-lg text-center bg-green-800 text-white block mb-4';
                        form.reset(); // Limpa o formulário após o sucesso
                        
                        // Redireciona para a página de detalhes do novo cliente
                        if (result.id_cliente) {
                            setTimeout(() => { 
                                window.location.href = `detalhes_cliente.php?id=${result.id_cliente}`; 
                            }, 500); // Redireciona após 0.5 segundo
                        } else {
                            // Se por algum motivo o id_cliente não for retornado, redireciona para a lista
                            setTimeout(() => { window.location.href = `clientes.php`; }, 500);
                        }
                    } else {
                        messageDiv.textContent = result.message || result.error || 'Erro ao adicionar cliente.';
                        messageDiv.className = 'py-3 px-4 rounded-lg text-center bg-red-800 text-white block mb-4';
                    }
                } catch (error) {
                    console.error('Erro ao enviar formulário:', error);
                    messageDiv.textContent = 'Ocorreu um erro ao tentar adicionar o cliente.';
                    messageDiv.className = 'py-3 px-4 rounded-lg text-center bg-red-800 text-white block mb-4';
                }
            });
        });
    </script>

</body>
</html>
