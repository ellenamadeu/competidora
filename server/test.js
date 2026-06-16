const mysql = require('mysql2/promise');
async function test() {
  try {
    const conn = await mysql.createConnection("mysql://competid4c3793e0_loja:Eao@031626@a16-asgard3.hospedagemuolhost.com.br:3306/competid4c3793e0_competidor1_1");
    console.log("SUCCESS: Connected to the database!");
    await conn.end();
  } catch(e) {
    console.error("ERROR:", e.message);
  }
}
test();
