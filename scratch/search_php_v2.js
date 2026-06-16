const fs = require('fs');

const fileContent = fs.readFileSync('app/pedido_detalhes.php', 'utf8');
const lines = fileContent.split('\n');
console.log('Searching for item rendering loops in PHP file...');
lines.forEach((line, idx) => {
  if (line.includes('itens') && line.includes('fetch') && (line.includes('while') || line.includes('foreach'))) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});

// Let's print some lines from around line 800 to 900 of app/pedido_detalhes.php to find the items table
const keyword = 'id_item';
lines.forEach((line, idx) => {
  if (line.includes(keyword) && line.includes('row')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
