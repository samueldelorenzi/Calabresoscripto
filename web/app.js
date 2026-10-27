(() => {
'use strict';

const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const sleep = ms => new Promise(r => setTimeout(r, ms));
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const pick = arr => arr[Math.floor(Math.random() * arr.length)];

const STORE = { code: 'clb98.code', file: 'clb98.file', sound: 'clb98.sound', booted: 'clb98.booted' };

/* ==================================================================== */
/* Conteúdo                                                             */
/* ==================================================================== */

const DEFAULT_CODE = `Fofoco Esse é um comentário e será ignorado pelo máquino

CNPJoto (Calabreso SOMAR(Calabreso NumA, Calabreso NumB))
    Dipirono NumA + NumB;
Sonho de Valso

Casos Bahio
    Boleno Teste = Verdado;

    Iveto Sangalo (Teste == Verdado)
        Calabreso SomaAB = Bruno Marquezino SOMAR(10, 5);
        Impressoro("O RESULTADO EH %d, MEU DELICIO!", SomaAB);
    Mato Atlantico
        Impressoro("Deu ruim!");
    Sonho de Valso
Sonho de Valso
`;

const EXAMPLES = [
    { name: 'Olá, Calabreso (padrão)', file: 'programa.clb', code: DEFAULT_CODE },
    { name: 'Contador com Cinderelo', file: 'contador.clb', code:
`Fofoco Cinderelo é o for. A variável precisa existir antes!

Casos Bahio
    Calabreso i = 0;

    Cinderelo (i = 1; i <= 5; i++)
        Impressoro("Calabreso numero %d saindo do forno!", i);
    Sonho de Valso

    Impressoro("Pizza pronta, meu delicio!");
Sonho de Valso
` },
    { name: 'Foguete com Rito Cadilaco', file: 'foguete.clb', code:
`Fofoco Rito Cadilaco é o while

Casos Bahio
    Calabreso Foguete = 5;

    Rito Cadilaco (Foguete > 0)
        Impressoro("%d...", Foguete);
        Foguete--;
    Sonho de Valso

    Impressoro("DECOLOU O CALABRESO!");
Sonho de Valso
` },
    { name: 'Fatorial recursivo', file: 'fatorial.clb', code:
`Fofoco Funções (CNPJoto) vêm antes do Casos Bahio

CNPJoto (Calabreso FATORIAL(Calabreso N))
    Iveto Sangalo (N <= 1)
        Dipirono 1;
    Sonho de Valso
    Dipirono N * Bruno Marquezino FATORIAL(N - 1);
Sonho de Valso

Casos Bahio
    Calabreso i = 0;

    Cinderelo (i = 1; i <= 7; i++)
        Calabreso F = Bruno Marquezino FATORIAL(i);
        Impressoro("%d! = %d", i, F);
    Sonho de Valso
Sonho de Valso
` },
    { name: 'Erro de propósito (pra ver o Toninho)', file: 'bugado.clb', code:
`Fofoco Esse programa tem um erro de propósito.
Fofoco Ache o ponto e vírgula perdido, meu calabreso!

Casos Bahio
    Calabreso Fatias = 8
    Impressoro("Temos %d fatias de calabreso", Fatias);
Sonho de Valso
` },
];

const DICT = [
    { group: 'Estrutura', icon: 'ico-notepad', items: [
        ['Casos Bahio', 'início'], ['Sonho de Valso', 'fim de bloco'],
    ] },
    { group: 'Tipos', icon: 'ico-disk', items: [
        ['Boleno', 'bool'], ['Calabreso', 'int'], ['Tubaíno', 'float'], ['Madono', 'char'],
        ['Mussarelo', 'long'], ['Linguiço', 'short'], ['Salsicho', 'double'], ['Cebolo', 'unsigned'],
    ] },
    { group: 'Valores', icon: 'ico-info', items: [
        ['Verdado', 'true'], ['Mentiro', 'false'],
    ] },
    { group: 'Comentários', icon: 'ico-question', items: [
        ['Fofoco', '// comentário'],
    ] },
    { group: 'Entrada / Saída', icon: 'ico-dos', items: [
        ['Impressoro', 'print', 'Impressoro("");'], ['Samsungo', 'scan / input'],
    ] },
    { group: 'Condicionais', icon: 'ico-warn', items: [
        ['Iveto Sangalo', 'if', 'Iveto Sangalo ()'], ['Patrício Poeto', 'else if'], ['Mato Atlântico', 'else'],
    ] },
    { group: 'Loops', icon: 'ico-run', items: [
        ['Rito Cadilaco', 'while', 'Rito Cadilaco ()'], ['Cinderelo', 'for', 'Cinderelo (i = 0; i < 10; i++)'],
        ['Borboleto', 'break'], ['Tilápio', 'continue'],
    ] },
    { group: 'Funções', icon: 'ico-folder', items: [
        ['CNPJoto', 'criar função'], ['Bruno Marquezino', 'chamar função'], ['Dipirono', 'return'],
    ] },
];

const TIPS = [
    'Esqueceu o Sonho de Valso? O compilador não perdoa, meu mortadelo.',
    'Use Fofoco pra comentar. O máquino ignora, igual sua tia no grupo da família.',
    'Impressoro aceita %d, igual o printf do C. Só que mais calabreso.',
    'F5 executa o código. Ctrl+S salva. Ctrl+Alt+Del não faz nada, para de tentar.',
    'Cinderelo é o for. A variável tem que estar declarada antes, senão o Iveto reclama.',
    'Funções CNPJoto ficam antes do Casos Bahio. Burocracia é assim mesmo.',
    'Dipirono retorna o valor. E também cura dor de cabeça de compilador.',
    'Dá duplo clique numa palavra do Dicionário que eu jogo ela no código pra você.',
    'Seu código fica salvo sozinho no navegador. Pode ir tomar um Tubaíno tranquilo.',
    'Tem uns exemplos prontos no menu Exemplos. Copia sem vergonha, é tudo nosso.',
    'Me clica que eu compilo. Sou um tornado de produtividade.',
];

const WIN_PHRASES = [
    'Compilou de primeira! Tá on fire, meu calabreso!',
    'Rodou liso igual Tubaíno gelado.',
    'Zero erros. O Iveto ficaria orgulhoso.',
    'Delício! Programa executado com sucesso.',
    'Isso aí! Mais um calabreso saindo do forno.',
];

/* ==================================================================== */
/* Sons (WebAudio, sem arquivos)                                         */
/* ==================================================================== */

const sound = {
    on: localStorage.getItem(STORE.sound) !== 'off',
    ctx: null,
};

function play(name) {
    if (!sound.on) return;
    try {
        sound.ctx = sound.ctx || new (window.AudioContext || window.webkitAudioContext)();
    } catch { return; }
    const ctx = sound.ctx;
    const now = ctx.currentTime;
    const note = (freq, at, dur, type = 'triangle', vol = 0.08) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, now + at);
        gain.gain.linearRampToValueAtTime(vol, now + at + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + at + dur);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now + at);
        osc.stop(now + at + dur + 0.05);
    };
    if (name === 'tada') {
        [523, 659, 784].forEach((f, i) => note(f, i * 0.08, 0.25));
        [523, 659, 784, 1047].forEach(f => note(f, 0.26, 0.7, 'triangle', 0.05));
    } else if (name === 'error') {
        note(311, 0, 0.35, 'square', 0.04);
        note(415, 0, 0.35, 'square', 0.04);
    } else if (name === 'ding') {
        note(1319, 0, 0.4, 'sine', 0.08);
        note(1760, 0.02, 0.3, 'sine', 0.03);
    } else if (name === 'startup') {
        [392, 523, 659, 784, 1047].forEach((f, i) => note(f, i * 0.12, 0.9, 'sine', 0.05));
    }
}

