import { exec } from 'child_process';
import path from 'path';

const cmd = 'npx prisma migrate status';
const cwd = path.join(__dirname, '../');

exec(cmd, { cwd }, (error, stdout, stderr) => {
  console.log('--- STDOUT ---');
  console.log(stdout);
  console.log('--- STDERR ---');
  console.log(stderr);
  if (error) {
    console.log('--- ERROR ---');
    console.error(error);
  }
});
