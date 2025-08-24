    // Ajusta o padding-top do <main> para não ficar escondido atrás do header fixo
function ajustaMain() {
const header = document.querySelector("header");
const main = document.querySelector("main");
if (header && main) {
    main.style.paddingTop = header.offsetHeight + "px";
}
}

// Chama ao carregar e ao redimensionar a tela
window.addEventListener("load", ajustaMain);
window.addEventListener("resize", ajustaMain);


/******************************
 * Dados do quiz (fornecidos)
 ******************************/
const questoes = [
    { id:1, pergunta:"Por que o Egito é frequentemente chamado de 'dádiva do Nilo'?",
    alternativas:[
        "Porque as cheias anuais do rio fertilizavam o solo, permitindo a agricultura",
        "Porque o Nilo era o maior deserto da região e impedia invasões",
        "Porque o Nilo era a única fonte de metais preciosos do Egito",
        "Porque o Nilo definia as fronteiras políticas com outros reinos"
    ], correta:0 },
    { id:2, pergunta:"Além da fertilidade do solo, qual foi um papel essencial do Rio Nilo para a civilização egípcia?",
    alternativas:[
        "Servir como depósito natural de pedras para as pirâmides",
        "Funcionar como rota de transporte e comunicação entre regiões",
        "Fornecer combustíveis fósseis para os templos",
        "Gerar energia elétrica para as cidades antigas"
    ], correta:1 },
    { id:3, pergunta:"Na organização social egípcia, qual era a principal função dos escribas?",
    alternativas:[
        "Comandar exércitos nas fronteiras",
        "Cuidar dos rituais de mumificação",
        "Registrar e administrar informações do Estado, contabilidade e comunicações",
        "Realizar a cobrança de impostos por meio de força militar"
    ], correta:2 },
    { id:4, pergunta:"Qual era o principal objetivo da mumificação para os egípcios?",
    alternativas:[
        "Preservar o corpo para garantir a passagem da alma à vida após a morte",
        "Preparar o corpo para ser usado em trabalhos agrícolas",
        "Impedir a disseminação de doenças pela cidade",
        "Transformar o falecido em uma divindade solar"
    ], correta:0 },
    { id:5, pergunta:"Associe corretamente a divindade ao seu domínio:",
    alternativas:[
        "Rá – deus do sol",
        "Osíris – deus da guerra",
        "Ísis – deusa da colheita e do comércio marítimo",
        "Anúbis – deus das tempestades do deserto"
    ], correta:0 },
    { id:6, pergunta:"Qual sistema de escrita foi desenvolvido e amplamente utilizado pelos egípcios antigos?",
    alternativas:[ "Cuneiforme", "Alfabeto fenício", "Hieróglifos", "Silabário micênico"], correta:2 },
    { id:7, pergunta:"Em que os conhecimentos de astronomia ajudavam diretamente a vida no Egito Antigo?",
    alternativas:[
        "Na criação de mapas políticos das províncias",
        "Na organização do calendário agrícola e previsão das cheias",
        "Na extração de metais das margens do Nilo",
        "Na construção de navios para guerras marítimas"
    ], correta:1 },
    { id:8, pergunta:"Qual era a finalidade principal das pirâmides dentro da cultura egípcia?",
    alternativas:[
        "Servirem como arenas de entretenimento público",
        "Funcionarem como escolas para escribas",
        "Serem tumbas monumentais ligadas às crenças na vida após a morte",
        "Atuarem como armazéns de alimentos contra períodos de seca"
    ], correta:2 }
];

/******************************
 * Estado do quiz
 ******************************/
let respostas = Array(questoes.length).fill(null);
let indiceAtual = 0;

// Elementos
const homePage = document.getElementById('home');
const quizPage = document.getElementById('quiz-page');
const questionArea = document.getElementById('question-area');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('submit-quiz');
const resetBtn = document.getElementById('reset-quiz');
const progressBar = document.getElementById('progress-bar');
const totalQEl = document.getElementById('total-q');

const modalBackdrop = document.getElementById('modal-backdrop');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const modalScore = document.getElementById('modal-score');
const modalClose = document.getElementById('modal-close');
const modalBackHome = document.getElementById('modal-back-home');

// Nav / links
document.querySelectorAll('.nav-link').forEach(a => {
    a.addEventListener('click', (e) => {
    const target = a.getAttribute('data-target');

    if(target === 'quiz'){
        e.preventDefault();
        showQuiz();
        return;
    }

    const href = a.getAttribute('href');
    if(href && href.startsWith('#')){
        e.preventDefault();
        // Se estiver no quiz, volta para a "página" home antes de rolar
        if(quizPage.classList.contains('active')) {
        hideQuiz(false);
        setTimeout(()=> {
            const el = document.querySelector(href);
            if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
        }, 150);
        } else {
        const el = document.querySelector(href);
        if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
        }
    }
    });
});

// Botões para abrir quiz
document.getElementById('start-quiz-btn').addEventListener('click', showQuiz);
document.getElementById('end-quiz-btn').addEventListener('click', showQuiz);
document.getElementById('open-quiz-from-toc').addEventListener('click', (e) => { e.preventDefault(); showQuiz(); });
document.getElementById('to-quiz').addEventListener('click', (e) => { e.preventDefault(); showQuiz(); });


// Quiz: inicialização
function initQuiz(){
    respostas = Array(questoes.length).fill(null);
    indiceAtual = 0;
    totalQEl.textContent = questoes.length;
    renderPergunta();
    updateProgress();
}