/* ==================================================================== */
/* Destaque de sintaxe (espelha a ordem do lexer.py)                     */
/* ==================================================================== */

const TOKEN_RE = new RegExp([
    '(Fofoco.*)',
    '("[^"\\n]*")',
    '(Casos\\s+Bahio|Sonho\\s+de\\s+Valso)',
    '(Madono|Boleno|Lingui[çc]o|Calabreso|Mussarelo|Tuba[íi]no|Salsicho|Cebolo)',
    '(Verdado|Mentiro)',
    '(Impressoro|Samsungo)',
    '(Iveto\\s+Sangalo|Patr[íi]cio\\s+Poeto|Mato\\s+Atl[âa]ntico|Rito\\s+Cadilaco|Cinderelo|Til[áa]pio|Borboleto)',
    '(CNPJoto|Dipirono|Bruno\\s+Marquezino)',
    '(\\d+(?:\\.\\d+)?)',
    '([A-Za-z_][A-Za-z0-9_]*)',
    '(\\+\\+|--|==|!=|<=|>=|[<>=+\\-*/&,();])',
].join('|'), 'gi');

const TOKEN_CLASS = [null, 'tk-comment', 'tk-str', 'tk-block', 'tk-type', 'tk-bool', 'tk-io', 'tk-flow', 'tk-func', 'tk-num', null, 'tk-op'];

function highlight(src) {
    let html = '';
    let last = 0;
    const gap = text => text.replace(/[^\s]+/g, bad => `<span class="tk-bad">${esc(bad)}</span>`);
    TOKEN_RE.lastIndex = 0;
    for (let m; (m = TOKEN_RE.exec(src));) {
        html += gap(src.slice(last, m.index));
        const group = m.findIndex((g, i) => i > 0 && g !== undefined);
        const cls = TOKEN_CLASS[group];
        html += cls ? `<span class="${cls}">${esc(m[0])}</span>` : esc(m[0]);
        last = TOKEN_RE.lastIndex;
    }
    return html + gap(src.slice(last));
}

/* ==================================================================== */
/* Editor                                                               */
/* ==================================================================== */

const ta = $('#code');
const hl = $('#highlight');
const gutter = $('#gutter');
const gutterInner = document.createElement('div');
gutterInner.className = 'gutter-inner';
gutter.append(gutterInner);

