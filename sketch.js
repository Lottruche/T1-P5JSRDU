// ==================== TRAÎNÉE ====================
let particles = [];
let centerY;
let speed = 2;
let isGrabbed = false;
let slider;

// ==================== OSCILLATOR ====================
let osc, playing = false, freq;
let smoothFreq = 440;
let minFreq = 350, maxFreq = 550;

// ==================== RECORDER ====================
let recorder;
let soundFile;
let isRecording = false;
let recordingTimeout;

// ==================== UI ELEMENTS ====================
let recordButton, playButton, downloadButton, freq250Button, freq350Button, freq550Button;

function setup() {
    let cnv = createCanvas(600, 250);
    cnv.parent("Canvas");
    noStroke();

    slider = select("#ySlider");
    centerY = height / 4;

    freq250Button = createButton('Grave');
    freq250Button.parent('freqButtons');
    freq250Button.mousePressed(() => { minFreq = 250; maxFreq = 450; });

    freq350Button = createButton('Medium');
    freq350Button.parent('freqButtons');
    freq350Button.mousePressed(() => { minFreq = 350; maxFreq = 550; });

    freq550Button = createButton('Aigu');
    freq550Button.parent('freqButtons');
    freq550Button.mousePressed(() => { minFreq = 450; maxFreq = 650; });

    // Oscillateur audio
    osc = new p5.Oscillator("sine");
    osc.amp(0);

    // Créer le recorder - enregistre tout l'audio de la page
    recorder = new p5.SoundRecorder();
    recorder.setInput(); // Sans paramètre = capture tout l'audio
    soundFile = new p5.SoundFile();

    // Créer les boutons avec p5.js
    recordButton = createButton('');
    recordButton.parent('controls');
    recordButton.class('decorated-button');
    recordButton.html('<span class="button-text"> S\'enregistrer</span><span class="left-decoration"></span><span class="right-decoration"></span>');
    recordButton.mousePressed(toggleRecording);

    playButton = createButton('');
    playButton.parent('controls');
    playButton.class('decorated-button');
    playButton.html('<span class="button-text"> Écouter</span><span class="left-decoration"></span><span class="right-decoration"></span>');
    playButton.mousePressed(playRecording);

    downloadButton = createButton('');
    downloadButton.parent('controls');
    downloadButton.class('decorated-button');
    downloadButton.html('<span class="button-text"> Télécharger</span><span class="left-decoration"></span><span class="right-decoration"></span>');
    downloadButton.mousePressed(downloadRecording);

    // Événements slider
    slider.mousePressed(() => {
        isGrabbed = true;
        if (!playing) {
            userStartAudio(); // S'assurer que l'audio est activé
            osc.start();
            playing = true;
        }
    });

    slider.mouseReleased(() => {
        isGrabbed = false;
        osc.amp(0, 0.4);
        playing = false;
    });
}

function draw() {

    // ==================== NETTOYAGE CANVAS ====================
    clear();
    stroke(255,200, 120, 150);
    strokeWeight(1);
    line(0, height/3, width, height/3);
    line(0, 2*height/3, width, 2*height/3);
    noStroke();
    centerY = map(slider.value(), 0, 260, 230, 0);
    // ==================== SLIDER → FRÉQUENCE ====================
    freq = map(centerY, 250, 0, minFreq, maxFreq);
    smoothFreq = lerp(smoothFreq, freq, 0.05);
    if (playing) {
        osc.freq(smoothFreq, 0.1);
        osc.amp(1, 0.1);
    }

    // ==================== TRAÎNÉE SI SLIDER GRAB ====================
    if (isGrabbed) {
        for (let i = 0; i < 5; i++) {
            particles.push({
                x: width / 25,
                y: centerY,
                alpha: 500,
            });
        }
    }

    // ==================== UPDATE PARTICULES ====================
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.x += speed;
        p.alpha -= 1.8;

        fill(52, 159, 207, p.alpha);
        circle(p.x, p.y, 20);

        if (p.alpha <= 0) {
            particles.splice(i, 0.1);
        }
    }
}
function toggleRecording() {
    if (!isRecording) {
        // Démarrer l'enregistrement
        userStartAudio(); // S'assurer que l'audio est activé
        recorder.record(soundFile);
        isRecording = true;
        recordButton.html('<span class="button-text">Arrêter</span><span class="left-decoration"></span><span class="right-decoration"></span>');
        recordingTimeout = setTimeout(() => {
            recorder.stop();
            isRecording = false;
            recordButton.html('<span class="button-text">Enregistrer</span><span class="left-decoration"></span><span class="right-decoration"></span>');
            playButton.show();
            downloadButton.show();
            console.log('Enregistrement arrêté automatiquement après 1:30');
        }, 90000);
        console.log('Enregistrement démarré');
    } else {
        // Arrêter l'enregistrement
        clearTimeout(recordingTimeout);
        recorder.stop();
        isRecording = false;
        recordButton.html('<span class="button-text">Enregistrer</span><span class="left-decoration"></span><span class="right-decoration"></span>');

        // Afficher les boutons de lecture et téléchargement
        playButton.show();
        downloadButton.show();
        console.log('Enregistrement arrêté');
    }
}

function playRecording() {
    if (soundFile && soundFile.buffer) {
        if (soundFile.isPlaying()) {
            soundFile.stop();
            playButton.html('<span class="button-text">Écouter</span><span class="left-decoration"></span><span class="right-decoration"></span>');
        } else {
            soundFile.play();
            playButton.html('<span class="button-text">Pause</span><span class="left-decoration"></span><span class="right-decoration"></span>');

            // Remettre le bouton à "Écouter" quand la lecture est terminée
            soundFile.onended(() => {
                playButton.html('<span class="button-text">Écouter</span><span class="left-decoration"></span><span class="right-decoration"></span>');
            });
        }
    }
}

function downloadRecording() {
    if (soundFile && soundFile.buffer) {
        // Créer un nom de fichier avec horodatage
        let timestamp = year() + "-" +
            nf(month(), 2) + "-" +
            nf(day(), 2) + "_" +
            nf(hour(), 2) + "-" +
            nf(minute(), 2) + "-" +
            nf(second(), 2);
        let filename = "recording_" + timestamp + ".wav";

        saveSound(soundFile, filename);
        console.log('Téléchargement:', filename);
    }
}

const freqButtons = document.getElementById("freqButtons");

freqButtons.addEventListener("click", (e) => {
  if (e.target.tagName !== "BUTTON") return;

  // Retire l'état actif de tous les boutons
  const buttons = freqButtons.querySelectorAll("button");
  buttons.forEach(btn => btn.classList.remove("active"));

  // Active le bouton cliqué
  e.target.classList.add("active");
});
