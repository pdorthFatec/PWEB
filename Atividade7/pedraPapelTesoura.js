let nome;
let escolhaHumano;
let escolhaComputador;

let textoH;
let textoC;

nome = prompt("Qual seu nome?");
escolhaHumano = parseInt(prompt("Escolha: \n 0 - Pedra \n 1 - Papel \n 2 - Tesoura"));

escolhaComputador = Math.random();
escolhaComputador = escolhaComputador < 0.33 ? 0.0 : escolhaComputador < 0.33 ? 1.0 : 2.0;

switch (escolhaHumano) {
  case 0:
    textoH = "Pedra"
    break;
  case 1:
    textoH = "Papel"
    break;
  // ... more cases
  default:
    textoH = "Tesoura"
}

switch (escolhaComputador) {
  case 0.0:
    textoC = "Pedra"
    break;
  case 1.0:
    textoC = "Papel"
    break;
  // ... more cases
  default:
    textoC = "Tesoura"
}

let mensagem;
if (textoH == textoC) {
    mensagem = "Empate"
} else {
    if (textoH == "Pedra"){
        switch (textoC) {
        case "Papel":
            mensagem = "Perdeu"
            break;
        default:
            mensagem = "Venceu"
        }
    }

    if (textoH == "Tesoura"){
        switch (textoC) {
        case "Pedra":
            mensagem = "Perdeu"
            break;
        default:
            mensagem = "Venceu"
        }
    }

    if (textoH == "Papel"){
        switch (textoC) {
        case "Tesoura":
            mensagem = "Perdeu"
            break;
        default:
            mensagem = "Venceu"
        }
    }
}

alert(nome + "\nSua escolha: " + textoH + "\nEscolha do PC: " + textoC + "\nResultado: " + mensagem);