const editor = {
    fileName: localStorage.getItem(STORE.file) || 'programa.clb',
    saved: '',
    errLine: 0,
};

function setCode(code, fileName) {
    ta.value = code;
    editor.saved = code;
    if (fileName) editor.fileName = fileName;
    ta.scrollTop = ta.scrollLeft = 0;
    ta.setSelectionRange(0, 0);
    clearErr();
    renderEditor();
}

function isDirty() { return ta.value !== editor.saved; }

let saveTimer;
function renderEditor() {
    const src = ta.value;
    const lines = src.split('\n').length;
    const err = editor.errLine && editor.errLine <= lines
        ? `<span class="err-line" style="top:${6 + (editor.errLine - 1) * 20}px"></span>`
        : '';
    hl.innerHTML = highlight(src) + '\n' + err;

    let g = '';
    for (let i = 1; i <= lines; i++) g += i === editor.errLine ? `<div class="err">${i}</div>` : `<div>${i}</div>`;
    gutterInner.innerHTML = g;

    $('#file-name').textContent = editor.fileName;
    $('#dirty').textContent = isDirty() ? ' *' : '';
    $('#status-len').textContent = `${lines} ${lines === 1 ? 'linho' : 'linhos'}`;
    syncScroll();
    updateCaret();
    renderTasks();

    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
        localStorage.setItem(STORE.code, src);
        localStorage.setItem(STORE.file, editor.fileName);
    }, 300);
}

function syncScroll() {
    hl.style.transform = `translate(${-ta.scrollLeft}px, ${-ta.scrollTop}px)`;
    gutterInner.style.transform = `translateY(${-ta.scrollTop}px)`;
}

function updateCaret() {
    const before = ta.value.slice(0, ta.selectionStart).split('\n');
    $('#status-pos').textContent = `Ln ${before.length}, Col ${before[before.length - 1].length + 1}`;
}

function clearErr() {
    editor.errLine = 0;
}

function insertText(text) {
    ta.focus();
    if (!document.execCommand('insertText', false, text)) {
        ta.setRangeText(text, ta.selectionStart, ta.selectionEnd, 'end');
        ta.dispatchEvent(new Event('input'));
    }
}

function goToLine(n) {
    const lines = ta.value.split('\n');
    let start = 0;
    for (let i = 0; i < n - 1 && i < lines.length; i++) start += lines[i].length + 1;
    const end = start + (lines[n - 1] || '').length;
    openWin('win-editor');
    ta.focus();
    ta.setSelectionRange(start, end);
    ta.scrollTop = Math.max(0, (n - 4) * 20);
    syncScroll();
    updateCaret();
}

ta.addEventListener('input', () => {
    if (editor.errLine) clearErr();
    renderEditor();
});
ta.addEventListener('scroll', syncScroll);
['keyup', 'click', 'select'].forEach(ev => ta.addEventListener(ev, updateCaret));

ta.addEventListener('keydown', e => {
    if (e.key === 'Tab' && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        insertText('    ');
    } else if (e.key === 'Enter' && !e.ctrlKey && !e.shiftKey && !e.metaKey) {
        const lineStart = ta.value.lastIndexOf('\n', ta.selectionStart - 1) + 1;
        const indent = ta.value.slice(lineStart, ta.selectionStart).match(/^[ \t]*/)[0];
        if (indent) {
            e.preventDefault();
            insertText('\n' + indent);
        }
    }
});

/* ==================================================================== */
/* Gerenciador de janelas                                               */
/* ==================================================================== */

const desktop = $('#desktop');
const wins = $$('.window', desktop);
let zTop = 20;

const isMobile = () => document.body.classList.contains('mobile');

function topVisible(except) {
    return wins
        .filter(w => w !== except && !w.classList.contains('closed') && !w.classList.contains('minimized'))
        .sort((a, b) => (+b.style.zIndex || 0) - (+a.style.zIndex || 0))[0];
}

function focusWin(w) {
    wins.forEach(x => x.classList.toggle('active', x === w));
    if (w) w.style.zIndex = ++zTop;
    renderTasks();
}

