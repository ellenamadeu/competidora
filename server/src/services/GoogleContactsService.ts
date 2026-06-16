import { google } from 'googleapis';
import { prisma } from '../config/prisma';
import fs from 'fs';

function logSync(msg: string, obj?: any) {
  const logMsg = `[${new Date().toISOString()}] ${msg} ${obj ? JSON.stringify(obj, null, 2) : ''}\n`;
  fs.appendFileSync('sync.log', logMsg);
  console.log(msg, obj || '');
}

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export class GoogleContactsService {
  private static async getAuth() {
    const authRecord = await prisma.googleAuth.findUnique({
      where: { id: 1 }
    });

    if (!authRecord) return null;

    oauth2Client.setCredentials({
      access_token: authRecord.access_token,
      refresh_token: authRecord.refresh_token,
      expiry_date: Number(authRecord.expiry_date)
    });

    // Escuta por renovação automática de token
    oauth2Client.on('tokens', async (tokens) => {
      if (tokens.refresh_token) {
        await prisma.googleAuth.upsert({
          where: { id: 1 },
          update: {
            access_token: tokens.access_token || '',
            refresh_token: tokens.refresh_token,
            expiry_date: tokens.expiry_date ? BigInt(tokens.expiry_date) : null
          },
          create: {
            id: 1,
            access_token: tokens.access_token || '',
            refresh_token: tokens.refresh_token,
            expiry_date: tokens.expiry_date ? BigInt(tokens.expiry_date) : null
          }
        });
      } else {
        await prisma.googleAuth.update({
          where: { id: 1 },
          data: {
            access_token: tokens.access_token || '',
            expiry_date: tokens.expiry_date ? BigInt(tokens.expiry_date) : null
          }
        });
      }
    });

    return oauth2Client;
  }

  static async syncContact(cliente: any) {
    logSync(`>>> syncContact ENTRY for client ${cliente.id} (${cliente.nome})`);
    const auth = await this.getAuth();
    if (!auth) return;

    const people = google.people({ version: 'v1', auth });

    const phoneNumbers = [
      cliente.telefone,
      cliente.telefone2,
      cliente.telefone3
    ].filter(Boolean).map(phone => ({ value: phone }));

    const contactData = {
      names: [{ givenName: cliente.nome }],
      phoneNumbers,
      emailAddresses: cliente.email ? [{ value: cliente.email }] : [],
      addresses: cliente.endereco ? [{ streetAddress: cliente.endereco, city: cliente.bairro }] : [],
    };

    try {
      logSync(`Syncing client ${cliente.id} (${cliente.nome}). GoogleID: ${cliente.google_id}`);
      if (cliente.google_id) {
        // Fetch current contact to get the current etag
        const currentContact = await people.people.get({
          resourceName: cliente.google_id,
          personFields: 'metadata'
        });

        const updateRequest = {
          resourceName: cliente.google_id,
          updatePersonFields: 'names,phoneNumbers,emailAddresses,addresses',
          requestBody: {
            ...contactData,
            etag: currentContact.data.etag
          } as any
        };
        logSync('Google update request:', updateRequest);
        
        await people.people.updateContact(updateRequest);
        logSync(`Updated existing contact: ${cliente.google_id}`);
      } else {
        // Create new contact
        const response = await people.people.createContact({
          requestBody: contactData as any
        });
        
        const googleId = response.data.resourceName;
        logSync(`Created NEW contact. ResourceName: ${googleId}`);
        
        // Save google_id back to database
        await prisma.cliente.update({
          where: { id: cliente.id },
          data: { google_id: googleId }
        });
      }
    } catch (error: any) {
      logSync('Error syncing with Google Contacts:', error.response?.data || error.message);
    }
  }

  static async deleteContact(googleId: string) {
    const auth = await this.getAuth();
    if (!auth) return;

    const people = google.people({ version: 'v1', auth });

    try {
      await people.people.deleteContact({ resourceName: googleId });
    } catch (error) {
      console.error('Error deleting Google Contact:', error);
    }
  }

  static getAuthUrl() {
    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/contacts'],
      prompt: 'consent'
    });
  }

  static async handleCallback(code: string) {
    const { tokens } = await oauth2Client.getToken(code);
    
    await prisma.googleAuth.upsert({
      where: { id: 1 },
      update: {
        access_token: tokens.access_token || '',
        refresh_token: tokens.refresh_token || '',
        expiry_date: tokens.expiry_date ? BigInt(tokens.expiry_date) : null
      },
      create: {
        id: 1,
        access_token: tokens.access_token || '',
        refresh_token: tokens.refresh_token || '',
        expiry_date: tokens.expiry_date ? BigInt(tokens.expiry_date) : null
      }
    });

    return tokens;
  }

  static async isConnected() {
    logSync('>>> isConnected ENTRY');
    try {
      const authRecord = await prisma.googleAuth.findUnique({
        where: { id: 1 }
      });
      return !!authRecord;
    } catch {
      return false;
    }
  }

  static async disconnect() {
    await prisma.googleAuth.deleteMany({
      where: { id: 1 }
    });
  }
}
