import axios from 'axios';

async function testApi() {
  try {
    const res = await axios.get('http://localhost:3000/api/pedidos/config/entregas');
    console.log('DELIVERY METHODS:', res.data);
  } catch (err: any) {
    console.error('ERROR:', err.message);
  }
}
testApi();
