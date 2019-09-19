import '../src/styles/main.sass';
import 'index.html';
import WatchJS from 'melanke-watchjs';
import animate from './animate'

const watch = WatchJS.watch;
const nextBtn = document.querySelector('a[data-slide="next"]');
const prevBtn = document.querySelector('a[data-slide="prev"]');

const cActiveEls = document.querySelector('.slider-inner').querySelectorAll('.slider-item');
const container = document.querySelector('.slider-container');

const state = {
    hide: {
        node: cActiveEls[cActiveEls.length - 1],
    },
    previous: {
        node: cActiveEls[0],
        position: 0,
    },
    current: {
        node: cActiveEls[1],
        position: 1,
    },
    next: {
        node: cActiveEls[2],
        position: 2,
    },
};

const getSliedrElements = (windowWidth) => {
    const hide = state.hide.node.cloneNode(true);
    const previous = state.previous.node.cloneNode(true);
    const current = state.current.node.cloneNode(true);
    const next = state.next.node.cloneNode(true);

    hide.classList.add('hide');
    previous.classList.add('active');
    current.classList.add('active');
    next.classList.add('active');
    
    if (windowWidth >= 1024) {
        container.append(hide, previous, current, next);
    } if (windowWidth >= 768 && windowWidth < 1024) {
        container.append(hide, previous, current);
    } if (windowWidth < 768) {
        container.append(hide, previous);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    getSliedrElements(window.innerWidth);
});

watch(state.previous, 'node', () => {
    animate({
        duration: 1000,
        timing: function(timeFraction) {
          return timeFraction;
        },
        draw: function(progress) {
            container.style.right = '0%';
            container.style.transform = `translateX(${progress * 34}%)`
          if (progress === 1) {
            container.innerHTML = null;
            getSliedrElements(window.innerWidth);
            container.style.right = '34%'
            container.style.transform = -`translateX(${progress * 34}%)`
          }
        }
      });
    // container.innerHTML = null;
    // getSliedrElements(window.innerWidth);
});

window.addEventListener('resize', () => {
    container.innerHTML = null;
    getSliedrElements(window.innerWidth);
});

const nextSlide = ({ target }) => {
    const slides = target.closest('#slider').querySelector('.slider-inner').querySelectorAll('.slider-item');
    const length = slides.length;
    
    if (state.previous.position === 0) {
        state.previous.position = length;
    } if (state.current.position === 0) {
        state.current.position = length;
    } if (state.next.position === 0) {
        state.next.position = length;
    }
    
    state.previous.position -= 1;
    state.current.position -= 1;
    state.next.position -= 1;

    state.hide.node = slides[state.previous.position === 0 ? length - 1 : state.previous.position - 1];
    state.previous.node = slides[state.previous.position];
    state.current.node = slides[state.current.position];
    state.next.node = slides[state.next.position];
};

const prevSlide = ({ target }) => {
    const slides = target.closest('#slider').querySelector('.slider-inner').querySelectorAll('.slider-item');
    const length = slides.length - 1;
    
    if (state.next.position === length) {
        state.next.position = -1;
    } if (state.current.position === length) {
        state.current.position = -1;
    } if (state.previous.position === length) {
        state.previous.position = -1;
    }
    
    state.previous.position += 1;
    state.current.position += 1;
    state.next.position += 1;
    
    state.previous.node = slides[state.previous.position];
    state.current.node = slides[state.current.position];
    state.next.node = slides[state.next.position];
}

nextBtn.addEventListener('click', nextSlide);

prevBtn.addEventListener('click', prevSlide);
