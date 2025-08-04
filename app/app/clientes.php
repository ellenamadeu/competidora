<?php
// Restrição de acesso removida temporariamente.
// O header.php ainda iniciará a sessão se não estiver iniciada, mas não haverá verificação de nível aqui.
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Competidora Adm - Clientes</title>
    
    <!-- Tailwind CSS via CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Google Fonts: Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Custom Styles -->
    <link rel="stylesheet" href="backend/style.css"> <!-- Caminho ajustado -->

</head>
<body class="text-gray-200">

    <!-- Main Application Container -->
    <div class="min-h-screen">

        <!-- Header/Navbar -->
        <?php include 'header.php'; ?>

        <!-- Main Content Area -->
        <main class="main-container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="bg-gray-800 p-6 sm:p-8 rounded-lg shadow-xl">
                
                <!-- Block Title -->
                <div class="border-b border-gray-700 pb-4 mb-6">
                    <h1 class="text-2xl sm:text-3xl font-bold text-white">Clientes</h1>
                    <p class="text-gray-400 mt-1">Busque, visualize e gerencie os clientes.</p>
                </div>

                <!-- Block Content -->
                <div>
                    <!-- Search and Actions Bar -->
                    <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                        <!-- Search Form -->
                        <div class="relative w-full sm:w-auto flex-grow">
                             <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                                <svg class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none"></svg>
                            </span>
                            <input 
                                type="search" 
                                id="customerSearch"
                                class="w-full pl-10 pr-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Buscar por nome ou e-mail..."
                            >
                        </div>
                        
                        <!-- Novo Cliente Button (Link para novo_cliente.php) -->
                        <a href="novo_cliente.php" class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out flex items-center justify-center">
                            <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Novo Cliente
                        </a>
                    </div>

                    <!-- Customer List / Search Results -->
                    <div id="customerList" class="divide-y divide-gray-700">
                        <!-- Os resultados da busca do PHP serão inseridos aqui dinamicamente. -->
                    </div>
                     <div id="noResults" class="text-center py-10 hidden">
                        <p class="text-gray-400">Nenhum cliente encontrado para esta busca.</p>
                    </div>
                    <div id="initialMessage" class="text-center py-10 hidden"> 
                        <p class="text-gray-400">Digite algo no campo de busca para encontrar clientes.</p>
                    </div>
                    <div id="loading" class="text-center py-10 hidden">
                        <p class="text-gray-400">Buscando...</p>
                    </div>
                </div>
            </div>
        </main>

    </div>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const searchInput = document.getElementById('customerSearch');
            const customerList = document.getElementById('customerList');
            const noResults = document.getElementById('noResults');
            const initialMessage = document.getElementById('initialMessage'); 
            const loading = document.getElementById('loading');

            // Função para buscar clientes no backend
            const fetchCustomers = async (query) => {
                customerList.innerHTML = '';
                initialMessage.style.display = 'none';
                noResults.style.display = 'none';
                loading.style.display = 'block';

                try {
                    const response = await fetch(`backend/buscar_clientes.php?query=${encodeURIComponent(query)}`);
                    if (!response.ok) {
                        throw new Error(`A resposta do servidor não foi bem-sucedida (${response.status})`);
                    }
                    const customers = await response.json();
                    
                    loading.style.display = 'none';

                    if (customers.length === 0) {
                        noResults.style.display = 'block';
                    } else {
                        noResults.style.display = 'none';
                        customers.forEach(customer => {
                            const name = customer.nome || 'Nome Indisponível';
                            const address = customer.endereco || 'Endereço não cadastrado';
                            const neighborhood = customer.bairro ? ' - ' + customer.bairro : '';
                            
                            let phone = 'Telefone não cadastrado';
                            if (customer.telefone) {
                                phone = customer.telefone;
                            } else if (customer.telefone2) {
                                phone = customer.telefone2;
                            }

                            const avatarLetter = name.charAt(0).toUpperCase();
                            const detailsPageLink = `detalhes_cliente.php?id=${customer.id_cliente}`;

                            const customerElement = `
                                <div class="flex items-center p-4 rounded-lg transition-colors duration-200 customer-card" 
                                     onclick="window.location.href='${detailsPageLink}'">
                                    <div class="flex items-center min-w-0">
                                        <img class="h-12 w-12 rounded-full object-cover flex-shrink-0" src="https://placehold.co/100x100/7E22CE/FFFFFF?text=${avatarLetter}" alt="Avatar">
                                        <div class="ml-4 min-w-0 flex-grow">
                                            <div class="text-base font-medium text-white truncate">${name}</div>
                                            <div class="text-sm text-gray-400 truncate">${address}${neighborhood}</div>
                                            <div class="text-sm text-gray-400 truncate">${phone}</div>
                                        </div>
                                    </div>
                                </div>`;
                            customerList.insertAdjacentHTML('beforeend', customerElement);
                        });
                    }
                } catch (error) {
                    console.error('Erro ao buscar clientes:', error);
                    loading.style.display = 'none';
                    customerList.innerHTML = '<p class="text-red-400 text-center">Ocorreu um erro ao carregar os dados. Verifique a conexão e o console para mais detalhes.</p>';
                }
            };

            let debounceTimer;
            searchInput.addEventListener('input', (event) => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    fetchCustomers(event.target.value.trim());
                }, 300);
            });

            fetchCustomers(''); 
        });
    </script>

</body>
</html>
