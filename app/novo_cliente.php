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
                            <div class="form-group">
                                <label for="nome">Nome:</label>
                                <input type="text" id="nome" name="nome" required>
                            </div>
                            <div class="form-group">
                                <label for="contato">Contato:</label>
                                <input type="text" id="contato" name="contato">
                            </div>
                            <div class="form-group">
                                <label for="telefone">Telefone 1:</label>
                                <div class="phone-group">
                                    <input type="text" id="ddd" name="ddd" placeholder="DDD" maxlength="2">
                                    <input type="text" id="telefone" name="telefone">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="telefone2">Telefone 2:</label>
                                <input type="text" id="telefone2" name="telefone2">
                            </div>
                            <div class="form-group">
                                <label for="telefone3">Telefone 3:</label>
                                <input type="text" id="telefone3" name="telefone3">
                            </div>
                             <div class="form-group">
                                <label for="email">Email:</label>
                                <input type="email" id="email" name="email">
                            </div>
                        </div>

                        <!-- Coluna 2 -->
                        <div>
                            <div class="form-group">
                                <label for="endereco">Endereço:</label>
                                <textarea id="endereco" name="endereco"></textarea>
                            </div>
                            <div class="form-group">
                                <label for="bairro">Bairro:</label>
                                <input type="text" id="bairro" name="bairro">
                            </div>
                            <div class="form-group">
                                <label for="cep">CEP:</label>
                                <input type="text" id="cep" name="cep">
                            </div>
                            <div class="form-group">
                                <label for="referencias">Referências:</label>
                                <textarea id="referencias" name="referencias"></textarea>
                            </div>
                            <div class="form-group">
                                <label for="documento">Documento:</label>
                                <input type="text" id="documento" name="documento">
                            </div>
                            <div class="form-group">
                                <label for="observacoes">Observações:</label>
                                <textarea id="observacoes" name="observacoes"></textarea>
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-end gap-4 mt-6">
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
                const cleanCep = cep.replace(/\D/g, '');

                if (cleanCep.length !== 8) {
                    return;
                }

                try {
                    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
                    const data = await response.json();

                    if (!data.erro) {
                        enderecoInput.value = data.logradouro || '';
                        bairroInput.value = data.bairro || '';
                    } else {
                        enderecoInput.value = '';
                        bairroInput.value = '';
                    }
                } catch (error) {
                    console.error('Erro ao buscar CEP:', error);
                    enderecoInput.value = '';
                    bairroInput.value = '';
                }
            };

            cepInput.addEventListener('blur', (event) => {
                buscarCep(event.target.value);
            });


            form.addEventListener('submit', async (event) => {
                event.preventDefault();

                messageDiv.style.display = 'none';

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
                        form.reset();
                        
                        if (result.id_cliente) {
                            setTimeout(() => { 
                                window.location.href = `detalhes_cliente.php?id=${result.id_cliente}`; 
                            }, 500);
                        } else {
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
