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
        nodePrev: cActiveEls[cActiveEls.length - 1],
        nodeNext: cActiveEls[cActiveEls.length - container.childNodes.length - cActiveEls.length + 1],
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
    event: 'next',
};

const getSlidesBasedOnScreen = {
    parser: (windowWidth, els) => {
        if (windowWidth >= 1024) {
            container.append(els.hidePrev, els.previous, els.current, els.next, els.hideNext);
        } if (windowWidth >= 768 && windowWidth < 1024) {
            container.append(els.hidePrev, els.previous, els.current, els.hideNext);
        } if (windowWidth < 768) {
            container.append(els.hidePrev, els.previous, els.hideNext);
        }
    },
    quantity: (target, containerLength) => {
        const slides = target.closest('#slider').querySelector('.slider-inner').querySelectorAll('.slider-item');
        const length = slides.length;
        console.log(containerLength)
        if (containerLength >= 5) {
            return state.next.position === length - 1 ? 0 : state.next.position + 1
        } if (containerLength === 4) {
            return state.current.position === length - 1 ? 0 : state.current.position + 1
        } if (containerLength === 3) {
            return state.previous.position === length - 1 ? 0 : state.previous.position + 1
        }
    }
};

const getSliedrElements = (windowWidth) => {

    const elements = {
        hidePrev: state.hide.nodePrev.cloneNode(true),
        hideNext: state.hide.nodeNext.cloneNode(true),
        previous: state.previous.node.cloneNode(true),
        current: state.current.node.cloneNode(true),
        next: state.next.node.cloneNode(true),
    };
    
    elements.hidePrev.classList.add('hidePrev');
    elements.hideNext.classList.add('hideNext');
    elements.previous.classList.add('active');
    elements.current.classList.add('active');
    elements.next.classList.add('active');
    
    getSlidesBasedOnScreen.parser(windowWidth, elements);
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
            state.event === 'next' ? container.style.transform = `translateX(${progress * 34}%)` :
                container.style.transform = `translateX(-${progress * 34}%)`
          if (progress === 1) {
            container.innerHTML = null;
            getSliedrElements(window.innerWidth);
            state.event === 'next' ? container.style.right = '34%' : container.style.right = '-34%'
            state.event === 'next' ? container.style.transform = `translateX(${progress * 34}%)` :
                container.style.transform = `translateX(-${progress * 34}%)`
          }
        }
      });
});

window.addEventListener('resize', () => {
    container.innerHTML = null;
    getSliedrElements(window.innerWidth, state.event);
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

    state.event = 'next';
    state.previous.position -= 1;
    state.current.position -= 1;
    state.next.position -= 1;

    state.hide.nodePrev = slides[state.previous.position === 0 ? length - 1 : state.previous.position - 1];
    state.hide.nodeNext = slides[getSlidesBasedOnScreen.quantity(target, container.childNodes.length)]
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

    state.event = 'prev';
    state.previous.position += 1;
    state.current.position += 1;
    state.next.position += 1;
    
    state.hide.nodePrev = slides[state.previous.position === 0 ? length - 1 : state.previous.position - 1];
    state.hide.nodeNext = slides[getSlidesBasedOnScreen.quantity(target, container.childNodes.length)];
    state.previous.node = slides[state.previous.position];
    state.current.node = slides[state.current.position];
    state.next.node = slides[state.next.position];
}

nextBtn.addEventListener('click', nextSlide);

prevBtn.addEventListener('click', prevSlide);