function openWin(id) {
    const w = document.getElementById(id);
    if (!w) return;
    const wasHidden = w.classList.contains('closed') || w.classList.contains('minimized');
    w.classList.remove('closed', 'minimized');
    if (wasHidden) {
        w.classList.add('opening');
        setTimeout(() => w.classList.remove('opening'), 200);
    }
    focusWin(w);
    if (isMobile()) w.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function minimizeWin(w) {
    w.classList.add('minimized');
    focusWin(topVisible(w));
}

function closeWin(w) {
    w.classList.add('closed');
    w.classList.remove('maximized');
    focusWin(topVisible(w));
}

function toggleMax(w) {
    if (isMobile()) return;
    w.classList.toggle('maximized');
    focusWin(w);
}

function renderTasks() {
    const list = $('#task-list');
    list.innerHTML = '';
    wins.filter(w => !w.classList.contains('closed')).forEach(w => {
        const btn = document.createElement('button');
        const pressed = w.classList.contains('active') && !w.classList.contains('minimized');
        const title = w.id === 'win-editor' ? `${editor.fileName} - Bloco de Calabresos` : w.dataset.title;
        btn.className = 'task-btn' + (pressed ? ' pressed' : '');
        btn.title = title;
        btn.innerHTML = `<span class="ico ${w.dataset.icon} sm"></span><span></span>`;
        btn.lastChild.textContent = title;
        btn.addEventListener('click', () => (pressed ? minimizeWin(w) : openWin(w.id)));
        list.append(btn);
    });
}

function makeDraggable(handle, onMove, onStart) {
    handle.addEventListener('pointerdown', e => {
        if (e.button !== 0 || e.target.closest('button')) return;
        const start = onStart(e);
        if (!start) return;
        e.preventDefault();
        handle.setPointerCapture(e.pointerId);
        const move = ev => onMove(ev.clientX - e.clientX, ev.clientY - e.clientY, start);
        const up = () => {
            handle.removeEventListener('pointermove', move);
            handle.removeEventListener('pointerup', up);
            handle.removeEventListener('pointercancel', up);
        };
        handle.addEventListener('pointermove', move);
        handle.addEventListener('pointerup', up);
        handle.addEventListener('pointercancel', up);
    });
}

wins.forEach(w => {
    w.addEventListener('pointerdown', () => {
        if (!w.classList.contains('active')) focusWin(w);
    });

    const bar = $('.title-bar', w);
    bar.addEventListener('dblclick', e => {
        if (!e.target.closest('button')) toggleMax(w);
    });
    makeDraggable(bar, (dx, dy, s) => {
        const D = desktop.getBoundingClientRect();
        const x = Math.min(Math.max(s.x + dx, 60 - w.offsetWidth), D.width - 60);
        const y = Math.min(Math.max(s.y + dy, 0), D.height - 24);
        w.style.left = x + 'px';
        w.style.top = y + 'px';
    }, () => {
        if (isMobile() || w.classList.contains('maximized')) return null;
        w.dataset.moved = '1';
        return { x: w.offsetLeft, y: w.offsetTop };
    });

    const grip = document.createElement('div');
    grip.className = 'resizer';
    w.append(grip);
    makeDraggable(grip, (dx, dy, s) => {
        w.style.width = Math.max(240, s.w + dx) + 'px';
        w.style.height = Math.max(160, s.h + dy) + 'px';
    }, () => {
        if (isMobile()) return null;
        w.dataset.moved = '1';
        return { w: w.offsetWidth, h: w.offsetHeight };
    });

    $$('[data-win]', w).forEach(btn => btn.addEventListener('click', () => {
        const act = btn.dataset.win;
        if (act === 'min') minimizeWin(w);
        else if (act === 'max') toggleMax(w);
        else closeWin(w);
    }));
});

let firstLayout = true;
function layout() {
    const mobile = innerWidth < 860 || innerHeight < 520;
    document.body.classList.toggle('mobile', mobile);
    if (mobile) return;

    const W = desktop.clientWidth;
    const H = desktop.clientHeight;
    const pad = 12;
    const left0 = 100;
    const help = $('#win-help');
    const ed = $('#win-editor');
    const dos = $('#win-dos');

    const showHelp = W >= 1100;
    if (firstLayout && !showHelp) help.classList.add('minimized');

    const helpW = showHelp ? Math.round(Math.min(Math.max(W * 0.2, 240), 300)) : 0;
    const edX = left0 + (showHelp ? helpW + pad : 0);
    const rest = W - edX - pad * 2;
    const edW = Math.round(rest * 0.57);
    const dosX = edX + edW + pad;
    const dosW = W - dosX - pad;

    const place = (w, x, y, width, height) => {
        if (w.dataset.moved && !firstLayout) return;
        Object.assign(w.style, { left: x + 'px', top: y + 'px', width: width + 'px', height: height + 'px' });
    };
    if (showHelp) place(help, left0, pad, helpW, H - pad * 2);
    else place(help, left0 + 30, pad + 30, 280, Math.min(560, H - 80));
    place(ed, edX, pad, edW, H - pad * 2);
    place(dos, dosX, pad, dosW, Math.max(220, H - pad - 270));
    firstLayout = false;
}

let resizeTimer;
new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layout, 80);
}).observe(document.body);

/* ==================================================================== */
/* Menus e menu Iniciar                                                 */
/* ==================================================================== */

const startBtn = $('#start-btn');
const startMenu = $('#start-menu');

function closeMenus() {
    $$('.menu.open').forEach(m => m.classList.remove('open'));
    startMenu.hidden = true;
    startBtn.classList.remove('open');
}

$$('.menu').forEach(menu => {
    const title = $('.menu-title', menu);
    title.addEventListener('click', () => {
        const wasOpen = menu.classList.contains('open');
        closeMenus();
        menu.classList.toggle('open', !wasOpen);
    });
    title.addEventListener('mouseenter', () => {
        if ($('.menu.open') && !menu.classList.contains('open')) {
            closeMenus();
            menu.classList.add('open');
        }
    });
});

