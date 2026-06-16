const fs = require('fs');

const fileContent = fs.readFileSync('app/pedido_detalhes.php', 'utf8');

const regex = /<\?php[\s\S]*?echo[\s\S]*?produto_nome[\s\S]*?\?>/g;
let match;
console.log('Searching for echoing product/item name in PHP file...');
const lines = fileContent.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('produto') && (line.includes('echo') || line.includes('print')) && line.includes('item')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
