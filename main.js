// nimed on list piltide nimedest
let nimed = ["20590882.jpg","32062364.jpg","37298846.jpg","48044400.jpg","75025618.jpg","80239027.jpg","94298870.jpg","99906268.jpg","101434689.jpg","127481031.jpg","128656245.jpg","142939031.jpg","178338594.jpg","194476053.jpg","206081749.jpg","250444150.jpg","262950620.jpg","263643954.jpg","299367783.jpg","375390294.jpg","388486768.jpg","396551308.jpg","418109653.jpg","423895287.jpg","428037539.jpg","428959113.jpg","438642599.jpg","455923173.jpg","497192843.jpg","500468739.jpg","506464566.jpg","527957724.jpg","537837683.jpg","559369083.jpg","588839056.jpg","616003168.jpg","628871545.jpg","637649869.jpg","644956214.jpg","666275902.jpg","668615918.jpg","741034212.jpg","762803045.jpg","780138737.jpg","795048308.jpg","800210279.jpg","845964705.jpg","855603393.jpg","860720941.jpg","862523623.jpg","881941707.jpg","886607519.jpg","908162406.jpg","914219333.jpg","931052585.jpg","950099351.jpg","958455952.jpg","962402592.jpg","996186070.jpg"]
let mitmes = 0; // Loendur, mis jälgib mitmes lause on praguse mängu jooksul võetud
let vigu = 0; // vigade loendur
let pildid = [null, null, null, null, null] // list, kus on pilt ja selle osapildid
let õiged = [null, null, null, null] // Valitud laused
let laused = [null, null, null, null] // Laused, milles on sihitis asendatud tühja kohaga
let variandid = [[null, null, null], [null, null, null], [null, null, null], [null, null, null]] // list, kus on 4 sihitist koos vastavate valede variantidega
let sihitised = [null, null, null, null] // list, kus on kirjas sihitised

// Funktsioon piltide leidmiseks (algpilt kui ka tema alampildid)
function LeiaPilt() {
    let nimi = nimed[(Math.floor(Math.random() * nimed.length))]; // valime suvalise pildi listist
    // lisame piltide listi alampildid (millel on objektid peidetud) järjekorras rohkemast vähemani.
    pildid[0] = nimi.split(".")[0] + "-1.jpg"
    pildid[1] = nimi.split(".")[0] + "-2.jpg"
    pildid[2] = nimi.split(".")[0] + "-3.jpg"
    pildid[3] = nimi.split(".")[0] + "-4.jpg"
    pildid[4] = nimi;
    LoeMuudAndmed(nimi);
}

// Funktsioon andmete lugemiseks
async function LoeMuudAndmed(pilt) {
    let pildi_fail = pilt.split(".")[0] + ".txt"; // Leiame pildile vastava tekstifaili

    const response = await fetch('Andmed/pildifailid/pildid/' + pildi_fail); // Loeme tekstifaili, kus on kirjas pildil olevad objektid
    const text = await response.text();
    let objektid = text.split("\n") // saame objektidest listi

    // Käime läbi kõik pildi objektid ja otsime vastavad tekstifailid
    for (let i = 0; i < objektid.length - 1; i++) {
        const res1 = await fetch("Andmed/tekstifailid/" + objektid[i] + ".txt")
        const text1 = await res1.text();
        let potLaused = text1.split("\n"); // saame objekti tekstifailist potensiaalsed laused listi
        let lause = potLaused[(Math.floor(Math.random() * potLaused.length - 1))]; // valime suvaliselt ühe lause potensiaalsete lausete listist
        let osad = lause.split('\|') // Teeme lause osadeks (Lause|sihitis;variant1;variant2)
        let sihVar = osad[1 + (Math.floor(Math.random() * (osad.length - 1)))] // kuna sihitisi võib lauses mitu olla valime suvalise
        let osad1 = sihVar.replace('\r', "").split(";") // saame listi, mis sisaldab sihitist ja selle kaht varianti
        õiged[i] = osad[0]
        sihitised[i] = osad1[0]
        laused[i] = õiged[i].replace(sihitised[i], "______") // Asendame lauses sihitise tühja kohaga
        variandid[i] = sihVar.replace('\r', "").split(';').sort(() => Math.random() - 0.5) // Segame sihitise variandid
        // Juhul kui sihitis on lause alguses, siis muudame sihitiste variantide esitähed suurteks tähtedeks
        if(laused[i].startsWith("_")){
            for (let j = 0; j < 3; j++) {
                variandid[i][j] = variandid[i][j].charAt(0).toUpperCase() + variandid[i][j].substring(1,variandid[i][j].length)
            }
        }
    }
}

