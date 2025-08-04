<?php
// backend/add_pedido.php
// Este script adiciona um novo pedido à tabela 'pedidos'.

header('Content-Type: application/json');
include 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    $id_cliente = $data['id_cliente'] ?? null;

    if (empty($id_cliente)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'ID do cliente não fornecido para criar o pedido.']);
        exit();
    }

    try {
        // Valores padrão para o novo pedido
        $data_pedido = date('Y-m-d H:i:s'); // Data e hora atuais
        $titulo = "Novo Pedido";
        $status_default = 1; // Assumindo que 1 é um ID de status padrão (ex: "Aberto", "Novo")

        // Inserir o novo pedido
        $sqlInsert = "
            INSERT INTO pedidos (
                id_cliente, 
                data_pedido, 
                titulo, 
                subtotal, 
                total, 
                status, 
                medicao_dia, 
                medicao_turno, 
                instalacao_dia, 
                instalacao_turno, 
                funcionario, 
                desconto, 
                valor_pago, 
                saldo, 
                forma_pagamento, 
                observacoes, 
                newtemper, 
                prazo, 
                parcelamento, 
                entrega
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
        ";
        
        $stmtInsert = $pdo->prepare($sqlInsert);
        $stmtInsert->execute([
            $id_cliente,
            $data_pedido,
            $titulo,
            0.00, // subtotal
            0.00, // total
            $status_default, // status
            null, // medicao_dia
            null, // medicao_turno
            null, // instalacao_dia
            null, // instalacao_turno
            null, // funcionario
            0.00, // desconto
            0.00, // valor_pago
            0.00, // saldo
            null, // forma_pagamento
            null, // observacoes
            null, // newtemper
            0,    // prazo
            0,    // parcelamento
            null  // entrega
        ]);

        if ($stmtInsert->rowCount() > 0) {
            $newOrderId = $pdo->lastInsertId();
            echo json_encode(['success' => true, 'message' => 'Novo pedido criado com sucesso!', 'id_pedido' => $newOrderId]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Falha ao criar o novo pedido.']);
        }

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Erro no servidor (PDOException): ' . $e->getMessage()]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Erro inesperado no servidor: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método de requisição não permitido. Use POST.']);
}
?>
