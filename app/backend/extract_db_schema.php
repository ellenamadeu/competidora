<?php
// backend/extract_db_schema.php
// Este script extrai e exibe a estrutura do banco de dados (tabelas e colunas).

header('Content-Type: text/html; charset=utf-8'); // Define o cabeçalho para HTML com UTF-8

// Inclui o arquivo de conexão com o banco de dados.
include 'db_connection.php'; // Isso garantirá que $pdo esteja disponível

echo "<!DOCTYPE html>
<html lang='pt-br'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Estrutura do Banco de Dados</title>
    <script src='https://cdn.tailwindcss.com'></script>
    <link rel='stylesheet' href='style.css'>
    <style>
        .table-section {
            margin-bottom: 2rem;
            padding: 1.5rem;
            background-color: #1F2937; /* gray-800 */
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .table-name {
            font-size: 1.5rem; /* text-2xl */
            font-weight: 700; /* font-bold */
            color: #E5E7EB; /* text-gray-200 */
            margin-bottom: 1rem;
            border-bottom: 1px solid #4B5563; /* gray-600 */
            padding-bottom: 0.5rem;
        }
        .column-item {
            display: flex;
            justify-content: space-between;
            padding: 0.5rem 0;
            border-bottom: 1px dashed #4B5563; /* gray-600 */
        }
        .column-item:last-child {
            border-bottom: none;
        }
        .column-name {
            font-weight: 500;
            color: #9CA3AF; /* gray-400 */
        }
        .column-type {
            color: #E5E7EB; /* text-gray-200 */
        }
    </style>
</head>
<body class='text-gray-200 bg-gray-900 flex flex-col items-center min-h-screen p-4'>
    <div class='main-container main-container-small bg-gray-800 p-8 rounded-lg shadow-xl text-center mb-6'>
        <h2 class='text-2xl font-bold text-white mb-4'>Estrutura do Banco de Dados</h2>
        <p class='text-gray-400'>Listagem de tabelas e suas colunas no banco de dados.</p>
    </div>
    <div class='main-container main-container-small w-full'>";

try {
    // Obter o nome do banco de dados configurado em db_connection.php
    // Isso é necessário para consultar INFORMATION_SCHEMA.COLUMNS
    global $dbname; // A variável $dbname é definida em db_connection.php

    if (!isset($dbname) || empty($dbname)) {
        echo "<div class='table-section text-red-400'>Erro: Nome do banco de dados não definido em db_connection.php.</div>";
    } else {
        // Consulta para obter todas as tabelas no banco de dados atual
        $stmtTables = $pdo->query("SHOW TABLES");
        $tables = $stmtTables->fetchAll(PDO::FETCH_NUM);

        if (empty($tables)) {
            echo "<div class='table-section'><p class='text-yellow-400'>Nenhuma tabela encontrada no banco de dados '{$dbname}'.</p></div>";
        } else {
            foreach ($tables as $tableRow) {
                $tableName = $tableRow[0];
                echo "<div class='table-section'>";
                echo "<h3 class='table-name'>Tabela: " . htmlspecialchars($tableName) . "</h3>";
                
                // Consulta para obter as colunas de cada tabela
                $stmtColumns = $pdo->prepare("
                    SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_KEY, EXTRA 
                    FROM INFORMATION_SCHEMA.COLUMNS 
                    WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
                    ORDER BY ORDINAL_POSITION
                ");
                $stmtColumns->execute([$dbname, $tableName]);
                $columns = $stmtColumns->fetchAll(PDO::FETCH_ASSOC);

                if (empty($columns)) {
                    echo "<p class='text-gray-400'>Nenhuma coluna encontrada para esta tabela.</p>";
                } else {
                    foreach ($columns as $column) {
                        echo "<div class='column-item'>";
                        echo "<span class='column-name'>" . htmlspecialchars($column['COLUMN_NAME']) . "</span>";
                        echo "<span class='column-type'>" . htmlspecialchars($column['COLUMN_TYPE']) . 
                             ($column['IS_NULLABLE'] === 'NO' ? ' NOT NULL' : '') .
                             ($column['COLUMN_KEY'] === 'PRI' ? ' PRIMARY KEY' : '') .
                             (!empty($column['EXTRA']) ? ' ' . htmlspecialchars($column['EXTRA']) : '') .
                             "</span>";
                        echo "</div>";
                    }
                }
                echo "</div>"; // Fecha table-section
            }
        }
    }

} catch (PDOException $e) {
    echo "<div class='table-section text-red-400'>Erro ao extrair esquema: " . htmlspecialchars($e->getMessage()) . "</div>";
}

echo "</div>"; // Fecha main-container
echo "<p class='mt-6'><a href='../login.php' class='bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out'>Voltar para o Login</a></p>";
echo "</body></html>";
?>
