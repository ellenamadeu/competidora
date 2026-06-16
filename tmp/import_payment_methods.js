const mysql = require('mysql2/promise');

async function main() {
  const connection = await mysql.createConnection({
    host: 'a16-asgard3.hospedagemuolhost.com.br',
    user: 'competid4c3793e0_loja',
    password: 'Eao@031626',
    database: 'competid4c3793e0_node'
  });

  try {
    console.log('Creating table orc_pagamento...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS orc_pagamento (
        id_pagamento INT PRIMARY KEY,
        pagamento VARCHAR(50)
      )
    `);

    const data = [
      { id_pagamento: 1, pagamento: "Dinheiro" },
      { id_pagamento: 2, pagamento: "Cartão CRÉDITO" },
      { id_pagamento: 3, pagamento: "Cartão DÉBITO" },
      { id_pagamento: 4, pagamento: "Transferência/PIX" },
      { id_pagamento: 5, pagamento: "Promissória" },
      { id_pagamento: 6, pagamento: "Boleto" },
      { id_pagamento: 7, pagamento: "Cheque" }
    ];

    console.log('Inserting data...');
    for (const d of data) {
      await connection.execute(
        'INSERT INTO orc_pagamento (id_pagamento, pagamento) VALUES (?, ?) ON DUPLICATE KEY UPDATE pagamento = VALUES(pagamento)',
        [d.id_pagamento, d.pagamento]
      );
    }

    console.log('Done!');
  } catch (err) {
    console.error('ERROR:', err);
  } finally {
    await connection.end();
  }
}

main();
