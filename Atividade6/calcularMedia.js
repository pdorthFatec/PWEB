let nome;
let notas01;
let notas02;
let notas03;
let notas04;
let media;

nome = prompt("Qual seu nome?");
notas01 = prompt("Qual a primeira nota?");
notas02 = prompt("Qual a segunda nota?");
notas03 = prompt("Qual a terceira nota?");
notas04 = prompt("Qual a quarta nota?");

media = (parseFloat(notas01) + parseFloat(notas02) + parseFloat(notas03) + parseFloat(notas04)) / 4

alert("Media: " + media);