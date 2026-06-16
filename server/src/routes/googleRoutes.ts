import { Router } from 'express';
import { GoogleContactsService } from '../services/GoogleContactsService';

const router = Router();

router.get('/auth', (req, res) => {
  const url = GoogleContactsService.getAuthUrl();
  res.redirect(url);
});

router.get('/callback', async (req, res) => {
  const { code } = req.query;
  
  if (!code) {
    return res.status(400).send('Code not provided');
  }

  try {
    await GoogleContactsService.handleCallback(code as string);
    // Redireciona de volta para o frontend
    res.redirect(`${process.env.FRONTEND_URL}/clientes?google=success`);
  } catch (error) {
    console.error('Error in Google callback:', error);
    res.redirect(`${process.env.FRONTEND_URL}/clientes?google=error`);
  }
});

router.get('/status', async (req, res) => {
  const connected = await GoogleContactsService.isConnected();
  res.json({ connected });
});

router.post('/disconnect', async (req, res) => {
  await GoogleContactsService.disconnect();
  res.status(204).send();
});

export default router;
