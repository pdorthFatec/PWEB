/*
const fs = require('fs')(); // carregando módulo filesystem
const data = fs.readFileSync('Cidades.txt');

// a execućão é bloqueada aqui até o arquivo ser lido
console.log(data.toString());
*/

// fiz dessa forma por rodar no linux
const fs = require('fs'); // módulo filesystem
const path = require('path'); // módulo para lidar com caminhos de arquivo

// Caminho absoluto para o arquivo (mais seguro no Linux)
const filePath = path.join(__dirname, 'Cidades.txt');

try {
  // Lê o arquivo de forma síncrona com encoding UTF-8
  const data = fs.readFileSync(filePath, 'utf8');
  console.log(data);
} catch (err) {
  console.error('Erro ao ler o arquivo:', err.message);
}