startBtn.addEventListener('click', () => {
    const open = startMenu.hidden;
    closeMenus();
    startMenu.hidden = !open;
    startBtn.classList.toggle('open', open);
});

document.addEventListener('pointerdown', e => {
    if (!e.target.closest('.menu, .start-menu, .start-btn')) closeMenus();
    if (!e.target.closest('.desk-icon')) $$('.desk-icon.selected').forEach(i => i.classList.remove('selected'));
});

const exMenu = $('#examples-menu');
EXAMPLES.forEach((ex, i) => {
    const b = document.createElement('button');
    b.textContent = ex.name;
    b.dataset.action = 'example';
    b.dataset.index = i;
    exMenu.append(b);
});

/* ==================================================================== */
/* Ícones do desktop                                                    */
/* ==================================================================== */

$$('.desk-icon').forEach(icon => {
    const activate = () => {
        if (icon.dataset.open) openWin(icon.dataset.open);
        else actions[icon.dataset.action]?.(icon);
    };
    icon.addEventListener('click', () => {
        $$('.desk-icon.selected').forEach(i => i.classList.remove('selected'));
        icon.classList.add('selected');
    });
    icon.addEventListener('dblclick', activate);
    icon.addEventListener('keydown', e => {
        if (e.key === 'Enter') { e.preventDefault(); activate(); }
    });
});

/* ==================================================================== */
/* Dicionário                                                           */
/* ==================================================================== */

const dictList = $('#dict-list');
DICT.forEach(({ group, icon, items }) => {
    const head = document.createElement('div');
    head.className = 'lv-group';
    head.innerHTML = `<span class="ico ${icon} sm"></span>`;
    head.append(group);
    dictList.append(head);
    items.forEach(([kw, meaning, snippet]) => {
        const row = document.createElement('div');
        row.className = 'lv-row';
        row.innerHTML = '<span class="kw"></span><span class="eq"></span>';
        row.firstChild.textContent = kw;
        row.lastChild.textContent = meaning;
        row.dataset.insert = snippet || kw + ' ';
        dictList.append(row);
    });
});

dictList.addEventListener('click', e => {
    const row = e.target.closest('.lv-row');
    if (!row) return;
    $$('.lv-row.selected', dictList).forEach(r => r.classList.remove('selected'));
    row.classList.add('selected');
    $('#dict-status').textContent = `${row.firstChild.textContent} = ${row.lastChild.textContent}`;
    if (isMobile()) insertFromDict(row);
});
dictList.addEventListener('dblclick', e => {
    const row = e.target.closest('.lv-row');
    if (row && !isMobile()) insertFromDict(row);
});

function insertFromDict(row) {
    openWin('win-editor');
    insertText(row.dataset.insert);
    setStatus(`Inserido: ${row.firstChild.textContent}`);
}

$$('.tab').forEach(tab => tab.addEventListener('click', () => {
    $$('.tab').forEach(t => t.classList.toggle('active', t === tab));
    $$('.tab-panel').forEach(p => (p.hidden = p.dataset.panel !== tab.dataset.tab));
}));

/* ==================================================================== */
/* Diálogos                                                             */
/* ==================================================================== */

const modalLayer = $('#modal-layer');

function dialog({ title, icon, message, html, buttons = ['OK'], onMount }) {
    return new Promise(resolve => {
        const win = document.createElement('section');
        win.className = 'window dialog';
        win.setAttribute('role', 'dialog');
        win.innerHTML = `
            <header class="title-bar">
                <span class="title-text"></span>
                <div class="title-buttons">
                    <button class="tb-btn" data-close aria-label="Fechar"><span class="g-close"></span></button>
                </div>
            </header>
            <div class="dialog-body">
                ${icon ? `<span class="ico ${icon}"></span>` : ''}
                <div class="dialog-msg"></div>
            </div>
            <div class="dialog-buttons"></div>`;
        $('.title-text', win).textContent = title;
        const msg = $('.dialog-msg', win);
        if (html) msg.innerHTML = html;
        else msg.textContent = message;

        let done = false;
        const finish = value => {
            if (done) return;
            done = true;
            win.remove();
            document.removeEventListener('keydown', onKey, true);
            if (!modalLayer.children.length) modalLayer.hidden = true;
            resolve(value);
        };
        const onKey = e => {
            if (e.key === 'Escape') { e.stopPropagation(); finish(null); }
        };

        const row = $('.dialog-buttons', win);
        buttons.forEach((label, i) => {
            const b = document.createElement('button');
            b.className = 'btn' + (i === 0 ? ' default' : '');
            b.textContent = label;
            b.addEventListener('click', () => finish(label));
            row.append(b);
        });
        $('[data-close]', win).addEventListener('click', () => finish(null));

        let off = { x: 0, y: 0 };
        makeDraggable($('.title-bar', win), (dx, dy, s) => {
            off = { x: s.x + dx, y: s.y + dy };
            win.style.transform = `translate(${off.x}px, ${off.y}px)`;
        }, () => ({ ...off }));

        modalLayer.hidden = false;
        modalLayer.append(win);
        document.addEventListener('keydown', onKey, true);
        row.firstChild?.focus();
        onMount?.(win, finish);
    });
}

