const axios = require('axios');

async function test() {
  try {
    const res = await axios.get('http://localhost:3000/api/categorias');
    console.log('Categorias fetch:', res.data.length);
    res.data.forEach(c => {
      console.log(`ID: ${c.id}, Nome: ${c.nome}, Parent: ${c.categoria_pai_id}`);
    });
  } catch (err) {
    console.error('Error fetching categories:', err.message);
  }
}
test();
