const audio = new Audio("resources/click-button.mp3");
const win_audio = new Audio("resources/win_aud.wav");
const defeat_audio = new Audio("resources/defeat.mp3");
const buttons = document.querySelectorAll("button");
const letters = document.querySelectorAll('.letter');
const word = document.querySelector('.word');
const word_title = document.querySelector('.word_title');
const score_txts = document.querySelectorAll('.score_txt');
const coin_txts = document.querySelectorAll('.coin_txt');
const alphas = document.querySelector('.alphas');
const path = document.querySelector('.play_svg path');
const play_svg = document.querySelector('.play_svg');
const loose = document.querySelector('.loose');
const win = document.querySelector('.win');
const play_body = document.querySelector('.play_body');
const result_sec = document.querySelector('.result_sec');
const increments = Array.from({ length: 7 }, (_, i) => 2351 - i * 391).concat([0]);
const loading = document.querySelector('.loading');
const play_sec = document.querySelector('.play_sec');
const svg_l = document.querySelector('.svg_l');
const play_btn = document.querySelector('.play_btn');
const sentence = document.querySelectorAll('.sentence');
let currentWordIndex, ct = 0, f = 0, len = 0, win_ct = 0, currentWord;

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

let gword;

const randomWord = () => {
  play_btn.innerHTML = "Wait...";
  fetch('https://random-word-api.herokuapp.com/word')
    .then(response => {
      return response.json();
    })
    .then(response => {
      gword = response
      console.log(response);
      if(gword[0].length <= 8){
        randomDefinition(gword);
      }
      else{
        randomWord();
      }
    })
}

const randomDefinition = (gword) => {
  let flag_ex = 0;
  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${gword}`)
    .then(response => {
      return response.json();
    })
    .then(response => {
      let defs;
      // defs.sort((a, b) => a.definition.length - b.definition.length);
      console.log(response);
      
      for (let j = 0; j < response[0].meanings.length; j++) {
        sentence[0].innerHTML = "Sentence: Not available.";
        sentence[1].innerHTML = "Sentence: Not available.";
        defs = response[0].meanings[j].definitions;
        for (let i = 0; i < defs.length; i++) {
          if (defs[i].example != undefined) {
            word_title.innerHTML = defs[i].definition;
            console.log("sentence:",defs[i].example);
            sentence[0].innerHTML = `Sentence: ${defs[i].example}`;
            sentence[1].innerHTML = `Sentence: ${defs[i].example}`;
            flag_ex = 1;
            break;
          }
        }
        if (flag_ex == 1) {
          break;
        }
      }
      if (flag_ex != 1) {
        defs = response[0].meanings[0].definitions;
        word_title.innerHTML = defs[0].definition;
      }
      currentWord = gword[0];
      currentWord = currentWord.toUpperCase();
      console.log(currentWord);
      console.log(word_title.innerHTML);

      my_fun();
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
    })
    .catch(err => {
      randomWord();
    })
}

const my_fun = () => {
  play();
  word.innerHTML = '';

  let r1 = Math.floor(Math.random() * currentWord.length);
  let r2 = Math.floor(Math.random() * currentWord.length);
  if (r1 == r2) {
    r2 = Math.abs(r2 - 1);
  }
  for (let i = 0; i < currentWord.length; i++) {
    if (i == r1 || i == r2) {
      word.innerHTML += `<span class="hidden text_select_utility visible_hint">${currentWord[i]}</span>`;
      continue;
    }
    word.innerHTML += `<span class="hidden text_select_utility">${currentWord[i]}</span>`;
  }
};



document.addEventListener('click', function (event) {
  f = 0;
  if (event.target.classList.contains('letter') && !event.target.classList.contains('clicked')) {
    let letter = event.target.innerHTML;
    document.querySelectorAll('.word span').forEach((span, index) => {
      if (letter === currentWord[index]) {
        span.style.color = "#004a4a";
        span.classList.remove('hidden');
        event.target.style.color = "#008000";
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
          ct = 0;
          len = 0;
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
    }
  }
});

document.addEventListener('click', function (event) {
  if (event.target.classList.contains('next_word')) {

    gsap.set(event.target, {
      innerHTML: "Wait...",
    });
    gsap.to(event.target, {
      delay: 15,
      onComplete() {
        gsap.set(event.target, {
          innerHTML: "Next Word",
        });
      }
    })
    randomWord();
  }
})
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
        ct = 0;
        len = 0;
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

let tl = gsap.timeline({})
tl.from('.loading_txt_h1', {
  x: -200,
  opacity: 0,
  duration: 1,
  delay: .2,
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