// Mostrar quiz como PÁGINA separada
function showQuiz(){
    homePage.classList.remove('active');
    quizPage.classList.add('active');
    window.scrollTo({top:0, behavior:'smooth'});
    initQuiz();
}

// Voltar para HOME
function hideQuiz(scrollToIntro = true){
    quizPage.classList.remove('active');
    homePage.classList.add('active');
    if(scrollToIntro){
    const el = document.getElementById('introducao');
    (el || document.body).scrollIntoView({behavior:'smooth', block:'start'});
    }
}

function renderPergunta(){
    const q = questoes[indiceAtual];
    questionArea.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.className = 'fade-in';

    const qnum = document.createElement('div');
    qnum.style.fontSize='0.95rem';
    qnum.style.color='#5a4637';
    qnum.style.marginBottom='6px';
    qnum.textContent = `Questão ${indiceAtual+1} de ${questoes.length}`;
    wrapper.appendChild(qnum);

    const qtext = document.createElement('div');
    qtext.className = 'qtext';
    qtext.textContent = q.pergunta;
    wrapper.appendChild(qtext);

    const altbox = document.createElement('div');
    altbox.className = 'alts';
    q.alternativas.forEach((alt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'alt';
    btn.setAttribute('data-idx', idx);
    btn.textContent = alt;
    btn.addEventListener('click', () => {
        respostas[indiceAtual] = idx;
        altbox.querySelectorAll('.alt').forEach(el=>el.classList.remove('selected'));
        btn.classList.add('selected');
    });
    altbox.appendChild(btn);
    });

    wrapper.appendChild(altbox);

    if(respostas[indiceAtual] !== null){
    const sel = altbox.querySelector('[data-idx="'+respostas[indiceAtual]+'"]');
    if(sel) sel.classList.add('selected');
    }

    questionArea.appendChild(wrapper);

    prevBtn.disabled = (indiceAtual === 0);
    nextBtn.disabled = (indiceAtual === questoes.length - 1);
}

prevBtn.addEventListener('click', ()=> {
    if(indiceAtual > 0){
    indiceAtual--;
    renderPergunta();
    updateProgress();
    }
});
nextBtn.addEventListener('click', ()=> {
    if(indiceAtual < questoes.length - 1){
    indiceAtual++;
    renderPergunta();
    updateProgress();
    }
});

function updateProgress(){
    const percent = Math.round(((indiceAtual) / (questoes.length - 1)) * 100);
    progressBar.style.width = (isFinite(percent) ? percent : 0) + '%';
}

resetBtn.addEventListener('click', ()=>{
    if(confirm('Deseja limpar todas as respostas e reiniciar o quiz?')){
    respostas = Array(questoes.length).fill(null);
    indiceAtual = 0;
    renderPergunta();
    updateProgress();
    }
});

submitBtn.addEventListener('click', ()=>{
    if(!confirm('Enviar respostas e ver sua nota?')) return;
    let acertos = 0;
    questoes.forEach((q, idx) => { if(respostas[idx] === q.correta) acertos++; });
    const total = questoes.length;
    const percent = Math.round((acertos/total)*100);

    let msg = '';
    if(percent >= 85) msg = 'Excelente! Você domina bem o conteúdo do Egito Antigo. 🏆';
    else if(percent >= 60) msg = 'Muito bom! Boa compreensão — revise alguns pontos e fica ainda melhor. ✔️';
    else if(percent >= 35) msg = 'Bom começo! Continue estudando — revise as seções indicadas. ✨';
    else msg = 'Não desanime — reveja o material com calma e tente novamente. 📖';

    modalTitle.textContent = `Nota: ${percent}%`;
    modalMessage.textContent = msg;
    modalScore.textContent = `${acertos} / ${total}`;
    modalBackdrop.style.display = 'flex';
    modalBackdrop.setAttribute('aria-hidden','false');
});

// Modal
modalClose?.addEventListener('click', ()=> {
    modalBackdrop.style.display = 'none';
    modalBackdrop.setAttribute('aria-hidden','true');
});
modalBackdrop.addEventListener('click', (e)=> {
    if(e.target === modalBackdrop){
    modalBackdrop.style.display = 'none';
    modalBackdrop.setAttribute('aria-hidden','true');
    }
});
modalBackHome.addEventListener('click', ()=> {
    modalBackdrop.style.display = 'none';
    modalBackdrop.setAttribute('aria-hidden','true');
    hideQuiz();
});

// Accordion
document.querySelectorAll('.acc-head').forEach(h => {
    h.addEventListener('click', () => {
    const body = h.nextElementSibling;
    const chev = h.querySelector('.chev');
    if(body.style.display === 'block'){
        body.style.display = 'none';
        chev.style.transform = 'rotate(0deg)';
    } else {
        body.style.display = 'block';
        chev.style.transform = 'rotate(180deg)';
    }
    });
});

// Smooth scroll ToC
document.querySelectorAll('.toc-link').forEach(a => {
    a.addEventListener('click', (e) => {
    e.preventDefault();
    const href = a.getAttribute('href');
    const el = document.querySelector(href);
    if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
    });
});

// Offset dinâmico do header fixo (evita sobreposição)
function updateHeaderOffset(){
    const h = document.querySelector('header');
    if(!h) return;
    const height = h.offsetHeight;
    document.documentElement.style.setProperty('--header-h', height + 'px');
}
window.addEventListener('load', updateHeaderOffset);
window.addEventListener('resize', updateHeaderOffset);
