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
    }
};

// a jatekos adatai
let jatekosAdatok = {
    eletero: 20,
    szerencse: 9,
    aktualisFejezet: 1
};

let szovegDoboz = document.getElementById('story-text');
let gombokDoboz = document.getElementById('choices-container');
let eleteroKijelzo = document.getElementById('hp');