function progressDialog() {
    const handle = { close() {} };
    const steps = [
        'Lendo os tokens com o lexer.py...',
        'Montando a árvore no parser_clb.py...',
        'Esquentando a chapa do interpreter.py...',
        'Fatiando a calabresa...',
    ];
    dialog({
        title: 'Compilando...',
        html: `
            <div class="flying"><span class="ico ico-folder"></span><span class="ico ico-run"></span><span class="ico ico-folder"></span></div>
            <div class="step">${steps[0]}</div>
            <div class="dim-text">Tempo restante: 3 calabresos</div>
            <div class="progress"><div></div></div>`,
        buttons: ['Cancelar'],
        onMount(win, finish) {
            const bar = $('.progress > div', win);
            const step = $('.step', win);
            const eta = $('.dim-text', win);
            let p = 0;
            const timer = setInterval(() => {
                p = Math.min(p + 6 + Math.random() * 16, 96);
                bar.style.width = p + '%';
                step.textContent = steps[Math.min(steps.length - 1, Math.floor(p / 25))];
                eta.textContent = `Tempo restante: ${Math.max(1, Math.ceil((100 - p) / 30))} calabreso(s)`;
            }, 120);
            handle.close = () => {
                clearInterval(timer);
                bar.style.width = '100%';
                finish(null);
            };
        },
    }).then(v => {
        if (v === 'Cancelar') say('Não dá pra cancelar um tornado, meu calabreso.');
    });
    return handle;
}

/* ==================================================================== */
/* Assistente Toninho                                                   */
/* ==================================================================== */

const bubble = $('#bubble');
const toninho = $('.toninho');
let bubbleTimer;
let lastTip = -1;

function say(text, ms = 9000) {
    $('#bubble-text').textContent = text;
    bubble.classList.remove('hide');
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => bubble.classList.add('hide'), ms);
}

function tip() {
    let i;
    do { i = Math.floor(Math.random() * TIPS.length); } while (i === lastTip && TIPS.length > 1);
    lastTip = i;
    say(TIPS[i]);
}

/* ==================================================================== */
/* Prompt do MS-DOS                                                     */
/* ==================================================================== */

const dos = $('#output');
const dosTail = document.createElement('span');
dosTail.innerHTML = '<span class="prompt">C:\\CALABRESO&gt;</span><span class="cursor">_</span>';

function dosPrint(text, cls = 'out') {
    const span = document.createElement('span');
    span.className = cls;
    span.textContent = text + '\n';
    dos.insertBefore(span, dosTail);
    dos.scrollTop = dos.scrollHeight;
}

function dosReset() {
    dos.innerHTML = '';
    dos.append(dosTail);
    dosPrint('Microsofto(R) Calabreso 98', 'dim');
    dosPrint('   (C)Copyright Calabresosofto Corp 1981-1998.\n', 'dim');
    dosPrint('Aguardando o programo, meu calabreso...\n', 'out');
}

$('#dos-font').addEventListener('change', e => {
    dos.style.fontSize = e.target.value + 'px';
});

/* ==================================================================== */
/* Execução                                                             */
/* ==================================================================== */

let running = false;

function setStatus(text) {
    $('#status-msg').textContent = text;
}

