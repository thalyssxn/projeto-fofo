// =========================================================
// 1. DATA DE INÍCIO DO RELACIONAMENTO (CONFIGURADA)
// 02 de Fevereiro de 2024, 22:00:00
// =========================================================
const dataInicio = new Date(2024, 1, 8, 22, 0, 0); 

// =========================================================
// ⚠️ 2. LISTE OS NOMES DOS SEUS ARQUIVOS DE FOTOS AQUI!
// =========================================================
const fotos = [
    'fotos/foto1.jpeg', 'fotos/foto2.jpeg', 'fotos/foto3.jpeg', 
    'fotos/foto4.jpeg', 'fotos/foto5.jpeg', 'fotos/foto6.jpeg', 
    'fotos/foto7.jpeg', 'fotos/foto8.jpeg', 'fotos/foto9.jpeg',
    'fotos/foto10.jpeg', 'fotos/foto11.jpeg', 'fotos/foto12.jpeg',
    'fotos/foto13.jpeg', 'fotos/foto14.jpeg', 'fotos/foto15.jpeg',
];

// VARIÁVEIS DE CONTROLE DO CARROSSEL
const FOTOS_VISIVEIS = 3; 
const PASSO = 1; 

// Elementos do DOM
const elementoContador = document.getElementById('contador');
const elementoDataInicio = document.getElementById('data-inicio-display');
const carouselTrack = document.getElementById('carousel-track');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const boasVindasOverlay = document.getElementById('boasVindasOverlay'); // O overlay principal
const btnIniciarPresente = document.getElementById('iniciarPresente'); // O novo botão

let indiceAtual = 0; 
let slideInterval; 
let heartInterval; 

const dataFormatada = dataInicio.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
elementoDataInicio.textContent = `Nossa jornada começou em ${dataFormatada}.`;


// =========================================================
// LÓGICA DO CONTADOR
// =========================================================
function atualizarContador() {
    const agora = new Date();
    const diferenca = agora - dataInicio; 

    const SEGUNDO = 1000, MINUTO = 60 * SEGUNDO, HORA = 60 * MINUTO, DIA = 24 * HORA, ANO = 365.25 * DIA; 

    const anos = Math.floor(diferenca / ANO);
    const dias = Math.floor((diferenca % ANO) / DIA);
    const horas = Math.floor((diferenca % DIA) / HORA);
    const minutos = Math.floor((diferenca % HORA) / MINUTO);
    const segundos = Math.floor((diferenca % MINUTO) / SEGUNDO);

    const mensagem = `${anos} ${anos === 1 ? 'ano' : 'anos'}, ${dias} ${dias === 1 ? 'dia' : 'dias'}, ${horas} ${horas === 1 ? 'hora' : 'horas'}, ${minutos} ${minutos === 1 ? 'minuto' : 'minutos'} e ${segundos} ${segundos === 1 ? 'segundo' : 'segundos'}`;
    elementoContador.innerHTML = `Estamos juntos há <strong>${mensagem}</strong>!`;
}

atualizarContador();
setInterval(atualizarContador, 1000);


// =========================================================
// FUNÇÃO PARA EXTRAIR COR DOMINANTE (BORDA BRILHANTE)
// =========================================================
function getDominantColor(imgElement) {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const width = 100;
        const height = (imgElement.naturalHeight / imgElement.naturalWidth) * width;
        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(imgElement, 0, 0, width, height);

        try {
            const imageData = ctx.getImageData(0, 0, width, height).data;
            let r = 0, g = 0, b = 0, count = 0;
            for (let i = 0; i < imageData.length; i += 4 * 5) {
                r += imageData[i]; g += imageData[i + 1]; b += imageData[i + 2];
                count++;
            }
            r = Math.floor(r / count); g = Math.floor(g / count); b = Math.floor(b / count);
            resolve(`rgb(${r}, ${g}, ${b})`);
        } catch (e) {
            resolve('rgb(255, 192, 203)'); 
        }
    });
}

// =========================================================
// LÓGICA DA CHUVA DE CORAÇÕES
// =========================================================
function criarCoracao() {
    const container = document.getElementById('heart-rain-container');
    const heart = document.createElement('div');
    heart.innerHTML = '♥'; 
    heart.classList.add('heart');
    
    const startX = Math.random() * 100; 
    heart.style.left = `${startX}vw`;
    
    const duration = Math.random() * 5 + 5; 
    heart.style.animationDuration = `${duration}s`;
    
    const size = Math.random() * 20 + 10; 
    heart.style.fontSize = `${size}px`;

    container.appendChild(heart);
    
    setTimeout(() => { heart.remove(); }, duration * 1000);
}

function iniciarChuvaDeCoracoes() {
    heartInterval = setInterval(criarCoracao, 500);
}


// =========================================================
// LÓGICA DO CARROSSEL DE FOTOS
// =========================================================

function inicializarCarousel() {
    if (fotos.length < FOTOS_VISIVEIS) {
         carouselTrack.style.transition = 'none'; carouselTrack.style.flexWrap = 'wrap';
         prevBtn.style.display = 'none'; nextBtn.style.display = 'none';
    }

    fotos.forEach(src => {
        const div = document.createElement('div'); div.classList.add('foto-item');
        const img = document.createElement('img'); img.src = src; img.alt = 'Nossas fotos fofas'; img.classList.add('foto-slideshow');
        
        img.onload = async () => {
            const dominantColor = await getDominantColor(img);
            img.style.boxShadow = `0 0 8px 3px ${dominantColor}`; 
        };
        if (img.complete) img.onload();

        div.appendChild(img);
        carouselTrack.appendChild(div);
    });

    prevBtn.addEventListener('click', () => moverCarrossel(-PASSO));
    nextBtn.addEventListener('click', () => moverCarrossel(PASSO));

    iniciarSlideAutomatico();
    updateCarousel();
}

function updateCarousel() {
    const offset = -indiceAtual * (100 / FOTOS_VISIVEIS); 
    carouselTrack.style.transform = `translateX(${offset}%)`;
}

function moverCarrossel(direcao) {
    if (Math.abs(direcao) === PASSO) { pararSlideAutomatico(); }
    
    let novoIndice = indiceAtual + direcao;
    
    if (novoIndice > fotos.length - FOTOS_VISIVEIS) {
        novoIndice = 0; 
    } else if (novoIndice < 0) {
        novoIndice = fotos.length - FOTOS_VISIVEIS; 
    }
    
    indiceAtual = novoIndice;
    
    updateCarousel();

    if (Math.abs(direcao) === PASSO) {
        setTimeout(iniciarSlideAutomatico, 3000);
    }
}

function iniciarSlideAutomatico() {
    pararSlideAutomatico(); 
    slideInterval = setInterval(() => moverCarrossel(PASSO), 500); 
}

function pararSlideAutomatico() {
    clearInterval(slideInterval);
}


// =========================================================
// LÓGICA DO POP-UP SIMPLES
// =========================================================
btnIniciarPresente.addEventListener('click', function() {
    // Remove o overlay e inicia o conteúdo principal
    boasVindasOverlay.classList.add('escondido');
    
    iniciarChuvaDeCoracoes();
    inicializarCarousel();
});
