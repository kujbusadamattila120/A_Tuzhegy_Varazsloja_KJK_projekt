const roll = () => Math.floor(Math.random() * 6) + 1;

let player = {
    skill: roll() + 6,
    stamina: roll() + roll() + 12,
    luck: roll() + 6
};

let monster = null;
let combatState = { winNode: "", fleeNode: "" };

const storyData = {
    "start": {
        text: "Belépsz a Tűzhegy sötét gyomrába. A levegő hűvös és dohos. Tudod, hogy sokan sosem tértek vissza innen, de téged a kincs és a dicsőség hajt. Egyenesen haladsz előre, amíg egy elágazáshoz nem érsz.",
        choices: [
            { text: "Nyugat felé fordulok", nextNode: "71" },
            { text: "Kelet felé fordulok", nextNode: "278" }
        ]
    },
    "71": {
        text: "A nyugati járat alacsony, néhol le kell hajolnod. Hirtelen halk horkolást hallasz. Egy kőbe vájt mélyedésben egy büdös GOBLIN alszik, a falnak dőlve. Mellette egy kis láda fekszik a földön.",
        choices: [
            { text: "Megpróbálok lábujjhegyen elosonni mellette", nextNode: "301" },
            { text: "Rátámadok az alvó Goblinra", nextNode: "fight_goblin" }
        ]
    },
    "301": {
        text: "Sikeresen elosontál! A járat észak felé folytatódik, ahol egy vashoz rögzített fáklya pislákol.",
        choices: [{ text: "Tovább észak felé", nextNode: "junction_2" }]
    },
    
    "junction_2": {
        text: "A fáklya mellett elhaladva a folyosó hirtelen kiszélesedik, és egy újabb válaszúthoz érsz. Balra egy nehéz vasrácsos kapu áll résnyire nyitva, ahonnan fura kaparászó zajok hallatszanak. Jobbra egy sima, nyirkos falú alagút vezet lefelé a mélybe.",
        choices: [
            { text: "Bemegyek a vasrácsos kapun", nextNode: "szoba_32" },
            { text: "Leereszkedem a nyirkos alagútba", nextNode: "csapda_99" }
        ]
    },
    "szoba_32": {
        text: "A rácson átlépve egy elhagyatott őrszobában találod magad. A sarokban lévő korhadt asztalon egy poros kulcsot találsz. Elrakod a zsebedbe (hátha jó lesz még valamelyik ajtóhoz), majd visszatérsz a főfolyosóra.",
        choices: [{ text: "Vissza az elágazáshoz", nextNode: "junction_2" }]
    },
    "csapda_99": {
        text: "Ahogy óvatosan lépkedsz lefelé a sötét, nyirkos alagútban, egy halk kattanást hallasz a csizmád alatt. Egy laza padlólapra léptél! Egy rejtett falrésből mérgezett nyíl repül ki straight a válladba... (Vesztesz 3 életerőt!)",
        // Itt egy trükk: ha a gombra kattint, levonunk tőle életet, ezt a renderNode automatikusan kezeli, ha a stamina 0 lesz
        choices: [
            { 
                text: "Kihúzom a nyilat és megpróbálok visszafordulni", 
                nextNode: "junction_2" 
            }
        ]
    },

    "fight_goblin": {
        type: "combat",
        text: "A Goblin felriad, és koszos rövidkardját rántva rád veti magát!",
        monster: { name: "Goblin", skill: 5, stamina: 3 },
        winNode: "301",
        fleeNode: "start"
    },
    "278": {
        text: "Kelet felé haladva egy díszes, lelakatolt faajtóhoz érsz. Semmi zaj nem szűrődik ki. Megpróbálod benyomni, de zárva van.",
        choices: [
            { text: "Vállal nekimész az ajtónak", nextNode: "156" },
            { text: "Visszamész az elágazáshoz", nextNode: "start" }
        ]
    },
    "156": {
        text: "Hatalmas robajjal betöröd az ajtót! Bent egy BARBÁR vadember üvölt fel dühében, mert megzavartad az étkezésében. Baltát ragad és feléd ugrik!",
        type: "combat",
        monster: { name: "Barbár", skill: 7, stamina: 6 },
        winNode: "273",
        fleeNode: "start"
    },
    "273": {
        text: "A Barbár legyőzve fekszik. A szobában találsz 1 aranyat és egy sajtot (visszaad 2 életerőt).",
        choices: [{ text: "Tovább a barlang mélyére", nextNode: "start" }]
    },
    "game_over": {
        text: "Vége a játéknak. A sötétség örökre elnyelt.",
        choices: [{ text: "Új kaland indítása", nextNode: "start" }]
    }
};


