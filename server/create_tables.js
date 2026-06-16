const mysql = require('mysql2/promise');

async function runMigrations() {
  const connection = await mysql.createConnection("mysql://competid4c3793e0_loja:Eao@031626@a16-asgard3.hospedagemuolhost.com.br:3306/competid4c3793e0_competidor1_1");

  try {
    console.log("Iniciando criação de tabelas...");

    // Categoria
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS categorias (
          id INT AUTO_INCREMENT PRIMARY KEY,
          categoria_pai_id INT NULL,
          nome VARCHAR(255) NOT NULL,
          slug VARCHAR(255) NOT NULL,
          criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (categoria_pai_id) REFERENCES categorias(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log("Tabela 'categorias' verificada/criada.");

    // Produtos
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS produtos (
          id INT AUTO_INCREMENT PRIMARY KEY,
          categoria_id INT NULL,
          nome VARCHAR(255) NOT NULL,
          descricao TEXT NULL,
          ncm VARCHAR(50) NULL,
          sku VARCHAR(100) NULL,
          preco_venda DECIMAL(10, 2) NOT NULL,
          unidade_medida VARCHAR(20) NOT NULL,
          largura_maxima DECIMAL(10, 2) NULL,
          altura_maxima DECIMAL(10, 2) NULL,
          comprimento_maximo DECIMAL(10, 2) NULL,
          status TINYINT(1) DEFAULT 1,
          criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log("Tabela 'produtos' verificada/criada.");

    // Acabamentos
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS acabamentos (
          id INT AUTO_INCREMENT PRIMARY KEY,
          categoria_id INT NULL,
          produto_id INT NULL,
          nome VARCHAR(255) NOT NULL,
          tipo_acrescimo VARCHAR(20) NOT NULL,
          valor DECIMAL(10, 2) NOT NULL,
          ativo TINYINT(1) DEFAULT 0,
          FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE,
          FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log("Tabela 'acabamentos' verificada/criada.");

    console.log("Migração concluída com sucesso!");
  } catch (error) {
    console.error("Erro durante a migração:", error.message);
  } finally {
    await connection.end();
  }
}

runMigrations();
