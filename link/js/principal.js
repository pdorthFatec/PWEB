document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os cartões pelos IDs
    const cardAchados = document.getElementById('card-achados');
    const cardCaronas = document.getElementById('card-caronas');
    const userAvatar = document.querySelector('.user-avatar');

    // Função para simular navegação
    function navigateTo(serviceName) {
        // Efeito visual de clique (opcional)
        console.log(`Navegando para: ${serviceName}`);
        
        // Aqui você colocaria o window.location.href = 'pagina.html';
        // Como não temos as outras páginas, vamos apenas alertar
        alert(`Você clicou em: ${serviceName}. Redirecionando...`);
    }

    // Adiciona eventos de clique
    if (cardAchados) {
        cardAchados.addEventListener('click', () => {
            navigateTo('Achados & Perdidos');
        });
    }

    if (cardCaronas) {
        cardCaronas.addEventListener('click', () => {
            //navigateTo('Caronas Universitárias');
            window.location.href ('carona.html');  //, '_blank');
        });
    }

    // Interatividade no Avatar (Exemplo: Menu dropdown ou Perfil)
    if (userAvatar) {
        userAvatar.addEventListener('click', () => {
            alert('Abrir perfil de Maria Silva (MS)');
        });
    }
});