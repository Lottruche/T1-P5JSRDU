    // ==================== TRAÎNÉE ====================
    let particles = [];
    let centerY;
    let speed = 4;
    let isGrabbed = false;
    let slider;

    // ==================== OSCILLATOR ====================
    let osc, playing = false, freq;
    let smoothFreq = 440;

    // ==================== RECORDER ====================
    let recorder;
    let soundFile;
    let isRecording = false;

    // ==================== UI ELEMENTS ====================
    let recordButton, playButton, downloadButton;

    function setup() {
      let cnv = createCanvas(800, 300);
      cnv.parent("Canvas");
      noStroke();

      slider = select("#ySlider");
      centerY = height / 2;

      // Oscillateur audio
      osc = new p5.Oscillator("sine");
      osc.amp(0);

      // Créer le recorder - enregistre tout l'audio de la page
      recorder = new p5.SoundRecorder();
      recorder.setInput(); // Sans paramètre = capture tout l'audio
      soundFile = new p5.SoundFile();

      // Créer les boutons avec p5.js
      recordButton = createButton('🔴 Enregistrer');
      recordButton.parent('controls');
      recordButton.mousePressed(toggleRecording);
      recordButton.style('padding', '12px 24px');
      recordButton.style('font-size', '16px');
      recordButton.style('border', 'none');
      recordButton.style('border-radius', '5px');
      recordButton.style('cursor', 'pointer');
      recordButton.style('font-weight', 'bold');
      recordButton.style('background', '#e74c3c');
      recordButton.style('color', 'white');
      recordButton.style('transition', 'all 0.3s');

      playButton = createButton('▶️ Écouter');
      playButton.parent('controls');
      playButton.mousePressed(playRecording);
      playButton.style('padding', '12px 24px');
      playButton.style('font-size', '16px');
      playButton.style('border', 'none');
      playButton.style('border-radius', '5px');
      playButton.style('cursor', 'pointer');
      playButton.style('font-weight', 'bold');
      playButton.style('background', '#3498db');
      playButton.style('color', 'white');
      playButton.style('transition', 'all 0.3s');
      playButton.hide();

      downloadButton = createButton('💾 Télécharger');
      downloadButton.parent('controls');
      downloadButton.mousePressed(downloadRecording);
      downloadButton.style('padding', '12px 24px');
      downloadButton.style('font-size', '16px');
      downloadButton.style('border', 'none');
      downloadButton.style('border-radius', '5px');
      downloadButton.style('cursor', 'pointer');
      downloadButton.style('font-weight', 'bold');
      downloadButton.style('background', '#27ae60');
      downloadButton.style('color', 'white');
      downloadButton.style('transition', 'all 0.3s');
      downloadButton.hide();

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
      background(0, 70);
      centerY = map(slider.value(), 0, 300, 0, 300);

      // ========== SLIDER → fréquence sonore ==========
      freq = map(centerY, 300, 0, 350, 550);
      smoothFreq = lerp(smoothFreq, freq, 0.05);

      if (playing) {
        osc.freq(smoothFreq, 0.1);
        osc.amp(0.5, 0.1);
      }

      // ========== TRAÎNÉE SI SLIDER GRAB ==========
      if (isGrabbed) {
        for (let i = 0; i < 5; i++) {
          particles.push({
            x: width / 2,
            y: centerY,
            alpha: 255,
          });
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.x += speed;
        p.alpha -= 3;
        fill(36, 122, 163, p.alpha);
        circle(p.x, p.y, 20);
        if (p.alpha <= 0) particles.splice(i, 1);
      }

      fill(52, 159, 207);
      circle(width / 2, centerY, 20);

      // Indicateur d'enregistrement visuel
      if (isRecording) {
        fill(231, 76, 60, 150 + 105 * sin(frameCount * 0.1));
        noStroke();
        circle(width - 30, 30, 20);
        fill(255);
        textSize(14);
        textAlign(RIGHT, CENTER);
        text('ENREGISTREMENT...', width - 45, 30);
        textAlign(LEFT, BASELINE);
      }
    }

    function toggleRecording() {
      if (!isRecording) {
        // Démarrer l'enregistrement
        userStartAudio(); // S'assurer que l'audio est activé
        recorder.record(soundFile);
        isRecording = true;
        recordButton.html('⏹️ Arrêter');
        recordButton.style('background', '#27ae60');
        console.log('Enregistrement démarré');
      } else {
        // Arrêter l'enregistrement
        recorder.stop();
        isRecording = false;
        recordButton.html('🔴 Enregistrer');
        recordButton.style('background', '#e74c3c');

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
          playButton.html('▶️ Écouter');
        } else {
          soundFile.play();
          playButton.html('⏸️ Pause');

          // Remettre le bouton à "Écouter" quand la lecture est terminée
          soundFile.onended(() => {
            playButton.html('▶️ Écouter');
          });
        }
      }
    }

    function downloadRecording() {
      if (soundFile.buffer) {
        saveSound(soundFile,'hello.mp3')
        // Créer un nom de fichier avec horodatage
  /*       let timestamp = year() + "-" +
          nf(month(), 2) + "-" +
          nf(day(), 2) + "_" +
          nf(hour(), 2) + "-" +
          nf(minute(), 2) + "-" +
          nf(second(), 2);
        let filename = "recording_" + timestamp + ".wav"; */
/* 
        saveSound(soundFile, filename);
        console.log('Téléchargement:', filename); */
      }
    }