function updateUI() {
    document.getElementById('skill-val').innerText = player.skill;
    document.getElementById('stamina-val').innerText = player.stamina;
    document.getElementById('luck-val').innerText = player.luck;
}

function renderNode(id) {
    if (player.stamina <= 0) id = "game_over";
    const node = storyData[id];
    
    document.getElementById('story-content').style.display = node.type === 'combat' ? 'none' : 'block';
    document.getElementById('combat-ui').style.display = node.type === 'combat' ? 'block' : 'none';
    
    if (node.type === 'combat') {
        setupCombat(node);
    } else {
        document.getElementById('story-text').innerText = node.text;
        const container = document.getElementById('choices-container');
        container.innerHTML = '';
        node.choices.forEach(c => {
            const b = document.createElement('button');
            b.innerText = c.text;
            b.onclick = () => renderNode(c.nextNode);
            container.appendChild(b);
        });
    }
}

function setupCombat(node) {
    monster = { ...node.monster };
    combatState.winNode = node.winNode;
    combatState.fleeNode = node.fleeNode;
    document.getElementById('monster-name-label').innerText = monster.name;
    document.getElementById('player-attack-val').innerText = "?";
    document.getElementById('monster-attack-val').innerText = "?";
    document.getElementById('round-result').innerText = "Vigyázz, támad!";
}

async function runCombatRound() {
    const btn = document.getElementById('btn-attack');
    btn.disabled = true;

    
    const pDice = document.getElementById('player-dice');
    const mDice = document.getElementById('monster-dice');
    pDice.classList.add('rolling');
    mDice.classList.add('rolling');

    let p1, p2, m1, m2;
    for(let i=0; i<20; i++) {
        p1 = roll(); p2 = roll(); m1 = roll(); m2 = roll();
        pDice.innerText = `🎲 ${p1} + ${p2}`;
        mDice.innerText = `🎲 ${m1} + ${m2}`;
        await new Promise(r => setTimeout(r, 100));
    }

    pDice.classList.remove('rolling');
    mDice.classList.remove('rolling');

    const pAttack = p1 + p2 + player.skill;
    const mAttack = m1 + m2 + monster.skill;

    document.getElementById('player-attack-val').innerText = pAttack;
    document.getElementById('monster-attack-val').innerText = mAttack;

    if (pAttack > mAttack) {
        monster.stamina -= 2;
        document.getElementById('round-result').innerText = "ELTALÁLTAD! Megsebezted az ellenfelet.";
        document.getElementById('round-result').style.color = "#4caf50";
    } else if (mAttack > pAttack) {
        player.stamina -= 2;
        document.getElementById('round-result').innerText = "MEGSEBZETT! Az ellenség csapása betalált.";
        document.getElementById('round-result').style.color = "#ff4444";
    } else {
        document.getElementById('round-result').innerText = "DÖNTETLEN! Senki sem sérült meg.";
        document.getElementById('round-result').style.color = "#aaa";
    }

    updateUI();

    if (monster.stamina <= 0) {
        setTimeout(() => { alert("Győztél!"); renderNode(combatState.winNode); }, 1000);
    } else if (player.stamina <= 0) {
        renderNode("game_over");
    } else {
        btn.disabled = false;
    }
}

function flee() {
    player.stamina -= 2;
    updateUI();
    alert("Menekülés közben a hátadba vágtak! (-2 Életerő)");
    renderNode(combatState.fleeNode);
}

window.onload = () => {
    updateUI();
    renderNode('start');
};