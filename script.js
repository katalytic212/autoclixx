let running = false;
let interval = null;
let clickCount = 0;
let currentTarget = null;
let multiTargets = [];

let cursorX = 0;
let cursorY = 0;

function updateCounter() {
    document.getElementById("counter").textContent = clickCount;
}

// Selecionar elemento da página
document.getElementById("chooseElement").onclick = () => {
    alert("Clique em qualquer elemento da página para selecioná-lo como alvo.");

    document.body.style.cursor = "crosshair";

    function selectElement(e) {
        e.preventDefault();
        currentTarget = e.target;

        document.getElementById("targetPreview").textContent =
            "Elemento selecionado: " + currentTarget.tagName;

        document.body.style.cursor = "default";
        document.removeEventListener("click", selectElement, true);
    }

    document.addEventListener("click", selectElement, true);
};

// Adicionar aos múltiplos alvos
document.getElementById("addToMulti").onclick = () => {
    if (!currentTarget) {
        alert("Selecione um alvo primeiro!");
        return;
    }

    multiTargets.push(currentTarget);

    let div = document.createElement("div");
    div.className = "multi-target";
    div.textContent = "Alvo: " + currentTarget.tagName;

    document.getElementById("multiList").appendChild(div);
};

// Realizar clique no alvo
function performClick(target) {
    if (!target) return;

    let type = document.getElementById("clickType").value;

    if (type === "double") {
        target.click();
        target.click();
        clickCount += 2;
    } else {
        target.click();
        clickCount += 1;
    }

    updateCounter();
}

// Iniciar ou parar autoclick
document.getElementById("toggle").onclick = toggleAutoClick;

function toggleAutoClick() {
    running = !running;

    let mode = document.getElementById("clickMode").value;
    let delay = parseInt(document.getElementById("delay").value);

    if (running) {
        document.getElementById("toggle").innerText = "Parar";
        document.getElementById("toggle").classList.add("stop");

        interval = setInterval(() => {
            if (mode === "cursor") {
                let el = document.elementFromPoint(cursorX, cursorY);
                if (el) performClick(el);
            } else {
                if (multiTargets.length > 0) {
                    multiTargets.forEach(t => performClick(t));
                } else {
                    performClick(currentTarget);
                }
            }
        }, delay);

    } else {
        document.getElementById("toggle").innerText = "Iniciar Autoclick (ou F6)";
        document.getElementById("toggle").classList.remove("stop");
        clearInterval(interval);
    }
}

// Hotkey F6 para iniciar/parar
document.addEventListener("keydown", (e) => {
    if (e.key === "F6") {
        toggleAutoClick();
    }
});

// Capturar posição do cursor
document.addEventListener("mousemove", (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
});
