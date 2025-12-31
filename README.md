# T1 Créative Coding - WebTool
## ****Chant du loup****
### **Concept :** Synthétiseur sonore inspiré d'un mini jeu du jeu vidéo "The Legends of Zelda : Twilight Princesse"
[![Image_TLOZTP](https://zeldauniverse.net/wp-content/uploads/2022/01/TP_Howl_Stone-886x509.png)](https://youtu.be/EVsgu4Q-e1g)

---
### **Utilisation :**
L'utilisateur peut déplacer un curseur qui changera la fréquence d'un oscilateur pour créer son propore son.
Il peut aussi lancer un enregistrement avant de faire son son, l'utilisateur pourras par la suite le ré-écouter et le télécharger si il le souhaite.  
### **Snippets :**
#### **Fonctionnalités**
- Synthétiseur sonnor
- Visualisation du son (Cascade horizontal)
- Manipulation (curseur, slider...)
- Timeline
- Téléchargement

Optionnel

- Etre le plus fidèle aux visuels du jeu
- Importation de son
#### **Code trouver**
- <u>Synthétiseur :</u> [p5.Oscillator](https://p5js.org/reference/p5.sound/p5.Oscillator)
~~~
let osc, playing, freq, amp;

function setup() {
  let cnv = createCanvas(100, 100);
  cnv.mousePressed(playOscillator);
  osc = new p5.Oscillator('sine');
}

function draw() {
  background(220)
  freq = constrain(map(mouseY, 0, height, 500, 100), 100, 500);
  amp = constrain(map(mouseX, 0, 0, 0, 1), 0, 1);

  text('tap to play', 20, 20);
  text('freq: ' + freq, 20, 40);

  if (playing) {
    osc.freq(freq, 0.1);
    osc.amp(amp, 0.1);
  }
}

function playOscillator() {
  osc.start();
  playing = true;
}

function mouseReleased() {
  osc.amp(0,0.5);
  osc.freq(0,1);
  playing = false;
}
~~~
- <u>Slider :</u> [createSlider()](https://p5js.org/reference/p5/createSlider)
~~~
let slider;

function setup() {
  createCanvas(100, 100);

  slider = createSlider(0, 255, 0, 50);
  slider.position(10, 10);
  slider.size(80);
}

function draw() {
  // Use the slider as a grayscale value.
  let g = slider.value();
  background(g);
}
~~~
- <u>Video player :</u> [Video Player(P5)](https://p5js.org/examples/imported-media-video)
~~~
let playing = false;
let video;
let button;

function setup() {
  noCanvas();

  video = createVideo(['lien vidéo ici']);

  button = createButton('play');

  button.mousePressed(toggleVid);
}

function toggleVid() {
  if (playing == true) {
    video.pause();
    button.html('play');
  } else {
    video.loop();
    button.html('pause');
  }
  playing = !playing;
}
~~~
- <u>Sons personnalisés :</u> [soundFormats()](https://p5js.org/reference/p5/soundFormats)
~~~
function preload() {
  soundFormats('mp3', 'ogg');

  mySound = loadSound('/assets/beatbox.mp3');
}

function setup() {
     let cnv = createCanvas(100, 100);
     background(220);
     text('sound loaded! tap to play', 10, 20, width - 20);
     cnv.mousePressed(function() {
       mySound.play();
     });
   }
~~~

- <u>(Visuel) écho :</u> [Smoke Particles](https://p5js.org/examples/math-and-physics-smoke-particle-system)
~~~
let particleTexture;
let particleSystem;

function preload() {
  particleTexture = loadImage('/assets/particle_texture.png');
}

function setup() {
  createCanvas(720, 400);
  colorMode(HSB);
  particleSystem = new ParticleSystem(
    0,
    createVector(width / 2, height - 60),
    particleTexture
  );

  describe(
    'White circle gives off smoke in the middle of the canvas, with wind force determined by the cursor position.'
  );
}

function draw() {
  background(20);
  let dx = map(mouseX, 0, width, -0.2, 0.2);
  let wind = createVector(dx, 0);
  particleSystem.applyForce(wind);
  particleSystem.run();
  for (let i = 0; i < 2; i += 1) {
    particleSystem.addParticle();
  }
  drawVector(wind, createVector(width / 2, 50, 0), 500);
}
function drawVector(v, loc, scale) {
  push();
  let arrowSize = 4;
  translate(loc.x, loc.y);
  stroke(255);
  strokeWeight(3);
  rotate(v.heading());

  let length = v.mag() * scale;
  line(0, 0, length, 0);
  line(length, 0, length - arrowSize, +arrowSize / 2);
  line(length, 0, length - arrowSize, -arrowSize / 2);
  pop();
}

class ParticleSystem {
  constructor(particleCount, origin, textureImage) {
    this.particles = [];
    this.origin = origin.copy();
    this.img = textureImage;
    for (let i = 0; i < particleCount; ++i) {
      this.particles.push(new Particle(this.origin, this.img));
    }
  }

  run() {
    for (let i = this.particles.length - 1; i >= 0; i -= 1) {
      let particle = this.particles[i];
      particle.run();
      if (particle.isDead()) {
        this.particles.splice(i, 1);
      }
    }
  }
  applyForce(dir) {
    for (let particle of this.particles) {
      particle.applyForce(dir);
    }
  }

  addParticle() {
    this.particles.push(new Particle(this.origin, this.img));
  }
}

class Particle {
  constructor(pos, imageTexture) {
    this.loc = pos.copy();

    let xSpeed = randomGaussian() * 0.3;
    let ySpeed = randomGaussian() * 0.3 - 1.0;

    this.velocity = createVector(xSpeed, ySpeed);
    this.acceleration = createVector();
    this.lifespan = 100.0;
    this.texture = imageTexture;
    this.color = color(frameCount % 256, 255, 255);
  }
  run() {
    this.update();
    this.render();
  }
  render() {
    imageMode(CENTER);
    tint(this.color, this.lifespan);
    image(this.texture, this.loc.x, this.loc.y);
  }

  applyForce(f) {
    this.acceleration.add(f);
  }

  isDead() {
    return this.lifespan <= 0.0;
  }

  update() {
    this.velocity.add(this.acceleration);
    this.loc.add(this.velocity);
    this.lifespan -= 2.5;
    this.acceleration.mult(0);
  }
}
~~~