import { PedidoController } from './src/controllers/PedidoController';
import { Request, Response } from 'express';

async function main() {
  const req = {
    params: { id: '49339' }
  } as unknown as Request;

  const res = {
    json: (data: any) => {
      console.log('API RESPONSE FOR 49339:');
      console.log(JSON.stringify(data, null, 2));
    },
    status: (code: number) => {
      console.log('STATUS CODE:', code);
      return res;
    }
  } as unknown as Response;

  try {
    await PedidoController.getById(req, res);
  } catch (err) {
    console.error('ERROR RUNNING API:', err);
  }
}

main();