async function runCode() {
    if (running) return;
    running = true;
    closeMenus();
    const hadFocus = document.activeElement === ta;

    const dosWin = $('#win-dos');
    if (dosWin.classList.contains('closed') || dosWin.classList.contains('minimized')) openWin('win-dos');

    document.body.classList.add('busy');
    toninho.classList.add('spinning');
    bubble.classList.add('hide');
    setStatus('Compilando... segura que é tornado!');
    clearErr();
    renderEditor();

    dosTail.hidden = true;
    dosPrint(`C:\\CALABRESO>calabreso ${editor.fileName}`, 'prompt');

    const progress = progressDialog();
    const minWait = sleep(900);
    let text = null;
    try {
        const res = await fetch('/run', {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
            body: ta.value,
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        text = await res.text();
    } catch {
        text = null;
    }
    await minWait;
    progress.close();

    document.body.classList.remove('busy');
    toninho.classList.remove('spinning');

    if (text === null) {
        dosPrint('Caiu a conexo! Reinicia o servidoro, meu emocionado!\n', 'err');
        setStatus('Servidor fora do ar.');
        play('error');
        say('Caiu a conexão! Roda o "python server.py" de novo, meu emocionado.');
        dialog({
            title: 'Erro de rede',
            icon: 'ico-warn',
            message: 'Não foi possível encontrar o servidoro.\n\nVerifique se o "python server.py" ainda está rodando e tente novamente.',
        });
    } else {
        const failed = /DEU RUIM NO SINTAXO|\[FALHA NO CALABRESOSCRIPTO\]/.test(text);
        const body = text.replace(/\s+$/, '');

        if (!body) {
            dosPrint('O compilaço deu bom! Mas cadê o Impressoro, meu mortadelo?', 'dim');
        } else {
            body.split('\n').forEach(line => {
                const isErr = failed && /DEU RUIM|FALHA|Erro|inválid|esperava/i.test(line);
                dosPrint(line, isErr ? 'err' : 'out');
            });
        }

        if (failed) {
            dosPrint('\nPrograma encerrado com calabresos queimados.\n', 'err');
            const lineMatch = text.match(/linha\s+(\d+)/i);
            const line = lineMatch ? +lineMatch[1] : 0;
            if (line) {
                editor.errLine = line;
                renderEditor();
            }
            setStatus(line ? `Erro na linha ${line}.` : 'Erro na execução.');
            play('error');
            say(line
                ? `Calmaaa, calabreso! Deu ruim na linha ${line}, mas a gente resolve.`
                : 'Calmaaa, calabreso! Todo erro tem conserto.');

            const msg = body.replace(/^\s*(DEU RUIM NO SINTAXO:|\[FALHA NO CALABRESOSCRIPTO\])\s*/m, '').trim();
            const choice = await dialog({
                title: 'CALABRESO.EXE',
                icon: 'ico-error',
                html: `Este programa executou uma operação ilegal e será fechado.<pre class="sunken">${esc(msg)}</pre>`,
                buttons: line ? ['OK', `Ir pra linha ${line}`] : ['OK'],
            });
            if (choice && choice !== 'OK') goToLine(line);
        } else {
            dosPrint('\nPrograma finalizado. 0 erro(s), 100% calabreso.\n', 'ok');
            setStatus('Compilaço concluído com sucesso.');
            play('tada');
            say(pick(WIN_PHRASES), 6000);
        }
    }

    dosTail.hidden = false;
    dos.scrollTop = dos.scrollHeight;
    running = false;
    if (hadFocus && modalLayer.hidden && document.activeElement !== ta) ta.focus();
}

/* ==================================================================== */
/* Arquivos                                                             */
/* ==================================================================== */

async function confirmDiscard() {
    if (!isDirty()) return true;
    const choice = await dialog({
        title: 'Bloco de Calabresos',
        icon: 'ico-warn',
        message: `O texto do arquivo ${editor.fileName} foi alterado.\n\nDeseja salvar as alterações?`,
        buttons: ['Sim', 'Não', 'Cancelar'],
    });
    if (choice === 'Sim') { saveFile(); return true; }
    return choice === 'Não';
}

function saveFile() {
    const blob = new Blob([ta.value], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = editor.fileName;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    editor.saved = ta.value;
    renderEditor();
    setStatus(`Salvo como ${editor.fileName}.`);
    play('ding');
}

const fileInput = $('#file-input');
fileInput.addEventListener('change', async () => {
    const file = fileInput.files[0];
    if (!file) return;
    setCode(await file.text(), file.name);
    openWin('win-editor');
    setStatus(`Aberto: ${file.name}`);
    fileInput.value = '';
});

/* ==================================================================== */
/* Ações                                                                */
/* ==================================================================== */

const actions = {
    run: runCode,
    tip,

    async new() {
        if (!(await confirmDiscard())) return;
        setCode('Casos Bahio\n    \nSonho de Valso\n', 'sem_titulo.clb');
        openWin('win-editor');
        ta.focus();
        ta.setSelectionRange(16, 16);
        updateCaret();
        setStatus('Novo arquivo. Bora calabresar.');
    },

    async open() {
        if (await confirmDiscard()) fileInput.click();
    },

    save: saveFile,

    async example(el) {
        const ex = EXAMPLES[+el.dataset.index];
        if (!ex || !(await confirmDiscard())) return;
        setCode(ex.code, ex.file);
        openWin('win-editor');
        setStatus(`Exemplo carregado: ${ex.name}`);
        say('Exemplo carregado! Agora me clica pra rodar.', 5000);
    },

    'clear-output'() {
        dosReset();
    },

    async 'copy-output'() {
        const text = $$('span:not(.cursor)', dos).filter(s => s.parentNode === dos && s !== dosTail).map(s => s.textContent).join('');
        try {
            await navigator.clipboard.writeText(text);
            say('Copiado pra área de transferência!', 3000);
        } catch {
            say('O navegador não deixou copiar. Coisa de Internet Explorero.', 4000);
        }
    },

    about() {
        dialog({
            title: 'Sobre o CalabresoScripto',
            html: `
                <div style="display:flex; gap:14px; align-items:flex-start">
                    <img class="about-img" src="/assets/toninho-tornado.jpeg" alt="Toninho Tornado">
                    <div>
                        <p class="about-title">Calabreso<b>Scripto</b> 98</p>
                        Versão 4.10.1998 (Edição Calabreso)<br>
                        Copyright &copy; 1998-${new Date().getFullYear()} Calabresosofto Corp.
                        <hr class="about-sep">
                        Licenciado para:<br>
                        <b>Meu Calabreso</b><br>
                        UNOESC Videira &mdash; Compiladores
                        <hr class="about-sep">
                        Memória disponível: 640 KB de calabresa<br>
                        Recursos do sistema: 98% livres
                    </div>
                </div>`,
        });
    },

    async trash() {
        const choice = await dialog({
            title: 'Confirmar exclusão',
            icon: 'ico-warn',
            message: 'Tem certeza que deseja esvaziar a Lixeira do Iveto?\n\nEla contém 3.141 calabresos queimados e 1 Sonho de Valso esquecido.',
            buttons: ['Sim', 'Não'],
        });
        if (choice === 'Sim') showBsod();
    },

    async shutdown() {
        closeMenus();
        let chosen = 'off';
        const choice = await dialog({
            title: 'Desligar o Calabreso',
            icon: 'ico-power',
            html: `O que você deseja que o computador faça?
                <fieldset>
                    <label><input type="radio" name="sd" value="off" checked> Desligar</label>
                    <label><input type="radio" name="sd" value="reboot"> Reiniciar</label>
                    <label><input type="radio" name="sd" value="dos"> Reiniciar no modo MS-DOSo</label>
                </fieldset>`,
            buttons: ['OK', 'Cancelar'],
            onMount(win) {
                win.addEventListener('change', e => { chosen = e.target.value; });
            },
        });
        if (choice !== 'OK') return;
        if (chosen === 'off') {
            $('#shutdown').hidden = false;
        } else if (chosen === 'reboot') {
            boot(true);
        } else {
            const d = $('#win-dos');
            openWin('win-dos');
            if (!d.classList.contains('maximized')) toggleMax(d);
        }
    },
};

document.addEventListener('click', e => {
    if (e.target.closest('.desktop-icons')) return;
    const opener = e.target.closest('[data-open]');
    const actor = e.target.closest('[data-action]');
    if (opener) {
        closeMenus();
        openWin(opener.dataset.open);
    } else if (actor && actions[actor.dataset.action]) {
        closeMenus();
        actions[actor.dataset.action](actor);
    }
});

/* ==================================================================== */
/* Atalhos de teclado                                                   */
/* ==================================================================== */

document.addEventListener('keydown', e => {
    const k = e.key.toLowerCase();
    if (!$('#bsod').hidden) {
        e.preventDefault();
        $('#bsod').hidden = true;
        return;
    }
    if (!modalLayer.hidden) return;
    if (e.key === 'F5' || (e.ctrlKey && e.key === 'Enter')) {
        e.preventDefault();
        runCode();
    } else if (e.ctrlKey && k === 's') {
        e.preventDefault();
        saveFile();
    } else if (e.ctrlKey && k === 'o') {
        e.preventDefault();
        actions.open();
    } else if (e.key === 'Escape') {
        closeMenus();
    }
});

/* ==================================================================== */
/* Telas cheias                                                         */
/* ==================================================================== */

function showBsod() {
    play('error');
    $('#bsod').hidden = false;
}
$('#bsod').addEventListener('click', () => { $('#bsod').hidden = true; });
$('#shutdown').addEventListener('click', () => {
    $('#shutdown').hidden = true;
    boot(true);
});

function boot(force) {
    const screen = $('#boot');
    if (!force && sessionStorage.getItem(STORE.booted)) {
        greet();
        return;
    }
    sessionStorage.setItem(STORE.booted, '1');
    screen.hidden = false;
    screen.classList.remove('fade');
    let ended = false;
    const end = () => {
        if (ended) return;
        ended = true;
        screen.classList.add('fade');
        setTimeout(() => { screen.hidden = true; }, 400);
        play('startup');
        greet();
    };
    screen.onclick = end;
    setTimeout(end, 2200);
}

function greet() {
    setTimeout(() => say('Parece que você está tentando escrever um calabreso. Quer ajuda? Me clica que eu compilo!', 10000), 500);
}

/* ==================================================================== */
/* Bandeja do sistema                                                   */
/* ==================================================================== */

const soundBtn = $('#sound-btn');
function renderSound() {
    const icon = $('.ico', soundBtn);
    icon.classList.toggle('ico-speaker', sound.on);
    icon.classList.toggle('ico-mute', !sound.on);
    soundBtn.title = sound.on ? 'Som ligado' : 'Som desligado';
}
soundBtn.addEventListener('click', () => {
    sound.on = !sound.on;
    localStorage.setItem(STORE.sound, sound.on ? 'on' : 'off');
    renderSound();
    play('ding');
});

function tick() {
    const now = new Date();
    const clock = $('#clock');
    clock.textContent = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    clock.title = now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

/* ==================================================================== */
/* Inicialização                                                        */
/* ==================================================================== */

const saved = localStorage.getItem(STORE.code);
setCode(saved !== null && saved.trim() ? saved : DEFAULT_CODE);
dosReset();
renderSound();
tick();
setInterval(tick, 10000);
layout();
focusWin($('#win-editor'));
boot(false);

})();
