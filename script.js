const audio = new Audio("resources/click-button.mp3");
const win_audio = new Audio("resources/win_aud.wav");
const defeat_audio = new Audio("resources/defeat.mp3");
const buttons = document.querySelectorAll("button");
const letters = document.querySelectorAll('.letter');

buttons.forEach(button => {
  button.addEventListener("click", () => {
    audio.play();
  });
});
letters.forEach(letter => {
  letter.addEventListener("click", () => {
    audio.play();
  });
});

const easyWords = ["APPLE", "BANANA", "CAT", "DOG", "ELEPHANT", "FLOWER", "GUITAR", "HOUSE", "JACKET", "KITE", "LAMP", "MOON", "NOTEBOOK", "ORANGE", "PENGUIN", "QUEEN", "RAINBOW", "SUN", "TREE", "UMBRELLA", "VOLCANO", "WATERMELON", "XYLOPHONE", "YOGURT", "ZEBRA"];
const titles = ["Fruit", "Fruit", "Animal", "Animal", "Animal", "Plant", "Musical Instrument", "Building", "Clothing", "Toy", "Object", "Celestial Body", "Stationery Item", "Fruit", "Bird", "Royalty", "Meteorological Phenomenon", "Celestial Body", "Plant", "Rain Gear", "Natural Disaster", "Fruit", "Musical Instrument", "Dairy Product", "Animal"];

const word = document.querySelector('.word');
const word_title = document.querySelector('.word_title');
const score_txts = document.querySelectorAll('.score_txt');
const coin_txts = document.querySelectorAll('.coin_txt');
const alphas = document.querySelector('.alphas');
let currentWordIndex;
let ct = 0;
let f = 0;
let len = 0;
let win_ct = 0;

const my_fun = () => {

  currentWordIndex = Math.floor(Math.random() * (easyWords.length - win_ct));
  let currentWord = easyWords[currentWordIndex];
  word.innerHTML = '';

  for (let i = 0; i < currentWord.length; i++) {
    word.innerHTML += `<span class="hidden text_select_utility">${currentWord[i]}</span>`;
  }

  word_title.innerHTML = titles[currentWordIndex];

  gsap.from(alphas, {
    x: -100,
    opacity: 0,
    delay: .4,
    duration: .6,
    ease: 'ease-out',
  });
};



document.addEventListener('click', function (event) {
  f = 0;
  if (event.target.classList.contains('letter') && !event.target.classList.contains('clicked')) {
    let letter = event.target.innerHTML;
    const currentWord = easyWords[currentWordIndex];
    document.querySelectorAll('.word span').forEach((span, index) => {
      if (letter === currentWord[index]) {
        span.style.color = "#004a4a";
        span.classList.remove('hidden');
        event.target.style.color = "#008000"; //done
        f = 1;
        len++;
      }
    });
    if (!f) {
      event.target.style.color = "#880808"; // done
      event.target.style.cursor = "not-allowed";  // done
      event.target.classList.add('clicked'); // done
      ct++;
      animateSVG();
    }
    if (len == currentWord.length) {
      win_ct++;
      gsap.to(alphas, {
        x: -200,
        opacity: 0,
        duration: .6,
        ease: 'linear',
      });
      gsap.to(play_svg, {
        x: 200,
        duration: .6,
        opacity: 0,
        ease: 'linear',
        onComplete() {
          win.style.display = "flex";
          win_audio.play();
          gsap.from('.win', {
            x: -200,
            duration: 1,
            opacity: 0,
          })
          gsap.set(alphas, { x: 0, opacity: 1, })
          gsap.set(play_svg, { x: 0, opacity: 1 })
          play_body.style.display = "none";
          score_txts.forEach(function (score) {
            score.innerHTML = `${10 * win_ct}`
          });
          coin_txts.forEach(function (coin) {
            coin.innerHTML = `${80 + (2 * win_ct)}`
          });
        }
      });


      let removedWord = easyWords.splice(currentWordIndex, 1)[0];
      easyWords.push(removedWord);
      removedWord = titles.splice(currentWordIndex, 1)[0];
      titles.push(removedWord);
      console.log(easyWords);
      console.log(titles);
    }
  }
});

const path = document.querySelector('.play_svg path');
const play_svg = document.querySelector('.play_svg');
const loose = document.querySelector('.loose');
const win = document.querySelector('.win');
const play_body = document.querySelector('.play_body');
const result_sec = document.querySelector('.result_sec');
const increments = Array.from({ length: 7 }, (_, i) => 2351 - i * 391).concat([0]);

my_fun();

function next_word_func() {
  win.style.display = "none";
  loose.style.display = "none";
  play_body.style.display = "flex";
  letters.forEach(function (letter) {
    letter.style.color = '#004A4A';
    letter.style.cursor = 'pointer';
    letter.classList.remove('clicked');
  });
  ct = 0;
  len = 0;
  path.style.strokeDashoffset = 2351;
  path.style.fillOpacity = 0;
  my_fun();
}

function animateSVG() {
  path.style.animation = 'none';
  if (ct <= 5) {
    gsap.to(path, {
      strokeDashoffset: increments[ct],
      duration: 1,
      ease: 'linear',
    });
  }
  else if (ct == 6) {
    gsap.to(path, {
      strokeDashoffset: increments[ct],
      duration: 1,
      ease: 'linear',
    });
    gsap.to(path, {
      fillOpacity: 1,
      duration: 1,
      ease: 'linear',
    });
    gsap.to(alphas, {
      x: -200,
      opacity: 0,
      duration: .6,
      ease: 'linear',
    });
    gsap.to(play_svg, {
      x: 200,
      delay: 1.4,
      duration: .6,
      opacity: 0,
      ease: 'linear',
      onComplete() {
        document.querySelectorAll('.word span').forEach((span) => {
          gsap.to(span, {
            color: '#004a4a',
          })
        });
        loose.style.display = "flex";
        defeat_audio.play();
        gsap.from('.loose', {
          x: -200,
          duration: 1,
          opacity: 0,
        })
        gsap.set(alphas, { x: 0, opacity: 1, })
        gsap.set(play_svg, { x: 0, opacity: 1 })
        play_body.style.display = "none";
        score_txts.forEach(function (score) {
          score.innerHTML = `${10 * 0}`
        });
      }
    });

  }
}


// Main logic loading and play section
const loading = document.querySelector('.loading');
const play_sec = document.querySelector('.play_sec');
const svg_l = document.querySelector('.svg_l');

let tl = gsap.timeline({})
tl.from('.loading_txt_h1', {
  x: -200,
  opacity: 0,
  duration: 1,
  delay:.2,
})
  .from('.play_btn', {
    y: 100,
    opacity: 0,
    duration: .8,
  }, "+1")

function play() {
  let tl = gsap.timeline({})
  tl.to('.loading_txt_h1', {
    x: -200,
    opacity: 0,
    duration: .6,
  })
    .to('.svg_l', {
      y: -100,
      opacity: 0,
      duration: .6,
    }, "<")
    .to('.play_btn', {
      y: 100,
      opacity: 0,
      duration: .6,
      onComplete() {
        loading.style.display = "none";

        play_sec.style.display = "block";
        gsap.from(alphas, {
          x: -200,
          opacity: 0,
          duration: .6,
          ease: 'linear',
        });
      }
    }, "<")
}