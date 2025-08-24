<?php
// backend/add_pedido.php
// Este script adiciona um novo pedido à tabela 'pedidos'.
// MODIFICADO para aceitar título e status.

header('Content-Type: application/json');
include '../db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    $id_cliente = $data['id_cliente'] ?? null;
    $titulo = $data['titulo'] ?? 'Novo Pedido'; // Valor padrão caso não seja enviado
    $status = $data['status'] ?? 1; // Valor padrão (1) caso não seja enviado

    if (empty($id_cliente)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'ID do cliente não fornecido para criar o pedido.']);
        exit();
    }
    
    // Validação adicional para título e status
    if (empty($titulo) || empty($status)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Título e Status são obrigatórios.']);
        exit();
    }

    try {
        // Valores padrão para o novo pedido
        $data_pedido = date('Y-m-d H:i:s'); // Data e hora atuais

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
            $titulo, // USA O TÍTULO DO MODAL
            0.00, // subtotal
            0.00, // total
            $status, // USA O STATUS DO MODAL
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
