alert("Informar 03 números para identificarmos o maior e ordenalos");

let numero01 = parseInt(prompt("Informe o primeiro número"));
let numero02 = parseInt(prompt("Informe o segundo número"));
let numero03 = parseInt(prompt("Informe o terceiro número"));

let maiorEntre03 = (numero01, numero02, numero03) => {
    maiorEntre03 = numero01 > numero02 ? numero01:numero02
    maiorEntre03 = maiorEntre03 > numero03 ? maiorEntre03:numero03

    return maiorEntre03
} 
alert("Maior número " + maiorEntre03(numero01, numero02, numero03))

let ordemCrescente = (numero01, numero02, numero03) => {
    let arrayCrescente = [];

    arrayCrescente.push(numero01);
    arrayCrescente.push(numero02);
    arrayCrescente.push(numero03);

    return arrayCrescente.sort((a,b) => a - b);
}
alert("Número em ordem crescente: " + ordemCrescente(numero01, numero02, numero03));


let palavraInformada = prompt("Informe uma palavra para teste de palíndromo");

let palimdromo = (palavraInformada) => {
    let palavraInvertida = palavraInformada.split('').reverse().join('');

    return  palavraInformada == palavraInvertida ? "É palíndromo" : "Não é palíndromo";
}
alert(palimdromo(palavraInformada));


alert("Teste para triângulo");

let lado01 = parseInt(prompt("Informe o primeiro lado"));
let lado02 = parseInt(prompt("Informe o segundo lado"));
let lado03 = parseInt(prompt("Informe o terceiro lado"));

let triangulo = (lado01, lado02, lado03) => {

    let bTriangulo = false;
    let frase;

    if (
        lado01 < (lado02 + lado03) &&
        lado02 < (lado03 + lado01) &&
        lado03 < (lado01 + lado02)
    ) {
        bTriangulo = true;
    } else {
        frase = "Não é triângulo";
    }

    if(bTriangulo) {
        if(lado01 == lado02 && lado02 == lado03) {
            frase = "Equilátero";

        } else if (lado01 == lado02 || lado02 == lado03 || lado01 == lado03) {
            frase = "Isósceles";

        } else {
            frase = "Escaleno";
        }
    }

    return frase;
}
alert(triangulo(lado01, lado02, lado03));
