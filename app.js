// fejezetek
let storyNodes = {
    1: {
        text: "Gyalogszerrel indulsz utnak. A Tuzhegy labanal egy sotet barlangbejaratot talsz. Belepsz a jaratba. Elotted a folyosó egyenesen halad, de par meter utan egy elagazashoz ersz.",
        gomb1_szoveg: "Fordulj Nyugat fele",
        gomb1_hova: 2,
        gomb2_szoveg: "Fordulj Kelet fele",
        gomb2_hova: 3
    },
    2: {
        text: "A nyugati jarat egyre szukebb lesz, vegul egy nehez tolgyfa ajtohoz ersz. Halk horkolast hallasz odabentrol.",
        gomb1_szoveg: "Berugod az ajtot es rontasz a szobaba",
        gomb1_hova: 4,
        gomb2_szoveg: "Inkab visszamesz az elagazashoz",
        gomb2_hova: 1
    },
    3: {
        text: "Kelet felé indulsz, de hirtelen megremeg a fold a labad alatt! Egy csapoajto nyilik meg alattad. Mit teszel?",
        gomb1_szoveg: "Megprobalok elugrani!",
        gomb1_hova: 5,
        gomb2_szoveg: "Visszarohanok a bejarathoz",
        gomb2_hova: 1
    },
    4: {
        text: "Belerugsz az ajtoba. Egy duhos barlangi Ork ugrik fel az agyarol, fegyvert rantva! (Sajnos itt most veres vegso harc var rad...)",
        gomb1_szoveg: "Ujra a bejarathoz",
        gomb1_hova: 1,
        gomb2_szoveg: "Vissza az ajtohoz",
        gomb2_hova: 2
    },
    5: {
        text: "Hatalmas reflexszel sikerult elugranod a megnyilo csapda elol! Biztonsagban vagy a folyoso masik oldalan.",
        gomb1_szoveg: "Tovabb a barlang melyere",
        gomb1_hova: 6,
        gomb2_szoveg: " Inkabb megis visszaterok",
        gomb2_hova: 1
    },
    6: {
        text: "Egy feszitoen csendes kincstarba ersz. Megtalaltad a Tuzhegy Varazslojának elfeledett ladait! Megnyerted a jatekot!",
        gomb1_szoveg: "Jatek ujrainditasa",
        gomb1_hova: 1,
        gomb2_szoveg: "Vissza a csapdahoz",
        gomb2_hova: 5
    }
};

// jatekos adatai
let jatekosAdatok = {
    eletero: 20,
    szerencse: 9,
    aktualisFejezet: 1
};


let szovegDoboz = document.getElementById('story-text');
let gombokDoboz = document.getElementById('choices-container');
let eleteroKijelzo = document.getElementById('hp');


function oldalFrissites() {
    let aktualisNode = storyNodes[jatekosAdatok.aktualisFejezet];

    szovegDoboz.innerText = aktualisNode.text;
    eleteroKijelzo.innerText = jatekosAdatok.eletero;

    gombokDoboz.innerHTML = '';
    
    let gomb1 = document.createElement('button');
    gomb1.innerText = aktualisNode.gomb1_szoveg;
    gomb1.onclick = function() {
        jatekosAdatok.aktualisFejezet = aktualisNode.gomb1_hova;
        oldalFrissites(); 
    };
    gombokDoboz.appendChild(gomb1);

    let gomb2 = document.createElement('button');
    gomb2.innerText = aktualisNode.gomb2_szoveg;
    gomb2.onclick = function() {
        jatekosAdatok.aktualisFejezet = aktualisNode.gomb2_hova;
        oldalFrissites();
    };
    gombokDoboz.appendChild(gomb2);
}