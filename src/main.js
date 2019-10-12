/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-unresolved */
/* eslint-disable prefer-destructuring */
/* eslint-disable max-len */
/* eslint-disable no-undef */
import './styles/main.sass';
import './img/1.jpg';
import './img/2.jpg';
import './img/3.jpg';
import './img/5.jpg';
import './img/6.jpg';
import './img/7.jpg';
import './img/8.jpg';
import './img/9.jpg';
import './svg/left-arrow.svg';
import './svg/right-arrow.svg';
import 'index.html';
import WatchJS from 'melanke-watchjs';
import animate from './animate';

const { watch } = WatchJS;
const nextBtn = document.querySelector('a[data-slide="next"]');
const prevBtn = document.querySelector('a[data-slide="prev"]');

const cActiveEls = document.querySelector('.slider-inner').querySelectorAll('.slider-item');
const container = document.querySelector('.slider-container');

const getStartPosition = (windowWidth) => {
  if (windowWidth >= 1024) {
    return 3;
  } if (windowWidth >= 768 && windowWidth < 1024) {
    return 2;
  } if (windowWidth < 768) {
    return 1;
  }
};

const state = {
  hide: {
    nodePrev: cActiveEls[cActiveEls.length - 1],
    nodeNext: cActiveEls[getStartPosition(window.innerWidth)],
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
  quantity: (_target, containerLength) => {
    const slides = document.querySelector('.slider-inner').querySelectorAll('.slider-item');
    const { length } = slides;

    if (containerLength >= 5) {
      return state.next.position === length - 1 ? 0 : state.next.position + 1;
    } if (containerLength === 4) {
      return state.current.position === length - 1 ? 0 : state.current.position + 1;
    } if (containerLength === 3) {
      return state.previous.position === length - 1 ? 0 : state.previous.position + 1;
    }
  },
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

document.addEventListener('DOMContentLoaded', () => {
  getSliedrElements(window.innerWidth);
});

watch(state.previous, 'node', () => {
  const itemWidth = document.querySelector('.active').querySelector('.slider-item-img').width;

  const containerLength = document.querySelector('.slider-container').childNodes.length - 2;
  const speed = {
    3: 34,
    2: 50,
    1: 95,
  };

  animate({
    duration: 800,
    timing: (timeFraction) => timeFraction,
    draw: (progress) => {
      container.style.right = '0%';
      if (state.event === 'next') document.querySelector('.hideNext').style.display = 'none';
      if (state.event === 'prev') document.querySelector('.hidePrev').style.display = 'none';
      state.event === 'next' ? container.style.transform = `translateX(${progress * speed[containerLength]}%)`
        : container.style.transform = `translateX(-${progress * speed[containerLength]}%)`;
      document.querySelector('.hideNext').style.width = `${itemWidth}px`;
      document.querySelector('.hidePrev').style.width = `${itemWidth}px`;
      if (progress === 1) {
        container.innerHTML = null;
        getSliedrElements(window.innerWidth);
        state.event === 'next' ? container.style.right = `${speed[containerLength]}%` : container.style.right = `-${speed[containerLength]}%`;
        state.event === 'next' ? container.style.transform = `translateX(${progress * speed[containerLength]}%)`
          : container.style.transform = `translateX(-${progress * speed[containerLength]}%)`;
      }
    },
  });
});

window.addEventListener('resize', () => {
  container.innerHTML = null;
  getSliedrElements(window.innerWidth, state.event);
});

const nextSlide = ({ target }) => {
  const slides = document.querySelector('.slider-inner').querySelectorAll('.slider-item');
  const { length } = slides;

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
  state.hide.nodeNext = slides[getSlidesBasedOnScreen.quantity(target, container.childNodes.length)];
  state.previous.node = slides[state.previous.position];
  state.current.node = slides[state.current.position];
  state.next.node = slides[state.next.position];
};

const prevSlide = ({ target }) => {
  const slides = document.querySelector('.slider-inner').querySelectorAll('.slider-item');
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
};

nextBtn.addEventListener('click', nextSlide);

prevBtn.addEventListener('click', prevSlide);

let initialPoint;
let finalPoint;

document.addEventListener('touchstart', (event) => {
  initialPoint = event.changedTouches[0];
}, false);

document.addEventListener('touchend', (event) => {
  finalPoint = event.changedTouches[0];
  const xAbs = Math.abs(initialPoint.pageX - finalPoint.pageX);
  const yAbs = Math.abs(initialPoint.pageY - finalPoint.pageY);
  if (xAbs > 20 || yAbs > 20) {
    if (xAbs > yAbs) {
      if (finalPoint.pageX < initialPoint.pageX) {
        prevSlide(prevBtn);
      } else {
        nextSlide(nextBtn);
      }
    }
  }
}, false);
