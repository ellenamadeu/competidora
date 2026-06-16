import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'competid4c3793e0_node',
    port: 3306
  });

  console.log('Connected to Node DB');

  const createItensTable = `
    CREATE TABLE IF NOT EXISTS itens (
      id_item INT AUTO_INCREMENT PRIMARY KEY,
      id_pedido INT NOT NULL,
      id_cliente INT NOT NULL,
      produto_id INT NULL,
      altura DECIMAL(10, 3) NULL,
      largura DECIMAL(10, 3) NULL,
      comprimento DECIMAL(10, 3) NULL,
      quantidade DECIMAL(10, 3) NULL,
      valor_unitario DECIMAL(10, 2) NULL,
      valor_total DECIMAL(10, 2) NULL,
      observacoes TEXT NULL,
      formato VARCHAR(10) DEFAULT 'NODE',
      produto_sc VARCHAR(200) NULL,
      categoria INT NULL,
      produto INT NULL,
      descricao INT NULL,
      espessura INT NULL,
      acabamento INT NULL,
      acabamento2 VARCHAR(300) NULL,
      m2 VARCHAR(20) NULL,
      FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido),
      INDEX (id_pedido),
      INDEX (produto_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;

  const createAgendamentoTable = `
    CREATE TABLE IF NOT EXISTS agendamento (
      id_agendamento INT AUTO_INCREMENT PRIMARY KEY,
      id_pedido INT NOT NULL,
      data_agendamento DATE NULL,
      hora_agendamento INT NULL,
      ordem INT NULL,
      responsavel INT NULL,
      instrucao TEXT NULL,
      status_agendamento INT NULL,
      FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido),
      INDEX (id_pedido)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;

  await connection.query(createItensTable);
  console.log('Table "itens" created.');

  await connection.query(createAgendamentoTable);
  console.log('Table "agendamento" created.');

  await connection.end();
}

main().catch(console.error);
