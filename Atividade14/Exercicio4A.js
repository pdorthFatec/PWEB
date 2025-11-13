function Parte1() {
    for(let i=1; i<=10; i++) {
        console.log("primeira parte: " + i);
    }
}

setTimeout(Parte1, 2000);

const fs = require('fs');
const path = require('path'); // módulo para lidar com caminhos de arquivo
const filePath = path.join(__dirname, 'Cidades.txt');

fs.readFile(filePath, (err, data) => {
    if(err) throw err;
    const registros = data.toString().split('\n');
    registros.forEach((registro, index) => {
        console.log(" segunda parte: " + registro + " " + index);
    });
});

