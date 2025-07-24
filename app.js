/* ---------- 全局变量 ---------- */
let woerter      = {};   // 存放整个 JSON
let currentKey   = null; // 当前显示的英文 key
let changeCount  = 0;    // 修改计数器，>5 自动保存
const SAVE_URL   = '/save'; // 与后端约定好的保存接口

/* ---------- 初始化 ---------- */
window.addEventListener('DOMContentLoaded', init);

async function init() {
    woerter = await fetch('/m_de.json').then(r => r.json());

    // 绑定按钮
    document.getElementById('btnRandom').onclick  = randomSentence;
    document.getElementById('btnToggle').onclick  = toggleShow;
    document.getElementById('btnPlus10').onclick  = () => changeValue(10);
    document.getElementById('btnPlus3').onclick   = () => changeValue(3);
    document.getElementById('btnReduce').onclick  = reduceValue;
    document.getElementById('btnSort').onclick    = sortJson;
    document.getElementById('btnExit').onclick    = exitSave;

    // 关闭页面前保存
    window.addEventListener('beforeunload', exitSave);
}

/* ---------- 功能函数 ---------- */
function randomSentence() {
    // 清屏
    clearLabels();
    document.getElementById('btnToggle').textContent = '显示';

    const keys = Object.keys(woerter);
    if (!keys.length) return alert('JSON 为空！');

    currentKey = keys[Math.floor(Math.random() * keys.length)];
    const [deText, val] = Object.entries(woerter[currentKey])[0];

    document.getElementById('topLabel').value = currentKey;
    document.getElementById('midRight').textContent = val;
}

function toggleShow() {
    const btn = document.getElementById('btnToggle');
    if (btn.textContent === '显示') {
        if (!currentKey) return;
        const [deText] = Object.entries(woerter[currentKey])[0];
        document.getElementById('midLeft').value = deText;
        btn.textContent = '隐藏';
    } else {
        document.getElementById('midLeft').value = '';
        btn.textContent = '显示';
    }
}

function changeValue(delta) {
    if (!currentKey) return alert('请首先点击随机按钮！');
    const entries = Object.entries(woerter[currentKey]);
    const [deText, val] = entries[0];
    woerter[currentKey][deText] = val + delta;
    document.getElementById('midRight').textContent = woerter[currentKey][deText];
    changeCount++;
    autoSave();
}

function reduceValue() {
    if (!currentKey) return alert('请首先点击随机按钮！');
    const entries = Object.entries(woerter[currentKey]);
    const [deText, val] = entries[0];
    woerter[currentKey][deText] = Math.floor((val - 1) / 2);
    document.getElementById('midRight').textContent = woerter[currentKey][deText];
    changeCount++;
    autoSave();
}

function sortJson() {
    // 按数值升序
    woerter = Object.fromEntries(
        Object.entries(woerter).sort(([,a],[,b]) => Object.values(a)[0] - Object.values(b)[0])
    );
    changeCount++;
    autoSave();
    alert('已按数值升序重排！');
}

function clearLabels() {
    document.getElementById('topLabel').value = '';
    document.getElementById('midLeft').value  = '';
    document.getElementById('midMid').textContent = '';
    document.getElementById('midRight').textContent = '';
    currentKey = null;
}

function autoSave() {
    if (changeCount >= 5) {
        saveToDisk();
        changeCount = 0;
    }
}

async function exitSave() {
    if (changeCount > 0) {
        await saveToDisk();
    }
}

async function saveToDisk() {
    try {
        await fetch(SAVE_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(woerter)
        });
        changeCount = 0;
    } catch (e) {
        console.error('保存失败', e);
    }
}