// Funktsioon andmete näitamiseks
function NaitaUusiAndmeid(){
    document.getElementById("pilt").src= "Andmed/pildifailid/pildid/" + pildid[mitmes]; // Kuvame pildi, vastavalt sellele mitmes lause parasjagu on
    // Kui on neli lauset ette antud
    if (mitmes === 4) {
        document.getElementById("mitmes").textContent = " ";
        // Näitame kasutajale vastavat teksti ja vigade loendur kuvab mitu viga mängija tegi
        document.getElementById("lause").textContent = "Tubli, said kõik lahendatud! Kokku tegid " + vigu + " viga";
        // Lisame nupu, et kasutaja saaks uue lause ette
        // Nuppude lisamiseks kasutati https://www.altcademy.com/blog/how-to-create-a-button-in-javascript/ abi
        let nuppudeDiv = document.getElementById("nuppudeDiv");
        nuppudeDiv.replaceChildren()
        const nupp = document.createElement("button")
        nupp.textContent = "Alusta uuesti"
        // Kui kasutaja vajutab nuppu, siis paneme loendurid algseks ja kutsume funktsioonis, et kasutajale kuvataks jälle uued pildid ja laused
        nupp.addEventListener('click', () => {
            mitmes = 0;
            vigu = 0;
            LeiaPilt();
            NaitaUusiAndmeid();
        });
        nupp.classList.add("button3")
        nuppudeDiv.appendChild(nupp);
        return
    }
    // Kui kasutajale ei ole veel neli lauset ette antud
    document.getElementById("mitmes").textContent = "Praegune lause on: " + (mitmes+1) + "/4.";
    document.getElementById("lause").textContent = laused[mitmes]; // Lause, kust on sihitis väja võetud

    // Teeme sihitiste variantideks kolm nuppu
    let nuppudeDiv = document.getElementById("nuppudeDiv");
    nuppudeDiv.replaceChildren()
    for (let i = 0; i < 3; i++) {
        const nupp = document.createElement("button");
        nupp.textContent = variandid[mitmes][i];

        // Teavituse lisamiseks kasutato https://www.altcademy.com/blog/how-to-create-a-button-in-javascript/ abi
        // Anname kasutajale teada, kui ta on valinud vale vastuse
        nupp.addEventListener('click', () => {
            if (variandid[mitmes - 1][i] !== sihitised[mitmes - 1]) {
                vigu++;
                alert("Oled valinud vale vastuse!");
            }
            // Kui kasutaja valis õige variandi, siis näitame talle lauset
            else vahetaPeidetud();
        });
        nupp.classList.add("button3")
        nuppudeDiv.appendChild(nupp);
    }
    mitmes++;

}

// Funktsioon vahetab kuvatavaid lauseid
function vahetaPeidetud() {
    document.getElementById("lause").textContent = õiged[mitmes-1];

    // Teeme nupu, et kasutaja saaks edasi liikuda järgmise lause juurde
    let nuppudeDiv = document.getElementById("nuppudeDiv");
    nuppudeDiv.replaceChildren()
    const nupp = document.createElement("button")
    nupp.textContent = "Edasi!"
    nupp.addEventListener('click', () => {
        NaitaUusiAndmeid();
    })
    nupp.classList.add("button3")
    nuppudeDiv.appendChild(nupp);
}

// Funktsioon viib avalehelt mängu lehele
function vahetaLehte() {
    document.location="mang.html"
}

// Funktsiooni väljakutsed koos taimeriga
LeiaPilt();
setTimeout(() => {
    NaitaUusiAndmeid();
}, 500)
