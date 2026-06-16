
-- Restauração de colunas faltantes em orc_funcionarios
ALTER TABLE `orc_funcionarios` 
ADD COLUMN `acesso` INT NULL AFTER `status`,
ADD COLUMN `login` VARCHAR(100) NULL AFTER `acesso`,
ADD COLUMN `senha` VARCHAR(100) NULL AFTER `login`;

-- Criação de tabelas faltantes identificadas no Prisma schema

-- caixa_saida
CREATE TABLE IF NOT EXISTS `caixa_saida` (
  `id_caixa_saida` INT AUTO_INCREMENT PRIMARY KEY,
  `data` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_fornecedor` INT NOT NULL,
  `forma_pagamento` INT NOT NULL,
  `valor` DECIMAL(10, 2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- financeiro_despesas
CREATE TABLE IF NOT EXISTS `financeiro_despesas` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_fornecedor` INT NOT NULL,
  `descricao` VARCHAR(500) NOT NULL,
  `valor` DECIMAL(10, 2) NOT NULL,
  `data_pagamento` DATE NOT NULL,
  `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (`id_fornecedor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- fornecedor_categoria
CREATE TABLE IF NOT EXISTS `fornecedor_categoria` (
  `id_categorias` INT AUTO_INCREMENT PRIMARY KEY,
  `categoria` VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- fornecedores
CREATE TABLE IF NOT EXISTS `fornecedores` (
  `id_fornecedor` INT AUTO_INCREMENT PRIMARY KEY,
  `categoria` INT NULL,
  `nome` VARCHAR(100) NOT NULL,
  `contato` VARCHAR(50) NULL,
  `ddd` INT NULL,
  `telefone1` VARCHAR(20) NULL,
  `telefone2` VARCHAR(20) NULL,
  `telefone3` VARCHAR(20) NULL,
  `endereco` VARCHAR(80) NULL,
  `bairro` VARCHAR(50) NULL,
  `referencia` VARCHAR(50) NULL,
  `cep` VARCHAR(50) NULL,
  `email` VARCHAR(50) NULL,
  `cnpj` VARCHAR(20) NULL,
  `ie` VARCHAR(30) NULL,
  `observacoes` TEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
